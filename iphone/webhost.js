/* ============================================================
   FluxHelper — ВЕБ-МІСТ (webhost.js) v3
   ============================================================
   Сторінки сайту (/iphone/ — телефонний UI з APK, /mac/ — десктопний
   UI з Windows-програми) виконують ТОЙ САМИЙ код інтерфейсу, що й
   застосунки. Застосунки спілкуються з системою через нативний міст
   window.AndroidHost; на сайті його імітує цей файл.

   3.5.18 — СИНХРОНІЗАЦІЯ ПОВЕРНЕНА ДО РОБОЧОЇ СХЕМИ САЙТУ 3.5.12
   (просив власник: «вернись к версии, в которой всё работало — посмотри,
   как там сделана логика синхронизации, и сделай точь-в-точь»):

   • ВХІД — як на старому сайті: Google Identity Services ПРЯМО НА
     СТОРІНЦІ (жодних попапів auth.html): initTokenClient -> access_token
     -> userinfo -> FluxHelper Backend /api/auth/google -> Firebase
     localId + idToken + refreshToken. Профіль пишеться в RTDB
     update/auth_cb/<state> (канал входу застосунків) — далі працює
     ВЛАСНИЙ вхід програми (authPollDb -> authAccept -> usersUpsert).
   • ТРАНСПОРТ — як на старому сайті: /api/sync (op get/put) з Bearer
     idToken користувача; фолбек — дзеркала RTDB update/web/<uid> +
     update/settings_mirror/<uid> через /api/rtdb; роль — з бекенда (D1).
   • OUTBOX — гарантована доставка знімка (як 3.5.8 на старому сайті):
     невдалий запис кладеться в чергу localStorage і повторюється кожні
     4 с, поки сервер не підтвердить; виштовхується при поверненні
     мережі/фокусу.
   • СЕМАНТИКА «РЯДОК/ОФЛАЙН»: чесна відповідь сервера «рядка нема» =
     успіх з порожнім результатом (перший вхід -> майстер груп); ЛЮБИЙ
     збій (мережа/401/холодний Render) = відмова -> застосунок лишає
     локальний стан і ретраїть сам.
   • Сайт-деталі: кнопки «Запуск Zoom» (Додаток/Браузер) прибираються —
     на сайті вони не мають сенсу; екран «Немає інтернету» вимкнено
     (він потрібен лише застосункам), дані тягнуться тихо.
   ============================================================ */
