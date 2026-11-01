
































(function () {
'use strict';
var VER = '3.5.53';
var BACKEND = 'https://fluxhelper-backend.onrender.com';
var ORIGIN = 'https://fluxhelper.pages.dev';
var DB_URL = 'https://fluxhelper-1-default-rtdb.europe-west1.firebasedatabase.app';
var GIS_CLIENT = '668834523935-k470ldmdv0r9am0720v6lgaatm6rtuf3.apps.googleusercontent.com';

/* ── 3.5.53: ПРАВИЛО ВЛАСНИКА — база ЛИШЕ Cloudflare D1 ──────────────
   Firebase для бази даних більше НЕ використовуємо (вичерпані ліміти).
   Усі дані сайту йдуть у D1: спершу той самий origin (/api/ — Pages
   Functions, шлюз до D1), якщо функцій нема — бекенд (Render → D1).
   Легасі-записи у Firebase лишаються ТІЛЬКИ best-effort для старих
   версій застосунків (3.5.1/3.5.52 у полях), новий код від них не залежить. */
function fhApiFetch(path, opts, cb) {
  var done = false, replied = false;
  var fin = function (r) {
    if (done) return;
    if (r) { done = true; if (!replied) { replied = true; cb(r); } return; }
    /* null = цей канал не відповів — чекаємо наступний канал */
  };
  try {
    fetch('/api/' + path, opts).then(function (r) { fin(r.ok ? r : null); }).catch(function () { fin(null); });
  } catch (e0) { fin(null); }
  setTimeout(function () {
    if (done) return;
    try {
      fetch(BACKEND + '/api/' + path, opts).then(function (r) { fin(r.ok ? r : null); }).catch(function () { fin(null); });
    } catch (e1) { fin(null); }
  }, 2200);
  setTimeout(function () { if (!done && !replied) { replied = true; cb(null); } }, 9000);
}




var FB_KEY = 'AIzaSyCDWpF3QTMEFBN9ravDxH_woKnBpcMRDvI';

/* ── 3.5.52: ДІАГНОСТИКА ДЛЯ АДМІНА (без жодних секретів) ─────────────
   Хлібні крихти входу живуть у localStorage('fh_diag'); при зБОЯХ вишляються
   у D1 client_log через /api/diag (3.5.53) — адмін читає їх без юзера.
   Токени/паролі НЕ пишуться: тільки коди подій, версія, платформа,
   перші 8 символів id акаунта і email (не є секретом, показується в UI). */
var FHD = { buf: [], max: 40, t: 0 };
function fhLog(code, extra) {
  try {
    FHD.buf.push([Date.now(), String(code || ''), (extra === undefined || extra === null) ? '' : String(extra).slice(0, 80)]);
    while (FHD.buf.length > FHD.max) FHD.buf.shift();
    try { localStorage.setItem('fh_diag', JSON.stringify(FHD.buf)); } catch (eL52) {}
    if (/fail|err|rescue|guard/.test(String(code || ''))) {
      clearTimeout(FHD.t);
      FHD.t = setTimeout(function () { fhDiagFlush(String(code || '')); }, 2500);
    }
    if (String(code || '') === 'wl_ok') fhDiagFlush('ok');
  } catch (e) {}
}
function fhDiagSub8() {
  try { var u = jget('fh_user'); return (u && u.sub) ? String(u.sub).slice(0, 8) : ''; } catch (e52) { return ''; }
}
function fhDiagFlush(why) {
  try {
    if (!FHD.buf.length) return;
    var d = new Date();
    var id = d.getUTCFullYear() + ('0' + (d.getUTCMonth() + 1)).slice(-2) + ('0' + d.getUTCDate()).slice(-2) +
      '-' + ('0' + d.getUTCHours()).slice(-2) + ('0' + d.getUTCMinutes()).slice(-2) + ('0' + d.getUTCSeconds()).slice(-2) +
      '-' + Math.floor(Math.random() * 1296).toString(36);
    var u = jget('fh_user') || {};
    var pay = {
      t: Date.now(), why: String(why || '').slice(0, 24), id: id, ver: VER, plat: 'web',
      ua: String(navigator.userAgent || '').slice(0, 60), sub: fhDiagSub8(),
      em: String(u.email || '').slice(0, 60), ev: FHD.buf.slice(-40)
    };
    try { localStorage.setItem('fh_diag_last', id); } catch (eI52) {}
    /* 3.5.53: діаг → D1 client_log через /api/diag (заміна Firebase) */
    fhApiFetch('diag', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: [{ ts: parseInt(pay.t, 10) || Date.now(), sub: pay.sub, ver: VER, plat: 'web', code: 'diag:' + String(why || '').slice(0, 24), data: pay }] })
    }, function () {});
    return id;
  } catch (e) { return ''; }
}
/* 3.5.52: експонуємо — ui.js/панель діагностики мають користуватися ЦІЄЮ
   версією (з флашем у Firebase), а не локальним шімом без відправки */
