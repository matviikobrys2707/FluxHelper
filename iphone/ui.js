/* FluxHelper 2.9.2 — логіка інтерфейсу (винесено з одиночного HTML,
   щоб сторінка парсилась швидше і не лагала на слабких пристроях).
   Android: assets/www/index.html + ui.css + ui.js */

/* ================================================================
   2.9.2: ЗАХИСТ ВІД ЗАПУСКУ ПОЗА ЗАСТОСУНКОМ.
   Файл інтерфейсу працює ЛИШЕ всередині FluxHelper:
     - ПК: WebView2 (існує window.chrome.webview);
     - Android: нативний міст (window.AndroidHost з MainActivity).
   У звичайному браузері жоден з мостів недосяжний => увесь код програми
   нижче не виконується (throw зупиняє файл), а користувач бачить
   незакриваний екран-замок із кнопками завантаження стабільного релізу.
   Шари захисту:
     1) раннє приховування розмітки (inline <script> у <head>);
     2) перевірка мосту тут і повна зупинка коду програми;
     3) MutationObserver + setInterval періодично відновлюють замок;
     4) joinLesson/синхронізація/вхід вимагають хоста — у браузері
        функціональність відсутня навіть якщо замок прибрати з DOM.
   ================================================================ */
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
  /* код програми нижче НЕ виконується: throw зупиняє весь цей файл */
  throw new Error('FluxHelper: \u0437\u0430\u043f\u0443\u0441\u043a \u043b\u0438\u0448\u0435 \u0432 \u0437\u0430\u0441\u0442\u043e\u0441\u0443\u043d\u043a\u0443 (Windows / Android)');
})();


"use strict";
/* 3.5.39 КРИТИЧНИЙ ФІКС «NFIRED is not defined»: реєстрація «цей урок уже
   отримав сповіщення» ВЗГАЛІ НЕ БУЛА ОГОЛОШЕНА в телефонному ui.js — перший же
   pushNotifSched() на старті падав з ReferenceError («помилка інтерфейсу»),
   обриваючи решту ініціалізації (netProbe, netWatch, живі тики). */
