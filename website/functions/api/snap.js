/* FluxHelper Pages Function — GET /api/snap
   3.5.53: база — ЛИШЕ Cloudflare D1 (правило власника: Firebase для бази
   заборонено). Якщо до Pages прив'язано D1 (binding DB) — читаємо напряму;
   інакше проксі на FluxHelper Backend (Render → D1). */
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
    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(`snap_get:${ip}`)) {
      const origin = request.headers.get('Origin') || '';
      return new Response(JSON.stringify({ ok: false, code: 'RATE_LIMITED' }), { status: 429, headers: { ...JSON_HEADERS, ...corsHeaders(origin) } });
    }

    const origin = request.headers.get('Origin') || '';
    const h = { ...JSON_HEADERS, ...corsHeaders(origin) };

    if (env && env.DB) {
      const r = await env.DB.prepare('SELECT json FROM v_snap_full').first();
      const j = r && r.json;
      if (!j) return new Response(JSON.stringify({ ok: false, code: 'NO_SNAP' }), { status: 502, headers: h });
      const obj = JSON.parse(j);
      return new Response(JSON.stringify({
        ok: true, schedule: obj.schedule || {}, subjects: obj.subjects || {},
        teachers: obj.teachers || {}, weeks: obj.weeks || {}
      }), { headers: h });
    }
    const r = await fetch(backendUrl(env, 'snap'));
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