window.fhLog = fhLog;
window.fhDiagFlush = fhDiagFlush;
function tokRefreshRT(rt, cb) {
  try {
    

    var ab = null;
    try { if (typeof AbortController === 'function') { ab = new AbortController(); setTimeout(function () { try { ab.abort(); } catch (eAB1) {} }, 3500); } } catch (eAB0) {}
    fetch('https://securetoken.googleapis.com/v1/token?key=' + FB_KEY, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: String(rt || '') }),
      signal: ab ? ab.signal : undefined
    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (j && j.id_token) cb({ idToken: String(j.id_token), refreshToken: String(j.refresh_token || rt), expiresIn: String(j.expires_in || '3600') });
      else cb(null);
    }).catch(function () { cb(null); });
  } catch (e) { cb(null); }
}


window.FH_WEB = true;








try {
  var st = document.createElement('style');
  













  st.textContent =
    '#neterr{display:none!important}' +
    '#bMin,#bClose,#btMin,#btClose{display:none!important}' +
    '#bnav{bottom:calc(12px + var(--fh-sab, env(safe-area-inset-bottom, 0px)))!important}' +   
    '#secNotif,#nban,#bPerm,#bTestN,#rowNotif{display:none!important}' +
    









    '.sw-duo.sw-col-b{display:none!important}' +
    '.sw-duo.sw-col-a{grid-column:1/-1!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:13px!important}' +
    '@media (max-width:699px){.sw-duo.sw-col-a{grid-template-columns:1fr!important}}' +
    '#secUpd{display:none!important}' +   
    'body:not(.fh-beta) .beta-only{display:none!important}' +
    
    '#secZAuto{display:none!important}';
  


  (document.head || document.documentElement).appendChild(st);
} catch (eS) {}


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
      var b = jget('fh_rtok_backup');   
      if (b && b.rtok) tokState = b;
    }
  } catch (e) {}
}
function ensureTok(cb) {
  bootTok();
  if (tokState && tokState.tok && tokState.tokT && Date.now() < tokState.tokT - 30000) { cb(true); return; }
  if (!tokState || !tokState.rtok) { cb(false); return; }
  try {
    
    tokRefreshRT(tokState.rtok, function (j) {
      if (j && j.idToken) {
        tokState.tok = String(j.idToken);
        tokState.rtok = String(j.refreshToken || tokState.rtok);
        var exp = parseInt(j.expiresIn, 10) || 3600;
        tokState.tokT = Date.now() + exp * 1000 - 120000;
        sessSave(tokState);
        cb(true);
      } else cb(false);
    });
  } catch (e) { cb(false); }
}