var NFIRED = {};
try { NFIRED = JSON.parse(localStorage.getItem('fh_nfired') || '{}') || {}; } catch (eNFI) { NFIRED = {}; }
/* 2.8.2: жодного виділення/копіювання тексту довгим натисканням */
try {
  document.addEventListener('selectstart', function (e) {
    const t = e.target;
    if (!(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'))) e.preventDefault();
  }, true);
  (function () {
    let lpT = 0;
    document.addEventListener('touchstart', function (e) {
      const t = e.target;
      lpT = Date.now();
      if (!(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'))) {
        try { if (window.getSelection) { const s2 = window.getSelection(); if (s2) s2.removeAllRanges(); } } catch (e2) {}
      }
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      const t = e.target;
      if (Date.now() - lpT > 550 && !(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'))) {
        try { if (window.getSelection) { const s2 = window.getSelection(); if (s2) s2.removeAllRanges(); } } catch (e2) {}
        try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText('').catch(function(){}); } catch (e3) {}
      }
    }, { passive: true });
  })();
} catch (e) {}

const LOGO = "data:image/png;base64,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";
const SETTINGS0 = null;

// ---------------- Firebase Realtime Database ----------------
const DB_URL = 'https://fluxhelper-1-default-rtdb.europe-west1.firebasedatabase.app';

// ---------------- ВБУДОВАНІ ДАНІ (офлайн-fallback) ----------------
// Структура = структура Firebase: teachers (предмет -> вчитель групи),
// subjects (предмет -> іконка/посилання), schedule (день -> уроки {t, e, s}).
// Розклад містить ТІЛЬКИ назву предмета — вчитель і посилання підтягуються автоматично.
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
    'англійська мова':         { icon: 'msg',       links: { '1': 'https://us04web.zoom.us/j/78501670655?pwd=jvkDLg5Zr0yftjC45RshgmVk1DI71b.1', '2': 'https://us04web.zoom.us/j/2789884374?pwd=40c3JMgJgB7Af9fO3iMAab1yKsDD1Q.1' } },
    'німецька мова':           { icon: 'globe',     links: { '1': 'https://us05web.zoom.us/j/3362996170?pwd=UDFMbkRaU3BRaDF5UUxhcWY1NTIxUT09', '2': 'https://us04web.zoom.us/j/7383966360?pwd=aTVZcUdMNW15R3pOa09YVnZXY1h4QT09' } },
    'українська мова':         { icon: 'book',      links: { '1': 'https://us05web.zoom.us/j/7865109402?pwd=Z2NSY0g4eGtYUGpEM1Y3OUF6c3o2QT09', '2': 'https://us05web.zoom.us/j/8988356507?pwd=OXFEU1lucjBHcEhYNXdZL1p0UThMUT09' } },
    'українська література':   { icon: 'bookopen',  link: 'https://us05web.zoom.us/j/7865109402?pwd=Z2NSY0g4eGtYUGpEM1Y3OUF6c3o2QT09' },
    'історія україни':         { icon: 'landmark', link: 'https://us05web.zoom.us/j/3749252625?pwd=n9BlQwCIZnBHwKabIs7EtF9EKaSdbk.1' },
    'фізика':                  { icon: 'atom',     link: 'https://us05web.zoom.us/j/2891383331?pwd=F0jxnmfiTOxydHzcOLugDXOPsR7AN9.1' },
    'фізична культура':        { icon: 'ball',     link: 'https://us04web.zoom.us/j/7328694112?pwd=T2NucVJwS21UbHhubE9yL3BpcytyUT09' },
    'хімія':                   { icon: 'flask',    link: 'https://us04web.zoom.us/j/2229570959?pwd=aWV5enFmN3BLVlgvUHU1ckFJelpHUT09' },
    'громадянська освіта':     { icon: 'users',    link: 'https://us04web.zoom.us/j/8101017692?pwd=ajEvMHVvZmsycjc5SFhGeDNHNzgvZz09' },
    'інформатика':             { icon: 'monitor',  links: { '1': 'https://us05web.zoom.us/j/2621050038?pwd=S2xMWTJ4ZnFWeW9pZDRDRkZKSzI5UT09', '2': 'https://us04web.zoom.us/j/73998115709?pwd=BEwuKbgpHj0GKDQYf8wWb8simysaJS.1' } },
    'географія':               { icon: 'map',      link: 'https://us05web.zoom.us/j/7923390560?pwd=clJYM3FiN2xISi9lRk1xMFMwcDB3QT09' },
    'трудове навчання':        { icon: 'wrench',   lbl: ['Дівчата', 'Хлопці'], links: { '1': 'https://us04web.zoom.us/j/9260090464?pwd=cTZzMlRjTWpqUHVyeU0xZWw5QkxaUT09', '2': 'https://us04web.zoom.us/j/5931128404?pwd=ARgqPxXvvs7WVlSJuLbMXHHfdmvxqv.1' } },
    'біологія':                { icon: 'leaf',     link: 'https://us05web.zoom.us/j/6689709542?pwd=SFZjTDQ1eU1uQlppSCt1UGhlYXNGUT09&omn=85627260742' },
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

// ---------------- групи (S: ключ предмета -> 1|2) ----------------
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
    // міграція з дуже старих версій (fh_groups = {ang:1,...}) -> fh_groups2
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

// ---------------- версія + перший запуск ----------------
// ФІКС 2.2.3 «постійно просить оновлення до вже встановленої версії»: раніше тут
// була захардкодена константа ('2.2.1'), яка відставала від маніфеста — застосунок
// вічно вважав себе старішим. Тепер версію підставляє build.sh з манифеста
// (2.4.1 -> versionName), а ПІСЛЯ завантаження Java-міст AndroidHost.ver()
// віддає СПРАВЖНЮ версію встановленого пакета (PackageManager) — найнадійніше.
let APP_VER = '3.5.39';              // X.Y.Z — підставляється при збірці з манифеста
try {
  if (window.AndroidHost && AndroidHost.ver) {
    const jv = AndroidHost.ver();
    if (/^\d+\.\d+\.\d+$/.test(jv || '')) APP_VER = jv;   // PackageManager = джерело істини
  }
} catch (e) {}
/* 3.5.5: КАНАЛ ЗБІРКИ — 'beta' або 'release'. Бета-збірки підписують версію
   словом «beta» скрізь у інтерфейсі (профіль, «Про програму», вікно оновлення),
   релізні показують чистий номер. Перед релізом змінюємо тут і перезбираємо. */
const APP_CHANNEL = 'beta';
/* 3.5.20: БЕТА-РЕЖИМ САЙТУ (просив власник): звичайний користувач бачить
   РЕЛІЗНУ поведінку сайту (без нових функцій) і версію БЕЗ слова «beta»;
   адмін з увімкненим перемикачем «Бета-версії» після перезавантаження
   сторінки отримує бета-функції і версію «X.Y.Z beta» (URL не змінюється).
   У застосунках (APK/EXE) бета = канал збірки, як і раніше. */
function FH_BETA() {
  if (!window.FH_WEB) return false;
  try { return !!(BETA && BETA.on && typeof staff === 'function' && staff()); } catch (e) { return false; }
}
function verLabel() {
  const b = window.FH_WEB ? FH_BETA() : (APP_CHANNEL === 'beta');
  return APP_VER + (b ? ' beta' : '');
}
let FIRST = !S;                             // групи ще не налаштовані -> майстер обов'язковий
let AUTO_SETUP = false;                     // 2.3.6: майстер відкритий АВТОМАТИЧНО (не користувачем)

// ---------------- сповіщення ----------------
let NOTIF = { on: true, min: 5, snd: true, off: false };   // 2.9.0: snd — звук; off: надсилати в офлайн-тижні
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

// ---------------- дані з Firebase (поверх вбудованих) ----------------
let DBD = { teachers: null, subjects: null, schedule: null };
function teachFor(key) { return DBD.teachers ? (DBD.teachers[key] || null) : (BUILTIN.teachers[key] || null); }
function subjFor(key) { return DBD.subjects ? (DBD.subjects[key] || null) : (BUILTIN.subjects[key] || null); }
function schedFor(dk) { const a = DBD.schedule ? DBD.schedule[dk] : BUILTIN.schedule[dk]; return Array.isArray(a) ? a : null; }

/* ============================================================
   3.3.0: ЧЕРГУВАННЯ ОФЛАЙН/ОНЛАЙН-ТИЖНІВ (порт з 3.2.0 — дані для
   адмін-панелі). Якір: Пн 12.10.2026 — офлайн; канікули 24.12-24.01.
   ============================================================ */
const WK_ANCHOR = '2026-10-12';                         // понеділок еталонного ОФЛАЙН-тижня
const WK_VAC = [{ s: '2026-12-24', e: '2027-01-24' }];  // зимові канікули (осінніх/весняних немає)
let DBW = [];                                            // фліпи з бази (сумісність)
let WEEKS_INVERTED = false;                              // глобальний інвертор чергування (true = якір онлайн)
function wkPad(n) { return (n < 10 ? '0' : '') + n; }
function wkParse(iso) { const p = String(iso || '').split('-'); return { y: parseInt(p[0], 10) || 0, m: parseInt(p[1], 10) || 0, d: parseInt(p[2], 10) || 0 }; }
function wkIso(x) { return x.y + '-' + wkPad(x.m) + '-' + wkPad(x.d); }
function wkDiff(a, b) { return Math.round((Date.UTC(a.y, a.m - 1, a.d) - Date.UTC(b.y, b.m - 1, b.d)) / 86400000); }
function wkAddDays(x, n) { const t = new Date(x.y, x.m - 1, x.d + n); return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() }; }
function wkMonday(date) {                               // понеділок тижня, до якого належить дата
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
}
function wkIsVac(mon) {                                 // тижні, що ЦІЛИКОМ усередині канікул
  for (let i = 0; i < WK_VAC.length; i++) {
    const s = wkParse(WK_VAC[i].s), e = wkParse(WK_VAC[i].e);
    if (wkDiff(mon, s) >= 0 && wkDiff(e, mon) >= 6) return true;
  }
  return false;
}
function wkStudyIndex(monIso) {                         // індекс навчального тижня відносно якоря (суворе чергування)
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
function wkType(monIso) {                               // 'off' | 'on' | 'vac' — чергування без двох однакових тижнів поспіль
  const mon = wkParse(monIso);
  if (wkIsVac(mon)) return 'vac';
  const idx = wkStudyIndex(monIso);
  let on = (Math.abs(idx) % 2 === 0);
  if (WEEKS_INVERTED) on = !on;
  return on ? 'on' : 'off';
}
function wkTypeAt(date) { return wkType(wkIso(wkMonday(date))); }
function wkSuppressed(days) {                           // дати, коли сповіщення приглушені
  const out = [];
  if (NOTIF.off) return out;                            // надсилати в офлайн-тижні -> не приглушувати
  const t0 = new Date();
  for (let i = 0; i < (days || 120); i++) {
    const d = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate() + i);
    if (wkTypeAt(d) !== 'on') out.push(wkIso({ y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() }));
  }
  return out;
}
function wkParseFlips(w) {                              // weeks.flips з RTDB -> масив дат
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

// нормалізація назви предмета: "англ мова" / "Укр.мова" / "фізра" -> канонічний ключ
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

// розв'язання уроків: назва предмета -> вчитель вибраної групи + посилання
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

/* ============================================================
   3.5.30 — КАБІНЕТИ УРОКІВ (просив власник: «добавь в рамки предметов
   написание класса цього предмета... у нас один тиждень онлайн, другие
   оффлайн, и нам нужны знать классы»). Ключ = normSubj(name);
   значення: '310' — у весь клас; ['104','313'] — [група 1, група 2];
   {mon:'310',wed:'315'} — по днях (алгебра/геометрія ходять у різні).
   Фізкультура і мистецтво — без кабінету (нема в таблиці = не малюємо).
   Джерело: власник, 27.10 (розклад зведено з базою D1).
   ============================================================ */
const FH_ROOMS = {
  'зарубіжна література': '314',
  'основи медіаграмотності': '108',
  'англійська мова': ['104', '313'],
  'українська мова': ['215', '216'],
  'німецька мова': ['212', '309'],
  'інформатика': ['103', '312'],
  'трудове навчання': ['309', '106'],   /* г1 = Дівчата (309), г2 = Хлопці (106) */
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

// ---------------- хост (C++ вікно / Android) ----------------
const ANDROID = !!(window.AndroidHost && window.AndroidHost.open);
function host(m) {
  if (window.chrome && window.chrome.webview && window.chrome.webview.postMessage) {
    try { window.chrome.webview.postMessage(m); return true; } catch (e) {}
  }
  return false;
}
function openL(u) {
  if (!u) return;
  /* 3.4.11: користувач ЗАЙШОВ на урок із розкладу — повідомляємо хоста:
     сповіщення та «Нагадати за 1 хв» про цей урок БІЛЬШЕ НЕ ПРИХОДЯТЬ. */
  try {
    if (ANDROID && typeof LAST_OPEN_LESSON === 'object' && LAST_OPEN_LESSON && LAST_OPEN_LESSON.url === u) {
      AndroidHost.markLesson(String(LAST_OPEN_LESSON.name || ''), String(LAST_OPEN_LESSON.t || ''));
    }
  } catch (eML) {}
  if (ZOOM.mode === 'web') u = toWebZoom(u);   // браузер = сторінка «приєднатися в браузері»
  if (ZOOM.mode === 'app' && /^https:\/\/(us\d\d)?zoom\.us\/|\/j\/\d+/.test(u)) {
    // через ДОДАТОК: zoommtg:// відкриє сам Zoom без браузера
    const z = toZoomApp(u);
    if (z) { try { AndroidHost.open(z); return; } catch (e) {} }
  }
  if (ANDROID) { try { AndroidHost.open(u); return; } catch (e) {} }
  if (!host('fh:join|' + u)) window.open(u, '_blank');
}
// https://us05web.zoom.us/j/123?pwd=x -> zoommtg://zoom.us/join?action=join&confno=123&pwd=x
function toZoomApp(u) {
  try {
    const s = String(u || '');
    const m = s.match(/\/j\/(\d{5,})/) || s.match(/\/wc\/(\d{5,})\/join/);
    if (!m) return '';
    const pm = s.match(/[?&]pwd=([^&]+)/);
    return 'zoommtg://zoom.us/join?action=join&confno=' + m[1] + (pm ? ('&pwd=' + pm[1]) : '');
  } catch (e) { return ''; }
}
// https://us05web.zoom.us/j/123?pwd=x -> https://app.zoom.us/wc/123/join?ref_from=launch&pwd=x&fromPWA=1
function toWebZoom(u) {
  try {
    const s = String(u || '');
    if (s.indexOf('app.zoom.us/wc/') >= 0) return s;
    const m = s.match(/\/j\/(\d{5,})/) || s.match(/\/wc\/(\d{5,})\/join/);
    if (!m) return s;
    const pm = s.match(/[?&]pwd=([^&]+)/);
    return 'https://app.zoom.us/wc/' + m[1] + '/join?ref_from=launch' + (pm ? ('&pwd=' + pm[1]) : '') + '&fromPWA=1';
  } catch (e) { return u; }
}
// режим запуску Zoom (ПК + телефон): 'app' = додаток, 'web' = Zoom Web у браузері
let ZOOM = { mode: 'app' };
try {
  const z = JSON.parse(localStorage.getItem('fh_zoom') || 'null');
  if (z && (z.mode === 'app' || z.mode === 'web')) ZOOM.mode = z.mode;
} catch (e) {}
function saveZoom() { try { localStorage.setItem('fh_zoom', JSON.stringify(ZOOM)); } catch (e) {} if (typeof syncUp === 'function') syncUp(); }
function refreshZoomUI() {
  const a = byId('zApp'), w = byId('zWeb');
  if (a) a.classList.toggle('on', ZOOM.mode === 'app');
  if (w) w.classList.toggle('on', ZOOM.mode === 'web');
}

// ---------------- тема оформлення (2.1.0; 2.2.3 — сім тем) ----------------
/* 3.5.39: ЛИШЕ ДВІ ТЕМИ (власник: «повністю прибери всі теми, залиш тільки
   стандартну темну фірмову і світлу»). Аврора (glass)/Океан/Захід/Ліс знесено
   з css і js; збережені старі вибори тихо повертаються в стандартну. */
const THEME_LIST = ['standard', 'light'];
const THEME_NAMES = { standard: 'Стандартна тема ✓', light: 'Світла тема ✓' };
let THEME = 'standard';
try {
  const t0 = localStorage.getItem('fh_theme');
  if (THEME_LIST.indexOf(t0) >= 0) THEME = t0;
  else if (t0) { try { localStorage.removeItem('fh_theme'); } catch (eT0) {} }
} catch (e) {}
/* 2.8.5: watchdog Liquid Glass — на слабких GPU автоматично вмикаємо
   body.lite-glass (без блюрів; дизайн тримають тінт+бордери+градієнт).
   Міряємо середній кадр ~55 кадрів після увімкнення теми; стрибки >120 мс
   (згортання/фон) скидають замір, щоб не отримати хибне «лагає». */
let glassWatchT = 0;
function glassPerfWatch() {
  let lite = false;
  try { lite = localStorage.getItem('fh_liteglass') === '1'; } catch (e) {}
  document.body.classList.toggle('lite-glass', lite);
  clearTimeout(glassWatchT);
  glassWatchT = setTimeout(function () {
    if (THEME !== 'glass' || typeof requestAnimationFrame !== 'function') return;
    let n = 0, t0 = 0, last = 0;
    const tick = function (ts) {
      if (THEME !== 'glass') return;
      if (!n) { t0 = last = ts; n = 1; requestAnimationFrame(tick); return; }
      if (ts - last > 120) { t0 = last = ts; n = 1; requestAnimationFrame(tick); return; }
      last = ts; n++;
      if (n >= 55) {
        const avg = (ts - t0) / (n - 1);
        const slow = avg > 21;
        document.body.classList.toggle('lite-glass', slow);
        try { localStorage.setItem('fh_liteglass', slow ? '1' : '0'); } catch (e) {}
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, 1400);
}
function applyTheme(t, save) {
  THEME = (THEME_LIST.indexOf(t) >= 0) ? t : 'standard';
  /* 3.5.35: ПЛАВНЕ ПЕРЕТЕКАННЯ ТЕМИ (просив власник: «смена темы тоже чтобы
     с анимацией перемещалась») — на мить вмикаємо transition кольорів/рамок
     для всього, тема переливається, потім клас знімаємо. */
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
  /* 3.5.16: світла тема -> темні іконки в системних смугах (edge-to-edge);
     хост читає тему ще до першого кадру з __BOOT_THEME__, тому смуги
     ніколи не блимають неправильно */
  try { if (window.AndroidHost && typeof AndroidHost.theme === 'function') AndroidHost.theme(THEME); } catch (e) {}
  refreshThemeUI();
  /* 3.5.39: watchdog lite-glass знесено разом з темою glass — клас більше ніколи не повертається */
  document.body.classList.remove('lite-glass');
  if (save) {
    syncUp(30);   // 2.8.6: тема одразу летить у хмару — Liquid Glass з ПК приїде сам
    toast((THEME_NAMES[THEME] || 'Темна') + ' тема ✓');
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


// ---------------- підтвердження заходу на урок (ПК + телефон) ----------------
// Перемикається в налаштуваннях («Захід на урок»). Увімкнено -> тап по уроку
// спершу показує вікно з затемненням і кнопками «Так / Ні».
let CONFIRM = { on: false };
try { CONFIRM.on = localStorage.getItem('fh_confirm') === '1'; } catch (e) {}
function saveConfirm() { try { localStorage.setItem('fh_confirm', CONFIRM.on ? '1' : '0'); } catch (e) {} }

/* 3.4.12: бета-перемикач — ТЕПЕР У БАЗІ: значення їде у знімку налаштувань
   (bt) і відновлюється з хмари при вході на будь-якому пристрої (був баг:
   після зміни акаунта доводилось увімкати заново). fh_beta — резерв до
   першого синку. */
let BETA = { on: false };
try { BETA.on = localStorage.getItem('fh_beta') === '1'; } catch (e) {}
function saveBeta() { try { localStorage.setItem('fh_beta', BETA.on ? '1' : '0'); } catch (e) {} }

let pendingLesson = null;   // урок, що очікує підтвердження
let lastJoinBtn = null;     // кнопка «Приєднатися», яку натиснули останньою
let LAST_OPEN_LESSON = null;   // 3.4.11: урок, який відкриваємо (для маркера «закрито»)
function joinLesson(l) {
  if (!l || !l.url) return;
  /* 3.5.23: вікно «Немає підключення до інтернету» ЗНЕСЕНО повністю
     (просив власник: «полностью убери... чтобы его больше нигде не было»).
     Урок відкривається ЗАВЖДИ; якщо мережі нема, Zoom/браузер сам це покаже. */
  try { LAST_OPEN_LESSON = { name: String(l.name || ''), t: String(l.t || ''), url: String(l.url || '') }; } catch (eLL) {}
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

// ---------------- тост + буфер обміну ----------------
let toastT = null;
function toast(msg) {
  const t = byId('toast');
  if (!t) return;
  t.textContent = msg;
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
/* 3.5.21: КОПІЮВАННЯ ПОСИЛАННЯ НА УРОК — перемикач функції «затиснути урок
   у розкладі (або ПКМ на ПК) → посилання в буфері обміну». Налаштування
   локне (не синхронізується), за замовчуванням — УВІМКНЕНО. */
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

// ---------------- утиліти ----------------
const NOW0 = new Date();
const dow0 = NOW0.getDay(); // 0 = нд
const monday = new Date(NOW0); monday.setDate(NOW0.getDate() - ((dow0 + 6) % 7));
let sel = (dow0 >= 1 && dow0 <= 5) ? dow0 - 1 : 0;
let setupOpen = false;
let tabEls = [];
let FAKENOW = null, FAKEDOW = null;   // тільки для тестів/прев'ю

function byId(id) { return document.getElementById(id); }
function el(t, c, h) { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
function dateStr(i) { const d = new Date(monday); d.setDate(monday.getDate() + i); return d.getDate() + '.' + (d.getMonth() + 1); }
function todayDow() { return FAKEDOW != null ? FAKEDOW : dow0; }
function nowMin() { if (FAKENOW != null) return FAKENOW; const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
function toMin(t) { const p = String(t || '').split(':'); return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0); }
function isTodaySel() { const d = todayDow(); return d >= 1 && d <= 5 && sel === d - 1; }

/* 3.4.14: ЖИВИЙ ІНТЕРФЕЙС — тік КОЖНУ СЕКУНДУ (скарга власника: «заходжу в
   розклад, а там показує, що пройшло немножко, хоча урок уже майже скінчився»).
   Причини старого застигання: тік 15 с перемальовував ЛИШЕ на зміні хвилини,
   а у згорнутому/фоновому застосунку таймери WebView приглушуються до 1/хв
   і більше — після повернення на екран довго висіли старі дані.
   ЩО РОБИТЬ ТЕПЕР:
   • щосекунди оновлюється ЛИШЕ ширина смужки прогресу поточного уроку
     (один style.width — це безплатно: жодного ререндера і жодних лагів
     навіть на слабких пристроях);
   • чіпи ЗАРАЗ/ДАЛІ, порядок і вміст карток перемальовуються ЛИШЕ коли
     змінилась хвилина/вкладка (повний ререндер — раз на хвилину);
   • щойно застосунок повертається з фону/згортання (visibilitychange) —
     МИТТЄВИЙ примусовий перерахунок: застиглий прогрес неможливий. */
function liveTick(force) {
  if (FAKENOW != null) {                    // прев'ю/тести: час зафіксовано
    if (force && !setupOpen) render(false);
    return;
  }
  if (document.hidden && !force) return;    // у фоні не витрачаємо жодного кадру
  const d = new Date();
  const m = d.getHours() * 60 + d.getMinutes();
  const key = sel + '|' + m;
  if (force || key !== liveTick.k) {        // хвилина/вкладка змінились — повний ререндер
    liveTick.k = key;
    if (!setupOpen) render(false);
    return;
  }
  if (setupOpen || !isTodaySel()) return;   // між хвилинами оновлюємо лише сьогоднішню вкладку
  const pr = document.querySelector('#list .card.now .prog');
  if (!pr) return;
  const day = RES[todayIdx()] || [];
  let cur = null;
  for (let i = 0; i < day.length; i++) {
    const a = toMin(day[i].t), b = toMin(day[i].e);
    if (a && b && m >= a && m < b) { cur = day[i]; break; }
  }
  if (!cur) return;                         // урок скінчився — хвилинний ререндер прибере карту
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

// ---------------- SVG-ІКОНКИ ----------------
const IC_D = 'rgba(8,8,18,.30)';
const ICONS = {
  /* ---------- предмети (filled 2D) ---------- */
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
  /* ---------- UI-гліфи (лінійні, як були) ---------- */
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
  /* 3.4.1: нові предмети та білі контурні іконки (німецька, англійська, укр. мова, укр. літ) */
  german:     '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/><path d="M7.5 9h2.2a3 3 0 0 1 0 6H7.5V9zM14 9h3.4M14 12h2.6M14 15h3.4M14 9v6"/>',
  germanf:    '<path fill="currentColor" stroke="none" d="M12 2.9c-5.14 0-9.3 3.63-9.3 8.1 0 2.4 1.2 4.55 3.1 6v3.3c0 .62.65 1.02 1.2.74l3.3-1.83c.55.07 1.12.11 1.7.11 5.14 0 9.3-3.63 9.3-8.1S17.14 2.9 12 2.9z"/><path d="M7.5 8.5h2.2a2.3 2.3 0 0 1 0 4.6H7.5zm7 0h3m-3 2.3h2.2m-2.2 2.3h3" fill="none" stroke="' + IC_D + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  english:    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/><path d="M7.5 9h3.6M7.5 12h2.8M7.5 15h3.6M7.5 9v6M14 15V9l4 6V9"/>',
  ukr_lang:   '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/><path d="M7.5 9v4a2 2 0 0 0 4 0V9M14 15l2.2-6 2.2 6M14.7 13h3"/>',
  ukr_lit:    '<path d="M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0v13a9 9 0 0 0-9 0 9 9 0 0 0-9 0z"/><path d="M12 6v13"/><path d="M17 3.5l1.5 1.5-6.5 6.5v2h2l6.5-6.5 1.5 1.5"/>'
};
// 2.8.3: ПОВЕРНУТО ІКОНКИ 2.4.2 (старі білі лінійні) для ВСІХ предметів, крім
// фізкультури (ball -> новий run) та мистецтва (palette -> новий palettef).
// 3.4.1: мапінг старих ключів на нові контурні білі іконки
const ICON_ALIAS = { ball: 'run', palette: 'palettef', msgd: 'german', msgf: 'english' };
function icon(name, sz) {
  const nm = ICON_ALIAS[name] || name;
  return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[nm] || ICONS.bookf) + '</svg>';
}
function iconSvg(name) {
  return '<svg width="11" height="11" viewBox="0 0 24 24" fill="#e0e7ff"><path d="M8 5v14l11-7z"/></svg>';
}

// ---------------- логотип (оригінальна іконка автора, PNG без втрат) ----------------
function logoMark(sz) {
  return '<img src="' + LOGO + '" width="' + sz + '" height="' + sz + '" alt="" style="display:block;border-radius:' + Math.max(6, Math.round(sz * 0.22)) + 'px" />';
}

// ---------------- масштабування під розмір вікна ----------------
function applyScale() {
  // телефон/планшет: цей файл ЗАВЖДИ в мобільній розкладці (body class="mob"),
  // масштабування тексту робить CSS clamp() — працює і в повороті, і на планшеті
  document.body.classList.add('mob');
}

// ---------------- головний екран ----------------
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

  // ЗАРАЗ (зелений) / ДАЛІ (жовтий) — тільки на вкладці сьогоднішнього дня
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
    /* 3.5.22: анімація появи — окремим класом .pop (а не всім .card).
       Після завершення клас знімається (страховка нижче): Safari іноді
       «замикає» картку на проміжній прозорості анімації — звідси йшли
       скарги «деякі уроки світліші/темніші, рамка різна» на телефоні. */
    /* 3.5.23: анімацію появи знято ПОВНІСТЮ — всі картки малюються ОДРАЗУ
       у фінальному стані: жодних «світліших/темніших» рамок і прозорості */
    /* 3.5.8: сторож — якщо на якомусь уроці щось падає (нова іконка з адмінки,
       криві дані), список НЕ лишається ПОРОЖНІМ (це і була «чорна смуга»
       замість розкладу на телефоні) — безпечна картка-фолбек */
    try {
    const tile = el('div', 'ic');
    // 2.8.0: плоскі білі лінійні SVG (набір 2.4.2 з перемальованими іконками)
    // 2.9.2: іконка предмета (в т.ч. алгебра ±×÷) — трохи БІЛЬША (21 -> 24),
    // щоб краще читалась у плитці
    tile.innerHTML = icon(l.icon, 24);
    tile.style.background = tileGrad(l.name);

    const mid = el('div', 'mid');
    /* 3.4.7: назва — в окремому span.ln (nowrap + автопідбір розміру), чіпи
       ЗАРАЗ/ДАЛІ переїхали в рядок мета — назві дігається ВСЯ ширина картки,
       довгі назви («Українська культура») лишаються одним красивим рядком */
    const h3 = el('h3'); const lnS = el('span', 'ln'); lnS.textContent = l.name;
    /* 3.5.30: чіпи ЗАРАЗ/ДАЛІ — ПОВЕРНУЛИСЯ В РЯДОК НАЗВИ (просив власник:
       «текст далі писался, например, в рядку з назвою предмета») — другий
       рядок повністю віддаємо часу, вчителю і КАБІНЕТУ, ім'я не обрізається */
    h3.appendChild(lnS);
    /* 3.5.32: порядок — НАЗВА → КАБІНЕТ → ЗАРАЗ/ДАЛІ (просив власник: після
       номера кабинета — красива рамочка «далі»); бейджі з кольоровими рамочками */
    try {
      /* 3.5.38: уроки, що ПОЧИНАЮТЬСЯ після 12:35 — онлайн (просив власник):
         кабінет не показуємо взагалі, лише назва/час/учитель. Уроки 8:00-12:35
         (та рівно 12:35) — кабінет лишається. */
      const _stM = (function (t) { const m = /^\s*(\d{1,2}):(\d{2})/.exec(String(t || '')); return m ? ((+m[1]) * 60 + (+m[2])) : 0; })(l.t);
      const rm = (_stM > 755) ? null : roomFor(DAYDEFS[sel][0], l);
      if (rm) h3.appendChild(el('span', 'rm-chip', rm));
    } catch (eRm) {}
    if (i === nowIdx) h3.appendChild(el('span', 'now-chip', '<i></i>ЗАРАЗ'));
    if (i === nextIdx) h3.appendChild(el('span', 'next-chip', '<i></i>ДАЛІ'))
    mid.appendChild(h3);

    const meta = el('div', 'meta');
    /* 3.5.30: у мета — час, вчитель і КАБІНЕТ (просив власник: «нужно знать
       классы»); для групових предметів — кабінет ТВОЄЇ групи */
    const t1 = el('span', 'tc');
    t1.innerHTML = icon('clock', 12);
    const tv = el('span'); tv.textContent = l.t + '\u2013' + l.e;   /* 3.5.30: без пробілів — кабінет вміщається в рядок часу */
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
      // 2.3.7 ФІКС: після довгого натискання Android часто досилає «відскок» кліка
      // (порядок contextmenu/таймер/клік — перегоночний). Тепер після лонг-преса
      // наступні 1.6 с клік по картці гарантовано ігнорується — урок НЕ відкриється.
      if (Date.now() < lpUntil) return;
      if (swipeFired) { swipeFired = false; return; }
      lastJoinBtn = b; joinLesson(l);
    };
    card.addEventListener('contextmenu', function (ev) {
      ev.preventDefault();
      // довге натискання (хоча б системне) — гасимо наступний клік у будь-якому разі
      lpUntil = Date.now() + 1600;
      if (card.__lpDone) return;          // дію вже зробив JS-таймер — не дублюємо
      card.__lpDone = true;
      if (!cplOn()) return;               // 3.5.21: функцію вимкнено в налаштуваннях
      if (l.split) openModal(l);
      else copyText(fmtCopy(l, -1));       // одна група -> копіюємо одразу
    });
    bindLongPress(card, l);
    card.append(tile, mid, b);
    } catch (eCard) {
      card.innerHTML = '<div class="ic" style="background:' + tileGrad(l.name) + '">' + icon('bookf', 24) + '</div>' +
        '<div class="mid"><h3><span class="ln">' + esc(l.name || 'Урок') + '</span></h3>' +
        '<div class="meta"><span class="tc">' + esc((l.t || '') + ' – ' + (l.e || '')) + '</span></div></div>';
      card.onclick = function () { lastJoinBtn = null; joinLesson(l); };
    }
    if (i === nowIdx) {
      const pr = el('i', 'prog');
      pr.style.width = Math.round(nowPct * 100) + '%';
      card.appendChild(pr);
    }
    list.appendChild(card);
  });
      /* 3.5.22: страховка від «завислої прозорості» (Safari): через 1.6 с
       після малювання знімаємо .pop — анімація гарантовано завершена,
       картка у фінальному непрозорому стані незалежно від примх WebKit */
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
  /* 3.5.8: сторож порожнього списку — розклад є, а карток нема → один
     перезбір (синхронний виняток у сторонньому коді міг зʼїсти рендер) */
  if (day.length && !list.children.length && !render._heal) {
    render._heal = setTimeout(function () { render._heal = 0; try { render(false); } catch (eH) {} }, 400);
  }
}

/* 3.4.7: АВТОПІДБІР РОЗМІРУ НАЗВИ УРОКУ — назва НІКОЛИ не переноситься і
   НЕ обрізається крапками, поки можна: якщо рядок не вміщується, шрифт
   плавно зменшується (15 -> 10.5px), і лише зовсім довга назва отримує
   ellipsis у запасі. Спрацьовує після кожного рендера і після завантаження
   шрифтів — на ПК і телефоні однаково. */
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

// ---------------- довге натискання (Android APK) = ПКМ ----------------
// 2.3.7: перероблено. Раніше був глобальний прапорець lpFired, який
// скидався обробником contextmenu ДО приходу кліка — тоді клік «пробивався»
// і відкривав урок замість копіювання. Тепер:
//   • card.__lpDone — локальний прапорець НАТИСКАННЯ (хто перший спрацював —
//     JS-таймер чи системний contextmenu — той і робить дію, дублю немає);
//   • lpUntil — глобальна мітка часу: після лонг-преса клік по картці
//     ігнорується 1.6 с (гасить «відскок» кліка в ЛЮБОМУ порядку подій).
let lpUntil = 0;
let swipeFired = false;   // щойно було свайп-переключення дня — гасимо клік по картці
function bindLongPress(card, l) {
  let sx = 0, sy = 0, t = null;
  card.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    sx = e.clientX; sy = e.clientY; card.__lpDone = false;
    t = setTimeout(function () {
      t = null;
      if (card.__lpDone) return;          // contextmenu вже обробив це натискання
      card.__lpDone = true;
      lpUntil = Date.now() + 1600;
      if (!cplOn()) return;               // 3.5.21: функцію вимкнено — без вібрації і копіювання
      try { if (navigator.vibrate) navigator.vibrate(18); } catch (e) {}   // легкий тактильний відгук
      if (l.split) openModal(l);
      else copyText(fmtCopy(l, -1));
    }, 430);                              // 430мс: наш таймер стабільно раніший за системний (~500мс)
  });
  card.addEventListener('pointermove', function (e) {
    if (t && (Math.abs(e.clientX - sx) > 10 || Math.abs(e.clientY - sy) > 10)) { clearTimeout(t); t = null; }
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
    card.addEventListener(ev, function () { if (t) { clearTimeout(t); t = null; } });
  });
}

// ---------------- модальне вікно копіювання (по центру, фон затемнено) ----------------
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
  chip.innerHTML = cap + ', ' + dm + (isToday ? ' <i class="today-dot"></i>' : '');
}

function todayIdx() { const d = todayDow(); return (d >= 1 && d <= 5) ? d - 1 : 0; }

function setTbSec(t) { const e = byId('tbSec'); if (e) e.textContent = t; }
/* 3.5.18: ПЕРЕДЗАВАНТАЖЕННЯ ВКЛАДОК (просив власник: «когда захóдишь у
   вкладку перший раз — воно лагає; зроби, щоб усі вкладки завантажувались
   при заході в програму»). На старті ОДНОРАЗОВО прогріваємо важкі екрани
   (Налаштування/Профіль/Адмінка), поки вони приховані: перше відкриття
   вкладки малює вже готовий DOM — жодних «підлагоджувань». Іконки уроків —
   інлайн-SVG, тож після прогріву рендеру вони з'являються миттєво. */
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
  /* 2.9.2: force=true — показати РОЗКЛАД навіть якщо групи ще не обрані:
     майстер груп відкривається МОДАЛКОЮ ПОВЕРХ розкладу (а не перекидає
     на налаштування). Користувач бачить свою вкладку «Розклад» і перед
     ним обов'язкове вікно груп; після «Зберегти» лишається на розкладі. */
  if (FIRST && !force) { AUTO_SETUP = true; showSetup(); openGroups(); return; }   // перший запуск — спершу групи
  setupOpen = false;
  byId('vSetup').classList.add('hidden');
  const _va = byId('vAcc'); if (_va) _va.classList.add('hidden');   // 2.8.3: профіль більше не «висить» поверх
  const _ad1 = byId('vAdmin'); if (_ad1) _ad1.classList.add('hidden');   // 3.3.0: адмін-панель
  document.body.setAttribute('data-view', 'sched');
  byId('vMain').classList.remove('hidden');
  setChip();
  markNav('sched');
  setTbSec('розклад');
  checkNban();
  warmTabs();   /* 3.5.18: прогрів вкладок одразу після показу головної */
}
function showSetup() {
  setupOpen = true;
  closeDrawer();
  byId('vMain').classList.add('hidden');
  const _va2 = byId('vAcc'); if (_va2) _va2.classList.add('hidden');   // 2.8.3
  const _ad2 = byId('vAdmin'); if (_ad2) _ad2.classList.add('hidden');   // 3.3.0
  document.body.setAttribute('data-view', 'setup');
  byId('vSetup').classList.remove('hidden');
  /* 3.5.20: bBack більше не існує — прибрано разом з кнопкою */
  buildSummary();
  refreshNotifUI();
  refreshZoomUI();
  markNav('setup');
  setTbSec('налаштування');
}

// ---------------- висувне меню (телефон) ----------------
function drawerOpen() { const d = byId('drawer'); return !!(d && d.classList.contains('on')); }
function openDrawer() { const d = byId('drawer'); if (d) d.classList.add('on'); const b = byId('dback'); if (b) b.classList.add('on'); }
function closeDrawer() {
  const d = byId('drawer'); if (d) d.classList.remove('on');
  const b = byId('dback'); if (b) b.classList.remove('on');
}
function markNav(view) {
  /* 3.5.4: підсвітка працює для ОБОХ навігацій — шухляди і нової нижньої панелі */
  ['dwSched', 'dwSet', 'bnSched', 'bnSet', 'bnProf', 'bnAdmin'].forEach(function (id) {
    const e2 = byId(id); if (e2) e2.classList.remove('on');
  });
  const map = { home: 'dwSched', sched: 'dwSched', setup: 'dwSet', acc: 'dwAcc', adm: 'dwAdmin' };
  const mapBn = { home: 'bnSched', sched: 'bnSched', setup: 'bnSet', acc: 'bnProf', adm: 'bnAdmin' };
  /* 3.5.32: та сама вкладка — ЖОДНИХ змін класів (remove+add перезапускав
     bnPop/icPop2 і .vin — власник просив: «якщо я вже у вкладці і натискаю
     по ній ще раз — щоб без анімації. Тільки якщо натискаю іншу вкладку») */
  const _b0 = byId(mapBn[view] || '');
  if (_b0 && _b0.classList.contains('on')) {
    const _t0 = byId(map[view] || '');
    if (_t0 && _t0.classList.contains('on')) return;
  }
  const t = byId(map[view] || '');   // 2.3.8: невідомий вид (профіль) — без підсвітки
  if (t) t.classList.add('on');
  const b = byId(mapBn[view] || '');   // 3.5.4: нижня панель
  if (b) b.classList.add('on');
  /* 3.5.11: анімація появи вкладки (viewIn) — перезапуск keyframes при
     кожному переключенні Розклад/Налаштування/Профіль/Адмін */
  try {
    const vv = { home: 'vMain', sched: 'vMain', setup: 'vSetup', acc: 'vAcc', adm: 'vAdmin' }[view];
    const el3 = vv && byId(vv);
    if (el3 && !el3.classList.contains('hidden')) {
      el3.classList.remove('vin'); void el3.offsetWidth; el3.classList.add('vin');
    }
  } catch (e3) {}
}

// ---------------- налаштування: рядки груп (ТЕЛЕФОН) ----------------
// Мобільний стиль: кожен предмет — великий рядок 58px із вчителем і бейджем
// групи; тап відкриває шторку знизу з великими картками під палець.
function splitInfo(k) {
  const sub = subjFor(k) || {}, tch = teachFor(k) || {};
  const lbls = (sub.lbl && sub.lbl.length === 2) ? [String(sub.lbl[0]), String(sub.lbl[1])]
                                                 : ['1-ша група', '2-га група'];
  return { sub: sub, tch: tch, lbls: lbls };
}
function dispName(key) { return key ? key.charAt(0).toUpperCase() + key.slice(1) : ''; }
function buildSummary() {
  const rows = byId('sumRows');
  if (!rows) return;
  rows.innerHTML = '';
  const keys = splitKeys();
  const done = keys.filter(function (k) { return S && (S[k] === 1 || S[k] === 2); }).length;
  if (!done) {
    rows.appendChild(el('div', 'sum-hint',
      'Групи ще не обрано. Натисни «Оберіть групи» — і застосунок скрізь підставить саме твоїх вчителів і посилання.'));
    return;
  }
  // довідкові рядки: предмет -> твоя група і вчитель (НЕ клікаються —
  // меню груп відкриває лише одна кнопка «Оберіть групи» під усіма)
  keys.forEach(function (k) {
    const inf = splitInfo(k);
    const g = (S && (S[k] === 1 || S[k] === 2)) ? S[k] : 0;
    const row = el('div', 'ms-row ms-row-static');
    const ic = el('span', 'ms-tile sm');
    ic.innerHTML = icon(inf.sub.icon || 'book', 15);
    ic.style.background = tileGrad(k);
    const body = el('span', 'ms-body');
    const nm = el('b'); nm.textContent = dispName(k);
    const sub2 = el('span'); sub2.textContent = g ? (inf.lbls[g - 1] + ' · ' + String(inf.tch[String(g)] || '')) : 'не обрано';
    body.append(nm, sub2);
    const badge = el('span', 'ms-badge'); badge.textContent = g ? (g + ' гр.') : '—';
    row.append(ic, body, badge);
    rows.appendChild(row);
  });
}

// ---------------- модальне вікно налаштування груп ----------------
let draft = {};
let optEls = [];
function openGroups() {
  /* 3.4.6: ГАРД ВІД БЛИМАННЯ — під час перевірки бази (settleSync) майстер
     НЕ ВІДКРИВАЄТЬСЯ: ставимо в чергу, і рішення прийде після відповіді
     сервера. Саме цей гард убиває «вікно груп показалось і зникло». */
  if (typeof fhSettling !== 'undefined' && fhSettling) {
    /* 3.4.10: клік під час перевірки бази більше НЕ мовчить — чесний тост,
       майстер відкриється сам після відповіді сервера (fhPendingMaster) */
    fhPendingMaster = true;
    try { toast('перевіряємо дані — групи відкрию за секунду…'); } catch (eTQ) {}
    return;
  }
  draft = {}; optEls = [];
  const rows = byId('gRows');
  if (!rows) return;
  const gc = byId('gCancel');
  if (gc) gc.classList.toggle('hidden', FIRST);       // перший запуск — «Скасувати» немає
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
  if (FIRST) return;                                  // поки групи не збережено — закрити не можна
  const w = byId('gwrap'); if (w) w.classList.add('hidden');
  AUTO_SETUP = false;
}
function groupsOpen() { const w = byId('gwrap'); return !!(w && !w.classList.contains('hidden')); }
function refreshGroups() {
  optEls.forEach(function (o) { o.classList.toggle('on', draft[o._k] === o._v); });
  const keys = splitKeys();
  const done = keys.filter(function (k) { return draft[k] === 1 || draft[k] === 2; }).length;
  const gp = byId('gProg');
  if (gp) gp.textContent = done + '/' + keys.length;   // (лічильник прибрано)
  byId('gSave').disabled = done !== keys.length;
}
function oldKeyMap(s) {
  const o = {};
  for (const ok in OLDKEY) o[ok] = (s[OLDKEY[ok]] === 2) ? 2 : 1;
  return o;
}
function todayIdx2() { const d = todayDow(); return (d >= 1 && d <= 5) ? d - 1 : 0; }
function nextLessonName() {
  const l = nextLessonFull();
  return l ? l.name : 'Урок';
}
function nextLessonFull() {
  resolveLessons();
  const ti = todayIdx2();
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
  syncUp(30);   // 2.8.6: групи летять у хмару МОМЕНТАЛЬНО — більше не губляться
  /* 2.9.2: після збереження — ЗАВЖДИ розклад (якщо майстер відкрився поверх
     розкладу, користувач просто лишається на своїй вкладці «Розклад»). */
  if (first || setupOpen) showMain();
}

// ---------------- сповіщення: інтерфейс + push до хостів ----------------
// 2.8.5: тестове = ПОВНА копія справжнього: заголовок «Скоро почнеться урок»,
// текст «<предмет> починається о HH:MM — через 5 хв (тестове сповіщення)»,
// кнопки «Зайти на урок» / «Ігнорувати» — як у реального сповіщення.
function nextTestLessonName() {
  try {
    const now = new Date();
    const cur = (now.getHours() * 60) + now.getMinutes();
    for (let off = 0; off < 7; off++) {
      const d = new Date(now.getTime() + off * 86400000);
      const dow = ((d.getDay() + 6) % 7) + 1;           // 1..5 = Пн..Пт
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
  /* 3.4.11: тестове сповіщення = ТОЧЬ-В-ТОЧЬ справжнє (просив власник:
     «точь в точь как оригинал даже текст оригинала но только там в скобочках
     тест»). Текст будує JAVA тим самим кодом, що й реальне сповіщення
     (з емодзі предмета), — у кінці «(тест)». Час — за налаштуванням
     NOTIF.min; кнопка «За 1 хвилину» ховається, якщо в налаштуваннях 1 хв.
     3.4.13: НІЧОГО МОВЧАЗНОГО — якщо міст Android недоступний або виклик
     впав, користувач бачить ПОМИЛКУ тостом (скарга: «натискаю тест — і
     просто нема нічого»; тепер жоден збій не лишається невидимим). */
  const name = nextTestLessonName();
  const d = new Date(Date.now() + NOTIF.min * 60000);
  const hh = ('0' + d.getHours()).slice(-2), mm = ('0' + d.getMinutes()).slice(-2);
  /* 3.4.14: посилання тесту — ВИМІСЛЕНЕ (рандомний ID, якого в розкладі
     не буває): кнопка «Зайти» з тесту просто відкриває Zoom, не чіпаючи
     реальні уроки (дзеркально до AndroidHost.testNotif у MainActivity). */
  window.__fhTest = { url: 'https://us05web.zoom.us/j/' + (600000000 + Math.floor(Math.random() * 399999999)), ts: Date.now() };
  if (!window.AndroidHost || typeof AndroidHost.testNotif !== 'function') {
    try { toast('ПОМИЛКА: міст Android недоступний — тест неможливий'); } catch (e0) {}
    return;
  }
  try {
    if (AndroidHost.hasNotifPerm && !AndroidHost.hasNotifPerm()) {
      try { AndroidHost.requestNotifPerm(); } catch (e2) {}
      try { toast('Дозвольте сповіщення Android — і натисніть тест ще раз'); } catch (e3) {}
    }
  } catch (e) {}
  /* тест — СУВОРО ЛОКАЛЬНИЙ (жодної синхронізації); звук — за перемикачем */
  try { AndroidHost.testNotif(name, hh + ':' + mm, String(NOTIF.min), NOTIF.snd ? '1' : '0'); }
  catch (eT) { try { toast('ПОМИЛКА тесту: ' + (eT && eT.message ? eT.message : eT)); } catch (e4) {} }
}
function pushNotifSched(quiet) {   // 3.4.5: quiet=true — розклад із СЕРВЕРА (синк) — не має стріляти за урок у вікні
  resolveLessons();
  /* 3.4.10: ГОЛОВНИЙ ФІКС «Сповіщення не працюють». Раніше items містили
     ЛИШЕ поточний тиждень: у суботу будильник на понеділок вже не ставився
     (днів 6-7 у items не було) — ланцюг сповіщень ВМИРАВ на вихідних, якщо
     застосунок не відкривали. Тепер рахуємо items на 16 днів уперед з
     ЧЕРГУВАННЯМ офлайн/онлайн-тижнів: субота+неділя більше не розрив. */
  const items = [];
  const skipArr = (!NOTIF.off) ? (wkSuppressed(16) || []) : [];
  const skipSet = {};
  skipArr.forEach(function (dsk) { if (dsk) skipSet[String(dsk)] = 1; });
  for (let dd = 0; dd < 16; dd++) {
    const day = new Date(Date.now() + dd * 86400000);
    const dow = ((day.getDay() + 6) % 7) + 1;               // Пн=1 .. Нд=7
    if (dow > 5) continue;                                   // вихідні
    if (!NOTIF.off) {
      const wk = wkType(wkIso(wkMonday(day)));
      if (wk !== 'on') continue;                             // офлайн-тижень
      const dstr = day.getFullYear() + '-' + ('0' + (day.getMonth() + 1)).slice(-2) + '-' + ('0' + day.getDate()).slice(-2);
      if (skipSet[dstr]) continue;                           // канікули/свята
    }
    const dayArr = RES[dow - 1] || [];
    const _dstr = day.getFullYear() + '-' + ('0' + (day.getMonth() + 1)).slice(-2) + '-' + ('0' + day.getDate()).slice(-2);
    const _dayMs = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
    dayArr.forEach(function (l) {
      /* 3.4.17: e — кінець уроку: сповіщення ВИДАЛЯЄТЬСЯ САМЕ, коли урок
         скінчився (Android: будильник fh.expire; ПК: ExpirationTime тоста). */
      /* 3.5.38: СТАБІЛЬНІ ПОЛЯ (d = дата, at = ТОЧНИЙ момент сповіщення
         «початок − N хвилин», epoch ms). Старий Android поля ігнорує;
         NFIRED-виключення як і раніше прибирає вже сповіщені уроки. */
      if (l.t) {
        const _fk = _dstr + '|' + String(l.t);
        if (NFIRED[_fk]) return;
        const _sm = (/^(\d{1,2}):(\d{2})/.exec(String(l.t)));
        const _at = _sm ? (_dayMs + ((+_sm[1]) * 60 + (+_sm[2])) * 60000 - NOTIF.min * 60000) : 0;
        items.push({ dow: dow, t: l.t, e: l.e || '', n: l.name, u: l.url || '', d: _dstr, at: _at });
      }
    });
  }
  const payload = JSON.stringify({
    /* 3.4.10: items вже відфільтровані за чергуванням тижнів — on: NOTIF.on */
    on: NOTIF.on,
    min: NOTIF.min,
    snd: !!NOTIF.snd,
    off: !!NOTIF.off,
    q: !!quiet,
    skip: skipArr,   /* 3.4.10 */
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
  // 2.8.0: звук + тестове сповіщення
  const nSnd = byId('nSnd'), sRow = byId('nSndRow'), tBtn = byId('bTestN');
  if (nSnd) nSnd.checked = !!NOTIF.snd;
  if (sRow) sRow.classList.toggle('hidden', !NOTIF.on);
  const nOff = byId('nOff'), oRow = byId('nOffRow');
  if (nOff) nOff.checked = !!NOTIF.off;
  if (oRow) oRow.classList.toggle('hidden', !NOTIF.on);
  /* 3.4.10: ТЕСТОВЕ СПОВІЩЕННЯ ВИДНЕ ЗАВЖДИ — раніше рядок ховався, поки
     сповіщення вимкнені, і власник не міг його знайти («тест ніде нема») */
  if (tBtn) tBtn.classList.remove('hidden');
}

// ---------------- Firebase: кеш + ліміти + live-оновлення ----------------
let cacheTs = 0, dbOnline = false;   // 3.5.33: старі лічильники Firebase-полінгу знято
function applyDb(db, fromCache) {
  if (!db || typeof db !== 'object') return false;
  let changed = false;
  // вузол може бути об'єктом АБО масивом: RTDB перетворює {"1":x,"2":y} у [null,x,y]
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
    if (JSON.stringify(t) !== JSON.stringify(DBD.teachers)) { DBD.teachers = t; changed = true; }   // 3.5.22: без змін — не перемальовуємо
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
    if (JSON.stringify(t) !== JSON.stringify(DBD.subjects)) { DBD.subjects = t; changed = true; }   // 3.5.22: без змін — не перемальовуємо
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
    if (okCnt && JSON.stringify(t) !== JSON.stringify(DBD.schedule)) { DBD.schedule = t; changed = true; }   // 3.5.22: без змін — не перемальовуємо
  }
  if (db.weeks !== undefined) {                     // 3.4.1: чергування онлайн/офлайн без двох однакових тижнів поспіль
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
  /* 3.5.22: чи прийшла хоча б одна відома вузла (для кешу/dbOnline) */
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
  /* 3.5.22: ФІКС «СТАРІ ІКОНКИ ПРИ ПЕРЕЗАВАНТАЖЕННІ» (просив власник).
     1) Кеш тепер ЗЛИВАЄТЬСЯ: легкі запити (schedule.json / subjects.json)
        більше не витирають інші вузли з fh_cache — раніше pubEarly зберігав
        кеш ВИКЛЮЧНО зі schedule, subjects зникали, і щоразу при старті
        малювалися вбудовані іконки, які «стрибаємо» на адмінські після
        мережевої відповіді.
     2) ПОРІВНЯННЯ: якщо вузол збігається з тим, що вже в DBD, — не
        перемальовуємо взагалі (нічого не блимає, анімації не грають знову). */
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
  }
  if (db.update && typeof db.update === 'object' && db.update.latest !== undefined) {
    // 2.2.2: розсилка тест-оновлення всім прибрана (тест-екран тепер локальний)
  }
  // живе відстеження версії: поки програма відкрита — як тільки в базі з'явиться
  // нова версія (SSE/doFetch), одразу показуємо модалку оновлення
  if (!fromCache && db && typeof db.update !== 'undefined') updFromDb(db.update);
  return changed;
}
/* 3.5.10: РОЗКЛАД — ЩЕ ДО ПЕРШОГО ПОКАЗУ (просив власник: «расписание
   загружалось во время загрузки самого приложения»). Легкий запит
   /schedule.json летить ОДРАЗУ при init — раніше перші дані приходили лише
   з повним /.json у netProbe (а той міг чекати синк акаунта), тож користувач
   бачив вбудований розклад, який через 2-3 с «стрибав» на базовий. Якщо
   відповідь приходить ще під час сплеша — applyDb малює базу завчасно. */
// ================================================================
// 3.5.33 — РОЗУМНА СИНХРОНІЗАЦІЯ (власник: «убери сканирование каждую
// секунду — оно сожрёт весь трафик; обращайся только тогда, когда данные
// реально изменились; максимально минимизируй запросы, кэшируй данные»).
// CLOUDFLARE D1 = ЄДИНИЙ канал даних. Firebase ЗНЯТО з читання даних:
// розклад/предмети/вчителі/тижні/оновлення — 0 запитів на Firebase.
// ЗАМІСТЬ старих pollD1 (5 с) + pollSchedule (2.5 с) + pollSubjects (15 с)
// + netWatchPing (4 с) + syncWatch (5 с) + watchUpdate (25 с) + SSE:
//   • ОДИН мікро-запит кожні 60 с (екран видно) / 5 хв (фон):
//       SELECT key, json_extract(val,'$.rev') AS rev FROM _meta
//       WHERE key IN ('snap','upd')                  — відповідь ~30 байт;
//     + для акаунта кожен 2-й тік — SELECT sts FROM users (~10 байт);
//   • rev('snap') змінився -> ОДИН повний знімок -> applyDb (перемальовує
//     лише те, що справді змінилось);
//   • rev('upd') змінився  -> перевірка app_update -> модалка версії;
//   • кожен 10-й тік — чексум-страховка (~25 байт): ловить зміни, зроблені
//     поза застосунком (сайт-адмінка пише у Firebase-дзеркало);
//   • повернення у вікно — миттєвий тік; «без змін» = 30 байт і спить далі;
//   • старт малюється з fh_cache миттєво + перший знімок ще під час сплеша;
//   • іконки — вбудовані SVG, мережі не потребують взагалі.
// АДМІН-ЗАПИСИ: застосунки пишуть НАПРЯМУ в D1 і піднімають rev('snap')
// (миттєве оновлення всіх пристроїв), потім — дзеркало Firebase для
// старих версій; сайт пише у Firebase, звідки його ловить чексум.
// ================================================================
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
    /* 3.5.35: сайт — знімок ОДНИМ запитом /api/pub?path=all (D1 на боці
       сервера, кеш за ревізією). Бекенд без нового ендпоінта → легасі
       4 запити (1-в-1 як було). */
    try {
      const c2 = (typeof AbortController === 'function') ? new AbortController() : null;
      if (c2) setTimeout(function () { try { c2.abort(); } catch (eA2) {} }, 9000);
      fetch(FH_DB_API + '/api/pub?path=all', { cache: 'no-store', signal: c2 ? c2.signal : undefined })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (j && j.ok && j.data) { cb(JSON.stringify(j.data)); return; }
          d1SnapLegacy(cb);
        })
        .catch(function () { d1SnapLegacy(cb); });
    } catch (eAll) { d1SnapLegacy(cb); }
    return;
  }
  /* старий шлях: 4 запити до легасі-ендпоінта (фолбек) */
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

/* 3.5.33: повний знімок тягнеться ЛИШЕ коли ревізія змінилась */
function d1FetchSnap() {
  d1Snap(function (j) {
    if (j) {
      d1NetUp();
      try { d1Apply(JSON.parse(j)); } catch (eP) {}
    } else d1NetDown();
  });
}

/* --- мікро-тік синхронізації (єдиний цикл живих даних) --- */
function d1Tick() {
  clearTimeout(tickT); tickT = 0;
  if (window.FH_WEB) {
    if (tickBusy) { d1TickSched(); return; }
    tickBusy = true;
    tickN++;
    if (ACC.user && tickN % 2 === 0) { try { syncStsCheck(userKey(ACC.user)); } catch (eSSW) {} }
    /* 3.5.35 РОЗУМНА СИНХРОНІЗАЦІЯ v2: рев-полінг ~50 Б; повний знімок
       (одним запитом /api/pub?path=all) — ЛИШЕ коли ревізія змінилась.
       Бекенд недоступний → тягнемо знімок як раніше (фолбек). */
    webRevTick(function (ch) {
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
  /* 3.5.34: налаштування акаунта (тема, групи, перемикачі) між пристроями —
     теж ~5 с: перевірка sts (~10 байт) Кожний тік застосунка, на сайті — через один. */
  if (ACC.user && (window.FH_WEB ? (tickN % 2 === 0) : true)) { try { syncStsCheck(userKey(ACC.user)); } catch (eSS) {} }
  /* 3.5.34 РЕАЛЬНИЙ ЧАС (~5 с): тік тепер кожні 5 с поки застосунок на екрані
     (у фоні — раз/хв). Мікрозапит ~30 байт; чексум-страховка рідшає — раз/10 хв. */
  const doChk = (tickN % 120 === 4);   /* чексум-страховка ~раз на 10 хв */
  tickBusy = true;
  /* 3.5.35 РОЗУМНА СИНХРОНІЗАЦІЯ v2: ревізія — через бекенд (/api/rev, ~50 Б;
     сервер опитує D1 максимум раз на 4 с ЗА ВСІХ клієнтів), знімок — лише
     при зміні rev. Бекенд спить/недоступний → старий прямий шлях до D1. */
  d1RevVia(function (snapRev, updRev, alive) {
    tickBusy = false;
    if (!alive) { d1NetDown(); d1TickSched(); return; }
    d1NetUp();
    d1RevHandle(snapRev, updRev, doChk);
    d1TickSched();
  });
}
/* ============================================================
   3.5.35 — РОЗУМНА СИНХРОНІЗАЦІЯ v2 (просив власник: «один аккаунт
   обращается к базе и передаёт всем остальным, у Cloudflare лимиты»)
   Ревізію віддає бекенд (/api/rev, ~50 Б): сервер сам опитує D1
   МАКСИМУМ раз на 4 с ЗА ВСІХ клієнтів і тримає знімок у пам'яті.
   Бекенд спить/недоступний → старий прямий шлях до D1 (1-в-1 як було).
   ============================================================ */
let revFailN = 0;
function d1RevVia(cb) {
  const FALL = function () {
    cfExec("SELECT key, json_extract(val,'$.rev') AS rev FROM _meta WHERE key IN ('snap','upd')", [], function (rows) {
      if (!rows) { cb(null, null, false); return; }
      let sr = null, ur = null;
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i]; if (!r || !r.key) continue;
        const rv = parseInt(r.rev, 10) || 0;
        if (r.key === 'snap') sr = rv;
        if (r.key === 'upd') ur = rv;
      }
      cb(sr, ur, true);
    });
  };
  if (typeof fetch !== 'function' || !FH_DB_API) { FALL(); return; }
  let done = false;
  try {
    const ac = (typeof AbortController === 'function') ? new AbortController() : null;
    const to = setTimeout(function () { if (!done) { done = true; if (++revFailN >= 2) { revFailN = 0; } FALL(); } }, 3500);
    fetch(FH_DB_API + '/api/rev', { cache: 'no-store', signal: ac ? ac.signal : undefined })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (done) return; done = true; clearTimeout(to);
        if (j && j.ok && typeof j.rev === 'number') { revFailN = 0; cb(j.rev, (typeof j.upd === 'number') ? j.upd : null, true); return; }
        FALL();
      })
      .catch(function () { if (!done) { done = true; clearTimeout(to); FALL(); } });
  } catch (eRV) { FALL(); }
}
/* спільна логіка ревізій: перший старт / зміна знімка / зміна оновлень / чексум */
function d1RevHandle(snapRev, updRev, doChk) {
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
/* 3.5.35: веб — рев-полінг (/api/rev ~50 Б); знімок лише при зміні rev */
let webRev = -1;
function webRevTick(cb) {
  if (typeof fetch !== 'function' || !FH_DB_API) { cb(true); return; }
  let done = false;
  const ac = (typeof AbortController === 'function') ? new AbortController() : null;
  const to = setTimeout(function () { if (!done) { done = true; cb(null); } }, 6000);
  fetch(FH_DB_API + '/api/rev', { cache: 'no-store', signal: ac ? ac.signal : undefined })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      if (done) return; done = true; clearTimeout(to);
      if (j && j.ok && typeof j.rev === 'number') {
        const ch = (webRev === -1) || (j.rev !== webRev);
        webRev = j.rev;
        cb(ch);
        return;
      }
      cb(null);
    })
    .catch(function () { if (!done) { done = true; clearTimeout(to); cb(null); } });
}

function d1TickSched() {
  clearTimeout(tickT);
  /* 3.5.34: зміни на сервері долітають максимум за ~5 с (власник: «спустя
     секунд пять, ну максимум»). Веб — 8 с (знімок через бекенд — трохи важчий). */
  tickT = setTimeout(d1Tick, document.hidden ? 60000 : (window.FH_WEB ? 8000 : 5000));
}
function d1TickStart() { tickN = 0; d1TickSched(); }
function d1TickNow() { clearTimeout(tickT); tickT = setTimeout(d1Tick, 60); }

/* --- підняття ревізії після адмін-запису (миттєве оновлення всіх) --- */
function d1BumpSnap() {
  if (window.FH_WEB || !cfOk()) return;
  try {
    cfExec("INSERT INTO _meta (key,val) VALUES ('snap','{\"rev\":1}') ON CONFLICT(key) DO UPDATE SET val = json_set(val,'$.rev',COALESCE(json_extract(val,'$.rev'),0)+1)", [], null);
  } catch (eB) {}
}

/* --- прямі записи адмінки в D1 (застосунки). Сайт пише у Firebase --- */
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
function d1SaveDay(dk, arr, cb) {
  if (window.FH_WEB || !cfOk()) { if (cb) cb(false); return; }
  let bad = 0, left = arr.length + 1;
  const step = function () { if (--left <= 0 && cb) cb(bad === 0); };
  cfExec('DELETE FROM schedule WHERE day=?', [dk], function (rd) {
    if (rd === null) bad++;
    step();
    if (!arr.length) { if (bad === 0) d1BumpSnap(); return; }
    arr.forEach(function (it, i) {
      cfExec('SELECT id FROM subject WHERE lower(name)=lower(?)', [it.s], function (rows) {
        if (!rows) { bad++; step(); return; }
        const insRow = function (sid) {
          cfExec('INSERT INTO schedule (day, pos, subject_id, title, t_start, t_end) VALUES (?,?,?,?,?,?) ' +
                 'ON CONFLICT(day,pos) DO UPDATE SET subject_id=excluded.subject_id, title=excluded.title, t_start=excluded.t_start, t_end=excluded.t_end',
                 [dk, i + 1, sid, it.s, it.t, it.e], function (r2) {
            if (!r2) bad++;
            step();
          });
        };
        if (rows[0]) { insRow(rows[0].id); return; }
        cfExec('INSERT INTO subject (name) VALUES (?)', [String(it.s).toLowerCase()], function (r3) {
          if (r3 === null) { bad++; step(); return; }
          cfExec('SELECT id FROM subject WHERE lower(name)=lower(?)', [it.s], function (rows2) {
            if (!rows2 || !rows2[0]) { bad++; step(); return; }
            insRow(rows2[0].id);
          });
        });
      });
    });
    if (bad === 0) d1BumpSnap();
  });
}
function d1SaveWeeks(inverted, cb) {
  if (window.FH_WEB || !cfOk()) { if (cb) cb(false); return; }
  cfExec("UPDATE _meta SET val=? WHERE key='weeks'", [JSON.stringify({ inverted: inverted ? 1 : 0, flips: inverted ? [WK_ANCHOR] : 0 })], function (r) {
    if (r) d1BumpSnap();
    if (cb) cb(!!r);
  });
}

/* 3.5.27: перевірка оновлень з D1 (app_update: id=1 release, id=2 beta).
   ВЛАСНИК 26.10: бета — ЛИШЕ адмінам із перемикачем «Бета-версії»;
   звичайні акаунти отримують тільки останній реліз, навіть якщо бета новіша.
   3.5.33: виклик ЛИШЕ коли rev('upd') змінився або раз на 15 хв; на сайті —
   легкий статичний latest.json (бекенд /api/update важить десятки МБ). */
function d1UpdateCheck() {
  const use = function (u) {
    if (!u || u.latest === undefined || u.latest === null) return;
    if (String(u.latest) === d1UpdLast) return;   /* без змін — не турбуємо updFromDb */
    d1UpdLast = String(u.latest);
    let notes = u.notes;
    try { notes = (typeof notes === 'string') ? JSON.parse(notes) : notes; } catch (eN) { notes = []; }
    /* 3.5.34 ФІКС «версія оновлення 30501 / оновлення нижче поточної»:
       канал, у якому знайдено версію, ЇДЕ ДАЛІ в updCheck (раніше губився —
       завантажувач шукав файл спершу в release і брав кореневий
       FluxHelper.apk сайту = стабільна 3.5.1, versionCode 30501). */
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
    /* ДВА КАНАЛИ в app_update — вибір за роллю (betaAllowed):
       адмін + бета-перемикач -> новіша з (release, beta); решта -> release */
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

/* 3.5.33: перший знімок — ще під час сплеша (старт миттєвий, дані вже з D1) */
function pubEarly() {
  try {
    if (window.FH_WEB) return;   /* 3.5.33: сайт — webProbe тягне знімок одразу після ініту */
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

/* 3.4.10: фоновий нагляд за інтернетом — 3.5.33: ПАСИВНИЙ (без запитів) */

// ---------------- система оновлень ----------------
// Firebase /update = { latest: "X.Y.Z", notes: ["+ ...", "- ..."] } — пише deploy-скрипт.
// Програма порівнює latest із своєю версією; якщо відрізняється і папка
// versions/<v>/ реально є на GitHub — показує МОДАЛКУ, яку не можна закрити,
// і встановлює нову версію (PC: exe сам себе замінює; телефон: APK-інсталятор).
const DEFAULT_REPO = 'matviikobrys2707/FluxHelper';
let UPDATE_REPO = DEFAULT_REPO;
try { const _r = localStorage.getItem('fh_repo'); if (_r) UPDATE_REPO = _r; } catch (e) {}
let UPD = { avail: false, ver: '', busy: false, pending: '', watch: 0, dbNotes: null, dbVer: '', apkMd5: '', exeMd5: '', test: false };
function verCmp(a, b) {
  const p = String(a).split('.'), q = String(b).split('.');
  for (let i = 0; i < 3; i++) {
    const x = parseInt(p[i], 10) || 0, y = parseInt(q[i], 10) || 0;
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}
/* 3.4.19: ТЕРПИМЕ ПОРІВНЯННЯ ВЕРСІЙ — latest.json може бути записаний і як
   «3.5», і як «3.5.0» (власник пише «будет версия 3.5.0», але хай система
   ніколи не ламається від короткої форми). normVer доводить до X.Y.Z:
   «3.5» -> «3.5.0», «3.5.0.1» -> «3.5.0», сміття -> '' (перевірка тихо
   пропускається). Усі гейти оновлень тепер normalized — коротка форма
   у latest.json НЕ ЛАМАЄ ланцюжок «реліз -> сповіщення всім -> завантаження». */
function normVer(v) {
  const s = String(v == null ? '' : v).trim();
  if (!/^\d+(\.\d+){0,3}$/.test(s)) return '';
  const p = s.split('.');
  while (p.length < 3) p.push('0');
  return p.slice(0, 3).join('.');
}
function updOpen() { return UPD.avail; }
function parseNotes(txt) {
  return String(txt || '').split(/\r?\n/).map(function (s) { return s.trim(); })
    .filter(function (s) { return s.length > 0; }).slice(0, 24);
}

// ---------------- 3.5.1: «ЩО НОВОГО» ----------------
// Після оновлення (перший запуск нової версії) програма зустрічає
// користувача віконцем зі списком змін. Маркери: + додали, − прибрали,
// / переділали, ✦ виправили. Показ РІВНО ОДИН РАЗ на версію
// (fh_wn_seen у localStorage) і тільки коли користувач справді увійшов
// у програму — гейт входу, модалка оновлення і екран завантаження мають
// пріоритет. Третій елемент пункта ('pc'/'android') — показувати лише
// на одній платформі; без нього — на обох.
const WHATS_NEW = {
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
    ['✦', 'LIQUID GLASS — скло тепер темне (як нижня панель) і ОДНАКОВЕ на телефоні, сайті і ПК', '/'],
    ['✦', 'ВКЛАДКИ ДНІВ Пн–Пт — окремі скляні плашки з відступами, не злиті', '/'],
    ['✦', 'Світла тема доведена: без «біле на білому», читабельні шрифти', '/'],
  ],
  '3.5.36': [
    ['✦', 'ГАРАНТОВИЙ ФІКС: виправлено запуск програми на телефоні — версія 3.5.35 могла не відкриватися; ця версія запускається стабільно', '/'],
    ['/', 'Радимо встановити одразу: скачайте APK із сайту ( fluxhelper.pages.dev ) і поставте поверх — усі дані залишаться', '/'],
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
    ['✦', 'ТЕМА LIQUID GLASS — тепер РІДКЕ СКЛО ВЕЗДЕ: картки уроків, вкладки, перемикачі, рамки, модалки, шапка і нижня панель — скляне тіло, обідок, спекулярні відблиски', 'phone'],
    ['/', 'КАБІНЕТ уроку — акуратна плашка з нормальним відступом від назви; ЗАРАЗ (зелена рамочка) і ДАЛІ (жовта рамочка) — красиві бейджі, ДАЛІ після номера кабінету', 'phone'],
    ['/', 'Фікс: повторний тап по ВІДКРИТІЙ вкладці панелі більше НЕ запускає анімацію — переліт вкладок лише на справжнє переключення', 'phone'],
    ['/', 'Шапка і шухляда налаштувань — легке скло замість суцільної заливки', 'phone'],
  ],
  '3.5.31': [
    ['/', 'Стандартну, світлу й акцентні теми НЕ ЗМІНЕНО — повний редизайн має ЛИШЕ тема Liquid Glass'],
    ['/', 'Анімація перемикачів («Додаток ↔ Браузер», групи, дні) працює в усіх темах — вигляд кнопок як і раніше'],
    ['/', 'Дрібні виправлення оформлення після 3.5.30']
  ],
  '3.5.30': [
    ['/', 'Фікс: нижня панель більше НЕ падає вниз і не зникає при перемиканні вкладок — знайдено і знесено причину (вʼюпорт розширювався під час анімації перельоту)'],
    ['/', 'Тема Liquid Glass на телефоні — тепер СПРАВЖНЄ СКЛО: щільне затемнення панелі, текст за нею більше не читається'],
    ['+', 'КАБІНЕТИ уроків на картках: у тиждень офлайн видно номер класу (для предметів із групами — кабінет ТВОЄЇ групи)'],
    ['/', 'Картки уроків компактніші (94px замість 108px), а ЗАРАЗ/ДАЛІ переїхали в рядок назви — вчитель і час більше ніколи не обрізаються'],
    ['/', 'Перемикачі з анімацією: «Додаток ↔ Браузер», групи, таби адмінки і дні тижня — підсвітка плавно ЇЗДИТЬ між опціями'],
    ['/', 'Кнопки в стилі Liquid Glass: скляне тіло, обідок, що крутиться при наведенні, «фізичне» натискання'],
    ['/', 'Шапка компактніша — більше місця для уроків']
  ],
  '3.5.29': [
    ['/', 'Нижня панель стала прозорішою: розмиття зменшено — за склом реально видно картки розкладу, під панеллю з\u2019явилось легке затемнення'],
    ['/', 'Нова анімація вкладок: підсвітка-«пилюля» плавно їздить між кнопками, а сама вкладка перелітає з боку кнопки, яку натиснув (що далі — то довший переліт)'],
    ['+', 'Зажми вкладку в нижній панелі й веди пальцем по кнопках — підсвітка їде за пальцем, відпусти на потрібній — вона відкриється'],
    ['/', 'З кнопковою навігацією (квадрат-кружок-трикутник) панель тепер піднімається ближче до системних кнопок — великий відступ зник'],
    ['✦', 'Вхід через Google більше не вибиває з програми і не перекидає на сайт, поки ти вибираєш акаунт — таймер фолбеку чекає в 4 рази довше']
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
    ['/', 'Нижня панель на телефоні піднята ще трохи вище від краю — ~0.45 см', 'phone'],
    ['/', '«Пристрой» — лише ім\u2019я пристрою без іконки: Телефон (Android), Комп\u2019ютер (Windows) тощо'],
    ['+', 'Налаштування: рамка «Копіювання посилання на урок» з перемикачем — затисни урок у розкладі, на ПК — ПКМ'],
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
    ['/', 'Нижня панель трохи піднята від краю; відступ від останнього елемента до панелі тепер однаковий в усіх вкладках', 'phone'],
    ['-', 'Сайт: сповіщення про початок уроку прибрано — ця функція лише в застосунках Android і Windows'],
    ['-', 'Сайт для Mac: кнопки «Згорнути»/«Закрити» прибрано — вони потрібні лише програмі Windows']
  ],
  '3.5.13': [
    ['/', 'Панель знизу по темах: темна — темніша, світла — світла, а «прикольний» фіолетовий колір переїхав у Liquid Glass', 'phone'],
    ['/', 'Назви уроків більше не скорочуються — довга назва переноситься на другий рядок'],
    ['✦', 'Фіолетовий градієнт фону — як на сайті; Liquid Glass перероблено на справжнє скло iOS 26']
  ],
  '3.5.12': [
    ['/', 'Панель знизу просто накладається: уроки видно крізь скло до самого низу — жодної чорної смуги на Розкладі', 'phone'],
    ['/', 'Картки уроків — як у застосунку: назва + чіп у першому рядку, час і вчитель у другому, все рівненько']
  ],
  '3.5.11': [
    ['/', 'Нижня панель більше НІКОЛИ не чорніє: нове градієнтне скло однакове в усіх вкладках', 'phone'],
    ['/', 'Іконки вкладок повернені до контурних (без заливки)', 'phone'],
    ['✦', 'Розклад підтягується з бази ще на екрані завантаження — без «стрибка» даних']
  ],
  '3.5.6': [
    ['✦', 'Фікс входу через Google: на мобільному інтернеті програма більше ніколи не перекидає в браузер'],
    ['/', 'Нижня панель — новий дизайн як у Telegram: округлена панель, порядок Розклад, Адмін, Налаштування, Профіль', 'phone'],
    ['/', 'На кнопці «Профіль» видно аватарку твого акаунта', 'phone'],
    ['✦', 'Зміни з веб-версії для айфона тепер доходять навіть після перезапуску програми']
  ],
  '3.5.5': [
    ['/', 'Оновлення тепер качаються з нашого сайту — швидше і без помилок GitHub', 'phone'],
    ['/', 'Якщо завантаження не вдалося — є «Повторити знову» і «Завантажити оновлення вручну»', 'phone'],
    ['+', 'Синхронізація стала повною: групи, сповіщення, Zoom, тема і перемикач синку — однакові всюди']
  ],
  '3.5.4': [
    ['/', 'НОВЕ ТЕСТОВЕ МЕНЮ: панель знизу — Розклад, Налаштування, Профіль і Адмін завжди в один дотик', 'phone'],
    ['/', '«ДАЛІ» біля наступного уроку тепер у помаранчевій рамці — видно з першого погляду', 'phone'],
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
/* 3.5.20: ЧЕНДЖЛОГ ТІЛЬКИ ДЛЯ ТВОГО ПРИСТРОЮ (просив власник: «в списку
   оновлень — тільки оновлення для моєї версії: на телефоні (Android) лише
   Android, на комп'ютері (Windows) лише Windows, і так само для сайту на
   iPhone і Mac»). Мітки пунктів (третій елемент):
     'phone'   -> телефонні платформи: Android-застосунок + сайт iPhone
     'pc'      -> комп'ютерні платформи: Windows-програма + сайт Mac
     'android' -> лише Android-застосунок;  'iphone' -> лише сайт iPhone
     'windows' -> лише Windows-програма;    'mac'    -> лише сайт Mac
     без мітки -> усі платформи. */
const WN_PLAT = (function () {
  const web = !!window.FH_WEB;
  if (!web) return ANDROID ? 'android' : 'windows';   // застосунки: APK / EXE
  /* Сайт: webhost імітує AndroidHost НАВІТЬ на сторінці /mac/, тож прапорець
     ANDROID тут бреше. Надійне джерело — шлях сторінки: /mac/ -> mac */
  var macPage = /\/mac(\/|$)/.test(String(location.pathname || ''));
  return macPage ? 'mac' : 'iphone';
})();
const WN_SITE_BETA_ONLY = { '3.5.20': 1, '3.5.21': 1, '3.5.22': 1, '3.5.23': 1 };   // на сайті цю версію анонсуємо лише бета-адмінам
function wnShowItem(tag) {
  if (!tag) return true;
  if (tag === 'phone') return (WN_PLAT === 'android' || WN_PLAT === 'iphone');
  if (tag === 'pc') return (WN_PLAT === 'windows' || WN_PLAT === 'mac');
  return tag === WN_PLAT;
}
function wnCheck() {
  if (wnShown) return;
  if (updOpen() || UPD.pending) { wnSchedule(1500); return; }   // модалка оновлення — почекаємо
  const items = WHATS_NEW[APP_VER];
  if (!items || !items.length) return;
  try { if (localStorage.getItem('fh_wn_seen') === APP_VER) return; } catch (e) { return; }
  /* 3.5.20: САЙТ — анонс версії, що живе в бета-режимі, бачить лише бета-адмін
     (звичайний користувач отримує релізну поведінку — нових функцій у нього
     не з'являється, тож нічого й не анонсуємо) */
  if (window.FH_WEB && WN_SITE_BETA_ONLY[APP_VER] && !FH_BETA()) return;
  const list = byId('wnList');
  if (!list) return;
  let h = '';
  for (let i = 0; i < items.length; ++i) {
    const it = items[i];
    if (!wnShowItem(it[2])) continue;   // 3.5.20: пункт лише для моєї платформи
    h += '<div class="wn-row ' + wnMark(it[0]) + '"><span class="wn-mark">' + it[0] + '</span><i>' + it[1] + '</i></div>';
  }
  if (!h) return;   // для цієї платформи змін немає
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

// плавний показ головного екрана (дозволено лише один раз і без відкритої модалки)
// 3.4.6: З АКАУНТОМ головний екран показується ТІЛЬКИ після перевірки даних
// на сервері (settleSync ставить dataVerified). Поки перевірка не завершилась —
// екран завантаження лишається на 88% і повзе далі лише після відповіді.
function revealNow() {
  if (bootRevealed || updOpen()) return;
  if (ACC.user && !dataVerified) {
    /* 3.5.26: ШВИДКИЙ СТАРТ (просив власник: «щоб не чекати завантаження
       щоразу при перезавантаженні») — якщо є СВІЖИЙ кеш (менше 24 год),
       показуємо інтерфейс ОДРАЗУ з кешованими даними, а перевірку сервера
       доводимо тихо у фоні; якщо сервер скаже інше — sync усе виправить. */
    try {
      const c0 = JSON.parse(localStorage.getItem('fh_cache') || 'null');
      if (c0 && c0.ts && (Date.now() - c0.ts) < 86400000) { bootReady = true; return; }
    } catch (e0) {}
    return;   // кешу нема/старий — чекаємо сервер, як раніше
  }
  bootReady = true;
}
function showUpd(v, notes, testMode, pref) {
  UPD.avail = true; UPD.ver = v; UPD.busy = false; UPD.pending = '';
  UPD.test = !!testMode;
  UPD.pref = pref || 'versions/release/';   // 3.4.4: канал, у якому знайдено файл
  const b = byId('boot');
  if (b && !b.classList.contains('hidden')) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 560); }
  hideNetErr();
  /* 3.4.5: модалка оновлення — НАЙГОЛОВНІША. Якщо видно гейт входу (перший
     запуск без акаунта) — прибираємо його, щоб оновлення було видно поверх
     входа (як на ПК), а «Оновити» -> гейт дозволу на встановлення. */
  try { if (typeof gateHide === 'function' && typeof gateIsOn === 'function' && gateIsOn()) { gateHide(); gateLock(false); } } catch (e0) {}
  // 2.3.1: У ПОПАПІ ОНОВЛЕННЯ — ТІЛЬКИ ВЕРСІЇ, без ченджлогу
  // 3.5.5: версія підписана каналом (3.5.5 beta) + плашка каналу
  byId('updOld').textContent = verLabel();
  const uc5 = byId('updChip');
  if (uc5) uc5.textContent = (UPD.pref === 'versions/beta/') ? 'доступна бета-версія' : 'доступне оновлення';
  updErrButtons(false);
  byId('updNew').textContent = v;
  const w = byId('upd');
  w.classList.remove('hidden');
  document.body.classList.add('upd-lock');   // титульна панель поверх модалки (ПК)
  byId('updGo').disabled = false;
  byId('updProg').classList.remove('on');
  byId('upFill').style.width = '0%';
  byId('upPct').textContent = '';
  byId('uStat').textContent = 'готово до встановлення';
}
// чи на GitHub реально є папка versions/<v> (за changelog.txt) -> тоді блокуюча модалка.
// ПОРІВНЯННЯ СТРОГО «новіше»: latest <= поточної -> модалки немає (захист від відкату версії
// на сервері і від ситуації «скачав не той файл» — старіша версія не вважається оновленням).
// 2.3.5: шукаємо APK ОДРАЗУ в 5 місцях — GitHub Releases (найнадійніше, без
// CDN-кешу), raw-CDN і github.com/raw. Вікно оновлення з'явиться, якщо файл
// є хоча б в ОДНОГО джерела: раніше ми питали тільки raw-CDN, і його збій
// (лігація/блокування/шкільний Wi-Fi) мовчки ховав оновлення навіть тоді,
// коли версія на сервері точно більша. Тепер така ситуація неможлива.
function updCheck(latest, pref) {
  latest = normVer(latest);   // 3.4.19: «3.5» теж працює (див. normVer)
  /* 3.5.18: САЙТ — сторінка завжди найсвіжіша, оновлення = перезавантаження */
  if (window.FH_WEB) { revealNow(); return; }
  if (!latest || verCmp(latest, APP_VER) <= 0) { revealNow(); return; }
  if (UPD.avail || UPD.pending === latest) return;
  UPD.pending = latest;
  /* 3.4.4: КАНАЛ — із fetchLatest / d1UpdateCheck. Якщо pref невідомий —
     3.5.34 ФІКС «оновлення нижче поточної (30501)»: для бета-акаунтів
     СПЕРШУ пробуємо beta (раніше першим ішов release, і кореневий файл
     сайту = стабільна 3.5.1 «перемагав» HEAD-перевірку). Звичайні акаунти
     — як і раніше, тільки release. */
  const prefs = (pref && String(pref).indexOf('versions/') === 0)
    ? [String(pref)]
    : (betaAllowed() ? ['versions/beta/', 'versions/release/'] : ['versions/release/']);
  /* 3.4.5: бета-канал — ЛИШЕ адмінам із перемикачем; звичайні акаунти і
     без входу — тільки релізні версії */
  const prefs2 = betaAllowed() ? prefs : prefs.filter(function (p) { return String(p).indexOf('versions/beta/') !== 0; });
  const rel = 'https://github.com/' + UPDATE_REPO + '/releases/download/v' + latest + '/';
  (function probeSrc(si) {
    if (si >= prefs2.length) { UPD.pending = ''; revealNow(); return; }
    const p = prefs2[si];
    const raw = 'https://raw.githubusercontent.com/' + UPDATE_REPO + '/main/' + p + latest + '/';
    const ghr = 'https://github.com/' + UPDATE_REPO + '/raw/main/' + p + latest + '/';
    const cands = [];
    if (p === 'versions/release/') {
      /* 3.5.5: РЕЛІЗ качається З САЙТУ (просив власник — швидше за GitHub,
     без лімітів і blockers): перший кандидат — файл з fluxhelper.pages.dev */
      cands.push('https://fluxhelper.pages.dev/FluxHelper.apk');
      cands.push(rel + 'FluxHelper_v' + latest + '.apk', rel + 'FluxHelper-' + latest + '.apk');
    }
    /* 3.4.13: справжня назва файлу в папці версії — FluxHelper.apk (див.
       versions/beta/<v>/) — тепер ПЕРША в списку: жодних зайвих HEAD,
       попап оновлення з'являється миттєво */
    cands.push(
      raw + 'FluxHelper.apk?_=' + Date.now(),
      raw + 'FluxHelper_v' + latest + '.apk?_=' + Date.now(),
      raw + 'FluxHelper-' + latest + '.apk?_=' + Date.now(),
      ghr + 'FluxHelper.apk',
      ghr + 'FluxHelper_v' + latest + '.apk'
    );
    /* 3.5.7: БЕТА теж першою качається З САЙТУ — fluxhelper.pages.dev
       (Cloudflare) не блокується шкільним Wi-Fi і швидший за GitHub.
       Файл лежить у versions/beta/<v>/FluxHelper.apk. */
    if (p !== 'versions/release/') {
      cands.unshift('https://fluxhelper.pages.dev/' + p + latest + '/FluxHelper.apk?_=' + Date.now());
    }
    (function probe(i) {
      if (i >= cands.length) { probeSrc(si + 1); return; }
      fetch(cands[i], { method: 'HEAD', cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw 0; showUpd(latest, null, false, p); })
        .catch(function () { probe(i + 1); });
    })(0);
  })(0);
}
function updFromDb(u) {
  const latest = normVer(u && u.latest);   // 3.4.19: толерантно до «3.5»
  const notes = (u && Array.isArray(u.notes)) ? u.notes.map(String).slice(0, 24) : null;
  if (notes && notes.length) { UPD.dbNotes = notes; UPD.dbVer = latest; }
  /* 3.4.19: md5 з Firebase-шляху теж підхоплюємо (раніше вони приходили лише
     через handleLatest — SSE/стартова база лишали оновлення без md5) */
  if (typeof (u && u.apk_md5) === 'string' && /^[0-9a-fA-F]{32}$/.test(u.apk_md5)) UPD.apkMd5 = u.apk_md5.toLowerCase();
  if (typeof (u && u.exe_md5) === 'string' && /^[0-9a-fA-F]{32}$/.test(u.exe_md5)) UPD.exeMd5 = u.exe_md5.toLowerCase();
  if (UPD.avail) return;
  // 2.2.2: тільки справжнє оновлення — фейкова розсилка всім прибрана
  if (latest && verCmp(latest, APP_VER) > 0) {
    UPD.test = false;
    /* 3.5.34: канал (_pref) більше НЕ губиться — інакше завантажувач шукав
       файл у release і встановлював стабільну версію поверх бети (30501) */
    updCheck(latest, (u && u._pref) || undefined);
    return;
  }
  revealNow();
}
// --- миттєве відстеження версії: застосунок САМ дивиться на Firebase —
// щойно в базі зміниться update.latest (і зросте) — одразу перевіряємо GitHub
// і показуємо вікно оновлення. Без кнопки «Перевірити» і без перезапуску.
let updWatchBusy = false;
// 2.3.5: три джерела версії по черзі — raw GitHub -> github.com/raw -> Firebase.
// raw-CDN іноді лягає/блокується (шкільний Wi-Fi часто блокує raw.githubusercontent),
// github.com і Firebase живуть на інших серверах — хоч один канал спрацює.
function fetchLatest(cb) {
  /* 3.4.13: ШВИДКА ПАРАЛЕЛЬНА перевірка (просив власник: «при натисканні
     перевірити оновлення воно буде перевіряти не тільки релізнуті версії,
     а ще й бета, швидко, без затримок»). Коли бета-перемикач увімкнено —
     release і beta latest.json летять ОДНОЧАСНО (раніше — строго по
     черзі: спочатку release, потім beta — кожен таймаут додавався до
     попереднього). Беремо НОВІШУ версію з тих, що відповіли; _pref
     веде одразу у правильну папку — жодних зайвих HEAD-проб іншого каналу. */
  const newer = function (j) { const l = normVer(j && j.latest); return !!l && verCmp(l, APP_VER) > 0; };   // 3.4.19: толерантно до «3.5»
  const mark = function (p, j) { try { if (j && typeof j === 'object') j._pref = p; } catch (e) {} cb(j); };
  const rawU = function (p) { return 'https://raw.githubusercontent.com/' + UPDATE_REPO + '/main/' + p + 'latest.json?cb=' + Date.now(); };
  const ghrU = function (p) { return 'https://github.com/' + UPDATE_REPO + '/raw/main/' + p + 'latest.json?cb=' + Date.now(); };
  const okJson = function (j) { return j && typeof j === 'object' && !!normVer(j.latest); };   // 3.4.19
  const firebaseFallback = function () {
    fetch(DB_URL + '/update.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { cb(j); })
      .catch(function () { cb(null); });
  };
  const ghrFallback = function (pref, altPref) {
    fetch(ghrU(pref), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(0); })
      .then(function (j) { mark(okJson(j) && newer(j) ? pref : (altPref || pref), j); })
      .catch(function () {
        if (altPref) {
          fetch(ghrU(altPref), { cache: 'no-store' })
            .then(function (r2) { return r2.ok ? r2.json() : Promise.reject(0); })
            .then(function (j2) { mark(altPref, j2); })
            .catch(firebaseFallback);
        } else firebaseFallback();
      });
  };
  if (betaAllowed()) {
    let rel = null, bet = null, relDone = false, betDone = false, fin = false;
    const pick = function () {
      if (fin || !(relDone && betDone)) return;
      fin = true;
      if (okJson(rel) && okJson(bet)) {
        const c = verCmp(normVer(bet.latest), normVer(rel.latest));   // 3.4.19
        mark(c > 0 ? 'versions/beta/' : 'versions/release/', c > 0 ? bet : rel);
        return;
      }
      if (okJson(bet)) { mark('versions/beta/', bet); return; }
      if (okJson(rel)) { mark('versions/release/', rel); return; }
      ghrFallback('versions/release/', 'versions/beta/');   // raw впав обома — github.com/raw
    };
    fetch(rawU('versions/release/'), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(0); })
      .then(function (j) { rel = j; })
      .catch(function () { rel = null; })
      .then(function () { relDone = true; pick(); });
    fetch(rawU('versions/beta/'), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(0); })
      .then(function (j) { bet = j; })
      .catch(function () { bet = null; })
      .then(function () { betDone = true; pick(); });
    return;
  }
  /* без бети — тільки release (як раніше) */
  fetch(rawU('versions/release/'), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(0); })
    .then(function (j) { mark('versions/release/', j); })
    .catch(function () { ghrFallback('versions/release/', null); });
}
function handleLatest(u) {
  updWatchBusy = false;
  if (!u || typeof u !== 'object') return;
  const latest = normVer(u.latest);   // 3.4.19: толерантно до «3.5»
  if (latest && Array.isArray(u.notes) && u.notes.length) {
    UPD.dbNotes = u.notes.map(String).slice(0, 24);
    UPD.dbVer = latest;
  }
  if (typeof u.apk_md5 === 'string' && /^[0-9a-fA-F]{32}$/.test(u.apk_md5)) UPD.apkMd5 = u.apk_md5.toLowerCase();
  /* 3.4.19: КРИТИЧНО ДЛЯ ПК — окремо запам'ятовуємо exe_md5: на комп'ютері
     качається EXE, і перевірка цілісності має порівнювати саме його md5
     (apk_md5 — це телефонний файл; раніше ПК взагалі не отримував md5) */
  if (typeof u.exe_md5 === 'string' && /^[0-9a-fA-F]{32}$/.test(u.exe_md5)) UPD.exeMd5 = u.exe_md5.toLowerCase();
  if (latest && verCmp(latest, APP_VER) > 0) updCheck(latest, u._pref);
}
function watchUpdate() {
  if (updOpen() || updWatchBusy || document.hidden) return;
  updWatchBusy = true;
  fetchLatest(handleLatest);
}
// --- завантаження + встановлення ---
function setUpdBtn(en) { const b = byId('updGo'); if (b) b.disabled = !en; }
/* 3.5.5: стани помилки завантаження. Замість «Оновити» показуємо два рядки:
   «Повторити знову» (та сама спроба ще раз) і «Завантажити оновлення вручну»
   (перекидає в Chrome на fluxhelper.pages.dev — там APK качається сам). */
function updErrButtons(show) {
  const go = byId('updGo'), rt = byId('updRetry'), mn = byId('updMan');
  if (rt) rt.classList.toggle('hidden', !show);
  if (mn) mn.classList.toggle('hidden', !show);
  if (go) go.classList.toggle('hidden', !!show);
}
function updManUrl() {
  /* ручне завантаження — ЗАВЖДИ з власного сайту (надійніше за GitHub):
   реліз — з кореня, бета — з папки версії */
  return (UPD.pref === 'versions/beta/')
    ? 'https://fluxhelper.pages.dev/versions/beta/' + UPD.ver + '/FluxHelper.apk'
    : 'https://fluxhelper.pages.dev/FluxHelper.apk';
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
  /* 3.5.5: замість кнопки «Оновити» — повтор і ручне завантаження */
  updErrButtons(true);
}
function dlDone() {
  if (!UPD.avail) return;
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
  updErrButtons(false);   // 3.5.5: ховаємо кнопки помилки попередньої спроби
  // --- ТЕСТОВИЙ ЕКРАН ОНОВЛЕННЯ: нічого не качаємо — плавний «прогрес»,
  // і кнопка «Оновити» просто ЗАКРИВАЄ екран (це лише демонстрація вигляду).
  if (UPD.test) {
    byId('updProg').classList.add('on');
    byId('uStat').textContent = 'завантаження…';
    let p = 0;
    const iv = setInterval(function () {
      p += 7 + Math.round(Math.random() * 9);
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        byId('uStat').textContent = 'встановлення…';
      }
      byId('upFill').style.width = p + '%';
      byId('upPct').textContent = p + '%';
    }, 130);
    return;
  }
  if (ANDROID) {
    // 2.3.3: без дозволу на встановлення APK спочатку відкриємо онбординг —
    // інакше скачаний файл «застрягне» без дозволу на установку
    if (!instOk()) { UPD.busy = false; setUpdBtn(true); showInst(); return; }
    // ТЕЛЕФОН (2.2.2): справжнє АВТООНОВЛЕННЯ без Google Play — застосунок САМ
    // качає APK (GitHub) і відкриває системний встановлювач. Один тап.
    byId('uStat').textContent = 'завантаження…';
    if (window.AndroidHost && AndroidHost.upd) {
      try { AndroidHost.upd(JSON.stringify({ v: UPD.ver, repo: UPDATE_REPO, md5: UPD.apkMd5 || '', p: UPD.pref || 'versions/release/' })); return; } catch (e) {}
    }
    // запасний шлях (старий хост): відкриваємо файл у браузері
    byId('uStat').textContent = 'шукаю файл оновлення…';
    const relB = 'https://github.com/' + UPDATE_REPO + '/releases/download/v' + UPD.ver + '/';
    const base = 'https://raw.githubusercontent.com/' + UPDATE_REPO + '/main/' + (UPD.pref || 'versions/release/') + UPD.ver + '/';
    const cands = [relB + 'FluxHelper_v' + UPD.ver + '.apk', relB + 'FluxHelper-' + UPD.ver + '.apk', base + 'FluxHelper_v' + UPD.ver + '.apk', base + 'FluxHelper-' + UPD.ver + '.apk', base + 'FluxHelper.apk', base + 'FluxControl.apk', base + 'Blazix.apk'];
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
  // ПК: застосунок сам качає exe у свою папку, замінює себе і перезапускається
  byId('uStat').textContent = 'готуємо завантаження…';
  /* 3.4.19: БАГ ОНОВЛЕНЬ НА ПК (бета-канал) — у payload НЕ йшли p (канал) і
     md5: нативний код за замовчуванням шукав файл у versions/release/, тому
     бета-оновлення на ПК падало «версію не знайдено на GitHub (404)». Тепер
     передаємо канал (UPD.pref) і md5 САМЕ EXE (exe_md5 — файл ПК інший,
     ніж APK; перевірка цілісності має збігатись із тим, що качається) */
  const payload = JSON.stringify({ v: UPD.ver, repo: UPDATE_REPO, p: UPD.pref || 'versions/release/', md5: UPD.exeMd5 || '' });
  const sent = host('fh:update|' + payload);
  if (sent) {
    // якщо за 25 с жодного прогресу — показуємо помилку
    UPD.watch = setTimeout(function () {
      if (UPD.busy && !byId('upFill').style.width) dlErr('GitHub не відповідає — перевір інтернет');
    }, 25000);
  } else {
    UPD.busy = false;
    setUpdBtn(true);
    byId('uStat').textContent = 'не вдалося запустити завантаження — спробуй ще раз';
  }
}
/* ---------- 3.5.20: ПОЛІТИКА ОФЛАЙН ПЕРЕРОБЛЕНА (просив власник) ----------
   Екран «немає інтернету» ЗНЕСЕНО НАПОВНІСТЬ: більше він НІКОЛИ не
   вискакує сам. Мережа відстежується ПАСИВНО (fhNet.down); старт без
   мережі — екран завантаження просто чекає з тихим ретраєм; а будь-яка
   ДІЯ, якій потрібен інтернет (зайти на урок, вийти з акаунта, скинути
   налаштування, змінити тему), охороняється needOnline() — воно показує
   СПОКІЙНЕ ВІКНО «Немає підключення до інтернету», яке можна закрити. */
let fhNet = { down: false, retryT: 0 };
function fhNetRetry() {            // старт без мережі: тихо пробуємо ще раз за 4 с
  if (fhNet.retryT) return;
  fhNet.retryT = setTimeout(function () {
    fhNet.retryT = 0;
    try { netProbe(false); } catch (eR) {}
  }, 4000);
}
function showNetErr() {            // колишній «екран помилки» -> тепер лише ПАСИВНИЙ стан
  fhNet.down = true;               // needOnline() бачить «мережі нема»
  try {
    if (typeof dataVerified !== 'undefined' && !dataVerified) fhNetRetry();
  } catch (eV) {}
}
function hideNetErr() { fhNet.down = false; }   // мережа відповіла — знімаємо стан
function fhOfflineNow() {
  return (navigator.onLine === false) || fhNet.down;
}
function showOffl() {
  /* 3.5.23: вікно знесено ПОВНІСТЮ (просив власник) — більше ніде
     не з'являється ні в одному додатку; елемент лишено для сумісності */
}
function hideOffl() {
  /* 3.5.23: нічого не ховає — вікна більше нема */
}
/* needOnline(fn): пустити дію лише коли мережа є; інакше — закривне
   спокійне віконце (просив власник: «люба дія без мережі — помилка,
   яку можна закрити») */
function needOnline(fn) {
  /* 3.5.23: вікно «Немає підключення» знесено — дія виконується завжди;
     мережеві збої обробляють механізми ретраїв/outbox, а не попапи */
  if (typeof fn === 'function') fn();
  return true;
}
let netBusy = false;
/* 3.5.18: САЙТ — без екрана помилки: невдалий запуск бази = тихий
   повтор кожні 3 с, доки розклад не приїде. */
function webUpdCheck() {
  /* 3.5.33: оновлення на сайті — ЛЕГКИЙ статичний latest.json
     (бекенд /api/update важить десятки МБ — більше НЕ викликається) */
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
  /* 3.5.33: сайт — D1 через бекенд /api/pub; Firebase не викликається */
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
  /* 3.5.33: стартова перевірка — D1 (Cloudflare) = ЄДИНЕ джерело.
     Firebase з канал даних знято повністю (0 запитів). */
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
      d1UpdateCheck();            // модалка оновлення АБО показ головного
    } else {
      d1NetDown();
      showNetErr();
    }
  });
}

/* =================================================================
   3.4.10: ФОНОВИЙ НАГЛЯД ЗА ІНТЕРНЕТОМ (просив власник).
   Раз на 4 с перевіряємо мережу: navigator.onLine + легкий запит до бази.
   Інтернет зник -> за ~2 с з'являється екран «Немає доступу до інтернету»;
   зв'язок повернувся -> екран сам зникає і дані оновлюються. Стартовий
   netProbe не чіпаємо: наглядач активний лише ПІСЛЯ першої перевірки даних
   (dataVerified), щоб не змагатися з екраном завантаження.
   ================================================================= */
let netWatchT = 0, netWatchBusy = false, netWatchFails = 0, netWatchGraceT = 0;
function netWatchPing() {
  /* 3.5.33: ПАСИВНО — navigator.onLine БЕЗ мережевих запитів (власник:
     мінімум трафіку). Живість бази показують тіки синхронізації. */
  return Promise.resolve(navigator.onLine !== false);
}
function netWatchShow() {
  if (typeof dataVerified === 'undefined' || !dataVerified) return;   // лише після старту
  const neW = byId('neterr');
  if (neW && !neW.classList.contains('hidden')) return;
  if (typeof updOpen === 'function' && updOpen()) return;             // модалка оновлення головніша
  const msg = (navigator.onLine === false)
    ? 'Немає доступу до інтернету — увімкни мережу (Wi-Fi або мобільний інтернет).'
    : 'Немає зв’язку з базою розкладу — перевір інтернет.';
  showNetErr(msg);
}
function netWatchHide() {
  const neH = byId('neterr');
  if (neH && !neH.classList.contains('hidden')) {
    hideNetErr();
    try { d1TickNow(); } catch (eDF) {}   // 3.5.33: свіжі дані одразу після повернення мережі
  }
  netWatchFails = 0;
}
function netWatchTick() {
  if (netWatchBusy) return;
  netWatchBusy = true;
  const hardOff = (navigator.onLine === false);   // 3.4.10: миттєвий сигнал системи
  netWatchPing().then(function (okW) {
    netWatchBusy = false;
    if (okW) { netWatchHide(); return; }
    if (hardOff) { netWatchShow(); return; }   // без грейсу — система вже сказала «офлайн»
    netWatchFails += 1;
    if (netWatchFails === 1) {   // перший збій — 2 с «гратися» на мікрозбої мережі
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
    if (document.hidden) return;            // у фоні не дратаємо батарею/трафік
    netWatchTick();
  }, 4000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) setTimeout(netWatchTick, 400);   // повернувся у вікно — перевірка одразу
  });
}

