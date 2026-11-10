/* FluxHelper Pages Function — GET/POST /api/authcb
   Канал відповіді браузерного входу (auth.html → застосунок) у Cloudflare D1
   (таблиця auth_cb). Заміна Firebase update/auth_cb/<state>. Токени вирізаємо. */
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

// Simple in-memory rate limiter (per-instance, resets on deploy)
const rateLimitMap = new Map();
function checkRateLimit(key, max = 20, windowMs = 60000) {
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
    const st = String(url.searchParams.get('state') || '');
    if (!/^[A-Za-z0-9_-]{10,64}$/.test(st)) {
      const origin = request.headers.get('Origin') || '';
      return new Response(JSON.stringify({ ok: false, code: 'BAD_STATE' }), { status: 400, headers: { ...JSON_HEADERS, ...corsHeaders(origin) } });
    }

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(`authcb_get:${ip}:${st}`)) {
      const origin = request.headers.get('Origin') || '';
      return new Response(JSON.stringify({ ok: false, code: 'RATE_LIMITED' }), { status: 429, headers: { ...JSON_HEADERS, ...corsHeaders(origin) } });
    }

    const origin = request.headers.get('Origin') || '';
    const h = { ...JSON_HEADERS, ...corsHeaders(origin) };

    if (env && env.DB) {
      const r0 = await env.DB.prepare('SELECT pl FROM auth_cb WHERE state=?').bind(st).first();
      let d = null;
      if (r0 && r0.pl) { try { d = JSON.parse(r0.pl); } catch (e) { d = null; } }
      return new Response(JSON.stringify({ ok: true, data: d }), { headers: h });
    }
    const r = await fetch(backendUrl(env, 'authcb?state=' + encodeURIComponent(st)));
    const t = await r.text();
    return new Response(t, { status: r.status, headers: h });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, code: 'UPSTREAM' }), { status: 502, headers: JSON_HEADERS });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const b = await request.json().catch(function () { return null; });
    const st = String((b && b.state) || '');
    if (!/^[A-Za-z0-9_-]{10,64}$/.test(st)) {
      const origin = request.headers.get('Origin') || '';
      return new Response(JSON.stringify({ ok: false, code: 'BAD_STATE' }), { status: 400, headers: { ...JSON_HEADERS, ...corsHeaders(origin) } });
    }
    const data = b && b.data;
    if (!data || typeof data !== 'object' || !data.d || typeof data.d !== 'object') {
      const origin = request.headers.get('Origin') || '';
      return new Response(JSON.stringify({ ok: false, code: 'BAD_DATA' }), { status: 400, headers: { ...JSON_HEADERS, ...corsHeaders(origin) } });
    }
    delete data.d.tok;          // Google-токен ніколи не потрапляє в базу
    delete data.d.access_token;
    if (typeof data.d.sub !== 'string' || data.d.sub.length < 4) {
      const origin = request.headers.get('Origin') || '';
      return new Response(JSON.stringify({ ok: false, code: 'BAD_DATA' }), { status: 400, headers: { ...JSON_HEADERS, ...corsHeaders(origin) } });
    }
    let pl = null;
    try { pl = JSON.stringify(data); } catch (e) { pl = null; }
    if (!pl || pl.length > 4096) {
      const origin = request.headers.get('Origin') || '';
      return new Response(JSON.stringify({ ok: false, code: 'TOO_BIG' }), { status: 400, headers: { ...JSON_HEADERS, ...corsHeaders(origin) } });
    }

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(`authcb_post:${ip}:${st}`, 10, 60000)) {
      const origin = request.headers.get('Origin') || '';
      return new Response(JSON.stringify({ ok: false, code: 'RATE_LIMITED' }), { status: 429, headers: { ...JSON_HEADERS, ...corsHeaders(origin) } });
    }

    const origin = request.headers.get('Origin') || '';
    const h = { ...JSON_HEADERS, ...corsHeaders(origin) };

    if (env && env.DB) {
      await env.DB.prepare('INSERT INTO auth_cb (state, t, pl) VALUES (?,?,?) ON CONFLICT(state) DO UPDATE SET t=excluded.t, pl=excluded.pl')
        .bind(st, Date.now(), pl).run();
      return new Response(JSON.stringify({ ok: true }), { headers: h });
    }
    const r = await fetch(backendUrl(env, 'authcb'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: st, data: data })
    });
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