(function () {
'use strict';
var VER = '3.5.32';
var BACKEND = 'https://fluxhelper-backend.onrender.com';
var ORIGIN = 'https://fluxhelper.pages.dev';
var DB_URL = 'https://fluxhelper-1-default-rtdb.europe-west1.firebasedatabase.app';
var GIS_CLIENT = '668834523935-k470ldmdv0r9am0720v6lgaatm6rtuf3.apps.googleusercontent.com';

window.FH_WEB = true;

/* Сайт-адаптації (3.5.19 — просив власник):
   • «Немає інтернету» — лише для застосунків;
   • Mac-версія: кнопки «Згорнути»/«Закрити» (тітул + сплеш) — це контролі
     ВІКНА Windows-програми, у браузері їх не буде;
   • Нижня панель (/iphone/) — трохи вище від краю + безпечна зона Safari;
   • Сповіщення про початок уроку — ЛИШЕ в застосунках (Android/Windows):
     на сайті прибрано ВСЕ — банер «Увімкнути», секцію налаштувань, дозволи. */
try {
  var st = document.createElement('style');
  /* 3.5.20→3.5.22: ХТО СХОВАН І КОЛИ:
     • #secNotif/#nban/#bPerm/#bTestN/#rowNotif — сповіщення лише в застосунках;
     • .beta-only (нові красиві елементи) — на сайті видимі лише бета-адмінам
       (клас body.fh-beta ставить ui.js після синку); у застосунках цих
       правил просто нема — там новий дизайн ЗАВЖДИ.

     3.5.22 (просив власник):
     • #secZoom («Запуск Zoom»: Додаток/Браузер) — ТЕПЕР ВИДНИЙ на сайті
       для будь-якої версії («почему убрала? Это должно быть») — вибраний
       режим відкриття уроків працює і на сайті;
     • кнопка «Приєднатися» на картці уроку (.b-join) — 3.5.23: ПОВЕРНЕНА
       на сайт у всіх версіях (власник: «почему убрала? Я не говорил её
       убирать»). Режим відкриття (додаток/браузер/підтвердження) задає
       рамка «Запуск Zoom». */
  st.textContent =
    '#neterr{display:none!important}' +
    '#bMin,#bClose,#btMin,#btClose{display:none!important}' +
    /* 3.5.29: правло bottom ЗНЯТО — відступ панелі тепер виставляє ui.js
       (gapFix: з кнопковою навігацією щільніше до системних кнопок, з жестами — як було). */
    '#secNotif,#nban,#bPerm,#bTestN,#rowNotif{display:none!important}' +
    '#secUpd{display:none!important}' +   /* 3.5.26: рамку «Оновлення» знесено з САЙТУ (потрібна лише застосункам) */
    'body:not(.fh-beta) .beta-only{display:none!important}';
  /* 3.5.23: правило, що ховало кнопку «Приєднатися» на картці (.b-join),
     ЗНЯТО — власник повертає кнопку на сайт («почему убрала? Я не говорил
     её убирать»). Кнопка тепер на сайті в УСІХ версій. */
  (document.head || document.documentElement).appendChild(st);
} catch (eS) {}

/* ───────────────────────── сесія ───────────────────────── */
var tokState = null;
function jget(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
function sessGet() { return jget('fh_web_session'); }
function sessSave(s) { try { localStorage.setItem('fh_web_session', JSON.stringify(s)); } catch (e) {} }
function bootTok() {
  if (tokState) return;
  var s = sessGet();
  if (s && s.rtok) { tokState = s; return; }
  try {
    var u = jget('fh_user');
    if (u && u.rtok) tokState = { tok: String(u.tok || ''), rtok: String(u.rtok), tokT: parseInt(u.tokT, 10) || 0 };
    else {
      var b = jget('fh_rtok_backup');   /* сесія на час перелогіна */
      if (b && b.rtok) tokState = b;
    }
  } catch (e) {}
}
function ensureTok(cb) {
  bootTok();
  if (tokState && tokState.tok && tokState.tokT && Date.now() < tokState.tokT - 30000) { cb(true); return; }
  if (!tokState || !tokState.rtok) { cb(false); return; }
  try {
    var x = new XMLHttpRequest();
    x.open('POST', BACKEND + '/api/auth/refresh', true);
    x.setRequestHeader('Content-Type', 'application/json');
    x.onreadystatechange = function () {
      if (x.readyState !== 4) return;
      var j = null;
      try { j = JSON.parse(x.responseText); } catch (e) {}
      if (j && j.ok && j.idToken) {
        tokState.tok = String(j.idToken);
        tokState.rtok = String(j.refreshToken || tokState.rtok);
        var exp = parseInt(j.expiresIn, 10) || 3600;
        tokState.tokT = Date.now() + exp * 1000 - 120000;
        sessSave(tokState);
        cb(true);
      } else cb(false);
    };
    x.send(JSON.stringify({ refresh_token: tokState.rtok }));
  } catch (e) { cb(false); }
}
/* синхронне оновлення токена — для синхронного fbPut (як у нативному мосту) */
function ensureTokSync() {
  bootTok();
  if (tokState && tokState.tok && tokState.tokT && Date.now() < tokState.tokT - 30000) return true;
  if (!tokState || !tokState.rtok) return false;
  try {
    var x = new XMLHttpRequest();
    x.open('POST', BACKEND + '/api/auth/refresh', false);
    x.setRequestHeader('Content-Type', 'application/json');
    x.send(JSON.stringify({ refresh_token: tokState.rtok }));
    var j = null;
    try { j = JSON.parse(x.responseText); } catch (e) {}
    if (j && j.ok && j.idToken) {
      tokState.tok = String(j.idToken);
      tokState.rtok = String(j.refreshToken || tokState.rtok);
      var exp = parseInt(j.expiresIn, 10) || 3600;
      tokState.tokT = Date.now() + exp * 1000 - 120000;
      sessSave(tokState);
      return true;
    }
  } catch (e) {}
  return false;
}
function rtdbSync(op, path, data) {
  if (!ensureTokSync() || !tokState || !tokState.tok) return false;
  try {
    var x = new XMLHttpRequest();
    x.open('POST', BACKEND + '/api/rtdb', false);
    x.setRequestHeader('Content-Type', 'application/json');
    x.setRequestHeader('Authorization', 'Bearer ' + tokState.tok);
    x.send(JSON.stringify({ op: op, path: String(path), data: data === undefined ? null : data }));
    return x.status >= 200 && x.status < 300;
  } catch (e) { return false; }
}
function rtdbAsync(op, path, data, cb) {
  ensureTok(function (ok) {
    if (!ok || !tokState || !tokState.tok) { cb(null); return; }
    fetch(BACKEND + '/api/rtdb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tokState.tok },
      body: JSON.stringify({ op: op, path: String(path), data: data === undefined ? null : data })
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { cb(j && j.ok ? (j.data === undefined ? null : j.data) : null); })
      .catch(function () { cb(null); });
  });
}

/* ───────────────────── Firebase->bridge формат ───────────────────── */
function normPath(p) {
  var s = String(p || '').replace(/\.json(\?.*)?$/, '');
  if (s.charAt(0) === '/') s = s.slice(1);
  return s;
}
function fbEncUid(k) { return String(k).replace(/[^A-Za-z0-9_-]/g, '_'); }
function myFid() {
  try {
    var u = jget('fh_user');
    return (u && u.fid) ? String(u.fid) : '';
  } catch (e) { return ''; }
}
/* будь-який вузол дзеркала -> знімок (як rawToSnap старого сайту) */
function rawToSnap(j) {
  if (!j || typeof j !== 'object') return null;
  if (j.d && typeof j.d === 'object' && typeof j.d.settings === 'string') {
    try { var s = JSON.parse(j.d.settings); return (s && typeof s === 'object' && (s.g || s.n || s.th || s.z)) ? s : null; } catch (e) { return null; }
  }
  if (j.st && typeof j.st === 'object' && !j.g) j = j.st;
  return (j && typeof j === 'object' && (j.g || j.n || j.th || j.z)) ? j : null;
}

/* ───────────────────── D1-відповідь у форматі хоста ───────────────────── */
function cfReply(id, ok, rows) {
  var json = ok ? JSON.stringify({ success: true, result: [{ results: rows || [] }] }) : null;
  setTimeout(function () {
    try {
      if (window.__fh && typeof window.__fh.cfqCb === 'function') { window.__fh.cfqCb(id, ok ? 200 : 0, json); return; }
      if (typeof window.__fhCfqResult === 'function') window.__fhCfqResult(id, ok ? 200 : 0, json);
    } catch (e) {}
  }, 10);
}
function snapOk(p) { return !!(p && typeof p === 'object' && (p.g || p.n || p.th || p.z)); }

/* РЯДОК з /api/sync op:get. Якщо бекенд недоступний/401 — ФОЛБЕК на
   дзеркала RTDB (роль+синк+знімок живуть і там). Якщо і дзеркала
   недоступні — cb(null) = «офлайн» (застосунок лишає локальний стан). */
function apiGetRow(cb) {
  var finish = function (row) { cb(row); };
  var viaMirror = function () {
    var k = myFid();
    if (!k) { finish(null); return; }
    var wk = 'update/web/' + encodeURIComponent(k);
    var sk = 'update/settings_mirror/' + fbEncUid(k);
    rtdbAsync('get', wk, null, function (a) {
      rtdbAsync('get', sk, null, function (b) {
        var sa = rawToSnap(a), sb = rawToSnap(b);
        var best = null;
        if (sa && sb) best = (((parseInt(sb.t, 10) || 0) > (parseInt(sa.t, 10) || 0)) ? sb : sa);
        else best = sa || sb;
        if (!best) { finish(null); return; }
        finish({
          role: String(best.r || 'user'),
          sync: (best.sync === 0 || best.sync === false || best.sync === '0') ? 0 : 1,
          settings: JSON.stringify(best),
          sts: parseInt(best.t, 10) || 0
        });
      });
    });
  };
  ensureTok(function (ok) {
    if (!ok || !tokState || !tokState.tok) { viaMirror(); return; }
    fetch(BACKEND + '/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tokState.tok },
      body: JSON.stringify({ op: 'get' })
    }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
      .then(function (j) {
        if (!j || !j.ok) { viaMirror(); return; }   /* збій -> фолбек, НЕ «порожній рядок» */
        var set = (j.settings && typeof j.settings === 'object') ? j.settings : null;
        var setStr = set ? JSON.stringify(set) : '';
        finish({
          role: String(j.role || 'user'),
          sync: (j.sync === 0 || j.sync === false || j.sync === '0') ? 0 : 1,
          settings: setStr,
          sts: parseInt((set && set.t) || j.sts, 10) || 0
        });
      });
  });
}
function apiPutSnap(snap, profile, cb) {
  var done = function (ok) { cb(ok); };
  var viaMirror = function () {
    var k = myFid();
    if (!k) { done(false); return; }
    var wk = 'update/web/' + encodeURIComponent(k);
    var sk = 'update/settings_mirror/' + fbEncUid(k);
    var appWrap = { d: { fid: k, settings: JSON.stringify(snap), v: VER }, t: snap.t || Date.now() };
    var left = 2, okN = 0;
    var fin = function (ok) { if (ok) okN += 1; if (--left <= 0) done(okN > 0); };
    rtdbAsync('put', wk, snap, fin);
    rtdbAsync('put', sk, appWrap, fin);
  };
  ensureTok(function (ok) {
    if (!ok || !tokState || !tokState.tok) { viaMirror(); return; }
    fetch(BACKEND + '/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tokState.tok },
      body: JSON.stringify({ op: 'put', snapshot: snap, profile: profile || null })
    }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
      .then(function (j) { done(!!(j && j.ok)); }).catch(function () { done(false); });
  });
}

/* ───────────────── OUTBOX: гарантована доставка (3.5.8) ─────────────────
   Як на старому сайті: невдалий запис знімка не гине зміну — черга в
   localStorage, повтор кожні 4 с, виштовхування при поверненні мережі. */
var outboxT = 0, outboxBusy = false;
function outboxStash(snap, profile) {
  try { localStorage.setItem('fh_outbox', JSON.stringify({ snap: snap, profile: profile || null, ts: Date.now() })); } catch (e) {}
  outboxKick(300);
}
function outboxClear() { try { localStorage.removeItem('fh_outbox'); } catch (e) {} }
function outboxKick(delay) {
  clearTimeout(outboxT);
  outboxT = setTimeout(outboxDrain, delay || 0);
}
function outboxDrain() {
  outboxT = 0;
  if (outboxBusy || !myFid()) return;
  var job = jget('fh_outbox');
  if (!job || !job.snap) return;
  outboxBusy = true;
  apiPutSnap(job.snap, job.profile || null, function (ok) {
    outboxBusy = false;
    if (ok) { outboxClear(); return; }
    outboxKick(4000);   /* сервер спить / мережа блимнула — повторимо */
  });
}
/* запис налаштувань з outbox-страховкою (усі маршрути UPDATE/INSERT settings) */
function putWithOutbox(snap, profile, cb) {
  apiPutSnap(snap, profile, function (ok) {
    if (ok) { outboxClear(); if (cb) cb(true); return; }
    outboxStash(snap, profile);
    if (cb) cb(false);
  });
}
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible' && myFid()) outboxKick(300);
});
window.addEventListener('online', function () { if (myFid()) outboxKick(200); });

/* ───────────────── мапінг відомих SQL-запитів інтерфейсу ─────────────────
   3.5.18 ВИПРАВЛЕНО: «SELECT user_id FROM users WHERE user_id=?» більше не
   бреше «рядок є» — чесна перевірка через apiGetRow (раніше INSERT міг
   тихо провалитись, а наступний SELECT казав «рядок є» -> акаунт «зник»
   з бази і програма викидала на вхід). */
function cfRoute(id, payload) {
  var sql = '', params = [];
  try { sql = String(payload.sql || ''); params = payload.params || []; } catch (e) { cfReply(id, false, null); return; }
  var p0 = function (i) { return params.length > i ? params[i] : null; };
  var asSnap = function (v) {
    if (v && typeof v === 'object') return v;
    try { var q = JSON.parse(v); return (q && typeof q === 'object') ? q : null; } catch (e) { return null; }
  };

  if (/^CREATE TABLE/i.test(sql) || /^DROP TABLE/i.test(sql) || /^ALTER TABLE/i.test(sql)) { cfReply(id, true, []); return; }
  if (/^DELETE FROM users/i.test(sql)) { cfReply(id, true, []); return; }
  if (/^INSERT INTO device/i.test(sql)) { cfReply(id, true, []); return; }

  if (/^SELECT role, sync, settings, sts FROM users/i.test(sql)) { apiGetRow(function (r) { cfReply(id, r !== null, r ? [r] : []); }); return; }
  if (/^SELECT role, sync FROM users/i.test(sql)) {
    apiGetRow(function (r) { cfReply(id, r !== null, r ? [{ role: r.role, sync: r.sync }] : []); }); return;
  }
  if (/^SELECT settings FROM users/i.test(sql)) { apiGetRow(function (r) { cfReply(id, r !== null, r ? [{ settings: r.settings }] : []); }); return; }
  if (/^SELECT sts FROM users/i.test(sql)) { apiGetRow(function (r) { cfReply(id, r !== null, r ? [{ sts: r.sts }] : []); }); return; }
  if (/^SELECT user_id FROM users WHERE user_id=/i.test(sql)) {
    /* 3.5.18: ЧЕСНА перевірка існування рядка (перевірка INSERT у usersUpsert) */
    apiGetRow(function (r) {
      if (r === null) { cfReply(id, false, null); return; }   /* офлайн -> ретрай застосунку */
      var has = false;
      try { has = !!(r.settings && snapOk(JSON.parse(r.settings))); } catch (e) {}
      cfReply(id, true, has ? [{ user_id: String(p0(0) || '') }] : []);
    }); return;
  }
  if (/^SELECT user_id FROM users WHERE email=/i.test(sql)) {
    var fid = myFid();
    cfReply(id, true, fid ? [{ user_id: fid }] : []); return;
  }

  if (/^UPDATE users SET settings=/i.test(sql)) {
    var snap = asSnap(p0(0));
    if (!snap) { cfReply(id, false, null); return; }
    putWithOutbox(snap, null, function (ok) { cfReply(id, ok, []); }); return;
  }
  if (/^UPDATE users SET sync=/i.test(sql)) {
    var want = (p0(0) === 1 || p0(0) === '1' || p0(0) === true) ? 1 : 0;
    apiGetRow(function (r) {
      if (r === null) { cfReply(id, false, null); return; }   /* офлайн — не затираємо нічого */
      var s0 = null;
      try { s0 = JSON.parse(r.settings || 'null'); } catch (e) {}
      if (!snapOk(s0)) s0 = { g: {}, n: { on: true, min: 5, snd: true, off: false }, th: 'standard', z: 'app', t: Date.now(), v: VER, sync: want };
      s0.sync = want; s0.t = Date.now();
      putWithOutbox(s0, null, function (ok) { cfReply(id, ok, []); });
    }); return;
  }

  if (/^INSERT INTO users \(user_id, name, email, pic, ts, logins, created, settings, sver, sts\)/i.test(sql)) {
    var up = { name: String(p0(1) || ''), email: String(p0(2) || ''), pic: String(p0(3) || '') };
    var ds = asSnap(p0(7));
    apiGetRow(function (cur) {
      if (cur === null) { cfReply(id, false, null); return; }   /* офлайн — ретрай застосунку */
      var exists = false;
      try { exists = !!(cur.settings && snapOk(JSON.parse(cur.settings))); } catch (e) {}
      if (exists) { cfReply(id, true, []); return; }            /* рядок уже є — ON CONFLICT НЕ чіпає settings */
      if (!ds) { cfReply(id, true, []); return; }
      ds.t = Date.now(); ds.v = VER; ds.sync = 1;
      putWithOutbox(ds, up, function (ok) { cfReply(id, ok, []); });
    }); return;
  }
  if (/^INSERT INTO users \(user_id, settings, sver, sts, email, name, pic, ts\)/i.test(sql)) {
    var s2 = asSnap(p0(1));
    if (!s2) { cfReply(id, false, null); return; }
    putWithOutbox(s2, { email: String(p0(4) || ''), name: String(p0(5) || ''), pic: String(p0(6) || '') },
      function (ok) { cfReply(id, ok, []); });
    return;
  }

  cfReply(id, true, []);   // невідомий запит — успішно й порожньо
}

/* ─────────── ВХІД: Google Identity Services ПРЯМО НА СТОРІНЦІ ───────────
   Точнісінько як на сайті 3.5.12 (він працював): initTokenClient ->
   access_token -> userinfo -> /api/auth/google (бекенд обмінює на Firebase
   idToken/refreshToken) -> профіль у RTDB update/auth_cb/<state> — канал
   входу ЗАСТОСУНКІВ, далі все робить власний код програми. */
function ensureGis(fn) {
  if (window.google && window.google.accounts && window.google.accounts.oauth2) { fn(); return; }
  var tries = 0;
  (function wait() {
    if (window.google && window.google.accounts && window.google.accounts.oauth2) { fn(); return; }
    if (++tries > 60) { agErr('Не вдалося завантажити Google-вхід. Перевір інтернет і спробуй ще раз.'); return; }
    setTimeout(wait, 150);
  })();
}
function agStat(msg, cls) {
  try { if (typeof setAgStat === 'function') setAgStat(msg, cls); return; } catch (e) {}
  try { if (cls === 'err' && typeof agFail === 'function') agFail(msg); } catch (e2) {}
}
/* 3.5.19: ПІСЛЯ ВИБОРУ АКАУНТА GOOGLE — ОДРАЗУ ЕКРАН ЗАВАНТАЖЕННЯ
   (просив власник: «чтобы не было текста „перевіряємо аккаунт“ — сразу
   появлялся экран загрузки, и во время него оно всё проверяло»).
   webDlStart піднімає #boot НАД гейтом (body.dl-over, z 320 > 260/230),
   далі показує звичайний сплеш із смугою прогресу; усі перевірки
   (профіль -> бекенд -> auth_cb -> прийом) ідуть ПІД ним, жодних текстів. */
function webDlStart() {
  try { document.body.classList.add('dl-over'); } catch (eD1) {}
  try { if (typeof showDataLoad === 'function') showDataLoad(); } catch (eD2) {}
}
function webDlStop() {
  try { if (typeof hideDataLoad === 'function') hideDataLoad(); } catch (eD3) {}
  try { setTimeout(function () { try { document.body.classList.remove('dl-over'); } catch (eD4) {} }, 1200); } catch (eD5) {}
}
function agErr(msg) {
  webDlStop();
  agStat(msg, 'err');
  try { var gb = document.getElementById('agGo'); if (gb) gb.disabled = false; } catch (e) {}
}
function webLogin(st) {
  try {
    /* бекап старої сесії — новий вхід НЕ знищить rtok до підтвердження */
    try {
      var u0 = jget('fh_user');
      if (u0 && u0.rtok && !(sessGet() && sessGet().rtok)) sessSave({ tok: String(u0.tok || ''), rtok: String(u0.rtok), tokT: parseInt(u0.tokT, 10) || 0, sub: String(u0.sub || ''), email: String(u0.email || '') });
    } catch (eB) {}
    st = String(st || '');
    if (!st) { agErr('Не вдалося почати вхід. Спробуй ще раз.'); return; }
    agStat('<span class="spin"></span>Відкриваю вибір акаунта…');
    ensureGis(function () {
      try {
        var tc = google.accounts.oauth2.initTokenClient({
          client_id: GIS_CLIENT,
          scope: 'openid email profile',
          prompt: 'select_account',
          callback: function (resp) {
            if (!resp || !resp.access_token) { agErr('Google не повернув доступ. Натисни кнопку ще раз.'); return; }
            /* 3.5.19: акаунт вибрано — МИТТЄВО екран завантаження (без текстів
               «Перевіряємо акаунт…»/«Заходимо…»): усе далі — під сплешем */
            try { setAgStat(''); } catch (eClr) {}
            webDlStart();
            var at = String(resp.access_token);
            fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { 'Authorization': 'Bearer ' + at } })
              .then(function (r) { return r.json(); })
              .then(function (p) {
                if (!p || !p.sub) { agErr('Не вдалося прочитати профіль Google. Спробуй ще раз.'); return; }
                var name = String(p.name || ''), email = String(p.email || '');
                if (!name && email) name = email.split('@')[0];
                /* 3.5.12: бекенд обмінює Google-токен на Firebase (localId +
                   idToken + refreshToken) — той самий виклик, що на старому сайті */
                fetch(BACKEND + '/api/auth/google', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: at })
                }).then(function (r) { return r.json(); }).catch(function () { return null; })
                  .then(function (j) {
                    if (!j || !j.localId) { agErr('Сервер входу не відповів. Спробуй ще раз за хвилину.'); return; }
                    var exp = parseInt(j.expiresIn, 10) || 3600;
                    tokState = {
                      tok: String(j.idToken || ''),
                      rtok: String(j.refreshToken || ''),
                      tokT: Date.now() + exp * 1000 - 120000,
                      sub: String(p.sub), email: email
                    };
                    sessSave(tokState);
                    /* профіль у канал входу застосунків: програма сама його
                       забере (authPollDb -> authAccept) і зареєструє в базі */
                    var node = {
                      d: {
                        sub: String(p.sub), name: name, email: email,
                        picture: String(p.picture || ''), fid: String(j.localId),
                        tok: at   /* legacy-шлях ПК (2.8.7): добудова fid */
                      },
                      rtok: tokState.rtok, tokT: tokState.tokT, t: Date.now()
                    };
                    fetch(DB_URL + '/update/auth_cb/' + encodeURIComponent(st) + '.json', {
                      method: 'PUT', body: JSON.stringify(node)
                    }).catch(function () {});
                    /* 3.5.19: жодного «Заходимо…» — екран завантаження вже показано */
                  });
              })
              .catch(function () { agErr('Немає зв’язку з Google. Перевір інтернет і спробуй ще раз.'); });
          },
          error_callback: function (e) {
            var t = (e && e.type) || '';
            if (t === 'popup_closed' || t === 'popup_closed_by_user' || t === 'dismissed') agErr('Вхід скасовано. Натисни кнопку ще раз.');
            else if (t === 'popup_failed_to_open' || t === 'popup_blocked') agErr('Браузер заблокував вікно Google. Дозволь сплив-вікна й спробуй ще раз.');
            else if (t === 'access_denied') agErr('Доступ не надано. Натисни кнопку ще раз і дозволь доступ.');
            else agErr('Не вдалося увійти. Спробуй ще раз.');
          }
        });
        tc.requestAccessToken();
      } catch (eI) { agErr('Не вдалося відкрити вхід. Спробуй ще раз.'); }
    });
  } catch (e) { agErr('Не вдалося почати вхід. Спробуй ще раз.'); }
}