// =================================================================
//  РЕЖИМ РОЗРОБНИКА: мости запису + статистика + редактор розкладу
// =================================================================
// --- запис у Firebase через хост (AndroidHost.fbPut) або прямий fetch ---
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
function dbPut(path, obj, cb) {
  const body = JSON.stringify(obj === undefined ? null : obj);
  if (ANDROID && window.AndroidHost && AndroidHost.fbPut) {
    let ok = false;
    // ФІКС 2.1.0: AndroidHost.fbPut вимагає суфікс .json (без нього Firebase
    // повертав 404 -> телефони НЕ реєструвались у статистиці пристроїв)
    let p2 = fbEnc(path);
    if (p2.indexOf('.json') < 0) p2 += '.json';
    try { ok = AndroidHost.fbPut(p2, body); } catch (e) {}
    if (cb) cb(ok);
    return;
  }
  const id = 'cb' + (++fbSeq) + '_' + Date.now();
  fbCbs[id] = cb || null;
  if (host('fh:fbput|' + id + '|' + fbEnc(path) + '.json|' + body)) return;
  fetch(DB_URL + fbEnc(path) + '.json', { method: 'PUT', body: body })
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
  if (host('fh:fbdel|' + id + '|' + fbEnc(path) + '.json')) return;
  fetch(DB_URL + fbEnc(path) + '.json', { method: 'DELETE' })
    .then(function (r) { __fhFbResult(id, r.ok); })
    .catch(function () { __fhFbResult(id, false); });
}

