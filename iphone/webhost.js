/* ============================================================
   FluxHelper — ВЕБ-МІСТ (webhost.js)
   ============================================================
   Сторінки сайту (/iphone/ — телефонний UI з APK, /mac/ — десктопний
   UI з Windows-програми) виконують ТОЙ САМИЙ код інтерфейсу, що й
   застосунки. Застосунки спілкуються з системою через нативний міст
   window.AndroidHost; на сайті його імітує цей файл:

     ver / open / copy / login / logout
     fbPut / fbDel   -> FluxHelper Backend /api/rtdb (токен користувача)
     cfq             -> SQL-запити D1 мапляться на /api/sync + /api/rtdb
     notif-*         -> Web Notification API (поки сторінка відкрита)
     upd             -> сторінка сайту завжди найсвіжіша (перезавантаження)

   Сесія: localStorage fh_web_session (пишє auth.html після входу) або
   старі сесії сайту з fh_user.rtok — обидва оновлюються через
   /api/auth/refresh. Так акаунт, групи й тема їдуть між сайтом,
   Android та Windows без перелогіну.
   ============================================================ */
(function () {
'use strict';
var VER = '3.5.16';
var BACKEND = 'https://fluxhelper-backend.onrender.com';
var ORIGIN = 'https://fluxhelper.pages.dev';

window.FH_WEB = true;

/* ───────────────────────── сесія ───────────────────────── */
var tokState = null;
function sessGet() {
  try { return JSON.parse(localStorage.getItem('fh_web_session') || 'null'); } catch (e) { return null; }
}
function sessSave(s) { try { localStorage.setItem('fh_web_session', JSON.stringify(s)); } catch (e) {} }
function bootTok() {
  if (tokState) return;
  var s = sessGet();
  if (s && s.rtok) { tokState = s; return; }
  try {
    var u = JSON.parse(localStorage.getItem('fh_user') || 'null');
    if (u && u.rtok) tokState = { tok: String(u.tok || ''), rtok: String(u.rtok), tokT: parseInt(u.tokT, 10) || 0 };
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

/* ───────────────────── Firebase->bridge формат ───────────────────── */
function normPath(p) {
  var s = String(p || '').replace(/\.json(\?.*)?$/, '');
  if (s.charAt(0) === '/') s = s.slice(1);
  return s;
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

/* /api/sync op:get -> один «рядок D1» */
function apiGetRow(cb) {
  ensureTok(function (ok) {
    if (!ok || !tokState || !tokState.tok) { cb(null); return; }
    fetch(BACKEND + '/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tokState.tok },
      body: JSON.stringify({ op: 'get' })
    }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
      .then(function (j) {
        if (!j || !j.ok) { cb(null); return; }
        var set = (j.settings && typeof j.settings === 'object') ? j.settings : null;
        var setStr = set ? JSON.stringify(set) : '';
        cb({
          role: String(j.role || 'user'),
          sync: (j.sync === 0 || j.sync === false || j.sync === '0') ? 0 : 1,
          settings: setStr,
          sts: parseInt((set && set.t) || j.sts, 10) || 0
        });
      });
  });
}
function apiPutSnap(snap, profile, cb) {
  ensureTok(function (ok) {
    if (!ok || !tokState || !tokState.tok) { cb(false); return; }
    fetch(BACKEND + '/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tokState.tok },
      body: JSON.stringify({ op: 'put', snapshot: snap, profile: profile || null })
    }).then(function (r) { cb(!!r.ok); }).catch(function () { cb(false); });
  });
}
function myFid() {
  try {
    var u = JSON.parse(localStorage.getItem('fh_user') || 'null');
    return (u && u.fid) ? String(u.fid) : '';
  } catch (e) { return ''; }
}

/* мапінг відомих SQL-запитів інтерфейсу на бекенд */
function cfRoute(id, payload) {
  var sql = '', params = [];
  try { sql = String(payload.sql || ''); params = payload.params || []; } catch (e) { cfReply(id, true, []); return; }
  var p0 = function (i) { return params.length > i ? params[i] : null; };
  var asSnap = function (v) {
    if (v && typeof v === 'object') return v;
    try { var q = JSON.parse(v); return (q && typeof q === 'object') ? q : null; } catch (e) { return null; }
  };

  if (/^CREATE TABLE/i.test(sql) || /^DROP TABLE/i.test(sql) || /^ALTER TABLE/i.test(sql)) { cfReply(id, true, []); return; }
  if (/^DELETE FROM users/i.test(sql)) { cfReply(id, true, []); return; }
  if (/^INSERT INTO device/i.test(sql)) { cfReply(id, true, []); return; }

  if (/^SELECT role, sync, settings, sts FROM users/i.test(sql)) { apiGetRow(function (r) { cfReply(id, true, r ? [r] : []); }); return; }
  if (/^SELECT role, sync FROM users/i.test(sql)) {
    apiGetRow(function (r) { cfReply(id, true, r ? [{ role: r.role, sync: r.sync }] : []); }); return;
  }
  if (/^SELECT settings FROM users/i.test(sql)) { apiGetRow(function (r) { cfReply(id, true, r ? [{ settings: r.settings }] : []); }); return; }
  if (/^SELECT sts FROM users/i.test(sql)) { apiGetRow(function (r) { cfReply(id, true, r ? [{ sts: r.sts }] : []); }); return; }
  if (/^SELECT user_id FROM users WHERE user_id=/i.test(sql)) { cfReply(id, true, [{ user_id: String(p0(0) || '') }]); return; }
  if (/^SELECT user_id FROM users WHERE email=/i.test(sql)) {
    var fid = myFid();
    cfReply(id, true, fid ? [{ user_id: fid }] : []); return;
  }

  if (/^UPDATE users SET settings=/i.test(sql)) {
    var snap = asSnap(p0(0));
    if (!snap) { cfReply(id, true, []); return; }
    apiPutSnap(snap, null, function () { cfReply(id, true, []); }); return;
  }
  if (/^UPDATE users SET sync=/i.test(sql)) {
    var want = (p0(0) === 1 || p0(0) === '1' || p0(0) === true) ? 1 : 0;
    apiGetRow(function (r) {
      var snap = null;
      try { snap = JSON.parse(r && r.settings ? r.settings : 'null'); } catch (e) {}
      if (!snapOk(snap)) snap = { g: {}, n: { on: true, min: 5, snd: true, off: false }, th: 'standard', z: 'app', t: Date.now(), v: VER, sync: want };
      snap.sync = want; snap.t = Date.now();
      apiPutSnap(snap, null, function () { cfReply(id, true, []); });
    }); return;
  }

  if (/^INSERT INTO users \(user_id, name, email, pic, ts, logins, created, settings, sver, sts\)/i.test(sql)) {
    var up = { name: String(p0(1) || ''), email: String(p0(2) || ''), pic: String(p0(3) || '') };
    var ds = asSnap(p0(7));
    apiGetRow(function (cur) {
      var exists = false;
      try { exists = !!(cur && cur.settings && snapOk(JSON.parse(cur.settings))); } catch (e) {}
      if (exists) { cfReply(id, true, []); return; }   // рядок уже є — ON CONFLICT НЕ чіпає settings
      if (!ds) { cfReply(id, true, []); return; }
      ds.t = Date.now(); ds.v = VER; ds.sync = 1;
      apiPutSnap(ds, up, function () { cfReply(id, true, []); });
    }); return;
  }
  if (/^INSERT INTO users \(user_id, settings, sver, sts, email, name, pic, ts\)/i.test(sql)) {
    var s2 = asSnap(p0(1));
    if (!s2) { cfReply(id, true, []); return; }
    apiPutSnap(s2, { email: String(p0(4) || ''), name: String(p0(5) || ''), pic: String(p0(6) || '') },
      function () { cfReply(id, true, []); });
    return;
  }

  cfReply(id, true, []);   // невідомий запит — успішно й порожньо
}

/* ───────────────────── сповіщення (поки сторінка відкрита) ───────────────────── */
var notifTimers = {};
function webNotify(title, text, url) {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      var n = new Notification(String(title || 'FluxHelper'), { body: String(text || ''), tag: 'fh-' + Date.now() });
      n.onclick = function () {
        try { window.focus(); } catch (e) {}
        if (url) { try { window.AndroidHost.open(url); } catch (e2) {} }
        try { n.close(); } catch (e3) {}
      };
      return true;
    }
  } catch (e) {}
  return false;
}

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
  login: function (st) {
    try {
      var w = window.open(ORIGIN + '/auth.html#s=' + encodeURIComponent(String(st || '')), 'fhauth',
                          'width=440,height=660,menubar=no,toolbar=no,location=yes,status=no');
      if (w) { try { w.focus(); } catch (e2) {} return; }
    } catch (e) {}
    try { location.href = ORIGIN + '/auth.html#s=' + encodeURIComponent(String(st || '')); } catch (e3) {}
  },
  logout: function () {
    try { localStorage.removeItem('fh_user'); } catch (e) {}
    try { localStorage.removeItem('fh_web_session'); } catch (e2) {}
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
    try { return ('Notification' in window) && Notification.permission === 'granted'; } catch (e) { return false; }
  },
  requestNotifPerm: function () {
    try {
      if (!('Notification' in window)) return;
      Notification.requestPermission().then(function () {}).catch(function () {});
    } catch (e) {}
  },
  setNotif: function (payload) {
    /* плануємо сповіщення, доки сторінка відкрита (фонові — лише в застосунках) */
    try {
      var j = JSON.parse(payload);
      var when = parseInt(j.when || j.t || j.at, 10) || 0;
      var key = String(j.key || j.name || '') + ':' + when;
      if (!when || when <= Date.now() || notifTimers[key]) return;
      notifTimers[key] = setTimeout(function () {
        delete notifTimers[key];
        webNotify(j.title || j.name || 'FluxHelper', j.text || j.body || '', j.url || '');
      }, Math.min(when - Date.now(), 2147000000));
    } catch (e) {}
  },
  testNotif: function (title, text, url) {
    if (!webNotify(title, text, url)) {
      try { document.body.setAttribute('data-theme', document.body.getAttribute('data-theme') || 'standard'); } catch (e) {}
      try {
        if (typeof toast === 'function') toast('Сповіщення: ' + String(text || title || ''));
        else alert(String(title || '') + '\n' + String(text || ''));
      } catch (e2) {}
    }
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
    /* веб-сторінка оновлюється сама: новий деплой = нова версія */
    setTimeout(function () { try { location.reload(); } catch (e) {} }, 300);
  },
  theme: function () {}
};
})();