/* 3.5.20: «Запуск Zoom» більше НЕ вирізається з розмітки — картка
   #secZoom просто ховається CSS'ом вище (iPhone — завжди, Mac — поки
   користувач не бета-адмін). Так картку можна ПОКАЗАТИ назад одразу,
   щойно бета-прапорець доїде з бази (body.fh-beta), без перезавантаження. */

/* 3.5.19: СПОВІЩЕННЯ НА САЙТІ НЕМАЄ (просив власник: «убери функцию
   сповіщення про початок уроку в веб-версии — она только на Андроиде
   и Windows»). webNotify і планування notifTimers видалено повністю;
   міст каже, що дозвіл начебто є — жодних банерів/рамок дозволу. */

/* ───────────────────── сам міст ───────────────────── */
window.AndroidHost = {
  ver: function () { return VER; },
  isWeb: function () { return true; },
  open: function (u) {
    try {
      u = String(u || '');
      if (u.indexOf('zoommtg://') === 0 || u.indexOf('zoomus://') === 0) {
        var m = u.match(/\/j\/(\d{5,})/);
        var pwd = (u.match(/[?&]pwd=([^&]+)/) || [])[1];
        u = m ? ('https://app.zoom.us/wc/' + m[1] + '/join?ref_from=launch&fromPWA=1' + (pwd ? '&pwd=' + pwd : ''))
              : 'https://zoom.us/join';
      }
      if (u.indexOf('http') !== 0) return;
      window.open(u, '_blank', 'noopener');
    } catch (e) {}
  },
  copy: function (t) {
    try { navigator.clipboard.writeText(String(t || '')); return true; } catch (e) {}
    try {
      var ta = document.createElement('textarea');
      ta.value = String(t || '');
      ta.style.cssText = 'position:fixed;left:-9px;top:-9px;opacity:0';
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand('copy');
      ta.remove(); return ok;
    } catch (e2) { return false; }
  },
  login: function (st) { webLogin(st); },
  logout: function () {
    try { localStorage.removeItem('fh_user'); } catch (e) {}
    try { localStorage.removeItem('fh_web_session'); } catch (e2) {}
    try { localStorage.removeItem('fh_rtok_backup'); } catch (e5) {}
    try { localStorage.removeItem('fh_outbox'); } catch (e6) {}
    tokState = null;
    setTimeout(function () { try { location.reload(); } catch (e3) {} }, 350);
  },
  fbPut: function (path, body) {
    var obj = null;
    try { obj = JSON.parse(body); } catch (e) { obj = body; }
    return rtdbSync('put', normPath(path), obj);
  },
  fbDel: function (path) {
    return rtdbSync('delete', normPath(path), null);
  },
  cfq: function (id, payload) {
    var pl = null;
    try { pl = JSON.parse(payload); } catch (e) {}
    if (!pl) { cfReply(id, false, null); return; }
    cfRoute(id, pl);
  },
  hasNotifPerm: function () {
    /* 3.5.19: на сайті сповіщень нема — «дозвіл начебто є», щоб банери
       і рамки дозволу ніколи не показувались (сама функція прибрана) */
    return true;
  },
  requestNotifPerm: function () {},
  setNotif: function () {
    /* 3.5.19: на сайті нічого не плануємо — заглушка */
  },
  testNotif: function () {
    /* 3.5.19: тесту сповіщення на сайті нема */
  },
  devInfo: function () {
    try {
      return JSON.stringify({
        type: 'web', model: 'Браузер', os: (navigator.platform || ''),
        ver: VER, mem: (navigator.deviceMemory || 0),
        lang: (navigator.language || ''), ua: String(navigator.userAgent || '').slice(0, 90)
      });
    } catch (e) { return '{}'; }
  },
  canInstall: function () { return true; },
  openInstallSettings: function () {},
  prewarm: function () {},
  markLesson: function () {},
  upd: function () {
    /* веб-сторінка оновлюється сама: новий деплой = нова версія.
       3.5.23: страховка — для однієї версії перезавантаження ОДИН раз
       за сесію, щоб ніколи не виходило циклу оновлень. */
    try {
      var uk = 'fh_webupd_' + VER;
      if (sessionStorage.getItem(uk)) return;
      sessionStorage.setItem(uk, '1');
    } catch (eU) {}
    setTimeout(function () { try { location.reload(); } catch (e) {} }, 300);
  },
  theme: function () {}
};
})();