// ================================================================
// 2.2.0 — CLOUDFLARE D1 (fluxcontrol): «повільні» дані (профілі,
// налаштування, реєстр пристроїв). Firebase лишає лише real-time
// (оновлення, розклад, нотатки). Account ID підтягується з
// /config/cf (Firebase) або вкладки «Розробник» — до конфігурації
// усе прозоро працює через Firebase, як раніше.
// ================================================================
// 2.2.1 — Cloudflare D1 (fluxcontrol): «повільні» дані (users/settings/devices).
// Account ID і токен ЗАШИТІ В КОД (base64) — налаштовувати нічого не треба.
// Firebase лишається тільки для real-time (оновлення, розклад, сповіщення).
const CF_DB = '89424274-f50b-4931-838e-0d6f384bbc20';
const CF_ACC_DEF = 'fd6013c3a257c7759ff3c15fbb8ac002';
// 2.7.2: токен D1 живе ТІЛЬКИ в Java (XOR+base64) — у HTML його більше немає.
const CF_TOK = '';
let CF_ACC = CF_ACC_DEF;
function cfOk() { return !!window.AndroidHost && typeof AndroidHost.cfq === 'function'; }
let cfSeq = 0;
const cfCbs = {};
// один запит до D1 (POST /d1/database/<id>/query). Телефон — прямий fetch
// (WebView без CORS-обмежень), ПК — через хост (fh:cfq -> WinHTTP).
function cfExec(sql, params, cb) {
  if (!cfOk()) { if (cb) cb(null); return; }
  const id = 'cf' + (++cfSeq) + '_' + Date.now();
  cfCbs[id] = cb || null;
  const payload = JSON.stringify({ sql: sql, params: params || [] });
  const done = function (json) {
    const cb2 = cfCbs[id]; delete cfCbs[id];
    if (!cb2) return;
    let rows = null;
    try {
      const r = JSON.parse(json);
      if (r && r.success && r.result && r.result[0] && r.result[0].results) rows = r.result[0].results;
    } catch (e) {}
    cb2(rows);
  };
  /* 3.4.10: 20с -> 8с — D1 відповідає за 0.2-2с; довший таймаут лишав чорний
     екран завантаження на хвилини при слабкій мережі (fetchRole ретраї множили його) */
  setTimeout(function () { if (cfCbs[id]) { delete cfCbs[id]; if (cb) cb(null); } }, 8000);   // 3.4.10: було 20с
  if (ANDROID && window.AndroidHost && typeof AndroidHost.cfq === 'function') {
    try { AndroidHost.cfq(id, payload); return; } catch (e) { delete cfCbs[id]; }
  }
  if (host('fh:cfq|' + id + '|' + payload)) return;
  done('');
}
// результат від хоста/Java
function __fhCfqResult(id, status, json) {
  const cb2 = cfCbs[id]; delete cfCbs[id];
  if (!cb2) return;
  let rows = null;
  try {
    const r = (typeof json === 'string') ? JSON.parse(json) : json;
    if (r && r.success && r.result && r.result[0] && r.result[0].results) rows = r.result[0].results;
  } catch (e) {}
  cb2(rows);
}
// результат від хоста ПК (викликає C++ після WinHTTP-запиту)
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
  // 2.8.9: ОДНА ТАБЛИЦЯ users = профіль (email, ім'я, Firebase UID) + налаштування
  // (settings JSON, sver/sts) + created (час створення акаунта). Один рядок на аккаунт.
  cfExec('CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, name TEXT, email TEXT, pic TEXT, ts INTEGER, role TEXT DEFAULT \'user\', sync INTEGER DEFAULT 1, beta INTEGER DEFAULT 0, logins INTEGER DEFAULT 0, settings TEXT, sver TEXT, sts INTEGER, created INTEGER)', [], function (r) {
    if (r === null) cfInitTried = false;
  });
  // 2.9.0: СТАРІ ТАБЛИЦІ ЛІКВІДОВАНО (просив власник):
  //   user_settings — налаштування тепер живуть у users.settings (одна таблиця);
  //   devices       — перероблено в нову таблицю device (пристрій + власник +
  //                   його налаштування, WRITE-ONLY, при кожному запуску).
  cfExec('DROP TABLE IF EXISTS user_settings', [], null);
  cfExec('DROP TABLE IF EXISTS devices', [], null);
  // 2.9.0: журнал пристроїв: id, ЧИЙ пристрій (Firebase UID), що це, і
  // ОСТАННІЙ знімок налаштувань. Пишеться при КОЖНОМУ запуску і при кожній
  // зміні налаштувань; НІКОЛИ не читається назад.
  cfExec('CREATE TABLE IF NOT EXISTS device (did TEXT PRIMARY KEY, user_id TEXT, type TEXT, name TEXT, model TEXT, os TEXT, ver TEXT, settings TEXT, first_seen INTEGER, last_seen INTEGER)', [], function (r) {
    if (r === null) cfInitTried = false;
  });
  // 2.8.9: нові колонки users для існуючої бази (ALTER падає тихо, якщо вже є)
  cfExec('ALTER TABLE users ADD COLUMN logins INTEGER DEFAULT 0', [], null);
  cfExec('ALTER TABLE users ADD COLUMN settings TEXT', [], null);
  cfExec('ALTER TABLE users ADD COLUMN sver TEXT', [], null);
  cfExec('ALTER TABLE users ADD COLUMN sts INTEGER', [], null);
  cfExec('ALTER TABLE users ADD COLUMN created INTEGER', [], null);
  /* 3.5.38: версії платформ у users (просив власник): ver_phone / ver_pc —
     остання версія застосунку на телефоні й комп'ютері цього акаунта */
  cfExec('ALTER TABLE users ADD COLUMN ver_phone TEXT', [], null);
  cfExec('ALTER TABLE users ADD COLUMN ver_pc TEXT', [], null);
}
// 2.2.1: дистанційна конфігурація — лише аварійна ротація ключів (без полів у dev-вкладці)
function loadRemoteCfg() { /* 2.7.2: конфіг не потрібен — токен у Java */ }

// --- пристрій у базі (2.9.0) ---
// Реєстр /stats/devices та таблиця devices ЛІКВІДОВАНО (див. d1Init):
// тепер тільки таблиця device — WRITE-ONLY журнал (did, власник, знімок
// налаштувань), оновлюється при кожному запуску (devicePing).
function visitPing() { /* 2.7.2: візити більше нікуди не пишемо — є device */ }
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
    // 2.3.1: Java сама проштовхує повну інформацію у window.__fhDevInfo
    // (onPageFinished) — це ОСНОВНЕ джерело. AndroidHost.devInfo() — запасне.
    try {
      const j = window.__fhDevInfo || {};
      for (const k in j) o[k] = j[k];
    } catch (e) {}
    try {
      const j2 = JSON.parse(AndroidHost.devInfo() || '{}');
      for (const k in j2) if (!o[k]) o[k] = j2[k];
    } catch (e) {}
    if (!o.name) o.name = [o.manufacturer, o.model].filter(Boolean).join(' ') || 'Телефон';
  } else {
    try {
      const j = window.__fhDevInfo || {};
      for (const k in j) o[k] = j[k];
    } catch (e) {}
    if (!o.name) o.name = 'Комп\u2019ютер';
  }
  return o;
}
/* 3.5.20: РАМКА «ПРИСТРІЙ» — ВЛАСНІ іконки платформ (просив власник: «ти
   це зробив — воно максимально криве; спробуй зробити іконку власну, SVG,
   реально красиво»). Кожна ОС — СВОЯ плитка-градієнт + білий гліф
   (як іконки уроків і вкладок): Android — зелений робот, iPhone/iPad —
   синє яблуко (iOS-градієнт), macOS — графітове яблуко, Windows —
   прямий логотип Win11 (4 квадратів), Linux — бурштиновий Тукс.
   Ім'я лишається «Тип (ОС)» (Телефон (Android) тощо). */
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
// ---------- пристрій у базі (2.9.0: таблиця device — WRITE-ONLY) ----------
// КОЖЕН запуск програми пише рядок про цей пристрій: id, ВЛАСНИК (Firebase UID
// аккаунта), ім'я/модель/ОС, версія і ЗНІМОК налаштувань. З таблиці НІКОЛИ
// не читаємо: навіть коли синхронізацію вимкнено, сервер бачить останній
// стан пристрою — але нічого з неї не повертається на пристрій.
let _statBusy = false;
function deviceSnapshot() {
  const g = {};
  for (const ok in OLDKEY) if (S && (S[OLDKEY[ok]] === 1 || S[OLDKEY[ok]] === 2)) g[ok] = S[OLDKEY[ok]];
  return JSON.stringify({ g: g, n: { on: !!NOTIF.on, min: NOTIF.min, snd: !!NOTIF.snd, off: !!NOTIF.off }, z: (typeof ZOOM !== 'undefined' && ZOOM.mode) ? ZOOM.mode : 'app', th: (typeof THEME !== 'undefined') ? THEME : '', t: Date.now(), v: APP_VER, sync: ACC.sync ? 1 : 0 });
}
function deviceWrite() {
  if (!cfOk()) return;
  /* 2.9.1: пристрій пишемо ЛИШЕ коли відомий власник (акаунт) — рядків з
     пустим user_id більше не буде; write-only дзеркало, з нього не читаємо */
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
  /* 3.5.38: ВЕРСІЯ ПЛАТФОРМИ В USERS (просив власник): «в таблиці для
     користувачів дві колонки phone/computer — пишеться його версія». Пишемо
     лише коли версія змінилась (економія квоти D1); на сайті не пишемо —
     cfRoute сайту не пропускає довільні UPDATE, і версія сайту не потрібна. */
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
  // 2.3.1: на телефоні мост може бути ще не готовий у перші мить — чекаємо дані
  if (ANDROID) {
    const probe = function (n) {
      const d0 = collectDevInfo();
      if ((d0.model || d0.os || d0.ram) || n >= 5) { go(); return; }
      setTimeout(function () { probe(n + 1); }, 900);
    };
    probe(0);
    return;
  }
  if (!window.__fhDevInfo) { setTimeout(function () { _statBusy = false; devicePing(); }, 4000); return; }
  go();
}

// ================= АКАУНТ / ВХІД ЧЕРЕЗ GOOGLE (2.7.2, телефон) =================
// Вхід на телефоні: код із сайту. Програма створює ключ у D1, відкриває
// браузер (сайт входу), після входу на сайті забирає профіль із D1.
// На телефоні гейт НЕ примусовий — вхід опційний, з рамки в шухляді.
const SITE_URL = 'https://fluxhelper.pages.dev/';
const ROLEL = { user: 'Користувач', admin: 'Адмін', developer: 'Розробник' };
let ACC = { user: null, role: 'user', sync: true };
let authReady = false, agT = 0, agState = '', syncT = 0, syncLastTs = 0, LAST_NOTIF = null;
let gateAccountGone = false;   // 2.9.1: гейт відкривається через «аккаунт видалено з бази»
try {
  const _u = JSON.parse(localStorage.getItem('fh_user') || 'null');
  if (_u && _u.sub && _u.name) {
    ACC.user = { sub: String(_u.sub), name: String(_u.name), email: String(_u.email || ''), pic: String(_u.pic || '') };
    /* 3.4.9: fid і tok БІЛЬШЕ НЕ ГУБЛЯТЬСЯ при рестарті. Раніше сесія
       відновлювалась без fid -> accBoot робив зайвий запит у базу за ключем
       (SELECT ... WHERE email=?), а для ще НЕЗАРЕЄСТРОВАНОГО акаунта він
       повертав «нема рядка» -> gейт входу, хоч користувач просто закрив
       програму посеред вибору груп. Тепер ключ бази приїжджає із сесією. */
    if (_u.fid) ACC.user.fid = String(_u.fid);
    if (_u.tok) ACC.user.tok = String(_u.tok);
  }
} catch (e) {}
try { ACC.sync = localStorage.getItem('fh_sync') !== '0'; } catch (e) {}
try { syncLastTs = parseInt(localStorage.getItem('fh_sync_ts') || '0', 10) || 0; } catch (e) {}

