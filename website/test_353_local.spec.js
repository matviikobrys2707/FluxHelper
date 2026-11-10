import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';

let serverProcess = null;
const PORT = 8127;
const U = `http://localhost:${PORT}`;
const SNAP = {
  schedule: { mon: [{ s: 'Алгебра', t: '08:30', e: '09:15' }], tue: [], wed: [], thu: [], fri: [] },
  subjects: { 'Алгебра': { tc: 'Іваненко' } },
  teachers: {},
  weeks: { flips: 0, inverted: 0 },
};
const ROW = {
  role: 'user', sync: 1, settings: JSON.stringify({
    g: { '8Б': {} }, n: { on: true, min: 5, snd: true }, th: 'standard', z: 'app',
    t: 1793500000000, v: '3.5.53', sync: 1
  }), sts: 1793500000000
};

function startServer() {
  return new Promise((resolve) => {
    serverProcess = spawn('python', ['-m', 'http.server', String(PORT)], {
      cwd: process.cwd(),
      stdio: 'ignore'
    });
    setTimeout(resolve, 1500);
  });
}

function stopServer() {
  if (serverProcess) serverProcess.kill();
}

function apiMocks(mode) {
  return async (route) => {
    const req = route.request();
    const u = req.url();
    if (u.includes('/fbauth.html')) {
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<script>parent.postMessage({__fhFb:{ok:true,localId:"test53fid001"}}, "*")</script>' });
      return;
    }
    const isApi = u.startsWith(U + '/api/') || u.startsWith('https://fluxhelper-backend.onrender.com/api/');
    if (isApi) {
      if (mode === 'dead' && u.startsWith(U + '/api/')) {
        await route.fulfill({ status: 404, body: 'not found' });
        return;
      }
      const path = u.split('/api/')[1].split('?')[0];
      if (path === 'data' && req.method() === 'POST') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
        return;
      }
      if (path === 'data') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, row: ROW }) });
        return;
      }
      if (path === 'snap') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, ...SNAP }) });
        return;
      }
      if (path === 'rev') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, rev: 1793500000000, ev: null, uev: null }) });
        return;
      }
      if (path === 'authcb' && req.method() === 'POST') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
        return;
      }
      if (path === 'authcb') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data: null }) });
        return;
      }
      if (path === 'diag') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
        return;
      }
      await route.fulfill({ status: 404, body: 'no' });
      return;
    }
    if (u.includes('firebasedatabase.app') || u.includes('firebaseio.com')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      return;
    }
    if (u.includes('accounts.google.com')) {
      await route.fulfill({ status: 200, contentType: 'application/javascript', body: '/*noop*/' });
      return;
    }
    if (u.includes('identitytoolkit') || u.includes('securetoken')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      return;
    }
    await route.continue();
  };
}

async function getState(page) {
  return await page.evaluate(() => ({
    ready: document.body.classList.contains('ready'),
    gateHidden: (() => { const g = document.getElementById('agate'); return !g || g.classList.contains('hidden'); })(),
    bootHidden: (() => { const b = document.getElementById('boot'); return !b || b.classList.contains('hidden') || b.classList.contains('off'); })(),
    vMain: (() => { const m = document.getElementById('vMain'); return !!m && !m.classList.contains('hidden'); })(),
    agStat: (() => { const s = document.getElementById('agStat'); return s ? s.textContent.trim().slice(0, 90) : ''; })(),
    diagPanel: (() => { const d = document.getElementById('fhDiag52'); return !!d && !d.classList.contains('hidden'); })(),
    chips: document.querySelectorAll('.ag-acc').length,
    ver: (typeof APP_VER !== 'undefined') ? APP_VER : '',
  }));
}

async function runTest(page, context, label, mode = 'api') {
  const msgs = [];
  page.on('pageerror', e => msgs.push(`PAGEERROR: ${e.message.slice(0, 200)}`));
  await context.route('**/*', apiMocks(mode));

  console.log(`\n===== ${label} (${mode}): ${U}/${label.toLowerCase().startsWith('mac') ? 'mac' : 'iphone'}/ =====`);

  // Clear localStorage once
  await page.addInitScript(() => {
    try {
      if (localStorage.getItem('fh_t53run')) return;
      ['fh_user','fh_web_session','fh_diag','fh_outbox','fh_rtok_backup','fh_accs'].forEach(k => localStorage.removeItem(k));
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.indexOf('fh_pacc') === 0) localStorage.removeItem(k);
      }
      localStorage.setItem('fh_t53run','1');
    } catch (e) {}
  });

  await page.goto(U + '/' + (label.toLowerCase().startsWith('mac') ? 'mac' : 'iphone') + '/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(4500);

  let st = await getState(page);
  expect(st.ver).toBe('3.5.53');

  const gateOn = await page.evaluate(() => { const g = document.getElementById('agate'); return !!g && !g.classList.contains('hidden'); });
  expect(gateOn).toBe(true);

  const r = await page.evaluate((u) => {
    try { window.__fh.authOk(u); return 'ok'; } catch (e) { return 'ERR ' + e; }
  }, { sub: 'test53sub0001', name: 'Тест 53', email: 't53@example.com', pic: '', fid: 'test53fid00001', tok: 'x' });
  expect(r).toBe('ok');

  let verdict = 'NO';
  for (let i = 0; i < 50; i++) {
    await page.waitForTimeout(500);
    st = await getState(page);
    if (st.ready && st.gateHidden && st.bootHidden) {
      verdict = `REVEALED ${(i+1)*0.5.toFixed(1)}s`;
      break;
    }
  }
  expect(verdict).toMatch(/REVEALED/);

  await page.waitForTimeout(1200);
  const pageErrors = msgs.filter(m => m.includes('PAGEERROR'));
  expect(pageErrors.length).toBe(0);

  // Reload - session should persist
  msgs.length = 0;
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(18000);
  st = await getState(page);
  expect(st.ready && st.gateHidden && st.bootHidden).toBe(true);
  const reloadErrors = msgs.filter(m => m.includes('PAGEERROR'));
  expect(reloadErrors.length).toBe(0);
}

