/**
 * FluxHelper Auth Bridge — Cloudflare Worker (безкоштовний план)
 * =============================================================
 * Міст авторизації Google для мобільного FluxHelper.
 *
 * Як це працює:
 *   1. Застосунок відкриває в ЗОВНІШНЬОМУ браузері  https://<цей-worker>/login
 *   2. Worker генерує PKCE (code_verifier + S256 challenge) і кидає state
 *      в HttpOnly-cookie, потім redirects на Google.
 *   3. Google повертає код на  https://<цей-worker>/callback  (це єдиний
 *      Authorized redirect URI у Google Cloud Console — тип «Веб-застосунок»).
 *   4. Worker міняє код на токени САМ (client_secret лежить тут, у змінній
 *      середовища — у застосунку його більше нема потреби тримати).
 *   5. Worker шифрує токени (AES-256-GCM) в одноразовий код виду
 *      "FH1.<iv>.<ciphertext>" і робить сторінку, яка повертає назад
 *      у застосунок:  com.googleusercontent.apps.<ANDROID_CLIENT_ID>:/oauth2redirect?code=FH1...
 *      (цей intent-filter УЖЕ є в AndroidManifest.xml FluxHelper).
 *   6. Застосунок надсилає цей код на  POST /token  — отримує відповідь
 *      У ТОМУ Ж форматі, що Google token endpoint, тому решта коду
 *      застосунку не змінюється.
 *
 * ЗМІННІ СЕРЕДОВИЩА (Cloudflare Dashboard → Worker → Settings → Variables):
 *   GOOGLE_CLIENT_ID      — Client ID веб-застосунку (тип «Веб-застосунок»)
 *   GOOGLE_CLIENT_SECRET  — Client secret того ж клієнту
 *   FH_SCHEME (опційно)   — схема повернення в застосунок; за замовчуванням
 *                           com.googleusercontent.apps.668834523935-14h6abj7232pjnr1imhcdvihm3nthfv2
 *
 * Ключ шифрування OTP виводиться з GOOGLE_CLIENT_SECRET — окрему змінну
 * задавати не треба. Ротація секрету = старі OTP самі стають недійсними.
 */

const APP_NAME = 'FluxHelper';
const DEFAULT_SCHEME = 'com.googleusercontent.apps.668834523935-14h6abj7232pjnr1imhcdvihm3nthfv2';
const OTP_TTL_MS = 10 * 60 * 1000;          // одноразовий код живе 10 хвилин
const STATE_TTL_S = 600;                     // cookie state живе 10 хвилин
const SCOPE = 'openid email profile';

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const method = request.method;

      if (method === 'OPTIONS') return cors(new Response(null, { status: 204 }));

      const envErr = checkEnv(env);
      if (envErr) return page(400, 'Помилка налаштування', envErr);

      let resp;
      if (url.pathname === '/login' && method === 'GET')        resp = await handleLogin(request, env, url);
      else if (url.pathname === '/callback' && method === 'GET') resp = await handleCallback(request, env, url);
      else if (url.pathname === '/token' && method === 'POST')   resp = await handleToken(request, env);
      else if (url.pathname === '/' && (method === 'GET' || method === 'HEAD')) resp = page(200, 'FluxHelper Auth Bridge', rootBody(env));
      else resp = page(404, 'Не знайдено', 'Цей маршрут не існує. Потрібні /login, /callback, /token.');
      return resp;
    } catch (e) {
      return page(500, 'Внутрішня помилка', 'Спробуй ще раз за хвилину. (' + esc(String(e && e.message || e)) + ')');
    }
  }
};

/* ---------------- /login ---------------- */

async function handleLogin(request, env, url) {
  const state = randB64(24);
  const verifier = randB64(48);
  const challenge = b64url(await sha256(verifier));

  // PKCE verifier живе разом із state (10 хв). Захист від безмежного зростання:
  VERIFIERS.set(state, verifier);
  if (VERIFIERS.size > 1000) VERIFIERS.clear();

  const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  auth.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
  auth.searchParams.set('redirect_uri', new URL(request.url).origin + '/callback');
  auth.searchParams.set('response_type', 'code');
  auth.searchParams.set('scope', SCOPE);
  auth.searchParams.set('state', state);
  auth.searchParams.set('code_challenge', challenge);
  auth.searchParams.set('code_challenge_method', 'S256');
  auth.searchParams.set('access_type', 'offline');        // щоб отримати refresh_token
  auth.searchParams.set('prompt', 'select_account');

  const headers = new Headers({ 'Location': auth.toString() });
  headers.append('Set-Cookie',
    'fho=' + state + '; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=' + STATE_TTL_S);
  return new Response(null, { status: 302, headers });
}

/* ---------------- /callback ---------------- */