function staff() { return ACC.role === 'admin' || ACC.role === 'developer'; }
function normRole(r) { if (r === 'development') return 'developer'; return (r === 'admin' || r === 'developer') ? r : 'user'; }

// ================= 2.8.0: ГЕЙТ ВХОДУ (мобайл) =================
// Поки немає акаунта — жодного вмісту, екран не закривається.
let agOutT = 0;
function gateShow() {
  const g = byId('agate'); if (!g) return;
  clearTimeout(agOutT);
  g.classList.remove('hidden', 'ag-out');   // 3.4.0: каскад анімацій переграється заново
  document.body.classList.add('gate-on');
  const lg = byId('agLogo'); if (lg) lg.innerHTML = '<img src="' + LOGO + '" width="64" height="64" style="display:block;border-radius:18px">';
  const b = byId('boot');
  if (b && !b.classList.contains('hidden')) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 480); }
  if (typeof closeDrawer === 'function') { try { closeDrawer(); } catch (e) {} }
  if (typeof closeGroups === 'function') { try { closeGroups(); } catch (e) {} }
}
function gateHide() {
  const g = byId('agate');
  if (!g || g.classList.contains('hidden')) { document.body.classList.remove('gate-on'); return; }
  /* 3.4.0: ПЛАВНЕ зникнення (прозорість + легкий масштаб) замість різкого
     display:none — перехід «гейт -> програма» більше не стрибає */
  g.classList.add('ag-out');
  clearTimeout(agOutT);
  agOutT = setTimeout(function () { g.classList.add('hidden'); g.classList.remove('ag-out'); }, 330);
  document.body.classList.remove('gate-on');
}
function setAgStat(t, cls) { const s2 = byId('agStat'); if (s2) { s2.className = 'ag-stat' + (cls ? ' ' + cls : ''); s2.innerHTML = t || ''; } }
function gateStart() {
  gateShow();
  agState = '';
  /* 2.9.1: якщо аккаунт викидано за відсутності в базі — пояснюємо це
     на екрані входу */
  if (gateAccountGone) {
    gateAccountGone = false;
    setAgStat('Акаунт видалено з бази — увійдіть іншим Google-акаунтом.', 'err');
    const as2 = byId('agSub'); if (as2) as2.textContent = 'Аккаунт недійсний. Увійдіть знову, щоб користуватись програмою.';
  } else {
    setAgStat('');
    const as3 = byId('agSub');
    if (as3) as3.textContent = 'Увійди в акаунт Google — розклад, групи та налаштування житимуть на всіх твоїх пристроях.';
  }
  const gb = byId('agGo'); if (gb) gb.disabled = false;
  const gt = byId('agGoT'); if (gt) gt.textContent = 'Увійти через Google';
  // 2.8.6: ПІДІГРІВ Credential Manager — готує системну плашку акаунтів
  // ЗАЗДАЛЕГИДЬ (поки користувач дивиться на гейт). Клік «Увійти через
  // Google» відкриває Bottom Sheet МАЙЖЕ МИТТЄВО (раніше 5–10 с холодного
  // старту GoogleApi). На ПК це повідомлення просто ігнорується.
  try { if (window.AndroidHost && AndroidHost.prewarm) AndroidHost.prewarm(); } catch (e) {}
}
function gateIsOn() { return document.body.classList.contains('gate-on'); }
function fhRandHex(nBytes) {
  let s = ''; const c = '0123456789abcdef';
  for (let i = 0; i < nBytes * 2; ++i) s += c.charAt(Math.floor(Math.random() * 16));
  return s;
}
let authPollT = 0;
/* ==================== 3.5.38: ЗБЕРЕЖЕННЯ АКАУНТА (просив власник) ====================
   Останній вхід «прив'язується» до Google-профілю в хмарі (ключ rm:<sub> у
   таблиці keys): вхід → out:0, ЯВНИЙ вихід → out:1. Після видалення програми
   й встановлення знову: вхід відновлює акаунт (Google підтверджує профіль сам),
   АЛЕ якщо остання дія був вихід — показуємо підтвердження («нужно заново
   авторизироваться»). Для САЙТУ вимкнено (безпека — просив власник). */
let RM_PENDING = null;
function rmActive() { return ANDROID && !window.FH_WEB; }
function rmKeyOf(sub) { return 'rm:' + String(sub); }
function rememberWrite(sub, out) {
  if (!rmActive() || !sub) return;
  try {
    cfExec('INSERT INTO keys (k, v) VALUES (?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v',
      [rmKeyOf(sub), JSON.stringify({ out: out ? 1 : 0, ts: Date.now() })], null);
  } catch (eRW) {}
}
function rememberIsOut(sub, cb) {
  if (!rmActive() || !sub) { cb(false); return; }
  try {
    cfExec('SELECT v FROM keys WHERE k=?', [rmKeyOf(sub)], function (rows) {
      let out = false;
      try { const j = JSON.parse((rows && rows[0] && rows[0].v) || 'null'); out = !!(j && j.out); } catch (eJ) {}
      cb(out);
    });
  } catch (eRC) { cb(false); }
}
function rmAskConfirm(u2) {
  RM_PENDING = u2;
  const w = byId('rmWrap');
  if (!w) { authAccept(u2); return; }          /* без розмітки — як раніше */
  const inf = byId('rmInfo');
  if (inf) {
    inf.innerHTML = '<div class="ci-tile" style="background:linear-gradient(135deg,#8b5cf6,#6366f1)">' +
      (u2.pic ? '<img src="' + String(u2.pic).replace(/"/g, '') + '" alt="">' : icon('user', 16)) + '</div>' +
      '<div class="ci-t"><b>' + String(u2.name || 'Акаунт').replace(/[<>&]/g, '') + '</b><span>' +
      String(u2.email || '').replace(/[<>&]/g, '') + '</span></div>';
  }
  w.classList.remove('hidden');
}
function rmConfirmYes() {
  const w = byId('rmWrap'); if (w) w.classList.add('hidden');
  const u2 = RM_PENDING; RM_PENDING = null;
  if (u2) { rememberWrite(u2.sub, 0); authAccept(u2); }
}
function rmConfirmNo() {
  const w = byId('rmWrap'); if (w) w.classList.add('hidden');
  const u2 = RM_PENDING; RM_PENDING = null;
  agState = '';
  try { localStorage.removeItem('fh_auth_state'); } catch (eLR) {}
  setAgStat('Вхід скасовано — акаунт залишено невизначеним.', 'err');
  const g3 = byId('agGo'); if (g3) g3.disabled = false;
}
function authPollDb(st) {
  // 2.8.1: канал входу — сайт пише профіль у Firebase auth_cb/<state>,
  // програма опитує цей ключ, поки не прийде профіль (до 4 хв)
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
          // 2.8.3: сайт віддає picture (OpenID) і fid (Firebase UID) — обидва більше не губляться
          const u2 = { sub: String(p.sub), name: String(p.name || 'Користувач'), email: String(p.email || ''), pic: String(p.picture || p.pic || '') };
          if (p.fid) u2.fid = String(p.fid);
          dbDel('/update/auth_cb/' + st);
          /* 3.5.38: після ЯВНОГО виходу вхід вимагає підтвердження */
          rememberIsOut(u2.sub, function (outRm) { if (outRm) rmAskConfirm(u2); else authAccept(u2); });
        } else if (Date.now() - t0 < 240000) {
          authPollT = setTimeout(tick, 1500);
        } else {
          agState = '';
          setAgStat('Час входу вийшов. Натисни «Увійти через Google» ще раз.', 'err');
          const g3 = byId('agGo'); if (g3) g3.disabled = false;
        }
      })
      .catch(function () {
        if (!ACC.user && agState === st && Date.now() - t0 < 240000) authPollT = setTimeout(tick, 2500);
      });
  };
  tick();
}
function authStart() {
  if (agState) return;
  agState = '';
  toast('Відкриваю Google…');
  const gb = byId('agGo'); if (gb) gb.disabled = true;
  setAgStat('<span class="spin"></span>Відкриваю вибір акаунта…');
  // 2.8.2: state зберігається — якщо систему вб'є процес у фоні, після
  // перезапуску опитування продовжиться автоматично (init -> resumeAuthPoll)
  const st = fhRandHex(12);
  agState = st;
  try { localStorage.setItem('fh_auth_state', st); } catch (e) {}
  try { AndroidHost.login(st); authPollDb(st); }
  catch (e) {
    agState = '';
    setAgStat('Не вдалося відкрити вхід. Спробуй ще раз.', 'err');
    const g2 = byId('agGo'); if (g2) g2.disabled = false;
  }
}
/* ==== 2.8.3: реєстрація входу у Firebase Authentication через сайт (fbauth.html)
   + ПОВЕРТАЄМО UID користувача (localId) у callback — він стає ключем у D1 ==== */
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
/* 2.8.9: ключ користувача в D1 = ЛИШЕ Firebase UID (жодних числових ID) */
function userKey(u) {
  // 2.8.9: КЛЮЧ КОРИСТУВАЧА В D1 = ЛИШЕ Firebase UID (напр. OGXI6ddPV7QFqQaJD1YWcNiVT263).
  // Числових ключів (Google sub / 'g:<sub>') більше не існує: без fid — '' і записи
  // пропускаються, доки ensureFid/healFid не здобудуть UID.
  u = u || ACC.user;
  return (u && u.fid) ? String(u.fid) : '';
}
/* 2.8.5: переливаємо роль/синк/бету з ОБОХ старих ключів — і «sub» (2.8.0),
   і «g:<sub>» (2.8.2) — у єдиний ключ Firebase UID, старі рядки видаляємо */
function usersMigrateLegacy(fid) {
  if (!fid || !ACC.user) return;
  const legacySub = String(ACC.user.sub || ''), legacyG = 'g:' + legacySub;
  if (!legacySub) return;
  /* 2.9.1: колонок sub/beta більше нема — міграція = стерти застарілі
     рядки старих ключів. Актуальні дані вже під Firebase UID. */
  cfExec('DELETE FROM users WHERE (user_id=? OR user_id=?) AND user_id != ?',
         [legacySub, legacyG, String(fid)], null);
}
/* ============ 3.4.8: РЕЄСТР «РЯДОК АКАУНТА БАЧИЛИ В БАЗІ» ============
   Ключ = Firebase UID; true = хоча б один SELECT повернув рядок цього
   акаунта. Фундамент фікса «новий акаунт викидає з програми»: доки рядок
   НІРАЗ не прочитано з бази, акаунт НІКОЛИ не вважається «видаленим з
   бази» — можливо, він ще тільки реєструється (cfq кожен запит несе в
   ОКРЕМОМУ потоці, тож SELECT міг обігнати INSERT). */
const FH_SEEN = {};
function fhRowSeen(k) { if (k) FH_SEEN[String(k)] = true; }
function fhRowKnown(k) { return !!(k && FH_SEEN[String(k)]); }
/* ============ 3.4.8: РЕЄСТРАЦІЯ АКАУНТА З ПІДТВЕРДЖЕННЯМ ============
   Користувач: «після входу через Google воно ОДРАЗУ записало дані на
   базу». usersUpsert тепер не просто відправляє INSERT і забуває: після
   запису рядок ЧИТАЄТЬСЯ назад; якщо D1 не відповіла або рядок ще не
   видно (паралельні запити) — повтор до 5 спроб. cb(ok) — ЩОЙНО рядок
   гарантовано існує (true) або спроби вичерпано (false). */
function usersUpsert(u, cb) {
  const k = userKey(u);
  if (!k) { if (cb) cb(false); return; }   // без Firebase UID запису нема — жодних числових ID
  const now = Date.now();
  let tries = 0;
  const write = function () {
    cfExec('INSERT INTO users (user_id, name, email, pic, ts, logins, created, settings, sver, sts) VALUES (?,?,?,?,?,1,?,?,?,?) ' +
           'ON CONFLICT(user_id) DO UPDATE SET name=excluded.name, email=excluded.email, pic=excluded.pic, ts=excluded.ts, logins=COALESCE(users.logins,0)+1',
           [k, (u && u.name) || '', (u && u.email) || '', (u && u.pic) || '', now, now, defaultSettings(), APP_VER, now], function (w) {
      if (w === null && tries < 4) { tries += 1; setTimeout(write, 1200 * tries); return; }   // D1 не відповіла — повторюємо
      cfExec('SELECT user_id FROM users WHERE user_id=?', [k], function (rows) {
        if (rows && rows[0]) { fhRowSeen(k); if (cb) cb(true); return; }
        if (tries < 4) { tries += 1; setTimeout(write, 1200 * tries); return; }   // рядок ще не видно (гонка) — повторюємо
        if (cb) cb(false);
      });
    });
  };
  write();
  if (u && u.fid) usersMigrateLegacy(String(u.fid));
}
/* 2.8.9: стандартний знімок налаштувань для НОВОГО акаунта */
function defaultSettings() {
  /* 2.9.1: СТАНДАРТНІ налаштування нового аккаунта (однаково з ПК):
     сповіщення про початок уроку ВИМКНЕНІ, Zoom через додаток, підтвердження
     вимкнено, групи НЕ вибрані (0), тема стандартна */
  /* 3.4.10: сповіщення УВІМКНЕНІ з народження — новий акаунт має отримувати
     нагадування одразу (був дефолт off -> «уведомления не работают») */
  return JSON.stringify({ g: {}, n: { on: true, min: 5, snd: true }, z: 'app', th: 'standard', cf: 0, bt: 0, t: Date.now(), v: APP_VER, sync: 1 });
}
function accApplyAuth(rows) {
  if (rows && rows[0]) {
    ACC.role = normRole(rows[0].role);
    ACC.sync = (rows[0].sync === 0) ? false : true;
    /* 2.9.1: колонки beta в таблиці більше нема — бета-прапорець живе
       в localStorage пристрою (fh_beta) і читається при старті */
    try { localStorage.setItem('fh_sync', ACC.sync ? '1' : '0'); } catch (e) {}
  }
  refreshAccUI(); applyDevVis();
}

// ================= 3.4.7: ЗАВАНТАЖЕННЯ = ЕКРАН СТАРТУ 1-В-1 =================
// Користувач: «дизайн синхронизации — точь-в-точь як дизайн загрузки самой
// программы… по центру логотип, под низом завантаження, потом поле загрузки,
// проценты пишутся… чтобы была ОДНА загрузка».
// Тепер так і є: іншого оверлея НЕМАЄ взагалі. Вхід в акаунт, старт із живою
// сесією і ручна синхронізація показують ТОЙ САМИЙ екран #boot, що й при
// запуску програми (логотип + назва + полоса прогресу + відсотки). Поки база
// не відповіла — полоса повзе 0 -> 85%; після відповіді (hideDataLoad) —
// дозаповнюється до 100% і плавно зникає, відкриваючи вже зібраний інтерфейс.
let dlMode = false, dlFinishing = false, dlStart = 0;
function showDataLoad(t1) {
  try {
    const b = byId('boot');
    if (!b) return;
    const nm = b.querySelector('.bt-name');
    /* 3.4.8: на екрані завантаження ЗАВЖДИ назва «FluxHelper» — жодних
       «Завантаження»/«Синхронізація» (вимога власника): логотип + назва +
       полоса + відсотки, і нічого зайвого */
    if (nm) nm.textContent = 'FluxHelper';
    if (b.classList.contains('hidden') || b.classList.contains('off')) {
      // стартовий екран уже зник (вхід відбувся пізніше) — показуємо його знову
      b.classList.remove('hidden'); b.classList.remove('off');
      if (bootP >= 100) bootP = 0;
      bootRevealed = false;
    }
    if (!dlMode) { dlMode = true; dlStart = Date.now(); }
    dlFinishing = false;
    // миттєвий скид полоси — без кадру зі старими 100%
    const f0 = b.querySelector('#btFill'), p0 = b.querySelector('#btPct');
    if (f0 && bootP >= 100) f0.style.width = '0%';
    if (p0 && bootP >= 100) p0.textContent = '0%';
    bootRaf(bootLoop);          // цикл міг зупинитись на 100% — перезапускаємо
  } catch (e) {}
}
function hideDataLoad() { try { dlFinishing = true; } catch (e) {} }   // bootLoop сам доведе до 100% і зникне
/* страховка: база відповіла ніяк (мережа померла посеред запиту) —
   за 20 с завантаження зникає само, програма лишається керованою
   (settleSync зазвичай завершується за ~9 с навіть офлайн) */
function dlSafety() { setTimeout(function () { dlFinishing = true; }, 20000); }

/* ============ 3.4.6: ОДИН ЦЕНТР РІШЕННЯ ПІСЛЯ ВІДПОВІДІ СЕРВЕРА ============
   settleSync(cb): тягне знімок акаунта з бази ДО 3 СПРОБ (пауза 1.4 с),
   жодне рішення «розклад чи майстер груп» не приймається до відповіді.
   Поки йде settle — fhSettling=true: openGroups() СТАВИТЬСЯ В ЧЕРГУ.
   Це вбиває обидва баги остаточно:
   1) «показало налаштування груп, а через 5 с зникло» — майстер відкривався
      ДО відповіді бази (локальний кеш порожній), а потім закривався, коли
      приходили групи. Тепер майстер відкривається один раз і ТІЛЬКИ якщо
      база відповіла «груп нема».
   2) «просить налаштувати групи, хоч вони налаштовані на ПК» — рішення
      приймалось за локальними даними/пер-акаунтним кешем до відповіді
      сервера. Тепер ПЕРШОДЖЕРЕЛО — база (3 спроби + дедлайн 9 с). */
