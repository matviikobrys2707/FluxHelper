/**
 * FluxHelper /api/* — Pages Function (релей бази + Firebase).
 *
 * 3.5.40: ПОВНІСТЮ заміняє Render-бекенд (fluxhelper-backend.onrender.com).
 * Причина: у Render free — ліміт ~5 ГБ трафіка/місяць, клієнти вибрали 1.2 ГБ
 * за півмісяця (ревізії кожні 5-8 с + знімки + налаштування). Тепер усе йде
 * сюди: Cloudflare Pages — без лімітів трафіка, D1 прив'язаний БИНДИНГОМ
 * (жодних токенів у коді немає — id бази і так публічний, він живе в клієнтах).
 *
 * Секретів у файлі НЕМА: FB_KEY — це ПУБЛІЧНИЙ Firebase Web API key (він і так
 * вшитий у кожен APK/сайт Firebase-застосунку, у FluxHelper лежить у dex).
 * RTDB URL теж публічний (див. auth.html).
 *
 * КОНТРАКТИ 1-в-1 як у Render-бекенда 1.5.0:
 *   GET  /api/rev                 -> {ok, rev, upd}
 *   GET  /api/pub?path=all|X      -> {ok, data}
 *   POST /api/sts {uid}           -> {ok, sts, known}
 *   POST /api/auth/google {token} -> {ok, localId, idToken, refreshToken, expiresIn}
 *   POST /api/auth/refresh {refresh_token} -> {ok, idToken, refreshToken, expiresIn}
 *   POST /api/rtdb {op,path,data} (Bearer idToken) -> {ok, data?}
 *   POST /api/sync {op:get|put, snapshot?, profile?} (Bearer) -> {ok, role?, sync?, settings?, sts?}
 *   POST /api/auth-cb-relay {state, data} -> {ok}
 */

const FB_KEY = 'AIzaSyCDWpF3QTMEFBN9ravDxH_woKnBpcMRDvI';   /* публічний Firebase Web API key */
const RTDB = 'https://fluxhelper-1-default-rtdb.europe-west1.firebasedatabase.app';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Max-Age': '86400'
};

function res(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, CORS)
  });
}

function jwtUid(auth) {
  try {
    const p = String(auth || '').replace(/^Bearer\s+/i, '').split('.');
    if (p.length < 2) return null;
    let s = p[1].replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const j = JSON.parse(atob(s));
    if (!j || !j.sub) return null;
    if (j.exp && j.exp * 1000 < Date.now() - 3600000) return null;
    return { uid: String(j.sub) };
  } catch (e) { return null; }
}

