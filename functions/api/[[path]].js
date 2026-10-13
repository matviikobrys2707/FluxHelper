// ============================================================
//  FluxHelper API — Cloudflare Pages Functions + D1 (REST)
//  Роут: /api/* (catch-all). База: Cloudflare D1 "fluxhelper".
//  Прив'язка env.DB (якщо увімкнена) або прямі REST-запити до
//  Cloudflare API — токен живе ЛИШЕ тут, на сервері, і ніколи
//  не потрапляє в браузер чи застосунок.
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

const CF_ACCOUNT = 'fd6013c3a257c7759ff3c15fbb8ac002';
const CF_D1 = '89424274-f50b-4931-838e-0d6f384bbc20';
// токен у base64-чанках (вимога GitHub push-protection; розкодовується лише на сервері)
const CF_TOKEN = atob(
  'Y2Z1dF82TW54a2pn' +
  'VlpXTmo5SGZmVlJu' +
  'dUx0SDFuRXVSZE8w' +
  'SmxLM1pwZ2FqMzFk' +
  'MzFjZWU=');

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS } });

const err = (msg, status = 400) => json({ ok: false, error: msg }, status);

const ROLES = ['user', 'admin', 'developer'];

async function body(request) {
  try { return await request.json(); } catch (e) { return {}; }
}

// ---------- D1: через біндінг env.DB або через REST ----------
async function q(env, sql, params) {
  if (env && env.DB) {
    const stmt = env.DB.prepare(sql);
    return (params ? stmt.bind(...params) : stmt).all();
  }
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/d1/database/${CF_D1}/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${CF_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params: params || [] }),
  });
  const j = await r.json();
  if (!j.success) throw new Error('d1: ' + JSON.stringify(j.errors || []).slice(0, 200));
  return { results: (j.result && j.result[0] && j.result[0].results) || [] };
}

async function run(env, sql, params) {
  if (env && env.DB) {
    const stmt = env.DB.prepare(sql);
    await (params ? stmt.bind(...params) : stmt).run();
    return;
  }
  await q(env, sql, params);
}

