/* FluxHelper Pages Function — GET /api/rev53?uid=<fid>
   Маркери змін із Cloudflare D1: _meta.webrev + _meta.ev + keys['uev:<uid>'].
   Замінює Firebase-читання update/webrev, update/webev, update/userdev/<uid>. */
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const ALLOWED_ORIGINS = ['https://fluxhelper.pages.dev', 'https://fluxhelper-backend.onrender.com'];

function backendUrl(env, path) {
  return (env && env.BACKEND_URL ? String(env.BACKEND_URL) : 'https://fluxhelper-backend.onrender.com') + '/api/' + path;
}

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '600',
    'Access-Control-Allow-Credentials': 'true'
  };
}

async function getUserRole(env, uid) {
  if (!uid || !/^[A-Za-z0-9_:.\-]{8,128}$/.test(uid)) return 'user';
  if (env && env.DB) {
    const r = await env.DB.prepare('SELECT role FROM users WHERE user_id=?').bind(uid).first();
    if (r && r.role) return String(r.role);
  }
  return 'user';
}

function isAdminOrDev(role) {
  return role === 'admin' || role === 'developer';
}

// Simple in-memory rate limiter (per-instance, resets on deploy)
const rateLimitMap = new Map();
function checkRateLimit(key, max = 30, windowMs = 60000) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const uid = String(url.searchParams.get('uid') || '');
    const userRole = await getUserRole(env, uid);
    const isPrivileged = isAdminOrDev(userRole);

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(`rev53_get:${ip}:${uid}`)) {
      const origin = request.headers.get('Origin') || '';
      return new Response(JSON.stringify({ ok: false, code: 'RATE_LIMITED' }), { status: 429, headers: { ...JSON_HEADERS, ...corsHeaders(origin) } });
    }

    const origin = request.headers.get('Origin') || '';
    const h = { ...JSON_HEADERS, ...corsHeaders(origin) };

    if (env && env.DB) {
      let rev = 0, ev = null;
      const rows = await env.DB.prepare("SELECT key, val FROM _meta WHERE key IN ('webrev','ev')").all();
      for (const r of (rows.results || [])) {
        if (r.key === 'webrev') rev = parseInt(r.val, 10) || 0;
        else if (r.key === 'ev') {
          try { const e = JSON.parse(r.val); if (e && e.n) ev = { n: e.n, t: String(e.t || ''), u: String(e.u || '') }; } catch (er) {}
        }
      }
      let uev = null;
      if (uid && /^[A-Za-z0-9_:.\-]{8,128}$/.test(uid)) {
        const kr = await env.DB.prepare('SELECT v FROM keys WHERE k=?').bind('uev:' + uid).first();
        try { const kj = kr && kr.v ? JSON.parse(kr.v) : null; if (kj && kj.n) uev = { n: kj.n, t: String(kj.t || '') }; } catch (ek) {}
      }
      return new Response(JSON.stringify({ ok: true, rev: rev, ev: ev, uev: uev, betaAllowed: isPrivileged }), { headers: h });
    }
    const r = await fetch(backendUrl(env, 'rev53' + (uid ? ('?uid=' + encodeURIComponent(uid)) : '')));
    const t = await r.text();
    return new Response(t, { status: r.status, headers: h });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, code: 'UPSTREAM' }), { status: 502, headers: JSON_HEADERS });
  }
}

export async function onRequestOptions({ request }) {
  const origin = request.headers.get('Origin') || '';
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}