// ============================================================
//  FluxHelper API — Cloudflare Pages Functions + D1
//  Роут: /api/* (catch-all). База: binding env.DB (D1 "fluxhelper").
//  Тут ЖИВЕ ВСЕ, крім розкладу: акаунти, ролі, синхронізація,
//  статистика входів/пристроїв та одноразовий канал входу (auth_cb).
//  CORS відкритий: програма (exe/APK, file://-origin) і сайт ходять сюди.
// ============================================================

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS } });

const err = (msg, status = 400) => json({ ok: false, error: msg }, status);

const ROLES = ['user', 'admin', 'developer'];

async function body(request) {
  try { return await request.json(); } catch (e) { return {}; }
}

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (!env || !env.DB) return err('db-binding-missing', 500);

  const url = new URL(request.url);
  const p = url.pathname.replace(/^\/api\/?/, '').replace(/\/+$/, '');
  const seg = p.split('/').filter(Boolean);
  const db = env.DB;
  const m = request.method;

  try {
    // ---------- health ----------
    if (seg[0] === 'health') {
      const r = await db.prepare('SELECT COUNT(*) AS n FROM users').first();
      return json({ ok: true, users: r.n, t: Date.now() });
    }

    // ---------- одноразовий канал входу: /api/auth/<state> ----------
    if (seg[0] === 'auth' && seg[1]) {
      const state = String(seg[1]).replace(/[^0-9a-fA-F]/g, '').slice(0, 64);
      if (state.length < 24) return err('bad-state', 404);

      // прибрати прострочені (>6 год) — раз на запит, дешево
      if (m === 'PUT' || m === 'GET') {
        db.prepare('DELETE FROM auth_cb WHERE t < ?').bind(Date.now() - 6 * 3600 * 1000).run().catch(() => {});
      }

      if (m === 'PUT') {
        // програма створює код ДО відкриття браузера
        const b = await body(request);
        await db.prepare('INSERT INTO auth_cb (state,t,pl,payload) VALUES (?,?,?,NULL) '
          + 'ON CONFLICT(state) DO UPDATE SET t=excluded.t, pl=excluded.pl, payload=NULL')
          .bind(state, Number(b.t) || Date.now(), String(b.pl || '').slice(0, 12)).run();
        return json({ ok: true });
      }

      if (m === 'GET') {
        const row = await db.prepare('SELECT t, pl, payload FROM auth_cb WHERE state = ?').bind(state).first();
        if (!row) return json({ ok: true, found: false });
        let payload = null;
        if (row.payload) { try { payload = JSON.parse(row.payload); } catch (e) { payload = null; } }
        return json({ ok: true, found: true, t: row.t, pl: row.pl, payload });
      }

      if (m === 'POST') {
        // сайт передав профіль Google -> зберігаємо одноразово
        const b = await body(request);
        if (!b || !b.sub || !b.token) return err('bad-profile');
        await db.prepare('UPDATE auth_cb SET payload = ? WHERE state = ? AND t > ?')
          .bind(JSON.stringify(b), state, Date.now() - 6 * 3600 * 1000).run();
        return json({ ok: true });
      }

      if (m === 'DELETE') {
        await db.prepare('DELETE FROM auth_cb WHERE state = ?').bind(state).run();
        return json({ ok: true });
      }
    }

    // ---------- акаунти ----------
    if (seg[0] === 'account' || seg[0] === 'accounts') {
      // POST /api/account/role {sub, role}
      if (seg[1] === 'role' && m === 'POST') {
        const b = await body(request);
        const role = ROLES.indexOf(String(b.role || '')) >= 0 ? String(b.role) : 'user';
        const sub = String(b.sub || '');
        if (!/^\d{5,25}$/.test(sub)) return err('bad-sub');
        await db.prepare('UPDATE users SET role = ? WHERE sub = ?').bind(role, sub).run();
        return json({ ok: true, sub, role });
      }

      // POST /api/account {sub,name,email,pic} -> upsert (роль не чіпаємо)
      if (seg.length === 1 && m === 'POST') {
        const b = await body(request);
        const sub = String(b.sub || '');
        if (!/^\d{5,25}$/.test(sub)) return err('bad-sub');
        await db.prepare('INSERT INTO users (sub,name,email,pic,ts,role) VALUES (?,?,?,?,?,?) '
          + 'ON CONFLICT(sub) DO UPDATE SET name=excluded.name, '
          + 'email=excluded.email, pic=excluded.pic, ts=excluded.ts')
          .bind(sub, String(b.name || '').slice(0, 120), String(b.email || '').slice(0, 190),
                String(b.pic || '').slice(0, 400), Date.now(), 'user').run();
        return json({ ok: true });
      }

      // GET /api/account/<sub> -> профіль+роль | GET /api/accounts -> список
      if (m === 'GET') {
        if (seg.length === 1) {
          const r = await db.prepare("SELECT sub,name,email,pic,ts,role FROM users ORDER BY role='developer' DESC, role='admin' DESC, name COLLATE NOCASE").all();
          return json({ ok: true, accounts: r.results || [] });
        }
        const sub = String(seg[1]).replace(/\D/g, '');
        const row = await db.prepare('SELECT sub,name,email,pic,ts,role FROM users WHERE sub = ?').bind(sub).first();
        return json({ ok: true, account: row || null });
      }
    }

    // ---------- синхронізація: /api/sync/<sub> ----------
    if (seg[0] === 'sync' && seg[1]) {
      const sub = String(seg[1]).replace(/\D/g, '');
      if (!sub) return err('bad-sub');
      if (m === 'GET') {
        const row = await db.prepare('SELECT settings, v, ts FROM user_settings WHERE sub = ?').bind(sub).first();
        if (!row) return json({ ok: true, st: null });
        let st = null;
        try { st = JSON.parse(row.settings); } catch (e) { st = null; }
        return json({ ok: true, st, v: row.v, ts: row.ts });
      }
      if (m === 'POST' || m === 'PUT') {
        const st = await body(request);
        if (!st || typeof st !== 'object') return err('bad-st');
        await db.prepare('INSERT INTO user_settings (sub,settings,v,ts) VALUES (?,?,?,?) '
          + 'ON CONFLICT(sub) DO UPDATE SET settings=excluded.settings, v=excluded.v, ts=excluded.ts')
          .bind(sub, JSON.stringify(st), String(st.v || ''), Number(st.t) || Date.now()).run();
        return json({ ok: true });
      }
    }

    // ---------- статистика ----------
    if (seg[0] === 'stat') {
      // POST /api/stat/auth {sub,name,email,pic,pl,v}
      if (seg[1] === 'auth' && m === 'POST') {
        const b = await body(request);
        const sub = String(b.sub || '');
        if (!/^\d{5,25}$/.test(sub)) return err('bad-sub');
        await db.prepare('INSERT INTO auth_log (sub,name,email,pic,pl,v,t,c) VALUES (?,?,?,?,?,?,?,1) '
          + 'ON CONFLICT(sub) DO UPDATE SET name=excluded.name, email=excluded.email, pic=excluded.pic, '
          + 'pl=excluded.pl, v=excluded.v, t=excluded.t, c=auth_log.c+1')
          .bind(sub, String(b.name || '').slice(0, 120), String(b.email || '').slice(0, 190),
                String(b.pic || '').slice(0, 400), String(b.pl || '').slice(0, 12),
                String(b.v || '').slice(0, 16), Date.now()).run();
        return json({ ok: true });
      }
      // POST /api/stat/device {did,type,name,model,os,cpu,ram,screen,ver}
      if (seg[1] === 'device' && m === 'POST') {
        const b = await body(request);
        const did = String(b.did || '').replace(/[^a-z0-9]/gi, '').slice(0, 32);
        if (!did) return err('bad-did');
        const data = { type: b.type || '', name: b.name || '', model: b.model || '', os: b.os || '',
                       cpu: b.cpu || '', ram: b.ram || '', screen: b.screen || '', v: b.ver || '' };
        await db.prepare('INSERT INTO devices (did,type,name,model,os,cpu,ram,screen,ver,first_seen,last_seen,data) '
          + 'VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(did) DO UPDATE SET '
          + 'type=excluded.type, name=excluded.name, model=excluded.model, os=excluded.os, cpu=excluded.cpu, '
          + 'ram=excluded.ram, screen=excluded.screen, ver=excluded.ver, '
          + 'first_seen=CASE WHEN devices.first_seen=0 THEN excluded.first_seen ELSE devices.first_seen END, '
          + 'last_seen=excluded.last_seen, data=excluded.data')
          .bind(did, data.type, data.name, data.model, data.os, data.cpu, data.ram, data.screen,
                data.v, Date.now(), Date.now(), JSON.stringify(data)).run();
        return json({ ok: true });
      }
    }

    return err('not-found', 404);
  } catch (e) {
    return err('api: ' + (e && e.message ? e.message : 'error'), 500);
  }
}
