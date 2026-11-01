/* FluxHelper Pages Function — GET /api/rev?uid=<fid>
   Маркери змін із Cloudflare D1: _meta.webrev + _meta.ev + keys['uev:<uid>'].
   Замінює Firebase-читання update/webrev, update/webev, update/userdev/<uid>. */
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' };

function backendUrl(env, path) {
  return (env && env.BACKEND_URL ? String(env.BACKEND_URL) : 'https://fluxhelper-backend.onrender.com') + '/api/' + path;
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const uid = String(url.searchParams.get('uid') || '');
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
      return new Response(JSON.stringify({ ok: true, rev: rev, ev: ev, uev: uev }), { headers: JSON_HEADERS });
    }
    const r = await fetch(backendUrl(env, 'rev' + (uid ? ('?uid=' + encodeURIComponent(uid)) : '')));
    const t = await r.text();
    return new Response(t, { status: r.status, headers: JSON_HEADERS });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, code: 'UPSTREAM' }), { status: 502, headers: JSON_HEADERS });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Max-Age': '600' } });
}