var fhSettling = false;      // перевірка бази триває (рішення відкладено)
var fhPendingMaster = false; // openGroups() викликали під час перевірки
var dataVerified = false;    // 3.4.6: стартова перевірка сервера завершена
function settleSync(cb) {
  fhSettling = true;
  let attempt = 0, done = false;
  const t0 = Date.now();
  const fin = function (dec) {
    if (done) return;
    done = true;
    fhSettling = false;
    dataVerified = true;
    try { revealNow(); } catch (eRN) {}   // стартовий екран може завершуватись
    cb(dec);
    /* 3.4.6: майстер, поставлений у чергу під час перевірки — відкриваємо
       ПІСЛЯ рішення, якщо групи таки є (інакше викликач рішення 'master'
       сам відкриє майстер) */
    if (fhPendingMaster && dec !== 'master' && validS(S)) {
      try { openGroups(); } catch (eOG) {}
    }
    fhPendingMaster = false;
  };
  const go = function () {
    if (!ACC.user) { fin('offline'); return; }
    if (done) return;
    if (Date.now() - t0 > 9000) { fin('offline'); return; }   // дедлайн 9 с
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
/* 3.4.6: ЄДИНА ТОЧКА РІШЕННЯ «розклад чи майстер груп» для старту з живою
   сесією. Викликається ТІЛЬКИ колбеком settleSync — тобто ПІСЛЯ відповіді
   бази (або дедлайну). Майстер відкривається один раз і лише якщо база
   сказала «груп нема» — блимання «відкрилось і через 5 с зникло» неможливе. */
function settleDecide(dec) {
  hideDataLoad();
  if (!ACC.user) return;
  if (dec === 'master')        { showMain(true); AUTO_SETUP = true; openGroups(); render(false); }
  else if (S || paccRestore()) { showMain(); render(); }   // 3.4.5: офлайн — пер-акаунтний кеш
  else                         { showMain(true); AUTO_SETUP = true; openGroups(); render(false); }
  /* 3.5.23: вкладка з адреси (#settings/#account/#admin) відновлюється
     ПІСЛЯ рішення старту — інакше перезавантаження на «Профілі»
     перекидало назад на Розклад (синк-продовження кликало showMain) */
  try { if (window.FH_WEB && typeof window.__fhHashApply === 'function') window.__fhHashApply(); } catch (eHA) {}
  try { guardGroups(); } catch (eGGD) {}   // 3.4.10: підстраховка пропозиції груп
}
/* 3.4.10: ГАРАНТОВАНА ПРОПОЗИЦІЯ ГРУП. Єдине правило: акаунт живий + групи
   не налаштовані + майстра на екрані немає -> майстер ВІДКРИВАЄТЬСЯ. Більше
   ніяких «не пропонує налаштувати» ні за яких таймінгів мережі: guard
   викликається з усіх точок рішення І щосекунди-3 наглядачем. */
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
setInterval(guardGroups, 3000);   // 3.4.10: наглядач пропозиції груп
/* 2.8.7: ЄДИНИЙ КЛЮЧ КОРИСТУВАЧА = Firebase UID (fid). Доки fid невідомий —
   добуваємо його ДО перших записів налаштувань: healFid (усиновлення UID за
   поштою з D1) -> fbAuthRegister (обмін токена через сайт). Так ПК і телефон
   завжди пишуть під ОДНИМ ключем — «різні аккаунти» неможливі. */
function ensureFid(cb) {
  if (!ACC.user || ACC.user.fid) { if (cb) cb(); return; }
  healFid(function () {
    if (!ACC.user || ACC.user.fid) { if (cb) cb(); return; }
    if (ACC.user.tok) {
      fbAuthRegister(ACC.user.tok, function (fid) {
        if (fid && ACC.user && !ACC.user.fid) {
          ACC.user.fid = String(fid);
          try { localStorage.setItem('fh_user', JSON.stringify(ACC.user)); } catch (e) {}
        }
        if (cb) cb();
      });
    } else if (cb) cb();
  });
}
function authAccept(u) {
  if (!u || !u.sub) return;
  ACC.user = u;
  rememberWrite(u.sub, 0);   /* 3.5.38: остання дія = вхід (збереження акаунта) */
  try { localStorage.setItem('fh_user', JSON.stringify(u)); } catch (e) {}
  try { localStorage.removeItem('fh_auth_state'); } catch (e) {}
  clearTimeout(agT);
  clearTimeout(authPollT);
  agState = '';
  gateHide();          // 2.8.0: вхід підтверджено — відкриваємо програму
  authReady = true;
  usersUpsert(u);
  refreshAccUI();
  /* 3.4.6: ВАНТАЖЕННЯ 0-100% + РІШЕННЯ ЛИШЕ ПІСЛЯ ВІДПОВІДІ БАЗИ.
     settleSync тягне знімок до 3 спроб; майстер груп відкривається ОДИН
     раз і ТІЛЬКИ якщо база відповіла «груп нема». Жодних рішень за
     локальним кешем до відповіді сервера — баг «показало групи, а через
     5 с зникло» і «просить налаштувати, хоч налаштовано на ПК» неможливі. */
  showDataLoad('Завантаження…', 'перевіряємо акаунт у базі');
  dlSafety();
  settleSync(function (dec) {
    hideDataLoad();
    if (!ACC.user) return;   // вийшли, поки йшла перевірка
    if (dec === 'master')      { showMain(true); AUTO_SETUP = true; openGroups(); }
    else if (dec === 'ok')     { showMain(); render(); }
    else if (S)                { showMain(); render(); }   // офлайн — локальні групи валідні
    else                       { showMain(true); AUTO_SETUP = true; openGroups(); }
    refreshAccUI();
    /* 3.5.23: і тут — повертаємо вкладку з хеша (та сама причина) */
    try { if (window.FH_WEB && typeof window.__fhHashApply === 'function') window.__fhHashApply(); } catch (eHA2) {}
  });
  const rk = userKey(ACC.user);
  /* 3.4.7: швидкий шлях ролі (з ретраями). Основний шлях — settleSync вище:
     syncPull тепер тягне роль у тому самому знімку, що й налаштування,
     і застосовує ЇЇ ПЕРШОЮ. Тут — підстраховка з ретраями, щоб навіть при
     збої обох запитів роль прибула до перезапуску. */
  (function roleFast(n, sub0) {
    if (!rk || !ACC.user || ACC.user.sub !== sub0) return;
    cfExec('SELECT role, sync FROM users WHERE user_id=?', [rk], function (rows) {
      if (!ACC.user || ACC.user.sub !== sub0) return;
      if (rows && rows[0]) { accApplyAuth(rows); }
      else if (rows === null && n < 2) { setTimeout(function () { roleFast(n + 1, sub0); }, 1500); }
    });
  })(0, u.sub);
  // 2.8.7: fid не прийшов із каналу входу (Java-обмін/site-обмін був невдалий) —
  // добуваємо його у фоні; щойно fid приходить — usersUpsert уже ПІД fid +
  // МИТТЄВА міграція g:/sub-рядків (users + user_settings) і перечит ролі.
  if (u.tok && !u.fid) {
    /* 3.4.8: РЕЄСТРАЦІЯ НОВОГО АКАУНТА — СТРОГО ПОСЛІДОВНО. Щойно здобуто
       Firebase UID: СПОЧАТКУ гарантований INSERT (usersUpsert із
       підтвердженням читанням), і ЛИШЕ ПОТІМ читання (syncPull/fetchRole).
       Раніше три запити летили одночасно в ОКРЕМИХ потоках — SELECT міг
       обігнати INSERT, «рядка нема» виглядало як «аккаунт видалено з бази»,
       і користувача викидало посеред вибору груп. Тепер це неможливе. */
    ensureFid(function () {
      if (!ACC.user || ACC.user.fid || ACC.user.sub !== u.sub) return;
      usersUpsert(ACC.user, function () {
        if (!ACC.user || ACC.user.sub !== u.sub) return;
        syncPull(false);
        fetchRole(userKey(ACC.user), function (rows) { if (ACC.user) accApplyAuth(rows); });
      });
    });
  }
  /* 3.4.4: рішення приймає колбек syncPull вище (після відповіді бази) —
     другий syncPull тут більше не потрібен */
  syncWatchStart();     // 2.8.6: реальний час — тема/групи з інших пристроїв доїжджають самі
  toast('Вітаємо, ' + (u.name || 'друзе') + '!');
}
/* 2.9.1: ПЕРЕВІРКА АКТУАЛЬНОСТІ АКАУНТА (однаково з ПК). Якщо D1 ДОСТУПНА,
   а рядка користувача в users більше нема (видалено з бази) — миттєво
   викидаємо: стираємо сліди акаунта, виходимо з Google (AndroidHost.logout
   чистить fh_auth prefs + cookies + стан Credential Manager) і показуємо
   гейт з поясненням — можна увійти ІНШИМ Google-акаунтом. */
function forceAccountGone(quiet) {
  if (!ACC.user) return;
  paccSave();   // 3.4.5: кеш налаштувань аккаунта зберігається, хоч рядок і зник
  ACC.user = null; ACC.role = 'user'; ACC.sync = true;
  syncWatchStop();
  try {
    localStorage.removeItem('fh_user');
    localStorage.removeItem('fh_auth_state');
    localStorage.removeItem('fh_sync_ts');
    localStorage.removeItem('fh_sync');
  } catch (e) {}
  cleanLocalGroups();
  paccClearActive();       // 3.4.5: активні налаштування — стандартні
  reloadLocalSettings();
  NOTIF.on = false; saveNotif();
  try { refreshNotifUI(); refreshZoomUI(); } catch (e) {}
  try { pushNotifSched(true); } catch (e2) {}
  syncLastTs = 0;
  clearTimeout(syncT); clearTimeout(authPollT);
  agState = ''; authReady = false;
  refreshAccUI(); applyDevVis();
  gateAccountGone = !quiet;
  try { AndroidHost.logout(); } catch (e) {}   // fh_auth prefs + cookies + CM state
  gateStart();
  toast('Акаунт видалено з бази — увійдіть знову');
}
/* підтвердження «рядок справді зник» — один повторний запит через 3 с,
   щоб не викинути щойно створений аккаунт у гонці INSERT/SELECT */
let goneChkT = 0;
function confirmAccountGone() {
  if (!ACC.user) return;
  /* 3.4.8: ЗАХИСТ ВІД ХИБНОГО ВИКИДАННЯ. Поки рядок акаунта ніразу не
     прочитано з бази (fhRowKnown=false), «видалено з бази» ВИКЛЮЧЕНО:
     замість викидання — доганяємо реєстрацію (usersUpsert). Викид — лише
     якщо рядок БАЧИЛИ, а повторна перевірка його не знайшла. */
  if (!fhRowKnown(userKey(ACC.user))) {
    if (ACC.user.fid) usersUpsert(ACC.user, null);   // доганяємо реєстрацію нового акаунта
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
function authLogout() {
  /* 3.5.23: без віконця офлайну — вихід працює завжди (3.5.23) */
  paccSave();   // 3.4.5: знімок налаштувань ЦЬОГО аккаунта в кеш (до стирання)
  /* 3.5.38: ЯВНИЙ вихід = акаунт більше не відновлюється сам (rm:<sub>.out=1):
     після перевстановлення вхід потребуватиме підтвердження (rmAskConfirm) */
  try { if (ACC.user && ACC.user.sub) rememberWrite(ACC.user.sub, 1); } catch (eRM1) {}
  ACC.user = null; ACC.role = 'user';
  syncWatchStop();   // 2.8.6: годинник синку зупиняємо одразу
  // 2.8.5: ПОВНЕ стирання акаунта з телефона: профіль, state входу, часовий
  // замок синку, прапорець sync + cookies WebView на Java-стороні
  try {
    localStorage.removeItem('fh_user');
    localStorage.removeItem('fh_auth_state');
    localStorage.removeItem('fh_sync_ts');
    localStorage.removeItem('fh_sync');
  } catch (e) {}
  cleanLocalGroups();   // 2.9.0: наступний аккаунт стартує з ЧИСТИМИ групами (майстер)
  /* 3.4.5: пер-акаунтна ізоляція — активні налаштування (групи, сповіщення,
     Zoom, тема, замок синку) стираються; кеш кожного аккаунта зберігається
     окремо (fh_pacc_<uid>) і не протікає в інші аккаунти. fh_beta НЕ стираємо
     — це адмінський перемикач пристрою. */
  paccClearActive();
  reloadLocalSettings();
  NOTIF.on = false; saveNotif();          // без аккаунта сповіщень нема
  try { refreshNotifUI(); refreshZoomUI(); } catch (e) {}
  try { pushNotifSched(true); } catch (e2) {}   // тихо знімаємо розклад
  try { AndroidHost.logout(); } catch (e) {}   // fh_auth prefs + CookieManager.removeAllCookies
  clearTimeout(syncT);
  clearTimeout(authPollT);
  agState = '';
  authReady = false;
  refreshAccUI(); applyDevVis();
  gateStart();        // 2.8.5: МОМЕНТАЛЬНО гейт — без входу програма недоступна
  toast('Ви вийшли з акаунта');
}
/* ================== 3.4.8: СКИДУВАННЯ НАЛАШТУВАНЬ АКАУНТА ==================
   Кнопка у вкладці «Акаунт» (поруч із «Вийти»). Скидає САМЕ налаштування
   FluxHelper цього акаунта — НЕ дані телефона і НЕ сам акаунт:
   - на сервері пишеться стандартний знімок (групи порожні + мітка rs:1,
     свіжі t/sts) — інші пристрої через syncWatch дізнаються про скидання
     і самі відкриють майстер вибору груп;
   - локально стираються групи й пер-акаунтний кеш (fh_pacc_<uid>), щоб
     старі групи не «відновились» ні за яких обставин;
   - сповіщення/Zoom/тема — стандартні; розклад сповіщень знімається;
   - ОДРАЗУ відкривається обов'язковий майстер вибору груп, як після
     першої реєстрації. Вихід з акаунта НЕ відбувається. */
function resetAccountSettings() {
  /* 3.5.23: без віконця офлайну (знесено повністю) */
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
  try { localStorage.removeItem(paccKey()); } catch (e1) {}   // 3.4.8: кеш акаунта стираємо — інакше paccRestore поверне старі групи
  cleanLocalGroups();
  paccClearActive();
  reloadLocalSettings();
  NOTIF = { on: true, min: 5, snd: true, off: false };   // 3.4.10: дефолт ON
  saveNotif();
  try { refreshNotifUI(); refreshZoomUI(); } catch (e2) {}
  syncLastTs = 0;          // сервер тепер новіший — локальний знімок його не перезапише
  clearTimeout(syncT);     // і НЕ шлемо syncUp: нові групи полетять після збереження майстра
  try { pushNotifSched(true); } catch (e3) {}
  AUTO_SETUP = true;
  showMain(true);
  openGroups();
  try { render(false); } catch (e4) {}
  refreshAccUI();
  toast('Налаштування акаунта скинуто — виберіть групи заново');
}
/* 2.8.5: ЛІКУВАННЯ сесії без fid — шукаємо рядок юзера в D1 за email і
   усиновлюємо його Firebase UID; usersUpsert+migrate після цього самі
   прибирають g:/sub-дублікати — один рядок на пошту. */
function healFid(cb) {
  if (!ACC.user || ACC.user.fid || !ACC.user.email) { if (cb) cb(); return; }
  cfExec('SELECT user_id FROM users WHERE email=? LIMIT 1', [String(ACC.user.email)], function (rows) {
    if (rows && rows[0] && rows[0].user_id) {
      const k = String(rows[0].user_id);
      if (k.length >= 20 && k.indexOf('g:') !== 0 && k !== String(ACC.user.sub || '')) {
        ACC.user.fid = k;
        try { localStorage.setItem('fh_user', JSON.stringify(ACC.user)); } catch (e) {}
      }
    }
    if (cb) cb();
  });
}
function accBoot() {
  refreshAccUI(); applyDevVis();
  if (ACC.user) {
    authReady = true;
    /* 3.4.6: рішення «розклад чи майстер» — ЛИШЕ після відповіді бази
       (settleDecide — єдина точка; ретраї всередині settleSync) */
    healFid(function () {
      // 2.8.9: один ключ — Firebase UID; старих перевірок за числовими ключами нема
      const k = userKey(ACC.user);
      if (!k) {
        /* 3.4.9: ГОЛОВНИЙ ФІКС «закрив програму з майстером — знову просить
           увійти». fid губився при рестарті (не відновився healFid-запитом,
           бо акаунт ще НЕ в базі) -> gateStart -> екран входу, хоч сесія
           жива. Тепер — як на ПК: НЕ викидаємо на вхід; працюємо з локальною
           сесією, fid добуваємо у фоні (ensureFid -> fbAuthRegister);
           щойно з'явиться — підтягнемо роль і синк. Гейт тепер можливий
           ЛИШЕ після реального «виходу» або підтвердженого видалення. */
        ensureFid(function () {
          if (!ACC.user) return;
          const k2 = userKey(ACC.user);
          if (!k2) {
            // мережі/Firebase немає — спроба буде наступного запуску;
            // екран завантаження зникає, показуємо локальні дані
            hideDataLoad();
            dataVerified = true;
            try { revealNow(); } catch (eRV0) {}
            return;
          }
          fetchRole(k2, function (rows) {
            if (!ACC.user) return;
            if (rows && rows[0]) {
              accApplyAuth(rows);
              fhRowSeen(k2);          // 3.4.8: рядок підтверджено
              usersUpsert(ACC.user);
              settleSync(settleDecide);
              syncWatchStart();
            } else if (rows) {
              /* 3.4.8: «рядка нема» ≠ «видалено», доки рядок ніразу не
                 читали (фікс гонки реєстрації) */
              if (fhRowKnown(k2)) {
                hideDataLoad();
                confirmAccountGone();   // рядок справді зник — тоді вже гейт
              } else {
                usersUpsert(ACC.user, function () { if (ACC.user) settleSync(settleDecide); });
                syncWatchStart();
              }
            } else {
              settleSync(settleDecide);   // D1 не відповіла — ретраї всередині
            }
          });
        });
        return;
      }
      /* 2.9.1: ПЕРЕВІРКА АКТУАЛЬНОСТІ — рядка в D1 нема (D1 доступна) =>
         аккаунт видалили з бази: підтверджуємо повторним запитом і
         викидаємо з Google-акаунта (forceAccountGone). */
      /* 3.4.7: fetchRole — з ретраями. Раніше один збій D1 при старті
         залишав акаунт без ролі до НАСТУПНОГО перезапуску (вкладка адміна
         «сама з'являлась» лише після повторного відкриття програми). */
      fetchRole(k, function (rows) {
        if (!ACC.user) return;
        if (rows && rows[0]) {
          accApplyAuth(rows);
          fhRowSeen(k);   // 3.4.8: рядок підтверджено — далі «видалено» можливо
          usersUpsert(ACC.user);
          settleSync(settleDecide);
          syncWatchStart();   // 2.8.6: сесію відновлено — спостерігач у строю
        } else if (rows) {
          /* 3.4.8: рядка НЕМА, але D1 жива. Якщо рядок ніколи не читали —
             це ще не зареєстрований акаунт (гонка INSERT/SELECT), а НЕ
             «видалений»: реєструємо і вирішуємо як звичайний вхід.
             «Видалено» — лише якщо рядок БАЧИЛИ і він зник. */
          if (fhRowKnown(k)) {
            hideDataLoad();
            confirmAccountGone();   // 2.9.1: один повтор, потім викид
          } else {
            usersUpsert(ACC.user, function () { if (ACC.user) settleSync(settleDecide); });
            syncWatchStart();
          }
        } else {
          // rows === null -> D1 не відповіла: ретраї всередині settleSync,
          // після дедлайну — офлайн-показ з локальних даних/кешу аккаунта
          settleSync(settleDecide);
        }
      });
    });
  } else {
    /* 3.5.21: ФІКС «ЗАВИСАННЯ НА 88%» БЕЗ АКАУНТА (просив власник: «если я
       вышел с аккаунта и из данных загружать нечего — почему загрузка минуту
       висит на 88%?»). Раніше bootReady ставився ЛИШЕ коли приходили дані з
       бази (updFromDb -> revealNow): якщо Firebase-дзеркало повільне/заблоковане
       (шкільний Wi-Fi), екран завантаження висів ~хвилину, хоча завантажувати
       було нічого. Тепер: акаунта нема -> перевіряти на сервері нічого ->
       reveal ОДРАЗУ (розклад і так летить фоном і домалюється сам). */
    bootReady = true;
  }
}
/* 3.5.21: СТРАХОВОЧНИЙ СТОРОЖ старту: якщо через 9.5 с reveal досі не стався
   (мертва мережа при живому акаунті, заядла гонка) — відпускаємо екран
   завантаження примусово. Живий акаунт ще не перевірений -> НЕ мішаємось:
   settleSync сам має дедлайн 9 с. Це остання лінія оборони від «висить
   на 88%» у БУДЬ-ЯКІЙ ситуації. */
setTimeout(function () {
  try {
    if (!bootReady && !(ACC.user && !dataVerified)) bootReady = true;
  } catch (eWD) {}
}, 9500);

// ---------- акаунт: UI ----------
function avaHtml(u) {
  if (u && u.pic) return '<img src="' + escH(u.pic) + '" referrerpolicy="no-referrer" alt="">';
  return escH(((u && u.name) || '?').charAt(0).toUpperCase());
}
function refreshAccUI() {
  /* 3.5.38: «Вийти з акаунта» ПОВЕРНЕНО на телефон (просив власник:
     «почему ты на телефоне во вкладке аккаунт убрала кнопку выйти с
     аккаунта? Пожалуйста, верни её»). Керування збереженням акаунта —
     див. remember-мітку rm:<sub> у authLogout/authAccept. */
  try { if (ANDROID && !window.FH_WEB) { const _ro = byId('rowAccOut'); if (_ro) _ro.classList.remove('hidden'); } } catch (eRO) {}
  const da = byId('dwAva'); if (da) da.innerHTML = ACC.user ? avaHtml(ACC.user) : '?';
  // 2.8.6: у шухляді ім'я — великим білим, пошта — сірим дрібнішим
  const dn = byId('dwAccName'); if (dn) dn.textContent = ACC.user ? (ACC.user.name || 'акаунт') : 'Акаунт';
  const ds = byId('dwAccSub'); if (ds) ds.textContent = ACC.user ? (ACC.user.email || 'акаунт Google') : 'увійти через Google';
  const big = byId('acAva'); if (big) big.innerHTML = ACC.user ? avaHtml(ACC.user) : '?';
  /* 3.5.6: ТЕЛЕГРАМ-СТИЛЬ — на кнопці «Профіль» у нижній панелі аватарка
     поточного акаунта (без аватарки — стандартна іконка людини) */
  (function () {
    const bA = byId('bnAva'); if (!bA) return;
    const pic = (ACC.user && ACC.user.pic) ? String(ACC.user.pic) : '';
    const svg = bA.parentElement ? bA.parentElement.querySelector('svg') : null;
    if (pic) {
      if (bA.getAttribute('src') !== pic) { try { bA.src = pic; } catch (eB1) {} }
      bA.classList.remove('hidden');
      if (svg) svg.classList.add('hidden');
    } else {
      bA.classList.add('hidden');
      try { bA.removeAttribute('src'); } catch (eB2) {}
      if (svg) svg.classList.remove('hidden');
    }
  })();
  const nm = byId('acName'); if (nm) nm.textContent = ACC.user ? ACC.user.name : '—';
  const ml = byId('acMail'); if (ml) ml.textContent = ACC.user ? (ACC.user.email || '') : '';
  const rl = byId('acRole');
  if (rl) { const r = ACC.role; rl.textContent = ACC.user ? (ROLEL[r] || r) : '—'; rl.className = 'ac-role r-' + (ACC.user ? r : 'user'); }
  const sc = byId('acSync'); if (sc) sc.checked = !!ACC.sync;
  /* 3.4.5: перемикач бета-оновлень — ВИДНИЙ ЛИШЕ адмінам/розробнику.
     Звичайні акаунти рядка не бачать і бети їм не пропонується. */
  const rb = byId('rowBeta');
  if (rb) {
    const showB = !!ACC.user && staff();
    rb.classList.toggle('hidden', !showB);
    const abv = byId('acBeta');
    if (abv && showB) { abv.checked = !!BETA.on; }   // 3.4.12: значення з бази (синхронізоване)
  }
  /* 3.5.20: бета-режим сайту: клас body.fh-beta вмикає нові елементи
     (.beta-only, картку «Запуск Zoom» на Mac) для бета-адмінів */
  try { document.body.classList.toggle('fh-beta', FH_BETA()); } catch (eFB) {}
  // 3.4.0: живі плитки профілю (остання синхронізація / пристрій / версія)
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
  // 2.8.5: ID користувача більше НЕ показуємо в профілі — ключ (Firebase UID)
  // використовується лише всередині для D1/синку, щоб ніхто не плутався
}
function showAcc() {
  closeDrawer();
  byId('vMain').classList.add('hidden');
  byId('vSetup').classList.add('hidden');
    const _ad3 = byId('vAdmin'); if (_ad3) _ad3.classList.add('hidden');   // 3.3.0
document.body.setAttribute('data-view', 'acc');
  /* 3.5.8: Telegram-стиль — вкладки ПАМ'ЯТАЮТЬ свій скрол (раніше профіль
     щоразу сикався вгору; тепер повертаєшся туди, де зупинився) */
  const v = byId('vAcc'); if (v) v.classList.remove('hidden');
  markNav('acc');
  refreshAccUI();
}

// ---------- синхронізація (D1) ----------
function syncUp(now) {
  if (!ACC.user) return;
  clearTimeout(syncT);
  syncT = setTimeout(function () {
    if (!ACC.user) return;
    const g = {};
    for (const ok in OLDKEY) if (S && (S[OLDKEY[ok]] === 1 || S[OLDKEY[ok]] === 2)) g[ok] = S[OLDKEY[ok]];
    /* 3.4.12: у знімку тепер і «підтверджувати захід» (cf), і бета (bt).
       3.5.5: + r (роль) — сайт на айфоні не бачить D1, роль він читає З ЗНІМКА,
       і перемикач синку теж подорожує (sync). */
    const p = { g: g, n: { on: !!NOTIF.on, min: NOTIF.min, snd: !!NOTIF.snd, off: !!NOTIF.off }, z: (typeof ZOOM !== 'undefined' && ZOOM.mode) ? ZOOM.mode : 'app', th: (typeof THEME !== 'undefined') ? THEME : '', cf: CONFIRM.on ? 1 : 0, bt: BETA.on ? 1 : 0, t: Date.now(), v: APP_VER, sync: ACC.sync ? 1 : 0, r: (ACC.role === 'admin' || ACC.role === 'developer') ? ACC.role : 'user' };
    const k = userKey(ACC.user);
    if (!k) return;   // 2.8.9: без Firebase UID запису нема
    // 2.8.9: налаштування живуть В РЯДКУ КОРИСТУВАЧА (users.settings) — одна таблиця
    cfExec('INSERT INTO users (user_id, settings, sver, sts, email, name, pic, ts) VALUES (?,?,?,?,?,?,?,?) ' +
           'ON CONFLICT(user_id) DO UPDATE SET settings=excluded.settings, sver=excluded.sver, sts=excluded.sts, ' +
           'email=excluded.email, name=excluded.name, pic=excluded.pic, ts=excluded.ts',
           [k, JSON.stringify(p), APP_VER, p.t, (ACC.user.email || ''), (ACC.user.name || ''), (ACC.user.pic || ''), Date.now()], function (rows) {
      if (rows) {
        syncLastTs = p.t; try { localStorage.setItem('fh_sync_ts', String(p.t)); } catch (e) {}
        /* 3.5.3: ДЗЕРКАЛО ВЕБ-ВЕРСІЇ — той самий знімок у Firebase
           (update/web/<uid>). Його читає сайт-застосунок для iPhone
           (fluxhelper.pages.dev/iphone): налаштування з ПК/телефона
           з'являються на сайті, а зміни з сайту — тут (syncWatch). */
        try { dbPut('update/web/' + k, p, null); } catch (eWM3) {}
        deviceWrite();   // 2.9.0: знімок налаштувань пристрою теж оновлюється
      }
    });
  }, now ? 30 : 350);   // 2.8.6: 350 мс замість 1200 — зміни зберігаються миттєво
}
function syncApply(p, force) {
  if (!p || typeof p !== 'object' || !ACC.user) return;
  if (!ACC.sync && !force) return;
  const t = parseInt(p.t, 10) || 0;
  // 2.8.5: КНОПКА «Синхронізувати дані» (force) оминає часовий замок —
  // раніше власний пізніший знімок телефону блокував підтягування теми з ПК
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
        // 2.8.7: групи в хмарі є і вони вже застосовані — майстер більше не обов'язковий
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
  /* 3.4.12: підтвердження заходу і бета з хмари (фікс втрати налаштувань
     при зміні акаунта — точний баг від власника) */
  if (typeof p.cf !== 'undefined') {
    const cfv = (p.cf === 1 || p.cf === true || p.cf === '1');
    if (cfv !== CONFIRM.on) { CONFIRM.on = cfv; saveConfirm(); const cT2 = byId('cOn'); if (cT2) cT2.checked = cfv; ch = true; }
  }
  if (typeof p.bt !== 'undefined' && staff()) {
    const btv = (p.bt === 1 || p.bt === true || p.bt === '1');
    if (btv !== BETA.on) { BETA.on = btv; saveBeta(); ch = true; }
  }
  /* 3.5.5: ПЕРЕМИКАЧ СИНХРОНІЗАЦІЇ тепер теж подорожує зі знімком (просив
     власник): вимкнув синк на сайті/іншому пристрої — тут він вимкнеться сам,
     увімкнув — увімкнеться. Локальні зміни після цього пишуться як sync:0. */
  if (typeof p.sync !== 'undefined') {
    const sv = !(p.sync === 0 || p.sync === false || p.sync === '0');
    if (sv !== ACC.sync) {
      ACC.sync = sv;
      try { localStorage.setItem('fh_sync', sv ? '1' : '0'); } catch (eSY5) {}
      const sc5 = byId('acSync'); if (sc5) sc5.checked = sv;
      refreshAccUI(); ch = true;
    }
  }
  // 2.8.5: тема із хмари — застосовуємо одразу (Liquid Glass з ПК тепер доїжджає на телефон)
  if (p.th && typeof THEME !== 'undefined' && THEME_LIST.indexOf(p.th) >= 0 && p.th !== THEME) { applyTheme(p.th, false); ch = true; }
  if (t > syncLastTs) syncLastTs = t;   // монотонно: force-тягнення старішого знімка не «відкочує» замок
  try { localStorage.setItem('fh_sync_ts', String(syncLastTs)); } catch (e) {}
  // 2.8.7: групи підтверджені хмарою -> майстер закривається сам (навіть без змін).
  // 3.4.6: ЛИШЕ якщо майстер відкрито АВТОМАТИЧНО (AUTO_SETUP) — майстер,
  // відкритий користувачем кнопкою «Мої групи», під час редагування не закривається.
  if (gok && !FIRST && groupsOpen() && typeof AUTO_SETUP !== 'undefined' && AUTO_SETUP) { closeGroups(); AUTO_SETUP = false; }
  /* 3.4.8: МІТКА ПОВНОГО СКИДАННЯ АКАУНТА (rs:1). Кнопка «Скинути налаштування
     акаунта» на ІНШОМУ пристрої пише на сервері стандартний знімок з rs:1 —
     цей пристрій, прочитавши його, стирає локальні групи і відкриває майстер
     вибору груп — як після першої реєстрації (акаунт лишається живим). */
  if (p.rs === 1 && !cloudGroupsOk(p)) {
    if (S || !FIRST) cleanLocalGroups();   // групи стираємо; n/z/th вище застосувались стандартні
    if (!groupsOpen()) {
      AUTO_SETUP = true;
      try { showMain(true); } catch (eRS) {}
      try { openGroups(); } catch (eRS2) {}
      try { render(false); } catch (eRS3) {}
    }
  }
  if (ch) {
    pushNotifSched(true); render(false); if (setupOpen) buildSummary();   // 3.4.5: тихо — серверний знімок не стріляє сповіщеннями
    // 2.8.7: тост «Синхронізовано» прибрано — зміни застосовуються тихо
  }
}
/* 2.9.0: рішення про майстер груп ПРИЙМАЄ ХМАРА, а не локальний кеш.
   Якщо в рядку users груп нема (нулі/порожньо) або рядка ще нема взагалі —
   вікно вибору груп ОБОВ'ЯЗКОВЕ (ПК і телефон однаково), і закрити його
   не можна, поки не натиснеш «Зберегти». Локальні групи минулого аккаунта
   при цьому стираються: новий аккаунт ніколи не наслідує чужі групи.
   Якщо ж у хмарі все заповнено — майстер не з'являється взагалі. */
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
/* ==================== 3.4.5: ПЕР-АКАУНТНІ НАЛАШТУВАННЯ ====================
   Кожен аккаунт має СВОЇ локальні налаштування: при виході активні ключі
   стираються (наступний аккаунт стартує зі стандартних), але знімок лишається
   в кеші fh_pacc_<uid>. При вході спершу відповідає хмара; якщо в хмарі
   нічого нема — відновлюється кеш САМЕ ЦЬОГО аккаунта. Чужі налаштування
   більше НІКОЛИ не протікають в інший аккаунт (баг «вийшов з адмінки,
   зайшов у нн-акаунт — а там його налаштування»). */
/* 3.4.12: + fh_confirm і fh_beta — пер-акаунтні, синхронізуються з базою */
const PSET_KEYS = ['fh_groups2', 'fh_groups', 'fh_notif', 'fh_zoom', 'fh_theme', 'fh_sync_ts', 'fh_confirm', 'fh_beta'];
function paccKey() {
  const k = (typeof userKey === 'function' && ACC.user) ? userKey(ACC.user) : '';
  return k ? ('fh_pacc_' + k) : '';
}
function paccSave() {                       // знімок активних налаштувань -> кеш аккаунта
  const ck = paccKey(); if (!ck) return;
  const snap = { _t: Date.now() };
  PSET_KEYS.forEach(function (k) { try { const v = localStorage.getItem(k); if (v !== null) snap[k] = v; } catch (e) {} });
  try { localStorage.setItem(ck, JSON.stringify(snap)); } catch (e) {}
}
function paccClearActive() {                // активні ключі -> стандартні (кеш не чіпаємо)
  PSET_KEYS.forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
}
function reloadLocalSettings() {            // перечитати активні ключі в пам'ять
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
  /* 3.4.12: підтвердження заходу і бета — теж пер-акаунтні */
  CONFIRM = { on: false };
  try { CONFIRM.on = localStorage.getItem('fh_confirm') === '1'; } catch (eC2) {}
  BETA = { on: false };
  try { BETA.on = localStorage.getItem('fh_beta') === '1'; } catch (eB2) {}
  syncLastTs = 0;
  try { syncLastTs = parseInt(localStorage.getItem('fh_sync_ts'), 10) || 0; } catch (e) {}
  try { if (typeof applyTheme === 'function') applyTheme(THEME, false); } catch (e) {}
  try { saveNotif(); } catch (e) {}
}
function paccRestore() {                    // відновити кеш ЦЬОГО аккаунта (хмара нічого не дала)
  const ck = paccKey(); if (!ck) return false;
  let s = null;
  try { s = JSON.parse(localStorage.getItem(ck) || 'null'); } catch (e) {}
  if (!s || typeof s !== 'object') return false;
  let any = false;
  PSET_KEYS.forEach(function (k) { if (s[k] !== undefined && s[k] !== null) { try { localStorage.setItem(k, String(s[k])); any = true; } catch (e) {} } });
  if (any) reloadLocalSettings();
  return any;
}
/* 3.4.5: бета-оновлення — ЛИШЕ для адмінів/розробника з увімкненим
   перемикачем у вкладці «Акаунт». Звичайні акаунти і без входу — тільки
   релізні версії (бета не перевіряється і не пропонується взагалі). */
function betaAllowed() {
  if (!ACC.user || !staff()) return false;
  return !!BETA.on;   // 3.4.12: значення синхронізується з базою
}
/* 3.4.7: РОЛЬ + СИНК — З РЕТРАЯМИ. Один збій D1 більше не лишає акаунт
   «без ролі» до перезапуску (саме це було джерелом «зайшов в адмінський
   акаунт — а вкладки адміна нема; перезапустив — з'явилась»). */
function fetchRole(k, cb, _n) {
  const n = _n || 0;
  if (!k) { if (cb) cb(null); return; }
  cfExec('SELECT role, sync FROM users WHERE user_id=?', [k], function (rows) {
    if (rows === null && n < 2 && ACC.user) { setTimeout(function () { fetchRole(k, cb, n + 1); }, 1400); return; }
    if (cb) cb(rows);
  });
}
/* 3.5.3: читання ДЗЕРКАЛА налаштувань веб-версії (update/web/<uid>) —
   той самий знімок, що ПК/телефон пишуть у D1 users.settings, а сайт
   fluxhelper.pages.dev/iphone читає/пише цей самий шлях. Синк працює
   між ПК <-> телефон <-> сайт як одна система. */
function webMirrorPull(k, cb) {
  fetch(DB_URL + fbEnc('update/web/' + k) + '.json?cb=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (j) { if (cb) cb(j); });
}
function syncPull(force, cb) {   // 3.4.4: cb(dec) — 'ok' | 'master' | 'offline'; рішення показує той, хто викликав
  if (!ACC.user) { if (cb) cb('offline'); return; }
  const k = userKey(ACC.user);
  if (!k) { if (cb) cb('offline'); return; }   // 2.8.9: читаємо лише за Firebase UID (healFid/fbAuthRegister добудують)
  /* 3.4.7: ОДИН ЗАПИТ НЕСЕ І РОЛЬ, І СИНК, І НАЛАШТУВАННЯ. accApplyAuth
     застосовується ПЕРШИМ, ще до рішення «розклад чи майстер» — вкладка
     адміна/перемикачі гарантовано вже на місці при показі інтерфейсу,
     а syncApply бачить правильний ACC.sync (раніше це були ДВА різні
     запити-перегони — і роль могла прибути пізніше за інтерфейс). */
  cfExec('SELECT role, sync, settings, sts FROM users WHERE user_id=?', [k], function (rows) {
    if (!ACC.user) { if (cb) cb('offline'); return; }
    if (rows && rows[0]) { fhRowSeen(k); accApplyAuth(rows); }   // 3.4.8: рядок підтверджено
    if (rows && rows[0]) {
      let p = null;
      try { p = JSON.parse(rows[0].settings); } catch (e) {}
      if (cloudGroupsOk(p)) {
        /* 3.5.6 FIX СИНКУ САЙТ -> ЗАСТОСУНОК: сайт пише знімок у дзеркало
           (update/web/<uid>). Раніше при старті завжди перемагав знімок D1
           (застарілий) — і зміни, зроблені на сайті, зникали. Тепер звіряємо
           t дзеркала з t D1 і застосовуємо НОВІШИЙ знімок. */
        webMirrorPull(k, function (mj) {
          if (!ACC.user) return;
          const mt = (mj && typeof mj === 'object') ? (parseInt(mj.t, 10) || 0) : 0;
          const dt = parseInt(p.t, 10) || 0;
          if (mj && cloudGroupsOk(mj) && mt > dt) syncApply(mj, force);
          else syncApply(p, force);
          if (cb) cb('ok');
          else if (force && !FIRST && S && setupOpen) { showMain(); }
        });
      } else {
        // 3.5.3: груп у D1 нема — можливо, їх налаштували НА САЙТІ:
        // спершу читаємо дзеркало, і тільки потім рішення «майстер»
        webMirrorPull(k, function (mj) {
          if (!ACC.user) return;
          if (mj && typeof mj === 'object' && cloudGroupsOk(mj) && (parseInt(mj.t, 10) || 0) >= (parseInt((p && p.t), 10) || 0)) {
            syncApply(mj, force);
            if (cb) cb('ok'); else if (!FIRST && S) { showMain(); }
            return;
          }
          cleanLocalGroups();
        /* 3.4.5: в хмарі нічого нема -> відновлюємо кеш САМЕ ЦЬОГО аккаунта
           (це його власні налаштування). Якщо в кеші валідні групи —
           аккаунт вважається налаштованим, майстер не показуємо. */
        if (p.rs !== 1 && paccRestore() && validS(S)) {   // 3.4.8: rs:1 — кеш не відновлюємо, майстер обов'язковий
          FIRST = false;
          try { if (groupsOpen()) closeGroups(); } catch (eCR) {}   // 3.4.5: кеш дав групи — майстер більше не потрібен
          if (cb) cb('ok'); else { showMain(); }
        } else if (cb) cb('master');
        else { showMain(true); AUTO_SETUP = true; openGroups(); }
        });
      }
    } else if (rows) {
      // РЯДКА В ХМАРІ НЕМАЄ = ПЕРШИЙ ВХІД ЦЬОГО АККАУНТА — майстер обов'язковий.
      // 3.5.3: але якщо налаштування є в дзеркалі веб-версії — беремо ЇХ
      webMirrorPull(k, function (mj) {
        if (!ACC.user) return;
        if (mj && typeof mj === 'object' && cloudGroupsOk(mj)) {
          syncApply(mj, force);
          if (cb) cb('ok'); else { showMain(); }
          return;
        }
        cleanLocalGroups();
      if (paccRestore() && validS(S)) {   // 3.4.5: пер-акаунтний кеш (повторний вхід без синку)
        FIRST = false;
        try { if (groupsOpen()) closeGroups(); } catch (eCR) {}   // 3.4.5: кеш дав групи — майстер більше не потрібен
        if (cb) cb('ok'); else { showMain(); }
      } else if (cb) cb('master');
      else { showMain(true); AUTO_SETUP = true; openGroups(); }
      });
    } else {
      // rows === null -> D1 недоступна: 3.5.3 — спершу дзеркало веб-версії
      webMirrorPull(k, function (mj) {
        if (!ACC.user) return;
        if (mj && typeof mj === 'object' && cloudGroupsOk(mj)) {
          syncApply(mj, force);
          if (cb) cb('ok'); else if (force && !FIRST && S && setupOpen) { showMain(); }
          return;
        }
        if (cb) cb('offline');
      });
    }
  });
}
/* 2.8.6 → 3.5.33: РЕАЛЬНИЙ ЧАС без Firebase-опитування.
   Раніше syncWatchTick щосекунди читав update/web/<uid> з Firebase
   (власник: «обращается на Firebase» + трафік). Тепер стан акаунта
   дивиться d1Tick: SELECT sts FROM users (~10 байт) кожні 2 хв +
   миттєво після повернення у вікно. Сайт іде через бекенд (/api/sync),
   застосунки — прямо в D1. */
let syncWatchT = 0;
function syncStsCheck(k) {
  if (!ACC.user || !k) return;
  /* 3.5.35 РОЗУМНА СИНХРОНІЗАЦІЯ: відмітка налаштувань — через бекенд
     (/api/sts, кеш 4 с на uid на сервері → D1 читається максимум раз на 4 с
     ЗА ВСІХ пристроїв акаунта). Бекенд недоступний → прямий шлях до D1. */
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
  if (typeof fetch === 'function' && FH_DB_API) {
    let done = false;
    try {
      const ac = (typeof AbortController === 'function') ? new AbortController() : null;
      const to = setTimeout(function () { if (!done) { done = true; stsViaD1(k); } }, 3500);
      fetch(FH_DB_API + '/api/sts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: k }),
        cache: 'no-store',
        signal: ac ? ac.signal : undefined
      }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (done) return; done = true; clearTimeout(to);
        if (j && j.ok) { stsHandle(j.sts, !!j.known, true); return; }
        stsViaD1(k);
      }).catch(function () { if (!done) { done = true; clearTimeout(to); stsViaD1(k); } });
      return;
    } catch (eST) {}
  }
  stsViaD1(k);
}

function syncStsCheckD1Legacy(k) {
  if (!ACC.user || !k) return;
  cfExec('SELECT sts FROM users WHERE user_id=?', [k], function (rows) {
    if (!ACC.user) return;
    /* 3.4.8: D1 відповіла, а рядка НЕМА. Рядок БАЧИЛИ раніше -> аккаунт
       справді видалили (підтвердження + викид). НЕ БАЧИЛИ -> новий акаунт
       ще реєструється: ДОГАНЯЄМО реєстрацію, ніякого викиду. */
    if (rows && !rows[0]) {
      if (fhRowKnown(k)) { confirmAccountGone(); }
      else { usersUpsert(ACC.user, null); }
      return;
    }
    if (rows && rows[0]) fhRowSeen(k);   // 3.4.8: рядок підтверджено
    if (rows && rows[0]) {
      const ts = parseInt(rows[0].sts, 10) || 0;
      if (ts > syncLastTs && ACC.sync) {
        // чужий новіший знімок — тягнемо повністю (syncApply сам оминає свій запис)
        cfExec('SELECT settings FROM users WHERE user_id=?', [k], function (rows2) {
          if (rows2 && rows2[0] && ACC.user) { try { syncApply(JSON.parse(rows2[0].settings), false); } catch (e) {} }
        });
      }
    }
  });
}
function syncWatchStop() { clearTimeout(syncWatchT); syncWatchT = 0; }
function syncWatchTick() {
  /* 3.5.33: миттєве підтягування налаштувань (без самопланування —
     циклом керує d1Tick) */
  if (ACC.user) { try { syncStsCheck(userKey(ACC.user)); } catch (eSW) {} }
}
function syncWatchStart() {
  syncWatchStop();
  if (ACC.user) { try { syncStsCheck(userKey(ACC.user)); } catch (eSW2) {} }
}
/* 3.4.15: МИТТЄВЕ ПІДТЯГУВАННЯ при поверненні з фону/перемиканні вікон —
   налаштування (тема, звуки, підтвердження, групи), змінені на іншому
   пристрої, з'являються ще до першого планового тіка. */
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState !== 'visible') return;
  if (ACC.user) { try { clearTimeout(syncWatchT); syncWatchT = 0; syncWatchTick(); } catch (e) {} }
});