function ensureTokSync() {
  bootTok();
  if (tokState && tokState.tok && tokState.tokT && Date.now() < tokState.tokT - 30000) return true;
  if (!tokState || !tokState.rtok) return false;
  try {
    var x = new XMLHttpRequest();
    
    x.open('POST', 'https://securetoken.googleapis.com/v1/token?key=' + FB_KEY, false);
    x.setRequestHeader('Content-Type', 'application/json');
    x.send(JSON.stringify({ grant_type: 'refresh_token', refresh_token: tokState.rtok }));
    var j = null;
    try { j = JSON.parse(x.responseText); } catch (e) {}
    if (j && j.id_token) {
      tokState.tok = String(j.id_token);
      tokState.rtok = String(j.refresh_token || tokState.rtok);
      var exp = parseInt(j.expires_in, 10) || 3600;
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
    x.open(op.toUpperCase(), DB_URL + '/' + normPath(path) + '.json?auth=' + encodeURIComponent(tokState.tok), false);
    x.setRequestHeader('Content-Type', 'application/json');
    x.send((op === 'put' || op === 'patch') ? JSON.stringify(data === undefined ? null : data) : null);
    return x.status >= 200 && x.status < 300;
  } catch (e) { return false; }
}
function rtdbAsync(op, path, data, cb) {
  ensureTok(function (ok) {
    if (!ok || !tokState || !tokState.tok) { cb(null); return; }
    
    var init = { method: op.toUpperCase(), headers: { 'Content-Type': 'application/json' } };
    if (op === 'put' || op === 'patch') init.body = JSON.stringify(data === undefined ? null : data);
    


    var ab = null;
    try { if (typeof AbortController === 'function') { ab = new AbortController(); setTimeout(function () { try { ab.abort(); } catch (eRA1) {} }, 4000); } } catch (eRA0) {}
    init.signal = ab ? ab.signal : undefined;
    fetch(DB_URL + '/' + normPath(path) + '.json?auth=' + encodeURIComponent(tokState.tok), init)
      .then(function (r) { return r.ok ? r.text() : null; })
      .then(function (t) { var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) {} cb(d); })
      .catch(function () { cb(null); });
  });
}


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

function rawToSnap(j) {
  if (!j || typeof j !== 'object') return null;
  if (j.d && typeof j.d === 'object' && typeof j.d.settings === 'string') {
    try { var s = JSON.parse(j.d.settings); return (s && typeof s === 'object' && (s.g || s.n || s.th || s.z)) ? s : null; } catch (e) { return null; }
  }
  if (j.st && typeof j.st === 'object' && !j.g) j = j.st;
  return (j && typeof j === 'object' && (j.g || j.n || j.th || j.z)) ? j : null;
}


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




