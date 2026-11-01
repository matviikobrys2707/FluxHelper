/* FluxHelper Pages Function — GET/POST /api/data
   Рядок users у Cloudflare D1: GET ?uid= → {ok,row:{role,sync,settings,sts}};
   POST {uid, snap, profile} → upsert знімка. Заміна RTDB-дзеркал
   update/web/<fid>, update/settings_mirror/<uid> і Render /api/sync. */
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' };

function backendUrl(env, path) {
  return (env && env.BACKEND_URL ? String(env.BACKEND_URL) : 'https://fluxhelper-backend.onrender.com') + '/api/' + path;
}
function okUid(u) { return typeof u === 'string' && /^[A-Za-z0-9_:.\-]{8,128}$/.test(u); }
function snapOk(p) { return !!(p && typeof p === 'object' && (p.g || p.n || p.th || p.z)); }

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const uid = String(url.searchParams.get('uid') || '');
    if (!okUid(uid)) return new Response(JSON.stringify({ ok: false, code: 'BAD_UID' }), { status: 400, headers: JSON_HEADERS });
    if (env && env.DB) {
      const r0 = await env.DB.prepare('SELECT role, sync, settings, sts FROM users WHERE user_id=?').bind(uid).first();
      if (!r0) return new Response(JSON.stringify({ ok: true, row: null }), { headers: JSON_HEADERS });
      return new Response(JSON.stringify({
        ok: true,
        row: {
          role: String(r0.role || 'user'),
          sync: (r0.sync === 0 || r0.sync === '0') ? 0 : 1,
          settings: String(r0.settings || ''),
          sts: parseInt(r0.sts, 10) || 0
        }
      }), { headers: JSON_HEADERS });
    }
    const r = await fetch(backendUrl(env, 'data?uid=' + encodeURIComponent(uid)));
    const t = await r.text();
    return new Response(t, { status: r.status, headers: JSON_HEADERS });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, code: 'UPSTREAM' }), { status: 502, headers: JSON_HEADERS });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const b = await request.json().catch(function () { return null; });
    if (!b) return new Response(JSON.stringify({ ok: false, code: 'BAD_JSON' }), { status: 400, headers: JSON_HEADERS });
    const uid = String(b.uid || '');
    if (!okUid(uid)) return new Response(JSON.stringify({ ok: false, code: 'BAD_UID' }), { status: 400, headers: JSON_HEADERS });
    const snap = b.snap;
    if (!snapOk(snap)) return new Response(JSON.stringify({ ok: false, code: 'BAD_SNAP' }), { status: 400, headers: JSON_HEADERS });
    let s = null;
    try { s = JSON.stringify(snap); } catch (e) { s = null; }
    if (!s || s.length > 200000) return new Response(JSON.stringify({ ok: false, code: 'TOO_BIG' }), { status: 400, headers: JSON_HEADERS });
    const now = Date.now();
    const prof = (b.profile && typeof b.profile === 'object') ? b.profile : {};
    const name = String(prof.name || '').slice(0, 120);
    const email = String(prof.email || '').slice(0, 190);
    const pic = String(prof.pic || '').slice(0, 500);

    if (env && env.DB) {
      await env.DB.prepare('INSERT INTO users (user_id, name, email, pic, ts, logins, created, settings, sver, sts) VALUES (?,?,?,?,?,1,?,?,?,?) ' +
        'ON CONFLICT(user_id) DO UPDATE SET name=excluded.name, email=excluded.email, pic=excluded.pic, ts=excluded.ts, settings=excluded.settings, sts=excluded.sts')
        .bind(uid, name, email, pic, now, now, s, '', now).run();
      return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
    }
    const r = await fetch(backendUrl(env, 'data'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: uid, snap: snap, profile: prof })
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