// ---------- розробник (телефон) ----------
function applyDevVis() {
  const s2 = byId('secDev'); if (s2) s2.classList.toggle('hidden', !staff());
  const da = byId('dwAdmin'); if (da) da.classList.toggle('hidden', !admStaff());   // 3.3.0: адмін-панель — лише для ролі з бази
  const ba = byId('bnAdmin'); if (ba) ba.classList.toggle('hidden', !admStaff());   // 3.5.4: вкладка «Адмін» у нижній панелі — теж лише за роллю
}
const DEV = { rel: [], bet: [], busy: false };
function devListVers() {
  if (!staff() || DEV.busy) return;
  DEV.busy = true;
  const box = byId('devVers');
  if (box) box.innerHTML = '<div class="dv-row"><span class="dv-cur">читаю список…</span></div>';
  const done = function () {
    DEV.busy = false;
    const b2 = byId('devVers'); if (!b2) return;
    b2.innerHTML = '';
    const row = function (v, ch) {
      const r = el('div', 'dv-row');
      r.appendChild(el('span', 'dv-v', escH(v)));
      r.appendChild(el('span', 'dv-chip ' + (ch === 'beta' ? 'bet' : 'rel'), ch === 'beta' ? 'бета' : 'реліз'));
      if (v === APP_VER) r.appendChild(el('span', 'dv-cur', 'встановлена'));
      else {
        const bt = el('button', 'b-mini dv-inst', 'Встановити');
        bt.onclick = function () { devInstall(v, ch); };
        r.appendChild(bt);
      }
      b2.appendChild(r);
    };
    DEV.bet.forEach(function (v) { row(v, 'beta'); });
    DEV.rel.forEach(function (v) { row(v, 'rel'); });
    if (!DEV.rel.length && !DEV.bet.length) b2.appendChild(el('div', 'dv-row', '<span class="dv-cur">список недоступний</span>'));
  };
  const gh = function (path, cb) {
    fetch('https://api.github.com/repos/' + UPDATE_REPO + '/contents/' + path + '?cb=' + Date.now())
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (j) { cb(Array.isArray(j) ? j : []); })
      .catch(function () { cb([]); });
  };
  gh('versions/release', function (j) {
    DEV.rel = j.filter(function (x) { return x.type === 'dir' && /^\d+\.\d+\.\d+$/.test(x.name); }).map(function (x) { return x.name; });
    gh('versions/beta', function (jb) {
      DEV.bet = jb.filter(function (x) { return x.type === 'dir' && /^\d+\.\d+\.\d+$/.test(x.name); }).map(function (x) { return x.name; });
      done();
    });
  });
}
function devInstall(v, ch) {
  const pref = (ch === 'beta') ? 'versions/beta/' : 'versions/release/';
  toast('Завантажую ' + v + '…');
  AndroidHost.upd(JSON.stringify({ v: v, repo: UPDATE_REPO, p: pref }));
}
function devInstallLatestBeta() {
  fetch('https://raw.githubusercontent.com/' + UPDATE_REPO + '/main/versions/beta/latest.json?cb=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      const v = normVer(j && j.latest);   // 3.4.19: толерантно до «3.5»
      if (v && verCmp(v, APP_VER) > 0) devInstall(v, 'beta');
      else toast(v ? ('Бета ' + v + ' вже встановлена або старіша') : 'Бета-версій зараз немає');
    })
    .catch(function () { toast('Немає зв\u2019язку з GitHub'); });
}

function escH(s) {
  return String(s || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
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
        refreshPhoneSec();   // 2.3.6: дозвіл надано — ховаємо рамку у налаштуваннях
        toast('Сповіщення увімкнено ✓');
      }
    }
  }, 900);
}

// ---------------- 2.3.3: дозвіл на встановлення оновлень ----------------
// Потік запуску: сповіщення -> цей екран -> авторизація. Android вимагає
// дозволу «Встановлення застосунків» (install unknown apps), щоб FluxHelper
// ставив оновлення сам, без ручного скачування APK з браузера.
let instPoll = 0;
function instOk() {
  if (!ANDROID) return true;
  try { return !!AndroidHost.canInstall(); } catch (e) { return true; }
}
function instVisible() { const w = byId('inst'); return !!w && !w.classList.contains('hidden'); }
function showInst() {
  const w = byId('inst'); if (!w) return;
  if (w.classList.contains('hidden')) {
    w.classList.remove('hidden');
    clearInterval(instPoll);
    /* 3.4.5: гейт тепер ОБОВ'ЯЗКОВИЙ — опитуємо дозвіл, поки його не
       нададуть (без ліміту 45 ітерацій: раніше через ~40 с опит
       зупинявся і користувач міг «залишитись» без дозволу назавжди) */
    instPoll = setInterval(function () {
      if (!instVisible()) { clearInterval(instPoll); return; }
      if (instOk()) hideInst(true);
    }, 900);
  }
}
function hideInst(ok) {
  clearInterval(instPoll);
  const w = byId('inst'); if (w) w.classList.add('hidden');
  if (ok) toast('Готово — оновлення встановлюватимуться автоматично ✓');
}
function checkInstallGate() {
  if (!ANDROID) return;
  /* 3.4.5: БЕЗ МОЖЛИВОСТІ ВІДМОВИТИСЬ (fh_instskip знесено — власник
     вимагає: не увімкнеш автооновлення — користуватись не вийде).
     Гейт показується і на старті, і перед оновленням, і після повернення
     з налаштувань — доки дозвіл не надано. */
  if (!instOk()) showInst();
}
function instCfg() { if (ANDROID) { try { AndroidHost.openInstallSettings(); } catch (e) {} } }
// хост викликає після повернення з налаштувань (onResume)
function installCheck() {
  if (instVisible()) {
    if (instOk()) hideInst(true);
  } else {
    checkInstallGate();
  }
  refreshPhoneSec();   // 2.3.6: оновлюємо рамки дозволів у налаштуваннях
}

// ---------------- 2.3.6/2.3.7: СЕКЦІЇ «ТЕЛЕФОН» І «ОНОВЛЕННЯ» ----------------
// «Телефон · дозволи» — рамки-попередження лише коли дозволу бракує;
// «Оновлення» — в самому низу налаштувань: перевірка + завантаження APK
// ПРЯМО ВСЕРЕДИНІ програми (без браузера/посилань).
function refreshPhoneSec() {
  const sec = byId('secPhone'); if (!sec) return;
  const su = byId('secUpd');                    // 2.3.7: секція «Оновлення» внизу
  if (su) su.classList.toggle('hidden', !ANDROID);
  if (!ANDROID) { sec.classList.add('hidden'); return; }
  const ri = byId('rowInst'), rn = byId('rowNotif');
  const okI = instOk(), okN = notifPermOk();
  if (ri) ri.classList.toggle('hidden', okI);   // дозвіл є -> рамки немає
  if (rn) rn.classList.toggle('hidden', okN);   // дозвіл є -> рамки немає
  // 2.3.7: коли ВСІ дозволи на місці — секцію «Телефон» сховано ЦІЛКОМ,
  // щоб у налаштуваннях не лишалась порожня рамка
  sec.classList.toggle('hidden', okI && okN);
}
function manualUpdCheck() {
  const b = byId('bUpdNow'); if (b) b.disabled = true;
  toast('Перевіряю оновлення…');
  fetchLatest(function (u) {
    if (b) b.disabled = false;
    const latest = normVer(u && u.latest);   // 3.4.19: толерантно до «3.5»
    if (latest && verCmp(latest, APP_VER) > 0) {
      /* 3.4.13: передаємо _pref — канал, де latest.json реально відповів:
         файл шукаємо ОДРАЗУ там, без марнування часу на HEAD-проби
         іншого каналу (це і була головна «затримка» перевірки) */
      updCheck(latest, u._pref);                           // знайдено файл -> попап оновлення
      setTimeout(function () {
        if (!updOpen()) toast('Файл оновлення ще не опубліковано — спробуй пізніше');
      }, 6000);
      return;
    }
    if (!latest) { toast('Не вдалося зв' + String.fromCharCode(39) + 'язатися з сервером оновлень'); return; }
    toast('У тебе найновіша версія ✓');
  });
}

// ---------------- ініціалізація ----------------
/* ============================================================
   3.3.0: АДМІН-ПАНЕЛЬ — ПОВНИЙ ПОРТ З 3.2.0 (розклад / Zoom і вчителі /
   іконки / тижні; модалки, підтвердження, пікер іконок).
   ============================================================ */
const ADM_ICON_PICK = ['bookf','bookopenf','msgf','globef','mathf','sigmaf','shapef','filmf','atomf','run','flaskf','usersf','monitorf','landmarkf','buildf','ecof','palettef','musicf','german','germanf','english','ukr_lang','ukr_lit','calc','ruler','compassd','pencil','pen','eraser','notebook','clip','gradcap','school','backpack','bus','apple','cup','pizza','burger','cake','bulb','brain','robot','cpu','code','terminal','translate','microscope','dna','thermo','magnet','zap','target','medal','trophy','dumbbell','shirt','chess','gamepad','headphones','mic','guitar','piano','camera','video','flower','tree','bug','fish','smile','key','lock','shield','award','hourglass','watch','bell','calendar','star','heart','flag','pin','sun','moon','cloud','flame'];
/* 3.2.0: категорії іконок — щоб швидко знаходити потрібну */
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
let ADM = { tab: 0, day: 0, draft: null, subj: null, pick: null, edit: -1, zm: 'one', zs: true, zv: null, wy: 0, wm: 0 };

function admName(key) { return key ? key.charAt(0).toUpperCase() + key.slice(1) : ''; }
function admStaff() { return !!(ACC.user && staff()); }

function admShow() {
  if (!admStaff()) { if (typeof showMain === 'function') showMain(); return; }
  try { closeDrawer(); } catch (e) {}
  ['vMain', 'vSetup', 'vAcc', 'vDev'].forEach(function (id) { const v = byId(id); if (v) v.classList.add('hidden'); });
  const v = byId('vAdmin'); if (v) { v.classList.remove('hidden'); v.scrollTop = 0; }
  try { document.body.setAttribute('data-view', 'adm'); } catch (e) {}
  if (typeof markNav === 'function') markNav('adm');
  if (typeof setSeg === 'function') setSeg('adm');
  if (typeof setTbSec === 'function') setTbSec('адмін-панель');
  ADM.draft = null;
  admRender();
}
function admSetTab(i) { ADM.tab = i; admRender(); }
function admSetDay(i) { ADM.day = i; ADM.draft = null; admRenderBody(); }
/* 3.4.0: АДМІНКА-ФРЕЙМ — одна велика рамка «Редагування розкладу» з трьома
   внутрішніми вкладками (Розклад / Zoom / Вчителі іконки), а ТИЖНІ — окремою
   рамкою ПІД нею: видно завжди, на будь-якій вкладці, і оновлюється наживо. */
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
  else b.innerHTML = admIconsHtml();
}

/* ---------- спільні дані ---------- */
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
function admIcon(key) { return admMeta(key).icon || 'bookf'; }   // нема в базі -> стандартна книжка
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

/* ---------- вкладка 1: РОЗКЛАД (3.2.0: крупні картки) ---------- */
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
  /* 3.4.0: наповнення вкладки «Розклад» малюється ВСЕРЕДИНІ великої рамки
     «Редагування розкладу» (заголовок і вкладки — статичні, у #vAdmin) */
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
  return h;   // 3.4.0: контент для рамки
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
  admRenderBody();
  const rows = byId('admRows');
  if (rows) rows.scrollTop = rows.scrollHeight;
  admEditLesson(d.length - 1);   // одразу відкриваємо налаштування нового уроку
}
/* 3.2.0: модалка «Налаштування уроку» — предмет + час із розумними межами */
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
  admModalClose();
  admRenderBody();
  toast('Урок оновлено у списку ✓');
}
function admDelRow(i) {
  const d = admDraftArr();
  if (!d[i]) return;
  d.splice(i, 1);
  admModalClose();
  admRenderBody();
  toast('Урок видалено зі списку');
}
function admSaveSched() {
  const draft = ADM.draft || [];
  const skip = draft.some(function (r) { return !normSubj(r.s) || !r.t || !r.e; });
  const arr = draft.filter(function (r) { return normSubj(r.s) && r.t && r.e; })
    .map(function (r) { return { s: admName(normSubj(r.s)), t: r.t, e: r.e }; });
  const dk = DAYDEFS[ADM.day][0];
  /* 3.5.33: застосунок пише НАПРЯМУ в Cloudflare D1 (джерело істини) і
     піднімає rev — всі пристрої оновлюються миттєво; Firebase-дзеркало
     лишається для старих версій. Сайт пише у Firebase, як і було. */
  const admSchedDone = function () {
    if (!DBD.schedule) DBD.schedule = {};
    DBD.schedule[dk] = arr;
    ADM.draft = null;
    if (typeof render === 'function') render(false);
    admRender();
    toast(skip ? 'Розклад оновлено ✓ (порожні рядки пропущено)' : 'Розклад оновлено ✓');
  };
  if (window.FH_WEB) {
    dbPut('schedule/' + dk, arr.length ? arr : null, function (ok) {
      if (!ok) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
      admSchedDone();
    });
    return;
  }
  d1SaveDay(dk, arr, function (ok) {
    if (!ok) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
    try { dbPut('schedule/' + dk, arr.length ? arr : null, null); } catch (eM) {}
    admSchedDone();
  });
}

/* ---------- вкладка 2: ZOOM І ВЧИТЕЛІ (3.2.0: режими груп) ---------- */
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
  /* MERGE: поля, яких у поточному режимі нема в DOM, лишаються з
     попереднього збору — редагування не губляться при перемиканні режимів */
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
    /* 3.5.33: D1 (apps) + Firebase-дзеркало; сайт — Firebase */
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
    /* 3.5.33: групи/вчителі/Zoom пишуться в таблицю subject напряму */
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

/* ---------- вкладка 3: ІКОНКИ (3.2.0: рамки + категорії) ---------- */
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
  /* 3.5.33: іконка — прямо в D1 subject.icon (+ дзеркало Firebase) */
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

/* ---------- вкладка 4: ТИЖНІ (3.2.0: онлайн/офлайн, тест) ---------- */
const WK_MON = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
const WK_DOW = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
function admWeeksRefresh() {
  try {
    const v = byId('vAdmin');
    if (!v || v.classList.contains('hidden')) return;   // 3.4.0: тижні видно завжди — оновлюємо на будь-якій вкладці
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
  const b = byId('admWeeks'); if (!b) return;   // 3.4.0: окрема рамка ПІД «Редагуванням розкладу»
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

/* ---------- модальне вікно ---------- */
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

/* ---------- обробники (делегування, в\'яжеться один раз) ---------- */
function admBind() {
  const seg = byId('admSeg');
  if (seg && !seg.__adm) {
    seg.__adm = 1;
    seg.addEventListener('click', function (ev) {
      const t = ev.target.closest('.adm-seg-b');
      if (t) admSetTab(parseInt(t.getAttribute('data-t'), 10) || 0);
    });
  }
  const bk3 = byId('admBack');   // 3.5.20: кнопки «До розкладу» більше нема — прибираємо, якщо хтось із старої розмітки лишився
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
        if (a === 'up' && i > 0) { const d = admDraftArr(); const x = d[i - 1]; d[i - 1] = d[i]; d[i] = x; admRenderBody(); return; }
        if (a === 'dn') { const d = admDraftArr(); if (i < d.length - 1) { const x = d[i + 1]; d[i + 1] = d[i]; d[i] = x; admRenderBody(); } return; }
        if (a === 'del') { const d = admDraftArr(); d.splice(i, 1); admRenderBody(); toast('Урок видалено зі списку'); return; }
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
      /* 3.2.0 ФІКС: кнопки модалки (Зберегти/Скасувати/Видалити) живуть у
         #admwrap, а не в #admBody — делегуємо тут (у 3.1.2 вони не працювали) */
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

function buildTabs() {
  const tabs = byId('tabs');
  tabEls = [];
  DAYDEFS.forEach(function (d, i) {
    const t = el('div', 'tab' + (dow0 - 1 === i ? ' td' : ''));
    const dE = el('span', 'd'); dE.textContent = d[1];
    const dtE = el('span', 'dt'); dtE.textContent = dateStr(i);
    const dot = el('span', 'tdot');
    t.append(dE, dtE, dot);
    t.onclick = function () { sel = i; render(); };
    tabs.appendChild(t);
    tabEls.push(t);
  });
}
function hideBoot() {
  // застарілий шлях — лишено для сумісності, тепер керує bootLoop()
  const b = byId('boot');
  if (b) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 560); }
}

// ---------------- екран завантаження: плавні 100% ----------------
// Прогрес рухається 0 -> 88% (ease), і тільки коли інтерфейс готовий
// і минуло щонайменше 1.1 с — плавно дозаповнюється до 100% і лише
// потім плавно показує основний екран. Ніяких стрибків.
let bootReady = false, bootP = 0, bootRevealed = false;
const bootStart = Date.now();
const bootRaf = (typeof requestAnimationFrame === 'function')
  ? function (cb) { requestAnimationFrame(cb); }
  : function (cb) { setTimeout(cb, 33); };
function bootLoop() {
  let target;
  if (dlMode) {
    /* 3.4.7: режим завантаження даних акаунта — та сама крива, що й при старті:
       0 -> 85% (ease), і тільки після відповіді бази (dlFinishing) — до 100% */
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
      bootRevealed = true;
      const b = byId('boot');
      if (dlMode) {
        /* 3.4.7: дані акаунта завантажено — екран зникає ТОЧНО так, як стартовий:
           fade + ready. Головний інтерфейс уже зібрано під ним (showMain із
           колбека settleSync), гейту бути не може — акаунт живий. */
        dlMode = false;
        document.body.classList.add('ready');
        if (b) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 580); }
        try { wnSchedule(900); } catch (eWN) {}   // 3.5.1: «Що нового» після завантаження даних
        return;
      }
      // 2.8.2: АНТИ-СПАЛАХ — якщо акаунта немає, показуємо ГЕЙТ ПІД завантаженням:
      // головний інтерфейс не з'являється ЖОДНОГО кадру до входу (раніше блимав)
      if (!ACC.user) {
        document.body.classList.add('ready');   // CSS ready керує #app — гейт поверх
        try { gateShow(); gateStart(); } catch (e) { try { gateStart(); } catch (e2) {} }
        if (b) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 580); }
      } else {
        document.body.classList.add('ready');
        if (b) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 580); }
        try { wnSchedule(900); } catch (eWN2) {}   // 3.5.1: «Що нового» після входу в акаунт
      }
    }
    return;
  }
  bootRaf(bootLoop);
}
function init() {
  // 2.3.9: системні підказки (title) в WebView малюються криво (біля верхнього краю вікна)
  // — прибираємо їх повністю, щоб при наведенні на кнопки нічого не вискакувало.
  try {
    const fhStripTitle = function () {
      const bad = document.querySelectorAll('[title]');
      for (let i = 0; i < bad.length; ++i) bad[i].removeAttribute('title');
    };
    fhStripTitle();
    // 2.3.10: СЛІДКУЄМО ЗА DOM — динамічні елементи з title (наприклад, чіпи у
    // «Керуванні доступом») зачищаються одразу після вставки: системні підказки
    // WebView («прозора фігня» вгорі в Liquid Glass) більше ніколи не з'являться.
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(fhStripTitle).observe(document.documentElement,
        { subtree: true, childList: true, attributes: true, attributeFilter: ['title'] });
    }
  } catch (e) {}

  if (ANDROID) { document.body.classList.add('android'); document.documentElement.classList.add('android'); }
  // лого в шапці ТЕПЕР СТАТИЧНИЙ <img> у HTML — малюється разом із першим кадром
  const dwl = byId('dwLogo'); if (dwl) dwl.innerHTML = logoMark(36);
  // 2.3.10: рамка «Про програму» — іконка + версія
  const abL = byId('abLogo'); if (abL) abL.innerHTML = logoMark(44);
  const abV = byId('abVer'); if (abV) abV.textContent = 'версія ' + verLabel();
  // (рядок «Версія» тепер живе в рамочці внизу налаштувань)
  /* 3.5.20: neLogo жив у знесеному екрані #neterr — більше не ставимо */
  byId('upLogo').innerHTML = logoMark(74);
  /* 3.5.20: neRetry більше не існує (екран знесено) — охоронець чіпляємо до нового вікна */
  const ooK = byId('offlOk'); if (ooK) ooK.onclick = hideOffl;
  const ooB = byId('offlBack'); if (ooB) ooB.onclick = hideOffl;
  // 3.5.1: «Що нового» — закриття (кнопка і тло)
  try {
    byId('wnOk').onclick = wnClose;
    byId('wnBack').onclick = wnClose;
  } catch (eWNW) {}
  byId('updGo').onclick = startUpdate;
  /* 3.5.5: помилка завантаження -> «Повторити знову» і «Завантажити оновлення
     вручну» (перекидає в браузер на fluxhelper.pages.dev — Chrome качає сам) */
  const urt5 = byId('updRetry'); if (urt5) urt5.onclick = function () { updErrButtons(false); UPD.busy = false; startUpdate(); };
  const umn5 = byId('updMan'); if (umn5) umn5.onclick = function () { try { toast('Відкриваю сайт — файл завантажиться сам'); } catch (e5) {} openL(updManUrl()); };

  byId('bCfg').onclick = function () { showSetup(); };
  /* 3.5.20: bBack прибрано — кнопки «До розкладу» більше нема (нижня панель завжди під рукою) */
  byId('burger').onclick = function () { if (drawerOpen()) closeDrawer(); else openDrawer(); };
  byId('dback').onclick = closeDrawer;
  byId('dwSched').onclick = function () { closeDrawer(); showMain(); render(); };
  byId('dwSet').onclick = function () { closeDrawer(); showSetup(); };
  const dwa = byId('dwAdmin'); if (dwa) dwa.onclick = function () { closeDrawer(); admShow(); };   // 3.3.0
  byId('dwAcc').onclick = function () { if (!ACC.user) { authStart(); return; } showAcc(); };
  /* 3.5.4: НИЖНЯ ПАНЕЛЬ — той самий перехід, що й у шухляді, але в один дотик */
  /* 3.5.29: кнопки панелі йдуть через fhGo() — той самий обробник, але
     з анімацією перельоту (стара вкладка виїжджає, нова в'їжджає).
     Профіль без акаунта — як і було, одразу на екран входу. */
  const bns = byId('bnSched'); if (bns) bns.onclick = function () { closeDrawer(); fhGo('sched', function () { showMain(); render(); }); };
  const bst = byId('bnSet'); if (bst) bst.onclick = function () { closeDrawer(); fhGo('setup', function () { showSetup(); }); };
  const bpr = byId('bnProf'); if (bpr) bpr.onclick = function () { if (!ACC.user) { authStart(); return; } fhGo('acc', function () { showAcc(); }); };
  const bad = byId('bnAdmin'); if (bad) bad.onclick = function () { closeDrawer(); fhGo('adm', function () { admShow(); }); };
  /* 3.4.9: версія в підвалі шухляди (оновлюється і після підтягування з PackageManager) */
  (function () { const dv = byId('dwVer'); if (dv) dv.textContent = verLabel(); })();
  const agoM = byId('agGo'); if (agoM) agoM.onclick = function () { authStart(); };
/* ==== 3.5.28: РУЧНИЙ ВХІД КОДОМ ЗІ САЙТУ ================================
   Сторінка входу (fluxhelper.pages.dev/auth.html) після успішного Google
   входу показує 6-значний код і пише профіль у Firebase:
   update/manlogin/<КОД>.json (живе 10 хв, одноразовий). Якщо автоматична
   передача профілю не спрацювала (попап заблоковано / холодний Render /
   втрачений state) — користувач вводить код тут, і вхід завершується. */