function apiGetRow(cb) {
  




  var done = false;
  var finish = function (row) { if (done) return; done = true; cb(row); };
  /* 3.5.53: D1 — ПЕРШЕ ДЖЕРЕЛО (правило власника: база лише Cloudflare).
     /api/data читає users з D1 (той самий рядок, що пишуть застосунки). */
  var k53 = myFid();
  if (k53) {
    fhApiFetch('data?uid=' + encodeURIComponent(k53), { cache: 'no-store' }, function (r) {
      if (done || !r) return;
      r.json().then(function (j) {
        if (done) return;
        if (j && j.ok) {
          finish(j.row ? {
            role: String((j.row && j.row.role) || 'user'),
            sync: (j.row && (j.row.sync === 0 || j.row.sync === '0')) ? 0 : 1,
            settings: String((j.row && j.row.settings) || ''),
            sts: parseInt(j.row && j.row.sts, 10) || 0
          } : null);
        }
        /* 3.5.53: row:null АБО збої каналу — НЕ завершуємо, питаємо легасі
           (дзеркало/Render): у частини акаунтів знімок досі лише там. */
      }).catch(function () {});
    });
  }

  var viaMirror = function () {
    var k = myFid();
    if (!k) { finish(null); return; }
    var wk = 'update/web/' + encodeURIComponent(k);
    var sk = 'update/settings_mirror/' + fbEncUid(k);
    
    var sa = null, sb = null, left = 2;
    var pick = function () {
      if (--left > 0) return;
      var a = rawToSnap(sa), b = rawToSnap(sb);
      var best = null;
      if (a && b) best = (((parseInt(b.t, 10) || 0) > (parseInt(a.t, 10) || 0)) ? b : a);
      else best = a || b;
      if (!best) { finish(null); return; }
      finish({
        role: String(best.r || 'user'),
        sync: (best.sync === 0 || best.sync === false || best.sync === '0') ? 0 : 1,
        settings: JSON.stringify(best),
        sts: parseInt(best.t, 10) || 0
      });
    };
    rtdbAsync('get', wk, null, function (a) { sa = a; pick(); });
    rtdbAsync('get', sk, null, function (b) { sb = b; pick(); });
  };
  ensureTok(function (ok) {
    if (!ok || !tokState || !tokState.tok) { viaMirror(); return; }
    var ab = null;
    try { if (typeof AbortController === 'function') { ab = new AbortController(); setTimeout(function () { try { ab.abort(); } catch (eA0) {} }, 3500); } } catch (eAB) {}
    fetch(BACKEND + '/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tokState.tok },
      body: JSON.stringify({ op: 'get' }),
      signal: ab ? ab.signal : undefined
    }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
      .then(function (j) {
        if (done) return;                          
        if (!j || !j.ok) { viaMirror(); return; }   
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
  
  try { viaMirror(); } catch (eM46) {}
}
function apiPutSnap(snap, profile, cb) {
  var done = function (ok) { cb(ok); };
  /* 3.5.53: D1 — ПЕРШИЙ КАНАЛ ПИСЬМА (база лише Cloudflare). Mirror/Render
     лишаються як легасі-страховка для старих читачів. */
  (function () {
    var k53 = myFid();
    if (!k53) return;
    try {
      fhApiFetch('data', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: k53, snap: snap, profile: profile || null })
      }, function () {});
    } catch (e53) {}
  })();
  

  var k0 = myFid();
  if (k0) {
    try {
      rtdbAsync('put', 'update/web/' + k0, snap, function () {});
      rtdbAsync('put', 'update/websts/' + k0, parseInt(snap.t, 10) || Date.now(), function () {});
    } catch (eM0) {}
  }
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
    try { rtdbAsync('put', 'update/websts/' + k, parseInt(snap.t, 10) || Date.now(), function () {}); } catch (eWS) {}
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
    outboxKick(4000);   
  });
}

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










