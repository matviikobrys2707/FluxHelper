/* ============================================================
   FluxHelper — /api/sync (Cloudflare Pages Function)
   Той самий «сервер», що власник хотів на Render — тільки
   без окремого сервера: Functions живуть на тому ж домені.

   Що робить:
     GET  /api/sync?uid=<Firebase UID>&tok=<ID token>
          -> { ok, settings, role, sync, exists }  (знімок із D1 users.settings)
     POST /api/sync  { uid, tok, snapshot, profile? }
          -> запис знімка в D1 users.settings (той самий SQL, що й застосунки)

   Чому це вирішує синхронізацію: ПК і Android-застосунки УСІХ версій
   (починаючи з 2.8.9) пишуть налаштування в D1 users.settings за ключем
   Firebase UID. Раніше сайт не міг читати D1 напряму (CORS/токен) —
   тепер читає/пише той самий рядок, що й застосунки, тож дані спільні
   ПК <-> телефон <-> сайт без оновлення застосунків.

   Безпека: токен Firebase (ID token) перевіряється підписом RS256
   (Google public JWKs кешуються на edge), aud = fluxhelper-1, sub = uid.
   Токенів/секретів у цьому файлі НЕМА — D1 доступна через binding env.DB
   (wrangler.toml), який видно тільки всередині Function.
   ============================================================ */

const PROJECT_ID = 'fluxhelper-1';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const MAX_SNAP = 16384; // 16 КБ на знімок — більше ніж достатньо

const JSONH = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const json = (code, obj) => new Response(JSON.stringify(obj), { status: code, headers: JSONH });

/* ---------- base64url ---------- */
function b64uToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const raw = atob(s);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/* ---------- Google public keys (кешуються на edge на добу) ---------- */
let jwksPromise = null;
function getJwks() {
  if (!jwksPromise) {
    jwksPromise = fetch(JWKS_URL, { cf: { cacheTtl: 86400, cacheEverything: true } })
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return jwksPromise;
}

/* ---------- перевірка Firebase ID token (RS256) ---------- */
async function verifyToken(tok) {
  if (!tok || typeof tok !== 'string' || tok.length < 40 || tok.split('.').length !== 3) return null;
  let head, payload;
  try {
    head = JSON.parse(new TextDecoder().decode(b64uToBytes(tok.split('.')[0])));
    payload = JSON.parse(new TextDecoder().decode(b64uToBytes(tok.split('.')[1])));
  } catch (e) { return null; }
  if (!head || head.alg !== 'RS256' || !head.kid) return null;
  if (!payload || payload.aud !== PROJECT_ID) return null;
  if (payload.iss !== 'https://securetoken.google.com/' + PROJECT_ID) return null;
  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp < now - 60) return null;
  if (!payload.sub) return null;

  const jwks = await getJwks();
  if (!jwks || !jwks.keys || !jwks.keys.length) return null;
  const key = jwks.keys.find(k => k.kid === head.kid);
  if (!key) { jwksPromise = null; return null; }   // ротація ключів — скидаємо кеш
  try {
    const ck = await crypto.subtle.importKey('jwk', key, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const sig = b64uToBytes(tok.split('.')[2]);
    const data = b64uToBytes(tok.split('.')[0] + '.' + tok.split('.')[1]);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', ck, sig, data);
    return ok ? { uid: payload.sub } : null;
  } catch (e) { return null; }
}

/* ---------- SQL (той самий, що в застосунках: syncUp users.settings) ---------- */
const UPSERT = 'INSERT INTO users (user_id, settings, sver, sts, email, name, pic, ts, created) VALUES (?,?,?,?,?,?,?,?,?) ' +
  'ON CONFLICT(user_id) DO UPDATE SET settings=excluded.settings, sver=excluded.sver, sts=excluded.sts, ' +
  'email=excluded.email, name=excluded.name, pic=excluded.pic, ts=excluded.ts';

/* ---------- GET: прочитати знімок + роль ---------- */
export async function onRequestGet({ env, url }) {
  try {
    const uid = url.searchParams.get('uid') || '';
    const tok = url.searchParams.get('tok') || '';
    if (!uid || uid.length > 128) return json(400, { ok: false, error: 'bad uid' });
    const v = await verifyToken(tok);
    if (!v || v.uid !== uid) return json(401, { ok: false, error: 'auth' });
    if (!env || !env.DB) return json(500, { ok: false, error: 'no db binding' });

    const row = await env.DB.prepare('SELECT role, sync, settings, sts FROM users WHERE user_id = ?').bind(uid).first();
    let settings = null;
    if (row && row.settings) {
      try { settings = JSON.parse(row.settings); } catch (e) { settings = null; }
    }
    return json(200, {
      ok: true,
      exists: !!row,
      role: row ? (row.role || 'user') : 'user',
      sync: row ? row.sync !== 0 : true,
      sts: row ? (parseInt(row.sts, 10) || 0) : 0,
      settings: settings
    });
  } catch (e) {
    return json(500, { ok: false, error: 'db' });
  }
}

/* ---------- POST: записати знімок (як syncUp у застосунку) ---------- */
export async function onRequestPost({ env, request }) {
  try {
    let body = null;
    try { body = await request.json(); } catch (e) { return json(400, { ok: false, error: 'bad json' }); }
    if (!body || typeof body !== 'object') return json(400, { ok: false, error: 'bad body' });
    const uid = String(body.uid || '');
    if (!uid || uid.length > 128) return json(400, { ok: false, error: 'bad uid' });
    const v = await verifyToken(String(body.tok || ''));
    if (!v || v.uid !== uid) return json(401, { ok: false, error: 'auth' });
    if (!env || !env.DB) return json(500, { ok: false, error: 'no db binding' });

    const p = body.snapshot;
    if (!p || typeof p !== 'object') return json(400, { ok: false, error: 'bad snapshot' });
    const s = JSON.stringify(p);
    if (s.length > MAX_SNAP) return json(400, { ok: false, error: 'snapshot too big' });
    const t = parseInt(p.t, 10) || Date.now();

    const prof = (body.profile && typeof body.profile === 'object') ? body.profile : {};
    const cut = (x, n) => String(x == null ? '' : x).slice(0, n);
    await env.DB.prepare(UPSERT).bind(
      uid, s, cut(p.v ? 'web-' + p.v : 'web', 32), t,
      cut(prof.email, 190), cut(prof.name, 190), cut(prof.pic, 590), Date.now(), Date.now()
    ).run();

    return json(200, { ok: true, t: t });
  } catch (e) {
    return json(500, { ok: false, error: 'db' });
  }
}