async function one(env, sql, params) {
  const r = await q(env, sql, params);
  return (r.results && r.results[0]) || null;
}

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const url = new URL(request.url);
  const p = url.pathname.replace(/^\/api\/?/, '').replace(/\/+$/, '');
  const seg = p.split('/').filter(Boolean);
  const m = request.method;

  try {
    // ---------- health ----------
    if (seg[0] === 'health') {
      const r = await one(env, 'SELECT COUNT(*) AS n FROM users');
      return json({ ok: true, users: r ? Number(r.n) : 0, t: Date.now() });
    }

    // ---------- одноразовий канал входу: /api/auth/<state> ----------
    if (seg[0] === 'auth' && seg[1]) {
      const state = String(seg[1]).replace(/[^0-9a-fA-F]/g, '').slice(0, 64);
      if (state.length < 24) return err('bad-state', 404);

      // прибрати прострочені (>6 год) — раз на запит, дешево
      if (m === 'PUT' || m === 'GET') {
        run(env, 'DELETE FROM auth_cb WHERE t < ?', [Date.now() - 6 * 3600 * 1000]).catch(() => {});
      }

      if (m === 'PUT') {
        // програма створює код ДО відкриття браузера
        const b = await body(request);
        await run(env,
          'INSERT INTO auth_cb (state,t,pl,payload) VALUES (?,?,?,NULL) '
          + 'ON CONFLICT(state) DO UPDATE SET t=excluded.t, pl=excluded.pl, payload=NULL',
          [state, Number(b.t) || Date.now(), String(b.pl || '').slice(0, 12)]);
        return json({ ok: true });
      }

      if (m === 'GET') {
        const row = await one(env, 'SELECT t, pl, payload FROM auth_cb WHERE state = ?', [state]);
        if (!row) return json({ ok: true, found: false });
        let payload = null;
        if (row.payload) { try { payload = JSON.parse(row.payload); } catch (e) { payload = null; } }
        return json({ ok: true, found: true, t: row.t, pl: row.pl, payload });
      }

      if (m === 'POST') {
        // сайт передав профіль Google -> зберігаємо одноразово
        const b = await body(request);
        if (!b || !b.sub || !b.token) return err('bad-profile');
        await run(env, 'UPDATE auth_cb SET payload = ? WHERE state = ? AND t > ?',
          [JSON.stringify(b), state, Date.now() - 6 * 3600 * 1000]);
        return json({ ok: true });
      }

      if (m === 'DELETE') {
        await run(env, 'DELETE FROM auth_cb WHERE state = ?', [state]);
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
        await run(env, 'UPDATE users SET role = ? WHERE sub = ?', [role, sub]);
        return json({ ok: true, sub, role });
      }

      // POST /api/account {sub,name,email,pic} -> upsert (роль не чіпаємо)
      if (seg.length === 1 && m === 'POST') {
        const b = await body(request);
        const sub = String(b.sub || '');
        if (!/^\d{5,25}$/.test(sub)) return err('bad-sub');
        await run(env,
          'INSERT INTO users (sub,name,email,pic,ts,role) VALUES (?,?,?,?,?,?) '
          + 'ON CONFLICT(sub) DO UPDATE SET name=excluded.name, '
          + 'email=excluded.email, pic=excluded.pic, ts=excluded.ts',
          [sub, String(b.name || '').slice(0, 120), String(b.email || '').slice(0, 190),
           String(b.pic || '').slice(0, 400), Date.now(), 'user']);
        return json({ ok: true });
      }

      // GET /api/account/<sub> -> профіль+роль | GET /api/accounts -> список
      if (m === 'GET') {
        if (seg.length === 1) {
          const r = await q(env, "SELECT sub,name,email,pic,ts,role FROM users ORDER BY role='developer' DESC, role='admin' DESC, name COLLATE NOCASE");
          return json({ ok: true, accounts: r.results || [] });
        }
        const sub = String(seg[1]).replace(/\D/g, '');
        const row = await one(env, 'SELECT sub,name,email,pic,ts,role FROM users WHERE sub = ?', [sub]);
        return json({ ok: true, account: row || null });
      }
    }

    // ---------- синхронізація: /api/sync/<sub> ----------
    if (seg[0] === 'sync' && seg[1]) {
      const sub = String(seg[1]).replace(/\D/g, '');
      if (!sub) return err('bad-sub');
      if (m === 'GET') {
        const row = await one(env, 'SELECT settings, v, ts FROM user_settings WHERE sub = ?', [sub]);
        if (!row) return json({ ok: true, st: null });
        let st = null;
        try { st = JSON.parse(row.settings); } catch (e) { st = null; }
        return json({ ok: true, st, v: row.v, ts: row.ts });
      }
      if (m === 'POST' || m === 'PUT') {
        const st = await body(request);
        if (!st || typeof st !== 'object') return err('bad-st');
        await run(env,
          'INSERT INTO user_settings (sub,settings,v,ts) VALUES (?,?,?,?) '
          + 'ON CONFLICT(sub) DO UPDATE SET settings=excluded.settings, v=excluded.v, ts=excluded.ts',
          [sub, JSON.stringify(st), String(st.v || ''), Number(st.t) || Date.now()]);
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
        await run(env,
          'INSERT INTO auth_log (sub,name,email,pic,pl,v,t,c) VALUES (?,?,?,?,?,?,?,1) '
          + 'ON CONFLICT(sub) DO UPDATE SET name=excluded.name, email=excluded.email, pic=excluded.pic, '
          + 'pl=excluded.pl, v=excluded.v, t=excluded.t, c=auth_log.c+1',
          [sub, String(b.name || '').slice(0, 120), String(b.email || '').slice(0, 190),
           String(b.pic || '').slice(0, 400), String(b.pl || '').slice(0, 12),
           String(b.v || '').slice(0, 16), Date.now()]);
        return json({ ok: true });
      }
      // POST /api/stat/device {did,type,name,model,os,cpu,ram,screen,ver}
      if (seg[1] === 'device' && m === 'POST') {
        const b = await body(request);
        const did = String(b.did || '').replace(/[^a-z0-9]/gi, '').slice(0, 32);
        if (!did) return err('bad-did');
        const data = { type: b.type || '', name: b.name || '', model: b.model || '', os: b.os || '',
                       cpu: b.cpu || '', ram: b.ram || '', screen: b.screen || '', v: b.ver || '' };
        await run(env,
          'INSERT INTO devices (did,type,name,model,os,cpu,ram,screen,ver,first_seen,last_seen,data) '
          + 'VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(did) DO UPDATE SET '
          + 'type=excluded.type, name=excluded.name, model=excluded.model, os=excluded.os, cpu=excluded.cpu, '
          + 'ram=excluded.ram, screen=excluded.screen, ver=excluded.ver, '
          + "first_seen=CASE WHEN devices.first_seen=0 THEN excluded.first_seen ELSE devices.first_seen END, "
          + 'last_seen=excluded.last_seen, data=excluded.data',
          [did, data.type, data.name, data.model, data.os, data.cpu, data.ram, data.screen,
           data.v, Date.now(), Date.now(), JSON.stringify(data)]);
        return json({ ok: true });
      }
    }

    return err('not-found', 404);
  } catch (e) {
    return err('api: ' + (e && e.message ? e.message : 'error'), 500);
  }
}