var mirCache = { mark: -1, sts: 0, snap: null, snapT: 0, missT: 0 };
function mirStsCheck(cb) {
  var k = myFid();
  if (!k) { cb(null); return; }
  /* 3.5.53: D1 першим (правило власника) — mirror лише як фолбек */
  (function () {
    fhApiFetch('data?uid=' + encodeURIComponent(k), { cache: 'no-store' }, function (r) {
      if (!r) return;
      r.json().then(function (j) {
        if (j && j.ok) {
          var row = j.row;
          if (!row) { cb({ sts: 0, has: true }); return; }
          var st = parseInt(row.sts, 10) || 0;
          if (!st) {
            var sc = null;
            try { sc = JSON.parse(row.settings || 'null'); } catch (e53) {}
            st = (sc && parseInt(sc.t, 10)) || 0;
          }
          if (row.settings) { try { mirCache.snap = JSON.parse(row.settings); mirCache.sts = st; mirCache.snapT = Date.now(); } catch (e54) {} }
          cb({ sts: st, has: true });
        }
        /* null/!ok -> мовчки йдемо в легасі-гілку нижче */
      }).catch(function () {});
    });
  })();
  if (mirCache.snapT && Date.now() - mirCache.snapT < 15000) { cb({ sts: mirCache.sts, has: true }); return; }
  fetch(DB_URL + '/update/websts/' + k + '.json?cb=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (v) {
      var m = parseInt(v, 10) || 0;
      if (m === mirCache.mark && (mirCache.snapT || mirCache.missT) && Date.now() - Math.max(mirCache.snapT, mirCache.missT) < 300000) {
        cb({ sts: mirCache.sts, has: true }); return;
      }
      mirCache.mark = m;
      if (m === 0) mirCache.missT = Date.now();
      fetch(DB_URL + '/update/web/' + k + '.json?cb=' + Date.now(), { cache: 'no-store' })
        .then(function (r2) { return r2.ok ? r2.json() : null; })
        .then(function (snap) {
          if (snap && typeof snap === 'object' && snapOk(snap)) {
            mirCache.snap = snap; mirCache.sts = parseInt(snap.t, 10) || 0; mirCache.snapT = Date.now();
            cb({ sts: mirCache.sts, has: true });
          } else cb({ sts: 0, has: true });   
        })
        .catch(function () { cb(null); });
    })
    .catch(function () { cb(null); });
}
function mirSnap(cb) {
  var k = myFid();
  if (!k) { cb(null); return; }
  /* 3.5.53: D1 першим (правило власника) — mirror лише як фолбек */
  (function () {
    fhApiFetch('data?uid=' + encodeURIComponent(k), { cache: 'no-store' }, function (r) {
      if (!r) return;
      r.json().then(function (j) {
        if (j && j.ok && j.row && j.row.settings) {
          var sc = null;
          try { sc = JSON.parse(j.row.settings); } catch (e53) {}
          if (snapOk(sc)) {
            mirCache.snap = sc; mirCache.sts = parseInt(sc.t, 10) || parseInt(j.row.sts, 10) || 0; mirCache.snapT = Date.now();
            cb(JSON.stringify(sc));
            return;
          }
        }
      }).catch(function () {});
    });
  })();
  if (mirCache.snap && mirCache.snapT && Date.now() - mirCache.snapT < 10000) { cb(JSON.stringify(mirCache.snap)); return; }
  fetch(DB_URL + '/update/web/' + k + '.json?cb=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (snap) {
      if (snap && typeof snap === 'object' && snapOk(snap)) {
        mirCache.snap = snap; mirCache.sts = parseInt(snap.t, 10) || 0; mirCache.snapT = Date.now();
        cb(JSON.stringify(snap));
      } else cb(null);
    })
    .catch(function () { cb(null); });
}
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
  
  if (/^SELECT settings FROM users/i.test(sql)) { mirSnap(function (s) { cfReply(id, s !== null, s ? [{ settings: s }] : []); }); return; }
  if (/^SELECT sts FROM users/i.test(sql)) { mirStsCheck(function (r) { cfReply(id, r !== null, r ? [{ sts: r.sts }] : []); }); return; }
  if (/^SELECT user_id FROM users WHERE user_id=/i.test(sql)) {
    
    apiGetRow(function (r) {
      if (r === null) { cfReply(id, false, null); return; }   
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
      if (r === null) { cfReply(id, false, null); return; }   
      var s0 = null;
      try { s0 = JSON.parse(r.settings || 'null'); } catch (e) {}
      if (!snapOk(s0)) s0 = { g: {}, n: { on: true, min: 5, snd: true, off: false }, th: 'standard', z: 'app', t: Date.now(), v: VER, sync: want };
      s0.sync = want; s0.t = Date.now();
      putWithOutbox(s0, null, function (ok) { cfReply(id, ok, []); });
    }); return;
  }

  if (/^INSERT INTO users \(user_id, name, email, pic, ts, logins, created, settings, sver, sts\)/i.test(sql)) {
    var up = { name: String(p0(1) || ''), email: String(p0(2) || ''), pic: String(p0(3) || '') };
    var ds = asSnap(p0(6));   /* 3.5.51: settings = 7-й параметр (индекс 6), был 7 — потому строка и не создавалась */
    apiGetRow(function (cur) {
      /* 3.5.51: строка ещё НЕ существует — СОЗДАЁМ её (раньше новый пользователь сайта не мог зарегистрироваться и вечно грузился */
      if (cur === null) {
        if (!ds) { cfReply(id, true, []); return; }
        ds.t = Date.now(); ds.v = VER; ds.sync = 1;
        putWithOutbox(ds, up, function (ok) { cfReply(id, ok, []); });
        return;
      }
      var exists = false;
      try { exists = !!(cur.settings && snapOk(JSON.parse(cur.settings))); } catch (e) {}
      if (exists) { cfReply(id, true, []); return; }            
      if (!ds) { cfReply(id, true, []); return; }
      ds.t = Date.now(); ds.v = VER; ds.sync = 1;
      putWithOutbox(ds, up, function (ok) { cfReply(id, ok, []); });
    }); return;
  }
  /* 3.5.51: проверка существования строки после INSERT (usersUpsert-verify) */
  if (/^SELECT user_id FROM users WHERE user_id=\?/i.test(sql)) {
    apiGetRow(function (r) { cfReply(id, r !== null, r ? [{ user_id: myFid() }] : []); }); return;
  }
  if (/^INSERT INTO users \(user_id, settings, sver, sts, email, name, pic, ts\)/i.test(sql)) {
    var s2 = asSnap(p0(0));   /* 3.5.51: settings = индекс 0 (был 1), профиль — 3/4/5 (было 4/5/6) */
    if (!s2) { cfReply(id, false, null); return; }
    putWithOutbox(s2, { email: String(p0(3) || ''), name: String(p0(4) || ''), pic: String(p0(5) || '') },
      function (ok) { cfReply(id, ok, []); });
    return;
  }

  cfReply(id, true, []);   
}






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
    
    try {
      var u0 = jget('fh_user');
      if (u0 && u0.rtok && !(sessGet() && sessGet().rtok)) sessSave({ tok: String(u0.tok || ''), rtok: String(u0.rtok), tokT: parseInt(u0.tokT, 10) || 0, sub: String(u0.sub || ''), email: String(u0.email || '') });
    } catch (eB) {}
    st = String(st || '');
    if (!st) { agErr('Не вдалося почати вхід. Спробуй ще раз.'); return; }
    agStat('<span class="spin"></span>Відкриваю вибір акаунта…');
    fhLog('wl_open');
    ensureGis(function () {
      try {
        var tc = google.accounts.oauth2.initTokenClient({
          client_id: GIS_CLIENT,
          scope: 'openid email profile',
          prompt: 'select_account',
          callback: function (resp) {
            if (!resp || !resp.access_token) { agErr('Google не повернув доступ. Натисни кнопку ще раз.'); return; }
            

            try { setAgStat(''); } catch (eClr) {}
            webDlStart();
            fhLog('wl_gis');
            var at = String(resp.access_token);
            fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { 'Authorization': 'Bearer ' + at } })
              .then(function (r) { return r.json(); })
              .then(function (p) {
                if (!p || !p.sub) { agErr('Не вдалося прочитати профіль Google. Спробуй ще раз.'); return; }
                var name = String(p.name || ''), email = String(p.email || '');
                if (!name && email) name = email.split('@')[0];
                

                
                /* 3.5.51: правильный формат postBody для identitytoolkit: JWT если есть,
                   иначе access_token=, + один ретрай другим форматом (раньше access-токен
                   всегда шёл в id_token= — вход часто зацикливался) */
                var idTok0 = '';
                try { if (resp.id_token && String(resp.id_token).split('.').length === 3) idTok0 = String(resp.id_token); } catch (eIT0) {}
                /* 3.5.52 ГОЛОВНИЙ ФІКС САЙТУ: identitytoolkit вимагає providerId
                   у postBody — стара робоча auth-сторінка завжди шлала
                   «…&providerId=google.com», а 3.5.49-3.5.51 шла БЕЗ нього, тому
                   Firebase відповідала INVALID_CREDENTIAL_OR_PROVIDER_ID навіть із
                   валідним токеном (цикл «до 100% і знову екран входу»).
                   Крок 3 — фолбек FluxHelper Backend /api/auth/google (виклик
                   старого сайту 3.5.12-3.5.39): обмін через Firebase Admin SDK
                   без API-ключа — працює навіть якщо Google обмежив ключ. */
                fhLog('wl_ui', String(p.sub || '').slice(0, 8));
                var fin52 = null;
                var after52 = function (j) {
                  if (j && j.localId) { fhLog('wl_exch_ok'); fin52(j); return; }
                  fhLog('wl_relay');
                  try {
                    fetch(BACKEND + '/api/auth/google', {
                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token: at })
                    }).then(function (r) { return r.json(); }).catch(function () { return null; }).then(function (j2) {
                      if (j2 && j2.localId) { fhLog('wl_relay_ok'); fin52(j2); return; }
                      fhLog('wl_exch_fail');
                      agErr('Сервер входу не відповів. Спробуй ще раз за хвилину.');
                    });
                  } catch (eR52) { fhLog('wl_relay_err'); agErr('Сервер входу не відповів. Спробуй ще раз за хвилину.'); }
                };
                fin52 = function (j) {
                    if (!j || !j.localId) { after52(j); return; }
                    var exp = parseInt(j.expiresIn, 10) || 3600;
                    tokState = {
                      tok: String(j.idToken || ''),
                      rtok: String(j.refreshToken || ''),
                      tokT: Date.now() + exp * 1000 - 120000,
                      sub: String(p.sub), email: email
                    };
                    sessSave(tokState);
                    try {
                      if (window.__fh && typeof window.__fh.authOk === 'function') {
                        window.__fh.authOk({ sub: String(p.sub), name: name, email: email, pic: String(p.picture || ''), fid: String(j.localId), tok: String(j.idToken || at), rtok: String(j.refreshToken || ''), tokT: tokState.tokT });
                      }
                    } catch (eAO49) {}
                    try { rtdbSync('delete', 'update/auth_cb/' + encodeURIComponent(st), null); } catch (eDEL49) {}
                  };
                var exch52 = function (pb, cb52) {
                  fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=' + FB_KEY, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postBody: pb, requestUri: 'http://localhost', returnSecureToken: true })
                  }).then(function (r) { return r.json(); }).catch(function () { return null; }).then(cb52);
                };
                exch52(idTok0 ? ('id_token=' + encodeURIComponent(idTok0) + '&providerId=google.com') : ('access_token=' + encodeURIComponent(at) + '&providerId=google.com'), after52);
              })
              .catch(function () { agErr('Немає зв’язку з Google. Перевір інтернет і спробуй ще раз.'); });
          },
          error_callback: function (e) {
            var t = (e && e.type) || '';
            fhLog('wl_gis_err', t);
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
    

    return true;
  },
  requestNotifPerm: function () {},
  setNotif: function () {
    
  },
  testNotif: function () {
    
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















(function () {
  var TABS = { schedule: 1, settings: 1, account: 1, admin: 1 };
  

  var BOOT_TAB = (function () {
    try { var h0 = String(location.hash || '').replace(/^#/, ''); return TABS[h0] ? h0 : ''; }
    catch (e0) { return ''; }
  })();
  function setHash(name) {
    try {
      


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
      if (!TABS[h]) h = BOOT_TAB;   
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
  

  window.__fhHashApply = applyHash;
  window.addEventListener('load', function () {
    wrap('showMain', 'schedule');
    wrap('showSetup', 'settings');
    wrap('showAcc', 'account');
    wrap('admShow', 'admin');
    
    var t = 0, tries = 0;
    var tick = setInterval(function () {
      ++tries;
      try {
        var b = (window.__fh && window.__fh.boot) ? window.__fh.boot() : null;
        if ((b && (b.revealed || b.p >= 100)) || tries > 12) { clearInterval(tick); applyHash(); }
      } catch (e) { clearInterval(tick); }
    }, 350);
    setTimeout(function () { clearInterval(tick); applyHash(); }, 4500);   
  });
})();