async function testDiag(page, context, label) {
  await context.route('**/*', apiMocks('api'));
  await page.goto(U + '/' + (label.toLowerCase().startsWith('mac') ? 'mac' : 'iphone') + '/?diag=1', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2600);
  const st = await getState(page);
  expect(st.diagPanel).toBe(true);
  const txt = await page.evaluate(() => { const d = document.getElementById('fhDiag52'); return d ? d.textContent.slice(0, 90) : ''; });
  expect(txt).toContain('FH');
  await page.evaluate(() => { const x = document.getElementById('fhDiag52x'); if (x) x.click(); });
  await page.waitForTimeout(300);
}

async function testChips(page, context, label) {
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0, 140)));
  await context.route('**/*', apiMocks('api'));

  await page.addInitScript(() => {
    try {
      if (localStorage.getItem('fh_t53chips')) return;
      ['fh_user','fh_web_session','fh_diag','fh_outbox','fh_accs'].forEach(k => localStorage.removeItem(k));
      localStorage.setItem('fh_accs', JSON.stringify([
        {sub:'subAAA111',name:'Плитка А',email:'chipA@example.com',pic:''},
        {sub:'subBBB222',name:'Плитка Б',email:'chipB@example.com',pic:''}
      ]));
      localStorage.setItem('fh_t53chips','1');
    } catch (e) {}
  });

  await page.goto(U + '/iphone/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(4500);

  let st = await getState(page);
  expect(st.chips).toBe(2);

  await page.evaluate(() => {
    try { chipFailTick('chipA@example.com'); chipFailTick('chipA@example.com'); } catch (e) {}
  });
  await page.waitForTimeout(700);

  st = await getState(page);
  expect(st.chips).toBe(1);

  const left = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('fh_accs')||'[]').map(a=>a.email).join(','); } catch (e) { return '?'; }
  });
  expect(left).toBe('chipB@example.com');
  expect(errs.length).toBe(0);
}

async function testAuthPage(context) {
  const page = await context.newPage();
  const errs = [];
  const apiHits = [];
  page.on('pageerror', e => errs.push(e.message.slice(0, 120)));

  await context.route('**/*', async (route) => {
    const req = route.request();
    const u = req.url();
    if (u.includes('/api/authcb')) {
      apiHits.push({ method: req.method(), url: u.slice(0, 80) });
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
      return;
    }
    if (u.includes('firebasedatabase.app')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      return;
    }
    if (u.includes('identitytoolkit')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ localId: 'test53fid00001', idToken: 'x.y.z', refreshToken: 'r', expiresIn: '3600', email: 't53@example.com' }) });
      return;
    }
    if (u.includes('accounts.google.com')) {
      await route.fulfill({ status: 200, contentType: 'application/javascript', body: '/*noop*/' });
      return;
    }
    await route.continue();
  });

  await page.goto(`${U}/auth.html#s=deadbeefdead53`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2200);

  const vis = await page.evaluate(() => !!document.getElementById('go'));
  expect(vis && errs.length === 0).toBe(true);

  await page.close();
}

test.describe('FluxHelper 3.5.53 Security Tests', () => {
  test.beforeAll(async () => {
    await startServer();
  });

  test.afterAll(async () => {
    stopServer();
  });

  test('MAC - API alive', async ({ page, context }) => {
    await runTest(page, context, 'MAC', 'api');
  });

  test('MAC - diag panel', async ({ page, context }) => {
    await testDiag(page, context, 'MAC');
  });

  test('IPHONE - API alive', async ({ page, context }) => {
    await runTest(page, context, 'IPHONE', 'api');
  });

  test('IPHONE - diag panel', async ({ page, context }) => {
    await testDiag(page, context, 'IPHONE');
  });

  test('IPHONE - account chips', async ({ page, context }) => {
    await testChips(page, context, 'IPHONE');
  });

  test('MAC - fallback (API dead -> backend)', async ({ page, context }) => {
    await runTest(page, context, 'MAC-fallback', 'dead');
  });

  test('AUTH - auth.html with D1 authcb', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await testAuthPage(context);
    await context.close();
  });
});