/* ============================================================
   3.5.21: URL-ХЕШІ ВКЛАДОК АНГЛІЙСЬКОЮ (просив власник: «в URL
   название вкладки, например, розклад, налаштування, пиши на
   английском, чтобы оно всё менялось»).
   Перемикання вкладок оновлює адресу:
     Розклад      -> #schedule
     Налаштування -> #settings
     Профіль      -> #account
     Адмін        -> #admin
   А на старті хеш із посилання відкриває потрібну вкладку одразу
   (наприклад, fluxhelper.pages.dev/main#settings -> Налаштування).
   ТІЛЬКИ САЙТ: у застосунках (APK/EXE) webhost.js відсутній,
   там адреси нема і нічого не змінюється.
   ============================================================ */
(function () {
  var TABS = { schedule: 1, settings: 1, account: 1, admin: 1 };
  /* 3.5.26: знімок вкладки НА СТАРТІ — якщо живий хеш десь затерся,
     відновлення іде за ним (фікс «перезавантаження скидає на Розклад») */
  var BOOT_TAB = (function () {
    try { var h0 = String(location.hash || '').replace(/^#/, ''); return TABS[h0] ? h0 : ''; }
    catch (e0) { return ''; }
  })();
  function setHash(name) {
    try {
      /* 3.5.26: під час бута хеш НЕ перезаписуємо — інакше стартовий
         showMain() затирає #settings до __fhHashApply, і після
         перезавантаження користувача викидає на Розклад */
      var b0 = (window.__fh && window.__fh.boot) ? window.__fh.boot() : null;
      if (b0 && !b0.revealed) return;
      if (TABS[name] && location.hash !== '#' + name) {
        history.replaceState(null, '', location.pathname + location.search + '#' + name);
      }
    } catch (e) {}
  }
  function wrap(fname, hname) {
    try {
      var f = window[fname];
      if (typeof f !== 'function' || f.__fhHash) return;
      var g = function () { var r = f.apply(this, arguments); setHash(hname); return r; };
      g.__fhHash = true;
      window[fname] = g;
    } catch (e) {}
  }
  function applyHash() {
    try {
      var h = String(location.hash || '').replace(/^#/, '');
      if (!TABS[h]) h = BOOT_TAB;   /* 3.5.26: живий хеш затерто — беремо стартовий */
      if (!TABS[h]) return;
      if (h === 'schedule' && typeof window.showMain === 'function') window.showMain();
      else if (h === 'settings' && typeof window.showSetup === 'function') window.showSetup();
      else if (h === 'account' && typeof window.showAcc === 'function') {
        var acc = null;
        try { acc = (typeof ACC !== 'undefined') ? ACC : null; } catch (eA) {}
        if (acc && acc.user) window.showAcc();
      }
      else if (h === 'admin' && typeof window.admShow === 'function') window.admShow();
    } catch (e) {}
  }
  /* 3.5.23: ui.js викликає це ПІСЛЯ синк-продовжень старту — інакше
     перезавантаження на вкладці «Профіль» перекидало назад на Розклад */
  window.__fhHashApply = applyHash;
  window.addEventListener('load', function () {
    wrap('showMain', 'schedule');
    wrap('showSetup', 'settings');
    wrap('showAcc', 'account');
    wrap('admShow', 'admin');
    /* відкриваємо вкладку з посилання, щойно стартовий екран зник */
    var t = 0, tries = 0;
    var tick = setInterval(function () {
      ++tries;
      try {
        var b = (window.__fh && window.__fh.boot) ? window.__fh.boot() : null;
        if ((b && (b.revealed || b.p >= 100)) || tries > 12) { clearInterval(tick); applyHash(); }
      } catch (e) { clearInterval(tick); }
    }, 350);
    setTimeout(function () { clearInterval(tick); applyHash(); }, 4500);   /* гарантія */
  });
})();
