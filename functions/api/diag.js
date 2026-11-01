/* FluxHelper Pages Function — POST /api/diag
   Діагностичні логи клієнта (коди подій/версія/платформа/перші 8 символів id/
   email — БЕЗ токенів і паролів) у Cloudflare D1 client_log.
   Заміна Firebase update/diag/<id>. */
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' };

function backendUrl(env, path) {
  return (env && env.BACKEND_URL ? String(env.BACKEND_URL) : 'https://fluxhelper-backend.onrender.com') + '/api/' + path;
}

export async function onRequestPost({ env, request }) {
  try {
    const b = await request.json().catch(function () { return null; });
    const rows = (b && Array.isArray(b.rows)) ? b.rows.slice(0, 20) : [];
    if (!rows.length) return new Response(JSON.stringify({ ok: false, code: 'NO_ROWS' }), { status: 400, headers: JSON_HEADERS });

    const vals = [], stmts = [];
    for (const r of rows) {
      if (!r || typeof r !== 'object') continue;
      const ts = parseInt(r.ts, 10) || Date.now();
      const sub = String(r.sub || '').slice(0, 64);
      const ver = String(r.ver || '').slice(0, 32);
      const plat = String(r.plat || '').slice(0, 32);
      const code = String(r.code || '').slice(0, 64);
      let data = '';
      try { data = JSON.stringify(r.data === undefined ? null : r.data).slice(0, 1000); } catch (ed) { data = 'null'; }
      vals.push([ts, sub, ver, plat, code, data]);
    }
    if (!vals.length) return new Response(JSON.stringify({ ok: false, code: 'NO_ROWS' }), { status: 400, headers: JSON_HEADERS });

    if (env && env.DB) {
      for (const v of vals) {
        await env.DB.prepare('INSERT INTO client_log (ts, sub, ver, plat, code, data) VALUES (?,?,?,?,?,?)')
          .bind(v[0], v[1], v[2], v[3], v[4], v[5]).run();
      }
      return new Response(JSON.stringify({ ok: true, n: vals.length }), { headers: JSON_HEADERS });
    }
    const r = await fetch(backendUrl(env, 'diag'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: rows })
    });
    const t = await r.text();
    return new Response(t, { status: r.status, headers: JSON_HEADERS });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, code: 'UPSTREAM' }), { status: 502, headers: JSON_HEADERS });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Max-Age': '600', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