async function handleCallback(request, env, url) {
  const scheme = (env.FH_SCHEME && env.FH_SCHEME.trim()) || DEFAULT_SCHEME;
  const back = scheme + ':/oauth2redirect';

  const cookieState = (cookie(request, 'fho') || '').trim();
  const qState = (url.searchParams.get('state') || '').trim();
  const qError = url.searchParams.get('error');
  const qCode = url.searchParams.get('code');

  if (!cookieState || !qState || cookieState !== qState) {
    return page(400, 'Застаріле посилання', 'Спробуй увійти ще раз із застосунку (state не збігається).');
  }

  if (qError) {
    return backPage(back + '?error=' + encodeURIComponent(qError),
      'Вхід не завершено', 'Google повідомив: ' + esc(qError) + '. Можеш закрити цю вкладинку і спробувати ще раз у застосунку.');
  }
  if (!qCode || qCode.length < 8) {
    return page(400, 'Код не отримано', 'Спробуй ще раз із застосунку.');
  }

  // міняємо код на токени — СЕКРЕТ лишается тут, на сервері
  const tokBody = new URLSearchParams({
    code: qCode,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: new URL(request.url).origin + '/callback',
    grant_type: 'authorization_code',
    code_verifier: await verifierFromState(request, url)
  });
  const tr = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokBody.toString()
  });
  const tok = await tr.json();
  if (!tr.ok || !tok.access_token) {
    const m = esc(String(tok.error || 'token_error')) + (tok.error_description ? ' — ' + esc(String(tok.error_description)) : '');
    return page(502, 'Google відмовив в обміні', 'Деталі: ' + m + '. Спробуй увійти ще раз.');
  }

  const payload = { at: tok.access_token, exp: Date.now() + OTP_TTL_MS, v: 1 };
  if (tok.refresh_token) payload.rt = tok.refresh_token;
  if (tok.id_token) payload.idt = tok.id_token;

  let otp;
  try { otp = await sealOtp(payload, env); }
  catch (e) { return page(500, 'Помилка шифрування', String(e && e.message || e)); }

  return backPage(back + '?code=' + encodeURIComponent(otp),
    'Вхід завершено', 'Повертаємо тебе у ' + APP_NAME + '… Якщо застосунок не відкрився сам — натисни кнопку нижче.');
}

// code_verifier зберігаємо НЕ в cookie (він великий), а прив'язуємо до state:
// тримаємо map у кеші воркера (вистачає на час логіну; після деплою/cold start
// користувач просто входить ще раз — це норм для 10-хвилинного вікна).
const VERIFIERS = new Map();   // state -> code_verifier (живе в межах isolate, ~10 хв)
const USED_OTP = new Map();    // використані одноразові коди (захист від повторного обміну)
async function verifierFromState(request, url) {
  const s = (url.searchParams.get('state') || '').trim();
  const v = VERIFIERS.get(s) || '';
  if (v) VERIFIERS.delete(s);   // одноразовий
  return v;
}

/* ---------------- /token ---------------- */

async function handleToken(request, env) {
  const form = await request.formData();
  const grant = String(form.get('grant_type') || '');
  const code = String(form.get('code') || '');
  const rt = String(form.get('refresh_token') || '');

  // A) обмін одноразового коду мосту -> токени (формат відповіді = як у Google)
  if (grant === 'authorization_code' && code.indexOf('FH1.') === 0) {
    if (USED_OTP.has(code)) {
      return json({ error: 'invalid_grant', error_description: 'код вже використано — увійди ще раз' }, 400);
    }
    const p = await openOtp(code, env);
    if (!p || !p.at || (Date.now() > p.exp)) {
      return json({ error: 'invalid_grant', error_description: 'код недійсний або протермінований — увійди ще раз' }, 400);
    }
    USED_OTP.set(code, Date.now());   // одноразовість (в межах isolate; найкраще зусилля)
    if (USED_OTP.size > 2000) USED_OTP.clear();
    const out = {
      access_token: p.at,
      expires_in: 3599,
      token_type: 'Bearer',
      scope: SCOPE
    };
    if (p.rt) out.refresh_token = p.rt;
    if (p.idt) out.id_token = p.idt;
    return json(out, 200);
  }

  // B) тихе оновлення через refresh_token (секрет знову ж тут)
  if (grant === 'refresh_token' && rt) {
    const rr = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        refresh_token: rt,
        grant_type: 'refresh_token'
      }).toString()
    });
    const t = await rr.json();
    if (!rr.ok || !t.access_token) {
      return json({ error: String(t.error || 'invalid_grant'), error_description: String(t.error_description || '') }, 400);
    }
    const out = { access_token: t.access_token, expires_in: t.expires_in || 3599, token_type: 'Bearer', scope: t.scope || SCOPE };
    if (t.refresh_token) out.refresh_token = t.refresh_token;   // Google повертає не завжди
    if (t.id_token) out.id_token = t.id_token;
    return json(out, 200);
  }

  return json({ error: 'unsupported_grant_type' }, 400);
}