(function () {
  const cLnk = byId('agCodeLnk'), cRow = byId('agCodeRow'),
        cIn = byId('agCodeIn'), cGo = byId('agCodeGo');
  if (!cLnk || !cRow || !cIn || !cGo) return;
  cLnk.onclick = function () {
    const on = !cRow.style.display || cRow.style.display === 'none';
    cRow.style.display = on ? 'flex' : 'none';
    if (on) { try { cIn.focus(); } catch (e) {} }
  };
  const cNorm = function (s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); };
  const cTry = function () {
    const c = cNorm(cIn.value);
    if (c.length < 5) { setAgStat('Код має 6 знаків — він на сторінці входу в браузері.', 'err'); return; }
    cGo.disabled = true;
    setAgStat('<span class="spin"></span>Перевіряємо код…');
    const t0 = Date.now();
    const tick = function () {
      if (ACC.user) { cGo.disabled = false; return; }
      fetch(DB_URL + '/update/manlogin/' + c + '.json', { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (ACC.user) { cGo.disabled = false; return; }
          if (j && j.d && j.d.sub) {
            const p = j.d;
            const u2 = { sub: String(p.sub), name: String(p.name || 'Користувач'), email: String(p.email || ''), pic: String(p.picture || p.pic || '') };
            if (p.fid) u2.fid = String(p.fid);
            authAccept(u2);
            try { fetch(DB_URL + '/update/manlogin/' + c + '.json', { method: 'DELETE' }).catch(function () {}); } catch (eD) {}
            cGo.disabled = false;
          } else if (Date.now() - t0 < 600000) {
            setTimeout(tick, 2000);
          } else {
            cGo.disabled = false;
            setAgStat('Код не дійсний. Увійди на сайті ще раз — код дається після входу.', 'err');
          }
        })
        .catch(function () {
          if (Date.now() - t0 < 600000) setTimeout(tick, 2500);
          else { cGo.disabled = false; setAgStat('Зв’язку з базою немає. Спробуй ще раз.', 'err'); }
        });
    };
    tick();
  };
  cGo.onclick = cTry;
  cIn.onkeydown = function (e) { try { if (e.key === 'Enter') cTry(); } catch (e2) {} };
})();

  byId('bGroups').onclick = function () { AUTO_SETUP = false; openGroups(); };
  // 2.3.6: секція «Телефон · оновлення і дозволи»
  const bFI = byId('bFixInst'); if (bFI) bFI.onclick = function () { if (ANDROID) { try { AndroidHost.openInstallSettings(); } catch (e) {} } };
  const bFN = byId('bFixNotif'); if (bFN) bFN.onclick = function () {
    if (!ANDROID) return;
    try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (e) {}
    setTimeout(refreshPhoneSec, 1600);
  };
  const bUN = byId('bUpdNow'); if (bUN) bUN.onclick = function () { needOnline(manualUpdCheck); };
  const rU = byId('rowUpd'); if (rU) rU.onclick = function (ev) { if (ev.target && ev.target.closest && ev.target.closest('#bUpdNow')) return; needOnline(manualUpdCheck); };
  // 2.3.7: перемикач синхронізації
  refreshPhoneSec();
  byId('gSave').onclick = saveSettings;
  byId('gCancel').onclick = closeGroups;
  byId('gback').onclick = closeGroups;
  byId('nOn').onchange = function () {
    NOTIF.on = byId('nOn').checked; saveNotif(); refreshNotifUI(); pushNotifSched(); syncUp();   // 3.4.15: і головний перемикач летить у хмару (раніше ЄДИНИЙ, що не синхронізувався)
    /* 3.4.10: УВІМКНЕННЯ СПОВІЩЕНЬ ПРОСИТЬ ДОЗВІЛ ОДРАЗУ — раніше перемикач
       мовчав (Android 13+ без POST_NOTIFICATIONS нічого не присилав навіть
       з увімкненим перемикачем — «логіка уведомлений не работает») */
    if (NOTIF.on && ANDROID && window.AndroidHost) {
      let need = false;
      try { need = !AndroidHost.hasNotifPerm(); } catch (eHP) { need = false; }
      if (need) { try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (eRP) {} }
    }
    if (NOTIF.on) toast('Сповіщення про уроки увімкнено ✓');
    else toast('Сповіщення про уроки вимкнено');
  };
  // 2.8.0: звук сповіщень + тестове сповіщення
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
    /* 2.9.1: ЖОРСТКА ПЕРЕВІРКА ЖЕСТІВ — палець, що ГОРТАЄ список і почав
       рух на слайдері «повідомити за», більше НЕ змінює хвилини: якщо рух
       пішов вертикально (скрол) — значення миттєво відкочується і нічого
       не зберігається. Реальна зміна = горизонтальний рух/тап по слайдеру. */
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
      if (dy > 12 && dy > dx * 1.15) _bad = true;   // це вертикальний скрол
      if (_bad && parseInt(nMinSl.value, 10) !== _orig) _revert();
    }, { passive: true });
    nMinSl.addEventListener('touchend', function () { if (_bad) _revert(); _t0 = null; });
    nMinSl.oninput = function () {
      if (_bad) { _revert(); return; }
      NOTIF.min = parseInt(nMinSl.value, 10) || 5;
      _paint();
    };
    nMinSl.onchange = function () {
      if (_bad) { _revert(); return; }   // скрол нічого не зберігає
      const v = parseInt(nMinSl.value, 10) || 5;
      if (v !== _orig) { saveNotif(); pushNotifSched(); syncUp(); }
      _orig = NOTIF.min;
    };
  }
  byId('bPerm').onclick = function () { if (ANDROID) { try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (e) {} } };
  // 2.3.3: онбординг дозволу на встановлення (сповіщення -> цей екран -> авторизація)
  const iLg = byId('instLogo'); if (iLg) iLg.innerHTML = logoMark(74);
  const iGo = byId('instGo'); if (iGo) iGo.onclick = instCfg;
  /* 3.4.5: instOff/instAsk знесено — гейт без кнопки відмови (вимога власника) */
  // показуємо ПІСЛЯ запиту сповіщень (1200мс) — спочатку всі дозволи, потім вхід
  setTimeout(checkInstallGate, 2600);
  // 2.3.9: 5-тапний режим розробника прибрано повністю — рамки «Про програму» більше немає,
  // вкладка «Адмін» відкривається лише за роллю.
  devicePing();   // 2.9.0: запис пристрою в базу при кожному запуску
  // 2.7.2: акаунт/синхронізація (3.5.20: accBack прибрано разом із кнопкою)
  /* 3.4.5: перемикач «Скачувати бета-версії» (вкладка Акаунт, тільки адміни) */
  const abt = byId('acBeta');
  if (abt) abt.onchange = function () {
    const on = abt.checked;
    BETA.on = on; saveBeta();          // 3.4.12: значення їде в базу (bt у знімку)
    syncUp();
    try { toast(on ? 'Бета-оновлення увімкнено (зберігається в акаунті)' : 'Бета-оновлення вимкнено — тільки релізні'); } catch (e2) {}
  };
  const asy = byId('acSync');
  if (asy) asy.onchange = function () {
    ACC.sync = asy.checked;
    try { localStorage.setItem('fh_sync', ACC.sync ? '1' : '0'); } catch (e) {}
    if (ACC.user) cfExec('UPDATE users SET sync=? WHERE user_id=?', [ACC.sync ? 1 : 0, userKey(ACC.user)], null);
    if (ACC.sync) {
      // 2.9.0: УВІМКНУВ -> МИТТЄВО питаємо сервер і одразу застосовуємо його
      // налаштування; після цього наш знімок летить на сервер
      /* 3.4.4: під час перевірки — видиме завантаження (як на вході) */
      showDataLoad('Синхронізація…', 'отримуємо налаштування з бази');
      dlSafety();
      syncPull(true, function () { hideDataLoad(); });
      syncWatchStart();
      setTimeout(function () { if (ACC.user) syncUp(true); }, 1500);
    } else { deviceWrite(); }   // вимкнено — годинник НЕ стоїть: стежить за перемикачем (3.5.5)
    toast(ACC.sync ? 'Синхронізацію увімкнено' : 'Синхронізацію вимкнено (копія лишається)');
  };
  // 2.8.6: кнопка «Завантажити з хмари» видалена — налаштування підтягуються
  // автоматично: syncPull(true) на вході + syncWatch у реальному часі
  const aou = byId('rowAccOut'); if (aou) aou.onclick = function () { authLogout(); };
  /* 3.4.8: «Скинути налаштування акаунта» — підтвердження прямо на кнопці:
     перший тап озброює (4 с), другий — виконує. Працює однаково на ПК і телефоні. */
  const arr = byId('rowAccReset');
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
  accBoot();
  // 2.8.2: якщо минулого разу процес убили під час входу (браузер/фон) —
  // продовжуємо опитування auth_cb зі збереженого state
  (function resumeAuthPoll() {
    try {
      const st = localStorage.getItem('fh_auth_state');
      if (st && st.length >= 12 && !ACC.user) {
        agState = st;
        setAgStat('<span class="spin"></span>Чекаємо підтвердження входу…');
        authPollDb(st);
      } else if (st && ACC.user) {
        localStorage.removeItem('fh_auth_state');
      }
    } catch (e) {}
  })();
  // підтвердження заходу на урок
  // запуск Zoom: через додаток (zoommtg) або через браузер (Zoom Web)
  const zA = byId('zApp'), zW = byId('zWeb');
  const zSet = function (m) { ZOOM.mode = m; saveZoom(); refreshZoomUI(); toast(m === 'web' ? 'Уроки відкриватимуться в браузері (Zoom Web)' : 'Уроки відкриватимуться в додатку Zoom'); };
  if (zA) zA.onclick = function () { zSet('app'); };
  if (zW) zW.onclick = function () { zSet('web'); };
  const cT = byId('cOn');
  if (cT) {
    cT.checked = CONFIRM.on;
    cT.onchange = function () { CONFIRM.on = cT.checked; saveConfirm(); syncUp(); toast(CONFIRM.on ? 'Підтвердження увімкнено ✓' : 'Підтвердження вимкнено'); };   // 3.4.12: зберігається в базі
  }
  /* 3.5.21: перемикач «Копіювання посилання на урок» (локне налаштування) */
  const cplT = byId('cplOn');
  if (cplT) {
    try { cplT.checked = cplOn(); } catch (eCP) { cplT.checked = true; }
    cplT.onchange = function () {
      try { localStorage.setItem('fh_copylink', cplT.checked ? '1' : '0'); } catch (eCP2) {}
      toast(cplT.checked ? 'Посилання копіюється затисканням уроку' : 'Копіювання посилання вимкнено');
    };
  }
  const cY = byId('cYes'); if (cY) cY.onclick = confirmYes;
  const cN = byId('cNo'); if (cN) cN.onclick = closeConfirm;
  /* 3.5.38: кнопки підтвердження входу (збереження акаунта) */
  const _ry = byId('rmYes'); if (_ry) _ry.onclick = rmConfirmYes;
  const _rn = byId('rmNo'); if (_rn) _rn.onclick = rmConfirmNo;
  const _rb = byId('rmBack'); if (_rb) _rb.onclick = rmConfirmNo;
  const cB = byId('cback'); if (cB) cB.onclick = closeConfirm;
  byId('mback').onclick = closeModal;
  byId('nbOn').onclick = function () {
    if (ANDROID) { try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (e) {} }
  };
  byId('nbX').onclick = function () {
    try { localStorage.setItem('fh_nban', 'off'); } catch (e) {}
    byId('nban').classList.add('hidden');
  };
  window.addEventListener('keydown', function (e) {
    if (updOpen()) return;   // блокуюча модалка оновлення — керування вимкнено
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

  // свайп між днями (телефон/тач): швидкий жест вліво/вправо перемикає день
  (function () {
    let sx = 0, sy = 0, on = false;
    const vm = byId('vMain');
    vm.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      if (e.target && e.target.closest && e.target.closest('.b-join')) return;
      sx = e.clientX; sy = e.clientY; on = true;
    });
    vm.addEventListener('pointerup', function (e) {
      if (!on) return; on = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) {
        const ns = Math.max(0, Math.min(4, sel + (dx < 0 ? 1 : -1)));
        if (ns !== sel) {
          swipeFired = true;
          sel = ns;
          render('slide' + (dx < 0 ? 'l' : 'r'));
        }
      }
    });
  })();

  // тема + акаунт (2.1.0)
  const tr = byId('themeRows');
  if (tr) {
    const tiles = tr.querySelectorAll('.theme-tile');
    for (let i = 0; i < tiles.length; ++i) {
      tiles[i].onclick = function () { needOnline(function () { applyTheme(tiles[i].getAttribute('data-t') || 'standard', true); }); };
    }
  }
  document.querySelectorAll('[data-verchip]').forEach(function (e) { e.textContent = 'версія ' + APP_VER; });
  applyTheme(THEME, false);
  // 2.2.1: дистанційна конфігурація (аварійна ротація ключів) + D1
  loadRemoteCfg();
  if (cfOk()) d1Init();

  buildTabs();
  /* 3.4.6: ЖИВА СЕСІЯ — спершу ПЕРЕВІРКА ДАНИХ НА СЕРВЕРІ (екран завантаження
     0-100% не зникає, поки settleSync не отримає відповідь бази або дедлайн),
     а вже потім розклад/майстер груп. Локальні групи малюємо ПІД екраном
     завантаження, щоб після перевірки все з'явилось миттєво.
     Без акаунта — гейт; майстер відкриється ПІСЛЯ входу (settleSync в
     authAccept) — раніше він відкривався одразу і блимав за гейтом. */
  if (ACC.user) {
    showDataLoad('Завантаження…', 'перевіряємо дані акаунта на сервері');
    dlSafety();
    if (S) { showMain(); render(); }   // під екраном завантаження — миттєвий показ після перевірки
  }
  else if (S) { showMain(); render(); }
  else { AUTO_SETUP = true; showMain(true); render(false); }   // 3.4.6: майстер НЕ відкриваємо до входу — рішення після бази
  /* 3.5.23: КЕШ ЗАСТОСОВУЄТЬСЯ ДО ПЕРШОГО МАЛЮВАННЯ. Раніше render()
     встигав намалювати вбудовані іконки ДО того, як приїжджав кеш —
     після перезавантаження були «потворні іконки», які потім «виправлялись».
     Тепер кеш читається першим і перший кадр уже з актуальними іконками. */
  try {
    const c = JSON.parse(localStorage.getItem('fh_cache') || 'null');
    if (c && c.data) {
      cacheTs = c.ts || 0;
      /* 3.5.24: КЕШ СТАРШИЙ ЗА 24 ГОДИНИ — предмети/вчителі з нього БІЛЬШЕ
         НЕ малюються. Раніше «протухлий» кеш міг тижнями показувати старі
         іконки (bookf/filmf/EN-UA-DE), якщо свіжий фетч не встигав;
         розклад/тижні/канал залишається — вони мають офлайн-цінність,
         а свіжі предмети доїжджають за частку секунди (pollSubjects) */
      const stale = !c.ts || (Date.now() - c.ts) > 86400000;
      if (stale) applyDb({ schedule: c.data.schedule, weeks: c.data.weeks, app: c.data.app }, true);
      else applyDb(c.data, true);
    }
  } catch (e) {}

  applyScale();
  window.addEventListener('resize', applyScale);

// живі дані (3.5.33 — РОЗУМНА СИНХРОНІЗАЦІЯ): перший знімок D1 летить
  // ще ДО появи екрана (сплеш), далі — ЄДИНИЙ цикл мікро-ревізій: раз на
  // хвилину ~30 байт, повний запит ЛИШЕ коли дані справді змінились.
  // Firebase у каналі даних — 0 запитів (ні розклад, ні предмети,
  // ні оновлення, ні «перевірка зв'язку»).
  pubEarly();
  d1TickStart();
  d1UpdateCheck();
  pushNotifSched();
  netProbe(false);
  netWatchStart();   // 3.4.10: пасивний нагляд за мережею (без запитів)

  // оновлення стежиться через rev('upd') у d1Tick; після повернення у
  // вікно — миттєвий тік: зміни, зроблені поки програма була у фоні
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { liveTick(true); d1TickNow(); }
  });

  // на телефоні одразу просимо дозвіл на сповіщення
  if (ANDROID && !notifPermOk()) {
    setTimeout(function () { try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (e) {} }, 1200);
  }

  liveTickStart();

  // ФІКС «лого із затримкою»: сплеш показуємо лише тоді, коли іконка вже
  // декодована — іконка/назва/смуга з'являються ОДНОЧАСНО
  (function bootRevealLogo() {
    const b = byId('boot');
    if (!b) return;
    let done = false;
    const go = function () { if (!done) { done = true; b.classList.remove('pre'); } };
    const im = b.querySelector('.bt-mark img');
    if (!im) { go(); return; }
    if (im.complete && im.naturalWidth > 0) { go(); return; }
    im.addEventListener('load', go);
    im.addEventListener('error', go);
    if (im.decode) { try { im.decode().then(go, go); } catch (e) { } }
    setTimeout(go, 900);
  })();

  // плавне завершення екрана завантаження: netProbe вирішує — оновлення чи головний екран
  bootLoop();
}

// хук для тестів/прев'ю (не впливає на звичайну роботу)
window.__fh = {
  cfqCb: function (id, status, json) { __fhCfqResult(id, status, json); },
  authOk: function (u) {
    agState = '';
    if (u && u.sub) authAccept(u);
  },
  authErr: function (m) { agState = ''; toast(m || 'Не вдалося підтвердити вхід'); },
  notifFired: function (name, t, delta) {
    LAST_NOTIF = { name: name, t: t, delta: delta };
    /* 3.5.39: реєстрація «цей урок уже сповіщений» — 1-в-1 як на ПК: ключ
       дата|HH:MM, pushNotifSched вилучає такі уроки з payload, тож після
       перестановки списку синком хост не сповістить той самий урок вдруге. */
    try {
      const dk = new Date();
      const fk = dk.getFullYear() + '-' + ('0' + (dk.getMonth() + 1)).slice(-2) + '-' + ('0' + dk.getDate()).slice(-2) + '|' + String(t || '');
      NFIRED[fk] = 1;
      let nn = 0; for (const _k in NFIRED) nn++;
      if (nn > 40) {
        const _today = fk.split('|')[0];
        const _cl = {};
        for (const _k2 in NFIRED) if (String(_k2).indexOf(_today) === 0) _cl[_k2] = 1;
        _cl[fk] = 1;
        NFIRED = _cl;
      }
      try { localStorage.setItem('fh_nfired', JSON.stringify(NFIRED)); } catch (eN2) {}
    } catch (eNF) {}
  },
  notifAction: function (act, url2) {
    try {
      /* 3.4.6: клік по кнопці сповіщення = свідома дія «зайти на урок»:
         діалог підтвердження НЕ відкриваємо — Zoom/браузер стартують ОДРАЗУ */
      resolveLessons();
      const d = new Date();
      let dow = d.getDay(); if (dow === 0) dow = 7;
      const day = RES[dow - 1] || [];
      /* тестовий тост несе власний URL (?u=) — відкриваємо його,
         поки тест «свіжий» (10 хв), щоб кнопка не влучила в чужий урок */
      const tt = window.__fhTest;
      if (url2 && tt && tt.url === String(url2) && (Date.now() - tt.ts) < 600000) {
        showMain(); setTimeout(function () { openL(String(url2)); }, 200);
        return;
      }
      let target = null;
      if (LAST_NOTIF && LAST_NOTIF.name) {
        for (let i = 0; i < day.length; i++) if (day[i].name === LAST_NOTIF.name) { target = day[i]; break; }
      }
      if (!target && url2) { showMain(); setTimeout(function () { openL(String(url2)); }, 200); return; }
      if (target && target.url) { showMain(); setTimeout(function () { openL(target.url); }, 200); }
      else if (target) { showMain(); setTimeout(function () { joinLesson(target); }, 200); }
      else if (url2) { showMain(); setTimeout(function () { openL(String(url2)); }, 200); }
    } catch (e) {}
  },
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
  verCmp: verCmp,
  back: function () {
    if (typeof gateIsOn === 'function' && gateIsOn()) return true;   // 2.8.0: гейт входу не закривається
    if (updOpen()) return true;              // оновлення обов'язкове — назад шляху немає
    if (instVisible()) return true;          // 3.4.5: дозвіл на встановлення — крок обов'язковий, без відмови
    if (groupsOpen()) { closeGroups(); return true; }
    const cw3 = byId('cwrap');
    if (cw3 && !cw3.classList.contains('hidden')) { closeConfirm(); return true; }
    if (FIRST) return true;
    const vaB = byId('vAcc');
    if (vaB && !vaB.classList.contains('hidden')) { showMain(); return true; }   // 2.8.3
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
  instOk: instOk, showInst: showInst, checkInstallGate: checkInstallGate,
  installCheck: installCheck,
  authState: function () { return { theme: THEME }; },
  applyTheme: applyTheme,
};
window.__fh.joinLesson = joinLesson;          // тести: тап по уроку
window.__fh.confirmState = function () { return CONFIRM; };

try { init(); } catch (err) {
  bootReady = true;
  try { bootLoop(); } catch (e2) { hideBoot(); }
  document.body.innerHTML = '<p style="padding:30px;color:#fff">Помилка інтерфейсу: ' + err.message + '</p>';
}

/* ============================================================
   3.5.29 — ДВИГУН НАВІГАЦІЇ (просив власник):
   1) ПЕРЕЛІТ вкладок: fhGo(view, fn) — перед перемиканням ставить
      напрямок/тривалість у CSS-змінні, стара вкладка стає шаром .vout
      і виїжджає, нова в'їжджає .vin з боку натиснутої кнопки.
   2) «ПИЛЮЛЯ» #bnPill — активна вкладка ПЛАВНО ЇЗДИТЬ між кнопками
      (обгортка markNav кожного разу переставляє її до нової кнопки).
   3) ЗАЖАВ І ВЕДИ ПАЛЬЦЕМ: тач-жест на #bnav — підсвітка .bn-prev їде
      за пальцем по кнопках, відпуск = активація тієї, що під пальцем.
   4) РОЗУМНИЙ ВІДСТУП: з кнопковою навігацією (інсет ≥ 24px) панель
      піднімається щільніше до системних кнопок (4px замість 12px),
      з жестами — як було; резерв контенту теж стає меншим.
   ============================================================ */
(function () {
  /* ---------- 1) переліт вкладок ---------- */
  var VIEW_EL = { sched: 'vMain', home: 'vMain', setup: 'vSetup', acc: 'vAcc', adm: 'vAdmin' };
  var VIEW_BTN = { sched: 'bnSched', home: 'bnSched', setup: 'bnSet', acc: 'bnProf', adm: 'bnAdmin' };
  var TAB_ORDER = ['bnSched', 'bnAdmin', 'bnSet', 'bnProf'];   /* порядок кнопок у панелі */
  var __fhCurView = 'sched';

  function byId2(id) { return document.getElementById(id); }
  function tabIdx(view) {
    var b = VIEW_BTN[view]; if (!b) return 0;
    var el = byId2(b); if (!el || el.classList.contains('hidden')) { /* без «Адмін» порядок зсунутий */
      var vis = TAB_ORDER.filter(function (x) { var e2 = byId2(x); return e2 && !e2.classList.contains('hidden'); });
      var j = vis.indexOf(b); return j < 0 ? 0 : j;
    }
    var i = TAB_ORDER.indexOf(b); return i < 0 ? 0 : i;
  }

  window.fhGo = function (view, fn) {
    var prev = __fhCurView;
    var curEl = VIEW_EL[prev] && byId2(VIEW_EL[prev]);
    __fhCurView = view;
    /* нема з чого виїжджати (старт, вхід, швидкі кліки) — просто перемкнути */
    if (!curEl || curEl.classList.contains('hidden') || !curEl.classList.contains('view')) { try { fn(); } catch (e) {} return; }
    var i0 = tabIdx(prev), i1 = tabIdx(view);
    if (i0 === i1 || !('animate' in Element.prototype)) { try { fn(); } catch (e2) {} return; }
    var dist = Math.abs(i1 - i0);
    var dir = i1 > i0 ? 1 : -1;
    var X = (46 + Math.min(dist, 3) * 16) * dir;               /* дальність вльоту */
    var dur = 0.36 + Math.min(dist, 3) * 0.06;                 /* далі — довше */
    var rs = document.documentElement.style;
    rs.setProperty('--fh-navdir', X.toFixed(1) + 'px');
    rs.setProperty('--fh-navdur', dur.toFixed(2) + 's');
    curEl.classList.add('vout');
    var killed = false;
    var kill = function () { if (!killed) { killed = true; curEl.classList.remove('vout'); } };
    setTimeout(function () {
      try { fn(); } catch (e3) { kill(); throw e3; }
      setTimeout(kill, dur * 1000 + 90);
    }, 42);
  };

  /* ---------- 2) «пилюля» + синхронізація поточного виду ---------- */
  function pillTo(view, instant) {
    var pill = byId2('bnPill'); if (!pill) return;
    var b = VIEW_BTN[view] && byId2(VIEW_BTN[view]);
    if (!b || b.classList.contains('hidden')) { pill.classList.remove('pon'); return; }
    pill.classList.add('pon');
    if (instant) pill.style.transition = 'none';
    pill.style.width = b.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + b.offsetLeft + 'px)';
    if (instant) { void pill.offsetWidth; pill.style.transition = ''; }
  }
  var _markNav = window.markNav;
  if (typeof _markNav === 'function') {
    window.markNav = function (view) {
      var r = _markNav.apply(this, arguments);
      try {
        if (VIEW_EL[view]) __fhCurView = view;      /* будь-яке перемикання синхронізує стан */
        pillTo(view, false);
      } catch (e) {}
      return r;
    };
  }
  addEventListener('resize', function () { try { pillTo(__fhCurView, true); } catch (e) {} });
  /* після бута — стати на поточну вкладку без анімації */
  setTimeout(function () { try { pillTo(__fhCurView, true); } catch (e) {} }, 650);
  setTimeout(function () { try { pillTo(__fhCurView, true); } catch (e) {} }, 1600);

  /* ---------- 3) зажав вкладку — веди пальцем ---------- */
  (function () {
    var nav = byId2('bnav'); if (!nav) return;
    var st = null;
    function btnAt(x, y) {
      var el = document.elementFromPoint(x, y);
      return el ? el.closest('.bn-b') : null;
    }
    function preview(b) {
      var bs = nav.querySelectorAll('.bn-b');
      for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('bn-prev', bs[i] === b);
    }
    nav.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { st = null; return; }
      var t = e.touches[0], b = btnAt(t.clientX, t.clientY);
      if (!b) { st = null; return; }
      st = { x0: t.clientX, y0: t.clientY, btn: b, moved: false, t0: Date.now(), hover: null };
      preview(b);
    }, { passive: true });
    nav.addEventListener('touchmove', function (e) {
      if (!st) return;
      var t = e.touches[0];
      if (!st.moved && Math.hypot(t.clientX - st.x0, t.clientY - st.y0) > 11) st.moved = true;
      if (st.moved) {
        st.hover = btnAt(t.clientX, t.clientY);
        preview(st.hover);
        try { e.preventDefault(); } catch (e2) {}   /* щоб сторінка не скролилась */
      }
    }, { passive: false });
    nav.addEventListener('touchend', function (e) {
      if (!st) { preview(null); return; }
      var wasMoved = st.moved, hover = st.hover, t0 = st.t0;
      st = null; preview(null);
      if (wasMoved) {
        try { e.preventDefault(); } catch (e3) {}   /* без синтетичного кліка — активуємо самі */
        if (hover) hover.click();                    /* звичайний onclick → анімація перельоту */
      } else if (Date.now() - t0 > 700) {
        /* довге зажаття без руху — теж активуємо (тап уже міг не встигнути) */
        try { e.preventDefault(); } catch (e4) {}
        (hover || btnAt(e.changedTouches[0].clientX, e.changedTouches[0].clientY) || { click: function () {} }).click();
      }
      /* короткий тап без руху — браузер сам дасть click */
    }, { passive: false });
    nav.addEventListener('touchcancel', function () { st = null; preview(null); }, { passive: true });
  })();

  /* ---------- 4) розумний відступ (кнопкова навігація) ---------- */
  (function () {
    function gapFix() {
      var sab = 0;
      try {
        sab = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fh-sab')) || 0;
      } catch (e) {}
      var b = byId2('bnav'); if (!b) return;
      /* з кнопками (великий інсет) панель щільніше до них; з жестами — як було */
      var gap = (sab >= 24) ? 4 : 12;
      b.style.bottom = 'calc(' + gap + 'px + var(--fh-sab, env(safe-area-inset-bottom, 0px)))';
      /* резерв контенту під панеллю теж менший — останній урок ближче */
      var res = (sab >= 24) ? 78 : 85;
      document.documentElement.style.setProperty('--fh-navres', 'calc(' + res + 'px + var(--fh-sab, env(safe-area-inset-bottom, 0px)))');
    }
    gapFix();
    addEventListener('resize', gapFix);
    setInterval(gapFix, 900);
  })();
})();

/* ============================================================
   3.5.30 — ДВИГУН ПЕРЕМИКАЧІВ (просив власник: «с красивенькой
   анимацией просто с рамки Додаток переезжает в рамку Браузер»,
   «в налаштуваннях моїх груп так же», «перемикачі теж красиві»).
   Підсвітка активної опції = елемент .seg-pill всередині контейнера
   (.seg-z / .adm-seg / .su-opts / #tabs). При виборі іншої опції
   пілюля ПЛАВНО ЇЗДИТЬ до неї (пружна iOS-крива) + спалах при
   прибутті. CSS — блок «3.5.30» в кінці ui.css.
   ============================================================ */
(function () {
  /* 3.5.31: прапорець «двигун пілюлі живий» — CSS віддає .on під пілюлю лише з ним */
  try { document.body.classList.add('segjs'); } catch (eSeg) {}
  /* 3.5.38: SVG-фільтр заломлення (lgDisp) і клас lg-ok ЗНЕСЕНО разом із темою скла. */
  /* 3.5.32: у модалці оновлення — пояснення про місце встановлення
     (просив власник: «після оновлення програма лишилась на тому ж місці») */
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
  /* 3.5.34: + .tb-seg — верхні вкладки ПК (Розклад/Налаштування/Адмін) тепер
     з такою самою їздячою пілюлею, як на телефоні (просив власник) */
  var SEG_SEL = '.seg-z,.adm-seg,.su-opts,#tabs,.tb-seg';
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
    var on = cont.querySelector('.seg-z-b.on,.adm-seg-b.on,.su-opt.on,.tab.on');
    if (!on && cont.classList && cont.classList.contains('tb-seg')) on = cont.querySelector('button.on');
    var p = pillFor(cont);
    if (!on) { p.classList.remove('pon'); p.__flyAt = 0; return; }
    p.classList.add('pon');
    /* 3.5.34 FLIP: клік запам'ятовує СТАРУ позицію пілюлі ще ДО перемикання
       .on (фаза capture), тож навіть якщо спостерігач мутацій встигне зробити
       миттєву пересинхронізацію — пілюля спершу миттєво стає на стару опцію
       і ДАЛІ ПЛАВНО ЇДЕ до нової. Політ більше ніщо не з'їдає. */
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
      /* 3.5.34: позначка «пілюля летить» — спостерігач мутацій 600 мс НЕ робить
         миттєву пересинхронізацію поверх анімації */
      p.__flyAt = Date.now();
      p.classList.remove('arrive'); void p.offsetWidth; p.classList.add('arrive');
    }
  }
  window.fhSegTo = segTo;
  /* клік по опції → пілюля їде ОДРАЗ (клас .on ставить власний обробник) */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var b = (t && t.closest) ? t.closest('.seg-z-b,.adm-seg-b,.su-opt,.tab,.tb-seg button') : null;
    if (!b) return;
    if (b.classList.contains('on')) return;   /* 3.5.32: активна опція — без спалаху пілюлі */
    var cont = b.parentElement;
    if (!cont || !(cont.matches && cont.matches(SEG_SEL))) return;
    /* 3.5.34: стара позиція пілюлі знімається ОДРАЗУ (capture — до будь-яких
       змін .on) — звідси пілюля й почне політ */
    var p0 = cont.__segPill;
    var from = (p0 && p0.isConnected && p0.classList.contains('pon') && typeof p0.__x === 'number')
      ? { x: p0.__x, y: p0.__y, w: p0.offsetWidth, h: p0.offsetHeight } : null;
    requestAnimationFrame(function () { try { segTo(cont, false, from); } catch (e1) {} });
  }, true);
  /* перерендери (gRows перебудовується, адмін-таби перемальовуються) —
    MutationObserver синхронізує пілюлі без миттєвого стрибка */
  try {
    new MutationObserver(function () {
      var all = document.querySelectorAll(SEG_SEL);
      for (var i = 0; i < all.length; i++) {
        try {
          var _p = all[i].__segPill;
          if (_p && _p.__flyAt && Date.now() - _p.__flyAt < 600) continue;   /* 3.5.34: політ триває */
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
