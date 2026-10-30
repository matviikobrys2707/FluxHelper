


















(function () {
  'use strict';
  var inApp = false;
  try { if (window.chrome && window.chrome.webview && window.chrome.webview.postMessage) inApp = true; } catch (e) {}
  try { if (window.AndroidHost && window.AndroidHost.ver) inApp = true; } catch (e2) {}
  if (inApp) { window.__FH_IN_APP__ = true; return; }

  window.__FH_LOCKED__ = true;
  var REL_URL = 'https://github.com/matviikobrys2707/FluxHelper/releases/download/v2.4.2/';
  var LOCK_CSS =
    '#fhLock{position:fixed;inset:0;z-index:2147483647;background:#050508;color:#eef0f8;' +
    'font-family:Segoe UI,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:24px}' +
    '#fhLock .c{max-width:520px;text-align:center;background:#101018;border:1px solid #26263a;border-radius:22px;' +
    'padding:34px 30px;box-shadow:0 24px 80px rgba(0,0,0,.6)}' +
    '#fhLock img{width:72px;height:72px;border-radius:18px;display:block;margin:0 auto 16px}' +
    '#fhLock .g{width:72px;height:72px;border-radius:18px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;' +
    'background:linear-gradient(135deg,#8b5cf6,#6366f1,#8b5cf6);font-size:38px}' +
    '#fhLock h1{font-size:21px;margin:0 0 10px}' +
    '#fhLock p{font-size:14px;line-height:1.55;color:#a8adc4;margin:0 0 22px}' +
    '#fhLock a{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:13px 16px;' +
    'border-radius:13px;font-size:14px;font-weight:600;text-decoration:none;margin-bottom:10px;' +
    'transition:transform .12s ease,filter .12s ease}' +
    '#fhLock a:hover{filter:brightness(1.12);transform:translateY(-1px)}' +
    '#fhLock .w{background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff}' +
    '#fhLock .a{background:#1c1c2a;color:#eef0f8;border:1px solid #33334a}' +
    '#fhLock .f{font-size:11.5px;color:#6b7089;margin:14px 0 0}' +
    '#fhLock{-webkit-user-select:none;user-select:none}';
  function capLogo() {
    try {
      var im = document.querySelector('img[src*="base64"], img[src$=".png"]');
      if (im && im.getAttribute('src')) return '<img alt="" src="' + im.getAttribute('src') + '">';
    } catch (e) {}
    return '<div class="g">\u26A1</div>';
  }
  function nuke() {
    try { var b = document.body; if (b) while (b.firstChild) b.removeChild(b.firstChild); } catch (e) {}
  }
  function draw() {
    var old = document.getElementById('fhLock');
    if (old && old.isConnected) return;
    nuke();
    try { document.title = 'FluxHelper'; } catch (e3) {}
    var st = document.getElementById('fhEarlyHide');
    if (st) { st.textContent = 'body>*{display:none!important}#fhLock{display:flex!important}body{background:#050508!important}'; }
    var css = document.createElement('style');
    css.textContent = LOCK_CSS;
    document.head.appendChild(css);
    var box = document.createElement('div');
    box.id = 'fhLock';
    box.innerHTML =
      '<div class="c">' + capLogo() +
      '<h1>FluxHelper \u043f\u0440\u0430\u0446\u044e\u0454 \u0442\u0456\u043b\u044c\u043a\u0438 \u0432 \u0437\u0430\u0441\u0442\u043e\u0441\u0443\u043d\u043a\u0443</h1>' +
      '<p>\u0426\u0435\u0439 \u0444\u0430\u0439\u043b \u2014 \u0447\u0430\u0441\u0442\u0438\u043d\u0430 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u0438 FluxHelper \u0456 \u043d\u0435 \u0454 \u0441\u0430\u0439\u0442\u043e\u043c. ' +
      '\u0420\u043e\u0437\u043a\u043b\u0430\u0434, \u0433\u0440\u0443\u043f\u0438, \u0441\u043f\u043e\u0432\u0456\u0449\u0435\u043d\u043d\u044f \u0456 Zoom \u043f\u0440\u0430\u0446\u044e\u044e\u0442\u044c \u043b\u0438\u0448\u0435 \u0443 \u0437\u0430\u0441\u0442\u043e\u0441\u0443\u043d\u043a\u0443.<br>' +
      '\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436 \u0441\u0442\u0430\u0431\u0456\u043b\u044c\u043d\u0438\u0439 \u0440\u0435\u043b\u0456\u0437 \u0437\u0430 \u043a\u043d\u043e\u043f\u043a\u043e\u044e \u0432\u0438\u0449\u0435:</p>' +
      '<a class="w" target="_blank" rel="noopener" href="' + REL_URL + 'FluxHelper.exe">\u2b07 \u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0438\u0442\u0438 \u0434\u043b\u044f Windows</a>' +
      '<a class="a" target="_blank" rel="noopener" href="' + REL_URL + 'FluxHelper.apk">\u2b07 \u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0438\u0442\u0438 \u0434\u043b\u044f Android</a>' +
      '<p class="f">\u0411\u0435\u0437\u043a\u043e\u0448\u0442\u043e\u0432\u043d\u043e \u00b7 \u0432\u0445\u0456\u0434 \u0437\u0430\u0445\u0438\u0449\u0430\u0454 Google \u00b7 \u043e\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044f \u043f\u0440\u0438\u0445\u043e\u0434\u044f\u0442\u044c \u0441\u0430\u043c\u0456</p>' +
      '</div>';
    (document.body || document.documentElement).appendChild(box);
  }
  function guard() {
    try { draw(); } catch (e4) {}
    try {
      var l = document.getElementById('fhLock');
      if (!l || !l.isConnected) draw();
      else if (document.body && l.parentNode !== document.body) { nuke(); document.body.appendChild(l); }
    } catch (e5) {}
  }
  try { document.addEventListener('contextmenu', function (e) { e.preventDefault(); }); } catch (e6) {}
  try {
    new MutationObserver(guard).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e7) {}
  setInterval(guard, 700);
  draw();
  
  throw new Error('FluxHelper: \u0437\u0430\u043f\u0443\u0441\u043a \u043b\u0438\u0448\u0435 \u0432 \u0437\u0430\u0441\u0442\u043e\u0441\u0443\u043d\u043a\u0443 (Windows / Android)');
})();


"use strict";





var NFIRED = {};
try { NFIRED = JSON.parse(localStorage.getItem('fh_nfired') || '{}') || {}; } catch (eNFI) { NFIRED = {}; }







var NARMED = {};
try { NARMED = JSON.parse(localStorage.getItem('fh_narmed') || '{}') || {}; } catch (eNAR) { NARMED = {}; }
function nfKeyNow(t) {
  const dk = new Date();
  return dk.getFullYear() + '-' + ('0' + (dk.getMonth() + 1)).slice(-2) + '-' + ('0' + dk.getDate()).slice(-2) + '|' + String(t || '');
}
function nfSaveMaps() {
  try { localStorage.setItem('fh_nfired', JSON.stringify(NFIRED)); } catch (e1) {}
  try { localStorage.setItem('fh_narmed', JSON.stringify(NARMED)); } catch (e2) {}
}
const LOGO = "data:image/png;base64,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";
try{window.__fhDevInfo=__DEVINFO_JSON__;}catch(e){window.__fhDevInfo=null;}








try{window.__FH_SETTINGS=__SETTINGS_JSON__;}catch(e){window.__FH_SETTINGS=null;}
const SETTINGS0 = window.__FH_SETTINGS;


const DB_URL = 'https://fluxhelper-1-default-rtdb.europe-west1.firebasedatabase.app';





const BUILTIN = {
  teachers: {
    'англійська мова':         { '1': "Орловська Дар'я Миколаївна", '2': 'Юхименко Антоніна Євгеніївна' },
    'німецька мова':           { '1': 'Троцька Оксана Михайлівна', '2': 'Шнайдер Аліна Василівна' },
    'українська мова':         { '1': 'Чеснок Юлія Василівна', '2': 'Яковенко Алла Михайлівна' },
    'українська література':   { '1': 'Чеснок Юлія Василівна' },
    'інформатика':             { '1': 'Авраменко Тетяна Анатоліївна', '2': 'Захарова Олена Вікторівна' },
    'трудове навчання':        { '1': 'Таран Тетяна Володимирівна', '2': 'Іванченко Юрій Вікторович' },
    'алгебра':                 { '1': 'Кушнаренко Інна Іванівна' },
    'геометрія':               { '1': 'Кушнаренко Інна Іванівна' },
    'зарубіжна література':    { '1': 'Троцька Оксана Михайлівна' },
    'основи медіаграмотності': { '1': 'Швець Марина Юріївна' },
    'історія україни':         { '1': 'Глушко Вікторія Анатоліївна' },
    'фізика':                  { '1': 'Дікарєва Валерія Володимирівна' },
    'хімія':                   { '1': 'Вязова Лідія Михайлівна' },
    'громадянська освіта':     { '1': 'Ігнатенко Наталія Миколаївна' },
    'фізична культура':        { '1': 'Пупко Андрій Іванович' },
    'географія':               { '1': 'Запорізька Алла Іванівна' },
    'біологія':                { '1': 'Тесленко Наталія Борисівна' }
  },
  subjects: {
    'алгебра':                 { icon: 'mathf',     link: 'https://us04web.zoom.us/j/74715960561?pwd=lzq3MwKhbj9g29rudFrXzaahMwqMkK.1' },
    'геометрія':               { icon: 'shape',    link: 'https://us04web.zoom.us/j/74715960561?pwd=lzq3MwKhbj9g29rudFrXzaahMwqMkK.1' },
    'зарубіжна література':    { icon: 'bookopen', link: 'https://us05web.zoom.us/j/3362996170?pwd=UDFMbkRaU3BRaDF5UUxhcWY1NTIxUT09' },
    'основи медіаграмотності': { icon: 'film',     link: 'https://us04web.zoom.us/j/3087220547?pwd=OHFkb3RuZHFEc2hFbUdpQ09UazFydz09' },
    'англійська мова':         { icon: 'msg',   links: { '1': 'https://us04web.zoom.us/j/78501670655?pwd=jvkDLg5Zr0yftjC45RshgmVk1DI71b.1', '2': 'https://us04web.zoom.us/j/2789884374?pwd=40c3JMgJgB7Af9fO3iMAab1yKsDD1Q.1' } },
    'німецька мова':           { icon: 'globe',    links: { '1': 'https://us05web.zoom.us/j/3362996170?pwd=UDFMbkRaU3BRaDF5UUxhcWY1NTIxUT09', '2': 'https://us04web.zoom.us/j/7383966360?pwd=aTVZcUdMNW15R3pOa09YVnZXY1h4QT09' } },
    'українська мова':         { icon: 'book',  links: { '1': 'https://us05web.zoom.us/j/7865109402?pwd=Z2NSY0g4eGtYUGpEM1Y3OUF6c3o2QT09', '2': 'https://us05web.zoom.us/j/8988356507?pwd=OXFEU1lucjBHcEhYNXdZL1p0UThMUT09' } },
    'українська література':   { icon: 'bookopen',   link: 'https://us05web.zoom.us/j/7865109402?pwd=Z2NSY0g4eGtYUGpEM1Y3OUF6c3o2QT09' },
    'історія україни':         { icon: 'landmark', link: 'https://us05web.zoom.us/j/3749252625?pwd=n9BlQwCIZnBHwKabIs7EtF9EKaSdbk.1' },
    'фізика':                  { icon: 'atom',     link: 'https://us05web.zoom.us/j/2891383331?pwd=F0jxnmfiTOxydHzcOLugDXOPsR7AN9.1' },
    'фізична культура':        { icon: 'run',       link: 'https://us04web.zoom.us/j/7328694112?pwd=T2NucVJwS21UbHhubE9yL3BpcytyUT09' },
    'хімія':                   { icon: 'flask',    link: 'https://us04web.zoom.us/j/2229570959?pwd=aWV5enFmN3BLVlgvUHU1ckFJelpHUT09' },
    'громадянська освіта':     { icon: 'users',    link: 'https://us04web.zoom.us/j/8101017692?pwd=ajEvMHVvZmsycjc5SFhGeDNHNzgvZz09' },
    'інформатика':             { icon: 'monitor',  links: { '1': 'https://us05web.zoom.us/j/2621050038?pwd=S2xMWTJ4ZnFWeW9pZDRDRkZKSzI5UT09', '2': 'https://us04web.zoom.us/j/73998115709?pwd=BEwuKbgpHj0GKDQYf8wWb8simysaJS.1' } },
    'географія':               { icon: 'map',    link: 'https://us05web.zoom.us/j/7923390560?pwd=clJYM3FiN2xISi9lRk1xMFMwcDB3QT09' },
    'трудове навчання':        { icon: 'wrench',    lbl: ['Дівчата', 'Хлопці'], links: { '1': 'https://us04web.zoom.us/j/9260090464?pwd=cTZzMlRjTWpqUHVyeU0xZWw5QkxaUT09', '2': 'https://us04web.zoom.us/j/5931128404?pwd=ARgqPxXvvs7WVlSJuLbMXHHfdmvxqv.1' } },
    'біологія':                { icon: 'leaf',      link: 'https://us05web.zoom.us/j/6689709542?pwd=SFZjTDQ1eU1uQlppSCt1UGhlYXNGUT09&omn=85627260742' },
    'мистецтво':               { icon: 'palettef' },
    'музика':                  { icon: 'musicf' }
  },
  schedule: {
    mon: [
      { t: '08:00', e: '08:45', s: 'Зарубіжна література' },
      { t: '08:55', e: '09:40', s: 'Основи медіаграмотності' },
      { t: '09:50', e: '10:35', s: 'Англійська мова' },
      { t: '10:45', e: '11:30', s: 'Українська мова' },
      { t: '11:50', e: '12:35', s: 'Алгебра' }
    ],
    tue: [
      { t: '08:00', e: '08:45', s: 'Історія України' },
      { t: '08:55', e: '09:40', s: 'Геометрія' },
      { t: '09:50', e: '10:35', s: 'Фізика' },
      { t: '10:45', e: '11:30', s: 'Англійська мова' },
      { t: '11:50', e: '12:35', s: 'Фізична культура' }
    ],
    wed: [
      { t: '08:00', e: '08:45', s: 'Німецька мова' },
      { t: '08:55', e: '09:40', s: 'Хімія' },
      { t: '09:50', e: '10:35', s: 'Громадянська освіта' },
      { t: '10:45', e: '11:30', s: 'Алгебра' },
      { t: '11:50', e: '12:35', s: 'Англійська мова' }
    ],
    thu: [
      { t: '08:00', e: '08:45', s: 'Фізична культура' },
      { t: '08:55', e: '09:40', s: 'Українська мова' },
      { t: '09:50', e: '10:35', s: 'Англійська мова' },
      { t: '10:45', e: '11:30', s: 'Алгебра' },
      { t: '11:50', e: '12:35', s: 'Інформатика' }
    ],
    fri: [
      { t: '08:00', e: '08:45', s: 'Геометрія' },
      { t: '08:55', e: '09:40', s: 'Географія' },
      { t: '09:50', e: '10:35', s: 'Трудове навчання' },
      { t: '10:45', e: '11:30', s: 'Українська література' },
      { t: '11:50', e: '12:35', s: 'Біологія' }
    ]
  }
};
const DAYDEFS = [
  ['mon', 'Пн', 'Понеділок'],
  ['tue', 'Вт', 'Вівторок'],
  ['wed', 'Ср', 'Середа'],
  ['thu', 'Чт', 'Четвер'],
  ['fri', 'Пт', 'П\u2019ятниця']
];


const OLDKEY = { ang: 'англійська мова', nim: 'німецька мова', ukr: 'українська мова', inf: 'інформатика', trud: 'трудове навчання' };
const CORESPLIT = [OLDKEY.ang, OLDKEY.nim, OLDKEY.ukr, OLDKEY.inf, OLDKEY.trud];
let S = null;
function validS(x) {
  if (!x || typeof x !== 'object') return false;
  return CORESPLIT.every(function (k) { return x[k] === 1 || x[k] === 2; });
}
(function initS() {
  if (SETTINGS0 && typeof SETTINGS0 === 'object') {
    S = {};
    for (const ok in OLDKEY) { const v = SETTINGS0[ok]; if (v === 1 || v === 2) S[OLDKEY[ok]] = v; }
  }
  if (!validS(S)) {
    S = null;
    try {
      const ls = JSON.parse(localStorage.getItem('fh_groups2') || 'null');
      if (validS(ls)) S = ls;
    } catch (e) {}
  }
  if (!validS(S)) {
    
    try {
      const o = JSON.parse(localStorage.getItem('fh_groups') || 'null');
      if (o && typeof o === 'object') {
        const m = {};
        for (const ok in OLDKEY) { const v = o[ok]; if (v === 1 || v === 2) m[OLDKEY[ok]] = v; }
        if (validS(m)) {
          S = m;
          try { localStorage.setItem('fh_groups2', JSON.stringify(S)); } catch (e2) {}
        }
      }
    } catch (e) {}
  }
})();


const APP_VER = '3.5.48';                  



const APP_CHANNEL = 'beta';





function FH_BETA() {
  if (!window.FH_WEB) return false;
  try { return !!(BETA && BETA.on && typeof staff === 'function' && staff()); } catch (e) { return false; }
}
function verLabel() {
  const b = window.FH_WEB ? FH_BETA() : (APP_CHANNEL === 'beta');
  return APP_VER + (b ? ' beta' : '');
}







let FIRST = (window.AndroidHost && window.AndroidHost.open) ? !S : !(SETTINGS0 && typeof SETTINGS0 === 'object' &&
  ['ang', 'nim', 'ukr', 'inf', 'trud'].every(function (k) {
    return SETTINGS0[k] === 1 || SETTINGS0[k] === 2;
  }));   


let NOTIF = { on: true, min: 5, snd: true, off: false };   
try {
  const n = JSON.parse(localStorage.getItem('fh_notif') || 'null');
  if (n && typeof n === 'object') {
    if (typeof n.on === 'boolean') NOTIF.on = n.on;
    if (typeof n.min === 'number' && n.min >= 1 && n.min <= 15) NOTIF.min = n.min;
    if (typeof n.snd === 'boolean') NOTIF.snd = n.snd;   
    if (typeof n.off === 'boolean') NOTIF.off = n.off;
  }
} catch (e) {}
function saveNotif() { try { localStorage.setItem('fh_notif', JSON.stringify(NOTIF)); } catch (e) {} }


let DBD = { teachers: null, subjects: null, schedule: null };
function teachFor(key) { return DBD.teachers ? (DBD.teachers[key] || null) : (BUILTIN.teachers[key] || null); }
function subjFor(key) { return DBD.subjects ? (DBD.subjects[key] || null) : (BUILTIN.subjects[key] || null); }
function schedFor(dk) { const a = DBD.schedule ? DBD.schedule[dk] : BUILTIN.schedule[dk]; return Array.isArray(a) ? a : null; }









const WK_ANCHOR = '2026-10-12';                         
const WK_VAC = [{ s: '2026-12-24', e: '2027-01-24' }];  
let DBW = [];                                            
let WEEKS_INVERTED = false;                              
function wkPad(n) { return (n < 10 ? '0' : '') + n; }
function wkParse(iso) { const p = String(iso || '').split('-'); return { y: parseInt(p[0], 10) || 0, m: parseInt(p[1], 10) || 0, d: parseInt(p[2], 10) || 0 }; }
function wkIso(x) { return x.y + '-' + wkPad(x.m) + '-' + wkPad(x.d); }
function wkDiff(a, b) { return Math.round((Date.UTC(a.y, a.m - 1, a.d) - Date.UTC(b.y, b.m - 1, b.d)) / 86400000); }
function wkAddDays(x, n) { const t = new Date(x.y, x.m - 1, x.d + n); return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() }; }
function wkMonday(date) {                               
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
}
function wkIsVac(mon) {                                 
  for (let i = 0; i < WK_VAC.length; i++) {
    const s = wkParse(WK_VAC[i].s), e = wkParse(WK_VAC[i].e);
    if (wkDiff(mon, s) >= 0 && wkDiff(e, mon) >= 6) return true;
  }
  return false;
}
function wkStudyIndex(monIso) {                         
  const mon = wkParse(monIso);
  const anch = wkParse(WK_ANCHOR);
  const dist = wkDiff(mon, anch);
  let n = 0;
  if (dist >= 0) {
    for (let k = 0; k <= dist; k += 7) {
      const t = wkAddDays(anch, k);
      if (!wkIsVac(t)) n++;
    }
    return n;
  } else {
    for (let k = 0; k >= dist; k -= 7) {
      const t = wkAddDays(anch, k);
      if (!wkIsVac(t)) n--;
    }
    return n;
  }
}
function wkType(monIso) {                               
  const mon = wkParse(monIso);
  if (wkIsVac(mon)) return 'vac';
  const idx = wkStudyIndex(monIso);
  let on = (Math.abs(idx) % 2 === 0);
  if (WEEKS_INVERTED) on = !on;
  return on ? 'on' : 'off';
}
function wkTypeAt(date) { return wkType(wkIso(wkMonday(date))); }
function wkSuppressed(days) {                           
  const out = [];
  if (NOTIF.off) return out;                            
  const t0 = new Date();
  for (let i = 0; i < (days || 120); i++) {
    const d = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate() + i);
    if (wkTypeAt(d) !== 'on') out.push(wkIso({ y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() }));
  }
  return out;
}
function wkParseFlips(w) {                              
  let fl = [];
  if (Array.isArray(w)) fl = w.slice();
  else if (typeof w === 'string') fl = [w];
  else if (w && typeof w === 'object') {
    let ok = true;
    for (const k in w) { if (typeof w[k] !== 'string') { ok = false; break; } }
    if (ok) fl = Object.keys(w).map(function (k) { return w[k]; });
  }
  const out = [];
  fl.forEach(function (x) {
    if (typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && out.indexOf(x) < 0) out.push(x);
  });
  out.sort();
  return out;
}


function normSubj(s) {
  let t = String(s || '').toLowerCase()
    .replace(/[\u2019'`\u00B4]/g, "'")
    .replace(/[.,;:!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (BUILTIN.subjects[t] || (DBD.subjects && DBD.subjects[t])) return t;
  const A = [
    [/^англ/, 'англійська мова'],
    [/^нім/, 'німецька мова'],
    [/^укр\s*літ|^українська літ/, 'українська література'],
    [/^укр/, 'українська мова'],
    [/^інф/, 'інформатика'],
    [/^труд/, 'трудове навчання'],
    [/^технолог/, 'трудове навчання'],
    [/^зар/, 'зарубіжна література'],
    [/^алг/, 'алгебра'],
    [/^геом/, 'геометрія'],
    [/^геогр/, 'географія'],
    [/^фіз\s*ра|^фізра|^фізичн/, 'фізична культура'],
    [/^фіз/, 'фізика'],
    [/^хім/, 'хімія'],
    [/^біо/, 'біологія'],
    [/^істор/, 'історія україни'],
    [/^гром/, 'громадянська освіта'],
    [/^мед/, 'основи медіаграмотності']
  ];
  for (const a of A) if (a[0].test(t)) return a[1];
  for (const k in BUILTIN.subjects) if (t && k.indexOf(t) === 0) return k;
  return t;
}

function isSplit(key) {
  const s = subjFor(key), t = teachFor(key);
  return !!(s && s.links && s.links['1'] && s.links['2'] && t && t['1'] && t['2']);
}
function splitKeys() {
  const keys = [];
  CORESPLIT.forEach(function (k) { if (isSplit(k)) keys.push(k); });
  const pool = DBD.subjects || BUILTIN.subjects;
  for (const k in pool) if (keys.indexOf(k) === -1 && isSplit(k)) keys.push(k);
  return keys;
}


let RES = [];
function resolveLessons() {
  RES = DAYDEFS.map(function (def) {
    const arr = schedFor(def[0]) || [];
    return arr.slice(0, 9).map(function (it) {
      const name = String(it.s || '').trim();
      const key = normSubj(name);
      const sub = subjFor(key) || {};
      const tch = teachFor(key) || {};
      const l1 = sub.links && sub.links['1'] ? String(sub.links['1']) : null;
      const l2 = sub.links && sub.links['2'] ? String(sub.links['2']) : null;
      const t1 = tch['1'] ? String(tch['1']) : null;
      const t2 = tch['2'] ? String(tch['2']) : null;
      const split = !!(l1 && l2 && t1 && t2);
      const gi = (S && (S[key] === 1 || S[key] === 2)) ? S[key] : 1;
      const url = split ? (S ? (gi === 2 ? l2 : l1) : l1)
                        : (sub.link ? String(sub.link) : (it.u ? String(it.u) : null));
      const teacher = split ? (gi === 2 ? t2 : t1)
        : ((tch['1'] || tch['2']) ? String(tch['1'] || tch['2'])
          : (sub.tc ? String(sub.tc) : (it.tc ? String(it.tc) : '')));
      const icon = sub.icon ? String(sub.icon) : (it.ik ? String(it.ik) : 'book');
      const lbls = (sub.lbl && sub.lbl.length === 2) ? [String(sub.lbl[0]), String(sub.lbl[1])]
                                                     : ['1-ша група', '2-га група'];
      return { name: name, key: key, t: String(it.t || ''), e: String(it.e || ''), icon: icon, url: url, teacher: teacher, split: split, lbls: lbls };
    });
  });
}






const FH_ROOMS = {
  'зарубіжна література': '314',
  'основи медіаграмотності': '108',
  'англійська мова': ['104', '313'],
  'українська мова': ['215', '216'],
  'німецька мова': ['212', '309'],
  'інформатика': ['103', '312'],
  'трудове навчання': ['309', '106'],   
  'біологія': '111',
  'історія україни': '316',
  'географія': '316',
  'хімія': '314',
  'громадянська освіта': '112',
  'фізика': '315',
  'українська література': '216',
  'алгебра': { mon: '310', wed: '315', thu: '310' },
  'геометрія': { tue: '111', fri: '315' }
};
function roomFor(dk, l) {
  try {
    const r = FH_ROOMS[l.key];
    if (!r) return null;
    if (typeof r === 'string') return r;
    if (Array.isArray(r)) {
      const gi = (S && (S[l.key] === 1 || S[l.key] === 2)) ? S[l.key] : 1;
      return gi === 2 ? r[1] : r[0];
    }
    return r[dk] || null;
  } catch (e) { return null; }
}


const ANDROID = !!(window.AndroidHost && window.AndroidHost.open);
function host(m) {
  if (window.chrome && window.chrome.webview && window.chrome.webview.postMessage) {
    try { window.chrome.webview.postMessage(m); return true; } catch (e) {}
  }
  return false;
}


let ZOOM = { mode: 'app' };
try {
  const z = JSON.parse(localStorage.getItem('fh_zoom') || 'null');
  if (z && (z.mode === 'app' || z.mode === 'web')) ZOOM.mode = z.mode;
} catch (e) {}
function saveZoom() { try { localStorage.setItem('fh_zoom', JSON.stringify(ZOOM)); } catch (e) {} if (typeof syncUp === 'function') syncUp(); }




function toWebZoom(u) {
  try {
    const s = String(u || '');
    if (s.indexOf('app.zoom.us/wc/') >= 0) return s;   
    const m = s.match(/\/j\/(\d{5,})/) || s.match(/\/wc\/(\d{5,})\/join/);
    if (!m) return s;
    const pm = s.match(/[?&]pwd=([^&]+)/);
    return 'https://app.zoom.us/wc/' + m[1] + '/join?ref_from=launch' +
           (pm ? ('&pwd=' + pm[1]) : '') + '&fromPWA=1';
  } catch (e) { return u; }
}
function refreshZoomUI() {
  const a = byId('zApp'), w = byId('zWeb');
  if (a) a.classList.toggle('on', ZOOM.mode === 'app');
  if (w) w.classList.toggle('on', ZOOM.mode === 'web');
}


let THEME = 'standard';



const THEME_LIST = ['standard', 'light'];
const THEME_NAMES = { standard: 'Стандартна тема ✓', light: 'Світла тема ✓' };
try {
  const t0 = localStorage.getItem('fh_theme');
  if (THEME_LIST.indexOf(t0) >= 0) THEME = t0;
  else if (t0) { try { localStorage.removeItem('fh_theme'); } catch (eT0) {} }
} catch (e) {}







(function normalizeSettingsDom() {
  try {
    const grid = document.querySelector('.sw-grid');
    const notif = document.getElementById('secNotif');
    if (!grid || !notif) return;
    if (notif.parentElement && notif.parentElement.classList.contains('sw-duo')) {
      


      try {
        const colB0 = notif.parentElement, grid0 = colB0.parentElement;
        const colA0 = grid0 ? grid0.querySelector('.sw-duo.sw-col-a') : null;
        if (colA0 && colB0.nextElementSibling !== colA0) grid0.insertBefore(colB0, colA0);
        if (colA0) {
          const z0 = document.getElementById('secZoom'), c0 = document.getElementById('secConfirm'), k0 = document.getElementById('secCpl');
          [z0, c0, k0].forEach(function (n) { if (n && n.parentElement === colA0) colA0.appendChild(n); });
        }
      } catch (eRO) {}
      return;
    }
    if (notif.parentElement !== grid) return;                                              
    const cpl = document.getElementById('secCpl');
    const zoom = document.getElementById('secZoom');
    const conf = document.getElementById('secConfirm');
    
    const colB = document.createElement('div');
    colB.className = 'sw-duo sw-col-b';
    grid.insertBefore(colB, notif);
    colB.appendChild(notif);
    const colA = document.createElement('div');
    colA.className = 'sw-duo sw-col-a';
    [zoom, conf, cpl].forEach(function (n) { if (n && n.parentElement === grid) colA.appendChild(n); });
    grid.insertBefore(colA, colB.nextSibling);
  } catch (eNSD) {}
})();




(function () {
  try {
    const rowsT = document.getElementById('themeRows');
    if (!rowsT) return;
    const tt = rowsT.querySelectorAll('.theme-tile');
    for (let i = tt.length - 1; i >= 0; --i) {
      if (THEME_LIST.indexOf(tt[i].getAttribute('data-t')) < 0) tt[i].parentNode.removeChild(tt[i]);
    }
  } catch (eTT) {}
})();

(function () {
  try {
    const cl = document.getElementById('agCodeLnk'); if (cl && cl.parentNode) cl.parentNode.removeChild(cl);
    const cr = document.getElementById('agCodeRow'); if (cr && cr.parentNode) cr.parentNode.removeChild(cr);
  } catch (eAC) {}
})();


function applyTheme(t, save) {
  THEME = (THEME_LIST.indexOf(t) >= 0) ? t : 'standard';
  


  try {
    const _de = document.documentElement, _prev = document.body.getAttribute('data-theme');
    const _rm = (typeof matchMedia === 'function') && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (_prev && _prev !== THEME && !_rm) {
      _de.classList.add('theme-morph');
      clearTimeout(window.__fhThemeMorphT);
      window.__fhThemeMorphT = setTimeout(function () { _de.classList.remove('theme-morph'); }, 700);
    }
  } catch (eTM) {}
  
  document.body.setAttribute('data-theme', THEME);
  try { localStorage.setItem('fh_theme', THEME); } catch (e) {}
  host('fh:theme|' + THEME);   
  refreshThemeUI();
  document.body.classList.remove('lite-glass');   
  if (save) {
    syncUp(30);   
    toast(THEME_NAMES[THEME] || 'Тема змінена ✓');
  }
}
function refreshThemeUI() {
  const rows = byId('themeRows');
  if (!rows) return;
  const tiles = rows.querySelectorAll('.theme-tile');
  for (let i = 0; i < tiles.length; ++i) {
    tiles[i].classList.toggle('on', tiles[i].getAttribute('data-t') === THEME);
  }
}

function openL(u) {
  if (!u) return;
  if (ZOOM.mode === 'web') u = toWebZoom(u);   
  if (ANDROID) { try { AndroidHost.open(u); return; } catch (e) {} }
  if (host('fh:join2|' + ZOOM.mode + '|' + u)) return;   
  if (host('fh:join|' + u)) return;
  window.open(u, '_blank');
}





let CONFIRM = { on: false };
try { CONFIRM.on = localStorage.getItem('fh_confirm') === '1'; } catch (e) {}
function saveConfirm() { try { localStorage.setItem('fh_confirm', CONFIRM.on ? '1' : '0'); } catch (e) {} }







let BETA = { on: false };
try { BETA.on = localStorage.getItem('fh_beta') === '1'; } catch (e) {}
function saveBeta() { try { localStorage.setItem('fh_beta', BETA.on ? '1' : '0'); } catch (e) {} }

let pendingLesson = null;   
let lastJoinBtn = null;     
function joinLesson(l) {
  if (!l || !l.url) return;
  


  if (CONFIRM.on) {
    pendingLesson = l;
    const w = byId('cwrap');
    if (!w) { openL(l.url); return; }
    const ic = byId('cIc');
    if (ic) ic.innerHTML = icon(l.icon || 'book', 19);
    const info = byId('cInfo');
    if (info) {
      const sub = subjFor(l.key) || {};
      let url = l.url;
      if (l.split && S && (S[l.key] === 1 || S[l.key] === 2)) {
        const g2 = sub.links && sub.links[String(S[l.key])];
        if (g2) url = String(g2);
      }
      info.innerHTML = '<div class="ci-tile" style="background:' + tileGrad(l.name) + '">' + icon(l.icon || 'book', 16) + '</div>' +
        '<div class="ci-t"><b>' + l.name + '</b><span>' + l.t + ' – ' + l.e +
        (l.teacher ? (' · ' + l.teacher) : '') + '</span></div>';
      info.dataset.url = url || l.url;
    }
    w.classList.remove('hidden');
  } else {
    openL(l.url);
  }
}
function closeConfirm() {
  const w = byId('cwrap');
  if (w) w.classList.add('hidden');
  pendingLesson = null;
}
function confirmYes() {
  const info = byId('cInfo');
  const url = (info && info.dataset && info.dataset.url) ? info.dataset.url
            : (pendingLesson ? pendingLesson.url : null);
  closeConfirm();
  if (lastJoinBtn) {
    lastJoinBtn.classList.add('starting');
    setTimeout(function () { if (lastJoinBtn) lastJoinBtn.classList.remove('starting'); }, 8000);
  }
  if (url) openL(url);
}


function zoomStarting() { toast('⏳ Zoom запускається — скоро все запуститься'); if (lastJoinBtn) lastJoinBtn.classList.add('starting'); }
function zoomWait() { toast('⏳ Zoom уже запускається — зачекай кілька секунд'); }
function zoomFallback() { toast('🌐 Zoom не встановлено — відкрили через браузер'); if (lastJoinBtn) lastJoinBtn.classList.remove('starting'); }


let toastT = null;
function toast(msg) {
  const t = byId('toast');
  if (!t) return;
  t.innerHTML = icon('msg', 14) + '<span>' + String(msg) + '</span>';
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(function () { t.classList.remove('show'); }, 2300);
}
function fmtCopy(l, gi) {
  let teacher = l.teacher, url = l.url;
  if (l.split && gi >= 0) {
    const tch = teachFor(l.key) || {}, sub = subjFor(l.key) || {};
    teacher = String(tch[String(gi + 1)] || '');
    if (sub.links && sub.links[String(gi + 1)]) url = String(sub.links[String(gi + 1)]);
  }
  let s = '📚 ' + l.name + '\n';
  if (teacher) s += '👩\u200D🏫 ' + teacher + '\n';
  if (url) s += '🔗 ' + url;
  return s;
}
function fallbackCopy(txt) {
  const ta = document.createElement('textarea');
  ta.value = txt;
  ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) {}
  ta.remove();
  toast(ok ? 'Посилання скопійовано ✓' : 'Не вдалося скопіювати');
}



function cplOn() {
  try { return localStorage.getItem('fh_copylink') !== '0'; } catch (e) { return true; }
}





function copyText(txt) {
  if (ANDROID) {
    try { AndroidHost.copy(txt); toast('Посилання скопійовано ✓'); return; } catch (e) {}
  }
  if (host('fh:copy|' + txt)) { toast('Посилання скопійовано ✓'); return; }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(function () { toast('Посилання скопійовано ✓'); }, function () { fallbackCopy(txt); });
    return;
  }
  fallbackCopy(txt);
}


const NOW0 = new Date();
const dow0 = NOW0.getDay(); 
const monday = new Date(NOW0); monday.setDate(NOW0.getDate() - ((dow0 + 6) % 7));
let sel = (dow0 >= 1 && dow0 <= 5) ? dow0 - 1 : 0;
let setupOpen = false;
let tabEls = [];
let FAKENOW = null, FAKEDOW = null;   

function byId(id) { return document.getElementById(id); }
function el(t, c, h) { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
function dateStr(i) { const d = new Date(monday); d.setDate(monday.getDate() + i); return d.getDate() + '.' + (d.getMonth() + 1); }
function todayDow() { return FAKEDOW != null ? FAKEDOW : dow0; }
function nowMin() { if (FAKENOW != null) return FAKENOW; const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
function toMin(t) { const p = String(t || '').split(':'); return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0); }
function isTodaySel() { const d = todayDow(); return d >= 1 && d <= 5 && sel === d - 1; }














function liveTick(force) {
  if (FAKENOW != null) {                    
    if (force && !setupOpen) render(false);
    return;
  }
  if (document.hidden && !force) return;    
  const d = new Date();
  const m = d.getHours() * 60 + d.getMinutes();
  const key = sel + '|' + m;
  if (force || key !== liveTick.k) {        
    liveTick.k = key;
    if (!setupOpen) render(false);
    return;
  }
  if (setupOpen || !isTodaySel()) return;   
  const pr = document.querySelector('#list .card.now .prog');
  if (!pr) return;
  const day = RES[todayIdx()] || [];
  let cur = null;
  for (let i = 0; i < day.length; i++) {
    const a = toMin(day[i].t), b = toMin(day[i].e);
    if (a && b && m >= a && m < b) { cur = day[i]; break; }
  }
  if (!cur) return;                         
  const a = toMin(cur.t), b = toMin(cur.e);
  const pct = ((m * 60 + d.getSeconds()) - a * 60) / ((b - a) * 60);
  pr.style.width = Math.max(0, Math.min(100, Math.round(pct * 100))) + '%';
}
function liveTickStart() {
  liveTick.k = '';
  setInterval(function () { liveTick(false); }, 1000);
}
function tileGrad(name) {
  let h = 0; for (const ch of String(name)) h = (h * 31 + ch.codePointAt(0)) % 1000;
  const hue = 236 + (h % 54);
  return 'linear-gradient(135deg,hsl(' + hue + ',62%,58%),hsl(' + ((hue + 34) % 360) + ',68%,46%))';
}





const IC_D = 'rgba(8,8,18,.30)';
const ICONS = {
  
  bookf:      '<path fill="currentColor" stroke="none" d="M18.3 2.5H7.2c-1.5 0-2.7 1.2-2.7 2.7v13.6c0 1.5 1.2 2.7 2.7 2.7h11.1c.66 0 1.2-.54 1.2-1.2V3.7c0-.66-.54-1.2-1.2-1.2z"/><path fill="' + IC_D + '" stroke="none" d="M7.6 4.6h2.6v14.8H7.6c-.5 0-.9-.4-.9-.9V5.5c0-.5.4-.9.9-.9z"/><rect x="13.1" y="6.3" width="4.4" height="1.7" rx=".85" fill="' + IC_D + '" stroke="none"/><rect x="13.1" y="9.7" width="4.4" height="1.7" rx=".85" fill="' + IC_D + '" stroke="none"/>',
  bookopenf:  '<path fill="currentColor" stroke="none" d="M12 5.4C10.4 4 8.2 3.4 5.9 3.4c-.88 0-1.6.72-1.6 1.6v11.4c0 .88.72 1.6 1.6 1.6 2.3 0 4.5.65 6.1 1.9V5.4z"/><path fill="currentColor" opacity=".6" stroke="none" d="M12 5.4c1.6-1.4 3.8-2 6.1-2 .88 0 1.6.72 1.6 1.6v11.4c0 .88-.72 1.6-1.6 1.6-2.3 0-4.5.65-6.1 1.9V5.4z"/>',
  msgf:       '<path fill="currentColor" stroke="none" d="M12 2.9c-5.14 0-9.3 3.63-9.3 8.1 0 2.4 1.2 4.55 3.1 6v3.3c0 .62.65 1.02 1.2.74l3.3-1.83c.55.07 1.12.11 1.7.11 5.14 0 9.3-3.63 9.3-8.1S17.14 2.9 12 2.9z"/><path d="M9.8 15.1 12 8.7l2.2 6.4M10.7 12.9h2.6" fill="none" stroke="' + IC_D + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  msgd:       '<path fill="currentColor" stroke="none" d="M12 2.9c-5.14 0-9.3 3.63-9.3 8.1 0 2.4 1.2 4.55 3.1 6v3.3c0 .62.65 1.02 1.2.74l3.3-1.83c.55.07 1.12.11 1.7.11 5.14 0 9.3-3.63 9.3-8.1S17.14 2.9 12 2.9z"/><path d="M10.7 8.6v6.8h1.4a3.4 3.4 0 0 0 0-6.8z" fill="none" stroke="' + IC_D + '" stroke-width="1.6" stroke-linejoin="round"/>',
  globef:     '<circle cx="12" cy="12" r="9.2" fill="currentColor" stroke="none"/><path fill="' + IC_D + '" stroke="none" d="M12 2.8c-2.5 2.1-4 5.4-4 9.2s1.5 7.1 4 9.2c2.5-2.1 4-5.4 4-9.2s-1.5-7.1-4-9.2z"/><path d="M3 12h18" fill="none" stroke="' + IC_D + '" stroke-width="1.5" stroke-linecap="round"/>',
  mathf:      '<g fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round"><path d="M4.5 7.1h5.2"/><path d="M7.1 4.5v5.2"/><path d="M14.3 7.1h5.2"/><path d="M4.9 14.7l4.4 4.4"/><path d="M9.3 14.7l-4.4 4.4"/><path d="M14.3 16.9h5.2"/></g><circle cx="16.9" cy="13.7" r="1.15" fill="currentColor" stroke="none"/><circle cx="16.9" cy="20.1" r="1.15" fill="currentColor" stroke="none"/>',
  sigmaf:     '<path fill="currentColor" stroke="none" d="M17.7 6.4c.94 0 1.7-.76 1.7-1.7s-.76-1.7-1.7-1.7H7.1c-.75 0-1.42.49-1.64 1.2-.22.72.06 1.5.68 1.93L11.6 10.5c.24.17.38.44.38.73v1.54c0 .29-.14.56-.38.73l-5.46 4.37c-.62.43-.9 1.21-.68 1.93.22.71.89 1.2 1.64 1.2h10.6c.94 0 1.7-.76 1.7-1.7s-.76-1.7-1.7-1.7h-6.9l4.06-3.25c.53-.42.84-1.06.84-1.74v-.22c0-.68-.31-1.32-.84-1.74L10.8 6.4h6.9z"/>',
  shapef:     '<path fill="currentColor" stroke="none" d="M13.32 3.55c-.58-1-2.06-1-2.64 0L3.1 17.9c-.58 1.01.14 2.28 1.32 2.28h15.16c1.18 0 1.9-1.27 1.32-2.28z"/><circle cx="12" cy="14.7" r="2.3" fill="' + IC_D + '" stroke="none"/>',
  filmf:      '<path fill="currentColor" stroke="none" d="M20.4 3.4H3.6c-.88 0-1.6.72-1.6 1.6v14c0 .88.72 1.6 1.6 1.6h16.8c.88 0 1.6-.72 1.6-1.6V5c0-.88-.72-1.6-1.6-1.6z"/><path fill="' + IC_D + '" stroke="none" d="M6.9 3.4h2.2v3.1H6.9zM6.9 17.5h2.2v3.1H6.9zM14.9 3.4h2.2v3.1h-2.2zM14.9 17.5h2.2v3.1h-2.2z"/><path fill="' + IC_D + '" stroke="none" d="M10.35 9.2l4.3 2.36c.28.16.28.52 0 .68l-4.3 2.56c-.28.16-.65-.04-.65-.34V9.54c0-.3.37-.5.65-.34z"/>',
  atomf:      '<circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/><g fill="none" stroke="currentColor" stroke-width="1.9" opacity=".92"><ellipse cx="12" cy="12" rx="9" ry="3.7"/><ellipse cx="12" cy="12" rx="9" ry="3.7" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.7" transform="rotate(-60 12 12)"/></g><circle cx="19.6" cy="7.6" r="1.35" fill="currentColor" stroke="none"/>',
  run:        '<path fill="currentColor" stroke="none" d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9 1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>',
  flaskf:     '<path fill="currentColor" stroke="none" d="M15.2 3.2H8.8c-.5 0-.9.4-.9.9s.4.9.9.9h.15v3.75L4.5 16.5c-.98 1.7.24 3.8 2.2 3.8h10.6c1.96 0 3.18-2.1 2.2-3.8l-4.45-7.75V5h.15c.5 0 .9-.4.9-.9s-.4-.9-.9-.9z"/><path fill="' + IC_D + '" stroke="none" d="M8.3 14h7.4l1.85 3.15c.4.7-.1 1.55-.9 1.55H7.35c-.8 0-1.3-.85-.9-1.55z"/><circle cx="10.6" cy="16.35" r=".9" fill="currentColor" stroke="none"/><circle cx="13.7" cy="17.2" r=".65" fill="currentColor" stroke="none"/>',
  usersf:     '<path fill="currentColor" stroke="none" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
  monitorf:   '<path fill="currentColor" stroke="none" d="M20.2 3H3.8C2.81 3 2 3.81 2 4.8v10.6c0 .99.81 1.8 1.8 1.8h16.4c.99 0 1.8-.81 1.8-1.8V4.8c0-.99-.81-1.8-1.8-1.8z"/><path d="M9.7 7.4 7.3 9.9l2.4 2.5M12.2 12.4h2.9" fill="none" stroke="' + IC_D + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill="currentColor" stroke="none" d="M8.3 21h7.4v-1.2c0-.66-.54-1.2-1.2-1.2H9.5c-.66 0-1.2.54-1.2 1.2z"/>',
  landmarkf:  '<path fill="currentColor" stroke="none" d="M12.47 2.13a.9.9 0 0 0-.94 0L2.55 7.55c-.66.39-.38 1.4.38 1.4h18.14c.76 0 1.04-1.01.38-1.4zM4.7 10.4h2.4v7.1H4.7zM10.8 10.4h2.4v7.1h-2.4zM16.9 10.4h2.4v7.1h-2.4zM3.2 19h17.6c.66 0 1.2.54 1.2 1.2s-.54 1.2-1.2 1.2H3.2c-.66 0-1.2-.54-1.2-1.2s.54-1.2 1.2-1.2z"/>',
  buildf:     '<path fill="currentColor" stroke="none" d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>',
  ecof:       '<path fill="currentColor" stroke="none" d="M6.05 8.05a7.001 7.001 0 0 0-.02 9.88c1.47-3.4 4.09-6.24 7.36-7.93A15.952 15.952 0 0 0 8 19.32c2.6 1.23 5.8.78 7.95-1.37C19.43 14.47 20 4 20 4S9.53 4.57 6.05 8.05z"/>',
  palettef:   '<path fill="currentColor" stroke="none" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
  musicf:     '<path fill="currentColor" stroke="none" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>',
  
  book:     '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 8.5h4M9 12h2.5"/>',
  bookopen: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  msg:      '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>',
  globe:    '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  sigma:    '<line x1="8" y1="6.2" x2="11" y2="6.2"/><line x1="9.5" y1="4.7" x2="9.5" y2="7.7"/><line x1="13.5" y1="6.2" x2="16.5" y2="6.2"/><line x1="8" y1="17.8" x2="11" y2="17.8"/><line x1="13.5" y1="17.8" x2="16.5" y2="17.8"/><circle cx="15" cy="10.9" r="1.05"/><circle cx="9" cy="13.3" r="1.05"/><line x1="13.8" y1="12.1" x2="16.2" y2="14.5"/><line x1="16.2" y1="12.1" x2="13.8" y2="14.5"/><line x1="7.8" y1="10" x2="10.2" y2="12.4"/><line x1="10.2" y1="10" x2="7.8" y2="12.4"/>',
  shape:    '<path d="M12 3.5 21 20H3z"/>',
  flask:    '<path d="M9 3h6"/><path d="M10 3v5.2L4.6 17a2.3 2.3 0 0 0 2 3.4h10.8a2.3 2.3 0 0 0 2-3.4L14 8.2V3"/><path d="M7.4 14.5h9.2"/>',
  atom:     '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9.4" ry="4"/><ellipse cx="12" cy="12" rx="9.4" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.4" ry="4" transform="rotate(-60 12 12)"/>',
  ball:     '<circle cx="13.2" cy="4.9" r="1.9"/><path d="M7.2 21.2c.3-2 .6-3.4 1.8-4.7 1-1.1 2.4-1.7 3.4-3 .8-1.1 1.1-2.4 1.6-3.7"/><path d="M11.6 21.2c-.3-1.4-.3-2.7.2-4 .4-1 1.1-1.8 1.7-2.7"/><path d="M12.4 8.6c1.4-.4 2.9-.2 4.2.5"/><path d="M14.7 6.1 12 8l-4.4 1.3c-.5.2-.8.9-.5 1.4.2.5.9.8 1.4.5l3.7-1"/>',
  landmark: '<path d="M3 21h18"/><path d="M5 18v-8"/><path d="M9.5 18v-8"/><path d="M14.5 18v-8"/><path d="M19 18v-8"/><path d="M3 7l9-4.5L21 7z"/>',
  palette:  '<path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.4-.4-.6-.9-.6-1.4 0-1.1.9-2 2-2h2.3c3 0 4.8-2.2 4.8-5.1C22 5.7 17.5 2 12 2z"/><circle cx="7.5" cy="11.5" r="1.1"/><circle cx="10.3" cy="7.4" r="1.1"/><circle cx="14.8" cy="7.4" r="1.1"/>',
  monitor:  '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 8l2.2 2.5L7 13"/><path d="M11.5 13H14"/>',
  wrench:   '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  map:      '<circle cx="12" cy="12" r="9.3"/><path d="M4.6 6.4c2.2 1.5 3.1 3.4 5.4 4.2 1.6.6 3.4.4 4.6 1.6 1 1 1.2 2.6.4 3.8-.9 1.4-2.7 1.6-3.9 2.8-.8.8-1.2 1.9-1.6 3"/><path d="M15.2 3.2c1 1.8 2.6 2.7 4.9 3"/><path d="M20.9 10.6c-1.7.3-3.3.1-4.6 1"/><path d="M9.4 3.2c-.4 1.4-1.2 2.4-2.5 3"/>',
  leaf:     '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  users:    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  copy:     '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  film:     '<rect x="2" y="3" width="20" height="18" rx="2.5"/><line x1="7" y1="3" x2="7" y2="21"/><line x1="17" y1="3" x2="17" y2="21"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7.5" x2="7" y2="7.5"/><line x1="2" y1="16.5" x2="7" y2="16.5"/><line x1="17" y1="16.5" x2="22" y2="16.5"/><line x1="17" y1="7.5" x2="22" y2="7.5"/>',
  clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  user:     '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  check:    '<polyline points="20 6 9 17 4 12"/>',
  link:     '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  volume:   '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',

  calc:       '<rect x="5" y="2.8" width="14" height="18.4" rx="2.2"/><path d="M8.4 6.6h7.2"/><circle cx="9" cy="11.6" r=".95"/><circle cx="12" cy="11.6" r=".95"/><circle cx="15" cy="11.6" r=".95"/><circle cx="9" cy="15" r=".95"/><circle cx="12" cy="15" r=".95"/><circle cx="15" cy="15" r=".95"/><circle cx="9" cy="18.4" r=".95"/><circle cx="12" cy="18.4" r=".95"/><circle cx="15" cy="18.4" r=".95"/>',
  ruler:      '<rect x="2.8" y="9" width="18.4" height="6" rx="1.3"/><path d="M7 9v3M11 9v4M15 9v3M18.6 9v3.6"/>',
  compassd:   '<circle cx="12" cy="5" r="1.7"/><path d="M11 6.6 5.8 20M13 6.6 18.2 20"/><path d="M7.6 15.2c2.8 1.7 6 1.7 8.8 0"/>',
  pencil:     '<path d="M4 20l1.2-4.2L16.6 4.4a2.1 2.1 0 0 1 3 3L8.2 18.8 4 20z"/><path d="M14.6 6.4l3 3"/>',
  pen:        '<path d="M4 20c4.2-1 6.6-2.6 9-5l6.5-6.5-4-4L9 11c-2.4 2.4-4 4.8-5 9z"/><path d="M13.5 6.5l4 4"/>',
  eraser:     '<path d="M8.7 20.5H19"/><path d="M12.2 5.2l6.6 6.6a1.9 1.9 0 0 1 0 2.7l-5.6 5.6a1.9 1.9 0 0 1-2.7 0l-6.6-6.6a1.9 1.9 0 0 1 0-2.7l5.6-5.6a1.9 1.9 0 0 1 2.7 0z"/><path d="M7.5 9.9l6.6 6.6"/>',
  notebook:   '<rect x="5.2" y="3" width="13.6" height="18" rx="2"/><path d="M9.2 3v18"/><path d="M12.4 8h3.6M12.4 12h3.6M12.4 16h2.4"/>',
  clip:       '<rect x="5" y="4.2" width="14" height="16.8" rx="2"/><path d="M9 4.2V3.4A1.4 1.4 0 0 1 10.4 2h3.2A1.4 1.4 0 0 1 15 3.4v.8"/><path d="M9 10h6M9 14h4.5"/>',
  gradcap:    '<path d="M2.6 9.4 12 4.8l9.4 4.6L12 14 2.6 9.4z"/><path d="M6.6 11.6v4.4c0 1.5 2.4 2.9 5.4 2.9s5.4-1.4 5.4-2.9v-4.4"/><path d="M21.4 9.4v5.2"/>',
  school:     '<path d="M4.5 21V9.2L12 3.8l7.5 5.4V21"/><path d="M2.8 21h18.4"/><path d="M9.6 21v-4.6a2.4 2.4 0 0 1 4.8 0V21"/><circle cx="12" cy="10.6" r="1.6"/>',
  backpack:   '<path d="M7.2 8.4a4.8 4.8 0 0 1 9.6 0V19a2 2 0 0 1-2 2H9.2a2 2 0 0 1-2-2V8.4z"/><path d="M7.2 13.4h9.6"/><path d="M10 8.4V6.9a2 2 0 0 1 4 0v1.5"/>',
  bus:        '<rect x="4" y="3.6" width="16" height="13.2" rx="2.4"/><path d="M4 10.4h16"/><path d="M6.8 20.4h2.4M14.8 20.4h2.4"/><circle cx="8" cy="14.2" r=".95"/><circle cx="16" cy="14.2" r=".95"/>',
  apple:      '<path d="M12 7.6c-1.3-1.3-3.2-1.8-5-.9-2.7 1.3-3.5 4.8-2 8 1.4 3 3.6 5.3 5.3 5.3.8 0 1.1-.4 1.7-.4s.9.4 1.7.4c1.7 0 3.9-2.3 5.3-5.3 1.5-3.2.7-6.7-2-8-1.8-.9-3.7-.4-5 .9z"/><path d="M12 7.6c.1-2 1.1-3.4 3-4.4"/>',
  cup:        '<path d="M5 8.4h12V15a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8.4z"/><path d="M17 9.8h1.4a2.6 2.6 0 0 1 0 5.2H17"/><path d="M8.2 2.8c-.9 1-.9 2 0 3.1M12.2 2.8c-.9 1-.9 2 0 3.1"/>',
  pizza:      '<path d="M3.2 6.6C8.2 4.2 15.8 4.2 20.8 6.6L12 20.8 3.2 6.6z"/><circle cx="9.4" cy="9.6" r="1.15"/><circle cx="14.6" cy="9.6" r="1.15"/><circle cx="12" cy="13.4" r="1.15"/>',
  burger:     '<path d="M4 10a8 8 0 0 1 16 0H4z"/><path d="M4 13.4h16"/><path d="M4 16.6h16v.6a2.2 2.2 0 0 1-2.2 2.2H6.2A2.2 2.2 0 0 1 4 17.2v-.6z"/>',
  cake:       '<path d="M4 21h16"/><path d="M5.2 21v-6a2 2 0 0 1 2-2h9.6a2 2 0 0 1 2 2v6"/><path d="M5.2 16.8c1.6 1.3 2.7 1.3 4.3 0s2.7-1.3 4.3 0 2.7 1.3 4.3 0"/><path d="M12 10.6V8.2"/><path d="M12 5.6c.8-.9.8-1.8 0-2.8-.8 1-.8 1.9 0 2.8z"/>',
  bulb:       '<path d="M9.2 17.8h5.6"/><path d="M10.2 21h3.6"/><path d="M12 3a6 6 0 0 0-3.4 10.9c.8.6 1.4 1.4 1.4 2.3h4c0-.9.6-1.7 1.4-2.3A6 6 0 0 0 12 3z"/>',
  brain:      '<path d="M9.7 3.2A2.6 2.6 0 0 0 7.1 5.8c-1.9.3-3.2 1.8-3.2 3.7 0 .8.3 1.6.8 2.3-.5.7-.8 1.5-.8 2.3 0 2 1.6 3.6 3.6 3.7.3 1.7 1.7 3 3.4 3 1 0 1.4-.5 1.4-1.1V4.5c0-.8-1.1-1.3-2.6-1.3z"/><path d="M14.3 3.2a2.6 2.6 0 0 1 2.6 2.6c1.9.3 3.2 1.8 3.2 3.7 0 .8-.3 1.6-.8 2.3.5.7.8 1.5.8 2.3 0 2-1.6 3.6-3.6 3.7-.3 1.7-1.7 3-3.4 3-1 0-1.4-.5-1.4-1.1V4.5c0-.8 1.1-1.3 2.6-1.3z"/>',
  robot:      '<rect x="4.6" y="8.2" width="14.8" height="10.6" rx="2.4"/><path d="M12 8.2V5"/><circle cx="12" cy="3.9" r="1.1"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M9.4 16.2h5.2"/><path d="M2.6 12.2v2.8M21.4 12.2v2.8"/>',
  cpu:        '<rect x="6.2" y="6.2" width="11.6" height="11.6" rx="1.8"/><rect x="9.8" y="9.8" width="4.4" height="4.4"/><path d="M9.2 2.8v3.4M14.8 2.8v3.4M9.2 17.8v3.4M14.8 17.8v3.4M2.8 9.2h3.4M2.8 14.8h3.4M17.8 9.2h3.4M17.8 14.8h3.4"/>',
  code:       '<path d="M8.4 7.2 3.8 12l4.6 4.8"/><path d="M15.6 7.2 20.2 12l-4.6 4.8"/><path d="M13.2 4.6l-2.4 14.8"/>',
  terminal:   '<rect x="3" y="4.4" width="18" height="15.2" rx="2"/><path d="M7 9.4l3.2 2.6L7 14.6"/><path d="M12.6 15h4.6"/>',
  translate:  '<path d="M3.4 6h8.2"/><path d="M7.5 4v2c0 3.7-1.9 7-4.6 8.8"/><path d="M4.9 9.6c1.4 2.8 3.7 5 6.3 6.3"/><path d="M12.6 21l4.1-9.4 4.1 9.4"/><path d="M14 17.8h5.4"/>',
  microscope: '<path d="M5.4 21h13.2"/><path d="M8.6 21a6.6 6.6 0 0 0 9.2-6.1c0-2.3-1.2-4.4-3-5.6"/><path d="M11.2 3.2l4.2 4.2-4.4 4.4-4.2-4.2 4.4-4.4z"/><path d="M9.6 13.4l2.4 2.4"/><path d="M4.8 17.8 8 14.6"/>',
  dna:        '<path d="M4.6 3c0 5 3.9 6.1 7.4 7s7.4 2 7.4 7"/><path d="M19.4 3c0 5-3.9 6.1-7.4 7s-7.4 2-7.4 7"/><path d="M7.2 5.4h9.6M6.4 12h11.2M7.2 18.6h9.6"/>',
  thermo:     '<path d="M10.2 4.2a1.8 1.8 0 0 1 3.6 0v9.2a4.4 4.4 0 1 1-3.6 0V4.2z"/><circle cx="12" cy="17.4" r="1.6"/><path d="M12 14.6V8.4"/>',
  magnet:     '<path d="M6.2 3.8h4.2v7.2a1.6 1.6 0 0 0 3.2 0V3.8h4.2v7.2a5.8 5.8 0 0 1-11.6 0V3.8z"/><path d="M6.2 7.4h4.2M13.6 7.4h4.2"/>',
  zap:        '<path d="M13.2 2.6 4.8 13.4h6L9.4 21.4l8.4-10.8h-6l1.4-8z"/>',
  target:     '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.1"/>',
  medal:      '<circle cx="12" cy="15" r="4.6"/><path d="M8.6 11.2 5.4 3.6h4.2L12 8.8l2.4-5.2h4.2l-3.2 7.6"/>',
  trophy:     '<path d="M8 3.8h8v6.4a4 4 0 0 1-8 0V3.8z"/><path d="M8 5.4H4.4c0 3.2 1.5 5.1 3.9 5.5M16 5.4h3.6c0 3.2-1.5 5.1-3.9 5.5"/><path d="M12 14.2v3.4"/><path d="M8.6 20.6h6.8"/><path d="M9.8 20.6c0-2 .9-3 2.2-3s2.2 1 2.2 3"/>',
  dumbbell:   '<path d="M6.6 6.4v11.2M17.4 6.4v11.2M3.4 9v6M20.6 9v6M6.6 12h10.8"/>',
  shirt:      '<path d="M8.2 4 4.6 6.6 6.2 10l1.9-.9V20h7.8V9.1l1.9.9 1.6-3.4L15.8 4c-1 1.6-2.2 2.4-3.8 2.4S9.2 5.6 8.2 4z"/>',
  chess:      '<circle cx="12" cy="7.6" r="2.9"/><path d="M10.4 10.4 9.2 16.8h5.6l-1.2-6.4"/><path d="M6.6 20.6h10.8"/><path d="M8 16.8h8"/>',
  gamepad:    '<rect x="2.6" y="7.6" width="18.8" height="10.8" rx="4.2"/><path d="M7.2 10.8v4.4M5 13h4.4"/><circle cx="15.8" cy="11.6" r="1"/><circle cx="18.2" cy="14.2" r="1"/>',
  headphones: '<path d="M4 17.6v-4.8a8 8 0 0 1 16 0v4.8"/><rect x="3" y="14.2" width="4.2" height="6.2" rx="1.7"/><rect x="16.8" y="14.2" width="4.2" height="6.2" rx="1.7"/>',
  mic:        '<rect x="9.2" y="2.8" width="5.6" height="10.8" rx="2.8"/><path d="M5.8 11.6a6.2 6.2 0 0 0 12.4 0"/><path d="M12 17.8v3.2"/><path d="M8.8 21h6.4"/>',
  guitar:     '<circle cx="9.4" cy="14.6" r="4.6"/><circle cx="9.4" cy="14.6" r="1.5"/><path d="M12.8 11.2 20.4 3.6"/><path d="M17.6 4.6l1.8 1.8"/>',
  piano:      '<rect x="3" y="4.8" width="18" height="14.4" rx="1.8"/><path d="M7.6 4.8v8.4M12 4.8v8.4M16.4 4.8v8.4"/><path d="M5.4 13.2h13.2"/>',
  camera:     '<path d="M4 8.6a2 2 0 0 1 2-2h2l1.6-2.2h4.8L16 6.6h2a2 2 0 0 1 2 2v8.2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.6z"/><circle cx="12" cy="12.6" r="3.4"/>',
  video:      '<rect x="2.6" y="6.8" width="13" height="10.4" rx="2"/><path d="M15.6 10.8 21.4 7.6v8.8l-5.8-3.2"/>',
  flower:     '<circle cx="12" cy="12" r="2"/><circle cx="12" cy="6.6" r="2.2"/><circle cx="12" cy="17.4" r="2.2"/><circle cx="6.6" cy="12" r="2.2"/><circle cx="17.4" cy="12" r="2.2"/>',
  tree:       '<path d="M12 2.8 7.4 9.2h2.4L6 14.4h3.6L6.4 19h11.2l-3.2-4.6H18l-3.8-5.2h2.4L12 2.8z"/><path d="M12 19v2.4"/>',
  bug:        '<circle cx="12" cy="13.2" r="5"/><path d="M12 8.2V5.8"/><path d="M8.6 9.4 6.2 7M15.4 9.4 17.8 7"/><path d="M7 13.2H4.6M19.4 13.2H17M8.6 16.6l-2 2.2M15.4 16.6l2 2.2"/><path d="M9.8 5.9a2.2 2.2 0 0 1 4.4 0"/>',
  fish:       '<path d="M2.8 12c3-4.4 7.2-5.9 10.6-4.4 2.6 1.2 3.6 3.1 3.1 4.6-2 3.9-7.6 4.9-13.7-.2z"/><path d="M16.5 12.2 21 9.4v5.2l-4.5-2.4z"/><circle cx="7.6" cy="11" r=".9"/>',
  smile:      '<circle cx="12" cy="12" r="8.4"/><path d="M8.6 13.8a4.6 4.6 0 0 0 6.8 0"/><circle cx="9.2" cy="10" r=".9"/><circle cx="14.8" cy="10" r=".9"/>',
  key:        '<circle cx="7.8" cy="15.8" r="3.9"/><path d="M10.7 13 20 3.8"/><path d="M16.4 7.2l2.4 2.4M14 9.6l1.8 1.8"/>',
  lock:       '<rect x="5" y="10.6" width="14" height="9.8" rx="2"/><path d="M8.2 10.6V8a3.8 3.8 0 0 1 7.6 0v2.6"/><circle cx="12" cy="15.4" r="1.3"/>',
  shield:     '<path d="M12 2.9 19.4 5.7v5.5c0 4.6-3.1 8-7.4 9.9-4.3-1.9-7.4-5.3-7.4-9.9V5.7L12 2.9z"/>',
  award:      '<circle cx="12" cy="9" r="5.4"/><path d="M8.9 13.4 7.1 21.4l4.9-2.4 4.9 2.4-1.8-8"/>',
  hourglass:  '<path d="M6.2 3.4h11.6"/><path d="M6.2 20.6h11.6"/><path d="M7.6 3.4v2.8c0 2.6 4.4 3.1 4.4 5.8s-4.4 3.2-4.4 5.8v2.8"/><path d="M16.4 3.4v2.8c0 2.6-4.4 3.1-4.4 5.8s4.4 3.2 4.4 5.8v2.8"/>',
  watch:      '<circle cx="12" cy="12" r="5.4"/><path d="M12 9.6V12l1.7 1.1"/><path d="M9.2 6.8l.5-3.6h4.6l.5 3.6M9.2 17.2l.5 3.6h4.6l.5-3.6"/>',
  bell:       '<path d="M18 9.2a6 6 0 1 0-12 0c0 4.8-2 6-2 6h16s-2-1.2-2-6"/><path d="M10 19a2.2 2.2 0 0 0 4 0"/>',
  calendar:   '<rect x="3.6" y="5" width="16.8" height="15.4" rx="2"/><path d="M3.6 10h16.8"/><path d="M8.2 2.8v4M15.8 2.8v4"/>',
  star:       '<path d="M12 3.6l2.6 5.2 5.8.9-4.2 4.1 1 5.7L12 16.8l-5.2 2.7 1-5.7-4.2-4.1 5.8-.9L12 3.6z"/>',
  heart:      '<path d="M12 20.3S3.8 15 3.8 9.4C3.8 6.6 5.9 4.7 8.1 4.7c1.6 0 3.1.9 3.9 2.3.8-1.4 2.3-2.3 3.9-2.3 2.2 0 4.3 1.9 4.3 4.7 0 5.6-8.2 10.9-8.2 10.9z"/>',
  flag:       '<path d="M5.2 21V3.8"/><path d="M5.2 4.4c2.4-1.4 4.9-1.4 7.3 0s4.9 1.4 7.3 0v8.4c-2.4 1.4-4.9 1.4-7.3 0s-4.9-1.4-7.3 0"/>',
  pin:        '<path d="M12 21s-6.6-5.8-6.6-10.4A6.6 6.6 0 0 1 12 3.9a6.6 6.6 0 0 1 6.6 6.7C18.6 15.2 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.3"/>',
  sun:        '<circle cx="12" cy="12" r="3.9"/><path d="M12 2.8v2.3M12 18.9v2.3M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.8 12h2.3M18.9 12h2.3M4.4 19.6 6 18M18 6l1.6-1.6"/>',
  moon:       '<path d="M20 14.6A8.4 8.4 0 0 1 9.4 4 8.4 8.4 0 1 0 20 14.6z"/>',
  cloud:      '<path d="M7 18.4a4.4 4.4 0 0 1-.4-8.8A5.9 5.9 0 0 1 18.2 11a3.7 3.7 0 0 1-.7 7.4H7z"/>',
  flame:      '<path d="M12 21c-3.6 0-6-2.4-6-5.4 0-2.5 1.6-4.4 3-6 .3 1 .9 1.9 1.9 2.4-.3-3.3.7-6.4 3.2-8.9.4 2.7 2 4.2 3.4 6 1.1 1.4 2.1 3 2.1 5.4 0 3.6-2.9 6.5-7.6 6.5z"/>',
  chevl:      '<path d="M14.6 5.6 8.2 12l6.4 6.4"/>',
  chevr:      '<path d="M9.4 5.6 15.8 12l-6.4 6.4"/>',
  chevu:      '<path d="M5.6 9.4 12 15.8l6.4-6.4"/>',
  chevd:      '<path d="M5.6 14.6 12 8.2l6.4 6.4"/>',
  gear:       '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  trash:      '<path d="M4.2 7h15.6"/><path d="M9.2 7V5.2A1.2 1.2 0 0 1 10.4 4h3.2a1.2 1.2 0 0 1 1.2 1.2V7"/><path d="M6.4 7l1 13.2h9.2L17.6 7"/><path d="M10 11v5.4M14 11v5.4"/>',
  plus:       '<path d="M12 5.4v13.2M5.4 12h13.2"/>',
  editp:      '<path d="M4 20l1.1-3.9L15.7 5.5a1.9 1.9 0 0 1 2.7 2.7L7.8 18.9 4 20z"/><path d="M14 7.2l2.7 2.7"/>',
  
  german:     '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/><path d="M7.5 9h2.2a3 3 0 0 1 0 6H7.5V9zM14 9h3.4M14 12h2.6M14 15h3.4M14 9v6"/>',
  germanf:    '<path fill="currentColor" stroke="none" d="M12 2.9c-5.14 0-9.3 3.63-9.3 8.1 0 2.4 1.2 4.55 3.1 6v3.3c0 .62.65 1.02 1.2.74l3.3-1.83c.55.07 1.12.11 1.7.11 5.14 0 9.3-3.63 9.3-8.1S17.14 2.9 12 2.9z"/><path d="M7.5 8.5h2.2a2.3 2.3 0 0 1 0 4.6H7.5zm7 0h3m-3 2.3h2.2m-2.2 2.3h3" fill="none" stroke="' + IC_D + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  english:    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/><path d="M7.5 9h3.6M7.5 12h2.8M7.5 15h3.6M7.5 9v6M14 15V9l4 6V9"/>',
  ukr_lang:   '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/><path d="M7.5 9v4a2 2 0 0 0 4 0V9M14 15l2.2-6 2.2 6M14.7 13h3"/>',
  ukr_lit:    '<path d="M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0v13a9 9 0 0 0-9 0 9 9 0 0 0-9 0z"/><path d="M12 6v13"/><path d="M17 3.5l1.5 1.5-6.5 6.5v2h2l6.5-6.5 1.5 1.5"/>'
};




const ICON_ALIAS = { ball: 'run', palette: 'palettef', msgd: 'german', msgf: 'english' };
function icon(name, sz) {
  const nm = ICON_ALIAS[name] || name;
  return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[nm] || ICONS.bookf) + '</svg>';
}
function iconSvg(name) {
  return '<svg width="11" height="11" viewBox="0 0 24 24" fill="#e0e7ff"><path d="M8 5v14l11-7z"/></svg>';
}


function logoMark(sz) {
  return '<img src="' + LOGO + '" width="' + sz + '" height="' + sz + '" alt="" style="display:block;border-radius:' + Math.max(6, Math.round(sz * 0.22)) + 'px" />';
}


function applyScale() {
  
  
  
  
  
  const w = window.innerWidth || 1040, h = window.innerHeight || 700;
  let s = Math.min(w / 1040, h / 700);
  s = Math.max(0.8, Math.min(2.2, s));
  document.body.style.zoom = s;
}


function render(anim) {
  resolveLessons();
  const list = byId('list');
  if (!list) return;
  list.innerHTML = '';
  const sliding = (anim === 'slide-l' || anim === 'slide-r');
  list.classList.toggle('still', anim === false || sliding);
  list.classList.remove('slide-l', 'slide-r');
  if (sliding) { void list.offsetWidth; list.classList.add(anim); }
  const dn = byId('dayName');
  if (dn && anim !== false) { dn.classList.remove('dchg'); void dn.offsetWidth; dn.classList.add('dchg'); }
  const D = DAYDEFS[sel];
  const day = RES[sel] || [];
  byId('dayName').textContent = D ? D[2] : '';

  if (!day.length) {
    list.appendChild(el('div', 'empty', icon('bookopen', 28) + '<p>Немає уроків</p>'));
    tabEls.forEach(function (t, i) { t.classList.toggle('on', i === sel); });
    setChip();
    return;
  }

  
  let nowIdx = -1, nextIdx = -1, nowPct = 0;
  if (isTodaySel()) {
    const m = nowMin();
    day.forEach(function (l, i) {
      const a = toMin(l.t), b = toMin(l.e);
      if (a && b && m >= a && m < b) { nowIdx = i; nowPct = b > a ? Math.max(0, Math.min(1, (m - a) / (b - a))) : 0; }
      if (nextIdx === -1 && a && m < a) nextIdx = i;
    });
    if (nowIdx !== -1) nextIdx = -1;
  }

  day.forEach(function (l, i) {
    let cls = 'card';
    if (i === nowIdx) cls += ' now'; else if (i === nextIdx) cls += ' next';
    const card = el('div', cls);
    



    


    const tile = el('div', 'ic');
    
    
    
    tile.innerHTML = icon(l.icon, 24);
    tile.style.background = tileGrad(l.name);

    const mid = el('div', 'mid');
    


    const h3 = el('h3'); const lnS = el('span', 'ln'); lnS.textContent = l.name;
    
    h3.appendChild(lnS);
    

    try {
      


      const _stM = (function (t) { const m = /^\s*(\d{1,2}):(\d{2})/.exec(String(t || '')); return m ? ((+m[1]) * 60 + (+m[2])) : 0; })(l.t);
      const rm = (_stM > 755) ? null : roomFor(DAYDEFS[sel][0], l);
      

      if (rm) h3.appendChild(el('span', 'rm-chip', '№' + rm));
    } catch (eRm) {}
    if (i === nowIdx) h3.appendChild(el('span', 'now-chip', '<i></i>ЗАРАЗ'));
    if (i === nextIdx) h3.appendChild(el('span', 'next-chip', '<i></i>ДАЛІ'))
    mid.appendChild(h3);

    const meta = el('div', 'meta');
    const t1 = el('span', 'tc');
    t1.innerHTML = icon('clock', 12);
    const tv = el('span'); tv.textContent = l.t + '\u2013' + l.e;
    t1.appendChild(tv);
    meta.appendChild(t1);
    if (l.teacher) {
      const u1 = el('span', 'tc');
      u1.innerHTML = icon('user', 12);
      const uv = el('span'); uv.textContent = l.teacher;
      u1.appendChild(uv);
      meta.appendChild(u1);
    }
    mid.appendChild(meta);

    const b = el('button', 'b-join');
    b.innerHTML = '<span>Приєднатися</span> ' + iconSvg('play');
    b.onclick = function (ev) { ev.stopPropagation(); lastJoinBtn = b; joinLesson(l); };

    card.onclick = function () {
      if (lpFired) { lpFired = false; return; }
      if (swipeFired) { swipeFired = false; return; }
      lastJoinBtn = b; joinLesson(l);
    };
    card.addEventListener('contextmenu', function (ev) {
      ev.preventDefault();
      if (lpFired) { lpFired = false; return; }
      if (!cplOn()) return;               
      if (l.split) openModal(l);
      else copyText(fmtCopy(l, -1));       
    });
    bindLongPress(card, l);
    card.append(tile, mid, b);
    if (i === nowIdx) {
      const pr = el('i', 'prog');
      pr.style.width = Math.round(nowPct * 100) + '%';
      card.appendChild(pr);
    }
    list.appendChild(card);
  });
      


    if (render._popT) clearTimeout(render._popT);
    render._popT = setTimeout(function () {
      try {
        const cs = byId('list').querySelectorAll('.card.pop');
        for (let k = 0; k < cs.length; k++) { cs[k].classList.remove('pop'); cs[k].style.animationDelay = ''; }
      } catch (ePop) {}
    }, 1600);
  tabEls.forEach(function (t, i) { if (t.classList) t.classList.toggle('on', i === sel); });
  setChip();
  fitLessonTitles();
}





function fitLessonTitles() {
  const list = byId('list'); if (!list) return;
  requestAnimationFrame(function () {
    let nodes;
    try { nodes = list.querySelectorAll('.card h3 .ln'); } catch (e) { return; }
    for (let i = 0; i < nodes.length; i++) {
      const ln = nodes[i];
      ln.style.fontSize = '';
      const h = ln.parentElement;
      let fs = parseFloat(getComputedStyle(h).fontSize) || 15;
      const min = 10.5; let guard = 0;
      ln.style.fontSize = fs + 'px';
      while (ln.scrollWidth > ln.clientWidth + 1 && fs > min && guard < 24) {
        fs -= 0.5; ln.style.fontSize = fs + 'px'; guard++;
      }
    }
  });
}


let lpFired = false;
let swipeFired = false;   
function bindLongPress(card, l) {
  let sx = 0, sy = 0, t = null;
  card.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    sx = e.clientX; sy = e.clientY; lpFired = false;
    t = setTimeout(function () {
      t = null; lpFired = true;
      if (!cplOn()) return;               
      if (l.split) openModal(l);
      else copyText(fmtCopy(l, -1));
    }, 480);
  });
  card.addEventListener('pointermove', function (e) {
    if (t && (Math.abs(e.clientX - sx) > 12 || Math.abs(e.clientY - sy) > 12)) { clearTimeout(t); t = null; }
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
    card.addEventListener(ev, function () { if (t) { clearTimeout(t); t = null; } });
  });
}


function openModal(l) {
  const w = byId('mwrap'), items = byId('mItems');
  if (!w || !items) return;
  byId('mName').textContent = l.name;
  byId('mSub').textContent = 'обери групу — скопіюємо посилання';
  const ic = byId('mIc');
  ic.innerHTML = icon(l.icon, 19);
  ic.style.background = tileGrad(l.name);
  const tch = teachFor(l.key) || {};
  items.innerHTML = '';
  [0, 1].forEach(function (gi) {
    const b = el('button', 'm-item');
    const tn = String(tch[String(gi + 1)] || '');
    b.innerHTML = icon('copy', 16) +
      '<span class="m-l"><span class="m-lbl">' + l.lbls[gi] + '</span>' +
      (tn ? '<span class="m-t">' + tn + '</span>' : '') + '</span>' +
      '<small>' + icon('link', 11) + 'копіювати</small>';
    b.onclick = function (ev) { ev.stopPropagation(); copyText(fmtCopy(l, gi)); closeModal(); };
    items.appendChild(b);
  });
  w.classList.remove('hidden');
}
function closeModal() { const w = byId('mwrap'); if (w) w.classList.add('hidden'); }

function setChip() {
  const chip = byId('chip');
  if (!chip) return;
  const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + sel);
  const wd = new Intl.DateTimeFormat('uk-UA', { weekday: 'long' }).format(d);
  const dm = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' }).format(d);
  const cap = wd.charAt(0).toUpperCase() + wd.slice(1);
  const isToday = isTodaySel();
  chip.innerHTML = icon('clock', 12) + '<span>' + cap + ', ' + dm + (isToday ? ' <i class="today-dot"></i>' : '') + '</span>';
}

function todayIdx() { const d = todayDow(); return (d >= 1 && d <= 5) ? d - 1 : 0; }

function setTbSec(t) { const e = byId('tbSec'); if (e) e.textContent = t; }

function setSeg(view) {
  const a = byId('segSched'), b = byId('segSetup');
  if (a) a.classList.toggle('on', view === 'sched');
  if (b) b.classList.toggle('on', view === 'setup');
  const c2 = byId('segAdmin'); if (c2) c2.classList.toggle('on', view === 'adm');   
  


  try {
    const ab = byId('tbAcc');
    if (ab) {
      const was = ab.classList.contains('on');
      ab.classList.toggle('on', view === 'acc');
      if (!was && view === 'acc') { ab.classList.remove('accpop'); void ab.offsetWidth; ab.classList.add('accpop'); }
    }
  } catch (eTA) {}
  





  try {
    var _sgA = byId('segSched');
    var _seg = _sgA && _sgA.parentElement;
    if (_seg && _seg.classList && _seg.classList.contains('tb-seg') && typeof window.fhSegTo === 'function') window.fhSegTo(_seg, true);
  } catch (eSG) {}
}





let TABS_WARM = false;
function warmTabs() {
  if (TABS_WARM) return;
  TABS_WARM = true;
  setTimeout(function () {
    try { if (typeof buildSummary === 'function') buildSummary(); } catch (eW1) {}
    try { if (typeof refreshNotifUI === 'function') refreshNotifUI(); } catch (eW2) {}
    try { if (typeof refreshZoomUI === 'function') refreshZoomUI(); } catch (eW3) {}
    try { if (typeof refreshAccUI === 'function') refreshAccUI(); } catch (eW4) {}
    try { if (typeof admRender === 'function' && typeof staff === 'function' && staff()) admRender(); } catch (eW5) {}
    try { if (typeof refreshThemeUI === 'function') refreshThemeUI(); } catch (eW6) {}
  }, 80);
}
function showMain(force) {
  



  if (FIRST && !force) { showSetup(); openGroups(); return; }   
  setupOpen = false;
  byId('vSetup').classList.add('hidden');
  const _vd1 = byId('vAdmin'); if (_vd1) _vd1.classList.add('hidden');   
  const _va1 = byId('vAcc'); if (_va1) _va1.classList.add('hidden');   
  document.body.setAttribute('data-view', 'sched');
  byId('vMain').classList.remove('hidden');
  setChip();
  markNav('sched');
  setSeg('sched');
  setTbSec('розклад');
  host('fh:view|main');   
  checkNban();
  warmTabs();   
}
function showSetup() {
  setupOpen = true;
  host('fh:view|setup');   
  closeDrawer();
  byId('vMain').classList.add('hidden');
  const _vd2 = byId('vAdmin'); if (_vd2) _vd2.classList.add('hidden');   
  const _va2 = byId('vAcc'); if (_va2) _va2.classList.add('hidden');   
  document.body.setAttribute('data-view', 'setup');
  byId('vSetup').classList.remove('hidden');
  buildSummary();
  refreshNotifUI();
  refreshZoomUI();
  markNav('setup');
  setSeg('setup');
  setTbSec('налаштування');
}




const ADM_ICON_PICK = ['bookf','bookopenf','msgf','globef','mathf','sigmaf','shapef','filmf','atomf','run','flaskf','usersf','monitorf','landmarkf','buildf','ecof','palettef','musicf','german','germanf','english','ukr_lang','ukr_lit','calc','ruler','compassd','pencil','pen','eraser','notebook','clip','gradcap','school','backpack','bus','apple','cup','pizza','burger','cake','bulb','brain','robot','cpu','code','terminal','translate','microscope','dna','thermo','magnet','zap','target','medal','trophy','dumbbell','shirt','chess','gamepad','headphones','mic','guitar','piano','camera','video','flower','tree','bug','fish','smile','key','lock','shield','award','hourglass','watch','bell','calendar','star','heart','flag','pin','sun','moon','cloud','flame'];

const ADM_ICON_CAT = [
  ['Навчання', ['bookf','bookopenf','ukr_lit','notebook','pencil','pen','eraser','clip','gradcap','school','backpack','bus','landmarkf','buildf']],
  ['Точні науки', ['mathf','sigmaf','shapef','calc','ruler','compassd','atomf','flaskf','microscope','dna','thermo','magnet']],
  ['Мови та світ', ['globef','msgf','german','germanf','english','ukr_lang','translate','usersf']],
  ['Технології', ['monitorf','cpu','code','terminal','robot','bulb','brain','zap']],
  ['Мистецтво', ['palettef','musicf','guitar','piano','camera','video','mic','headphones','filmf']],
  ['Спорт і ігри', ['run','dumbbell','medal','trophy','target','chess','gamepad','shirt']],
  ['Їжа', ['apple','cup','pizza','burger','cake']],
  ['Природа', ['ecof','flower','tree','bug','fish','sun','moon','cloud','flame']],
  ['Символи', ['smile','key','lock','shield','award','hourglass','watch','bell','calendar','star','heart','flag','pin']]
];
let ADM = { tab: 0, day: 0, draft: null, subj: null, pick: null, edit: -1, zm: 'one', zs: true, zv: null, wy: 0, wm: 0, dirty: false, saving: false };

function admName(key) { return key ? key.charAt(0).toUpperCase() + key.slice(1) : ''; }
function admStaff() { return !!(ACC.user && staff()); }

function admShow() {
  if (!admStaff()) { if (typeof showMain === 'function') showMain(); return; }
  try { closeDrawer(); } catch (e) {}
  ['vMain', 'vSetup', 'vAcc', 'vAdmin'].forEach(function (id) { const v = byId(id); if (v) v.classList.add('hidden'); });
  const v = byId('vAdmin'); if (v) { v.classList.remove('hidden'); v.scrollTop = 0; }
  try { document.body.setAttribute('data-view', 'adm'); } catch (e) {}
  if (typeof markNav === 'function') markNav('adm');
  if (typeof setSeg === 'function') setSeg('adm');
  if (typeof setTbSec === 'function') setTbSec('адмін-панель');
  ADM.draft = null; ADM.dirty = false;   
  admRender();
}
function admSetTab(i) { ADM.tab = i; admRender(); }
function admSetDay(i) { ADM.day = i; ADM.draft = null; ADM.dirty = false; admRenderBody(); }



function admRender() {
  admBind();
  const seg = byId('admSeg');
  if (seg) seg.querySelectorAll('.adm-seg-b').forEach(function (b, i) { b.classList.toggle('on', i === ADM.tab); });
  admRenderBody();
  admRenderWeeks();
}
function admRenderBody() {
  const b = byId('admBody'); if (!b) return;
  if (ADM.tab === 0) b.innerHTML = admSchedHtml();
  else if (ADM.tab === 1) b.innerHTML = admZoomHtml();
  else if (ADM.tab === 3) { b.innerHTML = adm46UsersHtml(); adm46UsersOpen(); }   
  else b.innerHTML = admIconsHtml();
}


function admPool() {
  const seen = {}, out = [];
  const add = function (k) { if (k && !seen[k]) { seen[k] = 1; out.push(k); } };
  const names = [];
  const addAll = function (src) { if (src) for (const k in src) names.push(k); };
  addAll(DBD.subjects); addAll(BUILTIN.subjects);
  names.sort();
  names.forEach(add);
  ['mon', 'tue', 'wed', 'thu', 'fri'].forEach(function (dk) {
    (schedFor(dk) || []).forEach(function (it) { add(normSubj(it.s)); });
  });
  return out;
}
function admMeta(key) {
  const sub = subjFor(key) || {};
  const tch = teachFor(key) || {};
  return {
    key: key,
    icon: sub.icon ? String(sub.icon) : '',
    t1: tch['1'] ? String(tch['1']) : '',
    t2: tch['2'] ? String(tch['2']) : '',
    tc: sub.tc ? String(sub.tc) : '',
    l0: (typeof sub.link === 'string') ? sub.link : '',
    l1: (sub.links && typeof sub.links['1'] === 'string') ? sub.links['1'] : '',
    l2: (sub.links && typeof sub.links['2'] === 'string') ? sub.links['2'] : ''
  };
}
function admIcon(key) { return admMeta(key).icon || 'bookf'; }   
function admInfoHtml(name) {
  const key = normSubj(name);
  if (!key) return '<span class="dim">обери предмет — і підказка з’явиться тут</span>';
  const m = admMeta(key);
  const bits = [];
  const t = m.t1 || m.t2 || m.tc;
  if (t) bits.push('<b>' + escH(t) + '</b>');
  bits.push((m.l0 || m.l1 || m.l2) ? '<span class="ok">Zoom є</span>' : '<span class="dim">Zoom не вказано</span>');
  bits.push(m.icon ? '<span class="ok">іконка з бази</span>' : '<span class="dim">іконка стандартна</span>');
  return bits.join(' <span class="adm-dot"></span> ');
}
function admSubjOptions(cur) {
  const pool = admPool();
  const curKey = normSubj(cur);
  if (curKey && pool.indexOf(curKey) < 0) pool.unshift(curKey);
  let h = '<option value="">— обери предмет —</option>';
  pool.forEach(function (k) {
    h += '<option value="' + escH(k) + '"' + (k === curKey ? ' selected' : '') + '>' + escH(admName(k)) + '</option>';
  });
  return h;
}


function admDraftArr() {
  if (ADM.draft) return ADM.draft;
  const dk = DAYDEFS[ADM.day][0];
  const src = schedFor(dk) || [];
  ADM.draft = src.slice(0, 12).map(function (it) {
    return { s: String(it.s || ''), t: String(it.t || ''), e: String(it.e || '') };
  });
  return ADM.draft;
}
function admTeacherOf(key) {
  const m = admMeta(key);
  if (m.t1 && m.t2) return m.t1 + ' / ' + m.t2;
  return m.t1 || m.t2 || m.tc || '';
}
function admHasZoom(key) {
  const m = admMeta(key);
  return !!(m.l0 || m.l1 || m.l2);
}
function admSchedHtml() {
  const draft = admDraftArr();
  

  let h = '<div class="adm-days">';
  DAYDEFS.forEach(function (d, i) {
    h += '<button class="adm-day' + (i === ADM.day ? ' on' : '') + '" data-admday="' + i + '" type="button"><b>' + d[1] + '</b><span>' + (schedFor(d[0]) || []).length + ' ур.</span></button>';
  });
  h += '</div><div class="adm-rows" id="admRows">';
  if (!draft.length) h += '<div class="adm-empty"><p>Поки жодного уроку</p><span>натисни «Додати урок» нижче</span></div>';
  draft.forEach(function (r, i) {
    const key = normSubj(r.s);
    const tch = admTeacherOf(key);
    h += '<div class="adm-lesson">'
       +   '<div class="adm-lrow">'
       +     '<span class="adm-num">' + (i + 1) + '</span>'
       +     '<span class="adm-tile" style="background:' + tileGrad(r.s) + '">' + icon(admIcon(key), 22) + '</span>'
       +     '<div class="adm-lmain">'
       +       '<b class="adm-lname">' + (key ? escH(admName(key)) : 'предмет не обрано') + '</b>'
       +       '<span class="adm-lteach">' + (tch ? escH(tch) : 'вчителя не вказано') + (admHasZoom(key) ? ' · <i>Zoom є</i>' : '') + '</span>'
       +     '</div>'
       +     '<div class="adm-ltime"><b>' + escH(r.t || '--:--') + '</b><span>' + escH(r.e || '--:--') + '</span></div>'
       +     '<div class="adm-lacts">'
       +       '<button class="adm-ib" data-act="up" data-i="' + i + '"' + (i === 0 ? ' disabled' : '') + ' type="button" aria-label="Вгору">' + icon('chevu', 14) + '</button>'
       +       '<button class="adm-ib" data-act="dn" data-i="' + i + '"' + (i === draft.length - 1 ? ' disabled' : '') + ' type="button" aria-label="Вниз">' + icon('chevd', 14) + '</button>'
       +       '<button class="adm-ib set" data-act="edit" data-i="' + i + '" type="button" aria-label="Налаштування уроку">' + icon('gear', 14) + '</button>'
       +     '</div>'
       +   '</div>'
       + '</div>';
  });
  h += '</div>'
     + '<div class="adm-actions">'
     +   '<button class="adm-btn ghost" data-act="addrow" type="button">' + icon('plus', 13) + 'Додати урок</button>'
     +   '<button class="adm-btn primary" data-act="savesched" type="button">Зберегти розклад</button>'
     + '</div>'
     + '<div class="adm-note">Вибери день тижня — і побачиш поточний розклад. Іконка, учитель і Zoom підтягуються з бази автоматично. Маленькі кнопки праворуч: порядок і налаштування уроку (видалення — в модалці «Налаштування уроку»). Зміни летять у базу — весь клас отримує їх миттєво.</div>';
  return h;   
}
function admAddRow() {
  const d = admDraftArr();
  if (d.length >= 12) { toast('Більше 12 уроків на день не додати'); return; }
  let t = '08:00', e = '08:45';
  const last = d.length ? d[d.length - 1] : null;
  if (last && last.e) {
    const p = String(last.e).split(':');
    const mins = (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0) + 10;
    const pad = function (n) { return (n < 10 ? '0' : '') + n; };
    t = pad(Math.floor(mins / 60) % 24) + ':' + pad(mins % 60);
    const em = mins + 45;
    e = pad(Math.floor(em / 60) % 24) + ':' + pad(em % 60);
  }
  d.push({ s: '', t: t, e: e });
  ADM.dirty = true;   
  admRenderBody();
  const rows = byId('admRows');
  if (rows) rows.scrollTop = rows.scrollHeight;
  admEditLesson(d.length - 1);   
}

function admEditLesson(i) {
  const d = admDraftArr();
  if (!d[i]) return;
  ADM.edit = i;
  const r = d[i];
  const prev = i > 0 ? d[i - 1] : null;
  const next = i < d.length - 1 ? d[i + 1] : null;
  const key = normSubj(r.s);
  admModal(
    '<div class="adm-mh"><span class="adm-tile big" style="background:' + tileGrad(r.s) + '">' + icon(admIcon(key), 24) + '</span>'
    + '<div><b>Урок ' + (i + 1) + '</b><span>' + (key ? escH(admName(key)) : 'предмет не обрано') + '</span></div></div>'
    + '<label class="adm-lbl">Предмет</label>'
    + '<select class="adm-in sel" id="adS">' + admSubjOptions(r.s) + '</select>'
    + '<div class="adm-tgrid">'
    +   '<div><label class="adm-lbl">Початок уроку</label><input class="adm-in" id="adT" type="time" value="' + escH(r.t) + '"></div>'
    +   '<div><label class="adm-lbl">Кінець уроку</label><input class="adm-in" id="adE" type="time" value="' + escH(r.e) + '"></div>'
    + '</div>'
    + '<div class="adm-hint">'
    +   (prev ? 'початок — не раніше ' + escH(prev.e) + ' (кінець попереднього)' : '')
    +   (prev && next ? ' · ' : '')
    +   (next ? 'кінець — не пізніше ' + escH(next.t) + ' (початок наступного)' : '')
    +   (!prev && !next ? 'меж немає — це єдиний урок дня' : '')
    + '</div>'
    + '<div class="adm-mfoot">'
    +   '<button class="adm-btn ghost redd" data-act="delrow" data-i="' + i + '" type="button">' + icon('trash', 13) + 'Видалити урок</button>'
    +   '<button class="adm-btn ghost" data-act="mclose" type="button">Скасувати</button>'
    +   '<button class="adm-btn primary" data-act="saverow" data-i="' + i + '" type="button">Зберегти</button>'
    + '</div>'
  );
}
function admSaveRow(i) {
  const d = admDraftArr();
  if (!d[i]) return;
  const g = function (id) { const e2 = byId(id); return e2 ? String(e2.value || '').trim() : ''; };
  const s = g('adS') ? admName(g('adS')) : '';
  const t = g('adT'), ev = g('adE');
  if (!s) { toast('Обери предмет'); return; }
  if (!t || !ev) { toast('Вкажи початок і кінець уроку'); return; }
  const prev = i > 0 ? d[i - 1] : null;
  const next = i < d.length - 1 ? d[i + 1] : null;
  if (toMin(ev) <= toMin(t)) { toast('Кінець уроку має бути пізніше початку'); return; }
  if (prev && prev.e && toMin(t) < toMin(prev.e)) { toast('Початок раніше кінця попереднього уроку (' + prev.e + ')'); return; }
  if (next && next.t && toMin(ev) > toMin(next.t)) { toast('Кінець пізніше початку наступного уроку (' + next.t + ')'); return; }
  d[i] = { s: s, t: t, e: ev };
  ADM.dirty = true;
  admModalClose();
  admRenderBody();
  toast('Урок оновлено у списку ✓');
}
function admDelRow(i) {
  const d = admDraftArr();
  if (!d[i]) return;
  d.splice(i, 1);
  ADM.dirty = true;
  admModalClose();
  admRenderBody();
  toast('Урок видалено зі списку');
}
function admSaveSched() {
  if (ADM.saving) return;   
  const draft = ADM.draft || [];
  const skip = draft.some(function (r) { return !normSubj(r.s) || !r.t || !r.e; });
  const arr = draft.filter(function (r) { return normSubj(r.s) && r.t && r.e; })
    .map(function (r) { return { s: admName(normSubj(r.s)), t: r.t, e: r.e }; });
  const dk = DAYDEFS[ADM.day][0];
  
  const saveBtn = document.querySelector('[data-act="savesched"]');
  const busy = function (on, txt) {
    ADM.saving = on;
    if (saveBtn) { saveBtn.disabled = on; saveBtn.textContent = on ? 'Зберігаємо…' : 'Зберегти розклад'; }
  };
  const done = function (ok, why) {
    busy(false);
    if (!ok) {
      
      toast(why === 'verify' ? 'База не підтвердила збереження — натисни «Зберегти розклад» ще раз'
                             : 'Не вдалося зберегти — немає зв’язку з базою');
      try { admRenderBody(); } catch (eR) {}
      return;
    }
    if (!DBD.schedule) DBD.schedule = {};
    DBD.schedule[dk] = arr.map(function (r) { return { e: r.e, s: r.s, t: r.t }; });
    ADM.draft = null; ADM.dirty = false;
    if (typeof render === 'function') render(false);
    admRender();
    toast(skip ? 'Розклад оновлено ✓ (перевірено в базі; порожні рядки пропущено)' : 'Розклад оновлено ✓ (перевірено в базі)');
  };
  busy(true);
  if (window.FH_WEB) {
    

    const verifyWeb = function (attempt) {
      fetch(DB_URL + '/' + fbEnc('schedule/' + dk) + '.json?cb=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; })
        .then(function (j) {
          if (j === null) { if (attempt < 1) { setTimeout(function () { verifyWeb(attempt + 1); }, 1200); return; } done(false, 'verify'); return; }
          const srv = (j === undefined || j === null) ? [] : j;
          if (Array.isArray(srv) && admDaySame(srv, arr)) { done(true); return; }
          if (attempt < 1) { admSchedWebPut(); return; }
          done(false, 'verify');
        });
    };
    const admSchedWebPut = function () {
      fetch(DB_URL + '/' + fbEnc('schedule/' + dk) + '.json', { method: 'PUT', body: JSON.stringify(arr.length ? arr : null) })
        .then(function (r) {
          if (!r.ok) { done(false, 'put'); return; }
          try { dbPut('update/webrev', Date.now(), null); } catch (eWB45) {}
          try { evSched(); } catch (eES47) {}
          verifyWeb(0);
        })
        .catch(function () { done(false, 'put'); });
    };
    admSchedWebPut();
    return;
  }
  d1SaveDay(dk, arr, function (ok) {
    if (!ok) { done(false, 'd1'); return; }
    try { dbPut('schedule/' + dk, arr.length ? arr : null, null); } catch (eM) {}
    done(true);
  });
}


function admGroupLbls(key) {
  const sub = subjFor(key) || {};
  if (Array.isArray(sub.lbl) && sub.lbl.length === 2 && String(sub.lbl[0]).trim() && String(sub.lbl[1]).trim())
    return [String(sub.lbl[0]), String(sub.lbl[1])];
  return ['1-ша група', '2-га група'];
}
function admIsStdLbl(lbl) {
  const a = String(lbl[0]).toLowerCase(), b2 = String(lbl[1]).toLowerCase();
  return (a === '1-ша група' || a === 'перша група') && (b2 === '2-га група' || b2 === 'друга група');
}
function admChip(ok2, txt) { return ok2 ? '<i class="adm-ok2">' + txt + '</i>' : '<i class="adm-dim2">' + txt + '</i>'; }
function admZoomSummary(key) {
  const m = admMeta(key);
  const two = !!(m.t1 || m.t2 || m.l1 || m.l2);
  if (!two) {
    const t = m.tc || '';
    return (t ? escH(t) : 'вчителя не вказано') + ' · ' + (m.l0 ? 'Zoom є' : 'без Zoom');
  }
  const lbl = admGroupLbls(key);
  const zc = (m.l1 ? 1 : 0) + (m.l2 ? 1 : 0);
  return escH(lbl[0]) + ' і ' + escH(lbl[1]) + ' · ' + (m.t1 || m.t2 ? 'вчителі є · ' : 'вчителів нема · ') + zc + ' із 2 Zoom';
}
function admZoomHtml() {
  const pool = admPool();
  let h = '<div class="adm-rows">';
  pool.forEach(function (k) {
    h += '<button class="adm-srow" data-edit="' + escH(k) + '" type="button">'
       +   '<span class="adm-tile" style="background:' + tileGrad(k) + '">' + icon(admIcon(k), 20) + '</span>'
       +   '<span class="adm-sname"><b>' + escH(admName(k)) + '</b><span>' + admZoomSummary(k) + '</span></span>'
       +   icon('chevr', 15)
       + '</button>';
  });
  h += '</div>'
     + '<div class="adm-actions"><button class="adm-btn ghost" data-act="addsubj" type="button">' + icon('plus', 13) + 'Додати предмет</button></div>'
     + '<div class="adm-note">Натисни на предмет — відкриється налаштування: режим «одна група» (учитель + спільне посилання) або «дві групи» (власні назви груп, учитель і Zoom для кожної). Заповнені поля підтягуються з бази. Зміни летять у базу — телефони й ПК класу підтягнуть їх самі.</div>';
  return h;
}
function admEditSubj(key) {
  ADM.subj = key;
  const m = admMeta(key);
  ADM.zm = (m.t1 || m.t2 || m.l1 || m.l2) ? 'two' : 'one';
  ADM.zs = admIsStdLbl(admGroupLbls(key));
  ADM.zv = null;
  admZoomModal();
}
function admZoomHarvest() {
  

  const g = function (id) { const e2 = byId(id); return e2 ? String(e2.value || '') : null; };
  const cur = ADM.zv || {};
  ADM.zv = {
    tc: (byId('adTc') ? g('adTc') : cur.tc),
    l0: (byId('adL0') ? g('adL0') : cur.l0),
    t1: (byId('adT1') ? g('adT1') : cur.t1),
    t2: (byId('adT2') ? g('adT2') : cur.t2),
    l1: (byId('adL1') ? g('adL1') : cur.l1),
    l2: (byId('adL2') ? g('adL2') : cur.l2),
    g1: (byId('adG1') ? g('adG1') : cur.g1),
    g2: (byId('adG2') ? g('adG2') : cur.g2)
  };
}
function admZoomModal() {
  const key = ADM.subj;
  if (!key) return;
  const m = admMeta(key);
  const lbl = admGroupLbls(key);
  const v = ADM.zv || {};
  const pick = function (cur, base) { return (cur !== null && cur !== undefined) ? cur : (base || ''); };
  let h = '<div class="adm-mh"><span class="adm-tile big" style="background:' + tileGrad(key) + '">' + icon(admIcon(key), 24) + '</span>'
    + '<div><b>' + escH(admName(key)) + '</b><span>вчитель і Zoom-посилання</span></div></div>'
    + '<div class="adm-mode" id="adMode">'
    +   '<button class="adm-mb' + (ADM.zm === 'one' ? ' on' : '') + '" data-zm="one" type="button"><b>Одна група</b><span>спільний урок без поділу</span></button>'
    +   '<button class="adm-mb' + (ADM.zm === 'two' ? ' on' : '') + '" data-zm="two" type="button"><b>Дві групи</b><span>поділ на дві групи</span></button>'
    + '</div>';
  if (ADM.zm === 'one') {
    const tc = pick(v.tc, (m.tc || m.t1 || m.t2));
    const l0 = pick(v.l0, m.l0);
    h += '<label class="adm-lbl">Учитель предмета</label>'
      + '<input class="adm-in" id="adTc" value="' + escH(tc) + '" placeholder="Прізвище та ім’я">'
      + '<label class="adm-lbl">Zoom-посилання уроку ' + admChip(!!l0, l0 ? 'заповнено · з бази' : 'ще не заповнено') + '</label>'
      + '<input class="adm-in" id="adL0" value="' + escH(l0) + '" placeholder="https://zoom.us/j/...">';
  } else {
    const g1 = ADM.zs ? '1-ша група' : (pick(v.g1, lbl[0]) || '1-ша група');
    const g2 = ADM.zs ? '2-га група' : (pick(v.g2, lbl[1]) || '2-га група');
    h += '<label class="adm-lbl">Назви груп</label>'
      + '<div class="adm-mode sm" id="adGmode">'
      +   '<button class="adm-mb' + (ADM.zs ? ' on' : '') + '" data-zs="1" type="button"><b>Стандартні</b><span>1-ша і 2-га група</span></button>'
      +   '<button class="adm-mb' + (!ADM.zs ? ' on' : '') + '" data-zs="0" type="button"><b>Свої назви</b><span>наприклад: Хлопці / Дівчата</span></button>'
      + '</div>';
    if (!ADM.zs) {
      h += '<div class="adm-tgrid">'
        + '<div><label class="adm-lbl">Назва 1-ї групи</label><input class="adm-in" id="adG1" value="' + escH(pick(v.g1, lbl[0])) + '" placeholder="наприклад: Хлопці"></div>'
        + '<div><label class="adm-lbl">Назва 2-ї групи</label><input class="adm-in" id="adG2" value="' + escH(pick(v.g2, lbl[1])) + '" placeholder="наприклад: Дівчата"></div>'
        + '</div>';
    }
    const t1 = pick(v.t1, m.t1), t2 = pick(v.t2, m.t2), l1 = pick(v.l1, m.l1), l2 = pick(v.l2, m.l2);
    h += '<label class="adm-lbl">Учитель · ' + escH(g1) + '</label>'
      + '<input class="adm-in" id="adT1" value="' + escH(t1) + '" placeholder="Прізвище та ім’я">'
      + '<label class="adm-lbl">Учитель · ' + escH(g2) + '</label>'
      + '<input class="adm-in" id="adT2" value="' + escH(t2) + '" placeholder="Прізвище та ім’я">'
      + '<label class="adm-lbl">Zoom · ' + escH(g1) + ' ' + admChip(!!l1, l1 ? 'заповнено · з бази' : 'ще не заповнено') + '</label>'
      + '<input class="adm-in" id="adL1" value="' + escH(l1) + '" placeholder="https://zoom.us/j/...">'
      + '<label class="adm-lbl">Zoom · ' + escH(g2) + ' ' + admChip(!!l2, l2 ? 'заповнено · з бази' : 'ще не заповнено') + '</label>'
      + '<input class="adm-in" id="adL2" value="' + escH(l2) + '" placeholder="https://zoom.us/j/...">';
  }
  h += '<div class="adm-mfoot"><button class="adm-btn ghost" data-act="mclose" type="button">Скасувати</button><button class="adm-btn primary" data-act="savesubj" type="button">Зберегти</button></div>';
  admModal(h);
}
function admSaveSubj() {
  const key = ADM.subj;
  if (!key) { admModalClose(); return; }
  const g = function (id) { const e2 = byId(id); return e2 ? String(e2.value || '').trim() : ''; };
  const old = subjFor(key) || {};
  const obj = {};
  if (old.icon) obj.icon = String(old.icon);
  if (ADM.zm === 'one') {
    const tc = g('adTc'), l0 = g('adL0');
    if (tc) obj.tc = tc;
    if (l0) obj.link = l0;
    if (Array.isArray(old.lbl) && old.lbl.length === 2) obj.lbl = [String(old.lbl[0]), String(old.lbl[1])];
    
    const admSubjOneDone = function () {
      if (!DBD.subjects) DBD.subjects = {};
      DBD.subjects[key] = obj;
      if (DBD.teachers) delete DBD.teachers[key];
      ADM.draft = null;
      admModalClose();
      admRender();
      toast('Збережено в базі ✓');
    };
    if (window.FH_WEB) {
      dbPut('subjects/' + key, obj, function (ok1) {
        dbPut('teachers/' + key, null, function () {
          if (ok1 === false) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
          admSubjOneDone();
        });
      });
      return;
    }
    d1UpsertSubject(key, [
      ['group1', null], ['group2', null],
      ['teacher1', obj.tc || null], ['teacher2', null],
      ['zoom1', obj.link || null], ['zoom2', null],
      ['icon', obj.icon !== undefined ? obj.icon : (old.icon || null)]
    ], function (ok) {
      if (!ok) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
      try { dbPut('subjects/' + key, obj, null); dbPut('teachers/' + key, null, null); } catch (eM1) {}
      admSubjOneDone();
    });
  } else {
    let lbl;
    if (ADM.zs) lbl = ['1-ша група', '2-ша група'];
    else {
      const n1 = g('adG1') || '1-ша група', n2 = g('adG2') || '2-ша група';
      lbl = [n1, n2];
    }
    const t1 = g('adT1'), t2 = g('adT2'), l1 = g('adL1'), l2 = g('adL2');
    obj.lbl = lbl;
    if (l1 || l2) obj.links = [null, l1 || null, l2 || null];
    const admSubjTwoDone = function () {
      if (!DBD.subjects) DBD.subjects = {};
      DBD.subjects[key] = obj;
      if (!DBD.teachers) DBD.teachers = {};
      DBD.teachers[key] = { '1': t1 || undefined, '2': t2 || undefined };
      if (!DBD.teachers[key]['1']) delete DBD.teachers[key]['1'];
      if (!DBD.teachers[key]['2']) delete DBD.teachers[key]['2'];
      if (!DBD.teachers[key]['1'] && !DBD.teachers[key]['2']) delete DBD.teachers[key];
      ADM.draft = null;
      admModalClose();
      admRender();
      toast('Збережено в базі ✓');
    };
    if (window.FH_WEB) {
      dbPut('subjects/' + key, obj, function (ok1) {
        dbPut('teachers/' + key, [null, t1 || null, t2 || null], function (ok2) {
          if (ok1 === false && ok2 === false) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
          admSubjTwoDone();
        });
      });
      return;
    }
    
    const l1v = (obj.links && obj.links[1]) ? obj.links[1] : null;
    const l2v = (obj.links && obj.links[2]) ? obj.links[2] : null;
    d1UpsertSubject(key, [
      ['group1', obj.lbl ? obj.lbl[0] : null], ['group2', obj.lbl ? obj.lbl[1] : null],
      ['teacher1', t1 || null], ['teacher2', t2 || null],
      ['zoom1', l1v], ['zoom2', l2v],
      ['icon', obj.icon !== undefined ? obj.icon : (old.icon || null)]
    ], function (ok) {
      if (!ok) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
      try { dbPut('subjects/' + key, obj, null); dbPut('teachers/' + key, [null, t1 || null, t2 || null], null); } catch (eM2) {}
      admSubjTwoDone();
    });
  }
}
function admAddSubj() {
  admModal(
    '<div class="adm-mh"><span class="adm-tile big" style="background:linear-gradient(135deg,#8b5cf6,#6366f1)">' + icon('plus', 24) + '</span>'
    + '<div><b>Новий предмет</b><span>додається у список subject у базі</span></div></div>'
    + '<label class="adm-lbl">Назва предмета</label><input class="adm-in" id="adNewSubj" placeholder="наприклад: Історія України">'
    + '<div class="adm-mfoot"><button class="adm-btn ghost" data-act="mclose" type="button">Скасувати</button><button class="adm-btn primary" data-act="creobj" type="button">Додати</button></div>'
  );
  setTimeout(function () { const e2 = byId('adNewSubj'); if (e2) e2.focus(); }, 60);
}
function admCreateSubj() {
  const e2 = byId('adNewSubj');
  const nm = e2 ? String(e2.value || '').trim().toLowerCase() : '';
  if (!nm) { toast('Введи назву предмета'); return; }
  const admCreateDone = function () {
    if (!DBD.subjects) DBD.subjects = {};
    DBD.subjects[nm] = { lbl: ['1-ша група', '2-ша група'] };
    admModalClose();
    admRender();
    toast('Предмет додано ✓');
  };
  if (window.FH_WEB) {
    dbPut('subjects/' + nm, { lbl: ['1-ша група', '2-ша група'] }, function (ok) {
      if (!ok) { toast('Не вдалося додати — немає зв’язку з базою'); return; }
      admCreateDone();
    });
    return;
  }
  d1UpsertSubject(nm, [['group1', '1-ша група'], ['group2', '2-ша група']], function (ok) {
    if (!ok) { toast('Не вдалося додати — немає зв’язку з базою'); return; }
    try { dbPut('subjects/' + nm, { lbl: ['1-ша група', '2-ша група'] }, null); } catch (eM3) {}
    admCreateDone();
  });
}


function admIconUsed() {
  const used = {};
  admPool().forEach(function (k) {
    const m = admMeta(k);
    if (m.icon) {
      if (!used[m.icon]) used[m.icon] = [];
      used[m.icon].push(k);
    }
  });
  return used;
}
function admIconsHtml() {
  const pool = admPool();
  const used = admIconUsed();
  const usedCnt = Object.keys(used).length;
  let h = '<div class="adm-rows">';
  pool.forEach(function (k) {
    const m = admMeta(k);
    h += '<button class="adm-srow" data-icon="' + escH(k) + '" type="button">'
       +   '<span class="adm-tile" style="background:' + tileGrad(k) + '">' + icon(admIcon(k), 20) + '</span>'
       +   '<span class="adm-sname"><b>' + escH(admName(k)) + '</b><span>' + (m.icon ? 'іконка з бази' : 'стандартна (книжка)') + '</span></span>'
       +   icon('chevr', 15)
       + '</button>';
  });
  h += '</div>';
  h += '<div class="adm-ihead"><b>На уроках</b><span>уже прив’язані до предметів</span></div><div class="adm-iframe">';
  Object.keys(used).sort().forEach(function (ic) {
    h += '<div class="adm-iusage"><span class="adm-tile" style="background:' + tileGrad(ic) + '">' + icon(ic, 20) + '</span>'
       + '<span>' + used[ic].map(function (k) { return escH(admName(k)); }).join(', ') + '</span></div>';
  });
  if (!usedCnt) h += '<div class="adm-iempty">жодна іконка ще не прив’язана до предмета</div>';
  h += '</div>';
  h += '<div class="adm-ihead"><b>Не використовуються</b><span>вільні іконки набору, ніде не прив’язані</span></div><div class="adm-iframe">';
  ADM_ICON_CAT.forEach(function (cat) {
    const free = cat[1].filter(function (ic) { return !used[ic]; });
    if (!free.length) return;
    h += '<div class="adm-icap">' + cat[0] + '</div><div class="adm-igrid2">';
    free.forEach(function (ic) {
      h += '<span class="adm-ig2" style="background:' + tileGrad(ic) + '">' + icon(ic, 20) + '</span>';
    });
    h += '</div>';
  });
  h += '</div>';
  return h;
}
function admPickIcon(key) {
  ADM.pick = key;
  const used = admIconUsed();
  const cur = admIcon(key);
  let h = '<div class="adm-mh"><span class="adm-tile big" style="background:' + tileGrad(key) + '">' + icon(cur, 24) + '</span>'
        + '<div><b>' + escH(admName(key)) + '</b><span>торкнись іконки — вона збережеться в базу</span></div></div>';
  const usedList = Object.keys(used).sort();
  h += '<div class="adm-ihead"><b>На уроках</b><span>уже використовуються</span></div><div class="adm-igrid2">';
  usedList.forEach(function (ic) {
    h += '<button class="adm-ig2' + (ic === cur ? ' sel' : '') + '" data-ig="' + ic + '" type="button" style="background:' + tileGrad(ic) + '" title="' + escH(used[ic].map(admName).join(', ')) + '">' + icon(ic, 21) + '</button>';
  });
  if (!usedList.length) h += '<div class="adm-iempty">поки жодної</div>';
  h += '</div>';
  h += '<div class="adm-ihead"><b>Не використовуються</b><span>вільні іконки за категоріями</span></div>';
  ADM_ICON_CAT.forEach(function (cat) {
    const free = cat[1].filter(function (ic) { return !used[ic]; });
    if (!free.length) return;
    h += '<div class="adm-icap">' + cat[0] + '</div><div class="adm-igrid2">';
    free.forEach(function (ic) {
      h += '<button class="adm-ig2' + (ic === cur ? ' sel' : '') + '" data-ig="' + ic + '" type="button" style="background:' + tileGrad(ic) + '">' + icon(ic, 21) + '</button>';
    });
    h += '</div>';
  });
  h += '<div class="adm-note" style="margin-top:12px">Перша рамка — іконки, які вже стоять на уроках (підказка показує, на яких). Друга — вільні, згруповані за категоріями. «Книжка» — стандартна: прибирає власну іконку предмета.</div>';
  h += '<div class="adm-mfoot"><button class="adm-btn ghost" data-act="mclose" type="button">Закрити</button></div>';
  admModal(h);
}
function admSaveIcon(nm) {
  const key = ADM.pick;
  if (!key) return;
  
  const admIconDone = function () {
    if (!DBD.subjects) DBD.subjects = {};
    if (!DBD.subjects[key]) DBD.subjects[key] = {};
      if (nm === 'bookf') delete DBD.subjects[key].icon; else DBD.subjects[key].icon = nm;
    ADM.draft = null;
    admModalClose();
    admRender();
    toast('Іконку оновлено ✓');
  };
  if (window.FH_WEB) {
    dbPut('subjects/' + key + '/icon', nm === 'bookf' ? null : nm, function (ok) { if (!ok) { toast('Не вдалося зберегти іконку'); return; } admIconDone(); });
    return;
  }
  d1UpsertSubject(key, [['icon', nm === 'bookf' ? null : nm]], function (ok2) {
    if (!ok2) { toast('Не вдалося зберегти іконку'); return; }
    try { dbPut('subjects/' + key + '/icon', nm === 'bookf' ? null : nm, null); } catch (eM4) {}
    admIconDone();
  });
}


const WK_MON = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
const WK_DOW = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
function admWeeksRefresh() {
  try {
    const v = byId('vAdmin');
    if (!v || v.classList.contains('hidden')) return;   
    admRenderWeeks();
  } catch (e) {}
}
function admWkShift(n) {
  if (!ADM.wy) { const t = new Date(); ADM.wy = t.getFullYear(); ADM.wm = t.getMonth(); }
  if (n === 'now') { const t = new Date(); ADM.wy = t.getFullYear(); ADM.wm = t.getMonth(); }
  else {
    ADM.wm += (n === 1 ? 1 : -1);
    if (ADM.wm < 0) { ADM.wm = 11; ADM.wy--; }
    if (ADM.wm > 11) { ADM.wm = 0; ADM.wy++; }
  }
  admRenderWeeks();
}
function admRenderWeeks() {
  const b = byId('admWeeks'); if (!b) return;   
  if (!ADM.wy) { const t = new Date(); ADM.wy = t.getFullYear(); ADM.wm = t.getMonth(); }
  const y = ADM.wy, m = ADM.wm;
  const first = new Date(y, m, 1);
  const start = wkMonday(first);
  const dim = new Date(y, m + 1, 0).getDate();
  const lastMon = wkMonday(new Date(y, m, dim));
  const today = new Date();
  const todayMon = wkMonday(today);
  const todayMonIso = wkIso(todayMon);
  const todayIso = wkIso({ y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() });
  const curType = wkType(todayMonIso);
  const curLabel = curType === 'on' ? 'ОНЛАЙН' : (curType === 'off' ? 'ОФЛАЙН' : 'КАНІКУЛИ');
  let h = '<section class="adm-card">'
       +   '<div class="adm-c-head"><span class="sw-c-ic grad">' + icon('clock', 16) + '</span>'
       +     '<div class="sw-c-tt"><b>Тижні</b><span>онлайн / офлайн чергування класу</span></div></div>'
       +   '<div class="wk-swap-bar">'
       +     '<div class="wk-cur-info">Поточний тиждень: <b class="wk-status-pill ' + curType + '">' + curLabel + '</b></div>'
       +     '<button class="wk-swap-btn" data-swap="1" type="button" title="Поміняти місцями онлайн та офлайн тижні">'
       +       '⇄ Поміняти місцями (онлайн ⇄ офлайн)'
       +     '</button>'
       +   '</div>'
       +   '<div class="wk-top">'
       +   '<button class="wk-nav" data-wkm="-1" type="button">' + icon('chevl', 14) + '</button>'
       +   '<b>' + WK_MON[m] + ' ' + y + '</b>'
       +   '<button class="wk-nav" data-wkm="1" type="button">' + icon('chevr', 14) + '</button>'
       +   '<button class="wk-now" data-wkm="now" type="button">Сьогодні</button>'
       + '</div>'
       + '<div class="wk-legend">'
       +   '<span class="lg on">онлайн-тиждень</span><span class="lg off">офлайн-тиждень</span><span class="lg vac">канікули</span>'
       + '</div>'
       + '<div class="wk-cal"><div class="wk-hrow">' + WK_DOW.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div>';
  let cur = { y: start.y, m: start.m, d: start.d };
  while (wkDiff(cur, lastMon) <= 0) {
    const monIso = wkIso(cur);
    const ty = wkType(monIso);
    const sunIso = wkIso(wkAddDays(cur, 6));
    const isCur = (todayIso >= monIso && todayIso <= sunIso);
    h += '<div class="wk-row ' + ty + (isCur ? ' cur' : '') + '">'
       +   '<div class="wk-days">';
    for (let i = 0; i < 7; i++) {
      const dd = wkAddDays(cur, i);
      const iso = wkIso(dd);
      h += '<span class="wk-c' + (iso === todayIso ? ' td' : '') + (dd.m === m + 1 && dd.y === y ? '' : ' out') + '">' + dd.d + '</span>';
    }
    h += '</div>';
    if (ty === 'vac') h += '<span class="wk-tag vac">канікули</span>';
    else h += '<span class="wk-tag ' + ty + '">' + (ty === 'on' ? 'онлайн' : 'офлайн') + (isCur ? ' (зараз)' : '') + '</span>';
    h += '</div>';
    cur = wkAddDays(cur, 7);
  }
  h += '</div>'
     + '<div class="adm-note">Клас навчається суворо почергово: офлайн ⇄ онлайн. Двох однакових тижнів поспіль бути не може ні за яких обставин. Кнопка «Поміняти місцями» перемикає поточний тиждень та всі наступні й попередні, гарантуючи чітке чергування без накладок.</div>'
     + '</section>';
  b.innerHTML = h;
}
function admWkSwap() {
  const newInv = !WEEKS_INVERTED;
  const wkSaveDone = function () {
    WEEKS_INVERTED = newInv;
    DBW = newInv ? [WK_ANCHOR] : [];
    if (typeof pushNotifSched === 'function') pushNotifSched();
    admRenderWeeks();
    const today = new Date();
    const curTy = wkType(wkIso(wkMonday(today)));
    toast('Порядок тижнів змінено! Поточний тиждень: ' + (curTy === 'on' ? 'ОНЛАЙН' : 'ОФЛАЙН') + ' ✓');
  };
  if (window.FH_WEB) {
    dbPut('weeks', { inverted: newInv ? 1 : 0, flips: newInv ? [WK_ANCHOR] : 0 }, function (ok) {
      if (!ok) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
      wkSaveDone();
    });
    return;
  }
  d1SaveWeeks(newInv, function (ok) {
    if (!ok) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
    try { dbPut('weeks', { inverted: newInv ? 1 : 0, flips: newInv ? [WK_ANCHOR] : 0 }, null); } catch (eM5) {}
    wkSaveDone();
  });
}
function admWkFlip(monIso) {
  admWkSwap();
}


function admModal(html) {
  const w = byId('admwrap'), b = byId('admModalBox');
  if (!w || !b) return;
  b.innerHTML = '<button class="adm-x" id="admX" type="button">×</button>' + html;
  w.classList.remove('hidden');
}
function admModalClose() {
  const w = byId('admwrap');
  if (w) w.classList.add('hidden');
  const b = byId('admModalBox');
  if (b) b.innerHTML = '';
  ADM.subj = null; ADM.pick = null; ADM.edit = -1; ADM.zv = null;
}


function admBind() {
  const seg = byId('admSeg');
  if (seg && !seg.__adm) {
    seg.__adm = 1;
    seg.addEventListener('click', function (ev) {
      const t = ev.target.closest('.adm-seg-b');
      if (t) admSetTab(parseInt(t.getAttribute('data-t'), 10) || 0);
    });
  }
  const bk3 = byId('admBack');   
  if (bk3 && bk3.parentNode) bk3.parentNode.removeChild(bk3);
  const body = byId('admBody');
  if (body && !body.__adm) {
    body.__adm = 1;
    body.addEventListener('click', function (ev) {
      const day = ev.target.closest('[data-admday]');
      if (day) { admSetDay(parseInt(day.getAttribute('data-admday'), 10) || 0); return; }
      const sw = ev.target.closest('[data-swap]');
      if (sw) { admWkSwap(); return; }
      const wkm = ev.target.closest('[data-wkm]');
      if (wkm) { admWkShift(wkm.getAttribute('data-wkm') === 'now' ? 'now' : (wkm.getAttribute('data-wkm') === '1' ? 1 : -1)); return; }
      const fl = ev.target.closest('[data-flip]');
      if (fl) { admWkFlip(fl.getAttribute('data-flip')); return; }
      const act = ev.target.closest('[data-act]');
      if (act) {
        const a = act.getAttribute('data-act');
        if (a === 'addrow') { admAddRow(); return; }
        if (a === 'savesched') { admSaveSched(); return; }
        if (a === 'addsubj') { admAddSubj(); return; }
        if (a === 'mclose') { admModalClose(); return; }
        if (a === 'savesubj') { admSaveSubj(); return; }
        if (a === 'creobj') { admCreateSubj(); return; }
        const i = parseInt(act.getAttribute('data-i'), 10);
        if (a === 'edit') { admEditLesson(i); return; }
        if (a === 'saverow') { admSaveRow(i); return; }
        if (a === 'delrow') { admDelRow(i); return; }
        if (a === 'up' && i > 0) { const d = admDraftArr(); const x = d[i - 1]; d[i - 1] = d[i]; d[i] = x; ADM.dirty = true; admRenderBody(); return; }
        if (a === 'dn') { const d = admDraftArr(); if (i < d.length - 1) { const x = d[i + 1]; d[i + 1] = d[i]; d[i] = x; ADM.dirty = true; admRenderBody(); } return; }
        if (a === 'del') { const d = admDraftArr(); d.splice(i, 1); ADM.dirty = true; admRenderBody(); toast('Урок видалено зі списку'); return; }
        return;
      }
      const ed = ev.target.closest('[data-edit]');
      if (ed) { admEditSubj(ed.getAttribute('data-edit')); return; }
      const ic = ev.target.closest('[data-icon]');
      if (ic) { admPickIcon(ic.getAttribute('data-icon')); return; }
    });
  }
  const wkb = byId('admWeeks');
  if (wkb && !wkb.__adm) {
    wkb.__adm = 1;
    wkb.addEventListener('click', function (ev) {
      const sw = ev.target.closest('[data-swap]');
      if (sw) { admWkSwap(); return; }
      const wkm = ev.target.closest('[data-wkm]');
      if (wkm) { admWkShift(wkm.getAttribute('data-wkm') === 'now' ? 'now' : (wkm.getAttribute('data-wkm') === '1' ? 1 : -1)); return; }
      const fl = ev.target.closest('[data-flip]');
      if (fl) admWkFlip(fl.getAttribute('data-flip'));
    });
  }
  const mw = byId('admwrap');
  if (mw && !mw.__adm) {
    mw.__adm = 1;
    mw.addEventListener('click', function (ev) {
      if (ev.target.id === 'admX' || ev.target.classList.contains('adm-backdrop')) { admModalClose(); return; }
      

      const ma = ev.target.closest('[data-act]');
      if (ma) {
        const a2 = ma.getAttribute('data-act');
        const i2 = parseInt(ma.getAttribute('data-i'), 10);
        if (a2 === 'mclose') { admModalClose(); return; }
        if (a2 === 'savesubj') { admSaveSubj(); return; }
        if (a2 === 'creobj') { admCreateSubj(); return; }
        if (a2 === 'saverow') { admSaveRow(i2); return; }
        if (a2 === 'delrow') { admDelRow(i2); return; }
      }
      const zm = ev.target.closest('[data-zm]');
      if (zm) { admZoomHarvest(); ADM.zm = zm.getAttribute('data-zm') === 'two' ? 'two' : 'one'; admZoomModal(); return; }
      const zs = ev.target.closest('[data-zs]');
      if (zs) { admZoomHarvest(); ADM.zs = zs.getAttribute('data-zs') === '1'; admZoomModal(); return; }
      const ig = ev.target.closest('[data-ig]');
      if (ig) { admSaveIcon(ig.getAttribute('data-ig')); return; }
    });
  }
}




function drawerOpen() { const d = byId('drawer'); return !!(d && d.classList.contains('on')); }
function openDrawer() { const d = byId('drawer'); if (d) d.classList.add('on'); const b = byId('dback'); if (b) b.classList.add('on'); }
function closeDrawer() {
  const d = byId('drawer'); if (d) d.classList.remove('on');
  const b = byId('dback'); if (b) b.classList.remove('on');
}
function markNav(view) {
  ['dwSched', 'dwSet'].forEach(function (id) {
    const e2 = byId(id); if (e2) e2.classList.remove('on');
  });
  const map = { home: 'dwSched', sched: 'dwSched', setup: 'dwSet', dev: '' };
  const t = byId(map[view] || '');   
  if (t) t.classList.add('on');
  
  try {
    const vv = { home: 'vMain', sched: 'vMain', setup: 'vSetup' }[view];
    const el3 = vv && byId(vv);
    if (el3 && !el3.classList.contains('hidden')) {
      el3.classList.remove('vin'); void el3.offsetWidth; el3.classList.add('vin');
    }
  } catch (e3) {}
}





function splitInfo(k) {
  const sub = subjFor(k) || {}, tch = teachFor(k) || {};
  const lbls = (sub.lbl && sub.lbl.length === 2) ? [String(sub.lbl[0]), String(sub.lbl[1])]
                                                 : ['1-ша група', '2-га група'];
  return { sub: sub, tch: tch, lbls: lbls };
}
function dispName(key) { return key ? key.charAt(0).toUpperCase() + key.slice(1) : ''; }
function saveGroupInstant(k, v, row, sE, seg, inf) {
  if (!S) S = {};
  S[k] = v;
  try { localStorage.setItem('fh_groups2', JSON.stringify(S)); } catch (e) {}
  if (!host('fh:save|' + JSON.stringify(oldKeyMap(S)))) {
    try { localStorage.setItem('fh_groups', JSON.stringify(oldKeyMap(S))); } catch (e) {}
  }
  

  if (row && row.__segBtns) {
    row.__cur = v;
    row.__segBtns.forEach(function (b2) { b2.classList.toggle('on', b2._v === v); });
    if (row.__sE && row.__inf) {
      const inf2 = row.__inf;
      row.__sE.textContent = String(inf2.tch[String(v)] || '') + ' · ' + inf2.lbls[v - 1];
    }
  } else {
    buildSummary();
  }
  render(false);
  const ordName = (v === 1) ? 'перша' : 'друга';
  toast(dispName(k) + ' — ' + ordName + ' група ✓');
}
function infName(k) { return dispName(k); }
function buildSummary() {
  const rows = byId('sumRows');
  if (!rows) return;
  rows.innerHTML = '';
  const keys = splitKeys();
  const done = keys.filter(function (k) { return S && (S[k] === 1 || S[k] === 2); }).length;
  if (!done) {
    rows.appendChild(el('div', 'sum-hint',
      'Групи ще не обрано. Натисни 1 або 2 біля предмета — і застосунок скрізь підставить саме твоїх вчителів і посилання.'));
    return;
  }
  keys.forEach(function (k, idx) {
    const inf = splitInfo(k);
    const g = (S && (S[k] === 1 || S[k] === 2)) ? S[k] : 0;
    const row = el('div', 'sw-row');
    const ic = el('div', 'su-tile');
    ic.innerHTML = icon(inf.sub.icon || 'book', 15);
    ic.style.background = tileGrad(k);
    const nm = el('div', 'sw-gname');
    const bE = el('b'); bE.textContent = dispName(k);
    const sE = el('span'); sE.textContent = g ? (String(inf.tch[String(g)] || '') + ' · ' + inf.lbls[g - 1]) : 'не обрано';
    nm.append(bE, sE);
    const seg = el('div', 'seg');
    const segBtns = [];
    [1, 2].forEach(function (v) {
      const b2 = el('button'); b2.type = 'button'; b2.textContent = inf.lbls[v - 1] || (v + ' група');
      b2.classList.toggle('on', g === v);
      b2._k = k; b2._v = v;
      b2.onclick = function (ev) {
        ev.stopPropagation();
        

        if (S[k] !== v) saveGroupInstant(k, v, row, sE, seg, inf);
      };
      segBtns.push(b2);
      seg.appendChild(b2);
    });
    row.__segBtns = segBtns; row.__sE = sE; row.__inf = inf; row.__k = k;
    row.__cur = g;
    row.append(ic, nm, seg);
    rows.appendChild(row);
  });
}


let draft = {};
let optEls = [];
function openGroups() {
  


  if (typeof fhSettling !== 'undefined' && fhSettling) {
    
    fhPendingMaster = true;
    try { toast('перевіряємо дані — групи відкрию за секунду\u2026'); } catch (eTQ) {}
    return;
  }
  draft = {}; optEls = [];
  const rows = byId('gRows');
  if (!rows) return;
  const gc = byId('gCancel');
  if (gc) gc.classList.toggle('hidden', FIRST);       
  const gs = byId('gSub');
  if (gs) gs.textContent = FIRST ? 'обери групу для кожного предмета — це обов’язково'
                                 : 'обери групу для кожного предмета';
  const keys = splitKeys();
  keys.forEach(function (k) { if (S && (S[k] === 1 || S[k] === 2)) draft[k] = S[k]; });
  rows.innerHTML = '';
  keys.forEach(function (k) {
    const inf = splitInfo(k);
    const row = el('div', 'su-item');
    const ic = el('div', 'su-tile');
    ic.innerHTML = icon(inf.sub.icon || 'book', 16);
    ic.style.background = tileGrad(k);
    const body = el('div', 'su-body');
    const nm = el('div', 'su-name'); nm.textContent = dispName(k);
    const opts = el('div', 'su-opts');
    [0, 1].forEach(function (gi) {
      const v = gi + 1;
      const o = el('button', 'su-opt');
      const bE = el('b'); bE.textContent = inf.lbls[gi];
      const sE = el('span'); sE.textContent = String(inf.tch[String(v)] || '');
      const ck = el('span', 'ck'); ck.innerHTML = icon('check', 13);
      o.append(bE, sE, ck);
      o.onclick = function () { draft[k] = v; refreshGroups(); };
      o._k = k; o._v = v;
      opts.appendChild(o);
      optEls.push(o);
    });
    body.append(nm, opts);
    row.append(ic, body);
    rows.appendChild(row);
  });
  refreshGroups();
  byId('gwrap').classList.remove('hidden');
}
function closeGroups() {
  if (FIRST) return;                                  
  const w = byId('gwrap'); if (w) w.classList.add('hidden');
}
function groupsOpen() { const w = byId('gwrap'); return !!(w && !w.classList.contains('hidden')); }
function refreshGroups() {
  optEls.forEach(function (o) { o.classList.toggle('on', draft[o._k] === o._v); });
  const keys = splitKeys();
  const done = keys.filter(function (k) { return draft[k] === 1 || draft[k] === 2; }).length;
  const gp = byId('gProg');
  if (gp) gp.textContent = done + '/' + keys.length;
  byId('gSave').disabled = done !== keys.length;
}
function oldKeyMap(s) {
  const o = {};
  for (const ok in OLDKEY) o[ok] = (s[OLDKEY[ok]] === 2) ? 2 : 1;
  return o;
}
function nextLessonName() {
  const l = nextLessonFull();
  return l ? l.name : 'Урок';
}

function nextLessonFull() {
  resolveLessons();
  const ti = todayIdx();
  const m = nowMin();
  const days = [RES[ti] || [], RES[(ti + 1) % 5] || []];
  for (let d = 0; d < 2; ++d) {
    for (let i = 0; i < days[d].length; ++i) {
      const a = toMin(days[d][i].t);
      if (a && (d === 1 || a > m)) return days[d][i];
    }
  }
  return days[0][0] || null;
}
function saveSettings() {
  const keys = splitKeys();
  const ok = keys.every(function (k) { return draft[k] === 1 || draft[k] === 2; });
  if (!ok) return;
  const first = FIRST;
  S = {};
  keys.forEach(function (k) { S[k] = draft[k]; });
  FIRST = false;
  try { localStorage.setItem('fh_groups2', JSON.stringify(S)); } catch (e) {}
  if (!host('fh:save|' + JSON.stringify(oldKeyMap(S)))) {
    try { localStorage.setItem('fh_groups', JSON.stringify(oldKeyMap(S))); } catch (e) {}
  }
  closeGroups();
  render(false);
  if (setupOpen) buildSummary();
  toast('Групи збережено ✓');
  syncUp(30);   
  

  if (first || setupOpen) showMain();
}





function nextTestLessonName() {
  try {
    const now = new Date();
    const cur = (now.getHours() * 60) + now.getMinutes();
    for (let off = 0; off < 7; off++) {
      const d = new Date(now.getTime() + off * 86400000);
      const dow = ((d.getDay() + 6) % 7) + 1;           
      if (dow > 5) continue;
      const day = RES[dow - 1] || [];
      for (let i = 0; i < day.length; i++) {
        const l = day[i];
        if (!l || !l.t) continue;
        const m = /^(\d{1,2}):(\d{2})$/.exec(String(l.t).trim());
        if (!m) continue;
        const st = (parseInt(m[1], 10) * 60) + parseInt(m[2], 10);
        if (off > 0 || st > cur) return l.name || 'Урок';
      }
    }
  } catch (e) {}
  return 'Інформатика';
}
function testNotifSound() {
  const d = new Date(Date.now() + 5 * 60000);
  const hh = ('0' + d.getHours()).slice(-2), mm = ('0' + d.getMinutes()).slice(-2);
  



  const title = 'Зайти на урок через ' + NOTIF.min + ' хв';
  const text = '\uD83D\uDD14 ' + nextTestLessonName() + ' • початок о ' + hh + ':' + mm + ' (тест)';   
  


  const turl = 'https://us05web.zoom.us/j/' + (600000000 + Math.floor(Math.random() * 399999999));
  

  const sn = NOTIF.min > 1;
  

  window.__fhTest = { url: turl, ts: Date.now() };
  if (ANDROID) {
    try {
      if (AndroidHost.hasNotifPerm && !AndroidHost.hasNotifPerm()) {
        try { AndroidHost.requestNotifPerm(); } catch (e2) {}
        try { toast('Дозвольте сповіщення Android — і натисніть тест ще раз'); } catch (e3) {}
      }
    } catch (e) {}
    try { AndroidHost.testNotif(title, text, turl, NOTIF.snd ? '1' : '0', sn ? '1' : '0'); } catch (e) {}
    return;
  }
  host('fh:notif-test|' + JSON.stringify({ title: title, text: text, snd: !!NOTIF.snd, url: turl, sn: sn }));
}
function pushNotifSched(quiet) {   
  resolveLessons();
  

  const items = [];
  const skipArr = (!NOTIF.off) ? (wkSuppressed(16) || []) : [];
  const skipSet = {};
  skipArr.forEach(function (dsk) { if (dsk) skipSet[String(dsk)] = 1; });
  for (let dd = 0; dd < 16; dd++) {
    const day = new Date(Date.now() + dd * 86400000);
    const dow = ((day.getDay() + 6) % 7) + 1;               
    if (dow > 5) continue;
    if (!NOTIF.off) {
      const wk = wkType(wkIso(wkMonday(day)));
      if (wk !== 'on') continue;
      const dstr = day.getFullYear() + '-' + ('0' + (day.getMonth() + 1)).slice(-2) + '-' + ('0' + day.getDate()).slice(-2);
      if (skipSet[dstr]) continue;
    }
    const dayArr = RES[dow - 1] || [];
    const _dstr = day.getFullYear() + '-' + ('0' + (day.getMonth() + 1)).slice(-2) + '-' + ('0' + day.getDate()).slice(-2);
    const _dayMs = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
    dayArr.forEach(function (l) {
      if (l.t) {
        


        const _fk = _dstr + '|' + String(l.t);
        if (NFIRED[_fk]) return;
        



        const _sm = (/^(\d{1,2}):(\d{2})/.exec(String(l.t)));
        


        const _armed60 = !!NARMED[_fk];
        const _mins = _armed60 ? 1 : NOTIF.min;
        const _at = _sm ? (_dayMs + ((+_sm[1]) * 60 + (+_sm[2])) * 60000 - _mins * 60000) : 0;
        items.push({ dow: dow, t: l.t, n: '\uD83D\uDD14 ' + l.name, u: l.url || '', m: ZOOM.mode, d: _dstr, at: _at, r60: _armed60 ? 1 : 0 });   
      }
    });
  }
  const payload = JSON.stringify({
    
    on: NOTIF.on,
    min: NOTIF.min,
    snd: !!NOTIF.snd,
    off: !!NOTIF.off,
    q: !!quiet,
    skip: skipArr,   
    items: items
  });
  host('fh:notif|' + payload);
  if (ANDROID) { try { AndroidHost.setNotif(payload); } catch (e) {} }
}
function refreshNotifUI() {
  const nOn = byId('nOn'), row = byId('nMinRow'), perm = byId('bPerm');
  if (nOn) nOn.checked = NOTIF.on;
  if (row) row.classList.toggle('hidden', !NOTIF.on);
  if (perm) {
    let show = false;
    if (ANDROID) { try { show = !AndroidHost.hasNotifPerm(); } catch (e) { show = false; } }
    perm.classList.toggle('hidden', !show || !NOTIF.on);
  }
  const sl = byId('nMin'), sv = byId('nMinVal');
  if (sl) {
    sl.value = NOTIF.min;
    sl.style.setProperty('--p', (((NOTIF.min - 1) / 14) * 100).toFixed(1) + '%');
  }
  if (sv) sv.textContent = NOTIF.min + ' хв';
  const nSnd = byId('nSnd'), sRow = byId('nSndRow'), tBtn = byId('bTestN');
  if (nSnd) nSnd.checked = !!NOTIF.snd;
  if (sRow) sRow.classList.toggle('hidden', !NOTIF.on);   
  const nOff = byId('nOff'), oRow = byId('nOffRow');
  if (nOff) nOff.checked = !!NOTIF.off;
  if (oRow) oRow.classList.toggle('hidden', !NOTIF.on);
  
  if (tBtn) tBtn.classList.remove('hidden');
}


let cacheTs = 0, dbOnline = false;   
function applyDb(db, fromCache) {
  if (!db || typeof db !== 'object') return false;
  let changed = false;
  
  function validNode(n) { return !!(n && typeof n === 'object'); }
  if (db.teachers !== undefined && validNode(db.teachers)) {
    const t = {};
    for (const k in db.teachers) {
      const v = db.teachers[k];
      if (!validNode(v)) continue;
      const g = {};
      if (typeof v['1'] === 'string' && v['1']) g['1'] = v['1'];
      if (typeof v['2'] === 'string' && v['2']) g['2'] = v['2'];
      if (g['1'] || g['2']) t[k] = g;
    }
    if (JSON.stringify(t) !== JSON.stringify(DBD.teachers)) { DBD.teachers = t; changed = true; }   
  }
  if (db.subjects !== undefined && validNode(db.subjects)) {
    const t = {};
    for (const k in db.subjects) {
      const v = db.subjects[k];
      if (!validNode(v)) continue;
      const o = {};
      if (typeof v.link === 'string' && v.link) o.link = v.link;
      if (validNode(v.links)) {
        const ls = {};
        if (typeof v.links['1'] === 'string' && v.links['1']) ls['1'] = v.links['1'];
        if (typeof v.links['2'] === 'string' && v.links['2']) ls['2'] = v.links['2'];
        if (ls['1'] || ls['2']) o.links = ls;
      }
      if (typeof v.icon === 'string' && v.icon) o.icon = v.icon;
      if (typeof v.tc === 'string' && v.tc) o.tc = v.tc;
      if (Array.isArray(v.lbl) && v.lbl.length === 2) o.lbl = [String(v.lbl[0]), String(v.lbl[1])];
      t[k] = o;
    }
    if (JSON.stringify(t) !== JSON.stringify(DBD.subjects)) { DBD.subjects = t; changed = true; }   
  }
  if (db.schedule !== undefined && validNode(db.schedule)) {
    const t = {}; let okCnt = 0;
    for (const dk in db.schedule) {
      const arr = db.schedule[dk];
      if (!Array.isArray(arr) || arr.length > 9) continue;
      const ls = []; let ok = true;
      for (const it of arr) {
        if (!it || typeof it !== 'object' || !String(it.s || '').trim() || !String(it.t || '').trim() || !String(it.e || '').trim()) { ok = false; break; }
        const o = { t: String(it.t), e: String(it.e), s: String(it.s) };
        if (it.ik) o.ik = String(it.ik);
        if (it.u) o.u = String(it.u);
        if (it.tc) o.tc = String(it.tc);
        ls.push(o);
      }
      if (ok && ls.length) { t[dk] = ls; okCnt++; }
    }
    if (okCnt && JSON.stringify(t) !== JSON.stringify(DBD.schedule)) { DBD.schedule = t; changed = true; }   
  }
  if (db.weeks !== undefined) {                     
    let inv = false;
    if (db.weeks && typeof db.weeks === 'object') {
      if (db.weeks.inverted !== undefined) inv = (db.weeks.inverted === 1 || db.weeks.inverted === true);
      else if (Array.isArray(db.weeks.flips)) inv = (db.weeks.flips.length % 2 === 1);
      else if (db.weeks.flips) inv = true;
    } else if (Array.isArray(db.weeks)) {
      inv = (db.weeks.length % 2 === 1);
    }
    const fl = inv ? [WK_ANCHOR] : [];
    if (inv !== WEEKS_INVERTED || JSON.stringify(fl) !== JSON.stringify(DBW)) {
      WEEKS_INVERTED = inv;
      DBW = fl;
      changed = true;
      if (typeof admWeeksRefresh === 'function') admWeeksRefresh();
    }
  }
  
  const hasNode = (db.teachers !== undefined && validNode(db.teachers)) ||
                  (db.subjects !== undefined && validNode(db.subjects)) ||
                  (db.schedule !== undefined && validNode(db.schedule)) ||
                  db.weeks !== undefined || (db.app !== undefined && validNode(db.app));
  if (db.app !== undefined && validNode(db.app)) {
    const r = (typeof db.app.repo === 'string') ? db.app.repo.trim() : '';
    if (r && r !== UPDATE_REPO) {
      UPDATE_REPO = r;
      try { localStorage.setItem('fh_repo', r); } catch (e) {}
    }
  }
  if (db.update && typeof db.update === 'object' && db.update.test !== undefined) {
    const t2 = (db.update.test && typeof db.update.test === 'object' && db.update.test !== null) ? db.update.test : null;
    DBD.updTest = t2 ? { latest: String(t2.latest || ''), notes: Array.isArray(t2.notes) ? t2.notes.map(String).slice(0, 4) : [], tid: String(t2.tid || '') } : null;
  }
  







  if (hasNode && !fromCache) {
    dbOnline = true;
    try {
      const prev = JSON.parse(localStorage.getItem('fh_cache') || 'null');
      const merged = Object.assign({}, (prev && prev.data) || {}, db);
      localStorage.setItem('fh_cache', JSON.stringify({ ts: Date.now(), data: merged }));
      cacheTs = Date.now();
    } catch (eCache) {}
  }
  if (changed) {
    if (!setupOpen) render(false);
    pushNotifSched();
    




    try {
      if (typeof ADM !== 'undefined' && ADM && !ADM.dirty && !ADM.saving) {
        ADM.draft = null;
        const ab45 = byId('admBody');
        if (ab45 && !ab45.closest('.hidden') && typeof admRenderBody === 'function') admRenderBody();
      }
    } catch (eD45) {}
  }
  
  
  if (!fromCache && db && typeof db.update !== 'undefined') updFromDb(db.update);
  return changed;
}




























var FH_DB_API = (typeof BACKEND === 'string' && BACKEND) ? BACKEND : 'https://fluxhelper-backend.onrender.com';
let d1OkN = 0, d1FailN = 0, d1UpdLast = '', d1UpdT = 0;
let schedLast = '', subLast = '', tchLast = '';
let metaRev = { snap: 0, upd: 0 }, metaHave = false, metaHealed = false, chkLast = '';
let tickT = 0, tickBusy = false, tickN = 0;
function d1Healthy() { return d1OkN > 0 && d1FailN < 3; }
function d1NetUp() {
  d1FailN = 0; d1OkN++;
  try { hideNetErr(); } catch (eNU) {}
  try { fhNet.down = false; } catch (eNU2) {}
}
function d1NetDown() {
  d1FailN++;
  try { showNetErr(); } catch (eND) {}
  try { fhNet.down = true; } catch (eND2) {}
}

function d1Snap(cb) {
  if (window.FH_WEB) {
    



    const names = ['schedule', 'subjects', 'teachers', 'weeks'];
    let bad = false;
    Promise.all(names.map(function (p) {
      return fetch(DB_URL + '/' + p + '.json?cb=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : 'ERR'; })
        .catch(function () { return 'ERR'; });
    })).then(function (res) {
      for (let i = 0; i < res.length; i++) { if (res[i] === 'ERR') { bad = true; break; } }
      if (!bad) { cb(JSON.stringify({ schedule: res[0], subjects: res[1], teachers: res[2], weeks: res[3] })); return; }
      d1SnapLegacy(cb);
    });
    return;
  }
  
  function d1SnapLegacy(cb) {
    const ctrl = (typeof AbortController === 'function') ? new AbortController() : null;
    if (ctrl) setTimeout(function () { try { ctrl.abort(); } catch (eA) {} }, 9000);
    Promise.all(['schedule', 'subjects', 'teachers', 'weeks'].map(function (p) {
      return fetch(FH_DB_API + '/api/pub?path=' + p, { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    })).then(function (res) {
      for (let i = 0; i < res.length; i++) {
        if (!res[i] || !res[i].ok || !res[i].data) { cb(null); return; }
      }
      cb(JSON.stringify({ schedule: res[0].data, subjects: res[1].data, teachers: res[2].data, weeks: res[3].data }));
    });
  }
  if (cfOk()) {
    cfExec('SELECT json FROM v_snap_full', [], function (rows) {
      cb(rows && rows[0] && rows[0].json ? rows[0].json : null);
    });
  }
}


function d1FetchSnap() {
  d1Snap(function (j) {
    if (j) {
      d1NetUp();
      try { d1Apply(JSON.parse(j)); } catch (eP) {}
    } else d1NetDown();
  });
}


function d1Tick() {
  clearTimeout(tickT); tickT = 0;
  if (window.FH_WEB) {
    if (tickBusy) { d1TickSched(); return; }
    tickBusy = true;
    tickN++;
    if (ACC.user && tickN % 2 === 0) { try { syncStsCheck(userKey(ACC.user)); } catch (eSSW) {} }
    


    webRevTick(function (ch, ev, uev) {
      if (ev) evDispatch(ev.n, ev.t, ev.u);
      if (uev) evDispatch(uev.n, uev.t, '');
      if (ch === false) { tickBusy = false; d1NetUp(); d1TickSched(); return; }
      d1Snap(function (j) {
        tickBusy = false;
        if (j) { d1NetUp(); try { d1Apply(JSON.parse(j)); } catch (ePW) {} }
        else d1NetDown();
        d1TickSched();
      });
    });
    return;
  }
  if (tickBusy) { d1TickSched(); return; }
  tickN++;
  

  if (ACC.user && (window.FH_WEB ? (tickN % 2 === 0) : true)) { try { syncStsCheck(userKey(ACC.user)); } catch (eSS) {} }
  

  const doChk = (tickN % 120 === 4);   
  tickBusy = true;
  


  d1RevVia(function (snapRev, updRev, alive, evN, evT, evU) {
    tickBusy = false;
    if (!alive) { d1NetDown(); d1TickSched(); return; }
    d1NetUp();
    d1RevHandle(snapRev, updRev, doChk, evN, evT, evU);
    d1TickSched();
  });
}







function d1RevVia(cb) {
  


  cfExec("SELECT key, json_extract(val,'$.rev') AS rev, val FROM _meta WHERE key IN ('snap','upd','ev')", [], function (rows) {
    if (!rows) { cb(null, null, false, null, '', ''); return; }
    let sr = null, ur = null, evN = null, evT = '', evU = '';
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]; if (!r || !r.key) continue;
      const rv = parseInt(r.rev, 10) || 0;
      if (r.key === 'snap') sr = rv;
      if (r.key === 'upd') ur = rv;
      if (r.key === 'ev') {
        try {
          const ev = JSON.parse(r.val || 'null');
          if (ev && typeof ev === 'object') { evN = ev.n || 0; evT = String(ev.t || ''); evU = String(ev.u || ''); }
        } catch (eEV) {}
      }
    }
    cb(sr, ur, true, evN, evT, evU);
  });
}

let evSeen = false, evLastN = 0;
function evDispatch(n, t, u) {
  if (n === null || n === undefined) return;
  if (!evSeen) { evSeen = true; evLastN = n; return; }
  if (String(n) === String(evLastN)) return;
  evLastN = n;
  evHandle(t, u);
}
function d1RevHandle(snapRev, updRev, doChk, evN, evT, evU) {
  evDispatch(evN, evT, evU);
  if (snapRev === null && updRev === null) {
    if (!metaHealed) {
      metaHealed = true;
      cfExec("INSERT INTO _meta (key,val) VALUES ('snap','{\"rev\":1}') ON CONFLICT(key) DO NOTHING", [], null);
      cfExec("INSERT INTO _meta (key,val) VALUES ('upd','{\"rev\":1}') ON CONFLICT(key) DO NOTHING", [], null);
    }
  } else if (!metaHave) {
    metaRev.snap = (snapRev === null) ? 0 : snapRev;
    metaRev.upd = (updRev === null) ? 0 : updRev;
    metaHave = true;
  } else {
    if (snapRev !== null && snapRev !== metaRev.snap) { metaRev.snap = snapRev; d1FetchSnap(); }
    if (updRev !== null && updRev !== metaRev.upd) { metaRev.upd = updRev; clearTimeout(d1UpdT); d1UpdateCheck(); }
  }
  if (doChk) {
    cfExec("SELECT (SELECT COUNT(*) FROM schedule) || ':' || IFNULL((SELECT SUM(length(title)+length(t_start)+length(t_end)) FROM schedule),0) || ':' || (SELECT COUNT(*) FROM subject) || ':' || IFNULL((SELECT SUM(length(name)+length(COALESCE(teacher1,''))+length(COALESCE(teacher2,''))+length(COALESCE(zoom1,''))+length(COALESCE(zoom2,''))+length(COALESCE(icon,''))+length(COALESCE(group1,''))+length(COALESCE(group2,''))) FROM subject),0) || ':' || IFNULL((SELECT val FROM _meta WHERE key='weeks'),'') AS chk", [], function (rc) {
      const chk = (rc && rc[0] && rc[0].chk) ? String(rc[0].chk) : '';
      if (!chk) return;
      if (!chkLast) { chkLast = chk; return; }
      if (chk !== chkLast) d1FetchSnap();
    });
  }
}



let webRev = -1;
function webRevTick(cb) {
  if (typeof fetch !== 'function' || !DB_URL) { cb(true, null, null); return; }
  let done = false;
  const to = setTimeout(function () { if (!done) { done = true; cb(null, null, null); } }, 6000);
  const fg = function (p) {
    return fetch(DB_URL + '/' + p + '.json?cb=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  };
  const myK = (ACC.user && userKey(ACC.user)) ? 'update/userdev/' + adm46Uid(userKey(ACC.user)) : '';
  Promise.all([fg('update/webrev'), fg('update/webev'), myK ? fg(myK) : Promise.resolve(null)]).then(function (res) {
    if (done) return; done = true; clearTimeout(to);
    const v = res[0], evRaw = res[1], uevRaw = res[2];
    const ev = (evRaw && typeof evRaw === 'object' && evRaw.n) ? { n: evRaw.n, t: String(evRaw.t || ''), u: String(evRaw.u || '') } : null;
    const uev = (uevRaw && typeof uevRaw === 'object' && uevRaw.n) ? { n: uevRaw.n, t: String(uevRaw.t || ''), u: '' } : null;
    const n = parseInt(v, 10) || 0;
    let ch;
    if (n > 0) { ch = (webRev === -1) || (n !== webRev); webRev = n; }
    else if (webRev === -1) { webRev = 0; ch = true; } else ch = false;
    cb(ch, ev, uev);
  });
}

function d1TickSched() {
  clearTimeout(tickT);
  

  tickT = setTimeout(d1Tick, document.hidden ? 60000 : (window.FH_WEB ? 8000 : 5000));
}
function d1TickStart() { tickN = 0; d1TickSched(); }
function d1TickNow() { clearTimeout(tickT); tickT = setTimeout(d1Tick, 60); }


function d1BumpSnap() {
  if (window.FH_WEB || !cfOk()) return;
  try {
    cfExec("INSERT INTO _meta (key,val) VALUES ('snap','{\"rev\":1}') ON CONFLICT(key) DO UPDATE SET val = json_set(val,'$.rev',COALESCE(json_extract(val,'$.rev'),0)+1)", [], null);
  } catch (eB) {}
}


function d1UpsertSubject(name, fields, cb) {
  if (window.FH_WEB || !cfOk()) { if (cb) cb(false); return; }
  cfExec('INSERT INTO subject (name) VALUES (?) ON CONFLICT(name) DO NOTHING', [name], function (r0) {
    if (r0 === null) { if (cb) cb(false); return; }
    const sets = [], ps = [];
    for (let i = 0; i < fields.length; i++) {
      if (fields[i][1] !== undefined) { sets.push(fields[i][0] + '=?'); ps.push(fields[i][1]); }
    }
    if (!sets.length) { if (cb) cb(true); return; }
    ps.push(name);
    cfExec('UPDATE subject SET ' + sets.join(', ') + ' WHERE name=?', ps, function (r1) {
      if (cb) cb(!!r1);
    });
  });
}






















let _admSubjMap = null, _admSubjMapT = 0;
function admSubjMap(cb) {
  


  if (_admSubjMap && (Date.now() - _admSubjMapT) < 120000) { cb(_admSubjMap); return; }
  cfExec('SELECT id, name FROM subject', [], function (rows) {
    if (!rows) { cb(null); return; }
    const m = {};
    rows.forEach(function (r) { if (r && r.name) m[String(r.name).trim().toLowerCase()] = r.id; });
    _admSubjMap = m; _admSubjMapT = Date.now();
    cb(m);
  });
}
function admDaySame(server, arr) {
  if (!Array.isArray(server) || server.length !== arr.length) return false;
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i], b = server[i] || {};
    if (String(b.title || '') !== String(a.s) || String(b.t_start || '') !== String(a.t) || String(b.t_end || '') !== String(a.e)) return false;
  }
  return true;
}
function d1SaveDay(dk, arr, cb) {
  if (window.FH_WEB || !cfOk()) { if (cb) cb(false); return; }
  const finishErr = function (why) { try { console.warn('adm save failed:', why); } catch (eC) {} if (cb) cb(false); };
  const verify = function (attempt) {
    cfExec('SELECT pos, title, t_start, t_end FROM schedule WHERE day=? ORDER BY pos LIMIT 12', [dk], function (rows) {
      if (rows === null) { if (attempt < 1) { setTimeout(function () { verify(attempt + 1); }, 1200); return; } finishErr('verify-read'); return; }
      if (admDaySame(rows, arr)) {
        d1BumpSnap();   
        if (cb) cb(true);
        return;
      }
      if (attempt < 1) { saveOnce(attempt + 1); return; }   
      finishErr('verify-mismatch');
    }, 15000);
  };
  const saveOnce = function (attempt) {
    admSubjMap(function (map) {
      if (!map) { finishErr('subjects-unread'); return; }
      const missing = [];
      arr.forEach(function (it) { if (!map[String(it.s).trim().toLowerCase()]) missing.push(it.s); });
      const afterSubjects = function () {
        admSubjMap(function (map2) {
          if (!map2) { finishErr('subjects-unread-2'); return; }
          let left = 1 + (arr.length ? 1 : 0), bad = 0;
          const step = function () { if (--left <= 0) { if (bad) finishErr('write-fail'); else verify(attempt); } };
          cfExec('DELETE FROM schedule WHERE day=? AND pos>=?', [dk, arr.length], function (r0) {
            if (!r0) bad++; step();
          }, 15000);
          if (arr.length) {
            const vals = [], ps = [];
            arr.forEach(function (it, i) {
              const sid = map2[String(it.s).trim().toLowerCase()];
              if (!sid) { bad++; return; }   
              vals.push('(?,?,?,?,?,?)');
              ps.push(dk, i, sid, it.s, it.t, it.e);
            });
            if (!vals.length) { if (!bad) verify(attempt); return; }
            cfExec('INSERT INTO schedule (day, pos, subject_id, title, t_start, t_end) VALUES ' + vals.join(',') +
                   ' ON CONFLICT(day,pos) DO UPDATE SET subject_id=excluded.subject_id, title=excluded.title, t_start=excluded.t_start, t_end=excluded.t_end',
                   ps, function (r1) { if (!r1) bad++; step(); }, 15000);
          }
        });
      };
      if (!missing.length) { afterSubjects(); return; }
      
      let leftM = 1, badM = 0;
      const valsM = missing.map(function () { return '(?)'; });
      cfExec('INSERT INTO subject (name) VALUES ' + valsM.join(',') + ' ON CONFLICT(name) DO NOTHING',
             missing.map(function (s) { return String(s).toLowerCase(); }), function (rM) {
        if (!rM) badM++;
        if (--leftM <= 0) { if (badM) finishErr('subject-create'); else afterSubjects(); }
      }, 15000);
    });
  };
  saveOnce(0);
}
function d1SaveWeeks(inverted, cb) {
  if (window.FH_WEB || !cfOk()) { if (cb) cb(false); return; }
  cfExec("UPDATE _meta SET val=? WHERE key='weeks'", [JSON.stringify({ inverted: inverted ? 1 : 0, flips: inverted ? [WK_ANCHOR] : 0 })], function (r) {
    if (r) d1BumpSnap();
    if (cb) cb(!!r);
  });
}






function d1UpdateCheck() {
  const use = function (u) {
    if (!u || u.latest === undefined || u.latest === null) return;
    if (String(u.latest) === d1UpdLast) return;   
    d1UpdLast = String(u.latest);
    let notes = u.notes;
    try { notes = (typeof notes === 'string') ? JSON.parse(notes) : notes; } catch (eN) { notes = []; }
    



    updFromDb({ latest: u.latest, notes: Array.isArray(notes) ? notes : [],
                apk_md5: u.apk_md5, exe_md5: u.exe_md5,
                _pref: (u.channel === 'beta' || u.id === 2) ? 'versions/beta/' : 'versions/release/' });
  };
  if (window.FH_WEB) {
    const pick = function (j, pref) {
      if (j && j.latest) { j._pref = pref; updFromDb({ latest: String(j.latest), notes: Array.isArray(j.notes) ? j.notes : [], _pref: pref }); }
    };
    const done = function () {
      fetch('https://fluxhelper.pages.dev/versions/release/latest.json?cb=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
        .then(function (j) { pick(j, 'versions/release/'); });
    };
    if (typeof betaAllowed === 'function' && betaAllowed()) {
      fetch('https://fluxhelper.pages.dev/versions/beta/latest.json?cb=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
        .then(function (j) { if (j && j.latest) pick(j, 'versions/beta/'); else done(); });
    } else done();
  } else if (cfOk()) {
    

    cfExec('SELECT id, channel, latest, apk_md5, exe_md5, notes FROM app_update ORDER BY id', [], function (rows) {
      if (!rows || !rows.length) return;
      let rel = null, bet = null;
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        if (!r || !r.latest) continue;
        if (r.channel === 'beta' || r.id === 2) { if (!bet) bet = r; }
        else if (!rel) rel = r;
      }
      let pick = rel;
      if (bet && betaAllowed()) {
        pick = (!rel || verCmp(normVer(bet.latest), normVer(rel.latest)) > 0) ? bet : rel;
      }
      if (pick) use(pick);
    });
  }
  clearTimeout(d1UpdT);
  d1UpdT = setTimeout(d1UpdateCheck, 900000);
}


function pubEarly() {
  try {
    if (window.FH_WEB) return;   
    d1Snap(function (j) {
      if (!j) return;
      try {
        const doc = JSON.parse(j);
        if (doc && (doc.schedule || doc.subjects)) { d1OkN = Math.max(d1OkN, 1); d1Apply(doc); }
      } catch (e5) {}
    });
  } catch (e6) {}
}

function d1Apply(doc) {
  let ch = false;
  if (doc.schedule !== undefined && doc.schedule !== null) {
    const s = JSON.stringify(doc.schedule);
    if (s !== schedLast) { schedLast = s; applyDb({ schedule: doc.schedule }); dbOnline = true; ch = true; }
  }
  if (doc.subjects !== undefined && doc.subjects !== null) {
    const s = JSON.stringify(doc.subjects);
    if (s !== subLast) { subLast = s; applyDb({ subjects: doc.subjects }); ch = true; }
  }
  if (doc.teachers !== undefined && doc.teachers !== null) {
    const s = JSON.stringify(doc.teachers);
    if (s !== tchLast) { tchLast = s; applyDb({ teachers: doc.teachers }); ch = true; }
  }
  if (doc.weeks !== undefined && doc.weeks !== null) {
    const s = JSON.stringify(doc.weeks);
    if (!DBD.weeks || JSON.stringify(DBD.weeks) !== s) { applyDb({ weeks: doc.weeks }); ch = true; }
  }
  return ch;
}








let netWatchT = 0, netWatchBusy = false, netWatchFails = 0, netWatchGraceT = 0;
function netWatchPing() {
  

  return Promise.resolve(navigator.onLine !== false);
}
function netWatchShow() {
  if (typeof dataVerified === 'undefined' || !dataVerified) return;
  const neW = byId('neterr');
  if (neW && !neW.classList.contains('hidden')) return;
  if (typeof updOpen === 'function' && updOpen()) return;
  const msg = (navigator.onLine === false)
    ? 'Немає доступу до інтернету — увімкни мережу (Wi-Fi або кабель).'
    : 'Немає зв\u2019язку з базою розкладу — перевір інтернет.';
  showNetErr(msg);
}
function netWatchHide() {
  const neH = byId('neterr');
  if (neH && !neH.classList.contains('hidden')) {
    hideNetErr();
    try { d1TickNow(); } catch (eDF) {}   
  }
  netWatchFails = 0;
}
function netWatchTick() {
  if (netWatchBusy) return;
  netWatchBusy = true;
  const hardOff = (navigator.onLine === false);   
  netWatchPing().then(function (okW) {
    netWatchBusy = false;
    if (okW) { netWatchHide(); return; }
    if (hardOff) { netWatchShow(); return; }   
    netWatchFails += 1;
    if (netWatchFails === 1) {
      clearTimeout(netWatchGraceT);
      netWatchGraceT = setTimeout(function () {
        netWatchPing().then(function (okG) { if (!okG) netWatchShow(); });
      }, 2000);
    }
  });
}
function netWatchStart() {
  if (netWatchT) return;
  netWatchT = setInterval(function () {
    if (document.hidden) return;
    netWatchTick();
  }, 4000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) setTimeout(netWatchTick, 400);
  });
}






const DEFAULT_REPO = 'matviikobrys2707/FluxHelper';
let UPDATE_REPO = DEFAULT_REPO;
try { const _r = localStorage.getItem('fh_repo'); if (_r) UPDATE_REPO = _r; } catch (e) {}
let UPD = { avail: false, ver: '', busy: false, pending: '', watch: 0, dbNotes: null, dbVer: '', test: false, pref: 'versions/release/', exeMd5: '' };
function verCmp(a, b) {
  const p = String(a).split('.'), q = String(b).split('.');
  for (let i = 0; i < 3; i++) {
    const x = parseInt(p[i], 10) || 0, y = parseInt(q[i], 10) || 0;
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}
function updOpen() { return UPD.avail; }









const WHATS_NEW = {
  '3.5.47': [
    ['\u2726', '\u0412\u0425\u0406\u0414 \u0412 \u041e\u0421\u0422\u0410\u041d\u041d\u042c\u0418\u0419 \u0410\u041a\u0410\u0423\u041d\u0422 \u0411\u0415\u0417 \u041f\u0406\u041a\u0415\u0420\u0410 \u0456 \u0411\u0415\u0417 \u0421\u0410\u0419\u0422\u0423: \u0434\u0430\u043d\u0456 \u0430\u043a\u0430\u0443\u043d\u0442\u0430 \u043f\u0440\u0438\u0445\u043e\u0434\u044f\u0442\u044c \u043e\u0434\u0440\u0430\u0437\u0443 \u0432 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u0443 \u2014 \u044f\u043a \u0443 \u0456\u043d\u0448\u0438\u0445 \u0434\u043e\u0434\u0430\u0442\u043a\u0430\u0445', 'android'],
    ['\u2726', '\u0410\u0412\u0422\u041e\u0412\u0418\u0411\u0406\u0420: \u043e\u0434\u0438\u043d Google-\u0430\u043a\u0430\u0443\u043d\u0442 \u043d\u0430 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0456 = \u0432\u0456\u043a\u043d\u043e \u0432\u0438\u0431\u043e\u0440\u0443 \u043d\u0435 \u043f\u043e\u043a\u0430\u0437\u0443\u0454\u0442\u044c\u0441\u044f; \u0432\u0445\u0456\u0434 \u0447\u0435\u0440\u0435\u0437 \u0441\u0430\u0439\u0442 \u043d\u0430 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0456 \u0437\u043d\u0435\u0441\u0435\u043d\u043e', 'android'],
    ['\u2726', '\u0421\u041f\u041e\u0412\u0406\u0429\u0415\u041d\u041d\u042f \u041f\u0415\u0420\u0415\u0420\u041e\u0411\u041b\u0415\u041d\u041e: \u0442\u043e\u0447\u043d\u0438\u0439 \u043c\u043e\u043c\u0435\u043d\u0442 (\u0440\u0456\u0432\u043d\u043e \u0437\u0430 60 \u0441), \u0434\u043e\u0433\u0430\u043d\u044f\u043d\u043d\u044f \u043f\u0440\u043e\u043f\u0443\u0449\u0435\u043d\u0438\u0445, \u0431\u0435\u0437 \u043f\u043e\u0432\u0442\u043e\u0440\u0456\u0432 \u0456 \u0437\u0430\u0432\u0438\u0441\u0430\u043d\u044c', '/'],
    ['\u2726', '\u0420\u041e\u0417\u0423\u041c\u041d\u0418\u0419 \u0421\u0415\u0420\u0412\u0415\u0420: \u0437\u043c\u0456\u043d\u0438 \u0440\u043e\u0437\u043a\u043b\u0430\u0434\u0443, \u0431\u0430\u043d \u0442\u0430 \u0432\u0438\u0434\u0430\u043b\u0435\u043d\u043d\u044f \u0430\u043a\u0430\u0443\u043d\u0442\u0456\u0432 \u0434\u043e\u0441\u0456\u043b\u044f\u044e\u0442\u044c \u0432\u0441\u0456 \u043f\u0440\u0438\u0441\u0442\u0440\u043e\u0457 \u0437\u0430 5\u20138 \u0441\u0435\u043a\u0443\u043d\u0434 \u2014 \u0431\u0435\u0437 \u0447\u0435\u043a\u0430\u043d\u043d\u044f \u043f\u0435\u0440\u0435\u0437\u0430\u043f\u0443\u0441\u043a\u0443', '/'],
  ],
  '3.5.46': [
    ['✦', 'ШВИДКІСТЬ: сайт відкривається швидко ЗАВЖДИ — дзеркало і сервер тепер у гонці (хто перший відповів), у кожного стартового запита таймаут 3.5-4 с, страховка інтерфейсу 4 с замість 8', '/'],
    ['✦', 'АДМІНКА: нова вкладка «Користувачі» — список акаунтів (пошта, ім\u2019я, іконка), блокування назавжди/на час (10 хв… 7 днів або свій час) і повне видалення акаунта з бази', '/'],
    ['✦', 'БАН: у заблокованого користувача при вході з\u2019являється вікно «Ваш акаунт заблоковано» — причина, час розблокування і кнопка «Вийти з акаунту»', '/'],
    ['✦', 'ВИДАЛЕННЯ: акаунт зникає з бази ПОВНІСТЮ; пристрій користувача перевіряє двічі і викидає з акаунта лише за реального видалення — без хибних спрацювань', '/'],
    ['✦', 'НАЛАШТУВАННЯ ПК (сайт): «Копіювання посилання на урок» тепер РІВНО ОДНА колонка — така ж ширина, як «Запуск Zoom»', '/'],
    ['✦', 'EXE для Windows ПЕРЕЗІБРАНО зі свіжим інтерфейсом 3.5.46 (3.5.45 не відкривався — беріть новий файл)', '/'],
  ],

  '3.5.45': [
    ['✦', 'ШВИДКІСТЬ: сайт більше не висить на 85% після довгої паузи — відкривається одразу з кешу будь-якого віку, свіжі дані тихо доїжджають у фоні', '/'],
    ['✦', 'АДМІНКА: збереження розкладу ПЕРЕРОБЛЕНО — один атомарний запис + перевірка на сервері; «не вдалося зберегти» більше НЕ означає «тихо видалило день» (четвер відновлено)', '/'],
    ['✦', 'СПОВІЩЕННЯ ПК: «Нагадати за 1 хв» тепер запам‘ятовується — тост зникає і приходить РІВНО за 60 секунд до уроку, без повторів', '/'],
    ['✦', 'СПОВІЩЕННЯ ПК: зміна «повідомити за N хв» перепланувала сьогоднішні уроки — сповіщення приходить за новим часом, навіть якщо стара вже стрільнула', '/'],
    ['✦', 'НАЛАШТУВАННЯ ПК (сайт): повернуто дві колонки 3.5.44; рамка «Копіювання посилання» — такої ж ширини, як «Запуск Zoom»', '/'],
  ],

  '3.5.44': [
    ['✦', 'ПК-ВЕРСІЯ ОНОВЛЮЄТЬСЯ РАЗОМ З ТЕЛЕФОНОМ: налаштування тепер у ДВОХ КОЛОНКАХ — ліворуч «Сповіщення», праворуч «Запуск Zoom», «Захід на урок» і «Копіювання посилання»', '/'],
    ['✦', 'Налаштування ПК: СУЧАСНИЙ дизайн карток із кольоровими іконками — точь-в-точь як на телефоні; стара рамка «Сповіщень» пішла', '/'],
    ['✦', 'Дві колонки тримаються навіть у вузькому вікні й при масштабі Windows 125% — більше ніякого «по очереди»', '/'],
    ['−', 'Знизу налаштувань прибрано плашку «FluxHelper · розклад 8-го Б класу»', '/'],
  ],

  '3.5.42': [
    ['✦', 'СПОВІЩЕННЯ ПК: ЗВУК ТЕПЕР ЗАВЖДИ — власний дзвіночок грає з самої програми, навіть якщо Windows безшумить тости', '/'],
    ['✦', 'СПОВІЩЕННЯ ПК: точний хвилинний текст («через 2 хв» = чесно), нагадування «за 1 хв» приходить рівно в свою хвилину, без «через секунду»', '/'],
    ['✦', 'СПОВІЩЕННЯ ПК: якщо ПК прокинувся із сну — сповіщення наздоганяє одразу, а не після кліку', '/'],
  ],
  '3.5.41': [
    ['✦', 'ВХІД ЧЕРЕЗ GOOGLE — виправлено «заходить через раз»: програма більше не засинає під час входу, підтвердження підхоплюється миттєво щойно ви повернулись', '/'],
    ['✦', 'РОЗКЛАД: бейдж «ДАЛІ» і «ЗАРАЗ» — тепер красиві закруглені рамочки з відступом від назви (на ПК були квадратами)', '/'],
    ['✦', 'РОЗКЛАД: перед номером кабінету — знак №, одразу видно, що це номер', '/'],
    ['✦', 'НИЖНЯ ПАНЕЛЬ ТЕЛЕФОНА: трохи темніша (і в темній, і в світлій темі)', '/'],
    ['✦', 'СВІТЛА ТЕМА: «Мої групи» та «Акаунт» — точь-в-точь як у темній: одна рівна рамка, пункти всередині розділені лініями, без «розкиданих» плашок', '/'],
    ['✦', 'НАЛАШТУВАННЯ ПК: рамка «Сповіщення» тепер тієї ж висоти, що й сусідні картки', '/'],
  ],
  '3.5.40': [
    ['✦', 'ТРАФІК СЕРВЕРА: передачу між користувачами через сервер ЗНЯТО — дані тепер ідуть напряму в базу (Render більше не з\'їдає ліміт 5 ГБ)', '/'],
    ['✦', 'ПЛИТКУ «LIQUID GLASS» у вікні тем ЗНЕСЕНО і зі старої збірки — лишено Стандартну і Світлу', 'pc'],
    ['✦', 'НАЛАШТУВАННЯ ПК — 2 КОЛОНКИ: «Сповіщення» зліва (не розтягнуте), а справа стовпчик: Запуск Zoom, Захід на урок, Посилання на урок', 'pc'],
    ['✦', 'СВІТЛА ТЕМА: слайдер «повідомити за» — точь-в-точь як у темній: видима рамочка, контрастна доріжка, світна ручка', '/'],
  ],
  '3.5.39': [
    ['✦', 'ТІЛЬКИ ДВІ ТЕМИ: стандартна темна фірмова і світла — Аврору та інші знесено повністю', '/'],
    ['✦', 'ФІКС КРИТИЧНОЇ ПОМИЛКИ «NFIRED is not defined» на телефоні й у мобільній версії сайту — програма знову працює', '/'],
    ['✦', 'СВІТЛА ТЕМА: перемикачі знову фіолетові (видно ввімк/вимк), рамки «Оновлення», бейдж версії й тости — усе красиво', '/'],
    ['✦', 'НАЛАШТУВАННЯ ПК — РІВНЕНЬКО: «Копіювання», «Запуск Zoom» і «Захід на урок» — три акуратні картки, «Сповіщення» на всю ширину; виправлено «капець» із розтягнутими рамками', '/'],
  ],
  '3.5.38': [
    ['✦', 'НОВА ТЕМА «АВРОРА» замість Liquid Glass — глибока бірюзова ніч, суцільні панелі, жодного скла; усе працює як у темній', '/'],
    ['✦', 'СВІТЛА ТЕМА: видно вимкнені перемикачі, контури груп і рамки — усе як у темній, тільки світле', '/'],
    ['✦', 'РОЗКЛАД: у онлайн-уроків (після 12:35) більше немає номера кабінету; кабінет ближче до назви уроку', '/'],
    ['✦', 'КНОПКУ «Вийти з акаунта» повернено на телефон', '/'],
    ['✦', 'ЗБЕРЕЖЕННЯ АКАУНТА: після видалення й встановлення програми акаунт відновлюється; після явного виходу — потрібне підтвердження входу', '/'],
    ['✦', 'ВЕРСІЇ ПРИСТРОЇВ у профілі: телефон і комп\u2019ютер пишуть останню версію застосунку', '/'],
    ['✦', 'Сповіщення: точний момент «за N хвилин» у розкладі; попап дозволу оновлення переписано просто і зрозуміло', '/'],
  ],
  '3.5.37': [
    ['✦', 'LIQUID GLASS — ДОВЕДЕНА: скло тепер темне (як нижня панель) і ОДНАКОВЕ везде — картки, профіль, верхня панель, модалки', '/'],
    ['✦', 'ВКЛАДКИ ДНІВ Пн–Пт — окремі скляні плашки з відступами (як у стандартній темі), не злиті', '/'],
    ['✦', 'ФІКС «залипаючої» вкладки: при швидкому перемиканні підсвічення більше не залишається на старій вкладці', '/'],
    ['✦', 'ФІКС двійного сповіщення на ПК: нагадування приходить РІВ ОДИН раз + емодзі у тексті', '/'],
    ['✦', 'НАЛАШТУВАННЯ ПК — РІВНІ: однакові висоти карток, Сповіщення компактні (усе в 2 колонки)', '/'],
    ['✦', 'СВІТЛА ТЕМА ДОВЕДЕНА: товстина шрифтів 1-в-1 як у стандарті, кнопки вікна без рамок, красиві випадаючі вікна, без «біле на білому»', '/'],
  ],
  '3.5.35': [
    ['✦', 'АНІМАЦІЯ ПЕРЕМИКАЧІВ «МОЇ ГРУПИ»: рамка-пілюля тепер ПЛАВНО ПЕРЕЛІТАє між «1-ша група» і «2-га група» прямо в налаштуваннях — так само, як у перемикача «Додаток/Браузер»', '/'],
    ['✦', 'ЗМІНА ТЕМИ — ПЛАВНЕ ПЕРЕТЕКАННЯ: кольори, рамки й тіні переливаються одну мить замість різкого стрибка', '/'],
    ['✦', 'КНОПКА АКАУНТА (вгорі) ПІДСВІЧУЄТЬСЯ з анімацією, коли ти в неї заходиш — видно, де ти зараз', '/'],
    ['✦', 'LIQUID GLASS ПЕРЕРОБЛЕНА: темні стримані тости (без фіолетових), вкладки днів Пн–Пт — єдине скло з пілюлею, що плавно їздить (без «злеплених» рамочок), нижня панель телефону — ОДНА суцільна скляна пілюля', '/'],
    ['✦', 'НАЛАШТУВАННЯ НА ПК — КОМПАКТНІ: «Копіювання посилання», «Запуск Zoom» і «Захід на урок» більше не розтягуються через велику рамку «Сповіщень» — кожна картка своєї висоти, все рівненько', '/'],
    ['/', 'ЩЕ РОЗУМНІША СИНХРОНІЗАЦІЯ: клієнти перевіряють тільки ревізію (~50 байт), а базу тепер опитує СЕРВЕР — максимум раз на 4 с на всіх одразу (ліміти Cloudflare більше нічого не загрожують), знімок качаься лише коли дані змінилися', '/'],
    ['/', 'Вхід на телефоні стабільний: спершу мить-вхід без вікон, потім надійний вхід через браузер; кнопку «Вийти з акаунта» на телефоні прибрано', '/'],
  ],
  '3.5.34': [
    ['✦', 'ВИПРАВЛЕНО ВХІД: програма більше не вимагає авторизуватися і вибирати групи після кожного перезапуску — сесія зберігається і відновлюється сама (дефект зборки 3.5.33)', '/'],
    ['✦', 'ВИПРАВЛЕНО ОНОВЛЕННЯ НА ТЕЛЕФОНІ: «версія оновлення 30501 нижча за поточну» — бета-версії тепер завантажуються з правильного каналу versions/beta, а не зі стабільного файлу сайту', '/'],
    ['✦', 'LIQUID GLASS ВЕЗДЕ ОДНАКОВА: телефон/сайт/ПК — ті самі кольори, обідок, блик і скло (як у сніпеті-референсі); слабкі пристрої — полегшений режим автоматично', '/'],
    ['✦', 'ФІКС «все поїхало» на ПК: верхні вкладки (Розклад/Налаштування/Адмін) знову по центру, тости внизу на місці, скло не ламає розкладку', '/'],
    ['/', 'Анімації на ВСІХ версіях: пілюля-рамка плавно перелітає між групами, вкладками Розклад/Налаштування, перемикачами Додаток/Браузер — на ПК так само, як на телефоні; повторний клік по активній вкладці — без спалаху', '/'],
    ['/', 'СИНХРОНІЗАЦІЯ В РЕАЛЬНОМУ ЧАСІ: зміни (розклад, тема, групи) долітають на інші пристрої за ~5 секунд — лічильник ревізій на сервері, повне завантаження тільки коли дані справді змінилися', '/'],
    ['/', 'Програма після оновлення лишається на тому ж місці — ярлик і папка не зсуваються', '/'],
  ],
  '3.5.33': [
    ['✦', 'РОЗУМНА СИНХРОНІЗАЦІЯ: програма більше не опитує базу «про запас» — один мікрозапит (~30 байт) раз на хвилину, а повний запит тільки коли розклад чи дані РЕАЛЬНО змінилися на сервері. Трафіку — у сотні разів менше', '/'],
    ['/', 'Розклад тепер приходить ЛИШЕ з Cloudflare (D1): звернень до Firebase за даними — нуль (ні розклад, ні предмети, ні вчителі, ні оновлення)', '/'],
    ['/', 'Дані кешуються: старт — миттєво з кеша, іконки — вбудовані (мережу не чіпають), повторних завантажень немає', '/'],
    ['/', 'Зміна адміном розкладу/предметів/тижнів долітає на всі пристрої автоматично (ревізія в базі) — без перезапуску програми', '/'],
    ['/', 'Тема Liquid Glass перероблена ТОЧНО за референсом: обідок conic-gradient із mask-composite, що крутиться при наведенні, спекулярний блик (mix-blend-mode: screen), hover — scale(0.975), натискання — rotate3d(25°), blur через clamp', '/'],
    ['/', 'Фікс «пакет недействителен»: APK качається з сервера Cloudflare з перевіркою цілісності; якщо інсталятор усе одно свариться — один раз видали стару версію і постав нову (дані підхопляться з акаунта)', '/'],
  ],
  '3.5.32': [
    ['✦', 'ТЕМА LIQUID GLASS — тепер РІДКЕ СКЛО ВЕЗДЕ: картки уроків, вкладки днів, перемикачі, рамки налаштувань, модалки і панелі — скляне тіло, конічний обідок, що крутиться, спекулярні відблиски і справжнє заломлення країв', 'pc'],
    ['/', 'Карточки уроків стали компактнішими: менші рамки, стрункіші рядки — назва зверху, час і вчитель знизу', 'pc'],
    ['/', 'КАБІНЕТ уроку — акуратна плашка з нормальним відступом від назви; ЗАРАЗ (зелена рамочка) і ДАЛІ (жовта рамочка) тепер красиві бейджі, ДАЛІ стоїть ПІСЛЯ номера кабінету', 'pc'],
    ['/', 'Фікс: повторний тап по ВІДКРИТІЙ вкладці або перемикачі більше НЕ запускає анімацію — переліт лише на справжнє переключення', 'pc'],
    ['/', 'Оновлення ставиться на ТЕ САМЕ місце: програма і її ярлик лишаються там, де ти їх поставив', 'pc'],
  ],
  '3.5.31': [
    ['/', 'Виправлено стилі, які ламалися у 3.5.30: налаштування, вікно «Що нового» й перемикачі знову з цілим оформленням', 'pc'],
    ['/', 'Стандартну, світлу й акцентні теми НЕ ЗМІНЕНО — повний редизайн має ЛИШЕ тема Liquid Glass', 'pc'],
    ['/', 'Анімація перемикачів («Додаток ↔ Браузер», групи, дні) працює в усіх темах — вигляд кнопок як і раніше', 'pc'],
  ],
  '3.5.30': [
    ['/', 'КАБІНЕТИ уроків на картках: у тиждень офлайн видно номер класу (для предметів із групами — кабінет ТВОЄЇ групи)', 'pc'],
    ['/', 'Перемикачі з анімацією: «Додаток ↔ Браузер», групи, таби адмінки і дні тижня — підсвітка плавно ЇЗДИТЬ між опціями', 'pc'],
    ['/', 'Кнопки в стилі Liquid Glass: скляне тіло, обідок, що крутиться при наведенні, «фізичне» натискання', 'pc'],
    ['/', 'ЗАРАЗ/ДАЛІ переїхали в рядок назви уроку — час і вчитель більше ніколи не обрізаються', 'pc']
  ],
  '3.5.29': [
    ['/', 'Тему Liquid Glass повністю перероблено за зразком iOS 26: живе прозоре скло, спекулярні відблиски на гранях, світні капсульні кнопки — усі кнопки, картки й модалки тепер справжнє «рідке скло»', 'pc'],
    ['✦', 'Функцію «Автоматичний вхід у Zoom» видалено з програми ПОВНІСТЮ — ні картки в налаштуваннях, ні фонового таймера; більше нічого не відкривається саме', 'pc'],
    ['/', 'Нижня частина вікна і підписи стали акуратнішими; виправлено версію файлу у властивостях Windows — тепер завжди показує справжню', 'pc']
  ],
  '3.5.28': [
    ['✦', 'Базу даних у хмарі приведено до ладу: у предметів із поділом — Teacher 1 і Teacher 2 та Zoom 1 і Zoom 2 (у технологій «Дівчата/Хлопці»), у предметів без поділу — один учитель і одне посилання; розклад у базі йде строго Пн → Пт'],
    ['✦', 'Вхід через Google став незламним: сторінка входу в браузері тепер показує КОД — якщо програма не підтягнула профіль сама, натисни «є код зі сайту?» і введи його; вхід завершиться за секунду'],
    ['/', 'Якщо браузер заблокував вікно Google на сторінці входу — тепер з’явиться підказка замість мовчазної нульової реакції'],
    ['/', 'Про підпис: збірки 3.5.25–3.5.28 підписані офіційним ключем; якщо телефон пише «не встановлюється» після старої 3.5.24 — видали застосунок ОДИН раз і постав наново']
  ],
  '3.5.27': [
    ['✦', 'База даних переїхала на Cloudflare D1: розклад, предмети, вчителі й тижні тепер читаються з хмари Cloudflare — швидше і стабільніше'],
    ['/', 'Firebase лишено лише як резервний канал: старі версії отримують оновлення як і раніше'],
    ['/', 'Живе оновлення розкладу йде через D1 з автоматичним фолбеком на Firebase — дані не губляться при збоях']
  ],
  '3.5.26': [
    ['/', 'Нижня панель на телефоні стала РОЗУМНОЮ: з кнопковою навігацією (квадрат-кружок-трикутник) сама піднімається над системними кнопками, з жестами — опускається до краю; ніколи не заїде на системну панель', 'phone'],
    ['/', 'Фікс: відступ від останнього уроку/рядка до панелі більше не буває «капець великим» — скрізь рівний, невеликий і однаковий у всіх вкладках', 'phone'],
    ['/', 'Фікс: перезавантаження сторінки більше НІКОЛИ не скидає на Розклад — «Налаштування»/«Профіль»/«Адмін» відновлюються точно'],
    ['/', 'Сайт більше не перезавантажується сам по собі через ~12 с після відкриття (знайдено і знесено схований сторожовий таймер)'],
    ['/', 'Швидке завантаження: перезавантаження сайту показує дані ОДРАЗУ з кешу, свіжі — тихо підтягуються у фоні; нічого не губиться'],
    ['/', 'Картки уроків: назва і вчитель — одним рядком, нічого не налазить; однакова висота карток (108px) в усіх версіях'],
    ['/', 'Налаштування ПК: «Копіювання посилання» і «Захід на урок» тепер в ОДНОМУ рядку — компактно, без порожнього місця', 'pc'],
    ['/', 'З налаштувань САЙТУ знесено рамку «Оновлення» (потрібна лише в застосунках)'],
    ['✦', 'Windows: функцію «Автоматичний вхід у Zoom» прибрано з програми ПОВНІСТЮ — картки більше нема, функція ніколи не запускається', 'windows'],
    ['/', 'Лендінг: з кнопки «Відкрити FluxHelper» прибрано зайвий текст «· main»']
  ],
  '3.5.25': [
    ['✦', 'ВИПРАВЛЕНО ВСТАНОВЛЕННЯ: «пакет недійсний / ключ не збігається» — збірку знову підписано ОФІЦІЙНИМ ключем, оновлення ставиться поверх старої версії, видаляти нічого не треба'],
    ['/', 'Плашка оновлення знову з’являється САМА: систему оновлень увімкнено для всіх каналів одразу — вручну завантажувати файл більше не потрібно'],
    ['/', 'Нижня панель на телефоні піднята ще вище: відступ від краю збільшено в півтора раза (17px -> 26px ≈ 0.7 см)', 'phone'],
    ['/', 'Фікс «поганих іконок»: свіжі предмети та іконки малюються ОДРАЗУ з першого запиту — старі EN/UA/DE більше не живуть тижнями'],
    ['/', 'Телефон: прибрано «скло» (блюр) і фіксований фон — сайт працює плавно, без лагів скролу'],
    ['+', 'Android: запасний вхід Google відкриває надійну сторінку входу — «Доступ заблоковано / помилка авторизації» більше не з’являється навіть на старих Android', 'android'],
    ['+', 'Windows: авто-вхід у Zoom пише лог з перших мілісекунд і сам виправляє кодування скрипта', 'windows']
  ],
  '3.5.24': [
    ['/', 'Фікс «поганих іконок» на сайті: свіжі предмети (і іконки) тепер малюються ОДРАЗУ з першого запиту — більше не живуть тижнями старі EN/UA/DE та інші'],
    ['/', 'Іконки мов у вбудованому розкладі тепер як в адмінці: англійська — бульбашка, українська — книжка, німецька — глобус; на ПК — ті самі тонкі лінійні, без «жирних»'],
    ['/', 'Телефон: плавність — «скло» (блюр) вимкнено на телефонах повністю, фіксований фон більше не гальмує скрол; вигляд тем не змінився'],
    ['+', 'Android: вхід через Google тепер відкриває надійну сторінку входу в браузері, якщо рідний вибір акаунта не спрацював — «Доступ заблоковано» більше не з’явиться', 'android'],
    ['+', 'Windows: авто-вхід у Zoom пише лог з перших мілісекунд і сам виправляє кодування скрипта (більше не буває «мовчить»)', 'windows']
  ],
  '3.5.23': [
    ['/', 'Кнопка «Приєднатися» повернена на сайт — мала бути завжди, прибрали помилково'],
    ['/', 'Віконце «Немає підключення до інтернету» знесено ПОВНІСТЮ з усіх версій — більше ніде не з’являється'],
    ['/', 'Фікс: перезавантаження сторінки більше не перекидає з «Профілю»/«Налаштувань» на Розклад — відкрита вкладка зберігається в адресі'],
    ['/', 'Фікс: іконки уроків малюються одразу правильні — ніяких «потворних» іконок після оновлення сторінки'],
    ['/', 'Картки уроків: однакова висота та однакова, трохи темніша рамка в усіх; анімацію появи знято — «світліші/темніші» картки неможливі'],
    ['/', 'Сайт більше не перезавантажується сам по собі (прибрано причини циклічного оновлення сторінки)'],
    ['+', 'Windows: авто-вхід у Zoom доопрацьовано — вікно підключення шукається за КНОПКАМИ (Звук/Видео/Подключиться), а не за назвою вікна; звук/камера вимикаються за станом', 'windows']
  ],
  '3.5.22': [
    ['✦', 'ОДИН URL для всього сайту: fluxhelper.pages.dev/main — старі адреси /iphone/ і /mac/ більше не існують; сайт сам визначає телефон чи комп\u2019ютер/планшет і відкриває потрібну версію, адреса не змінюється'],
    ['/', 'Фікс: при перезавантаженні більше не блимають старі іконки уроків — актуальні підвантажуються одразу'],
    ['+', 'Налаштування: «Запуск Zoom» (Додаток/Браузер) тепер на сайті для будь-якої версії — вибраний режим відкриття уроків працює і в браузері'],
    ['/', 'Кнопка «Приєднатися» на картці уроку — тепер лише в застосунках Android/Windows; на сайті урок відкривається тапом по картці'],
    ['/', 'Фікс: на телефоні більше не трапляється «прозорі» картки уроків з різною рамкою (зависла анімація появи)'],
    ['+', 'Windows (тест): «Автоматичний вхід у Zoom» тепер справді відкриває КОНФЕРЕНЦІЮ за посиланням — прев\u2019ю-вікно, вимкнення звуку/камери і «Подключиться» натискаються автоматично', 'windows']
  ],
  '3.5.21': [
    ['/', 'Скролбари приховано візуально на всіх платформах — скрол коліщатком/тачем працює, смуг на екрані нема'],
    ['/', '«Пристрой» — лише ім\u2019я пристрою без іконки: Телефон (Android), Комп\u2019ютер (Windows) тощо'],
    ['+', 'Налаштування: рамка «Копіювання посилання на урок» з перемикачем — ПКМ по уроку в розкладі, на телефоні — затиснути'],
    ['+', 'Налаштування: «Автоматичний вхід у Zoom (тест)» — за 3 хв до уроку сам відкриє Zoom, вимкне звук і камеру та натисне «Увійти» (лише Windows)', 'windows'],
    ['+', 'Головна веб-версія для ВСІХ пристроїв: fluxhelper.pages.dev/main — один вхід для Android, iPhone, Windows і Mac; вкладки в URL англійською (#schedule, #settings, #account, #admin)'],
    ['✦', 'Сайт більше не висить на 88% без акаунта — завантаження миттєве, коли завантажувати нічого']
  ],
  '3.5.20': [
    ['✦', 'Сповіщення Windows більше не губляться — приходять рівно за обраний час', 'windows'],
    ['/', 'Сповіщення — картка-«розмова» як у Telegram: розгорнув — кнопки «Зайти на урок» і «Нагадати за 1 хв»', 'android'],
    ['/', 'Рамка «Сповіщення» на ПК — іконки точь-в-точь як на телефоні', 'windows'],
    ['/', 'Рамка «Пристрой» — нові власні іконки платформ (Android, iPhone, Windows, macOS)'],
    ['-', 'Кнопки «До розкладу» і «Назад» прибрано — вкладки завжди під рукою'],
    ['/', 'Екран «Немає інтернету» зник — замість нього спокійне закривне віконце при діях без мережі'],
    ['+', 'Сайт перевіряє пристрій: версія для iPhone — на iPhone, версія для Mac — на Mac', 'iphone'],
    ['/', 'Сайт для Mac: повернуто «Запуск Zoom» — через додаток або браузер', 'mac'],
    ['/', '«Що нового» показує зміни лише для твого пристрою']
  ],
  '3.5.19': [
    ['/', 'Екран входу — лише «Вітаємо у FluxHelper»: логотип і назву зверху прибрано, унизу — «вхід захищає Google»'],
    ['/', 'Після вибору акаунта Google одразу з’являється екран завантаження — жодних «перевіряємо акаунт»'],
    ['+', 'Рамка «Пристрой» — ім’я пристрою з ОС (Телефон (Android), Телефон (iPhone), Комп’ютер (Windows), Комп’ютер (macOS)) та іконка платформи'],
    ['-', 'Сайт: сповіщення про початок уроку прибрано — ця функція лише в застосунках Android і Windows'],
    ['-', 'Сайт: кнопки «Згорнути»/«Закрити» у титульній панелі та на сплеші приховані — вони потрібні лише програмі Windows']
  ],
  '3.5.10': [
    ['✦', 'Розклад підтягується з бази ще на екрані завантаження — без «стрибка» даних']
  ],
  '3.5.5': [
    ['/', 'Оновлення тепер качаються з нашого сайту — швидше і без помилок GitHub', 'pc'],
    ['/', 'Якщо завантаження не вдалося — є «Повторити знову» і «Завантажити оновлення вручну»', 'pc'],
    ['+', 'Синхронізація стала повною: групи, сповіщення, Zoom, тема і перемикач синку — однакові всюди']
  ],
  '3.5.4': [
    ['/', 'Технічна платформа: збірка 3.5.4 для синхронізації з телефоном і веб-версією', 'pc'],
    ['✦', 'Дрібні виправлення стабільності']
  ],
  '3.5.3': [
    ['+', 'Синхронізація з веб-версією для iPhone — налаштування тепер однакові всюди'],
    ['✦', 'Дрібні виправлення стабільності']
  ],
  '3.5.2': [
    ['/', 'Сповіщення про урок при розгортанні — тільки охайний опис: жодних дублів іконки чи назви', 'phone'],
    ['✦', 'Дрібні виправлення стабільності']
  ],
  '3.5.1': [
    ['/', 'Сповіщення на ПК тепер точь-в-точь як на телефоні — круглий логотип і охайна рамка', 'pc'],
    ['+', 'Віконце «Що нового» — після кожного оновлення видно, що змінилося'],
    ['✦', 'Дрібні виправлення для стабільної роботи']
  ]
};
let wnShown = false, wnTimer = 0;
function wnSchedule(d) {
  if (wnShown || wnTimer) return;
  wnTimer = setTimeout(function () { wnTimer = 0; wnCheck(); }, d || 800);
}
function wnMark(m) {
  return m === '+' ? 'wn-add' : m === '-' ? 'wn-rem' : m === '/' ? 'wn-chg' : 'wn-fix';
}









const WN_PLAT = (function () {
  const web = !!window.FH_WEB;
  if (!web) return ANDROID ? 'android' : 'windows';   
  

  var macPage = /\/mac(\/|$)/.test(String(location.pathname || ''));
  return macPage ? 'mac' : 'iphone';
})();
const WN_SITE_BETA_ONLY = { '3.5.20': 1, '3.5.21': 1, '3.5.22': 1, '3.5.23': 1 };   
function wnShowItem(tag) {
  if (!tag) return true;
  if (tag === 'phone') return (WN_PLAT === 'android' || WN_PLAT === 'iphone');
  if (tag === 'pc') return (WN_PLAT === 'windows' || WN_PLAT === 'mac');
  return tag === WN_PLAT;
}
function wnCheck() {
  if (wnShown) return;
  if (updOpen() || UPD.pending) { wnSchedule(1500); return; }   
  const items = WHATS_NEW[APP_VER];
  if (!items || !items.length) return;
  try { if (localStorage.getItem('fh_wn_seen') === APP_VER) return; } catch (e) { return; }
  


  if (window.FH_WEB && WN_SITE_BETA_ONLY[APP_VER] && !FH_BETA()) return;
  const list = byId('wnList');
  if (!list) return;
  let h = '';
  for (let i = 0; i < items.length; ++i) {
    const it = items[i];
    if (!wnShowItem(it[2])) continue;   
    h += '<div class="wn-row ' + wnMark(it[0]) + '"><span class="wn-mark">' + it[0] + '</span><i>' + it[1] + '</i></div>';
  }
  if (!h) return;   
  list.innerHTML = h;
  const vs = byId('wnVer');
  if (vs) vs.textContent = verLabel();
  const sub = byId('wnSub');
  if (sub) sub.textContent = 'FluxHelper ' + verLabel() + ' — оновлення встановлено';
  const w = byId('wn');
  if (w) w.classList.remove('hidden');
  wnShown = true;
}
function wnClose() {
  const w = byId('wn');
  if (w) w.classList.add('hidden');
  try { localStorage.setItem('fh_wn_seen', APP_VER); } catch (e) {}
}





function revealNow() {
  if (bootRevealed || updOpen()) return;
  if (!ACC.user) return;   /* без акаунта розклад ніколи не показуємо */
  if (!dataVerified) {
    try {
      const c0 = JSON.parse(localStorage.getItem('fh_cache') || 'null');
      if (c0 && c0.data && (S || paccRestore())) { bootReady = true; return; }
    } catch (e0) {}
    return;
  }
  bootReady = true;
}

function showUpd(v, notes, testMode, pref, md5) {
  UPD.avail = true; UPD.ver = v; UPD.busy = false; UPD.pending = '';
  UPD.test = !!testMode;
  UPD.pref = pref || 'versions/release/';
  

  try {
    const fl = JSON.parse(localStorage.getItem('fh_upd_fail') || 'null');
    if (!testMode && fl && fl.ver === v && (fl.n | 0) >= 2) {
      const wn6 = byId('updWarn'); if (wn6) wn6.hidden = false;
      updErrButtons(true);
    }
  } catch (e) {}
  

  UPD.exeMd5 = (md5 && /^[0-9a-fA-F]{32}$/.test(String(md5))) ? String(md5).toLowerCase() : '';
  const chip = byId('updChip');
  if (chip) chip.textContent = (UPD.pref === 'versions/beta/') ? 'доступна бета-версія' : 'доступне оновлення';
  



  const _ul17 = byId('updLater');
  if (_ul17) _ul17.classList.toggle('hidden', !UPD.test);
  updErrButtons(false);   
  const b = byId('boot');
  if (b && !b.classList.contains('hidden')) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 560); }
  hideNetErr();
  
  
  
  try { gateHide(); gateLock(false); } catch (e) {}
  byId('updOld').textContent = verLabel();   
  byId('updNew').textContent = v;
  
  const w = byId('upd');
  w.classList.remove('hidden');
  document.body.classList.add('upd-lock');   
  byId('updGo').disabled = false;
  byId('updProg').classList.remove('on');
  byId('upFill').style.width = '0%';
  byId('upPct').textContent = '';
  byId('uStat').textContent = 'готово до встановлення';
}




function updCheck(latest, pref, md5) {
  
  if (window.FH_WEB) { revealNow(); return; }
  if (!/^\d+\.\d+\.\d+$/.test(latest || '') || verCmp(latest, APP_VER) <= 0) { revealNow(); return; }
  if (UPD.avail || UPD.pending === latest) return;
  UPD.pending = latest;
  
  
  
  
  
  
  const heads = (pref && String(pref).indexOf('versions/') === 0)
    ? [String(pref)]
    : (betaAllowed() ? ['versions/beta/', 'versions/release/'] : ['versions/release/']);
  

  const heads2 = betaAllowed() ? heads : heads.filter(function (p) { return String(p).indexOf('versions/beta/') !== 0; });
  (function probe(i) {
    if (i >= heads2.length) { UPD.pending = ''; revealNow(); return; }
    

    const probeUrl = (heads2[i] === 'versions/release/')
      ? 'https://fluxhelper.pages.dev/FluxHelper.exe?_=' + Date.now()
      : 'https://raw.githubusercontent.com/' + UPDATE_REPO + '/main/' + heads2[i] + latest + '/FluxHelper.exe?_=' + Date.now();
    fetch(probeUrl, { method: 'HEAD', cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; showUpd(latest, null, false, heads2[i], md5); })
      .catch(function () { probe(i + 1); });
  })(0);
}
function updFromDb(u) {
  const latest = (u && typeof u.latest === 'string') ? u.latest : '';
  if (UPD.avail) return;
  
  if (/^\d+\.\d+\.\d+$/.test(latest) && verCmp(latest, APP_VER) > 0) {
    
    try {
      const sk7 = JSON.parse(localStorage.getItem('fh_upd_skip') || 'null');
      if (sk7 && sk7.ver === latest) { revealNow(); return; }
    } catch (e) {}
    UPD.test = false;
    


    updCheck(latest, (u && u._pref) || undefined, u.exe_md5);
    return;
  }
  
  
  
  
  
  
  const t = (u && u.test && typeof u.test === 'object' && u.test !== null) ? u.test : null;
  const tv = (t && typeof t.latest === 'string') ? t.latest : '';
  if (/^\d+\.\d+\.\d+$/.test(tv) && verCmp(tv, APP_VER) > 0) {
    const tid = String(t.tid || '');
    let seen = '';
    try { seen = localStorage.getItem('fh_testseen') || ''; } catch (e) {}
    if (!(tid && seen && seen === tid)) {
      showUpd(tv, null, true);
    }
    return;
  }
  
  revealNow();
}





let updWatchBusy = false;





function fetchLatest(cb) {
  




  const raw = function (p) { return 'https://raw.githubusercontent.com/' + UPDATE_REPO + '/main/' + p + 'latest.json?cb=' + Date.now(); };
  const mark = function (p, j) { try { if (j && typeof j === 'object') j._pref = p; } catch (e) {} cb(j); };
  const newer = function (j) { const l = (j && typeof j.latest === 'string') ? j.latest : ''; return /^\d+\.\d+\.\d+$/.test(l) && verCmp(l, APP_VER) > 0; };
  const okJson = function (j) { return j && typeof j === 'object' && typeof j.latest === 'string' && /^\d+\.\d+\.\d+$/.test(j.latest); };
  const firebaseFallback = function () {
    fetch(DB_URL + '/update.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { cb(j); })
      .catch(function () { cb(null); });
  };
  if (betaAllowed()) {
    let rel = null, bet = null, relDone = false, betDone = false, fin = false;
    const pick = function () {
      if (fin || !(relDone && betDone)) return;
      fin = true;
      if (okJson(rel) && okJson(bet)) {
        const c = verCmp(bet.latest, rel.latest);
        mark(c > 0 ? 'versions/beta/' : 'versions/release/', c > 0 ? bet : rel);
        return;
      }
      if (okJson(bet)) { mark('versions/beta/', bet); return; }
      if (okJson(rel)) { mark('versions/release/', rel); return; }
      firebaseFallback();   
    };
    fetch(raw('versions/release/'), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(0); })
      .then(function (j) { rel = j; })
      .catch(function () { rel = null; })
      .then(function () { relDone = true; pick(); });
    fetch(raw('versions/beta/'), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(0); })
      .then(function (j) { bet = j; })
      .catch(function () { bet = null; })
      .then(function () { betDone = true; pick(); });
    return;
  }
  
  fetch(raw('versions/release/'), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(0); })
    .then(function (j) { mark('versions/release/', j); })
    .catch(firebaseFallback);
}
function handleLatest(u) {
  updWatchBusy = false;
  if (!u || typeof u !== 'object') return;
  const latest = (typeof u.latest === 'string') ? u.latest : '';
  
  if (/^\d+\.\d+\.\d+$/.test(latest) && verCmp(latest, APP_VER) > 0) {
    

    try {
      const sk6 = JSON.parse(localStorage.getItem('fh_upd_skip') || 'null');
      if (sk6 && sk6.ver === latest) return;
    } catch (e) {}
    updCheck(latest, u._pref, u.exe_md5);
  }
}
function watchUpdate() {
  if (updOpen() || updWatchBusy || document.hidden) return;
  updWatchBusy = true;
  fetchLatest(handleLatest);
}

function manualUpdCheck() {
  const b = byId('bUpdNow'); if (b) b.disabled = true;
  try { localStorage.removeItem('fh_upd_skip'); } catch (e) {}   
  toast('Перевіряю оновлення…');
  fetchLatest(function (u) {
    if (b) b.disabled = false;
    const latest = (u && typeof u.latest === 'string') ? u.latest : '';
    if (/^\d+\.\d+\.\d+$/.test(latest) && verCmp(latest, APP_VER) > 0) {
      
      updCheck(latest, u._pref, u.exe_md5);             
      setTimeout(function () {
        if (!updOpen()) toast('Файл оновлення ще не опубліковано — спробуй пізніше');
      }, 9000);
      return;
    }
    if (!latest) { toast('Не вдалося зв' + String.fromCharCode(39) + 'язатися з сервером оновлень'); return; }
    toast('У тебе найновіша версія ✓');
  });
}

function setUpdBtn(en) { const b = byId('updGo'); if (b) b.disabled = !en; }



function updErrButtons(show) {
  const go = byId('updGo'), rt = byId('updRetry'), mn = byId('updMan');
  if (rt) rt.classList.toggle('hidden', !show);
  if (mn) mn.classList.toggle('hidden', !show);
  if (go) go.classList.toggle('hidden', !!show);
}



function updLater() {
  UPD.avail = false; UPD.busy = false;
  if (UPD.watch) { clearTimeout(UPD.watch); UPD.watch = 0; }
  
  if (UPD.test) { try { localStorage.setItem('fh_upd_skip', JSON.stringify({ ver: UPD.ver })); } catch (e) {} }
  updProgOff();
  updErrButtons(false);
  const wn7 = byId('updWarn'); if (wn7) wn7.hidden = true;
  const w7 = byId('upd'); if (w7) w7.classList.add('hidden');
  document.body.classList.remove('upd-lock');
  gateShow();
}
function updManUrl() {
  return (UPD.pref === 'versions/beta/')
    ? 'https://fluxhelper.pages.dev/versions/beta/' + UPD.ver + '/FluxHelper.exe'
    : 'https://fluxhelper.pages.dev/FluxHelper.exe';
}
function updProgOff() {
  byId('updProg').classList.remove('on');
  byId('upFill').style.width = '0%';
  byId('upPct').textContent = '';
}
function dlProg(p) {
  if (!UPD.avail || !UPD.busy) return;
  if (UPD.watch) { clearTimeout(UPD.watch); UPD.watch = 0; }
  p = Math.max(0, Math.min(100, p | 0));
  byId('updProg').classList.add('on');
  byId('upFill').style.width = p + '%';
  byId('upPct').textContent = p + '%';
  byId('uStat').textContent = (p >= 100) ? 'запускаю встановлення…' : 'завантаження…';
  if (p >= 100) setUpdBtn(false);
}
function dlErr(msg) {
  if (!UPD.avail) return;
  UPD.busy = false;
  if (UPD.watch) { clearTimeout(UPD.watch); UPD.watch = 0; }
  updProgOff();
  byId('uStat').textContent = String(msg || 'помилка завантаження');
  
  updErrButtons(true);
  
  try {
    const fl6 = JSON.parse(localStorage.getItem('fh_upd_fail') || 'null');
    const n6 = (fl6 && fl6.ver === UPD.ver) ? (fl6.n | 0) + 1 : 1;
    localStorage.setItem('fh_upd_fail', JSON.stringify({ ver: UPD.ver, n: n6 }));
  } catch (e) {}
}
function dlDone() {
  if (!UPD.avail) return;
  try { localStorage.removeItem('fh_upd_fail'); } catch (e) {}
  if (UPD.watch) { clearTimeout(UPD.watch); UPD.watch = 0; }
  byId('updProg').classList.add('on');
  byId('upFill').style.width = '100%';
  byId('upPct').textContent = '100%';
  byId('uStat').textContent = ANDROID ? 'відкриваю встановлення…' : 'встановлення… застосунок зараз перезапуститься';
  setUpdBtn(false);
}
function startUpdate() {
  if (UPD.busy || !UPD.avail) return;
  UPD.busy = true;
  setUpdBtn(false);
  updErrButtons(false);   
  
  
  
  
  if (UPD.test) {
    try {
      if (DBD.updTest && DBD.updTest.tid) localStorage.setItem('fh_testseen', DBD.updTest.tid);
      else localStorage.setItem('fh_testseen', 'done-' + UPD.ver);
    } catch (e) {}
    byId('updProg').classList.add('on');
    byId('uStat').textContent = 'завантаження…';
    let p = 0;
    const iv = setInterval(function () {
      p += 7 + Math.round(Math.random() * 9);
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        byId('uStat').textContent = 'встановлення… застосунок зараз перезапуститься';
        if (ANDROID) { setTimeout(function () { try { location.reload(); } catch (e) {} }, 700); }
        else { setTimeout(function () { host('fh:restart'); }, 700); }
      }
      byId('upFill').style.width = p + '%';
      byId('upPct').textContent = p + '%';
    }, 130);
    return;
  }
  if (ANDROID) {
    
    
    
    byId('uStat').textContent = 'шукаю файл оновлення…';
    const base = 'https://raw.githubusercontent.com/' + UPDATE_REPO + '/main/' + (UPD.pref || 'versions/release/') + UPD.ver + '/';
    const cands = [base + 'FluxControl.apk', base + 'Blazix.apk', base + 'FluxHelper.apk'];
    (function probe(i) {
      if (i >= cands.length) {
        UPD.busy = false; setUpdBtn(true);
        byId('uStat').textContent = 'файл оновлення не знайдено — спробуй пізніше';
        return;
      }
      fetch(cands[i], { method: 'HEAD', cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw 0; })
        .then(function () {
          UPD.busy = false; setUpdBtn(true);
          byId('uStat').textContent = 'завантаження відкрито у браузері — встанови APK, коли файл завантажиться';
          try { toast('Завантаження почалось ✓'); } catch (e) {}
          openL(cands[i]);
        })
        .catch(function () { probe(i + 1); });
    })(0);
    return;
  }
  
  
  byId('uStat').textContent = 'готуємо завантаження…';
  const payload = JSON.stringify({ v: UPD.ver, repo: UPDATE_REPO, p: UPD.pref || 'versions/release/', md5: UPD.exeMd5 || '' });
  const sent = host('fh:update|' + payload);
  if (sent) {
    
    UPD.watch = setTimeout(function () {
      if (UPD.busy && !byId('upFill').style.width) dlErr('сервер оновлень не відповідає — перевір інтернет');
    }, 25000);
  } else {
    UPD.busy = false;
    setUpdBtn(true);
    byId('uStat').textContent = 'не вдалося запустити завантаження — спробуй ще раз';
  }
}







let fhNet = { down: false, retryT: 0 };
function fhNetRetry() {            
  if (fhNet.retryT) return;
  fhNet.retryT = setTimeout(function () {
    fhNet.retryT = 0;
    try { netProbe(false); } catch (eR) {}
  }, 4000);
}
function showNetErr() {            
  fhNet.down = true;               
  try {
    if (typeof dataVerified !== 'undefined' && !dataVerified) fhNetRetry();
  } catch (eV) {}
}
function hideNetErr() { fhNet.down = false; }   
function fhOfflineNow() {
  return (navigator.onLine === false) || fhNet.down;
}
function showOffl() {
  

}
function hideOffl() {
  
}



function needOnline(fn) {
  

  if (typeof fn === 'function') fn();
  return true;
}
let netBusy = false;


function webUpdCheck() {
  

  const pick = function (j, pref) {
    if (j && j.latest) { j._pref = pref; updFromDb({ latest: String(j.latest), notes: Array.isArray(j.notes) ? j.notes : [] }); }
  };
  const rel = function () {
    fetch('https://fluxhelper.pages.dev/versions/release/latest.json?cb=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
      .then(function (j) { pick(j, 'versions/release/'); });
  };
  if (typeof betaAllowed === 'function' && betaAllowed()) {
    fetch('https://fluxhelper.pages.dev/versions/beta/latest.json?cb=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
      .then(function (j) { if (j && j.latest) pick(j, 'versions/beta/'); else rel(); });
  } else rel();
}
function webProbe() {
  
  d1Snap(function (j) {
    if (j) {
      d1NetUp();
      try { d1Apply(JSON.parse(j)); } catch (eP) {}
      hideNetErr();
      webUpdCheck();
      return;
    }
    d1NetDown();
    setTimeout(webProbe, 3000);
  });
}
function netProbe(retry) {
  

  if (window.FH_WEB) { webProbe(); return; }
  if (netBusy) return;
  netBusy = true;
  if (retry) {
    const s = byId('neStat'), r = byId('neRetry');
    if (s) s.textContent = 'перевіряємо з\u2019єднання…';
    if (r) r.disabled = true;
  }
  d1Snap(function (j) {
    netBusy = false;
    if (j) {
      d1NetUp();
      try { d1Apply(JSON.parse(j)); } catch (eP) {}
      hideNetErr();
      d1UpdateCheck();            
    } else {
      d1NetDown();
      showNetErr();
    }
  });
}





const fbCbs = {};
let fbSeq = 0;
function __fhFbResult(id, ok) {
  const f = fbCbs[id];
  delete fbCbs[id];
  if (f) f(!!ok);
}
function fbEnc(p) {
  return String(p).split('/').map(function (x) { return encodeURIComponent(x); }).join('/');
}
function evMeta(n, t, u) {
  if (window.FH_WEB) return;
  try { cfExec("INSERT INTO _meta (key,val) VALUES ('ev',?) ON CONFLICT(key) DO UPDATE SET val=excluded.val", [JSON.stringify({ n: n, t: t, u: u })], null, 6000); } catch (eEM) {}
}
function evSched() {
  const n = Date.now();
  try { dbPut('update/webev', { n: n, t: 'sched', u: '' }, null); } catch (eES) {}
  evMeta(n, 'sched', '');
}
function evUser(t, uid) {
  if (!uid) return;
  const n = Date.now();
  const u = String(uid);
  try { dbPut('update/userdev/' + adm46Uid(u), { n: n, t: String(t || 'force'), ts: n }, null); } catch (eEU) {}
  try { dbPut('update/webev', { n: n, t: String(t || 'force'), u: u }, null); } catch (eEU2) {}
  evMeta(n, String(t || 'force'), u);
}
function evHandle(t, u) {
  const mine = ACC.user ? userKey(ACC.user) : '';
  if (t === 'sched') {
    try { d1FetchSnap(); } catch (eEH1) {}
    return;
  }
  if (u && String(u) !== String(mine)) return;
  if (t === 'kick' || t === 'ban') { try { adm46Check('ev'); } catch (eEH2) {} return; }
  if (t === 'unban') {
    try { adm46BanHide(); } catch (eEH3) {}
    try { adm46Check('ev-unban'); } catch (eEH6) {}
    return;
  }
  if (t === 'force' && mine) {
    try { syncPull(false, null); } catch (eEH4) {}
    try { fetchRole(mine, function (rows) { if (ACC.user) accApplyAuth(rows); }); } catch (eEH5) {}
  }
}
function dbPut(path, obj, cb) {
  try { if (/^(schedule|subjects|teachers|weeks)(\/|$)/.test(String(path))) evSched(); } catch (eWB47) {}
  

  try { if (/^(schedule|subjects|teachers|weeks)(\/|$)/.test(String(path))) dbPut('update/webrev', Date.now(), null); } catch (eWB) {}
  const body = JSON.stringify(obj === undefined ? null : obj);
  if (ANDROID && window.AndroidHost && AndroidHost.fbPut) {
    let ok = false;
    
    
    let p2 = fbEnc(path);
    if (p2.indexOf('.json') < 0) p2 += '.json';
    try { ok = AndroidHost.fbPut(p2, body); } catch (e) {}
    if (cb) cb(ok);
    return;
  }
  const id = 'cb' + (++fbSeq) + '_' + Date.now();
  fbCbs[id] = cb || null;
  



  const p2 = fbEnc(path) + '.json';
  if (host('fh:cloud|' + id + '|PUT|' + (DB_URL + '/' + p2).length + '|' + DB_URL + '/' + p2 + body)) return;
  
  fetch(DB_URL + '/' + p2, { method: 'PUT', body: body })
    .then(function (r) { __fhFbResult(id, r.ok); })
    .catch(function () { __fhFbResult(id, false); });
}
function dbDel(path, cb) {
  if (ANDROID && window.AndroidHost && AndroidHost.fbDel) {
    let ok = false;
    let p3 = fbEnc(path);
    if (p3.indexOf('.json') < 0) p3 += '.json';
    try { ok = AndroidHost.fbDel(p3); } catch (e) {}
    if (cb) cb(ok);
    return;
  }
  const id = 'cb' + (++fbSeq) + '_' + Date.now();
  fbCbs[id] = cb || null;
  

  const p3 = fbEnc(path) + '.json';
  if (host('fh:cloud|' + id + '|DELETE|' + (DB_URL + '/' + p3).length + '|' + DB_URL + '/' + p3)) return;
  fetch(DB_URL + '/' + p3, { method: 'DELETE' })
    .then(function (r) { __fhFbResult(id, r.ok); })
    .catch(function () { __fhFbResult(id, false); });
}









const CF_ACC = 'fd6013c3a257c7759ff3c15fbb8ac002';
const CF_DB = '89424274-f50b-4931-838e-0d6f384bbc20';
function cfOk() { return true; }
let cfSeq = 0;
const cfCbs = {};


function cfExec(sql, params, cb, tmo) {
  const id = 'cf' + (++cfSeq) + '_' + Date.now();
  cfCbs[id] = cb || null;
  const payload = JSON.stringify({ sql: sql, params: params || [] });
  const done = function (json) {
    const cb2 = cfCbs[id]; delete cfCbs[id];
    if (!cb2) return;
    let rows = null;
    try {
      const r = (typeof json === 'string') ? JSON.parse(json) : json;
      if (r && r.success && r.result && r.result[0] && r.result[0].results) rows = r.result[0].results;
    } catch (e) {}
    cb2(rows);
  };
  



  setTimeout(function () { if (cfCbs[id]) { delete cfCbs[id]; cfLast = 0; if (cb) cb(null); } }, tmo || 8000);
  if (ANDROID && window.AndroidHost && window.AndroidHost.cfq) {
    try { AndroidHost.cfq(id, payload); return; } catch (e) { delete cfCbs[id]; }
  }
  if (host('fh:cfq|' + id + '|' + payload)) return;   
  done('');
}

function __fhCfResult(id, json) {
  const cb2 = cfCbs[id]; delete cfCbs[id];
  if (!cb2) return;
  let rows = null;
  try {
    const r = JSON.parse(json);
    if (r && r.success && r.result && r.result[0] && r.result[0].results) rows = r.result[0].results;
  } catch (e) {}
  cb2(rows);
}
let cfInitTried = false;
function d1Init() {
  if (!cfOk() || cfInitTried) return;
  cfInitTried = true;
  
  
  
  
  
  
  cfExec('CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, name TEXT, email TEXT, pic TEXT, ts INTEGER, role TEXT DEFAULT \'user\', sync INTEGER DEFAULT 1, beta INTEGER DEFAULT 0, logins INTEGER DEFAULT 0, settings TEXT, sver TEXT, sts INTEGER, created INTEGER)', [], function (r) {
    if (r === null) cfInitTried = false;
  });
  cfExec('DROP TABLE IF EXISTS user_settings', [], null);
  cfExec('DROP TABLE IF EXISTS devices', [], null);
  
  
  
  
  cfExec('CREATE TABLE IF NOT EXISTS device (did TEXT PRIMARY KEY, user_id TEXT, type TEXT, name TEXT, model TEXT, os TEXT, ver TEXT, settings TEXT, first_seen INTEGER, last_seen INTEGER)', [], function (r) {
    if (r === null) cfInitTried = false;
  });
  
  cfExec('ALTER TABLE users ADD COLUMN logins INTEGER DEFAULT 0', [], null);
  cfExec('ALTER TABLE users ADD COLUMN settings TEXT', [], null);
  cfExec('ALTER TABLE users ADD COLUMN sver TEXT', [], null);
  cfExec('ALTER TABLE users ADD COLUMN sts INTEGER', [], null);
  cfExec('ALTER TABLE users ADD COLUMN created INTEGER', [], null);
  

  cfExec('ALTER TABLE users ADD COLUMN ver_phone TEXT', [], null);
  cfExec('ALTER TABLE users ADD COLUMN ver_pc TEXT', [], null);
  

  cfExec('ALTER TABLE users ADD COLUMN banned INTEGER DEFAULT 0', [], null);
  cfExec('ALTER TABLE users ADD COLUMN ban_reason TEXT', [], null);
}
function loadRemoteCfg() {  }





function visitPing() {  }
function devId() {
  let d = '';
  try { d = localStorage.getItem('fh_did') || ''; } catch (e) {}
  if (d) return d;
  const raw = (navigator.userAgent || '') + '|' + (screen.width || 0) + 'x' + (screen.height || 0) +
              '|' + Date.now() + '|' + Math.random();
  let h1 = 0x811c9dc5, h2 = 0x46e3c1a7;
  for (let i = 0; i < raw.length; i++) {
    const c = raw.charCodeAt(i);
    h1 = ((h1 ^ c) * 16777619) >>> 0;
    h2 = ((h2 * 31) + c) >>> 0;
  }
  d = 'd' + h1.toString(36) + h2.toString(36);
  try { localStorage.setItem('fh_did', d); } catch (e) {}
  return d;
}


function collectDevInfo() {
  const o = { type: ANDROID ? 'phone' : 'pc' };
  if (ANDROID) {
    try {
      const j = JSON.parse(AndroidHost.devInfo() || '{}');
      for (const k in j) o[k] = j[k];
    } catch (e) {}
    if (!o.name) o.name = 'Телефон';
  } else {
    try {
      const j = window.__fhDevInfo || {};
      for (const k in j) o[k] = j[k];
    } catch (e) {}
    if (!o.name) o.name = 'Комп\u2019ютер';
  }
  return o;
}




function deviceLabel() {
  const GL = {
    android: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.7-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 5.67c-.18-.28-.58-.36-.85-.2-.3.15-.42.54-.26.85l1.86 3.16C4.2 11 2.4 13.9 2.1 17.3v.2h19.8v-.2c-.3-3.4-2.1-6.3-5.3-7.82zM7.9 15.1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8.2 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>',
    apple: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.7 12.65c.02 2.06 1.81 2.75 1.83 2.76-.02.05-.29 1-1.05 1.98-.63.83-1.29 1.66-2.33 1.68-1.02.02-1.35-.55-2.52-.55-1.17 0-1.53.53-2.5.57-1 .04-1.76-.97-2.4-1.8-1.25-1.61-2.2-4.57-.92-6.36.63-.88 1.76-1.44 2.98-1.46.98-.01 1.9.62 2.5.62.6 0 1.71-.77 2.9-.66.49.02 1.87.18 2.76 1.36-.07.05-1.63.95-1.61 2.83M14.6 5.3c.52-.63.87-1.5.78-2.38-.85.03-1.9.57-2.5 1.2-.54.56-.99 1.46-.86 2.32.94.07 1.9-.48 2.58-1.14"/></svg>',
    win11: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8.3" height="8.3" rx="1.6"/><rect x="12.7" y="3" width="8.3" height="8.3" rx="1.6"/><rect x="3" y="12.7" width="8.3" height="8.3" rx="1.6"/><rect x="12.7" y="12.7" width="8.3" height="8.3" rx="1.6"/></svg>',
    linux: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-3 0-4.8 2.6-4.8 5.6 0 1.9.5 2.7-.4 4.2-.9 1.5-2.3 3.1-2.3 5 0 1.7 1.2 2.4 1.2 2.4s.3 1 1.4 1c1.2 0 1.7-.9 4.9-.9s3.7.9 4.9.9c1.1 0 1.4-1 1.4-1s1.2-.7 1.2-2.4c0-1.9-1.4-3.5-2.3-5-.9-1.5-.4-2.3-.4-4.2C16.8 4.6 15 2 12 2zm-2.4 3.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm4.8 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zM12 8.6c1.3 0 2.4.8 2.4 1.1 0 .3-1.1.3-2.4.3s-2.4 0-2.4-.3c0-.3 1.1-1.1 2.4-1.1z"/></svg>'
  };
  const TL = {
    android: 'linear-gradient(135deg,#4ADE80,#15803D)',
    iphone: 'linear-gradient(135deg,#60A5FA,#2563EB)',
    macos: 'linear-gradient(135deg,#A1A1AA,#3F3F46)',
    windows: 'linear-gradient(135deg,#38BDF8,#0369A1)',
    linux: 'linear-gradient(135deg,#FBBF24,#B45309)'
  };
  const web = !!window.FH_WEB;
  if (!web) return ANDROID ? { name: 'Телефон (Android)', ic: GL.android, tile: TL.android }
                           : { name: 'Комп\u2019ютер (Windows)', ic: GL.win11, tile: TL.windows };
  const ua = String(navigator.userAgent || '');
  const touch = (navigator.maxTouchPoints || 0) > 1;
  if (/iPhone|iPod/i.test(ua)) return { name: 'Телефон (iPhone)', ic: GL.apple, tile: TL.iphone };
  if (/iPad/i.test(ua) || (/Macintosh/.test(ua) && touch)) return { name: 'Планшет (iPadOS)', ic: GL.apple, tile: TL.iphone };
  if (/Android/i.test(ua)) return { name: 'Телефон (Android)', ic: GL.android, tile: TL.android };
  if (/Macintosh|Mac OS X/i.test(ua)) return { name: 'Комп\u2019ютер (macOS)', ic: GL.apple, tile: TL.macos };
  if (/Windows/i.test(ua)) return { name: 'Комп\u2019ютер (Windows)', ic: GL.win11, tile: TL.windows };
  if (/Linux/i.test(ua)) return { name: 'Комп\u2019ютер (Linux)', ic: GL.linux, tile: TL.linux };
  return ANDROID ? { name: 'Телефон (Android)', ic: GL.android, tile: TL.android } : { name: 'Комп\u2019ютер (Windows)', ic: GL.win11, tile: TL.windows };
}





let _statBusy = false;
function deviceSnapshot() {
  const g = {};
  for (const ok in OLDKEY) if (S && (S[OLDKEY[ok]] === 1 || S[OLDKEY[ok]] === 2)) g[ok] = S[OLDKEY[ok]];
  return JSON.stringify({ g: g, n: { on: !!NOTIF.on, min: NOTIF.min, snd: !!NOTIF.snd, off: !!NOTIF.off }, z: (typeof ZOOM !== 'undefined' && ZOOM.mode) ? ZOOM.mode : 'app', th: (typeof THEME !== 'undefined') ? THEME : '', t: Date.now(), v: APP_VER, sync: ACC.sync ? 1 : 0 });
}
function deviceWrite() {
  if (!cfOk()) return;
  

  const k = userKey(ACC.user);
  if (!k) return;
  const d = collectDevInfo();
  let f = 0;
  try { f = JSON.parse(localStorage.getItem('fh_first') || 'null') || 0; } catch (e) {}
  if (!f) { f = Date.now(); try { localStorage.setItem('fh_first', JSON.stringify(f)); } catch (e2) {} }
  cfExec('INSERT INTO device (did, user_id, type, name, model, os, ver, settings, first_seen, last_seen) VALUES (?,?,?,?,?,?,?,?,?,?) ' +
         'ON CONFLICT(did) DO UPDATE SET user_id=excluded.user_id, type=excluded.type, name=excluded.name, ' +
         'model=excluded.model, os=excluded.os, ver=excluded.ver, settings=excluded.settings, last_seen=excluded.last_seen',
    [devId(), k, String(d.type || ''), String(d.name || ''), String(d.model || ''),
     String(d.os || ''), APP_VER, deviceSnapshot(), f, Date.now()], null);
  



  if (window.FH_WEB) return;
  const _vk = 'fh_verw_' + (ANDROID ? 'phone' : 'pc');
  let _vl = ''; try { _vl = localStorage.getItem(_vk) || ''; } catch (eVw) {}
  if (_vl !== APP_VER) {
    cfExec('UPDATE users SET ' + (ANDROID ? 'ver_phone' : 'ver_pc') + '=? WHERE user_id=?',
      [APP_VER, k], function (rV) {
        try { if (rV !== null) localStorage.setItem(_vk, APP_VER); } catch (eVw2) {}
      });
  }
}
function devicePing() {
  if (_statBusy) return;
  _statBusy = true;
  const go = function () { _statBusy = false; deviceWrite(); };
  
  if (!ANDROID && !window.__fhDevInfo) { setTimeout(function () { _statBusy = false; devicePing(); }, 4000); return; }
  go();
}




const SITE_URL = 'https://fluxhelper.pages.dev/';
const ROLEL = { user: 'Користувач', admin: 'Адмін', developer: 'Розробник' };
let ACC = { user: null, role: 'user', sync: true };
let authReady = false, agT = 0, agState = '', syncT = 0, syncLastTs = 0, LAST_NOTIF = null;




let gateAccountGone = false;   
let cfLast = 0, agRetry = false;   
try {
  const _u = JSON.parse(localStorage.getItem('fh_user') || 'null');
  if (_u && _u.sub && _u.name) ACC.user = { sub: String(_u.sub), name: String(_u.name), email: String(_u.email || ''), pic: String(_u.pic || '') };
} catch (e) {}
try { ACC.sync = localStorage.getItem('fh_sync') !== '0'; } catch (e) {}
try { syncLastTs = parseInt(localStorage.getItem('fh_sync_ts') || '0', 10) || 0; } catch (e) {}

function staff() { return ACC.role === 'admin' || ACC.role === 'developer'; }
function normRole(r) { if (r === 'development') return 'developer'; return (r === 'admin' || r === 'developer') ? r : 'user'; }


let agOutT = 0;
function gateShow() {
  const g = byId('agate'); if (!g) return;
  clearTimeout(agOutT);
  g.classList.remove('hidden', 'ag-out');   
  document.body.classList.add('gate-on');   
  const lg = byId('agLogo'); if (lg) lg.innerHTML = '<img src="' + LOGO + '" alt="" decoding="sync">';   
  
  const b = byId('boot');
  if (b && !b.classList.contains('hidden')) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 480); }
  
  if (groupsOpen()) closeGroups();
}
function gateHide() {
  const g = byId('agate');
  if (!g || g.classList.contains('hidden')) { document.body.classList.remove('gate-on'); return; }
  

  g.classList.add('ag-out');
  clearTimeout(agOutT);
  agOutT = setTimeout(function () { g.classList.add('hidden'); g.classList.remove('ag-out'); }, 330);
  document.body.classList.remove('gate-on');
}
function setAgStat(t, cls) { const s2 = byId('agStat'); if (s2) { s2.className = 'ag-stat' + (cls ? ' ' + cls : ''); s2.innerHTML = t || ''; } }
function gateLock(on) { host('fh:gatelock|' + (on ? '1' : '0')); }
function gateStart() {
  gateShow(); gateLock(true);
  if (!ANDROID) host('fh:gatewarm');   
  agState = '';
  



  let gone = gateAccountGone;
  gateAccountGone = false;
  try {
    if (localStorage.getItem('fh_gone_msg') === '1') gone = true;
    localStorage.removeItem('fh_gone_msg');
  } catch (e) {}
  if (gone) {
    setAgStat('Акаунт видалено з бази — увійдіть іншим Google-акаунтом.', 'err');
    const as2 = byId('agSub'); if (as2) as2.textContent = 'Аккаунт недійсний. Увійдіть знову, щоб користуватись програмою.';
  } else {
    setAgStat('');
    const as3 = byId('agSub');
    if (as3) as3.textContent = 'Увійди в акаунт Google — розклад, групи та налаштування житимуть на всіх твоїх пристроях.';
  }
  const gb = byId('agGo'); if (gb) gb.disabled = false;
  const gt = byId('agGoT'); if (gt) gt.textContent = 'Увійти через Google';
}
function fhRandHex(nBytes) {
  let s = ''; const c = '0123456789abcdef';
  for (let i = 0; i < nBytes * 2; ++i) s += c.charAt(Math.floor(Math.random() * 16));
  return s;
}
let authPollT = 0;
function authPollDb(st) {
  
  
  clearTimeout(authPollT);
  if (!st) return;
  const t0 = Date.now();
  const tick = function () {
    if (ACC.user || agState !== st) return;   
    fetch(DB_URL + '/update/auth_cb/' + st + '.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (ACC.user || agState !== st) return;
        if (j && j.d && j.d.sub) {
          const p = j.d;
          
          
          const u2 = { sub: String(p.sub), name: String(p.name || 'Користувач'), email: String(p.email || ''), pic: String(p.picture || p.pic || '') };
          if (p.fid) u2.fid = String(p.fid);
          if (p.tok) u2.tok = String(p.tok);
          authAccept(u2);
          dbDel('/update/auth_cb/' + st);
        } else if (Date.now() - t0 < 240000) {
          authPollT = setTimeout(tick, 1500);
        } else if (ANDROID) {
          agFail('Час входу вийшов. Натисни «Увійти через Google» ще раз.');
        }
      })
      .catch(function () {
        if (!ACC.user && agState === st && Date.now() - t0 < 240000) authPollT = setTimeout(tick, 2500);
      });
  };
  tick();
}
function authStart() {
  if (UPD.avail) return;
  
  
  
  
  
  
  
  agState = '';
  try { localStorage.removeItem('fh_auth_state'); } catch (e) {}
  const gb = byId('agGo'); if (gb) gb.disabled = true;
  setAgStat('<span class="spin"></span>Відкриваю Google…');
  let started = false;
  if (ANDROID) {
    const st = fhRandHex(12);
    agState = st;
    try { AndroidHost.login(st); started = true; } catch (e) {}
    if (started) authPollDb(st);
    else agState = '';
  } else {
    started = host('fh:login');
  }
  if (!started) agFail('Не вдалося відкрити вхід. Спробуй ще раз.');
}
function agFail(msg) {
  const gb = byId('agGo'); if (gb) gb.disabled = false;
  const gt = byId('agGoT'); if (gt) gt.textContent = 'Спробувати ще раз';
  setAgStat(msg, 'err');
}






const FH_SEEN = {};
function fhRowSeen(k) { if (k) FH_SEEN[String(k)] = true; }
function fhRowKnown(k) { return !!(k && FH_SEEN[String(k)]); }






function usersUpsert(u, cb) {
  const k = userKey(u);
  if (!k) { if (cb) cb(false); return; }   
  const now = Date.now();
  let tries = 0;
  const write = function () {
    cfExec('INSERT INTO users (user_id, name, email, pic, ts, logins, created, settings, sver, sts) VALUES (?,?,?,?,?,1,?,?,?,?) ' +
           'ON CONFLICT(user_id) DO UPDATE SET name=excluded.name, email=excluded.email, pic=excluded.pic, ts=excluded.ts, logins=COALESCE(users.logins,0)+1',
           [k, (u && u.name) || '', (u && u.email) || '', (u && u.pic) || '', now, now, defaultSettings(), APP_VER, now], function (w) {
      if (w === null && tries < 4) { tries += 1; setTimeout(write, 1200 * tries); return; }   
      cfExec('SELECT user_id FROM users WHERE user_id=?', [k], function (rows) {
        if (rows && rows[0]) { fhRowSeen(k); try { adm46MirrorUser(k); } catch (eMU46) {} if (cb) cb(true); return; }   
        if (tries < 4) { tries += 1; setTimeout(write, 1200 * tries); return; }   
        if (cb) cb(false);
      });
    });
  };
  write();
  if (u && u.fid) usersMigrateLegacy(String(u.fid));
}


function defaultSettings() {
  
  
  
  
  return JSON.stringify({ g: {}, n: { on: true, min: 5, snd: true }, z: 'app', th: 'standard', cf: 0, bt: 0, t: Date.now(), v: APP_VER, sync: 1 });
}



function usersMigrateLegacy(fid) {
  if (!fid || !ACC.user) return;
  const legacySub = String(ACC.user.sub || ''), legacyG = 'g:' + legacySub;
  if (!legacySub) return;
  

  cfExec('DELETE FROM users WHERE (user_id=? OR user_id=?) AND user_id != ?',
         [legacySub, legacyG, String(fid)], null);
}



function userKey(u) {
  u = u || ACC.user;
  return (u && u.fid) ? String(u.fid) : '';
}




function accApplyAuth(rows) {
  if (rows && rows[0]) {
    ACC.role = normRole(rows[0].role);
    ACC.sync = (rows[0].sync === 0) ? false : true;
    

    try { localStorage.setItem('fh_sync', ACC.sync ? '1' : '0'); } catch (e) {}
  }
  refreshAccUI(); applyDevVis();
}





















function adm46Uid(k) { return String(k || '').replace(/[^A-Za-z0-9_-]/g, '_'); }
function adm46FmtWhen(ms) {
  try {
    const d = new Date(parseInt(ms, 10));
    return d.toLocaleDateString('uk-UA') + ' ' + d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  } catch (e) { return String(ms); }
}

function adm46Read(path, cb) {
  let done = false;
  const fin = function (v) { if (!done) { done = true; cb(v); } };
  try {
    const ab = (typeof AbortController === 'function') ? new AbortController() : null;
    if (ab) setTimeout(function () { try { ab.abort(); } catch (eA) {} }, 3500);
    fetch(DB_URL + '/' + path + '.json?cb=' + Date.now(), { cache: 'no-store', signal: ab ? ab.signal : undefined })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { fin((j === undefined) ? null : j); })
      .catch(function () { fin(null); });
  } catch (e) { fin(null); }
}


function adm46Write(path, obj, cb) {
  if (window.FH_WEB) {
    let auth = '';
    try {
      const s = JSON.parse(localStorage.getItem('fh_web_session') || 'null');
      if (s && s.tok) auth = '?auth=' + encodeURIComponent(s.tok);
    } catch (eS) {}
    const init = { method: (obj === null) ? 'DELETE' : 'PUT', headers: { 'Content-Type': 'application/json' } };
    if (obj !== null) init.body = JSON.stringify(obj);
    fetch(DB_URL + '/' + path + '.json' + auth, init)
      .then(function (r) { if (cb) cb(r.ok); })
      .catch(function () { if (cb) cb(false); });
    return;
  }
  if (obj === null) { dbDel(path, cb); return; }
  dbPut(path, obj, cb);
}

function adm46UsersLoad(cb) {
  if (window.FH_WEB) {
    
    adm46Read('update/users', function (j) {
      if (!j || typeof j !== 'object') { cb(null); return; }
      const rows = [];
      for (const k in j) {
        const v = j[k];
        if (!v || typeof v !== 'object') continue;
        rows.push({
          user_id: k, name: String(v.n || ''), email: String(v.e || ''), pic: String(v.p || ''),
          role: String(v.r || 'user'), banned: parseInt(v.b, 10) || 0, ban_reason: String(v.br || ''),
          logins: parseInt(v.lg, 10) || 0, created: parseInt(v.cr, 10) || parseInt(v.ts, 10) || 0,
          ts: parseInt(v.ts, 10) || 0, ver_phone: String(v.vp || ''), ver_pc: String(v.vpc || '')
        });
      }
      rows.sort(function (a, b) { return (b.created || 0) - (a.created || 0); });
      cb(rows);
    });
    return;
  }
  cfExec('SELECT user_id,name,email,pic,role,IFNULL(banned,0) AS banned,IFNULL(ban_reason,\'\') AS ban_reason,IFNULL(logins,0) AS logins,created,ts,IFNULL(ver_phone,\'\') AS ver_phone,IFNULL(ver_pc,\'\') AS ver_pc FROM users ORDER BY COALESCE(created,ts) DESC LIMIT 300', [], function (rows) { cb(rows); }, 12000);
}

function adm46MirrorUser(k) {
  if (!k || !ACC.user) return;
  

  adm46Read('update/users/' + adm46Uid(k), function (prev46) {
    const node = {
      n: String(ACC.user.name || ''), e: String(ACC.user.email || ''), p: String(ACC.user.pic || ''),
      r: String(ACC.role || 'user'), ts: Date.now(),
      b: (prev46 && parseInt(prev46.b, 10)) || 0, br: (prev46 && String(prev46.br || '')) || ''
    };
    const write = function (extra) {
      if (extra) for (const x in extra) node[x] = extra[x];
      adm46Write('update/users/' + adm46Uid(k), node);
    };
    if (window.FH_WEB) { write(null); return; }
  cfExec('SELECT role,IFNULL(banned,0) AS banned,IFNULL(ban_reason,\'\') AS ban_reason,IFNULL(logins,0) AS logins,created,IFNULL(ver_phone,\'\') AS ver_phone,IFNULL(ver_pc,\'\') AS ver_pc FROM users WHERE user_id=?', [k], function (rows) {
    if (rows && rows[0]) {
      const r = rows[0];
      write({ b: parseInt(r.banned, 10) || 0, br: String(r.ban_reason || ''), lg: parseInt(r.logins, 10) || 0, cr: parseInt(r.created, 10) || 0, r: String(r.role || 'user'), vp: String(r.ver_phone || ''), vpc: String(r.ver_pc || '') });
    } else write(null);
  });
  });
}

let adm46Busy = false;
function adm46KickGone46(k) {
  try {
    if (!window.FH_WEB) {
      cfExec('DELETE FROM users WHERE user_id=?', [k], null);
      cfExec('DELETE FROM device WHERE user_id=?', [k], null);
    }
    adm46Write('update/users/' + adm46Uid(k), null);
    adm46Write('update/web/' + adm46Uid(k), null);
    adm46Write('update/settings_mirror/' + adm46Uid(k), null);
    adm46Write('update/websts/' + adm46Uid(k), null);
  } catch (eC46) {}
  adm46BanHide();
  forceAccountGone(false);
  try { toast('Акаунт видалено адміністратором'); } catch (eT46) {}
}
function adm46Check(src) {
  if (!ACC.user || adm46Busy) return;
  const k = userKey(ACC.user);
  if (!k) return;
  try { adm46MirrorUser(k); } catch (eMU46c) {}   
  adm46Busy = true;
  adm46Read('update/admdel/' + adm46Uid(k), function (del) {
    adm46Read('update/admban/' + adm46Uid(k), function (ban) {
      adm46Busy = false;
      
      if (del === null && ban === null) return;
      if (del === 1 || del === true) {
        
        setTimeout(function () {
          if (!ACC.user || userKey(ACC.user) !== k) return;
          adm46Read('update/admdel/' + adm46Uid(k), function (del2) {
            if (del2 !== 1 && del2 !== true) return;   
            if (!window.FH_WEB) {
              cfExec('SELECT COUNT(*) AS c FROM users WHERE user_id=?', [k], function (rc) {
                const cnt = (rc && rc[0]) ? parseInt(rc[0].c, 10) : -1;
                if (cnt > 0) { adm46Write('update/admdel/' + adm46Uid(k), null, null); return; }
                adm46KickGone46(k);
              }, 12000);
              return;
            }
            adm46KickGone46(k);
          });
        }, 1500);
        return;
      }
      const act = ban && typeof ban === 'object' && (parseInt(ban.b, 10) === -1 || parseInt(ban.b, 10) > Date.now());
      if (act) {
        
        setTimeout(function () {
          if (!ACC.user || userKey(ACC.user) !== k) return;
          adm46Read('update/admban/' + adm46Uid(k), function (ban2) {
            if (!(ban2 && typeof ban2 === 'object' && (parseInt(ban2.b, 10) === -1 || parseInt(ban2.b, 10) > Date.now()))) { adm46BanHide(); return; }
            if (!window.FH_WEB) {
              cfExec('SELECT banned FROM users WHERE user_id=?', [k], function (rb) {
                const bdb = (rb && rb[0]) ? parseInt(rb[0].banned, 10) : 0;
                if (bdb === 0) { adm46Write('update/admban/' + adm46Uid(k), null, null); adm46BanHide(); return; }
                adm46BanShow(ban2);
              }, 12000);
              return;
            }
            adm46BanShow(ban2);
          });
        }, 1500);
        return;
      }
      adm46BanHide();   
    });
  });
  
  if (!window.FH_WEB) {
    cfExec('SELECT IFNULL(banned,0) AS banned,IFNULL(ban_reason,\'\') AS ban_reason FROM users WHERE user_id=?', [k], function (rows) {
      if (!ACC.user || userKey(ACC.user) !== k || !rows) return;   
      const r = rows[0];
      if (r && (parseInt(r.banned, 10) === -1 || parseInt(r.banned, 10) > Date.now())) {
        adm46BanShow({ b: parseInt(r.banned, 10), r: String(r.ban_reason || '') });
      }
    }, 9000);
  }
}

function adm46BanShow(ban) {
  let w = document.getElementById('fh46ban');
  if (!w) {
    w = document.createElement('div');
    w.id = 'fh46ban';
    w.innerHTML = '<div class="f46b-card"><div class="f46b-ico">⛔</div>' +
      '<h3>Ваш акаунт заблоковано</h3>' +
      '<div class="f46b-why" id="f46bWhy"></div>' +
      '<div class="f46b-un" id="f46bUn"></div>' +
      '<button class="f46b-btn" id="f46bOut" type="button">Вийти з акаунту</button></div>';
    document.body.appendChild(w);
    const btn = document.getElementById('f46bOut');
    if (btn) btn.onclick = function () { adm46BanHide(); try { forceAccountGone(false); } catch (eF46) {} };
  }
  const why = document.getElementById('f46bWhy'), un = document.getElementById('f46bUn');
  const b = parseInt(ban && ban.b, 10);
  const reason = String((ban && ban.r) || '').trim();
  if (why) why.textContent = reason ? ('Причина: ' + reason) : 'Причину не вказано';
  if (un) un.textContent = (b === -1) ? 'Блокування: назавжди' : ('Розблокування: ' + adm46FmtWhen(b));
  w.classList.add('on');
}
function adm46BanHide() {
  const w = document.getElementById('fh46ban');
  if (w) w.classList.remove('on');
}

function adm46UsersHtml() {
  return '<div class="adm-u-top">' +
    '<button class="adm-abtn" data-act="admurefresh" type="button">Оновити список</button>' +
    '<span class="adm-u-dim" id="admUHint">список оновлюється при відкритті вкладки</span>' +
    '</div><div id="admUList" class="adm-u-list"><div class="adm-u-dim">Завантаження…</div></div>';
}
function adm46UsersOpen() {
  const box = document.getElementById('admUList');
  if (!box) return;
  adm46UsersLoad(function (rows) {
    if (!box.isConnected) return;
    if (rows === null) { box.innerHTML = '<div class="adm-u-dim">База не відповіла — натисни «Оновити список»</div>'; return; }
    ADM.usrs = rows || [];
    adm46UsersRender();
  });
}
function adm46UsersRender() {
  const box = document.getElementById('admUList');
  if (!box) return;
  const rows = ADM.usrs || [];
  if (!rows.length) { box.innerHTML = '<div class="adm-u-dim">Список порожній: користувачі з\'являться тут після входу в застосунку (веб-акаунти пишуться в базу при кожному вході)</div>'; return; }
  let h = '';
  rows.forEach(function (r) {
    const self = ACC.user && userKey(ACC.user) === r.user_id;
    const banned = parseInt(r.banned, 10) === -1 || parseInt(r.banned, 10) > Date.now();
    const ava = r.pic ? '<img src="' + escH(r.pic) + '" referrerpolicy="no-referrer" alt="">' : escH((r.name || '?').charAt(0).toUpperCase());
    let chips = '';
    if (r.role === 'admin') chips += '<i class="adm-chip r-admin">адмін</i>';
    if (r.role === 'developer') chips += '<i class="adm-chip r-developer">розробник</i>';
    if (banned) chips += '<i class="adm-chip banned" title="' + escH(r.ban_reason || '') + '">заблоковано</i>';
    const meta = [];
    if (r.logins) meta.push('входів: ' + r.logins);
    if (r.created) meta.push('з ' + adm46FmtWhen(r.created));
    if (r.ver_phone) meta.push('тел: ' + escH(r.ver_phone));
    if (r.ver_pc) meta.push('ПК: ' + escH(r.ver_pc));
    if (banned && parseInt(r.banned, 10) > 0) meta.push('до ' + adm46FmtWhen(r.banned));
    h += '<div class="adm-u-row">' +
      '<div class="adm-u-ava">' + ava + '</div>' +
      '<div class="adm-u-info"><b>' + escH(r.name || 'Без імені') + chips + '</b>' +
      '<span class="adm-u-mail">' + escH(r.email || '—') + '</span>' +
      (meta.length ? '<span class="adm-u-meta">' + meta.join(' · ') + '</span>' : '') +
      '</div>' +
      '<div class="adm-u-btns">' +
      '<button type="button" data-act="' + (banned ? 'admuunban' : 'admuban') + '" data-u="' + escH(r.user_id) + '"' + (self ? ' disabled' : '') + '>' + (banned ? 'Розблокувати' : 'Заблокувати') + '</button>' +
      '<button type="button" class="adm-u-del" data-act="admudel" data-u="' + escH(r.user_id) + '" data-e="' + escH(r.email || '') + '"' + (self ? ' disabled' : '') + '>Видалити</button>' +
      '</div></div>';
  });
  box.innerHTML = h;
}

function adm46BanDialog(uid) {
  admModal(
    '<h3 class="adm-h">Блокування акаунта</h3>' +
    '<div class="adm-u-dim">Користувач побачить вікно з причиною і часом розблокування.</div>' +
    '<input class="adm-inp" id="adm46r" type="text" maxlength="120" placeholder="Причина (необов\'язково)">' +
    '<div class="adm46-durs">' +
    '<label><input type="radio" name="adm46d" value="-1"><span>Назавжди</span></label>' +
    '<label><input type="radio" name="adm46d" value="600" checked><span>10 хв</span></label>' +
    '<label><input type="radio" name="adm46d" value="1800"><span>30 хв</span></label>' +
    '<label><input type="radio" name="adm46d" value="3600"><span>1 год</span></label>' +
    '<label><input type="radio" name="adm46d" value="21600"><span>6 год</span></label>' +
    '<label><input type="radio" name="adm46d" value="86400"><span>1 день</span></label>' +
    '<label><input type="radio" name="adm46d" value="259200"><span>3 дні</span></label>' +
    '<label><input type="radio" name="adm46d" value="604800"><span>7 днів</span></label>' +
    '<label><input type="radio" name="adm46d" value="custom"><span>Свій час</span></label>' +
    '</div>' +
    '<div class="adm46-custom"><input id="adm46cn" type="number" min="1" max="3650" value="1"><select id="adm46cu"><option value="60">хвилин</option><option value="3600">годин</option><option value="86400" selected>днів</option></select></div>' +
    '<div class="adm46-act"><button class="adm-abtn" data-act="admubango" data-u="' + escH(uid) + '" type="button">Заблокувати</button>' +
    '<button class="adm-abtn adm-abtn2" data-act="mclose" type="button">Скасувати</button></div>'
  );
}
function adm46DelDialog(uid, email) {
  admModal(
    '<h3 class="adm-h">Видалити акаунт повністю?</h3>' +
    '<div class="adm-u-dim">Акаунт <b>' + escH(email || uid) + '</b> буде видалено з бази даних ПОВНІСТЮ: ' +
    'користувача викине з програми, його налаштування і профіль зникнуть. Повторний вхід створить новий акаунт.</div>' +
    '<div class="adm46-act"><button class="adm-abtn adm-u-delbtn" data-act="admudelgo" data-u="' + escH(uid) + '" type="button">Видалити назавжди</button>' +
    '<button class="adm-abtn adm-abtn2" data-act="mclose" type="button">Скасувати</button></div>'
  );
}

function adm46DoBan(uid, untilMs, reason) {
  const fin = function (ok, what) {
    if (ok) { try { evUser('ban', uid); } catch (eEv47) {} toast('Акаунт заблоковано ✓'); try { admModalClose(); } catch (eM) {} adm46UsersOpen(); }
    else toast(what || 'Не вдалося заблокувати — спробуй ще раз');
  };
  if (window.FH_WEB) {
    
    adm46Write('update/admban/' + adm46Uid(uid), { b: untilMs, r: String(reason || ''), t: Date.now() }, function (ok1) {
      if (!ok1) { fin(false); return; }
      adm46Read('update/users/' + adm46Uid(uid), function (u) {
        const node = (u && typeof u === 'object') ? u : {};
        node.b = untilMs; node.br = String(reason || ''); node.ts = Date.now();
        adm46Write('update/users/' + adm46Uid(uid), node, function (ok2) { fin(true); });
      });
    });
    return;
  }
  cfExec('UPDATE users SET banned=?, ban_reason=? WHERE user_id=?', [untilMs, String(reason || ''), uid], function (w) {
    if (w === null) { fin(false); return; }
    cfExec('SELECT banned FROM users WHERE user_id=?', [uid], function (rows) {
      if (!(rows && rows[0] && parseInt(rows[0].banned, 10) === untilMs)) { fin(false, 'База не підтвердила блокування'); return; }
      adm46Write('update/admban/' + adm46Uid(uid), { b: untilMs, r: String(reason || ''), t: Date.now() }, function () {
        

        adm46Read('update/users/' + adm46Uid(uid), function (u46) {
          const node46 = (u46 && typeof u46 === 'object') ? u46 : {};
          node46.b = untilMs; node46.br = String(reason || ''); node46.ts = Date.now();
          adm46Write('update/users/' + adm46Uid(uid), node46, function () { fin(true); });
        });
      });
    });
  }, 15000);
}
function adm46DoUnban(uid) {
  const fin = function (ok) {
    if (ok) { try { evUser('unban', uid); } catch (eEv47) {} toast('Акаунт розблоковано ✓'); adm46UsersOpen(); }
    else toast('Не вдалося розблокувати — спробуй ще раз');
  };
  if (window.FH_WEB) {
    adm46Write('update/admban/' + adm46Uid(uid), null, function (ok1) {
      adm46Read('update/users/' + adm46Uid(uid), function (u) {
        const node = (u && typeof u === 'object') ? u : null;
        if (node) { node.b = 0; node.br = ''; node.ts = Date.now(); }
        adm46Write('update/users/' + adm46Uid(uid), node, function () { fin(true); });
      });
    });
    return;
  }
  cfExec('UPDATE users SET banned=0, ban_reason=\'\' WHERE user_id=?', [uid], function (w) {
    if (w === null) { fin(false); return; }
    adm46Write('update/admban/' + adm46Uid(uid), null, function () {
      adm46Read('update/users/' + adm46Uid(uid), function (u46) {
        const node46 = (u46 && typeof u46 === 'object') ? u46 : {};
        node46.b = 0; node46.br = ''; node46.ts = Date.now();
        adm46Write('update/users/' + adm46Uid(uid), node46, function () { fin(true); });
      });
    });
  }, 15000);
}
function adm46DoDel(uid) {
  const fin = function (ok) {
    if (ok) { try { evUser('kick', uid); } catch (eEv47) {} toast('Акаунт видалено з бази ✓'); try { admModalClose(); } catch (eM) {} adm46UsersOpen(); }
    else toast('Не вдалося видалити — спробуй ще раз');
  };
  if (window.FH_WEB) {
    

    adm46Write('update/admdel/' + adm46Uid(uid), 1, function (ok1) {
      adm46Write('update/users/' + adm46Uid(uid), null);
      adm46Write('update/web/' + adm46Uid(uid), null);
      adm46Write('update/settings_mirror/' + adm46Uid(uid), null);
      adm46Write('update/websts/' + adm46Uid(uid), null);
      fin(!!ok1);
    });
    return;
  }
  cfExec('DELETE FROM users WHERE user_id=?', [uid], function (w1) {
    if (w1 === null) { fin(false); return; }
    cfExec('DELETE FROM device WHERE user_id=?', [uid], function (w2) {
      if (w2 === null) { fin(false); return; }
      cfExec('SELECT user_id FROM users WHERE user_id=?', [uid], function (rows) {
        if (rows === null) { fin(false); return; }
        if (rows && rows[0]) { fin(false, 'База не підтвердила видалення'); return; }
        
        adm46Write('update/users/' + adm46Uid(uid), null);
        adm46Write('update/web/' + adm46Uid(uid), null);
        adm46Write('update/settings_mirror/' + adm46Uid(uid), null);
        adm46Write('update/websts/' + adm46Uid(uid), null);
        adm46Write('update/admdel/' + adm46Uid(uid), 1, function () { fin(true); });
      });
    }, 15000);
  }, 15000);
}

document.addEventListener('click', function (ev) {
  const el = (ev.target && ev.target.closest) ? ev.target.closest('[data-act^="admu"]') : null;
  if (!el) return;
  const a = el.getAttribute('data-act');
  const uid = el.getAttribute('data-u') || '';
  if (a === 'admurefresh') { adm46UsersOpen(); return; }
  if (a === 'admuban') { ev.stopPropagation(); adm46BanDialog(uid); return; }
  if (a === 'admuunban') { ev.stopPropagation(); adm46DoUnban(uid); return; }
  if (a === 'admudel') { ev.stopPropagation(); adm46DelDialog(uid, el.getAttribute('data-e') || ''); return; }
  if (a === 'admubango') {
    ev.stopPropagation();
    let sec = 0;
    let sel = null;
    try { sel = document.querySelector('input[name="adm46d"]:checked'); } catch (eQ) {}
    const v = sel ? sel.value : '600';
    if (v === 'custom') {
      const n = parseInt((document.getElementById('adm46cn') || {}).value, 10) || 0;
      const u = parseInt((document.getElementById('adm46cu') || {}).value, 10) || 60;
      sec = Math.max(1, n) * u;
    } else sec = parseInt(v, 10);
    if (sec === -1) adm46DoBan(uid, -1, (document.getElementById('adm46r') || {}).value || '');
    else if (sec > 0) adm46DoBan(uid, Date.now() + sec * 1000, (document.getElementById('adm46r') || {}).value || '');
    else toast('Вкажи тривалість блокування');
    return;
  }
  if (a === 'admudelgo') { ev.stopPropagation(); adm46DoDel(uid); return; }
}, true);

if (!window.__adm46tick) {
  window.__adm46tick = 1;
  setInterval(function () { if (ACC.user) { try { adm46Check('tick'); } catch (e46T) {} } }, 300000);
}










let dlMode = false, dlFinishing = false, dlStart = 0;
function showDataLoad(t1) {
  try {
    const b = byId('boot');
    if (!b) return;
    const nm = b.querySelector('.bt-name');
    


    if (nm) nm.textContent = 'FluxHelper';
    if (b.classList.contains('hidden') || b.classList.contains('off')) {
      
      b.classList.remove('hidden'); b.classList.remove('off');
      if (bootP >= 100) bootP = 0;
      bootRevealed = false;
    }
    if (!dlMode) { dlMode = true; dlStart = Date.now(); }
    dlFinishing = false;
    
    const f0 = b.querySelector('#btFill'), p0 = b.querySelector('#btPct');
    if (f0 && bootP >= 100) f0.style.width = '0%';
    if (p0 && bootP >= 100) p0.textContent = '0%';
    bootRaf(bootLoop);          
  } catch (e) {}
}
function hideDataLoad() { try { dlFinishing = true; } catch (e) {} }   



function dlSafety() { setTimeout(function () { dlFinishing = true; }, 20000); }














var fhSettling = false;      
var fhPendingMaster = false; 
var dataVerified = false;    
let settleRetryT = 0, settleRetryN = 0, settleFailed = false;
const SETTLE_ERR_TXT = 'Не вдалося завантажити дані акаунта — перевір інтернет і спробуй ще раз.';
function settleFailGate() {
  if (!ACC.user || dataVerified) return;
  settleFailed = true;
  dlMode = false;
  dlFinishing = true;
}
function settleRetryStart() {
  if (!ACC.user) return;
  clearTimeout(settleRetryT);
  settleRetryN = 0;
  const tick = function () {
    if (!ACC.user || dataVerified) return;
    syncPull(false, function (dec) {
      if (!ACC.user || dataVerified) return;
      if (dec === 'ok' || dec === 'master') {
        dataVerified = true;
        settleFailed = false;
        try { adm46Check('settle'); } catch (eA46) {}
        settleDecide(dec);
        return;
      }
      if (++settleRetryN <= 6) settleRetryT = setTimeout(tick, 5000);
      else settleFailGate();
    });
  };
  settleRetryT = setTimeout(tick, 5000);
}
function settleSync(cb) {
  fhSettling = true;
  let attempt = 0, done = false;
  const t0 = Date.now();
  const fin = function (dec) {
    if (done) return;
    done = true;
    fhSettling = false;
    if (!ACC.user) { cb('offline'); return; }
    if (dec !== 'offline') {
      dataVerified = true;
      settleFailed = false;
      try { adm46Check('settle'); } catch (eA46) {}
      cb(dec);
      if (fhPendingMaster && dec !== 'master' && validS(S)) {
        try { openGroups(); } catch (eOG) {}
      }
      fhPendingMaster = false;
      return;
    }
    /* офлайн: локальні дані лишааються, майстер груп НЕ відкривається */
    if (S || paccRestore()) {
      dataVerified = true;
      try { adm46Check('settle'); } catch (eA46b) {}
      cb('offline');
      return;
    }
    /* локальних даних нема — лишаємо лоадер і тихо доганяємо базу у фоні */
    try { settleRetryStart(); } catch (eSR) {}
  };
  const go = function () {
    if (!ACC.user) { fin('offline'); return; }
    if (done) return;
    if (Date.now() - t0 > 15000) { fin('offline'); return; }
    syncPull(true, function (dec) {
      if (dec === 'offline' && attempt < 2 && ACC.user) {
        attempt += 1;
        setTimeout(go, 1400);
        return;
      }
      fin(dec);
    });
  };
  go();
}

function fbAuthRegister(tok, cb) {
  try {
    if (!tok || String(tok).length < 10) { if (cb) cb(null); return; }
    const fr = document.createElement('iframe');
    fr.style.cssText = 'position:fixed;width:1px;height:1px;left:-9px;top:-9px;opacity:0;border:0';
    fr.setAttribute('aria-hidden', 'true');
    let done = false;
    const fin = function (fid) {
      if (done) return; done = true;
      try { fr.remove(); } catch (e) {}
      try { window.removeEventListener('message', onMsg); } catch (e2) {}
      if (cb) cb(fid || null);
    };
    const onMsg = function (ev) {
      try {
        const d = ev && ev.data;
        if (d && d.__fhFb) fin(d.__fhFb.ok ? (d.__fhFb.localId || null) : null);
      } catch (e) {}
    };
    window.addEventListener('message', onMsg);
    fr.src = 'https://fluxhelper.pages.dev/fbauth.html#t=' + encodeURIComponent(String(tok));
    document.body.appendChild(fr);
    setTimeout(function () { fin(null); }, 15000);
  } catch (e) { if (cb) cb(null); }
}

function ensureFid(cb) {
  if (!ACC.user || ACC.user.fid) { if (cb) cb(); return; }
  healFid(function () {
    if (!ACC.user || ACC.user.fid) { if (cb) cb(); return; }
    if (ACC.user.tok) {
      fbAuthRegister(ACC.user.tok, function (fid) {
        if (fid && ACC.user && !ACC.user.fid) {
          ACC.user.fid = String(fid);
          if (ANDROID) { try { localStorage.setItem('fh_user', JSON.stringify(ACC.user)); } catch (e) {} }
        }
        if (cb) cb();
      });
    } else if (cb) cb();
  });
}
function authAccept(u, fromHost) {
  if (!u || !u.sub) return;
  ACC.user = u;
  


  if (ANDROID) { try { localStorage.setItem('fh_user', JSON.stringify(u)); } catch (e) {} }
  





  if (!ANDROID && !fromHost) {
    try {
      host('fh:authsave|' + encodeURIComponent(JSON.stringify({
        sub: String(u.sub), name: String(u.name || ''), email: String(u.email || ''),
        picture: String(u.pic || ''), fid: String(u.fid || ''), tok: String(u.tok || '')
      })));
    } catch (eA0) {}
  }
  clearTimeout(agT);
  clearTimeout(authPollT);
  agState = '';
  try { localStorage.removeItem('fh_auth_state'); } catch (e) {}
  authReady = true;
  usersUpsert(u);
  gateHide(); gateLock(false);
  refreshAccUI();
  




  showDataLoad('Завантаження…', 'перевіряємо акаунт у базі');
  dlSafety();
  settleSync(function (dec) {
    if (!ACC.user) return;
    settleDecide(dec);
    refreshAccUI();
    try { if (window.FH_WEB && typeof window.__fhHashApply === 'function') window.__fhHashApply(); } catch (eHA2) {}
  });
  const rk = userKey(ACC.user);
  



  (function roleFast(n, sub0) {
    if (!rk || !ACC.user || ACC.user.sub !== sub0) return;
    cfExec('SELECT role, sync FROM users WHERE user_id=?', [rk], function (rows) {
      if (!ACC.user || ACC.user.sub !== sub0) return;
      if (rows && rows[0]) { accApplyAuth(rows); }
      else if (rows === null && n < 4) { setTimeout(function () { roleFast(n + 1, sub0); }, 2200); }
    });
  })(0, u.sub);
  
  
  if (u.tok && !u.fid) {
    





    ensureFid(function () {
      if (!ACC.user || ACC.user.fid || ACC.user.sub !== u.sub) return;
      usersUpsert(ACC.user, function () {
        if (!ACC.user || ACC.user.sub !== u.sub) return;
        syncPull(false);
        fetchRole(userKey(ACC.user), function (rows) { if (ACC.user) accApplyAuth(rows); });
      });
    });
  }
  

  syncWatchStart();     
  if (typeof evalPendUpd === 'function') evalPendUpd();
  toast('Вітаємо, ' + (u.name || 'друже') + '!');
}
function authLogout() {
  
  paccSave();   
  ACC.user = null; ACC.role = 'user'; ACC.sync = true;
  syncWatchStop();   
  
  
  
  try {
    localStorage.removeItem('fh_user');
    localStorage.removeItem('fh_auth_state');
    localStorage.removeItem('fh_sync_ts');
    localStorage.removeItem('fh_sync');
  } catch (e) {}
  cleanLocalGroups();   
  



  paccClearActive();
  reloadLocalSettings();
  NOTIF.on = false; saveNotif();          
  try { refreshNotifUI(); refreshZoomUI(); } catch (e) {}
  try { pushNotifSched(true); } catch (e2) {}   
  syncLastTs = 0;
  clearTimeout(syncT);
  clearTimeout(authPollT);
  agState = '';
  authReady = false;
  refreshAccUI(); applyDevVis();
  
  
  
  
  
  
  
  gateStart();
  
  
  
  
  
  
  host('fh:logout');
}











function resetAccountSettings() {
  
  if (!ACC.user) return;
  const k = userKey(ACC.user);
  if (!k) { toast('Акаунт ще синхронізується — спробуй за кілька секунд'); return; }
  let snap = null;
  try { snap = JSON.parse(defaultSettings()); } catch (eDS) { snap = null; }
  if (!snap || typeof snap !== 'object') snap = { g: {}, n: { on: true, min: 5, snd: true }, z: 'app', th: 'standard', t: Date.now(), v: APP_VER, sync: 1 };
  snap.rs = 1;
  snap.t = Date.now();
  const now = Date.now();
  cfExec('UPDATE users SET settings=?, sver=?, sts=? WHERE user_id=?', [JSON.stringify(snap), APP_VER, now, k], null);
  try { localStorage.removeItem(paccKey()); } catch (e1) {}   
  cleanLocalGroups();
  paccClearActive();
  reloadLocalSettings();
  NOTIF = { on: true, min: 5, snd: true, off: false };   
  saveNotif();
  try { refreshNotifUI(); refreshZoomUI(); } catch (e2) {}
  syncLastTs = 0;          
  clearTimeout(syncT);     
  try { pushNotifSched(true); } catch (e3) {}
  AUTO_SETUP = true;
  showMain(true);
  openGroups();
  try { render(false); } catch (e4) {}
  refreshAccUI();
  toast('Налаштування акаунта скинуто — виберіть групи заново');
}




function healFid(cb) {
  if (!ACC.user || ACC.user.fid || !ACC.user.email) { if (cb) cb(); return; }
  cfExec('SELECT user_id FROM users WHERE email=? LIMIT 1', [String(ACC.user.email)], function (rows) {
    if (rows && rows[0] && rows[0].user_id) {
      const k = String(rows[0].user_id);
      if (k.length >= 20 && k.indexOf('g:') !== 0 && k !== String(ACC.user.sub || '')) {
        ACC.user.fid = k;
        if (ANDROID) { try { localStorage.setItem('fh_user', JSON.stringify(ACC.user)); } catch (e) {} }
      }
    }
    if (cb) cb();
  });
}
function accBoot() {
  refreshAccUI(); applyDevVis();
  if (ACC.user) {
    




    gateHide();
    authReady = true;
    gateLock(false);
    
    healFid(function () {
      
      const k = userKey(ACC.user);
      if (!k) {
        


        ensureFid(function () {
          if (!ACC.user) return;
          const k2 = userKey(ACC.user);
          if (!k2) {
            
            
            hideDataLoad();
            dataVerified = true;
            try { revealNow(); } catch (eRV0) {}
            return;
          }
          
          fetchRole(k2, function (rows) {
            if (!ACC.user) return;
            if (rows && rows[0]) {
              accApplyAuth(rows);
              fhRowSeen(k2);   
              usersUpsert(ACC.user);
              settleSync(settleDecide);
              syncWatchStart();
            } else if (rows) {
              

              if (fhRowKnown(k2)) {
                hideDataLoad();
                confirmAccountGone();   
              } else {
                usersUpsert(ACC.user, function () { if (ACC.user) settleSync(settleDecide); });
                syncWatchStart();
              }
            } else {
              settleSync(settleDecide);   
            }
          });
        });
        return;
      }
      


      


      fetchRole(k, function (rows) {
        if (!ACC.user) return;
        if (rows && rows[0]) {
          accApplyAuth(rows);
          fhRowSeen(k);   
          usersUpsert(ACC.user);
          

          settleSync(settleDecide);
          syncWatchStart();   
        } else if (rows) {
          

          if (fhRowKnown(k)) {
            hideDataLoad();
            confirmAccountGone();   
          } else {
            usersUpsert(ACC.user, function () { if (ACC.user) settleSync(settleDecide); });
            syncWatchStart();
          }
        } else {
          
          
          settleSync(settleDecide);
        }
      });
    });
  } else {
    





    bootReady = true;
    gateStart();
  }
}




setTimeout(function () {
  try {
    if (!bootReady && !(ACC.user && !dataVerified)) bootReady = true;
  } catch (eWD) {}
}, 9500);




function settleDecide(dec) {
  hideDataLoad();
  if (!ACC.user) return;
  if (dec === 'master')        { showMain(true); AUTO_SETUP = true; openGroups(); render(false); }
  else if (dec === 'ok')       { showMain(); render(); }
  else if (S || paccRestore()) { showMain(); render(); }
  else                         { showMain(true); AUTO_SETUP = true; openGroups(); render(false); }
  try { if (window.FH_WEB && typeof window.__fhHashApply === 'function') window.__fhHashApply(); } catch (eHA) {}
  try { guardGroups(); } catch (eGGD) {}
}

function guardGroups() {
  try {
    if (!ACC.user || !ACC.user.sub) return;
    if (typeof dataVerified === 'undefined' || !dataVerified) return;
    if (typeof fhSettling !== 'undefined' && fhSettling) return;
    if (validS(S)) return;
    if (groupsOpen()) return;
    if (typeof updOpen === 'function' && updOpen()) return;
    const neG = byId('neterr');
    if (neG && !neG.classList.contains('hidden')) return;
    AUTO_SETUP = true;
    openGroups();
  } catch (eGG) {}
}
setInterval(guardGroups, 3000);   






function forceAccountGone(quiet) {
  if (!ACC.user) return;
  paccSave();   
  ACC.user = null; ACC.role = 'user'; ACC.sync = true;
  syncWatchStop();
  try {
    localStorage.removeItem('fh_user');
    localStorage.removeItem('fh_auth_state');
    localStorage.removeItem('fh_sync_ts');
    localStorage.removeItem('fh_sync');
  } catch (e) {}
  cleanLocalGroups();
  paccClearActive();       
  reloadLocalSettings();
  NOTIF.on = false; saveNotif();
  try { refreshNotifUI(); refreshZoomUI(); } catch (e) {}
  try { pushNotifSched(true); } catch (e2) {}
  syncLastTs = 0;
  clearTimeout(syncT); clearTimeout(authPollT);
  agState = ''; authReady = false;
  refreshAccUI(); applyDevVis();
  gateAccountGone = !quiet;   
  gateStart();
  

  try { localStorage.setItem('fh_gone_msg', '1'); } catch (e) {}
  host('fh:logout');          
}


let goneChkT = 0;
function confirmAccountGone() {
  if (!ACC.user) return;
  



  if (!fhRowKnown(userKey(ACC.user))) {
    if (ACC.user.fid) usersUpsert(ACC.user, null);   
    return;
  }
  clearTimeout(goneChkT);
  goneChkT = setTimeout(function () {
    const k = userKey(ACC.user); if (!k) return;
    cfExec('SELECT user_id FROM users WHERE user_id=?', [k], function (rows) {
      if (ACC.user && rows && !rows[0]) forceAccountGone(false);
    });
  }, 3000);
}


function avaHtml(u) {
  if (u && u.pic) return '<img src="' + escH(u.pic) + '" referrerpolicy="no-referrer" alt="">';
  return escH(((u && u.name) || '?').charAt(0).toUpperCase());
}
function refreshAccUI() {
  
  const tAcc = byId('tbAcc'); if (tAcc) tAcc.style.display = ACC.user ? 'flex' : 'none';
  const tAva = byId('tbAccAva'); if (tAva) tAva.innerHTML = ACC.user ? avaHtml(ACC.user) : '';
  const tNm = byId('tbAccName'); if (tNm) tNm.textContent = ACC.user ? (ACC.user.name || 'акаунт') : '—';
  const tMl = byId('tbAccMail'); if (tMl) tMl.textContent = ACC.user ? (ACC.user.email || '') : '';
  const big = byId('acAva'); if (big) big.innerHTML = ACC.user ? avaHtml(ACC.user) : '?';
  const nm = byId('acName'); if (nm) nm.textContent = ACC.user ? ACC.user.name : '—';
  const ml = byId('acMail'); if (ml) ml.textContent = ACC.user ? (ACC.user.email || '') : '';
  const rl = byId('acRole');
  if (rl) { const r = ACC.role; rl.textContent = ROLEL[r] || r; rl.className = 'ac-role r-' + r; }
  const sc = byId('acSync'); if (sc) sc.checked = !!ACC.sync;
  

  const rb = byId('rowBeta');
  if (rb) {
    const showB = !!ACC.user && staff();
    rb.classList.toggle('hidden', !showB);
    const abv = byId('acBeta');
    if (abv && showB) { abv.checked = !!BETA.on; }   
  }
  

  try { document.body.classList.toggle('fh-beta', FH_BETA()); } catch (eFB) {}
  
  const sV = byId('acStVer'); if (sV) sV.textContent = verLabel();
  const sD = byId('acStDev'); if (sD) { try { const dl = deviceLabel(); sD.textContent = dl.name; const di = byId('acDevIc'); if (di) { di.innerHTML = dl.ic; di.style.background = dl.tile || ''; } } catch (eAc) { sD.textContent = '\u2014'; } }
  const sS = byId('acStSync');
  if (sS) {
    if (!syncLastTs) sS.textContent = 'ще не було';
    else {
      const dm = Math.max(0, Math.floor((Date.now() - syncLastTs) / 60000));
      sS.textContent = dm < 1 ? 'щойно' : (dm < 60 ? dm + ' хв тому' : (dm < 1440 ? Math.floor(dm / 60) + ' год тому' : Math.floor(dm / 1440) + ' дн тому'));
    }
  }
  
  
  
  const c2 = byId('ac2Card'); if (c2 && c2.parentNode) c2.parentNode.removeChild(c2);
}
function showAcc() {
  if (!ACC.user) { gateStart(); return; }
  closeDrawer();
  byId('vMain').classList.add('hidden');
  byId('vSetup').classList.add('hidden');
  const _vd3 = byId('vAdmin'); if (_vd3) _vd3.classList.add('hidden');   
  document.body.setAttribute('data-view', 'acc');
  const v = byId('vAcc'); if (v) { v.classList.remove('hidden'); v.scrollTop = 0; }
  
  
  
  
  setSeg('acc');
  markNav('acc');
  refreshAccUI();   
}






function syncUp(now) {
  if (!ACC.user) return;
  clearTimeout(syncT);
  syncT = setTimeout(function () {
    if (!ACC.user) return;
    const g = {};
    for (const ok in OLDKEY) if (S && (S[OLDKEY[ok]] === 1 || S[OLDKEY[ok]] === 2)) g[ok] = S[OLDKEY[ok]];
    
    
    

    

    const p = { g: g, n: { on: !!NOTIF.on, min: NOTIF.min, snd: !!NOTIF.snd, off: !!NOTIF.off }, z: (typeof ZOOM !== 'undefined' && ZOOM.mode) ? ZOOM.mode : 'app', th: (typeof THEME !== 'undefined') ? THEME : '', cf: CONFIRM.on ? 1 : 0, bt: BETA.on ? 1 : 0, t: Date.now(), v: APP_VER, sync: ACC.sync ? 1 : 0, r: (ACC.role === 'admin' || ACC.role === 'developer') ? ACC.role : 'user' };
    const k = userKey(ACC.user);
    if (!k) return;   
    
    cfExec('INSERT INTO users (user_id, settings, sver, sts, email, name, pic, ts) VALUES (?,?,?,?,?,?,?,?) ' +
           'ON CONFLICT(user_id) DO UPDATE SET settings=excluded.settings, sver=excluded.sver, sts=excluded.sts, ' +
           'email=excluded.email, name=excluded.name, pic=excluded.pic, ts=excluded.ts',
           [k, JSON.stringify(p), APP_VER, p.t, (ACC.user.email || ''), (ACC.user.name || ''), (ACC.user.pic || ''), Date.now()], function (rows) {
      if (rows) {
        syncLastTs = p.t; try { localStorage.setItem('fh_sync_ts', String(p.t)); } catch (e) {}
        



        try { dbPut('update/web/' + k, p, null); } catch (eWM3) {}
        

        try { dbPut('update/websts/' + k, p.t, null); } catch (eWM4) {}
        deviceWrite();   
      } else {
        
        try {
          dbPut('/update/settings_mirror/' + fbEnc(k.replace(/[^A-Za-z0-9_-]/g, '_')),
                { d: { fid: k, settings: JSON.stringify(p), v: APP_VER }, t: p.t }, null);
        } catch (e3) {}
      }
    });
  }, now ? 30 : 350);   
                        
}
function syncApply(p, force) {
  if (!p || typeof p !== 'object' || !ACC.user) return;
  if (!ACC.sync && !force) return;
  const t = parseInt(p.t, 10) || 0;
  
  
  if (!t || (!force && t < syncLastTs)) return;
  let ch = false, gok = false;
  if (p.g && typeof p.g === 'object') {
    const m = {};
    for (const ok in OLDKEY) { const v = p.g[ok]; if (v === 1 || v === 2) m[OLDKEY[ok]] = v; }
    if (validS(m)) {
      if (JSON.stringify(m) !== JSON.stringify(S || {})) {
        S = m;
        try { localStorage.setItem('fh_groups2', JSON.stringify(S)); } catch (e) {}
        try { localStorage.setItem('fh_groups', JSON.stringify(oldKeyMap(S))); } catch (e2) {}
        FIRST = false; ch = true;
      } else if (FIRST) {
        
        FIRST = false;
      }
      gok = true;
    }
  }
  if (p.n && typeof p.n === 'object') {
    const on = !!p.n.on, mn = (p.n.min >= 1 && p.n.min <= 15) ? p.n.min : 5, sd = (p.n.snd !== false), of = !!p.n.off;
    if (on !== NOTIF.on || mn !== NOTIF.min || sd !== !!NOTIF.snd || of !== !!NOTIF.off) { NOTIF = { on: on, min: mn, snd: sd, off: of }; saveNotif(); refreshNotifUI(); ch = true; }
  }
  if ((p.z === 'app' || p.z === 'web') && typeof ZOOM !== 'undefined' && p.z !== ZOOM.mode) { ZOOM.mode = p.z; saveZoom(); refreshZoomUI(); ch = true; }
  

  if (typeof p.cf !== 'undefined') {
    const cfv = (p.cf === 1 || p.cf === true || p.cf === '1');
    if (cfv !== CONFIRM.on) { CONFIRM.on = cfv; saveConfirm(); ch = true; }
  }
  if (typeof p.bt !== 'undefined' && staff()) {
    const btv = (p.bt === 1 || p.bt === true || p.bt === '1');
    if (btv !== BETA.on) { BETA.on = btv; saveBeta(); ch = true; }
  }
  


  if (typeof p.sync !== 'undefined') {
    const sv = !(p.sync === 0 || p.sync === false || p.sync === '0');
    if (sv !== ACC.sync) {
      ACC.sync = sv;
      try { localStorage.setItem('fh_sync', sv ? '1' : '0'); } catch (eSY5) {}
      const sc5 = byId('acSync'); if (sc5) sc5.checked = sv;
      refreshAccUI(); ch = true;
    }
  }
  
  if (p.th && typeof THEME !== 'undefined' && THEME_LIST.indexOf(p.th) >= 0 && p.th !== THEME) { applyTheme(p.th, false); ch = true; }
  if (t > syncLastTs) syncLastTs = t;   
  try { localStorage.setItem('fh_sync_ts', String(syncLastTs)); } catch (e) {}
  
  
  
  if (gok && !FIRST && groupsOpen() && typeof AUTO_SETUP !== 'undefined' && AUTO_SETUP) { closeGroups(); AUTO_SETUP = false; }
  



  if (p.rs === 1 && !cloudGroupsOk(p)) {
    if (S || !FIRST) cleanLocalGroups();   
    if (!groupsOpen()) {
      AUTO_SETUP = true;
      try { showMain(true); } catch (eRS) {}
      try { openGroups(); } catch (eRS2) {}
      try { render(false); } catch (eRS3) {}
    }
  }
  if (ch) {
    pushNotifSched(true); render(false); if (setupOpen) buildSummary();   
    
  }
}






function cleanLocalGroups() {
  S = null; FIRST = true;
  try { localStorage.removeItem('fh_groups2'); } catch (e) {}
  try { localStorage.removeItem('fh_groups'); } catch (e2) {}
}
function cloudGroupsOk(p) {
  if (!p || !p.g || typeof p.g !== 'object') return false;
  const m = {};
  for (const ok in OLDKEY) { const v = p.g[ok]; if (v === 1 || v === 2) m[OLDKEY[ok]] = v; }
  return validS(m);
}









const PSET_KEYS = ['fh_groups2', 'fh_groups', 'fh_notif', 'fh_zoom', 'fh_theme', 'fh_sync_ts', 'fh_confirm', 'fh_beta'];
function paccKey() {
  const k = (typeof userKey === 'function' && ACC.user) ? userKey(ACC.user) : '';
  return k ? ('fh_pacc_' + k) : '';
}
function paccSave() {                       
  const ck = paccKey(); if (!ck) return;
  const snap = { _t: Date.now() };
  PSET_KEYS.forEach(function (k) { try { const v = localStorage.getItem(k); if (v !== null) snap[k] = v; } catch (e) {} });
  try { localStorage.setItem(ck, JSON.stringify(snap)); } catch (e) {}
}
function paccClearActive() {                
  PSET_KEYS.forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
}
function reloadLocalSettings() {            
  try { S = JSON.parse(localStorage.getItem('fh_groups2') || 'null'); } catch (e) { S = null; }
  FIRST = !S;
  NOTIF = { on: true, min: 5, snd: true, off: false };
  try {
    const n = JSON.parse(localStorage.getItem('fh_notif') || 'null');
    if (n && typeof n === 'object') {
      if (typeof n.on === 'boolean') NOTIF.on = n.on;
      if (typeof n.min === 'number' && n.min >= 1 && n.min <= 15) NOTIF.min = n.min;
      if (typeof n.snd === 'boolean') NOTIF.snd = n.snd;
      if (typeof n.off === 'boolean') NOTIF.off = n.off;
    }
  } catch (e) {}
  ZOOM = { mode: 'app' };
  try {
    const z = JSON.parse(localStorage.getItem('fh_zoom') || 'null');
    if (z && (z.mode === 'app' || z.mode === 'web')) ZOOM.mode = z.mode;
  } catch (e) {}
  THEME = 'standard';
  try { const t0 = localStorage.getItem('fh_theme'); if (THEME_LIST.indexOf(t0) >= 0) THEME = t0; } catch (e) {}
  
  CONFIRM = { on: false };
  try { CONFIRM.on = localStorage.getItem('fh_confirm') === '1'; } catch (eC2) {}
  BETA = { on: false };
  try { BETA.on = localStorage.getItem('fh_beta') === '1'; } catch (eB2) {}
  try { if (typeof refreshZoomUI === 'function') refreshZoomUI(); } catch (eZ2) {}
  syncLastTs = 0;
  try { syncLastTs = parseInt(localStorage.getItem('fh_sync_ts'), 10) || 0; } catch (e) {}
  try { if (typeof applyTheme === 'function') applyTheme(THEME, false); } catch (e) {}
  try { saveNotif(); } catch (e) {}
}
function paccRestore() {                    
  const ck = paccKey(); if (!ck) return false;
  let s = null;
  try { s = JSON.parse(localStorage.getItem(ck) || 'null'); } catch (e) {}
  if (!s || typeof s !== 'object') return false;
  let any = false;
  PSET_KEYS.forEach(function (k) { if (s[k] !== undefined && s[k] !== null) { try { localStorage.setItem(k, String(s[k])); any = true; } catch (e) {} } });
  if (any) reloadLocalSettings();
  return any;
}



function betaAllowed() {
  if (!ACC.user || !staff()) return false;
  return !!BETA.on;   
}



function fetchRole(k, cb, _n) {
  const n = _n || 0;
  if (!k) { if (cb) cb(null); return; }
  



  if (window.FH_WEB && typeof apiGetRow === 'function') {
    try {
      apiGetRow(function (row) { if (cb) cb(row ? [row] : null); });
    } catch (eW) { if (cb) cb(null); }
    return;
  }
  cfExec('SELECT role, sync FROM users WHERE user_id=?', [k], function (rows) {
    if (rows === null && n < 4 && ACC.user) { setTimeout(function () { fetchRole(k, cb, n + 1); }, 2200); return; }
    if (cb) cb(rows);
  });
}




function webMirrorPull(k, cb) {
  fetch(DB_URL + fbEnc('update/web/' + k) + '.json?cb=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (j) { if (cb) cb(j); });
}
function syncPull(force, cb, _try) {   
  if (!ACC.user) { if (cb) cb('offline'); return; }
  const k = userKey(ACC.user);
  if (!k) { if (cb) cb('offline'); return; }   
  const attempt = _try || 0;
  




  

  const runQuery = function (done) {
    if (window.FH_WEB && typeof apiGetRow === 'function') {
      try { apiGetRow(function (row) { done(row ? [row] : null); }); return; } catch (eW45) {}
    }
    cfExec('SELECT role, sync, settings, sts FROM users WHERE user_id=?', [k], done, 12000);
  };
  runQuery(function (rows) {
    if (!ACC.user) { if (cb) cb('offline'); return; }
    if (rows && rows[0]) { fhRowSeen(k); accApplyAuth(rows); }   
    



    if (rows === null && attempt < 2) {
      setTimeout(function () {
        if (ACC.user) syncPull(force, cb, attempt + 1);
        else if (cb) cb('offline');
      }, 1500);
      return;
    }
    if (rows && rows[0]) {
      let p = null;
      try { p = JSON.parse(rows[0].settings); } catch (e) {}
      if (cloudGroupsOk(p)) {
        syncApply(p, force);
        
        if (cb) cb('ok');
        else if (force && !FIRST && S && setupOpen) { showMain(); render(); }
      } else {
        
        
        webMirrorPull(k, function (mj) {
          if (!ACC.user) return;
          if (mj && typeof mj === 'object' && cloudGroupsOk(mj) && (parseInt(mj.t, 10) || 0) >= (parseInt((p && p.t), 10) || 0)) {
            syncApply(mj, force);
            if (cb) cb('ok'); else if (!FIRST && S) { showMain(); render(); }
            return;
          }
          cleanLocalGroups();
        


        if ((!p || p.rs !== 1) && paccRestore() && validS(S)) {   
          FIRST = false;
          try { if (groupsOpen()) closeGroups(); } catch (eCR) {}   
          if (cb) cb('ok'); else { showMain(); render(); }
        } else if (cb) cb('master');
        


        });
      }
    } else if (rows) {
      
      
      webMirrorPull(k, function (mj) {
        if (!ACC.user) return;
        if (mj && typeof mj === 'object' && cloudGroupsOk(mj)) {
          syncApply(mj, force);
          if (cb) cb('ok'); else { showMain(); render(); }
          return;
        }
        cleanLocalGroups();
      if (paccRestore() && validS(S)) {   
        FIRST = false;
        try { if (groupsOpen()) closeGroups(); } catch (eCR) {}   
        if (cb) cb('ok'); else { showMain(); render(); }
      } else if (cb) cb('master');
      
      });
    } else {
      
      
      webMirrorPull(k, function (mj) {
        if (!ACC.user) return;
        if (mj && typeof mj === 'object' && cloudGroupsOk(mj)) {
          syncApply(mj, force);
          if (cb) cb('ok'); else if (force && !FIRST && S && setupOpen) { showMain(); render(); }
          return;
        }
      
      
      if (paccRestore() && validS(S)) {
        FIRST = false;
        try { if (groupsOpen()) closeGroups(); } catch (eCR) {}
        if (cb) cb('ok'); else { showMain(); render(); }
      } else if (cb) cb('offline');
      
      });
    }
  });
}






let syncWatchT = 0;
function syncStsCheck(k) {
  if (!ACC.user || !k) return;
  


  const stsHandle = function (sts, known, ok) {
    if (!ACC.user) return;
    if (!ok) { stsViaD1(k); return; }
    if (!known) {
      if (fhRowKnown(k)) { confirmAccountGone(); }
      else { usersUpsert(ACC.user, null); }
      return;
    }
    fhRowSeen(k);
    const ts = parseInt(sts, 10) || 0;
    if (ts > syncLastTs && ACC.sync) {
      cfExec('SELECT settings FROM users WHERE user_id=?', [k], function (rows2) {
        if (rows2 && rows2[0] && ACC.user) { try { syncApply(JSON.parse(rows2[0].settings), false); } catch (e) {} }
      });
    }
  };
  const stsViaD1 = function (kk) {
    cfExec('SELECT sts FROM users WHERE user_id=?', [kk], function (rows) {
      if (!ACC.user) return;
      if (rows && !rows[0]) {
        if (fhRowKnown(kk)) { confirmAccountGone(); }
        else { usersUpsert(ACC.user, null); }
        return;
      }
      if (rows && rows[0]) fhRowSeen(kk);
      if (rows && rows[0]) {
        const ts = parseInt(rows[0].sts, 10) || 0;
        if (ts > syncLastTs && ACC.sync) {
          cfExec('SELECT settings FROM users WHERE user_id=?', [kk], function (rows2) {
            if (rows2 && rows2[0] && ACC.user) { try { syncApply(JSON.parse(rows2[0].settings), false); } catch (e) {} }
          });
        }
      }
    });
  };
  

  stsViaD1(k);
}

function syncStsCheckD1Legacy(k) {
  if (!ACC.user || !k) return;
  cfExec('SELECT sts FROM users WHERE user_id=?', [k], function (rows) {
    if (!ACC.user) return;
    


    if (rows && !rows[0]) {
      if (fhRowKnown(k)) { confirmAccountGone(); }
      else { usersUpsert(ACC.user, null); }
      return;
    }
    if (rows && rows[0]) fhRowSeen(k);   
    if (rows && rows[0]) {
      const ts = parseInt(rows[0].sts, 10) || 0;
      if (ts > syncLastTs && ACC.sync) {
        
        cfExec('SELECT settings FROM users WHERE user_id=?', [k], function (rows2) {
          if (rows2 && rows2[0] && ACC.user) { try { syncApply(JSON.parse(rows2[0].settings), false); } catch (e) {} }
        });
      }
    }
  });
}
function syncWatchStop() { clearTimeout(syncWatchT); syncWatchT = 0; }
function syncWatchTick() {
  

  if (ACC.user) { try { syncStsCheck(userKey(ACC.user)); } catch (eSW) {} }
}
function syncWatchStart() {
  syncWatchStop();
  if (ACC.user) { try { syncStsCheck(userKey(ACC.user)); } catch (eSW2) {} }
}



document.addEventListener('visibilitychange', function () {
  if (document.visibilityState !== 'visible') return;
  if (ACC.user) { try { clearTimeout(syncWatchT); syncWatchT = 0; syncWatchTick(); } catch (e) {} }
});


function applyDevVis() {
  const sa = byId('segAdmin'); if (sa) sa.style.display = (ACC.user && admStaff()) ? '' : 'none';   
}

function escH(s) {
  return String(s || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}



let nbanPoll = 0;
function notifPermOk() {
  if (!ANDROID) return true;
  try { return !!AndroidHost.hasNotifPerm(); } catch (e) { return true; }
}
function checkNban() {
  const b = byId('nban');
  if (!b) return;
  let off = false;
  try { off = localStorage.getItem('fh_nban') === 'off'; } catch (e) {}
  b.classList.toggle('hidden', !ANDROID || FIRST || off || notifPermOk());
}
function pollNotifPerm() {
  clearInterval(nbanPoll);
  let n = 0;
  nbanPoll = setInterval(function () {
    if (++n > 15 || notifPermOk()) {
      clearInterval(nbanPoll);
      if (notifPermOk()) {
        const b = byId('nban'); if (b) b.classList.add('hidden');
        pushNotifSched();
        toast('Сповіщення увімкнено ✓');
      }
    }
  }, 900);
}


function buildTabs() {
  const tabs = byId('tabs');
  tabEls = [];
  DAYDEFS.forEach(function (d, i) {
    const t = el('div', 'tab' + (dow0 - 1 === i ? ' td' : ''));
    const dE = el('span', 'd'); dE.textContent = d[1];
    const dtE = el('span', 'dt'); dtE.textContent = dateStr(i);
    const dot = el('span', 'tdot');
    t.append(dE, dtE, dot);
    
    t.onclick = function () { if (sel === i) return; sel = i; render(); };
    tabs.appendChild(t);
    tabEls.push(t);
  });
}
function hideBoot() {
  
  const b = byId('boot');
  if (b) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 560); }
}





let bootReady = false, bootP = 0, bootRevealed = false;
const bootStart = Date.now();
const bootRaf = (typeof requestAnimationFrame === 'function')
  ? function (cb) { requestAnimationFrame(cb); }
  : function (cb) { setTimeout(cb, 33); };
function bootLoop() {
  let target;
  if (dlMode) {
    const del = Date.now() - dlStart;
    target = dlFinishing ? 100 : Math.min(85, (del / 1500) * 85);
  } else {
    const el = Date.now() - bootStart;
    target = (bootReady && el >= 1100) ? 100 : Math.min(88, (el / 1500) * 88);
  }
  bootP += (target - bootP) * ((target === 100) ? 0.14 : 0.09);
  if (target === 100 && target - bootP < 0.5) bootP = 100;
  const f = byId('btFill'), pc = byId('btPct');
  if (f) f.style.width = bootP.toFixed(1) + '%';
  if (pc) pc.textContent = Math.round(bootP) + '%';
  if (bootP >= 100) {
    if (!bootRevealed) {
      const b = byId('boot');
      const hideB = function () { if (b) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 580); } };
      /* дані акаунта ще не підтверджені — лоадер крутиться, розклад НЕ показуємо */
      if (dlMode && ACC.user && !dataVerified && !settleFailed) {
        dlFinishing = false;
        bootRaf(bootLoop);
        return;
      }
      bootRevealed = true;
      dlMode = false;
      if (ACC.user && dataVerified && !settleFailed) {
        document.body.classList.add('ready');
        document.body.classList.remove('booting');
        try { gateHide(); } catch (eGH) {}
        hideB();
        try { wnSchedule(900); } catch (eWN2) {}
        return;
      }
      /* без акаунта або з помилкою — тільки екран входу, розклад не показуємо */
      document.body.classList.remove('booting');
      try { gateShow(); gateStart(); } catch (e1) { try { gateStart(); } catch (e2) {} }
      if (settleFailed) setAgStat(SETTLE_ERR_TXT, 'err');
      hideB();
      return;
    }
    return;
  }
  bootRaf(bootLoop);
}

function init() {
  
  
  try {
    const fhStripTitle = function () {
      const bad = document.querySelectorAll('[title]');
      for (let i = 0; i < bad.length; ++i) bad[i].removeAttribute('title');
    };
    fhStripTitle();
    
    
    
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(fhStripTitle).observe(document.documentElement,
        { subtree: true, childList: true, attributes: true, attributeFilter: ['title'] });
    }
  } catch (e) {}
  if (ANDROID) { document.body.classList.add('android'); document.documentElement.classList.add('android'); }
  
  
  
  
  
  try { if (!ACC.user) document.body.classList.add('gate-on'); else setTimeout(function () { document.body.classList.remove('gate-on'); }, 50); } catch (e) {}
  
  
  const dwl = byId('dwLogo'); if (dwl) dwl.innerHTML = logoMark(36);
  
  byId('upLogo').innerHTML = logoMark(74);
  
  const ooK = byId('offlOk'); if (ooK) ooK.onclick = hideOffl;
  const ooB = byId('offlBack'); if (ooB) ooB.onclick = hideOffl;
  
  try {
    byId('wnOk').onclick = wnClose;
    byId('wnBack').onclick = wnClose;
  } catch (eWNW) {}
  byId('updGo').onclick = startUpdate;
  const uln5 = byId('updLater'); if (uln5) uln5.onclick = function () { try { toast('Оновлення відкладено — можна встановити пізніше в Налаштуваннях'); } catch (e5) {} updLater(); };
  

  const urt5 = byId('updRetry'); if (urt5) urt5.onclick = function () { updErrButtons(false); UPD.busy = false; startUpdate(); };
  const umn5 = byId('updMan'); if (umn5) umn5.onclick = function () { try { toast('Відкриваю сайт — файл завантажиться сам'); } catch (e5) {} try { host('fh:join|' + updManUrl()); } catch (e6) { window.open(updManUrl(), '_blank'); } };

  const ba2 = byId('bAcc2'); if (ba2) ba2.onclick = function () { showAcc(); };
  byId('bMin').onclick = function () { host('fh:min'); };
  byId('bClose').onclick = function () { host('fh:close'); };
  
  
  
  const ab2 = byId('tbAcc'); if (ab2) ab2.onclick = function () { showAcc(); };   
  const ago = byId('agGo'); if (ago) ago.onclick = function () { authStart(); };




  
  
  const abt = byId('acBeta');
  if (abt) abt.onchange = function () {
    const on = abt.checked;
    BETA.on = on; saveBeta();          
    syncUp();
    try { toast(on ? 'Бета-оновлення увімкнено (зберігається в акаунті)' : 'Бета-оновлення вимкнено — тільки релізні'); } catch (e2) {}
  };
  const asy = byId('acSync');
  if (asy) asy.onchange = function () {
    ACC.sync = asy.checked;
    try { localStorage.setItem('fh_sync', ACC.sync ? '1' : '0'); } catch (e) {}
    if (ACC.user) cfExec('UPDATE users SET sync=? WHERE user_id=?', [ACC.sync ? 1 : 0, userKey(ACC.user)], null);
    if (ACC.sync) {
      
      
      
      
      showDataLoad('Синхронізація…', 'отримуємо налаштування з бази');
      dlSafety();
      syncPull(true, function () { hideDataLoad(); });
      syncWatchStart();
      setTimeout(function () { if (ACC.user) syncUp(true); }, 1500);
    } else { syncWatchStop(); deviceWrite(); }   
    toast(ACC.sync ? 'Синхронізацію увімкнено' : 'Синхронізацію вимкнено (копія на сервері лишається)');
  };
  
  
  const aou = byId('acOut'); if (aou) aou.onclick = function () { authLogout(); };
  

  const arr = byId('acReset');
  if (arr) {
    let armT = 0;
    const abody = arr.querySelector('.ms-body');
    const armTxt = '<b class="danger-t">Точно скинути?</b><span>натисніть ще раз для підтвердження</span>';
    const idleTxt = '<b class="danger-t">Скинути налаштування акаунта</b><span>вибереш групи заново; на всіх пристроях</span>';
    arr.onclick = function () {
      if (!ACC.user) { toast('Спершу увійдіть в акаунт'); return; }
      if (Date.now() - armT < 4000) {
        armT = 0;
        arr.classList.remove('arm');
        if (abody) abody.innerHTML = idleTxt;
        resetAccountSettings();
      } else {
        armT = Date.now();
        arr.classList.add('arm');
        if (abody) abody.innerHTML = armTxt;
        setTimeout(function () {
          if (armT && Date.now() - armT >= 4000) {
            armT = 0;
            arr.classList.remove('arm');
            if (abody) abody.innerHTML = idleTxt;
          }
        }, 4200);
      }
    };
  }
  
  
  




  try {
    const AH = (typeof window.__FH_AUTH_JSON__ !== 'undefined') ? window.__FH_AUTH_JSON__ : null;
    if (AH && AH.sub && !ACC.user) {
      const pA = { sub: String(AH.sub), name: String(AH.name || 'Користувач'), email: String(AH.email || ''), pic: String(AH.pic || '') };
      if (AH.fid) pA.fid = String(AH.fid);
      if (AH.tok) pA.tok = String(AH.tok);
      authAccept(pA, true);   
    }
  } catch (eAH) {}
  
  
  try {
    const A0 = (function(){try{return JSON.parse(localStorage.getItem('fh_user')||'null')}catch(e){return null}})();
    if (A0 && A0.sub && !ACC.user) {
      const p0 = { sub: String(A0.sub), name: String(A0.name || 'Користувач'), email: String(A0.email || ''), pic: String(A0.pic || '') };
      if (A0.fid) p0.fid = String(A0.fid);   
      authAccept(p0, true);   
    }
  } catch (e) {}
  if (!ANDROID) { try { localStorage.removeItem('fh_user'); } catch (ePc) {} }   
  accBoot();
  
  
  try { const AERR = (typeof window.__FH_AUTH_ERR__ === 'string') ? window.__FH_AUTH_ERR__ : ''; if (AERR) agFail(String(AERR)); } catch (e) {}
  
  const sg1 = byId('segSched'); if (sg1) sg1.onclick = function () { showMain(); };
  const sg2 = byId('segSetup'); if (sg2) sg2.onclick = function () { showSetup(); };
  const sgA = byId('segAdmin'); if (sgA) sgA.onclick = function () { admShow(); };   
  
  const zA = byId('zApp'); if (zA) zA.onclick = function () { ZOOM.mode = 'app'; saveZoom(); refreshZoomUI(); toast('Zoom відкриватиметься через додаток'); };
  const zW = byId('zWeb'); if (zW) zW.onclick = function () { ZOOM.mode = 'web'; saveZoom(); refreshZoomUI(); toast('Zoom відкриватиметься через браузер'); };
  refreshZoomUI();
  
  const cT = byId('cOn');
  if (cT) {
    cT.checked = CONFIRM.on;
    cT.onchange = function () { CONFIRM.on = cT.checked; saveConfirm(); syncUp(); toast(CONFIRM.on ? 'Підтвердження увімкнено ✓' : 'Підтвердження вимкнено'); };   
  }
  
  const cplT = byId('cplOn');
  if (cplT) {
    try { cplT.checked = cplOn(); } catch (eCP) { cplT.checked = true; }
    cplT.onchange = function () {
      try { localStorage.setItem('fh_copylink', cplT.checked ? '1' : '0'); } catch (eCP2) {}
      toast(cplT.checked ? 'Посилання копіюється ПКМ по уроку' : 'Копіювання посилання вимкнено');
    };
  }
  
  const cY = byId('cYes'); if (cY) cY.onclick = confirmYes;
  const cN = byId('cNo'); if (cN) cN.onclick = closeConfirm;
  const cB = byId('cback'); if (cB) cB.onclick = closeConfirm;
  byId('tbar').addEventListener('mousedown', function (e) {
    
    if (e.button === 0 && !(e.target && e.target.closest && e.target.closest('button'))) host('fh:drag');
  });
  
  
  
  document.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    const t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('#tbar')) return;   
    
    if (t.closest('button,a,input,textarea,select,label,img,svg,canvas,.card,.lcard,.ag-card,.us-card,.modal,.drawer,.pill,.chip,.tab,.tb-seg,.tb-acc,.daytabs,.g-card,.s-card,.m-item,.n-row,.theme-tile,.range,.sw,[data-nodrag]')) return;
    
    if (t.id === 'app' || t.id === 'agate' || t.id === 'vMain' || t.id === 'vSetup' ||
        t.id === 'vAcc' || t.id === 'vAdmin' || t.tagName === 'BODY' || t.tagName === 'HTML' ||
        (t.classList && (t.classList.contains('view') || t.classList.contains('view-sec') ||
                         t.classList.contains('wrap') || t.classList.contains('acc-wrap') ||
                         t.classList.contains('sec')))) {
      host('fh:drag');
    }
  });
  const bgEl = byId('bGroups'); if (bgEl) bgEl.onclick = openGroups;   
  byId('gSave').onclick = saveSettings;
  byId('gCancel').onclick = closeGroups;
  byId('gback').onclick = closeGroups;
  byId('nOn').onchange = function () {
    NOTIF.on = byId('nOn').checked; saveNotif(); refreshNotifUI(); pushNotifSched(); syncUp();
    toast(NOTIF.on ? 'Сповіщення про уроки увімкнено \u2713' : 'Сповіщення про уроки вимкнено');   
  };
  
  const nSndT = byId('nSnd');
  if (nSndT) nSndT.onchange = function () {
    NOTIF.snd = nSndT.checked; saveNotif(); refreshNotifUI(); pushNotifSched(); syncUp();
    if (nSndT.checked) testNotifSound();
    toast(nSndT.checked ? 'Звук сповіщень увімкнено' : 'Звук сповіщень вимкнено');
  };
  const nOffT = byId('nOff');
  if (nOffT) nOffT.onchange = function () {
    NOTIF.off = nOffT.checked; saveNotif(); refreshNotifUI(); pushNotifSched(); syncUp();
    toast(nOffT.checked ? 'Сповіщення надсилатимуться в будь-який тиждень' : 'Сповіщення надсилатимуться лише в онлайн-тижні');
  };
  const bTN = byId('bTestN');
  if (bTN) bTN.onclick = function () { testNotifSound(); };
  const nMinSl = byId('nMin');
  if (nMinSl) {
    



    let _t0 = null, _bad = false, _orig = NOTIF.min;
    const _paint = function () {
      nMinSl.style.setProperty('--p', (((NOTIF.min - 1) / 14) * 100).toFixed(1) + '%');
      const sv = byId('nMinVal'); if (sv) sv.textContent = NOTIF.min + ' хв';
    };
    const _revert = function () { NOTIF.min = _orig; nMinSl.value = _orig; _paint(); };
    nMinSl.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches.length) return;
      _t0 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      _bad = false; _orig = NOTIF.min;
    }, { passive: true });
    nMinSl.addEventListener('touchmove', function (e) {
      if (!_t0 || !e.touches || !e.touches.length) return;
      const dx = Math.abs(e.touches[0].clientX - _t0.x);
      const dy = Math.abs(e.touches[0].clientY - _t0.y);
      if (dy > 12 && dy > dx * 1.15) _bad = true;   
      if (_bad && parseInt(nMinSl.value, 10) !== _orig) _revert();
    }, { passive: true });
    nMinSl.addEventListener('touchend', function () { if (_bad) _revert(); _t0 = null; });
    nMinSl.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
    nMinSl.oninput = function () {
      if (_bad) { _revert(); return; }
      NOTIF.min = parseInt(nMinSl.value, 10) || 5;
      _paint();
    };
    nMinSl.onchange = function () {
      if (_bad) { _revert(); return; }   
      const v = parseInt(nMinSl.value, 10) || 5;
      if (v !== _orig) {
        






        try {
          const _now = Date.now();
          for (let dd = 0; dd <= 1; dd++) {
            const day = new Date(Date.now() + dd * 86400000);
            const _dstr = day.getFullYear() + '-' + ('0' + (day.getMonth() + 1)).slice(-2) + '-' + ('0' + day.getDate()).slice(-2);
            const _dayMs = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
            (RES[((day.getDay() + 6) % 7)] || []).forEach(function (l) {
              const m = /^(\d{1,2}):(\d{2})/.exec(String(l.t || ''));
              if (!m) return;
              const at = _dayMs + ((+m[1]) * 60 + (+m[2])) * 60000 - v * 60000;
              if (at > _now) { const fk = _dstr + '|' + String(l.t); delete NFIRED[fk]; delete NARMED[fk]; }
            });
          }
          nfSaveMaps();
        } catch (eR45) {}
        saveNotif(); pushNotifSched(); syncUp();
      }
      _orig = NOTIF.min;
    };
  }
  byId('bPerm').onclick = function () { if (ANDROID) { try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (e) {} } };
  
  
  
  devicePing();   
  byId('mback').onclick = closeModal;
  byId('nbOn').onclick = function () {
    if (ANDROID) { try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (e) {} }
  };
  byId('nbX').onclick = function () {
    try { localStorage.setItem('fh_nban', 'off'); } catch (e) {}
    byId('nban').classList.add('hidden');
  };
  window.addEventListener('keydown', function (e) {
    if (updOpen()) return;   
    if (e.key === 'Escape') {
      if (groupsOpen()) { closeGroups(); return; }
      const cw2 = byId('cwrap');
      if (cw2 && !cw2.classList.contains('hidden')) { closeConfirm(); return; }
      if (drawerOpen()) { closeDrawer(); return; }
      closeModal();
      return;
    }
    if (setupOpen) return;
    const k = parseInt(e.key, 10);
    if (k >= 1 && k <= 5) { sel = k - 1; render(); }
  });

  
  const abL = byId('abLogo'); if (abL) abL.innerHTML = logoMark(40);
  const abV = byId('abVer'); if (abV) abV.textContent = 'версія ' + verLabel();
  const bun = byId('bUpdNow'); if (bun) bun.onclick = function () { needOnline(manualUpdCheck); };
  
  const tr = byId('themeRows');
  if (tr) {
    const tiles = tr.querySelectorAll('.theme-tile');
    for (let i = 0; i < tiles.length; ++i) {
      tiles[i].onclick = function () { needOnline(function () { applyTheme(tiles[i].getAttribute('data-t') || 'standard', true); }); };
    }
  }
  applyTheme(THEME, false);
  
  loadRemoteCfg();
  

  buildTabs();
  





  if (ACC.user) {
    showDataLoad('Завантаження…', 'перевіряємо дані акаунта на сервері');
    dlSafety();
    




    setTimeout(function () {
      if (bootRevealed || dataVerified || updOpen()) return;
      if (ACC.user && !(S || paccRestore())) return;   /* чекаємо дані акаунта — не відкриваємо порожнє вікно */
      try { dataVerified = true; hideDataLoad(); revealNow(); } catch (eCap) {}
    }, 4000);
    if (S) { showMain(); render(); }   
  } else if (S) { showMain(); render(); }
  else { showMain(true); render(false); }   
  



  try {
    const c = JSON.parse(localStorage.getItem('fh_cache') || 'null');
    if (c && c.data) {
      cacheTs = c.ts || 0;
      




      applyDb(c.data, true);
    }
  } catch (e) {}

  applyScale();
  window.addEventListener('resize', applyScale);

  
  
  
  
  
  pubEarly();
  d1TickStart();
  d1UpdateCheck();
  pushNotifSched();
  netProbe(false);
  netWatchStart();   

  
  
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { liveTick(true); d1TickNow(); }
  });

  
  if (ANDROID && !notifPermOk()) {
    setTimeout(function () { try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (e) {} }, 1200);
  }

  liveTickStart();
  
  
  
  (function bootRevealLogo() {
    const b = byId('boot');
    if (!b) return;
    
    const bMin = byId('btMin'), bClose = byId('btClose'), bTb = byId('btTb');
    if (bMin) bMin.onclick = function () { host('fh:min'); };
    if (bClose) bClose.onclick = function () { host('fh:close'); };
    if (bTb) bTb.addEventListener('mousedown', function (e) {
      
      if (e.button === 0 && !(e.target && e.target.closest && e.target.closest('button'))) host('fh:drag');
    });
    let done = false;
    const go = function () { if (!done) { done = true; b.classList.remove('pre'); } };
    const im = b.querySelector('.bt-mark img');
    if (!im) { go(); return; }
    if (im.complete && im.naturalWidth > 0) { go(); return; }
    im.addEventListener('load', go);
    im.addEventListener('error', go);
    if (im.decode) { try { im.decode().then(go, go); } catch (e) { } }
    setTimeout(go, 700);   
  })();

  
  bootLoop();
}


window.__fh = {
  
  seg: function (v) { if (!ACC.user) return; if (v === 'setup') showSetup(); else showMain(); },
  
  authResult: function (j) {
    try {
      const u = (typeof j === 'string') ? JSON.parse(j) : j;
      if (u && u.sub) {
        const p = { sub: String(u.sub), name: String(u.name || 'Користувач'), email: String(u.email || ''), pic: String(u.pic || '') };
        if (u.fid) p.fid = String(u.fid);   
        if (u.tok) p.tok = String(u.tok);
        authAccept(p);
      }
      else agFail('Не вдалося увійти. Спробуй ще раз.');
    } catch (e) { agFail('Помилка входу. Спробуй ще раз.'); }
  },
  authFail: function (m) { agFail(String(m || 'Помилка входу. Спробуй ще раз.')); },
  applyDb: applyDb, norm: normSubj, res: function () { return RES; }, render: render,
  showSetup: showSetup, showMain: showMain,
  openGroups: openGroups, closeGroups: closeGroups, groupsOpen: groupsOpen,
  openDrawer: openDrawer, closeDrawer: closeDrawer, drawerOpen: drawerOpen,
  buildSummary: buildSummary,
  checkUpdate: function (f) { if (f) netProbe(true); },
  setRepo: function (r) { UPDATE_REPO = r || DEFAULT_REPO; UPD.pending = ''; },
  updOpen: updOpen,
  showUpd: showUpd,
  updCheck: updCheck,
  netErr: function (on) { if (on) showNetErr(); else hideNetErr(); },
  dlProg: dlProg, dlErr: dlErr, dlDone: dlDone,
  updState: function () { return UPD; },
  notifFired: function (name, t, delta) {
    LAST_NOTIF = { name: name, t: t, delta: delta };
    





    try {
      const fk = nfKeyNow(t);
      NFIRED[fk] = 1;
      delete NARMED[fk];   
      let nn = 0; for (const _k in NFIRED) nn++;
      if (nn > 40) {
        const _today = fk.split('|')[0];
        const _cl = {};
        for (const _k2 in NFIRED) if (String(_k2).indexOf(_today) === 0) _cl[_k2] = 1;   
        _cl[fk] = 1;
        NFIRED = _cl;
      }
      let nA = 0; for (const _k3 in NARMED) nA++;
      if (nA > 40) {
        const _today2 = fk.split('|')[0];
        const _cl2 = {};
        for (const _k4 in NARMED) if (String(_k4).indexOf(_today2) === 0) _cl2[_k4] = 1;
        NARMED = _cl2;
      }
      nfSaveMaps();
    } catch (eNF) {}
  },
  




  notifSnooze: function (t) {
    try {
      const fk = nfKeyNow(t);
      delete NFIRED[fk];
      NARMED[fk] = 1;
      nfSaveMaps();
      pushNotifSched(true);
      try { toast('Нагадаю за 1 хвилину до початку уроку ✓'); } catch (eT45) {}
    } catch (eS45) {}
  },
  notifAction: function (act, url2) {
    
    if (updOpen()) return;
    



    resolveLessons();
    const d = new Date();
    let dow = d.getDay(); if (dow === 0) dow = 7;
    const day = RES[dow - 1] || [];
    

    const tt = window.__fhTest;
    if (url2 && tt && tt.url === String(url2) && (Date.now() - tt.ts) < 600000) {
      setTimeout(function () { openL(String(url2)); }, 150);
      return;
    }
    let target = null;
    if (LAST_NOTIF && LAST_NOTIF.name) {
      

      const _bare = function (s) { return String(s || '').replace(/^[^\p{L}\p{N}]+\s*/u, ''); };
      for (let i = 0; i < day.length; i++) if (_bare(day[i].name) === _bare(LAST_NOTIF.name)) { target = day[i]; break; }
    }
    if (!target && url2) { setTimeout(function () { openL(String(url2)); }, 150); return; }
    if (!target) {
      const nowM = d.getHours() * 60 + d.getMinutes();
      for (let i = 0; i < day.length; i++) {
        const m = String(day[i].t || '').match(/^(\d{1,2}):(\d{2})$/);
        if (!m) continue;
        const sm = (+m[1]) * 60 + (+m[2]);
        if (sm - nowM >= -45 && sm - nowM <= 20) { target = day[i]; break; }
      }
    }
    

    if (target && target.url) { setTimeout(function () { openL(target.url); }, 150); }
    else if (target) { setTimeout(function () { joinLesson(target); }, 150); }
    else if (url2)   { setTimeout(function () { openL(String(url2)); }, 150); }
  },
  authOk: function (u) { if (u && u.sub) authAccept(u, true); },   
  authErr: function (m) { agState = ''; agFail(m || 'Не вдалося підтвердити вхід'); },
  
  
  authWait: function (st, port) {
    if (!st || ACC.user) return;
    agState = String(st);
    authPollDb(String(st));
  },
  cfqCb: function (id, status, json) {
    cfLast = status || 0;   
    const cb2 = cfCbs[id]; delete cfCbs[id];
    if (!cb2) return;
    let rows = null;
    try {
      const r = (typeof json === 'string') ? JSON.parse(json) : json;
      if (r && r.success && r.result && r.result[0] && r.result[0].results) rows = r.result[0].results;
    } catch (e) {}
    cb2(rows);
  },
  cloudCb: function (id, status, json) { __fhFbResult(id, status >= 200 && status < 300); },   
  verCmp: verCmp,
  back: function () {
    if (updOpen()) return true;              
    if (groupsOpen()) { closeGroups(); return true; }
    if (FIRST) return true;
    const cw3 = byId('cwrap');
    if (cw3 && !cw3.classList.contains('hidden')) { closeConfirm(); return true; }
    if (drawerOpen()) { closeDrawer(); return true; }
    const mw = byId('mwrap');
    if (mw && !mw.classList.contains('hidden')) { closeModal(); return true; }
    if (setupOpen) { showMain(); return true; }
    return false;
  },
  boot: function () { return { p: bootP, ready: bootReady, revealed: bootRevealed }; },
  openModalFirst: function () {
    resolveLessons(); const day = RES[sel] || [];
    for (const l of day) if (l.split) { openModal(l); return; }
  },
  setFake: function (h, m, d) { FAKENOW = h * 60 + m; FAKEDOW = d; sel = (d >= 1 && d <= 5) ? d - 1 : 0; render(false); },
  st: function () { return { S: S, NOTIF: NOTIF, sel: sel, DBD: DBD, FIRST: FIRST, APP_VER: APP_VER, UPDATE_REPO: UPDATE_REPO }; },
  fbResult: __fhFbResult,
  applyTheme: applyTheme,
};
window.__fh.zoomStarting = zoomStarting;   
window.__fh.zoomWait = zoomWait;           
window.__fh.zoomFallback = zoomFallback;   
window.__fh.joinLesson = joinLesson;       
window.__fh.confirmState = function () { return CONFIRM; };

try { init(); } catch (err) {
  bootReady = true;
  try { bootLoop(); } catch (e2) { hideBoot(); }
  document.body.innerHTML = '<p style="padding:30px;color:#fff">Помилка інтерфейсу: ' + err.message + '</p>';
}





(function () {
  
  try { document.body.classList.add('segjs'); } catch (eSeg) {}
  
  

  try {
    var _ug = document.getElementById('updGo');
    if (_ug && !document.getElementById('updNote')) {
      var _pn = document.createElement('p');
      _pn.className = 'us-sub'; _pn.id = 'updNote';
      _pn.style.margin = '8px 0 0';
      _pn.textContent = (typeof ANDROID !== 'undefined' && ANDROID)
        ? 'APK відкриється у браузері — встанови його, як звичайний файл'
        : 'оновлення ставиться на те саме місце — програма і її ярлик лишаються там, де ти їх поставив';
      _ug.parentNode.insertBefore(_pn, _ug);
    }
  } catch (eUn) {}
  

  var SEG_SEL = '.seg-z,.adm-seg,.su-opts,#tabs,.tb-seg,.seg';
  function pillFor(cont) {
    var p = cont.__segPill;
    if (!p || !p.isConnected) {
      p = document.createElement('i');
      p.className = 'seg-pill';
      cont.__segPill = p;
      cont.insertBefore(p, cont.firstChild);
    }
    return p;
  }
  function segTo(cont, instant, from) {
    if (!cont || !cont.isConnected) return;
    var on = cont.querySelector('.seg-z-b.on,.adm-seg-b.on,.su-opt.on,.tab.on,.seg button.on');
    if (!on && cont.classList && cont.classList.contains('tb-seg')) on = cont.querySelector('button.on');
    var p = pillFor(cont);
    if (!on) { p.classList.remove('pon'); p.__flyAt = 0; return; }
    p.classList.add('pon');
    



    if (!instant && from) {
      p.style.transition = 'none';
      p.style.width = from.w + 'px';
      p.style.height = from.h + 'px';
      p.style.transform = 'translate(' + from.x + 'px,' + from.y + 'px)';
      void p.offsetWidth;
      p.style.transition = '';
    }
    if (instant) p.style.transition = 'none';
    p.style.width = on.offsetWidth + 'px';
    p.style.height = on.offsetHeight + 'px';
    p.style.transform = 'translate(' + on.offsetLeft + 'px,' + on.offsetTop + 'px)';
    p.__x = on.offsetLeft; p.__y = on.offsetTop;
    if (instant) { void p.offsetWidth; p.style.transition = ''; p.__flyAt = 0; }
    else {
      

      p.__flyAt = Date.now();
      p.classList.remove('arrive'); void p.offsetWidth; p.classList.add('arrive');
    }
  }
  window.fhSegTo = segTo;
  document.addEventListener('click', function (e) {
    var t = e.target;
    var b = (t && t.closest) ? t.closest('.seg-z-b,.adm-seg-b,.su-opt,.tab,.tb-seg button,.seg button') : null;
    if (!b) return;
    if (b.classList.contains('on')) return;   
    var cont = b.parentElement;
    if (!cont || !(cont.matches && cont.matches(SEG_SEL))) return;
    

    var p0 = cont.__segPill;
    var from = (p0 && p0.isConnected && p0.classList.contains('pon') && typeof p0.__x === 'number')
      ? { x: p0.__x, y: p0.__y, w: p0.offsetWidth, h: p0.offsetHeight } : null;
    requestAnimationFrame(function () { try { segTo(cont, false, from); } catch (e1) {} });
  }, true);
  try {
    new MutationObserver(function () {
      var all = document.querySelectorAll(SEG_SEL);
      for (var i = 0; i < all.length; i++) {
        try {
          var _p = all[i].__segPill;
          if (_p && _p.__flyAt && Date.now() - _p.__flyAt < 600) continue;   
          segTo(all[i], true);
        } catch (e2) {}
      }
    }).observe(document.body, { childList: true, subtree: true });
  } catch (eMO) {}
  addEventListener('resize', function () {
    var all = document.querySelectorAll(SEG_SEL);
    for (var i = 0; i < all.length; i++) { try { segTo(all[i], true); } catch (e3) {} }
  });
  function syncAll() {
    var all = document.querySelectorAll(SEG_SEL);
    for (var i = 0; i < all.length; i++) { try { segTo(all[i], true); } catch (e4) {} }
  }
  setTimeout(syncAll, 700);
  setTimeout(syncAll, 1800);
})();