/* ---------------- crypto ---------------- */

function otpKey(env) {
  // ключ виводимо з секрету — додаткова змінна не потрібна
  return sha256(String(env.GOOGLE_CLIENT_SECRET) + '|fh-otp-v1');
}
async function sealOtp(payload, env) {
  const raw = new TextEncoder().encode(JSON.stringify(payload));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey('raw', await otpKey(env), 'AES-GCM', false, ['encrypt']);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, raw);
  return 'FH1.' + b64url(iv) + '.' + b64url(ct);
}
async function openOtp(otp, env) {
  try {
    const parts = otp.split('.');
    if (parts.length !== 3 || parts[0] !== 'FH1') return null;
    const iv = unb64url(parts[1]);
    const ct = unb64url(parts[2]);
    const key = await crypto.subtle.importKey('raw', await otpKey(env), 'AES-GCM', false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(pt));
  } catch (e) { return null; }
}

/* ---------------- helpers ---------------- */

function checkEnv(env) {
  if (!env || !env.GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID.indexOf('.apps.googleusercontent.com') < 0)
    return 'Не задано змінну GOOGLE_CLIENT_ID (Client ID типу «Веб-застосунок»).';
  if (!env.GOOGLE_CLIENT_SECRET || env.GOOGLE_CLIENT_SECRET.length < 10)
    return 'Не задано змінну GOOGLE_CLIENT_SECRET (Client secret того ж клієнту).';
  return '';
}

function rootBody(env) {
  return 'Це міст авторизації Google для ' + APP_NAME + '.<br>' +
    'Клієнт: <code>' + esc(String(env.GOOGLE_CLIENT_ID).slice(0, 14)) + '…</code><br><br>' +
    'Маршрути: <code>/login</code> (старт входу), <code>/callback</code> (повернення з Google), ' +
    '<code>/token</code> (обмін коду / refresh).';
}

function backPage(backUrl, title, note) {
  // спершу тихо (replace), потім кнопка-фолбек для браузерів, які блокують автопереходи
  return new Response(
'<!doctype html><html lang="uk"><head><meta charset="utf-8">' +
'<meta name="viewport" content="width=device-width,initial-scale=1">' +
'<title>' + esc(title) + '</title>' +
'<style>body{font-family:system-ui,sans-serif;background:#0b0b14;color:#f4f4f8;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}div{max-width:420px;padding:28px;text-align:center}h1{font-size:19px;margin:0 0 10px}p{color:#9aa0b4;font-size:14px;line-height:1.5}a,button{display:inline-block;margin-top:18px;padding:11px 22px;border-radius:12px;border:0;background:#6d5df6;color:#fff;font-size:15px;text-decoration:none;cursor:pointer}</style>' +
'</head><body><div><h1>' + esc(title) + '</h1><p>' + note + '</p>' +
'<a id="go" href="' + esc(backUrl) + '">Повернутися у ' + APP_NAME + '</a>' +
'<script>(function(){var u=document.getElementById("go").href;try{location.replace(u);}catch(e){}setTimeout(function(){try{location.href=u;}catch(e){}},400);})();</scr' + 'ipt>' +
'</div></body></html>',
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

function page(status, title, body) {
  return new Response(
'<!doctype html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
'<title>' + esc(title) + '</title>' +
'<style>body{font-family:system-ui,sans-serif;background:#0b0b14;color:#f4f4f8;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}div{max-width:480px;padding:28px;text-align:center}h1{font-size:19px;margin:0 0 10px}p{color:#9aa0b4;font-size:14px;line-height:1.55}code{background:#181828;padding:2px 6px;border-radius:6px;font-size:12px}</style>' +
'</head><body><div><h1>' + esc(title) + '</h1><p>' + body + '</p></div></body></html>',
    { status: status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'      // застосунок ходить сюди з file:// (Origin: null)
    }
  });
}

function cors(resp) {
  const h = new Headers(resp.headers);
  h.set('Access-Control-Allow-Origin', '*');
  h.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type');
  h.set('Access-Control-Max-Age', '86400');
  return new Response(null, { status: resp.status, headers: h });
}

function cookie(request, name) {
  const c = request.headers.get('Cookie') || '';
  const m = c.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : '';
}

async function sha256(s) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return new Uint8Array(d);
}

function b64url(u8) {
  if (u8 instanceof ArrayBuffer) u8 = new Uint8Array(u8);   // crypto.subtle.* повертає ArrayBuffer
  let s = '';
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unb64url(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

function randB64(n) {
  const u8 = crypto.getRandomValues(new Uint8Array(n));
  return b64url(u8);
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
