/* FluxHelper Pages Function — GET /api/snap
   3.5.53: база — ЛИШЕ Cloudflare D1 (правило власника: Firebase для бази
   заборонено). Якщо до Pages прив'язано D1 (binding DB) — читаємо напряму;
   інакше проксі на FluxHelper Backend (Render → D1). */
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' };

function backendUrl(env, path) {
  return (env && env.BACKEND_URL ? String(env.BACKEND_URL) : 'https://fluxhelper-backend.onrender.com') + '/api/' + path;
}

export async function onRequestGet({ env }) {
  try {
    if (env && env.DB) {
      const r = await env.DB.prepare('SELECT json FROM v_snap_full').first();
      const j = r && r.json;
      if (!j) return new Response(JSON.stringify({ ok: false, code: 'NO_SNAP' }), { status: 502, headers: JSON_HEADERS });
      const obj = JSON.parse(j);
      return new Response(JSON.stringify({
        ok: true, schedule: obj.schedule || {}, subjects: obj.subjects || {},
        teachers: obj.teachers || {}, weeks: obj.weeks || {}
      }), { headers: JSON_HEADERS });
    }
    const r = await fetch(backendUrl(env, 'snap'));
    const t = await r.text();
    return new Response(t, { status: r.status, headers: JSON_HEADERS });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, code: 'UPSTREAM' }), { status: 502, headers: JSON_HEADERS });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Max-Age': '600' } });
}