async function handle(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  /* ---------- ревізії (мікро-відповідь для полінгу) ---------- */
  if (path === '/api/rev') {
    const r = await env.DB.prepare("SELECT key, json_extract(val,'$.rev') AS rev FROM _meta WHERE key IN ('snap','upd')").all();
    let rev = null, upd = null;
    for (const row of (r.results || [])) {
      if (row.key === 'snap') rev = (row.rev === null || row.rev === undefined) ? null : parseInt(row.rev, 10);
      if (row.key === 'upd') upd = (row.rev === null || row.rev === undefined) ? null : parseInt(row.rev, 10);
    }
    if (rev === null) return res({ ok: false });
    return res({ ok: true, rev: rev, upd: upd });
  }

  /* ---------- знімок розкладу ---------- */
  if (path === '/api/pub') {
    const p = url.searchParams.get('path') || 'all';
    const r = await env.DB.prepare('SELECT json FROM v_snap_full LIMIT 1').all();
    const raw = r.results && r.results[0] && r.results[0].json;
    if (!raw) return res({ ok: false, error: 'empty' });
    const j = JSON.parse(raw);
    if (p === 'all') return res({ ok: true, data: j });
    if (Object.prototype.hasOwnProperty.call(j, p)) return res({ ok: true, data: j[p] });
    return res({ ok: false, error: 'path' });
  }

  /* ---------- мітка налаштувань акаунта ---------- */
  if (path === '/api/sts' && request.method === 'POST') {
    const b = await request.json().catch(function () { return null; });
    const uid = (b && b.uid) ? String(b.uid) : '';
    if (!uid) return res({ ok: false });
    const r = await env.DB.prepare('SELECT sts FROM users WHERE user_id = ?').bind(uid).all();
    const row = r.results && r.results[0];
    if (!row) return res({ ok: true, known: false });
    return res({ ok: true, known: true, sts: (row.sts === null || row.sts === undefined) ? 0 : parseInt(row.sts, 10) });
  }

  /* ---------- Google -> Firebase (реєстрація входу) ---------- */
  if (path === '/api/auth/google' && request.method === 'POST') {
    const b = await request.json().catch(function () { return null; });
    const tk = (b && b.token) ? String(b.token) : '';
    if (!tk) return res({ ok: false, error: 'token' });
    const fr = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=' + encodeURIComponent(FB_KEY), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postBody: 'id_token=' + encodeURIComponent(tk) + '&providerId=google.com', requestUri: 'http://localhost', returnSecureToken: true })
    });
    const j = await fr.json().catch(function () { return null; });
    if (!j || !j.localId || !j.idToken) return res({ ok: false, error: (j && j.error && j.error.message) || 'upstream' });
    return res({ ok: true, localId: String(j.localId), idToken: String(j.idToken), refreshToken: String(j.refreshToken || ''), expiresIn: String(j.expiresIn || '3600') });
  }

  /* ---------- оновлення Firebase-токена ---------- */
  if (path === '/api/auth/refresh' && request.method === 'POST') {
    const b = await request.json().catch(function () { return null; });
    const rt = (b && (b.refresh_token || b.rtok)) ? String(b.refresh_token || b.rtok) : '';
    if (!rt) return res({ ok: false, error: 'rt' });
    const fr = await fetch('https://securetoken.googleapis.com/v1/token?key=' + encodeURIComponent(FB_KEY), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: rt })
    });
    const j = await fr.json().catch(function () { return null; });
    if (!j || !j.id_token) return res({ ok: false, error: (j && j.error && j.error.message) || 'upstream' });
    return res({ ok: true, idToken: String(j.id_token), refreshToken: String(j.refresh_token || rt), expiresIn: String(j.expires_in || '3600') });
  }

  /* ---------- Firebase RTDB проксі (сайт) ---------- */
  if (path === '/api/rtdb' && request.method === 'POST') {
    const tok = String(request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    if (!tok) return res({ ok: false, error: 'auth' });
    const b = await request.json().catch(function () { return null; });
    const op = (b && b.op) ? String(b.op) : '';
    let p = (b && b.path) ? String(b.path) : '';
    if (!/^(get|put|patch|delete)$/.test(op) || !p) return res({ ok: false, error: 'args' });
    p = p.replace(/\.json(\?.*)?$/, '').replace(/^\/+/, '');
    if (!/^[A-Za-z0-9_\-\/.:()%$@,;!'~*&+= ]*$/.test(p)) return res({ ok: false, error: 'path' });
    const u = RTDB + '/' + p.split('/').map(encodeURIComponent).join('/') + '.json?auth=' + encodeURIComponent(tok);
    const init = { method: op.toUpperCase(), headers: { 'Content-Type': 'application/json' } };
    if (op === 'put' || op === 'patch') init.body = JSON.stringify(b.data === undefined ? null : b.data);
    const fr = await fetch(u, init);
    const txt = await fr.text();
    let data = null;
    try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = null; }
    if (!fr.ok) return res({ ok: false, error: 'rtdb' });
    return res({ ok: true, data: data });
  }

  /* ---------- рядок акаунта для сайту (D1 через функцію) ---------- */
  if (path === '/api/sync' && request.method === 'POST') {
    const who = jwtUid(request.headers.get('Authorization') || '');
    if (!who) return res({ ok: false, error: 'auth' });
    const b = await request.json().catch(function () { return null; });
    const op = (b && b.op) ? String(b.op) : '';
    if (op === 'get') {
      const r = await env.DB.prepare('SELECT role, sync, settings, sts FROM users WHERE user_id = ?').bind(who.uid).all();
      const row = r.results && r.results[0];
      if (!row) return res({ ok: true, role: 'user', sync: 1, settings: null, sts: 0 });
      let set = null;
      try { set = row.settings ? JSON.parse(row.settings) : null; } catch (e) { set = null; }
      return res({ ok: true, role: String(row.role || 'user'), sync: (row.sync === 0 || row.sync === '0') ? 0 : 1, settings: set, sts: parseInt(row.sts, 10) || 0 });
    }
    if (op === 'put') {
      const snap = (b && b.snapshot && typeof b.snapshot === 'object') ? b.snapshot : null;
      if (!snap) return res({ ok: false, error: 'snap' });
      const now = Date.now();
      const setStr = JSON.stringify(snap);
      const sts = parseInt(snap.t, 10) || now;
      const sver = String(snap.v || '');
      const sync = (snap.sync === 0) ? 0 : 1;
      const prof = (b.profile && typeof b.profile === 'object') ? b.profile : null;
      const upd = await env.DB.prepare(
        'UPDATE users SET settings = ?2, sts = ?3, sver = ?4, sync = ?5, ts = ?6, ' +
        'name = COALESCE(?7, name), email = COALESCE(?8, email), pic = COALESCE(?9, pic) ' +
        'WHERE user_id = ?1'
      ).bind(who.uid, setStr, sts, sver, sync, now,
             (prof && prof.name) ? String(prof.name) : null,
             (prof && prof.email) ? String(prof.email) : null,
             (prof && prof.pic) ? String(prof.pic) : null).run();
      if (!upd.success) return res({ ok: false, error: 'db' });
      if (upd.meta && upd.meta.changes === 0) {
        const ins = await env.DB.prepare(
          'INSERT INTO users (user_id, name, email, pic, ts, logins, created, settings, sver, sts) VALUES (?1,?2,?3,?4,?6,1,?6,?5,?7,?3) ' +
          'ON CONFLICT(user_id) DO UPDATE SET settings=excluded.settings, sts=excluded.sts, sver=excluded.sver, ts=excluded.ts'
        ).bind(who.uid,
               (prof && prof.name) ? String(prof.name) : '',
               (prof && prof.email) ? String(prof.email) : '',
               (prof && prof.pic) ? String(prof.pic) : '',
               setStr, now, sver, sts).run();
        if (!ins.success) return res({ ok: false, error: 'db' });
      }
      return res({ ok: true });
    }
    return res({ ok: false, error: 'op' });
  }

  /* ---------- канал входу: профіль -> Firebase auth_cb/<state> ---------- */
  if (path === '/api/auth-cb-relay' && request.method === 'POST') {
    const b = await request.json().catch(function () { return null; });
    const st = (b && b.state) ? String(b.state) : '';
    if (!st || !/^[A-Za-z0-9]{4,64}$/.test(st)) return res({ ok: false, error: 'state' });
    const fr = await fetch(RTDB + '/update/auth_cb/' + encodeURIComponent(st) + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(b.data === undefined ? null : b.data)
    });
    return res({ ok: fr.ok });
  }

  return res({ ok: false, error: 'nf' }, 404);
}

export async function onRequestOptions() { return new Response(null, { status: 204, headers: CORS }); }
export async function onRequestGet(ctx) { return handle(ctx.request, ctx.env); }
export async function onRequestPost(ctx) { return handle(ctx.request, ctx.env); }
