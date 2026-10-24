/* FluxHelper 2.9.2 — логіка інтерфейсу (винесено з одиночного HTML,
   щоб сторінка парсилась швидше і не лагала на слабких пристроях).
   ПК: exe пише ui.html + ui.css + ui.js у %APPDATA%\FluxHelper */

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
const LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAprklEQVR42u2debhkdXnnP+/vnFrufm/37X2HpmmgCQgCikoTFcUIxo0kxkRiEs2TxSQuiSZO4hLHiVvGxEkeH42SjNFnBIkxGjXEjRHRR6UBgW6gaejlNr333etW1Tm/3zt/nP1UVfdt0CfMjNVPdS331Pbuy/d9D/z08tPL/88X+cm85zsEdsp2jgrAHHO5z7n0KU6Su9J7gwwqwO0sV7hFAfcUZuQN3g3c4P2/LrDb2e7DO8xTRQNkO9u927k9TJ7YvPnamjepG8WvnoNjo2dMv4hXjz4r+t4GA8aAi55xJnk++5/8M/mn3Gl+u8mE1KV384Lr0kfGxfdNdHD2l+jWOhug4STC7iC0Dz5y8qsT2fvc4MH5Cu9y/0kMuMGDWyzAhg3b633N/uerejcY5HJEzjVSEYNBJL7G/xATf6iJH0v6VSS5FYkfS8fXlNN8ZUULj7LnFFXNHREfpxo/46Jn1KHJP3WoOhwWq+Ec6u61zn7Zib15z7HbHsnRwWVv+JNngIk/TDevfPYyYwd/XcT/DSPeOQYv/bGAE1DEaEQ0URGTI2x8FRCNGCEQ3wpoxqb8V434Jb3Jr0Xiu4QuEhNaYwaooqLxYQljEkY5QCU63omCARERAYVQ23Oq7ma17Q/uPvm1XdEHvMM8EW2QJyr1m1dc8xtGK+/0pbI2lhYHokaMgBhJJTmW/oJUm/STo2eSxzG5VWJCm1Qryl9ZciInBfHTLvrgIsZI9hgFxWUaowm7Mm1JNSO6r4o6VVUBX4zB2nbDiX5k4ejkuyb43gJs98mZ4x8zAyLir13y3DV9XuWjnqlehzochAYxgjGJ9CamJSNu7vmY2IkW5I8tm53ifVKNOY0N6jAzOa3MCJxqQ/5xxoTs765wbKwV6nBOwBPxsdreYZ19/Z7jt921ne3+7WfABDkT4p+z5Oor8KufM1Jdq2pDQTzBSGbbEzOS2fwOs5MndkErut2mNue0tr+nL1DNkV6732qRKWVzlCN8+srovlOnao0xvlU761zwm3uOf+3mvKU43eW0YeMN3ODt5Ba7acn25xuv9iVjvGVOXWgQn5j4EjvbVG5TwpqCGSJH8LJJ6sYEkbJeZFolXf+VnDmkn5OXtjJLRXqJpKa3xUPSRyKCcTgrUPeMd8NIff2RyYV/+0Fkjva5J6sBBnCbljz3cs/zv2bEDCnOCp6XJ8Tppd8UJLlglrSLCZKcyTlDTegm+emzHSZHY1dbMjfpsW4RWpD8s06j72esa75+z/FvfnwxmiCni3Y2LNu+wqf6A0+8tarWiniekBE2k9TErJgu9zO7X/QJidbkX5MnvBT8xekCUS1JbWLXMx+QREkJ0Vx8pOti83P+QF32msL9/PsoilVAVVUd9ro9x77+1dMxwZwisxUAz3k3+eKvdWpDxHgUZJPUrGQ2nY77BSKKFAgqJf8AZUduciYnMmlpbtFxleKxHQFAl8/IO3wpMj4LfaXL/UxTM4EwoigixhPMp88d2b4xIn7vzLnHH24wcIvdNP6zr6141WuthqEgft7OFsxDwTqWf0iRKUWyd/sx8X0RDAYjBmM8jPFSk+ZUsc4Vrk410zrjYSQ63iR+SHIkzwtNyenniV0QlpLgFAPi3Osxxqm1nvhLgor/yUgDdkova+N1l/6dunroeUurvtwK0h99r5zDTRxnKnEU7H3yPIVwNO8r8k7XIELBbxjxMGJQVawNCcI2obMRU8SjWu2nXhukXh2gVu2n4tcxYnDOYZ0ltG1C246cpwgiXk4j6UjopIMA2sVO5xyyJI8FREuvURAxTm3om8rZo30zBycb//bDmBEd2bLfS/rr1fB1nulb6TS0gvHoEkcUb6XzccEMSRdbblJVjwgfETEImgD09w0zMryC8bF1LBlZydDAMvrrI1T8GkZ8BIMqqLWENqQdNGksTDMzd5yp2cOcmJlgZv4IzfYsqOJ5lciKOhfZbVFETWrDEynWOOONiRnfl4zolB93u8WoWgfeu7cOXXbrg7O3nEyCmlM5YQFYterSvv720E5jqusVp4IxBQkvhJiZ5HaLfLpJf/59jIlsdWgDrA0Z6Btlzcpz2bhuGyvGNzE0MI7vVREEay3OOpxzqI0cqqrGP0lAs/dWpwRBi9n5ExydeoyDx+7nyNQjNFrTeMbDmAqow6WRTOJIXUeE0zUi0nLWXHqfKE+wRipe6Bbe8ejxb727m0MuMSBKpTcuveolFVP/guIciCkU0/JOUUxH1puZnyTyMbkoqeggjfEIwzbOWsaXrmPr5mdw9oZLGBteARjCIMCGYUQkFxNbI4nUWI7URYyQKHLEWcW5hCkGIz4GH+csM/PH2Hf0Hh47/F0m5w9ixMfz/IihuFwY6nJRjstFRK5A7DQ7LjCxUMxzIiLOhod9muc+dOLO2XLlpGSClmv8tV8hIqoqTgqOOmdEpMjFooMus7aUZIkBVZqtOcbH1nLxtudz7llX0F8fJAhCWq2FOCGVVLIlVm9NklU0YoIILoCgpahTjCf4vkT0dxBqG3UtUGGgtpQL11/L5pVXsu/IXew6+HWmFg5SMXUk9jlSSLu0VGyS9HsU6q6ZK0Bz9BUwqs56XmVVYPV64DOJie/mhAV2ug1sr5t+819FzHhs06Qc3uVj/GIekNOAHrUgY3yCdhPfr3LF017M86+6kfWrz8M5pd1u45wtZMYRI2Jzk5hqjYgvAu0F6B8Wnv/aGuddWWHykGP2hOJ5kXakTERwzhKELYz4LBvazPqlT8eXKifm9xLaJp6p5PxBt7ClmNx1L4OX8hBQESPOWW9yYe9n4QKTd8bSkfWOP3uLUNlpJMp2KVc1MR01nogZnWWH/HFGPARDq7nA+rXn87NXvopVy8+i1WpjwzCSrUS6Y63PzE5yPyK+c4oxQmtOGVlueMkf1BlfFynq1BHHp/60QdCM7JK6+P1iJibv5ZxDxKMidY7NPsqOvTdzZPZBKl4fDodiCzafjuqoK/mBzAyVjlNBxLngSBjq1n3Tt08VPHUu+knikXM8SeWnsxpJ7/CNHlUXIwZ1jna7yRWXXMcrr/sjlo9vpNFo4JyN1b9E/NjBqlOcixwvsURX/ArtecPStR6vfGsf4+sMNow6YCPLDSPLlaAVc6wL8dHINzlrabbnGOtbz/Ytf8B5K64ldC1QF3XtSr9FTllKkF60EkVVxF9hfD0nizRLiVjSQFdlY/y0ditLdZBd5JQFDhGDtSEgvOi5r+O5z35VxIxWM/YFkjrSpAKgqqi1qHMY8ah4fdQq/Yh4OLUcOXyUgRVzvPwtdYaXCdaC8aLWpQ1AbD8Vvw/BS5mXMFgVnGrm0DEEYRPU8bS1v8jl62+Mkz2blkp6S1vXILJLa0ydiOBUL4geH5WeeYDgDUSuRrRnkbBnElN8hRGDDQMq1T5+/po3cPaGi2g0Gll9KC+dseQ76wDB9/vAwdz8JMdOHuDoib3MNU5w+NDjbN62jN95y6sZXCLYEMQD6xTfEw4fnORbd36TJf0bWDK0lr7qKKpKELRx6iKiOwoah0bZddPNcdbYVVTNMN878DECt4DBL/QTKDrZ7F7aXevWLBKNK8bjkbDD7T0TMaFeajEtopYnXYRDsDagUunj5de+iY1rz2e+MY/BiyldNA0uvl/164RhyMShXezZfzeHj+2h0ZjB8w2NmTbnXbyR//YPr2Z8+TBhGPmCuEcCnrDznn3cvfPrDA7XqVWGGB/ZxLolF7NsaDMVqdG2C7Gaxa9Lv0NUmW0Gs6wevIgr1/4O35n4H4SuFeUVHQTpSLxOXaQVMCL9PTPhDLtjijGYZA+kRwVSuhBfnUOMx0te8IaI+PPzGPEyU5MjvrUO36sCwmMTP+L+h2/nyPHHUBy+qVGv99OYa7Fl20Y+9OnfZHzFMEEQhZzl2GPXPRN4UqPi12m159h79IfsO7qDpUMbOWfFc1g5fH6kEa6NqBR8g8a+oRnMsrz/Aq5Y9VvcefAjqLroN3WtvvaqynbjjenASfk/KaxXGLZ48fN+j80bLqbRyBE/J/lJNFKrDHBy+iDfv/eL7D14HyJC1a8j4uEZQ2O+ycp1S3jfP97I8lXDtNsOzzO5BjwYY3AKu+45gF8xaZRT9fpRZzk+u4djM3tYPXoBF6z6OYZqK2iHDXD5ACBJ6jxa4SyrBi7m4uW/wg+PfAKf2mKl/Ywup2eALq4Vm/HYsNCc45mXvpyLz786tvmdZkfj9kWt0s+De77D9+79PI2FWWrVwUjaVDEGWs02QyP9/OVNr2XdpqW0Wg7PLxJfVfErwpHHZznw6DEqVT/6HMnCR9+ro06ZmLyXY7OPsG3V9WwYewaBNrNQN+cXRA2tYJazhq5munmQh6a+RFUG0h7C6URQWRyvniTCSwt+X8TQajfYsGYb2y//RZrNZlYw0yLxJS4TfOeum/n6926iHSxQq/bHWJyo8hmGIcY3vOfjN3LutlU0mw4TS77m0iHnou/x2IOHOXlsFr9i4j5vrk2jFsVR8fsIXZMf7v80P3r8nxH8yAnnI7E02za0bYMLlr6CZfWtBLqQi4y0Z8xzphifUwMMutk77bwrAuos1Wofz3/2a/FMBWddZnZckfhg+MZ3b+KunV+mVunDiBdFKTnH1lxo8ycf/CUuf85mFpo2I37pmiQsD9y9jyAIO3BC+SxVNQlt6zx07DZ2THwqdsBRAS9N/lwSHDhEfC5c9moqUsNhy4WKnjRZDHu6MMCd5oXazUcjYmi257nsoutYs/xsmq1YWko2P8qsPb7x3U+yc8+36asPRcU2zUI94wkzUw1+623X83OvvJSFpsXzeuMHohgbHrz3AMbERQDRQskgD9hKMtmaP8jeqe9y96FPx2ZSUuKnrzSGQBuM1Tdz1ugLCd0CJAAE7U6T3oLsFqkB2ou92nmYRk2PdtBi2dL1XHbhi2m2WjnTk1dtR8Wrc+eOW9j56Lfpqw3FtZ/svT3fMH1ijut/+Upe96YXRGbHeF0lXzUyP35FmJ5qsWfX41SqXta31W4QxRxqTi01b5C903fywNF/wZNapAXkI1WNkjW3wKaxFzBUXYN1rbgFo92Sru4qoWdsgjSt+elpEJgQxfyXXXgdA33D2NCCy2W4Lgo1a5UBHtj9v9mx8ysR8dXlgFSKZ4TZmQYXPWMzb33fL9IOFI3Dv15Xp+Ab2Lv7MMcOT+FXTU6jkrJyjgo5ZAQaQXWrZpCHJ29j38yd+KY/qgVJHh0kWEJq/ihnjb4Qp0GhMKG9hHMRfsIsBl9Q5mjhryKEYZPlS9dz/ubn0GzF0lFKsnyvyvHJA3zn7v+F71dzJif6mWKEVitgyfgg7/ybX6N/oEoQaowT7c2BpGL10I8mmJ9fiHKDHAi3CMLqxIEmV1+q3H/8Vmbaj2NMNS7I5YRXDIEusHr4GQzV1mG1lTPAehpa9WZCVwaodO+NFt5Is9JTELbZtuVqBupD2DAkBzBLTYWocOc9tzDfnMIzXhGNFr9hGAS87f2/yllbltFoODxjTin9+W/3wI7HEEPqyLUbLEW1gAXNd7REPFp2mp0n/wUwRTMU08O6kIo/wpqRZ2FdO9MC7U3khIYqT8AEaam8pGVoN2BdwGD/GOduehbtdpjV8JNipHVU/TqPTuzgkQM/oFYdwKktmAbPM0yfnOXVv/sirrn+Iubmc4nWqaRfI58xOxvyyM6JKAHTrHOVtBIlLxE5KGLinGNgFRXTz6H5uzjcuAff9HXRAsFqi5WDl1HzR3CEHfTSEppOn4wJopBQdDYcRIQgbLF+1TaWDK8iCFpZsYukIQJhGLDjwa90VX/jGWan57nsqgv47be+hEbTIUZOK/lJ/F+pwOP7TzCx/xiVmpf5HbQTdk4RJ1oIT5P/Rdkz9R9YDdJoJz1WhNC16a+tZqx/K9Y1S9lx7lZ7m/DFh6FadsRlTYgim7PXPz2NerKSclRmqPh9HDj0AAeP7qLq98UmIoN3BO2QodF+3vb+G6nWfGwohdbjqa7OKZ7Aww9M0JhbwPdjiIvJriYGZxQemwhAb0Sy+wbEKBWvj8n2bk62Hqbi19OpGZW8JngsH3xah1cpM1MKEMnuYajflf5C7i1iQ6QxRCMH37A2oL9vlDXLt0YJkEqhk6WxAX1w7x1YF6BSj9XfpLWpxnSDN73nV9l6/kpmZqMyw5nl4nDXnQ8xMz2H8cCGrgOGWIajazoNk+9gxU11EdrhLA/xDfqWb8X0RQzLmyGnAaP9W6h4QzktKE7ddJjsHiN+fjf6mwJvpcMrSNRSIrQBK0c2Mzq4kjAMcpIbdbI88ZmZO8aBo/fHkU8m/cbzmJma43nXXcENN25nZt5hTLHGc9qaixgWmvCCl13OpVduwav4af+4dz6qPR7lzK46jPgs7BO+/0VDGMbtzRgzFGqbenU5g7VVTDYexki1iw/ozEHcmRXjspKAxEmHFGrggrVtViw9C9+rEYbzES4nLWwpnlfl0PHdzDVOUKn0x6iDSO2Ddpvx5cP84btejXOgKhGs5wwLr9bCZVdtxpcnV5WRLoLoAUvWNPnnD85SHZDMYavD9/oZqm/gxNwDeH61wHTN5VCnK0j43X1AIuuxGZGiGcp3iJaOrEfSgliuge6i0PPx4w9iXUg1p5JihPn5Bd74rhvZfM44k9MO3zdPmIKNOc0V3348F3VQ6xfOurhCpU/ielM+Sxb6a2tjsmgB1p6an45pncX4AEMWwgkpDiYfUgmCU4fnVRgbWoW1WggNieP+IGhyYmp/irnROOScnZ7jGVdfxCtf87NMz2UVzicsvSId2M8n29KwCtUq7L0/pNlQ6kNR01+JFN2ppa+6IteyzAlYOVxJGGSeUDm6lL7nHJZnKgz0LcFZGxeysm4XGFrtJtPzR/GMB+pix22p9VV4w9t/JW6c/GTG9Z/MxVmlVodD+xvc9o+T+LVIAxKIqCI4HDV/DDF+DkvUOer0BMvR2pHIp42G+D2dWqrVehRaFlAHGpsjQ7M9R7M9G1Urifq3s9PzvOI113LpFRuZm80c71PpGqsw733rR5nYe4xq3Y961jk/o2rxvDqeqaPYNPSWMiyrkPcsggERTrKcMXZOFKo6fL8W1f0TLGZcT08gR83WHKELUnRMq9li3cYVvPYNL6OxEDGk3Fz5z7xGrVTH8LDhpo98ga9+4evUhyNHr+WSlChiKhhTTauvndJfHAB0zj1BE1TSgmSsJ0K7Zdlneo0BVKENUA0TgCONhQVe8zsvZ9XaIZrNxLE/dagfho6hEcOdtz/M373/UwyO1AnCVqkiG/UaHAriIeKlAiqnCG3PqCespaIVksvqBERzSU0OMqgp1CPugDmNw1FozDe48JJzeekvP5e52cgZ61PI7qtVKjXh+JF53v3mDxMEAfW+amZ6kohGyoWHpJhHx5ir5maLe0Vp/qkcb4b80lwElKmBcwHOhQXIX9L5iur7lRjOoYQ25MbfvYHBkQrTkw7vyQbuP27Hq0q1anjf2z/G7l2PMTw2iA0dxlQygcxpgsToOadhh+/ssPlROfjMq6FpTqDFHiuqiBjaYZMwbKcRUDowoaAuavn5fpW5mTkue/ZFPO+6K5idjqT/qUT8MHSMjBk+8/e38a8338bw2BBhEGDEx/cGctOU+avgCAhtMw7SXTEZ0yINzygRS+NZjZ1NQnhJkjMXtyHnabUXGO4zKWOSb2jVUfUGqFUGcRznV17/Smp1odV0eN5TJPCUqFM3MGS4+/t7+eu/+Dj9A3WctSgW3x/E8/px2A4nLEYIbAPrGpFmlExPcUyWFDG9iCioW4W7GOMmBsm6gNnGcYgRBbikECc4a6lXB5Cgn0ueeQFXveASZmei8vNTxe86p/g+zM00+Ys3f5j5+QaeH/WfrQbUK+N4KVxdChEQGFrBCZwGxZJ113UInbRdhAbENSBVRDK1knQqUAhti8m5gxjiRrh6hQa8aIV1K8/jN99yGb4PzYWo9fhUSrgGhwzve/tN/OiunYwuGSEMwxhaaRmsr8OYWmRmE38o8bC2eDRah3GujfGqXZo9mePNmHOKUsRdeZ0olCKklIgllcHoA45P742x+5L2bdRFPmJutsE1z3spl165nJnpyPS4H3PN5omWIMLQMbbU8Ll//Ba33PQFhkeHCMMw+q0ucrjD/VviDlvSqtWc/XfMtw50TM6XrUQhLzAlWvcuxuV2JiBI0lRIfQCoRHCRI5O7aQfNuIhEAesvKKY9iMEwMAjtdvdxgiccOio4e2b+PCqHOAYHDffdtY8P/NnfUuuvpduxAKyG1CtLGe7fjNV2NLYqWmjQW9ditrEHET9rgXYwoiz9iyjGOWIMb+JQpbO8JHHN3DMVTsztZ2r+EGP9awlsq1AT8irKib3Cpz/wPS5/yTjLxld3AbRk3dPecze9qdk/0H9GTHUxjnR2psU73/hXzM7OMTDYhw2zhNG6BcYGr6RWWUbg5gvhZ4TgqDLfOkijOYExfkELinl1Li+QDMF3mo6YQ71SeTUJ/mN/kOxWM8an0Zzk4PH7Gd+wiXbSHXJJTchRrfVx3380+MhHf5fh4dEcPKDb2oA8baVjHDM5whjD/NwClzzzQt7/93+KDRfPOOccA4Me733rx/jRXQ8wumSYMAxzYC1FxGf56LNzCLuMAQ7FNxWm53fSCiepeBnIIEPd5RF4OZPkFlOOToNY7eiDkSLhSJmAKHuOfJdta38uVwLRFGvfDhpsWftMdh7dyoHj90Zw8XT+prgYo2DPNc+EIoE9z2N6cobV61bQ1y9MTZ4aupi8OgwtY0s9PvPxf+fWf/oCI2MxjCYXdFjXYHTwAsaGLiTQhQ6ISjRNYzk+/f3MJ5acbqlzkNOExWiAyYpxSbNBYpufsiG2Sk6jAYoDx+/m5Ox+hvvWxENuWUnCOcXH4+K1L+fQ9P1Rz1fzMl3eWJIRu5dJ8jxDpepxwSVbI6HS02fVoXUMDXt8/9sP81fv/Fv6BvpwzhbCxwQNt378JZFtdy0QU4Apiqkw35xgevY+jNQKQ9tFPJKmKIusH7CYYpzLOpgap9DFD6AwRW6Mz1zzOA8duh3f1NC4a5F0xVChFcyzfvQKNi55Js1gJlb1eCWk2uJ951AXDeg5F60SSP6e2NowCBgcHuCsczYStCnZ6O7xfrUmHD08wzve+D6arRaeL7HpcGkzPghnWDbyDJaOXEboGiXix71iU+PY1B20gpNgvNz0fL4BnxFfc2sOujWFe5QiSugy6fTumUuyeF6FnQe/ynzzZNQhcrnGTAohd1y+/tfoq4xGWhJXVPMNnqLFzC1LirGeiYq32m1WrF7G6vUrabXikahe9f1YoIwR3vPHH2bPw4/SP1AntLbQKreuTdUf5eyVr45nCbRI/BiO0gonOXLia1GNCFsQzMK2RSnXhdwi+wG4IhCrSx8g2capqji1+F6NY7N7ePDxr0VOydko3k+LdIYgbDFW38Az1r2OwDYLDM4PN1Pa2UDhmMjntFstztq6icFhHxue2vZYaxkaMXz0Q5/mP774dUZGBwnCoJBwgmLdAuesfi0DfesJXQvFFMsPajH+AEcmv8ncwt64D2Bzkl8a3C7Y/QwIvDhsaEHaXbbktBDnZqu91Dk843PXvpuZWziBET837EA88hNNIG5d9kIuXvULLARTMZirOGHe/baoHU4tWy88B99PTFmXrpZCGDhGxjy+9Lk7+Nh//wRDowOELixol2Boh9NsWP5yVi19Pu1wLjI9hdqPA8+nFZxg4sjnozZkYmqLu0VjX1LesNIdY34KZJym0ADJ+YMyE7IUI3LGJ+b3sOPAZ6mYgSg7zs2FJY36VtDgsjW/ztbxa1kITqaLO6LIqSz5rpDIKC5CWNSrnLvtHIKA7ujpONMdGDLcf88+3vsnH8CvRo2TiHCaVXSDSVYvuYbNq3+NwDY6iJ/1v/uZOPJ55ht7MZJHT2sH8bWASXWl6vIinHAhpUg7PTlNkM49Ok4tFW+AHfs/y+NT91E1A1jnsukYjbE/TrE24Nnr3si5S19EM5wq9SFcx/6d1CSJEoQBS5aNsn7Teto9HLC1kdOdPDnPf/n9dzM9NU21UsE6WygNt8MpVo9fw3nr34BzQRz3F4nvcBivn+m5nUwcuRXP60PVFq1DYvMlm/KTtLGVq4Yuxgk7kyCLM3yQ5jSBkpNBMwkwYmiHDb71yIcJbSuau9J8lTQOBpxDneOqtW/homWvom1no6GHPBhWE2a49FYE2s0W6zetZXzFCEFLu+JIRRxi4N1vfh+77tvFwGA/oQ3TtZpOAwI7x8blN3D++j+MIi1cR+vRSdR2dC7gkf1/S2gbIF7u+3WhRSz5mtaQMqFyZtE94S41DdV0KCcNCSUnoapYDan4/UxM7uDOxz5G1RsoIiZcNpXunCOwLS5b8XquWvM2fNNHM5zOZbzd18GEYcCWC86hVgPbJbO01jI47PGR936C2754G6Njw4RhkG76CYIZPFNn24Y3s2Xt6yLMahfiR21Ih+f1s+fgJ5icuSfqDWiY01CXVkcT8yk9suFeiUr3UoQp1rLTSo0qxAlZlglL3G2L9jA4QmqVIXY8/hnG+jaybfnLaLQn0xUFWph8cLTsHJtHXsjS+rnsOPZJ9s3cgQC+6c+BhHNAACNs3bY1t1GlSPzRJR43/8NXuenvPsnI2EgaJQV2DoAVY89h8+rXMFBfHztcKRA/S0AtfmWUg0f+lQOHb8GrDEXtx3zmK52YKdVuEPgzKEU4QArcpFAOkBz4JeuaZQyOKqeCJ1W+9diH6PfH2TjyLBbaU0g5R3BR9tu0MwzWVrN93Z+zf/a77DpxK0cb9+FsgGfqeFKNimShZXB4kLO3nk27FYFzNS0zRBHPt792L+//sw/S19ePtW1Cu4AxPksGf4YNy1/GspHLcepoh7OROZEipCrK8EP8yijHTt7B7n1/E4Fv1aZbc3sRHy2hqQqdMXc6cO5gCrkCk2vEKBqvDNN4+RKxOUoIkDTws8lIi8HDasC/P/LnvGjzX7Ju8PIo9FRT3AsEiPEItYWqsm7oSlYNPp3DjXvYO/VNDs/fTSM4hoij1QzZvGULq9aujhxwHAGF1jEwaNh136O87ffexEJ7knq9j6q3lBWjz2HV2NUsGbwY8SoEdi7S5hLx01KEWnx/lBNTP2Dno++JFzf5uNjxRh/p0qSwaO8prDdOZy1SWib10EHtqQGqOh+Hm6KJiUlKVYUmTb7bH5egyUySI8TDJ7ANvrL7rVyz6d1sHL6KhfbJdLthcRQ0Ks614vLvqsHLWTl4OfPBEU40H+JEcxcTh+/jggsuZGjYZ34uQtVZp1TrwrGjU/zFH34Er7WJCzZcx1DtXEYHtlKrLkdRAtdAw1Y29VKOdmJbnkj+zj3vwboFRCpoPIrU3eSUypblbe2qaStHVRun0IDbk69yLA77hNTEuJjo0UoXjdeRFdoF6RfIdoY6tRipELgFvvLo27hqzZs5b8lLaYXzkUQZUwx545M2KNC286go1cooa6tXsW7sas4eWODqZ1XjcpXBWfB8IWjBre9vssL+Plt+ZgzVSrR0zLUiiY97uB21nQyzBnj4/hATR77A7r1/jSP67orNCK+dtf6uINyOgZB4bkvs7Kl8QDwAojujk2FglK5zGqXHsV8gwxFp4gvEoIRxZuz4xoH3cGJhD5et+G18r5+Wm4vNmHSxxRIPxYUxvFFxIoysGMA5sCHU+qJlTZ/7wDT77vMYHhumHbZwuhBpmGRrlIvD1+Si/CjSsa7Nw/v+hv2HPosxNcR42RBePqTMlRh62vvOx0YdGJF9sbBrtzA02vTosduhh5Kw5/Qf4HL7AbX4teLg32kIBipeH3cf+ye+tPf3Obawi7o/Gq0hw3ZO2kp+G5VB4nU3+x9o4VdgYBSaDcfnPzTLA3c0qQ8rQRhGWipePAhWxnPmYnyNdpFX/FFmG7u5+8E3s/fQpzF+PYbo21x2TldHmy81nIL4RBV9GwKPlDGL5WK7B9ixoU23elJ5Wbx41CufQqH7vv/SiRKkvKY4Os7g0bbzVLx+ti39Jc4f/wX6q+O0bCOeTJTO7FZytVOF855TY3i5x847WhzZF1AfEqwrNQNFuxBfo+UbxsPzBmgGx9l/+FYOHLmF0M3jmYG0wqn0MjenNzkUNcPFu6R3Tc7WL4ad7XyP1+uSmGlfZcSIMa+Mg9DyZooO1kluWVrxNAtK1sHJ1N6PEcUTc9/jwOwdKMpIfQM1fxQVsIQkAYBKaSeDgYMPhzx6b0Cr4agORMQv2tHyJIOL3VIV3x8gcHNMHPsSu/Z+kCMnv46IH03Ha9hZVNIu86HdJvE7pT55bEVEVO0Xm+3dn49p7nppgAC6bNn5g+FC40ERb3UkPJE+JxvHpXS+gLI20HE6EQrPa7LoXTxC18S6NmN9mzlrybVsGLmaodoGRHxCbUWbbzUufcUMyaYWNR2cyFcukwYjYhCvgkgN1ZC55j4OT93OoeP/zmzjUYypYEwtbfRIqanSiQ3vIvW5tmQX4ifZqlH0xZOzj345sTK9GJA45nB0cMPbPfHfozgbLZCRAg4nv/u/fOI16bZ/P/+/FFrsiJiYES36KuMsH3gaa0auZOnAhQxWV2O8vriGE0ZuU21uoUamGmqS7b0+DkeoCzRaj3Ny7j6OTt7J5Ny9tIITGKniefV0q2thlJTupqbIhi4grAIz0jK1AxHn3L7B+fD8CSaap/MBqRkaHl47Zpz/gEFWqOS0IDm3l5SY0Ot0I+VTkpQ/NGVoxAinIYFrgip1f4zh+npG+7Yw1LeJweoa6tVleF4fxlQBLy7yWqy2Ce08C8Ex5lsHmW3uZaaxm/mF/bTCSUDwvToifnIGpIKJoQOGUJ41hp6nRSlgQF0OoOusiPGU8I8mZ/d/sCz9p8JyeIAdGVz/G0a8v0c1BPE7JL1kbspQk47zgEkZflJiiBSdutUwgsBrNIPsmSpGKvimP2JC7MIcFmsXCF0DpwHORSdvMFKJpljEL5oPLW9wKJqb4gmAyss+igFoGYKY05q4GeoOqSfbpqf3TXeb2jgVmMYDdGRw/VeNmGui8EC84mmh8ifeKfmHDoJ3mqeil+hcAkxuKXgBt1owHRRMWbfjOwnead3LZqbT7nfOexVtPeXwPBRjfFX3mqnZ/Z/qJv2nY4AB3Fj97HVaCXYIMq6Kk/jcptIBqJK43lFcVV88tsgOLUBRugFR5BRfVLqOUp3qUYexUbKiY5fxovziv6JZkk5wQqE570IR8Z3aL07PTbyE3Pk3u0n5qSY0vGY4OVWtDN8jwqvSM3ykob52JZV03TeUP/dKp9Uth7PF53t9PeVU+8A65L5jcFo7zU/OkXaaGroCrwqaIGpF8J26/aEG1wfBfONUA2OnO5OeAn4rmHmkVhs4YNS8LF4rXSxGSI/V3tKFuIWT3ZT/riXiwulXNdHzOD3Fe3Q/pW0nvr847XJKwkfEB885nUbti2cbhx8px/1nyoCkROG32rM7av7QhDH8fFzytHFHPUdw7QEKzJghJaJJ/kdJJ/Fl0QTv/nftxlTVLvscKIWTdPqCwkk/84SHKFDBBzcFvHy68fidvez+mTIgY0Iwc1etOvwj0BcZMX2gYXr6rY7IUruYIenIjLvdL2bRZ0bwrn9X7W6SSjF/Wdo7zsqqpbOySpxoqVoR4zvcXrX2+pnGoUUR/0wYkNOEmZ1+ZejLBi4RkfVx0S4snIU5/0N7MqP898Wan9MRvNdrumtDt9U23YmeM0uSbkWygIeIcc79a6jtl84tHH14scQ/UwakTAiC2UPN9sz/rFWGFNGnG5F6rNFh7tQD3fIt8pv1O8/CRxemlHf1F6a1utr84q42pbxosHcWkN8ZVLL5opoBfTSNex26F3Fvnpl7/K1B0Jg7E+Kf4TREZ4gKMDS05hxB/1ic/IIx3nDpd7q00RrVlLpkyN3CzZ/UHFmv9ZLaxdHGJb1EszXePS8S1ZucPoTRj6mYf5iZmTgJ3Tca/6QYkLzWJNweqa3YSNV7hTq5HrjYiBmRXEOk8HvKiZlwBoxY1Cm1F0d47VwroOVgIMU9OQvsEuV71vAvs7N9X4NHWvnKwRMl4pO9mGT0Knmiv3/9qqpxWxQ2g44LEnU5CifyMz1ASuZJ73Q/pQHF9YgJXUm3narQUNVZnHkMXx+dmZnYC4VdlX78u58SY+cm/kJPtfU/P+6LF19/LL9TfoLMyDniS/8vZcpduui0+6eXn15+enkCl/8DPVOd+9LSNi4AAAAASUVORK5C";
try{window.__fhDevInfo=null;}catch(e){window.__fhDevInfo=null;}
/* налаштування груп з попереднього запуску підставляє main.cpp;
   у сирому файлі (браузер/тести) плейсхолдер не визначений -> null */
try{window.__FH_SETTINGS=null;}catch(e){window.__FH_SETTINGS=null;}
const SETTINGS0 = window.__FH_SETTINGS;

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
const APP_VER = '3.5.25';                  // версія X.Y.Z — з version.h (див. main.cpp)
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
// 2.4.1: «перший запуск» на ПК вирішує ЛИШЕ settings.json у папці даних
// (%APPDATA%\FluxHelper). localStorage (кеш WebView2) більше НЕ може сховати
// майстер: якщо файлу налаштувань немає або він пошкоджений — майстер груп
// ОБОВ'ЯЗКОВИЙ, навіть якщо групи лишились у старому кеші браузера.
// На мобайлі свого файлу налаштувань немає (SETTINGS0 = null) — там, як і
// раніше, вирішує localStorage приватної пам'яті застосунку.
// (ANDROID тут ще не визначений — дивимося на window.AndroidHost напряму.)
let FIRST = (window.AndroidHost && window.AndroidHost.open) ? !S : !(SETTINGS0 && typeof SETTINGS0 === 'object' &&
  ['ang', 'nim', 'ukr', 'inf', 'trud'].every(function (k) {
    return SETTINGS0[k] === 1 || SETTINGS0[k] === 2;
  }));   // групи ще не налаштовані -> майстер обов'язковий

// ---------------- сповіщення ----------------
let NOTIF = { on: true, min: 5, snd: true, off: false };   // 3.4.10: дефолт ON (snd — звук; off: надсилати в офлайн-тижні)
try {
  const n = JSON.parse(localStorage.getItem('fh_notif') || 'null');
  if (n && typeof n === 'object') {
    if (typeof n.on === 'boolean') NOTIF.on = n.on;
    if (typeof n.min === 'number' && n.min >= 1 && n.min <= 15) NOTIF.min = n.min;
    if (typeof n.snd === 'boolean') NOTIF.snd = n.snd;   // нове поле — старі збірки його просто не читають
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
   адмін-панелі). Клас навчається почергово: ОФЛАЙН-тиждень (у школі)
   -> ОНЛАЙН-тиждень (вдома у Zoom) -> і так по колу. Якір: тиждень
   Пн 12.10.2026 — офлайн. Зимові канікули 24.12.2026 — 24.01.2027 у
   чергуванні НЕ беруть участі. Кнопка «Поміняти» в адмінці зберігає
   в базі weeks/flips дату понеділка, з якого чергування перевертається.
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
  if (NOTIF.off) return out;                            // дозволено в офлайн-тижні -> не пригнічувати
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

// ---------------- хост (C++ вікно / Android) ----------------
const ANDROID = !!(window.AndroidHost && window.AndroidHost.open);
function host(m) {
  if (window.chrome && window.chrome.webview && window.chrome.webview.postMessage) {
    try { window.chrome.webview.postMessage(m); return true; } catch (e) {}
  }
  return false;
}
// режим запуску Zoom (тільки ПК): 'app' = додаток (zoommtg://, без браузера;
// якщо Zoom не встановлено — хост сам відкриє браузер), 'web' = браузер
let ZOOM = { mode: 'app' };
try {
  const z = JSON.parse(localStorage.getItem('fh_zoom') || 'null');
  if (z && (z.mode === 'app' || z.mode === 'web')) ZOOM.mode = z.mode;
} catch (e) {}
function saveZoom() { try { localStorage.setItem('fh_zoom', JSON.stringify(ZOOM)); } catch (e) {} if (typeof syncUp === 'function') syncUp(); }
// ПЕРЕТВОРЕННЯ ПОСИЛАННЯ У ВЕБ-ВЕРСІЮ ZOOM (режим «Через браузер»):
// https://us05web.zoom.us/j/123456789?pwd=xyz -> https://app.zoom.us/wc/123456789/join?ref_from=launch&pwd=xyz&fromPWA=1
// Це саме та сторінка «Приєднатися з браузера» — Zoom відкриється ПРЯМО в браузері,
// без десктопного клієнта. Якщо посилання вже веб-формату або не розпізнано — віддаємо як є.
function toWebZoom(u) {
  try {
    const s = String(u || '');
    if (s.indexOf('app.zoom.us/wc/') >= 0) return s;   // вже веб-посилання
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

// ---------------- тема оформлення (2.1.0) ----------------
let THEME = 'standard';
const THEME_LIST = ['standard', 'light', 'glass'];   // 2.3.10: Океан/Захід/Ліс/Аврора тимчасово прибрано (лише 3 теми)
const THEME_NAMES = { standard: 'Стандартна тема ✓', light: 'Світла тема ✓', glass: 'Liquid Glass ✓',
                      ocean: 'Океан ✓', sunset: 'Захід ✓', forest: 'Ліс ✓', aurora: 'Аврора ✓' };
try {
  const t0 = localStorage.getItem('fh_theme');
  if (THEME_LIST.indexOf(t0) >= 0) THEME = t0;
} catch (e) {}
/* 2.8.5: watchdog Liquid Glass — на слабких GPU автоматично вмикаємо
   body.lite-glass (без блюрів; дизайн тримають тінт+бордери+градієнт).
   Міряємо середній кадр ~55 кадрів після увімкнення теми; стрибки >120 мс
   (згортання вікна/фон) скидають замір, щоб не отримати хибне «лагає». */
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
        const slow = avg > 21;   // >21 мс/кадр = менше ~48 fps -> старий iGPU не тягне
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
  THEME = (THEME_LIST.indexOf(t) >= 0) ? t : 'standard';   // 2.3.6: усі 7 тем і на ПК
  document.body.setAttribute('data-theme', THEME);
  try { localStorage.setItem('fh_theme', THEME); } catch (e) {}
  host('fh:theme|' + THEME);   // 2.8.8: хост запам'ятовує тему (settings.json) — сплеш наступного запуску одразу у ній
  refreshThemeUI();
  if (THEME === 'glass') glassPerfWatch(); else document.body.classList.remove('lite-glass');
  if (save) {
    syncUp(30);   // 2.8.6: тема одразу летить у хмару — на інших пристроях застосується сама
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
  if (ZOOM.mode === 'web') u = toWebZoom(u);   // браузер = сторінка «приєднатися в браузері»
  if (ANDROID) { try { AndroidHost.open(u); return; } catch (e) {} }
  if (host('fh:join2|' + ZOOM.mode + '|' + u)) return;   // хост: додаток або браузер
  if (host('fh:join|' + u)) return;
  window.open(u, '_blank');
}

// ---------------- підтвердження заходу на урок (ПК + телефон) ----------------
// Перемикається в налаштуваннях. Увімкнено -> клік по уроку спершу показує
// красиве вікно з затемненням і кнопками «Так / Ні» — щоб зайти на урок
// випадково не вийшло.
let CONFIRM = { on: false };
try { CONFIRM.on = localStorage.getItem('fh_confirm') === '1'; } catch (e) {}
function saveConfirm() { try { localStorage.setItem('fh_confirm', CONFIRM.on ? '1' : '0'); } catch (e) {} }

/* 3.4.12: ПЕРЕМИКАЧ БЕТА-ОНОВЛЕНЬ — ТЕПЕР У БАЗІ (просив власник: «Сделай,
   чтобы на базе данных сохранялась такая функция, как бета-версия, включена
   или выключена… чтобы не приходилось заходить на аккаунт и каждый раз это
   включать»). Локальний fh_beta лишається резервним джерелом до першого
   синку; далі значення їде у знімку налаштувань (bt) і відновлюється з хмари
   на ВСІХ пристроях. */
let BETA = { on: false };
try { BETA.on = localStorage.getItem('fh_beta') === '1'; } catch (e) {}
function saveBeta() { try { localStorage.setItem('fh_beta', BETA.on ? '1' : '0'); } catch (e) {} }

let pendingLesson = null;   // урок, що очікує підтвердження
let lastJoinBtn = null;     // кнопка «Приєднатися», яку натиснули останньою
function joinLesson(l) {
  if (!l || !l.url) return;
  /* 3.5.23: вікно «Немає підключення до інтернету» ЗНЕСЕНО повністю
     (просив власник: «полностью убери... чтобы его больше нигде не было»).
     Урок відкривається ЗАВЖДИ; якщо мережі нема, Zoom/браузер сам це покаже. */
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

// ---------------- фідбек запуску Zoom (хост штовхає події назад) ----------------
function zoomStarting() { toast('⏳ Zoom запускається — скоро все запуститься'); if (lastJoinBtn) lastJoinBtn.classList.add('starting'); }
function zoomWait() { toast('⏳ Zoom уже запускається — зачекай кілька секунд'); }
function zoomFallback() { toast('🌐 Zoom не встановлено — відкрили через браузер'); if (lastJoinBtn) lastJoinBtn.classList.remove('starting'); }

// ---------------- тост + буфер обміну ----------------
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
/* 3.5.21: КОПІЮВАННЯ ПОСИЛАННЯ НА УРОК — перемикач функції «ПКМ по уроку
   (або затиснути на тач-екрані) → посилання в буфері обміну». Налаштування
   локне (не синхронізується), за замовчуванням — УВІМКНЕНО. */
function cplOn() {
  try { return localStorage.getItem('fh_copylink') !== '0'; } catch (e) { return true; }
}
/* ============================================================
   3.5.21: АВТОМАТИЧНИЙ ВХІД У ZOOM (ТЕСТОВА ФУНКЦІЯ, ТІЛЬКИ WINDOWS)
   Просив власник: «за 3 минуты до урока оно само открывало ссылку
   на следующий урок Zoom... само закрывало окно Zoom Workplace...
   автоматически выключало камеру, звук и нажимало подключиться».

   Розклад/стан — тут (JS), виконання — нативне: host('fh:zautojoin|<url>')
   у main.cpp пише PowerShell-скрипт (UI Automation) в %TEMP% і запускає
   його приховано. Скрипт: відкриває zoommtg:// -> чекає вікно підключення
   -> зачиняє Zoom Workplace -> вимикає звук/камеру, ЯКЩО увімкнені ->
   тисне «Увійти». Тест — кнопка в налаштуваннях (своє посилання власника).
   ============================================================ */
const ZAUTO_TEST_URL = 'https://us05web.zoom.us/j/5180727157?pwd=ME9vYTFTYXpxZUo1dENGeGxNUk96QT09';
function zautoOn() {
  try { return localStorage.getItem('fh_zauto') === '1'; } catch (e) { return false; }
}
function zautoFire(url, label) {
  try {
    if (fhOfflineNow && fhOfflineNow()) { showOffl(); return; }   /* без мережі — спокійне вікно (як у «зайти на урок») */
  } catch (e) {}
  try { host('fh:zautojoin|' + url); } catch (e2) {}
  try { toast(label || ('Автоматичний вхід у Zoom (' + String(url).slice(0, 42) + '…)')); } catch (e3) {}
}
function zautoTick() {
  if (window.FH_WEB) return;              /* на сайті функції нема — лише застосунок Windows */
  if (!zautoOn()) return;
  const d = new Date();
  const dow = d.getDay();
  if (dow < 1 || dow > 5) return;         /* Пн-Пт */
  const day = RES[dow - 1];
  if (!day || !day.length) return;
  const m = d.getHours() * 60 + d.getMinutes();
  for (let i = 0; i < day.length; i++) {
    const l = day[i];
    if (!l || !l.url || !l.t) continue;
    const a = toMin(l.t);
    if (!a) continue;
    if (m >= a - 3 && m < a) {            /* вікно: за 3 хв до початку і до дзвінка */
      const key = 'fh_zauto_fired_' + (d.getFullYear()) + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '_' + l.key + '_' + l.t;
      let fired = false;
      try { fired = localStorage.getItem(key) === '1'; } catch (e) { fired = true; }
      if (!fired) {
        try { localStorage.setItem(key, '1'); } catch (e2) {}
        try { localStorage.setItem('fh_zauto_last', String(Date.now())); } catch (e3) {}
        zautoFire(l.url, 'Автоматичний вхід у Zoom: ' + (l.name || 'урок'));
      }
      break;                              /* найближчий урок оброблено */
    }
    if (a > m) break;                     /* далі уроки ще не за 3 хв */
  }
}
setInterval(zautoTick, 5000);             /* працює і у згорнутому вікні (вікно 3 хв > тротлінг 1/хв) */
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
// 2.8.1: НОВИЙ набір іконок ПРЕДМЕТІВ — білі 2D (щільна біла фігура +
// темні деталі-вирізи, як у Material filled). UI-гліфи (check, link, clock…)
// лишились лінійними. Кольори: currentColor = білий плитки, IC_D = виріз.
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
// 2.8.0: плоскі лінійні SVG-іконки (набір 2.4.2 з перемальованими ball/sigma/map/book)
// 2.8.1: старі ключі іконок (з БД/RTDB) — на нові білі 2D; UI-гліфи не чіпаємо
// 2.8.3: ПОВЕРНУТО ІКОНКИ 2.4.2 для всіх предметів, крім фізкультури (run) та мистецтва (palettef)
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
  // 3.4.5: масштабується ВСЕ разом — і вміст, І титульна панель. Раніше панель
  // лишалась 50px при будь-якому розмірі вікна (розгорнуте на весь екран вікно
  // мало тонку нерозтягнуту смужку вгорі — власника це не влаштовувало).
  // Тепер зум ставиться на body: панель, вкладки, модалки і кнопки вікна
  // ростуть пропорційно на великих моніторах/планшетах.
  const w = window.innerWidth || 1040, h = window.innerHeight || 700;
  let s = Math.min(w / 1040, h / 700);
  s = Math.max(0.8, Math.min(2.2, s));
  document.body.style.zoom = s;
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

    const tile = el('div', 'ic');
    // 2.8.0: іконки уроків — плоскі білі лінійні SVG (набір 2.4.2) на градієнтній плитці
    // 2.9.2: іконка предмета (в т.ч. алгебра ±×÷) — трохи БІЛЬША (21 -> 24),
    // щоб краще читалась у плитці
    tile.innerHTML = icon(l.icon, 24);
    tile.style.background = tileGrad(l.name);

    const mid = el('div', 'mid');
    /* 3.4.7: назва — в окремому span.ln (nowrap + автопідбір розміру), чіпи
       ЗАРАЗ/ДАЛІ переїхали в рядок мета — назві дістається ВСЯ ширина картки,
       довгі назви («Українська культура») лишаються одним красивим рядком */
    const h3 = el('h3'); const lnS = el('span', 'ln'); lnS.textContent = l.name;
    /* 3.5.11: чіп ЗАРАЗ/ДАЛІ — у РЯДОК НАЗВИ; другий рядок повністю
       віддаємо часу та імені вчителя (видно максимально). */
    h3.appendChild(lnS);
    mid.appendChild(h3);

    const meta = el('div', 'meta');
    if (i === nowIdx) meta.appendChild(el('span', 'now-chip', '<i></i>ЗАРАЗ'));
    if (i === nextIdx) meta.appendChild(el('span', 'next-chip', '<i></i>ДАЛІ'));
    const t1 = el('span', 'tc');
    t1.innerHTML = icon('clock', 12);
    const tv = el('span'); tv.textContent = l.t + ' – ' + l.e;
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
      if (!cplOn()) return;               // 3.5.21: функцію вимкнено в налаштуваннях
      if (l.split) openModal(l);
      else copyText(fmtCopy(l, -1));       // одна група -> копіюємо одразу
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
}

/* 3.4.7: АВТОПІДБІР РОЗМІРУ НАЗВИ УРОКУ — назва НІКОЛИ не переноситься і
   НЕ обрізається крапками, поки можна: якщо рядок не вміщується, шрифт
   плавно зменшується (15 -> 10.5px), і лише зовсім довга назва отримує
   ellipsis у запасі. Спрацьовує після кожного рендера — на ПК і телефоні однаково. */
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
let lpFired = false;
let swipeFired = false;   // щойно було свайп-переключення дня — гасимо клік по картці
function bindLongPress(card, l) {
  let sx = 0, sy = 0, t = null;
  card.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    sx = e.clientX; sy = e.clientY; lpFired = false;
    t = setTimeout(function () {
      t = null; lpFired = true;
      if (!cplOn()) return;               // 3.5.21: функцію вимкнено — нічого не робимо
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
  chip.innerHTML = icon('clock', 12) + '<span>' + cap + ', ' + dm + (isToday ? ' <i class="today-dot"></i>' : '') + '</span>';
}

function todayIdx() { const d = todayDow(); return (d >= 1 && d <= 5) ? d - 1 : 0; }

function setTbSec(t) { const e = byId('tbSec'); if (e) e.textContent = t; }
// сегмент-перемикач у титульній панелі: Розклад | Налаштування | Адмін (3.3.1: «Розробник» знесено)
function setSeg(view) {
  const a = byId('segSched'), b = byId('segSetup');
  if (a) a.classList.toggle('on', view === 'sched');
  if (b) b.classList.toggle('on', view === 'setup');
  const c2 = byId('segAdmin'); if (c2) c2.classList.toggle('on', view === 'adm');   // 3.3.0
}
/* 3.5.18: ПЕРЕДЗАВАНТАЖЕННЯ ВКЛАДОК (просив власник: «когда заходишь у
   вкладку перший раз — воно лагає; зроби, щоб усі вкладки завантажувались
   при заході в програму» — і на комп'ютері так само). Одноразовий прогрів
   важких екранів поки вони приховані: перше відкриття вкладки малює вже
   готовий DOM. Іконки уроків — інлайн-SVG, після прогріву з'являються миттєво. */
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
     майстер груп відкривається МОДАЛКОЮ ПОВЕРХ розкладу. Користувач бачить
     свою вкладку «Розклад» і перед ним обов'язкове вікно груп; після
     «Зберегти» лишається на розкладі. */
  if (FIRST && !force) { showSetup(); openGroups(); return; }   // перший запуск — спершу групи
  setupOpen = false;
  byId('vSetup').classList.add('hidden');
  const _vd1 = byId('vAdmin'); if (_vd1) _vd1.classList.add('hidden');   // 3.3.0: адмін-панель
  const _va1 = byId('vAcc'); if (_va1) _va1.classList.add('hidden');   // 2.8.3: профіль не «висить» поверх
  document.body.setAttribute('data-view', 'sched');
  byId('vMain').classList.remove('hidden');
  setChip();
  markNav('sched');
  setSeg('sched');
  setTbSec('розклад');
  host('fh:view|main');   // 2.7.6: нативна панель малює активний сегмент
  checkNban();
  warmTabs();   /* 3.5.18: прогрів вкладок одразу після показу головної */
}
function showSetup() {
  setupOpen = true;
  host('fh:view|setup');   // 2.7.6
  closeDrawer();
  byId('vMain').classList.add('hidden');
  const _vd2 = byId('vAdmin'); if (_vd2) _vd2.classList.add('hidden');   // 3.3.0: адмін-панель
  const _va2 = byId('vAcc'); if (_va2) _va2.classList.add('hidden');   // 2.8.3
  document.body.setAttribute('data-view', 'setup');
  byId('vSetup').classList.remove('hidden');
  buildSummary();
  refreshNotifUI();
  refreshZoomUI();
  markNav('setup');
  setSeg('setup');
  setTbSec('налаштування');
}
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
  ['vMain', 'vSetup', 'vAcc', 'vAdmin'].forEach(function (id) { const v = byId(id); if (v) v.classList.add('hidden'); });
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
  dbPut('schedule/' + dk, arr.length ? arr : null, function (ok) {
    if (!ok) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
    if (!DBD.schedule) DBD.schedule = {};
    DBD.schedule[dk] = arr;
    ADM.draft = null;
    if (typeof render === 'function') render(false);
    admRender();
    toast(skip ? 'Розклад оновлено ✓ (порожні рядки пропущено)' : 'Розклад оновлено ✓');
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
    dbPut('subjects/' + key, obj, function (ok1) {
      dbPut('teachers/' + key, null, function () {   // спільний режим: групових учителів нема
        if (ok1 === false) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
        if (!DBD.subjects) DBD.subjects = {};
        DBD.subjects[key] = obj;
        if (DBD.teachers) delete DBD.teachers[key];
        ADM.draft = null;
        admModalClose();
        admRender();
        toast('Збережено в базі ✓');
      });
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
    dbPut('subjects/' + key, obj, function (ok1) {
      dbPut('teachers/' + key, [null, t1 || null, t2 || null], function (ok2) {
        if (ok1 === false && ok2 === false) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
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
      });
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
  dbPut('subjects/' + nm, { lbl: ['1-ша група', '2-ша група'] }, function (ok) {
    if (!ok) { toast('Не вдалося додати — немає зв’язку з базою'); return; }
    if (!DBD.subjects) DBD.subjects = {};
    DBD.subjects[nm] = { lbl: ['1-ша група', '2-ша група'] };
    admModalClose();
    admRender();
    toast('Предмет додано ✓');
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
  dbPut('subjects/' + key + '/icon', nm === 'bookf' ? null : nm, function (ok) {
    if (!ok) { toast('Не вдалося зберегти іконку'); return; }
    if (!DBD.subjects) DBD.subjects = {};
    if (!DBD.subjects[key]) DBD.subjects[key] = {};
    if (nm === 'bookf') delete DBD.subjects[key].icon; else DBD.subjects[key].icon = nm;
    ADM.draft = null;
    admModalClose();
    admRender();
    toast('Іконку оновлено ✓');
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
  dbPut('weeks', { inverted: newInv ? 1 : 0, flips: newInv ? [WK_ANCHOR] : 0 }, function (ok) {
    if (!ok) { toast('Не вдалося зберегти — немає зв’язку з базою'); return; }
    WEEKS_INVERTED = newInv;
    DBW = newInv ? [WK_ANCHOR] : [];
    if (typeof pushNotifSched === 'function') pushNotifSched();
    admRenderWeeks();
    const today = new Date();
    const curTy = wkType(wkIso(wkMonday(today)));
    toast('Порядок тижнів змінено! Поточний тиждень: ' + (curTy === 'on' ? 'ОНЛАЙН' : 'ОФЛАЙН') + ' ✓');
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
  const bk3 = byId('admBack');   // 3.5.20: «До розкладу» більше нема — прибираємо залишок, якби був
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

// 2.7.3: вкладку «Розробник» ЗНЕСЕНО в 3.3.1 (власник попросив) —
// бета-перемикач тепер живе у профілі (vAcc), решта функцій була дублюванням.

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
  const t = byId(map[view] || '');   // 2.3.8: невідомий вид (профіль) — без підсвітки
  if (t) t.classList.add('on');
  /* 3.5.11: анімація появи вкладки (viewIn) при кожному переключенні */
  try {
    const vv = { home: 'vMain', sched: 'vMain', setup: 'vSetup' }[view];
    const el3 = vv && byId(vv);
    if (el3 && !el3.classList.contains('hidden')) {
      el3.classList.remove('vin'); void el3.offsetWidth; el3.classList.add('vin');
    }
  } catch (e3) {}
}

// ---------------- налаштування: групи з сегмент-перемикачами (ПК) ----------------
// Десктопний стиль: кожен предмет — рядок із перемикачем [1 | 2], зміна
// застосовується ОДРАЗУ (без модального вікна). Модалка «Деталі…» лишається
// для першого запуску і для перегляду вчителів обох груп.
function splitInfo(k) {
  const sub = subjFor(k) || {}, tch = teachFor(k) || {};
  const lbls = (sub.lbl && sub.lbl.length === 2) ? [String(sub.lbl[0]), String(sub.lbl[1])]
                                                 : ['1-ша група', '2-га група'];
  return { sub: sub, tch: tch, lbls: lbls };
}
function dispName(key) { return key ? key.charAt(0).toUpperCase() + key.slice(1) : ''; }
function saveGroupInstant(k, v) {
  if (!S) S = {};
  S[k] = v;
  try { localStorage.setItem('fh_groups2', JSON.stringify(S)); } catch (e) {}
  if (!host('fh:save|' + JSON.stringify(oldKeyMap(S)))) {
    try { localStorage.setItem('fh_groups', JSON.stringify(oldKeyMap(S))); } catch (e) {}
  }
  render(false);
  buildSummary();
  toast(infName(k) + ' — ' + v + '-ша група ✓');
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
    [1, 2].forEach(function (v) {
      const b2 = el('button'); b2.type = 'button'; b2.textContent = inf.lbls[v - 1] || (v + ' група');
      b2.classList.toggle('on', g === v);
      b2.onclick = function (ev) { ev.stopPropagation(); if (g !== v) saveGroupInstant(k, v); };
      seg.appendChild(b2);
    });
    row.append(ic, nm, seg);
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
    /* 3.4.10: клік під час перевірки бази більше НЕ мовчить — чесний тост */
    fhPendingMaster = true;
    try { toast('перевіряємо дані — групи відкрию за секунду\u2026'); } catch (eTQ) {}
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
// повний «наступний урок» — з посиланням (щоб кнопка в сповіщенні реально працювала)
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
  syncUp(30);   // 2.8.6: групи летять у хмару МОМЕНТАЛЬНО — більше не губляться при швидкому виході
  /* 2.9.2: після збереження — ЗАВЖДИ розклад (майстер відкривається поверх
     розкладу, тому після «Зберегти» користувач просто лишається на вкладці). */
  if (first || setupOpen) showMain();
}

// ---------------- сповіщення: інтерфейс + push до хостів ----------------
// 2.8.5: тестове = ПОВНА копія справжнього: заголовок «Скоро почнеться урок»,
// текст «<предмет> починається о HH:MM — через 5 хв (тестове сповіщення)»,
// кнопки «Зайти» / «Ігнорувати» у тості Windows — як у реального сповіщення.
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
  const d = new Date(Date.now() + 5 * 60000);
  const hh = ('0' + d.getHours()).slice(-2), mm = ('0' + d.getMinutes()).slice(-2);
  /* 3.4.11: тестове сповіщення = ТОЧЬ-В-ТОЧЬ справжнє (просив власник:
     «точь в точь как оригинал даже текст оригинала но только там в скобочках
     тест»). Заголовок і текст — формат справжнього сповіщення, час — за
     налаштуванням (NOTIF.min, а не «5» hardcoded), у кінці — «(тест)». */
  const title = 'Зайти на урок через ' + NOTIF.min + ' хв';
  const text = nextTestLessonName() + ' • початок о ' + hh + ':' + mm + ' (тест)';
  /* 3.4.14: «Зайти на урок» у ТЕСТІ веде на ВИМІСЛЕНЕ посилання — рандомний
     ID конференції, якого в розкладі НІКОЛИ не буває (просив власник: «щоб
     воно просто перекидувало в Zoom»). Zoom відкриється, реальні уроки — ні. */
  const turl = 'https://us05web.zoom.us/j/' + (600000000 + Math.floor(Math.random() * 399999999));
  /* 3.4.11: кнопка «Нагадати за 1 хв» у тесті — ЛИШЕ якщо в налаштуваннях
     НЕ 1 хвилина (якщо стоїть 1 хв — кнопка не приходить взагалі). */
  const sn = NOTIF.min > 1;
  /* 3.4.5: тест — СУВОРО ЛОКАЛЬНИЙ (жодної синхронізації). Кнопка тоста
     «Зайти на урок» відкриває turl; звук — за перемикачем сповіщень. */
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
function pushNotifSched(quiet) {   // 3.4.5: quiet=true — розклад із СЕРВЕРА (синк): на ПК він не має негайно стріляти за урок у вікні
  resolveLessons();
  /* 3.4.10: items на 16 днів уперед з ЧЕРГУВАННЯМ тижнів — будильники
     (і на телефоні, і нагадування хоста) більше не вмирають на вихідних */
  const items = [];
  const skipArr = (!NOTIF.off) ? (wkSuppressed(16) || []) : [];
  const skipSet = {};
  skipArr.forEach(function (dsk) { if (dsk) skipSet[String(dsk)] = 1; });
  for (let dd = 0; dd < 16; dd++) {
    const day = new Date(Date.now() + dd * 86400000);
    const dow = ((day.getDay() + 6) % 7) + 1;               // Пн=1 .. Нд=7
    if (dow > 5) continue;
    if (!NOTIF.off) {
      const wk = wkType(wkIso(wkMonday(day)));
      if (wk !== 'on') continue;
      const dstr = day.getFullYear() + '-' + ('0' + (day.getMonth() + 1)).slice(-2) + '-' + ('0' + day.getDate()).slice(-2);
      if (skipSet[dstr]) continue;
    }
    const dayArr = RES[dow - 1] || [];
    dayArr.forEach(function (l) {
      if (l.t) items.push({ dow: dow, t: l.t, n: l.name, u: l.url || '', m: ZOOM.mode });
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
  const nSnd = byId('nSnd'), sRow = byId('nSndRow'), tBtn = byId('bTestN');
  if (nSnd) nSnd.checked = !!NOTIF.snd;
  if (sRow) sRow.classList.toggle('hidden', !NOTIF.on);   // звук є сенс показувати лише коли сповіщення ввімкнені
  const nOff = byId('nOff'), oRow = byId('nOffRow');
  if (nOff) nOff.checked = !!NOTIF.off;
  if (oRow) oRow.classList.toggle('hidden', !NOTIF.on);
  /* 3.4.10: ТЕСТОВЕ СПОВІЩЕННЯ ВИДНЕ ЗАВЖДИ (було — ховалось разом із вимкненими) */
  if (tBtn) tBtn.classList.remove('hidden');
}

// ---------------- Firebase: кеш + ліміти + live-оновлення ----------------
const FETCH_GAP = 180000;          // не частіше ніж раз на 3 хв (економія лімітів)
let lastFetchTs = 0, dbBusy = false, es = null, pollTimer = 0, evT = 0, cacheTs = 0, dbOnline = false;
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
  if (db.update && typeof db.update === 'object' && db.update.test !== undefined) {
    const t2 = (db.update.test && typeof db.update.test === 'object' && db.update.test !== null) ? db.update.test : null;
    DBD.updTest = t2 ? { latest: String(t2.latest || ''), notes: Array.isArray(t2.notes) ? t2.notes.map(String).slice(0, 4) : [], tid: String(t2.tid || '') } : null;
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
  // живе відстеження версії: поки програма відкрита — як тільки в базі з'явиться
  // нова версія (SSE/doFetch), одразу показуємо модалку оновлення
  if (!fromCache && db && typeof db.update !== 'undefined') updFromDb(db.update);
  return changed;
}
/* 3.5.10: РОЗКЛАД — ЩЕ ДО ПЕРШОГО ПОКАЗУ (просив власник: «заходжу в програму,
   показує розклад з коду, а базовий догоряє 2-3 с»). Легкий запит
   /schedule.json летить ОДРАЗУ при init — відповідь застосовується одразу,
   ще під час екрана завантаження. Поллінг дубль не застосує (schedLast). */
function pubEarly() {
  try {
    fetch(DB_URL + '/schedule.json?cb=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
      .then(function (j) {
        if (!j || typeof j !== 'object') return;
        const s = JSON.stringify(j);
        if (schedLast === '') schedLast = s;   /* поллінг не сче першим застосування дублем */
        if (!DBD.schedule || JSON.stringify(DBD.schedule) !== s) { applyDb({ schedule: j }); }
      });
  } catch (e) {}
}
function doFetch(force) {
  if (dbBusy) return;
  if (!force && Date.now() - lastFetchTs < FETCH_GAP) return;
  dbBusy = true;
  fetch(DB_URL + '/.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      dbBusy = false;
      if (j && typeof j === 'object') { lastFetchTs = Date.now(); applyDb(j); }
    })
    .catch(function () { dbBusy = false; });
}
function startLive() {
  if (es) return;
  try {
    es = new EventSource(DB_URL + '/.json?alt=sse');
    es.onmessage = function (ev) {
      try {
        const m = JSON.parse(ev.data);
        if (!m || m.type !== 'put') return;
        // статистика пишеться самим застосунком — ігноруємо, щоб не жерти ліміти
        if (m.path && (String(m.path).indexOf('/stats/') === 0 || String(m.path).indexOf('/update/devices/') === 0)) return;
        if (!m.path || m.path === '/') { if (m.data) { lastFetchTs = Date.now(); applyDb(m.data); } }
        else { clearTimeout(evT); evT = setTimeout(function () { doFetch(true); }, 900); }
      } catch (e) {}
    };
    es.onerror = function () {
      if (es) { es.close(); es = null; }
      if (!pollTimer) pollTimer = setInterval(function () { if (!document.hidden) doFetch(false); }, 300000);
    };
  } catch (e) { es = null; }
}

// --- ЖИВЕ ОНОВЛЕННЯ РОЗКЛАДУ (2.1.0) -----------------------------------
// Легкий поллінг /schedule кожні 2.5 с (коли екран видно) + предмети/вчителі
// раз на 15 с. Зміна з редактора з'являється на всіх пристроях за 1-2 с БЕЗ
// перезапуску програми (SSE лишається як миттєвий канал де працює).
let schedLast = '', poolSchedT = 0, subLast = '', tchLast = '', subT = 0;
function pollSchedule() {
  if (document.hidden) return;
  fetch(DB_URL + '/schedule.json?cb=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (j) {
      if (!j || typeof j !== 'object') return;
      const s = JSON.stringify(j);
      if (s !== schedLast) {
        /* 3.5.24: ПЕРШИЙ фетч теж застосовується — раніше перший результат
           викидався (if (!first)), тож свіжий розклад доїжджав лише з другої
           хвилі; applyDb і так не перемальовує, якщо нічого не змінилось */
        schedLast = s;
        applyDb({ schedule: j }); dbOnline = true;
      }
    });
  clearTimeout(poolSchedT);
  poolSchedT = setTimeout(pollSchedule, 2500);
}
function pollSubjects() {
  if (document.hidden) { subT = setTimeout(pollSubjects, 15000); return; }
  Promise.all([
    fetch(DB_URL + '/subjects.json?cb=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
    fetch(DB_URL + '/teachers.json?cb=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
  ]).then(function (res) {
    const sj = res[0], tj = res[1];
    if (sj && typeof sj === 'object') {
      const s = JSON.stringify(sj);
      if (s !== subLast) {
        /* 3.5.24: ФІКС «СТАРІ ІКОНКИ НА САЙТІ» — перший фетч предметів більше
           НЕ викидається. Раніше перший результат pollSubjects ігнорувався
           (if (!first)), а doFetch (повна /.json — важкий) на телефоні часто
           не встигав/падав -> предмети лишалися вбудовані/кешовані тижнями
           (іконки «EN/UA/DE», bookf/filmf), хоча в адмінці вже давно нові */
        subLast = s;
        applyDb({ subjects: sj });
      }
    }
    if (tj && typeof tj === 'object') {
      const s2 = JSON.stringify(tj);
      if (s2 !== tchLast) {
        /* 3.5.24: перший фетч вчителів теж застосовується */
        tchLast = s2;
        applyDb({ teachers: tj });
      }
    }
  });
  clearTimeout(subT);
  subT = setTimeout(pollSubjects, 15000);
}

/* =================================================================
   3.4.10: ФОНОВИЙ НАГЛЯД ЗА ІНТЕРНЕТОМ (паритетність із телефоном).
   Раз на 4 с: navigator.onLine + легкий запит до бази. Зник -> за ~2 с
   екран «Немає доступу до інтернету»; повернувся -> сам зникає + свіжі дані.
   Активний лише після першої перевірки даних (dataVerified).
   ================================================================= */
let netWatchT = 0, netWatchBusy = false, netWatchFails = 0, netWatchGraceT = 0;
function netWatchPing() {
  if (navigator.onLine === false) return Promise.resolve(false);
  return new Promise(function (res) {
    let done = false, ac = null;
    try { if (typeof AbortController === 'function') ac = new AbortController(); } catch (eAC) {}
    const to = setTimeout(function () {
      if (done) return;
      done = true;
      try { if (ac) ac.abort(); } catch (eAB) {}
      res(false);
    }, 4500);
    fetch(DB_URL + '/schedule.json?cb=' + Date.now(), { cache: 'no-store', signal: ac ? ac.signal : undefined })
      .then(function (r) { if (done) return; done = true; clearTimeout(to); res(!!r.ok); })
      .catch(function () { if (done) return; done = true; clearTimeout(to); res(false); });
  });
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
    try { doFetch(true); } catch (eDF) {}
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

// ---------------- система оновлень ----------------
// Firebase /update = { latest: "X.Y.Z", notes: ["+ ...", "- ..."] } — пише deploy-скрипт.
// Програма порівнює latest із своєю версією; якщо відрізняється і папка
// versions/<v>/ реально є на GitHub — показує МОДАЛКУ, яку не можна закрити,
// і встановлює нову версію (PC: exe сам себе замінює; телефон: APK-інсталятор).
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

// ---------------- 3.5.1: «ЩО НОВОГО» ----------------
// Після оновлення (перший запуск нової версії) програма зустрічає
// користувача віконцем зі списком змін. Маркери: + додали, − прибрали,
// / переділали, ✦ виправили. Показ РІВНО ОДИН РАЗ на версію
// (fh_wn_seen у localStorage) і тільки коли користувач справді увійшов
// у програму — гейт входу, модалка оновлення і екран завантаження мають
// пріоритет. Третій елемент пункта ('pc'/'android') — показувати лише
// на одній платформі; без нього — на обох.
const WHATS_NEW = {
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
  if (ACC.user && !dataVerified) return;   // чекаємо перевірку сервера
  bootReady = true;
}
function showUpd(v, notes, testMode, pref, md5) {
  UPD.avail = true; UPD.ver = v; UPD.busy = false; UPD.pending = '';
  UPD.test = !!testMode;
  UPD.pref = pref || 'versions/release/';
  /* 3.5.15: якщо цю ж версію вже не вдалось поставити 2+ рази — одразу
     показуємо попередження і кнопки ручного встановлення (loops не для нас) */
  try {
    const fl = JSON.parse(localStorage.getItem('fh_upd_fail') || 'null');
    if (!testMode && fl && fl.ver === v && (fl.n | 0) >= 2) {
      const wn6 = byId('updWarn'); if (wn6) wn6.hidden = false;
      updErrButtons(true);
    }
  } catch (e) {}
  /* 3.4.5: MD5 нової версії з latest.json — хост перевірить ним скачаний exe
     ДО заміни файлів (захист від пошкодженого завантаження) */
  UPD.exeMd5 = (md5 && /^[0-9a-fA-F]{32}$/.test(String(md5))) ? String(md5).toLowerCase() : '';
  const chip = byId('updChip');
  if (chip) chip.textContent = (UPD.pref === 'versions/beta/') ? 'доступна бета-версія' : 'доступне оновлення';
  /* 3.5.17: «Пізніше» — ЛИШЕ для бета/тестових оновлень (просив власник:
     «если релизнутая версия, то этой кнопки не должно быть»). Звичайні
     оновлення встановлюються обов'язково; тестові пуші розробника можна
     відкласти. */
  const _ul17 = byId('updLater');
  if (_ul17) _ul17.classList.toggle('hidden', !UPD.test);
  updErrButtons(false);   // 3.5.5: чистий стан кнопок
  const b = byId('boot');
  if (b && !b.classList.contains('hidden')) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 560); }
  hideNetErr();
  // 2.8.8: модалка оновлення — найголовніша. Якщо без аккаунта гейт уже
  // видно (з першого кадру чи з accBoot) — прибираємо його, щоб гейт (z 230)
  // не перекривав оновлення (z 120) і його можна було встановити
  try { gateHide(); gateLock(false); } catch (e) {}
  byId('updOld').textContent = verLabel();   // 3.5.5: «3.5.5 beta» замість «3.5.5»
  byId('updNew').textContent = v;
  // 2.3.9: СПИСКУ ЗМІН У ПОПАПІ БІЛЬШЕ НЕМАЄ — тільки версії (власник попросив)
  const w = byId('upd');
  w.classList.remove('hidden');
  document.body.classList.add('upd-lock');   // титульна панель поверх модалки (ПК)
  byId('updGo').disabled = false;
  byId('updProg').classList.remove('on');
  byId('upFill').style.width = '0%';
  byId('upPct').textContent = '';
  byId('uStat').textContent = 'готово до встановлення';
}
// 2.7.3: існування папки версії перевіряємо за FluxHelper.exe (у папках тепер
// рівно 2 файли, changelog.txt прибрано).
// ПОРІВНЯННЯ СТРОГО «новіше»: latest <= поточної -> модалки немає (захист від відкату версії
// на сервері і від ситуації «скачав не той файл» — старіша версія не вважається оновленням).
function updCheck(latest, pref, md5) {
  /* 3.5.18: САЙТ — оновлення = перезавантаження */
  if (window.FH_WEB) { revealNow(); return; }
  if (!/^\d+\.\d+\.\d+$/.test(latest || '') || verCmp(latest, APP_VER) <= 0) { revealNow(); return; }
  if (UPD.avail || UPD.pending === latest) return;
  UPD.pending = latest;
  // 2.3.9: існування папки версії перевіряємо HEAD-запитом (тіло не качаємо).
  // 3.4.4: канал беремо з fetchLatest (release -> beta); якщо невідомий —
  // пробуємо обидва, щоб бета-оновлення доходило навіть через Firebase-фолбек.
  const heads = (pref && String(pref).indexOf('versions/') === 0)
    ? [String(pref)]
    : ['versions/release/', 'versions/beta/'];
  /* 3.4.5: бета-канал — ЛИШЕ адмінам із перемикачем; звичайні акаунти і
     без входу — тільки релізні версії */
  const heads2 = betaAllowed() ? heads : heads.filter(function (p) { return String(p).indexOf('versions/beta/') !== 0; });
  (function probe(i) {
    if (i >= heads2.length) { UPD.pending = ''; revealNow(); return; }
    /* 3.5.5: РЕЛІЗ качається з сайту — і наявність файла перевіряємо там само
       (першим кандидатом). Бета — як і раніше через raw GitHub. */
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
  // СПРАВЖНЄ оновлення — головне (перевіряємо першим)
  if (/^\d+\.\d+\.\d+$/.test(latest) && verCmp(latest, APP_VER) > 0) {
    /* 3.5.15: skip від «Пізніше» діє і тут */
    try {
      const sk7 = JSON.parse(localStorage.getItem('fh_upd_skip') || 'null');
      if (sk7 && sk7.ver === latest) { revealNow(); return; }
    } catch (e) {}
    UPD.test = false;
    /* 3.4.5: exe_md5 з Firebase-фолбека теж іде в хост */
    updCheck(latest, undefined, u.exe_md5);
    return;
  }
  // ТЕСТОВЕ оновлення (режим розробника): update/test = {latest, notes[], tid}.
  // Усі пристрої побачать звичайну модалку «доступне оновлення», але нічого
  // не скачається — при натисканні «Оновити» застосунок просто перезапуститься.
  // ВАЖЛИВО: коли користувач натиснув «Оновити» — на ЙОГО пристрої модалка
  // ЦЬОГО тесту (того самого tid) більше НЕ з'являється НІКОЛИ. Новий tid
  // (запуск нового тесту з вкладки «Розробник») = побачать знову.
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
  // нічого не вийшло -> просто показуємо головний екран
  revealNow();
}
// --- миттєве відстеження версії ---
// Джерело №1: GitHub versions/latest.json з cache-buster (?cb=час) — raw-CDN
// кешує на 5 хв, але кожен новий ?cb= обходить кеш, тож нова версія з'являється
// ОДРАЗУ після деплою (деплой заливає Firebase останнім, після перевірки GitHub).
// Джерело №2 (запасне): Firebase /update.json.
let updWatchBusy = false;
/* 3.4.4: КАНАЛ ОНОВЛЕНЬ вибирає сервер, а не прапорець. Спершу перевіряємо
   release: якщо він новіший за нашу версію — пропонуємо його. Якщо release
   не для нас (старіший або рівний) — перевіряємо beta: так бета-збірки
   (3.4.3 -> 3.4.4 у beta) отримують оновлення одразу, а релізні інсталяції
   бачать тільки стабільні релізи. cb(j) — j.latest + j._pref (канал). */
function fetchLatest(cb) {
  /* 3.4.13: ШВИДКА ПАРАЛЕЛЬНА перевірка обох каналів (просив власник:
     «кнопка перевірити оновлення має перевіряти не тільки релізнуті версії,
     а ще й бета — швидко, без затримок»). Коли бета-перемикач увімкнено,
     release і beta летять ОДНОЧАСНО — берём НОВІШУ відповідь; _pref веде
     одразу у правильну папку, без зайвих HEAD-проб іншого каналу. */
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
      firebaseFallback();   // обидва raw впали — Firebase (як у 2.7.3)
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
  /* без бети — тільки release (як раніше); фолбек Firebase */
  fetch(raw('versions/release/'), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(0); })
    .then(function (j) { mark('versions/release/', j); })
    .catch(firebaseFallback);
}
function handleLatest(u) {
  updWatchBusy = false;
  if (!u || typeof u !== 'object') return;
  const latest = (typeof u.latest === 'string') ? u.latest : '';
  /* 3.4.5: передаємо exe_md5 з latest.json у модалку -> хост */
  if (/^\d+\.\d+\.\d+$/.test(latest) && verCmp(latest, APP_VER) > 0) {
    /* 3.5.15: версію, яку власник відклав кнопкою «Пізніше», авто-попап
       більше не показує — тільки ручна перевірка */
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
// 2.3.10: ручна перевірка оновлення з налаштувань (та сама логіка, що на телефоні)
function manualUpdCheck() {
  const b = byId('bUpdNow'); if (b) b.disabled = true;
  try { localStorage.removeItem('fh_upd_skip'); } catch (e) {}   /* 3.5.15 */
  toast('Перевіряю оновлення…');
  fetchLatest(function (u) {
    if (b) b.disabled = false;
    const latest = (u && typeof u.latest === 'string') ? u.latest : '';
    if (/^\d+\.\d+\.\d+$/.test(latest) && verCmp(latest, APP_VER) > 0) {
      /* 3.4.13: передаємо _pref — файл шукаємо ОДРАЗУ в каналі, що відповів */
      updCheck(latest, u._pref, u.exe_md5);             // знайдено файл -> попап оновлення
      setTimeout(function () {
        if (!updOpen()) toast('Файл оновлення ще не опубліковано — спробуй пізніше');
      }, 9000);
      return;
    }
    if (!latest) { toast('Не вдалося зв' + String.fromCharCode(39) + 'язатися з сервером оновлень'); return; }
    toast('У тебе найновіша версія ✓');
  });
}
// --- завантаження + встановлення ---
function setUpdBtn(en) { const b = byId('updGo'); if (b) b.disabled = !en; }
/* 3.5.5: стани помилки завантаження. Замість «Оновити» показуємо два рядки:
   «Повторити знову» (та сама спроба ще раз) і «Завантажити оновлення вручну»
   (перекидає в браузер на fluxhelper.pages.dev — там exe качається сам). */
function updErrButtons(show) {
  const go = byId('updGo'), rt = byId('updRetry'), mn = byId('updMan');
  if (rt) rt.classList.toggle('hidden', !show);
  if (mn) mn.classList.toggle('hidden', !show);
  if (go) go.classList.toggle('hidden', !!show);
}
/* 3.5.15: «Пізніше» — вийти з модалки БЕЗ оновлення. Гейт повертається,
   авто-попап цієї версії більше не дратує (fh_upd_skip); ручна перевірка
   з налаштувань (bUpdNow) показує модалку як завжди. */
function updLater() {
  UPD.avail = false; UPD.busy = false;
  if (UPD.watch) { clearTimeout(UPD.watch); UPD.watch = 0; }
  /* 3.5.17: відкладати можна лише тестові (бета) оновлення */
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
  /* 3.5.5: замість кнопки «Оновити» — повтор і ручне завантаження */
  updErrButtons(true);
  /* 3.5.15: рахуємо невдалі спроби — після 2х модалка показує попередження */
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
  updErrButtons(false);   // 3.5.5: ховаємо кнопки помилки попередньої спроби
  // --- ТЕСТОВЕ ОНОВЛЕННЯ: нічого не качаємо — плавний «прогрес» і перезапуск.
  // Це симуляція справжнього оновлення: застосунок закриється і відкриється.
  // ОДРАЗУ запам'ятовуємо tid тесту — після перезапуску ця модалка на цьому
  // пристрої більше НІКОЛИ не з'явиться (до запуску нового тесту).
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
    // ТЕЛЕФОН: Android блокує встановлення APK прямо з застосунку, тому ми
    // НЕ качаємо файл самі — відкриваємо ПРЯМИЙ ПОСИЛАННЯ у браузері.
    // Користувач вже там завантажує APK і встановлює його (як звичайний файл).
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
  // ПК: застосунок сам качає exe у свою папку, замінює себе і перезапускається
  // 3.4.5: у payload іде MD5 з latest.json — хост перевірить скачаний файл
  byId('uStat').textContent = 'готуємо завантаження…';
  const payload = JSON.stringify({ v: UPD.ver, repo: UPDATE_REPO, p: UPD.pref || 'versions/release/', md5: UPD.exeMd5 || '' });
  const sent = host('fh:update|' + payload);
  if (sent) {
    // якщо за 25 с жодного прогресу — показуємо помилку
    UPD.watch = setTimeout(function () {
      if (UPD.busy && !byId('upFill').style.width) dlErr('сервер оновлень не відповідає — перевір інтернет');
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
function webProbe() {
  fetch(DB_URL + '/.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (j) {
      if (j && typeof j === 'object') {
        lastFetchTs = Date.now();
        applyDb(j);
        hideNetErr();
        updFromDb(j.update);
        return;
      }
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
  let ac = null, to = null;
  try { if (typeof AbortController === 'function') ac = new AbortController(); } catch (e) {}
  if (ac) to = setTimeout(function () { try { ac.abort(); } catch (e) {} }, 9000);
  fetch(DB_URL + '/.json', { cache: 'no-store', signal: ac ? ac.signal : undefined })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (j) {
      netBusy = false;
      if (to) clearTimeout(to);
      if (!j || typeof j !== 'object') throw 0;
      lastFetchTs = Date.now();
      applyDb(j);
      hideNetErr();
      updFromDb(j.update);        // модалка оновлення АБО показ головного
    })
    .catch(function () {
      netBusy = false;
      if (to) clearTimeout(to);
      showNetErr();
    });
}

// =================================================================
//  РЕЖИМ РОЗРОБНИКА: мости запису + статистика + редактор розкладу
// =================================================================
// --- запис у Firebase через хост (немає проблем з CORS у file://) ---
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
    // ФІКС 2.1.0: без суфікса .json Firebase повертав 404 -> телефони
    // НЕ реєструвались у статистиці пристроїв
    let p2 = fbEnc(path);
    if (p2.indexOf('.json') < 0) p2 += '.json';
    try { ok = AndroidHost.fbPut(p2, body); } catch (e) {}
    if (cb) cb(ok);
    return;
  }
  const id = 'cb' + (++fbSeq) + '_' + Date.now();
  fbCbs[id] = cb || null;
  /* 2.9.2 ФІКС: раніше тут був fh:fbput| — повідомлення, якого хост ПК НЕ
     обробляє (мовчки проковтувалось), тому auth_cb та інші Firebase-записи
     з ПК НАСПРАВДІ не писались/не чистились. Тепер — fh:cloud| (PUT), який
     хост обробляє: нативний запит без CORS. Браузер лишається на fetch. */
  const p2 = fbEnc(path) + '.json';
  if (host('fh:cloud|' + id + '|PUT|' + (DB_URL + '/' + p2).length + '|' + DB_URL + '/' + p2 + body)) return;
  // запасний шлях (браузер/прев'ю): прямий fetch (2.9.2: + виправлений слеш)
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
  /* 2.9.2 ФІКС: fh:fbdel| хост ПК не обробляв (записи auth_cb назавжди
     лишались у базі) — тепер DELETE йде через fh:cloud|. */
  const p3 = fbEnc(path) + '.json';
  if (host('fh:cloud|' + id + '|DELETE|' + (DB_URL + '/' + p3).length + '|' + DB_URL + '/' + p3)) return;
  fetch(DB_URL + '/' + p3, { method: 'DELETE' })
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
// 2.7.2: токен D1 живе ТІЛЬКИ у хості (exe/Java, XOR+base64) — у HTML його немає.
const CF_ACC = 'fd6013c3a257c7759ff3c15fbb8ac002';
const CF_DB = '89424274-f50b-4931-838e-0d6f384bbc20';
function cfOk() { return true; }
let cfSeq = 0;
const cfCbs = {};
// один запит до D1 (POST /d1/database/<id>/query). Телефон — прямий fetch
// (WebView без CORS-обмежень), ПК — через хост (fh:cfq -> WinHTTP).
function cfExec(sql, params, cb) {
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
  /* 3.4.10: 20с -> 8с — при слабкій мережі довгий таймаут множився ретраями
     fetchRole і лишав екран завантаження «завмерлим» на хвилини */
  setTimeout(function () { if (cfCbs[id]) { delete cfCbs[id]; cfLast = 0; if (cb) cb(null); } }, 8000);   // 3.4.10: було 20с
  if (ANDROID && window.AndroidHost && window.AndroidHost.cfq) {
    try { AndroidHost.cfq(id, payload); return; } catch (e) { delete cfCbs[id]; }
  }
  if (host('fh:cfq|' + id + '|' + payload)) return;   // хост додає Authorization сам
  done('');
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
  // 2.9.0: ОДНА ТАБЛИЦЯ users = профіль (email, ім'я, Firebase UID) + налаштування
  // (settings JSON, sver/sts — версія і час знімка) + created (час створення акаунта).
  // Рівно ОДИН рядок на аккаунт. СТАРІ ТАБЛИЦІ ЛІКВІДОВАНО (просив власник):
  //   user_settings — налаштування тепер живуть у users.settings;
  //   devices       — повністю перероблено в нову таблицю device
  //                   (пристрій + власник + його налаштування, WRITE-ONLY).
  cfExec('CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, name TEXT, email TEXT, pic TEXT, ts INTEGER, role TEXT DEFAULT \'user\', sync INTEGER DEFAULT 1, beta INTEGER DEFAULT 0, logins INTEGER DEFAULT 0, settings TEXT, sver TEXT, sts INTEGER, created INTEGER)', [], function (r) {
    if (r === null) cfInitTried = false;
  });
  cfExec('DROP TABLE IF EXISTS user_settings', [], null);
  cfExec('DROP TABLE IF EXISTS devices', [], null);
  // 2.9.0: журнал пристроїв власника: id, чей пристрій (Firebase UID), що це,
  // і ОСТАННІЙ знімок налаштувань. Пишеться при КОЖНОМУ запуску і при кожній
  // зміні налаштувань; НІКОЛИ не читається — навіть з вимкненою синхронізацією
  // сервер бачить актуальний стан пристрою.
  cfExec('CREATE TABLE IF NOT EXISTS device (did TEXT PRIMARY KEY, user_id TEXT, type TEXT, name TEXT, model TEXT, os TEXT, ver TEXT, settings TEXT, first_seen INTEGER, last_seen INTEGER)', [], function (r) {
    if (r === null) cfInitTried = false;
  });
  // 2.8.9: нові колонки users для існуючої бази (ALTER падає тихо, якщо вже є)
  cfExec('ALTER TABLE users ADD COLUMN logins INTEGER DEFAULT 0', [], null);
  cfExec('ALTER TABLE users ADD COLUMN settings TEXT', [], null);
  cfExec('ALTER TABLE users ADD COLUMN sver TEXT', [], null);
  cfExec('ALTER TABLE users ADD COLUMN sts INTEGER', [], null);
  cfExec('ALTER TABLE users ADD COLUMN created INTEGER', [], null);
}
function loadRemoteCfg() { /* 2.7.2: конфіг не потрібен — токен у хості, D1 вбудовано */ }

// --- пристрій у базі (2.9.0) ---
// Реєстр /stats/devices та таблиця devices ЛІКВІДОВАНО (див. d1Init):
// тепер є тільки таблиця device — WRITE-ONLY журнал (did, власник, знімок
// налаштувань), що оновлюється при кожному запуску (devicePing).
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
// інформація про пристрій: ПК — хост передає залізо в window.__fhDevInfo,
// телефон — AndroidHost.devInfo() (модель/андроїд/пам'ять)
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
/* 3.5.20: РАМКА «ПРИСТРІЙ» — ВЛАСНІ іконки платформ (просив власник: «зроби
   іконки власні, SVG, реально красиво»). Плитка-градієнт ОС + білий гліф:
   Android — зелений робот, iPhone/iPad — синє яблуко, macOS — графітове
   яблуко, Windows — прямий логотип Win11, Linux — бурштиновий Тукс. */
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
}
function devicePing() {
  if (_statBusy) return;
  _statBusy = true;
  const go = function () { _statBusy = false; deviceWrite(); };
  // на ПК чекаємо на залізо від хоста (до 4 с), щоб запис одразу був повним
  if (!ANDROID && !window.__fhDevInfo) { setTimeout(function () { _statBusy = false; devicePing(); }, 4000); return; }
  go();
}

// ================= АКАУНТ / ВХІД ЧЕРЕЗ GOOGLE (2.7.2) =================
// Канал: програма створює ключ у D1 (auth_cb) -> сайт входу пише туди профіль
// Google -> програма його забирає й видаляє. Firebase /stats НЕ використовується.
const SITE_URL = 'https://fluxhelper.pages.dev/';
const ROLEL = { user: 'Користувач', admin: 'Адмін', developer: 'Розробник' };
let ACC = { user: null, role: 'user', sync: true };
let authReady = false, agT = 0, agState = '', syncT = 0, syncLastTs = 0, LAST_NOTIF = null;
let gateAccountGone = false;   // 2.9.1: гейт відкривається через «аккаунт видалено з бази»
let cfLast = 0, agRetry = false;   // 2.7.3: статус останньої хмарної відповіді + авто-повтор входу
try {
  const _u = JSON.parse(localStorage.getItem('fh_user') || 'null');
  if (_u && _u.sub && _u.name) ACC.user = { sub: String(_u.sub), name: String(_u.name), email: String(_u.email || ''), pic: String(_u.pic || '') };
} catch (e) {}
try { ACC.sync = localStorage.getItem('fh_sync') !== '0'; } catch (e) {}
try { syncLastTs = parseInt(localStorage.getItem('fh_sync_ts') || '0', 10) || 0; } catch (e) {}

function staff() { return ACC.role === 'admin' || ACC.role === 'developer'; }
function normRole(r) { if (r === 'development') return 'developer'; return (r === 'admin' || r === 'developer') ? r : 'user'; }

// ---------- гейт входу ----------
let agOutT = 0;
function gateShow() {
  const g = byId('agate'); if (!g) return;
  clearTimeout(agOutT);
  g.classList.remove('hidden', 'ag-out');   // 3.4.0: каскад анімацій переграється заново
  document.body.classList.add('gate-on');   // 3.3.1: CSS ховає #tbar повністю — екран входу чистий, як на телефоні
  const lg = byId('agLogo'); if (lg) lg.innerHTML = '<img src="' + LOGO + '" alt="" decoding="sync">';   // 3.3.2: розмір задає CSS (#agate .us-logo img 84px)
  // сплеш ховаємо — інакше він перехоплює кліки поверх гейта
  const b = byId('boot');
  if (b && !b.classList.contains('hidden')) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 480); }
  // майстер груп, що відкрився за гейтом, прибираємо (перехоплює кліки)
  if (groupsOpen()) closeGroups();
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
function gateLock(on) { host('fh:gatelock|' + (on ? '1' : '0')); }
function gateStart() {
  gateShow(); gateLock(true);
  if (!ANDROID) host('fh:gatewarm');   // 3.4.0: підігрів входу — браузер відкриється миттєво
  agState = '';
  /* 2.9.1: якщо аккаунт викидано за відсутності в базі — пояснюємо це
     на екрані входу. Прапор читається з localStorage: хост після fh:logout
     ПЕРЕЗБИРАЄ ui.html, і заново зібраний гейт має показати ту саму
     причину (після показу прапор стирається — на наступний запуск не лишається). */
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
  // 2.8.1: резервний канал входу — сайт пише профіль у Firebase auth_cb/<state>,
  // програма опитує цей ключ, поки не прийде профіль (до 4 хв)
  clearTimeout(authPollT);
  if (!st) return;
  const t0 = Date.now();
  const tick = function () {
    if (ACC.user || agState !== st) return;   // увійшли / сесію скасовано
    fetch(DB_URL + '/update/auth_cb/' + st + '.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (ACC.user || agState !== st) return;
        if (j && j.d && j.d.sub) {
          const p = j.d;
          // 2.8.3: сайт віддає picture (OpenID) і fid (Firebase UID) — обидва більше не губляться
          // 2.8.7: + tok (Google access_token) — ним ПК сам добуде fid через fbauth.html
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
  // 2.8.1 — ВХІД ЧЕРЕЗ САЙТ (стара схема, яка працювала):
  // програма відкриває СИСТЕМНИЙ БРАУЗЕР зі сторінкою входу на сайті
  // FluxHelper (fluxhelper.pages.dev/auth), там звичайний Google-вхід,
  // і профіль САМОВІЛЬНО повертається в програму:
  //   канал 1 (ПК): локальний слухач 127.0.0.1:<порт> — миттєво,
  //                  без жодних вікон «відкрити програму?» і схем у реєстрі
  //   канал 2 (усі): Firebase auth_cb/<state> — резервне опитування
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
/* 2.8.9: стандартний знімок налаштувань для НОВОГО акаунта: групи не вибрані,
   тема standard, сповіщення увімкнені (5 хв, звук), Zoom через додаток */
function defaultSettings() {
  // 2.9.0: СТАНДАРТНІ налаштування нового аккаунта (власник): сповіщення про
  // початок уроку ВИМКНЕНІ, Zoom через додаток, підтвердження вимкнено,
  // групи НЕ вибрані (0) — майстер груп проведе, тема стандартна
  /* 3.4.10: сповіщення УВІМКНЕНІ з народження (дефолт off -> «не работают») */
  return JSON.stringify({ g: {}, n: { on: true, min: 5, snd: true }, z: 'app', th: 'standard', cf: 0, bt: 0, t: Date.now(), v: APP_VER, sync: 1 });
}
/* 2.8.5: переливаємо роль/синк/бету зі старих ключів — і «sub» (2.8.0),
   і «g:<sub>» (2.8.2) — у єдиний ключ Firebase UID, старі рядки ВИДАЛЯЄМО:
   2.8.9 = один аккаунт => РІВНО ОДИН рядок у users (за Firebase UID) */
function usersMigrateLegacy(fid) {
  if (!fid || !ACC.user) return;
  const legacySub = String(ACC.user.sub || ''), legacyG = 'g:' + legacySub;
  if (!legacySub) return;
  /* 2.9.1: колонок sub/beta більше нема — міграція = стерти застарілі
     рядки старих ключів. Актуальні дані вже під Firebase UID. */
  cfExec('DELETE FROM users WHERE (user_id=? OR user_id=?) AND user_id != ?',
         [legacySub, legacyG, String(fid)], null);
}
/* 2.8.9: КЛЮЧ КОРИСТУВАЧА В D1 = ЛИШЕ Firebase UID. Числових ключів більше нема:
   якщо fid ще не здобуто (healFid/fbAuthRegister) — повертаємо '' і всі записи
   пропускаємо, доки fid не з'явиться */
function userKey(u) {
  u = u || ACC.user;
  return (u && u.fid) ? String(u.fid) : '';
}
/* ---- 2.8.2: злиття дзеркал (users_mirror / settings_mirror) у D1 ----
   Викликається щоразу, коли D1 відповіла успіхом; тротлінг 3 хв. Так дані
   про юзерів/сетинги доїжджають до Cloudflare навіть якщо нативний міст
   лежав під час входу (проксі/фаєрвол), а ожив пізніше. */
function accApplyAuth(rows) {
  if (rows && rows[0]) {
    ACC.role = normRole(rows[0].role);
    ACC.sync = (rows[0].sync === 0) ? false : true;
    /* 2.9.1: колонки beta в таблиці більше нема — прапорець бета-оновлень
       живе в localStorage пристрою (fh_beta), читається при старті */
    try { localStorage.setItem('fh_sync', ACC.sync ? '1' : '0'); } catch (e) {}
  }
  refreshAccUI(); applyDevVis();
}

// ================= 3.4.7: ЗАВАНТАЖЕННЯ = ЕКРАН СТАРТУ 1-В-1 =================
// Користувач: «дизайн синхронизации — точь-в-точь як дизайн загрузки самой
// программы… по центру логотип, под низом завантаження, потом поле загрузки,
// проценты пишутся… чтобы была ОДНА загрузка».
// Іншого оверлея більше НЕМАЄ: вхід в акаунт, старт із живою сесією і ручна
// синхронізація показують ТОЙ САМИЙ екран #boot, що й при запуску програми
// (логотип + назва + полоса прогресу + відсотки). Поки база не відповіла —
// полоса повзе 0 -> 85%; після відповіді (hideDataLoad) — дозаповнюється до
// 100% і плавно зникає, відкриваючи вже зібраний інтерфейс.
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
   Поки йде settle — fhSettling=true: openGroups() СТАВИТЬСЯ В ЧЕРГУ
   (fhPendingMaster), showMain із рішенням теж чекає. Це вбиває обидва
   баги остаточно:
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
    /* 3.4.6: майстер, поставлений у чергу під час перевірки (кнопка «Мої
       групи» або попередній стан) — відкриваємо ПІСЛЯ рішення, якщо групи
       таки є (інакше викликач рішення 'master' сам відкриє майстер) */
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
/* 2.8.7: ПК також добуває fid через прихований iframe на fbauth.html (сайт):
   якщо канал входу не встиг зареєструвати юзера у Firebase (fid пустий),
   обмін робиться звідси — так само, як на телефоні. */
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
/* 2.8.7: ЄДИНИЙ КЛЮЧ = Firebase UID. Поки fid невідомий — healFid -> fbAuthRegister. */
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
  /* 3.4.0: НА ПК профіль на диск НЕ пишемо взагалі — сесію зберігає хост у
     Credential Manager, а в інтерфейс вона повертається через AUTH-JSON плейсхолдер.
     Android лишає штатний localStorage (там своя модель зберігання). */
  if (ANDROID) { try { localStorage.setItem('fh_user', JSON.stringify(u)); } catch (e) {} }
  /* 3.4.9: ФІКС «зайшов з акаунта — перезапустив — знову просить увійти».
     Якщо профіль прийшов ПОВЗ хоста (резервний канал Firebase — authPollDb,
     коли сайт не зміг достукатись до локального слухача), хост про вхід
     НЕ ЗНАЄ: Credential Manager лишається порожнім, і після перезапуску
     програма знову показує гейт. Тепер інтерфейс сам повідомляє хоста
     (fh:authsave) — сесія зберігається ОДРАЗУ, як і на каналі loopback. */
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
    /* 3.4.5: офлайн — спершу пер-акаунтний кеш, і лише якщо там нема груп —
       майстер. Раніше офлайн ГАРАНТОВАНО вмикав майстер, який потім блимав
       закривався, коли база оживала. */
    else if (S || paccRestore()) { showMain(); render(); }
    else                       { showMain(true); AUTO_SETUP = true; openGroups(); }
    refreshAccUI();
    /* 3.5.23: і тут — повертаємо вкладку з хеша (та сама причина) */
    try { if (window.FH_WEB && typeof window.__fhHashApply === 'function') window.__fhHashApply(); } catch (eHA2) {}
  });
  const rk = userKey(ACC.user);
  /* 3.4.7: швидкий шлях ролі (з ретраями). Основний шлях — settleSync вище:
     syncPull тепер тягне роль у тому самому знімку, що й налаштування,
     і застосовує ЇЇ ПЕРШОЮ. Тут — підстраховка, щоб навіть при збої
     обох запитів роль прибула до перезапуску. */
  (function roleFast(n, sub0) {
    if (!rk || !ACC.user || ACC.user.sub !== sub0) return;
    cfExec('SELECT role, sync FROM users WHERE user_id=?', [rk], function (rows) {
      if (!ACC.user || ACC.user.sub !== sub0) return;
      if (rows && rows[0]) { accApplyAuth(rows); }
      else if (rows === null && n < 2) { setTimeout(function () { roleFast(n + 1, sub0); }, 1500); }
    });
  })(0, u.sub);
  // 2.8.7: fid не прийшов із каналу входу — добуваємо (healFid -> fbAuthRegister);
  // після прибуття — usersUpsert під fid + МИТТЄВА міграція g:/sub-рядків.
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
  if (typeof evalPendUpd === 'function') evalPendUpd();
  toast('Вітаємо, ' + (u.name || 'друже') + '!');
}
function authLogout() {
  /* 3.5.23: без віконця офлайну — вихід працює завжди (3.5.23) */
  paccSave();   // 3.4.5: знімок налаштувань ЦЬОГО аккаунта в кеш (до стирання)
  ACC.user = null; ACC.role = 'user'; ACC.sync = true;
  syncWatchStop();   // 2.8.6: годинник синку зупиняємо одразу
  // 2.8.6: ПОВНЕ стирання слідів акаунта на стороні інтерфейсу ДО перезбору:
  // профіль, state входу, часовий замок синку, прапорець sync — щоб
  // жоден механізм відновлення сесії не міг «оживити» акаунт
  try {
    localStorage.removeItem('fh_user');
    localStorage.removeItem('fh_auth_state');
    localStorage.removeItem('fh_sync_ts');
    localStorage.removeItem('fh_sync');
  } catch (e) {}
  cleanLocalGroups();   // 2.9.0: наступний аккаунт стартує з ЧИСТИМИ групами (майстер)
  /* 3.4.5: пер-акаунтна ізоляція — активні налаштування (групи, сповіщення,
     Zoom, тема, замок синку) стираються АКТИВНИМИ; кеш кожного аккаунта
     зберігається окремо (fh_pacc_<uid>) і не протікає в інші аккаунти.
     fh_beta НЕ стираємо — це перемикач пристрою (адмінський). */
  paccClearActive();
  reloadLocalSettings();
  NOTIF.on = false; saveNotif();          // без аккаунта сповіщень нема
  try { refreshNotifUI(); refreshZoomUI(); } catch (e) {}
  try { pushNotifSched(true); } catch (e2) {}   // тихо знімаємо розклад хоста
  syncLastTs = 0;
  clearTimeout(syncT);
  clearTimeout(authPollT);
  agState = '';
  authReady = false;
  refreshAccUI(); applyDevVis();
  // 2.8.6: ГОЛОВНИЙ ФІКС «після виходу можна користуватись програмою» —
  // гейт входу показуємо НЕГАЙНО (як на телефоні), ще ДО того, як хост
  // перезбере ui.html. Раніше ми лиш покладались на хост: якщо стирання
  // даних браузера/навігація тягнулись або зривались — старий UI лишався
  // повністю робочим без акаунта. Тепер гейт перекриває ВСЕ миттєво,
  // кнопки/вкладки недоступні (gateLock -> fh:close = згортання), і лише
  // вхід знімає блокування.
  gateStart();
  // 2.8.5: КОРИСТУВАЧ МАВ ПРАВУ НА ПОВНИЙ ВИХІД: чистимо g_cfg у settings.json
  // (раніше саме він повертав акаунт після перезапуску) + стираємо cookies/storage
  // хост перезбирає ui.html із нульовим збереженим акаунтом -> чистий гейт входу
  // (2.8.8: ім'я плейсхолдера авторизації в коментарях НЕ писати дослівно —
  //  ReplaceFirst хоста влучав у коментар замість коду нижче, і сесія з
  //  settings.json не відновлювалась після стирання браузерних даних!)
  host('fh:logout');
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
/* 2.8.5 (2.9.1: спрощено) — старі збірки/запасні канали писали рядок
   під 'g:<sub>' або 'sub'. Тепер колонок sub/beta в таблиці нема, а
   міграція = просто стерти застарілі рядки: актуальні дані живуть під
   Firebase UID, і один аккаунт = один рядок. */
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
    /* 3.3.1: ГОЛОВНИЙ ФІКС «просить авторизуватись, хоч акаунт авторизовано».
       Хост вшиває видимий гейт, коли в settings.json НЕМА акаунта, але localStorage
       його ще пам'ятає (наприклад після оновлення зі старої схеми налаштувань).
       Раніше НІХТО не ховав #agate у цій ситуації — екран входу висів поверх
       робочої програми. Тепер наявність сесії в JS = гейт ховається ОДРАЗУ. */
    gateHide();
    authReady = true;
    gateLock(false);
    /* 3.4.6: єдина точка рішення — тільки після відповіді бази (settleSync) */
    healFid(function () {
      // 2.8.9: один ключ — Firebase UID. Жодних перевірок за числовими ключами
      const k = userKey(ACC.user);
      if (!k) {
        /* 3.3.1: fid ще не здобуто — НЕ ВИКИДАЄМО на екран входу (раніше це
           було джерелом «гейт при живому акаунті»). Працюємо офлайн з локальною
           сесією, fid добуваємо у фоні; щойно з'явиться — підтягнемо роль і синк. */
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
          /* 3.4.7: fetchRole — з ретраями (один збій D1 не лишає акаунт без ролі) */
          fetchRole(k2, function (rows) {
            if (!ACC.user) return;
            if (rows && rows[0]) {
              accApplyAuth(rows);
              fhRowSeen(k2);   // 3.4.8: рядок підтверджено
              usersUpsert(ACC.user);
              settleSync(settleDecide);
              syncWatchStart();
            } else if (rows) {
              /* 3.4.8: «рядка нема» ≠ «видалено», доки рядок ніразу не
                 читали (див. фікс гонки реєстрації) */
              if (fhRowKnown(k2)) {
                hideDataLoad();
                confirmAccountGone();   // рядок справді зник — тоді вже гейт
              } else {
                usersUpsert(ACC.user, function () { if (ACC.user) settleSync(settleDecide); });
                syncWatchStart();
              }
            } else {
              settleSync(settleDecide);   // D1 не відповіла — ретраї всередині settleSync
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
          /* 3.4.6: рішення «розклад чи майстер» — ЛИШЕ після відповіді бази
             (3 спроби; оверлей уже показано в init) */
          settleSync(settleDecide);
          syncWatchStart();   // 2.8.6: сесію відновлено — спостерігач знову в строю
        } else if (rows) {
          /* 3.4.8: див. фікс гонки реєстрації: не бачили рядок = ще
             реєструється (реєструємо і вирішуємо як звичайний вхід) */
          if (fhRowKnown(k)) {
            hideDataLoad();
            confirmAccountGone();   // 2.9.1: одноразовий повтор, потім викид
          } else {
            usersUpsert(ACC.user, function () { if (ACC.user) settleSync(settleDecide); });
            syncWatchStart();
          }
        } else {
          // rows === null -> D1 не відповіла: ретраї всередині settleSync,
          // після дедлайну — офлайн-показ з локальних даних/пер-акаунтного кешу
          settleSync(settleDecide);
        }
      });
    });
  } else {
    /* 3.5.21: ФІКС «ЗАВИСАННЯ НА 88%» БЕЗ АКАУНТА (просив власник: «если я
       вышел с аккаунта и из данных загружать нечего — почему загрузка минуту
       висит на 88%?»). Раніше bootReady ставився лише коли приходили дані
       з бази (updFromDb -> revealNow): повільне/заблоковане дзеркало = екран
       завантаження висів ~хвилину. Акаунта нема -> перевіряти нічого ->
       reveal ОДРАЗУ, гейт входу показуємо під ним. */
    bootReady = true;
    gateStart();
  }
}
/* 3.5.21: СТРАХОВОЧНИЙ СТОРОЖ старту: через 9.5 с відпускаємо екран
   завантаження, якщо reveal досі не стався. Живий акаунт ще не перевірений
   -> НЕ мішаємось: у settleSync власний дедлайн 9 с. Остання лінія оборони
   від «висить на 88%» у будь-якій ситуації. */
setTimeout(function () {
  try {
    if (!bootReady && !(ACC.user && !dataVerified)) bootReady = true;
  } catch (eWD) {}
}, 9500);
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
/* 3.4.10: ГАРАНТОВАНА ПРОПОЗИЦІЯ ГРУП (паритетність із телефоном):
   акаунт живий + групи не налаштовані + майстра немає -> майстер відкривається.
   Викликається з усіх точок рішення І наглядачем кожні 3 с — жодних
   «не пропонує налаштувати групи» за жодних таймінгів мережі. */
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
/* 2.9.1: ПЕРЕВІРКА АКТУАЛЬНОСТІ АКАУНТА. Якщо D1 ДОСТУПНА, а рядка
   користувача в таблиці users більше немає (видалено з бази) — аккаунт
   недійсний: миттєво викидаємо з акаунта, стираємо всі сліди (як authLogout)
   і показуємо гейт входу з поясненням. Google-сесію чистить хост
   (fh:logout -> cookies + settings.json), тому вхід буде «з нуля» —
   можна увійти ІНШИМ Google-акаунтом. */
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
  gateAccountGone = !quiet;   // гейт покаже пояснення замість звичайного тексту
  gateStart();
  /* 2.9.1: хост після fh:logout перезбирає ui.html — прапор у localStorage
     переживає перезбірку, і новий гейт пояснить причину виходу */
  try { localStorage.setItem('fh_gone_msg', '1'); } catch (e) {}
  host('fh:logout');          // 2.8.5: чистимо g_cfg у settings.json + cookies WebView
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

// ---------- акаунт: сторінка профілю ----------
function avaHtml(u) {
  if (u && u.pic) return '<img src="' + escH(u.pic) + '" referrerpolicy="no-referrer" alt="">';
  return escH(((u && u.name) || '?').charAt(0).toUpperCase());
}
function refreshAccUI() {
  // 2.8.0: кнопка акаунта в титульній панелі (аватар + ім'я + пошта) — весь елемент клікабельний
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
  // 2.7.6: компактна картка «Акаунт» у налаштуваннях — ЗНЕСЕНО в 2.9.1 (пустий квадрат)
  const c2 = byId('ac2Card'); if (c2 && c2.parentNode) c2.parentNode.removeChild(c2);
}
function showAcc() {
  if (!ACC.user) { gateStart(); return; }
  closeDrawer();
  byId('vMain').classList.add('hidden');
  byId('vSetup').classList.add('hidden');
  const _vd3 = byId('vAdmin'); if (_vd3) _vd3.classList.add('hidden');   // 3.3.0: адмін-панель
  document.body.setAttribute('data-view', 'acc');
  const v = byId('vAcc'); if (v) { v.classList.remove('hidden'); v.scrollTop = 0; }
  // 2.8.6: активна вкладка просто ВТРАЧАЄ фіолетову підсвітку (setSeg без
  // збігів знімає .on з усіх кнопок). Раніше .on лишався, а його «сірий»
  // вигляд у профілі перебивався CSS-правилом — через це ламались ховер
  // (правило з вищою специфічністю било :hover) і кольори в світлій темі.
  setSeg('acc');
  markNav('acc');
  refreshAccUI();   // 3.4.0: плитки «остання синхронізація» завжди свіжі
}
/* 3.5.20: accBack() і кнопка «Назад» знесені — сегментний переремикач
   (Розклад/Налаштування/Профіль) завжди зверху (просив власник) */

// ---------- синхронізація налаштувань (Cloudflare D1) ----------
// ПИШЕМО завжди (сервер тримає останній знімок акаунта), ЗАСТОСОВУЄМО з сервера
// лише коли тумблер «Синхронізація» увімкнений — або разово на вході (force).
function syncUp(now) {
  if (!ACC.user) return;
  clearTimeout(syncT);
  syncT = setTimeout(function () {
    if (!ACC.user) return;
    const g = {};
    for (const ok in OLDKEY) if (S && (S[OLDKEY[ok]] === 1 || S[OLDKEY[ok]] === 2)) g[ok] = S[OLDKEY[ok]];
    // 2.8.6: знімок БЕЗ sub — ідентифікація ЛИШЕ за Firebase UID (user_id).
    // Тема (th) у знімку; тумблер sync — теж.
    /* 3.4.12: у знімку тепер і «підтверджувати захід» (cf), і бета (bt) —
       усе зберігається в базі й відновлюється на будь-якому пристрої */
    /* 3.4.12: cf і bt у знімку. 3.5.5: + r (роль) — сайт на айфоні не бачить D1,
       роль він читає З ЗНІМКА; перемикач синку теж подорожує. */
    const p = { g: g, n: { on: !!NOTIF.on, min: NOTIF.min, snd: !!NOTIF.snd, off: !!NOTIF.off }, z: (typeof ZOOM !== 'undefined' && ZOOM.mode) ? ZOOM.mode : 'app', th: (typeof THEME !== 'undefined') ? THEME : '', cf: CONFIRM.on ? 1 : 0, bt: BETA.on ? 1 : 0, t: Date.now(), v: APP_VER, sync: ACC.sync ? 1 : 0, r: (ACC.role === 'admin' || ACC.role === 'developer') ? ACC.role : 'user' };
    const k = userKey(ACC.user);
    if (!k) return;   // 2.8.9: без Firebase UID записів нема (жодних числових ID)
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
      } else {
        // 2.8.2: D1 недоступна -> дзеркало сетингів у Firebase (доїде до D1 пізніше)
        try {
          dbPut('/update/settings_mirror/' + fbEnc(k.replace(/[^A-Za-z0-9_-]/g, '_')),
                { d: { fid: k, settings: JSON.stringify(p), v: APP_VER }, t: p.t }, null);
        } catch (e3) {}
      }
    });
  }, now ? 30 : 350);   // 2.8.6: 350 мс замість 1200 — зміни доїжджають миттєво,
                        // навіть якщо закрити програму одразу після зміни
}
function syncApply(p, force) {
  if (!p || typeof p !== 'object' || !ACC.user) return;
  if (!ACC.sync && !force) return;
  const t = parseInt(p.t, 10) || 0;
  // 2.8.5: КНОПКА «Синхронізувати дані» (force) оминає часовий замок —
  // раніше власний пізніший знімок ПК блокував підтягування теми з телефона
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
  /* 3.4.12: підтвердження заходу і бета з хмари (фого втрата налаштувань
     при зміні акаунта — точний баг від власника) */
  if (typeof p.cf !== 'undefined') {
    const cfv = (p.cf === 1 || p.cf === true || p.cf === '1');
    if (cfv !== CONFIRM.on) { CONFIRM.on = cfv; saveConfirm(); ch = true; }
  }
  if (typeof p.bt !== 'undefined' && staff()) {
    const btv = (p.bt === 1 || p.bt === true || p.bt === '1');
    if (btv !== BETA.on) { BETA.on = btv; saveBeta(); ch = true; }
  }
  /* 3.5.5: ПЕРЕМИКАЧ СИНХРОНІЗАЦІЇ тепер теж подорожує зі знімком (просив
     власник): вимкнув синк на сайті/телефоні — на ПК він вимкнеться сам,
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
  // 2.8.5: тема із хмари — застосовуємо одразу (тема з телефона тепер доїжджає на ПК)
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
/* 3.4.12: + fh_confirm (підтверджувати захід) і fh_beta (бета-оновлення) —
   тепер вони пер-акаунтні і синхронізуються з базою, як решта налаштувань */
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
  try { if (typeof refreshZoomUI === 'function') refreshZoomUI(); } catch (eZ2) {}
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
function syncPull(force, cb, _try) {   // 3.4.4: cb(dec) — 'ok' | 'master' | 'offline'; рішення показує той, хто викликав
  if (!ACC.user) { if (cb) cb('offline'); return; }
  const k = userKey(ACC.user);
  if (!k) { if (cb) cb('offline'); return; }   // 2.8.9: читаємо лише за Firebase UID (healFid/fbAuthRegister добудують)
  const attempt = _try || 0;
  /* 3.4.7: ОДИН ЗАПИТ НЕСЕ І РОЛЬ, І СИНК, І НАЛАШТУВАННЯ. accApplyAuth
     застосовується ПЕРШИМ, ще до рішення «розклад чи майстер» — вкладка
     адміна/перемикачі гарантовано вже на місці при показі інтерфейсу,
     а syncApply бачить правильний ACC.sync (раніше це були ДВА різні
     запити-перегони — і роль могла прибути пізніше за інтерфейс). */
  cfExec('SELECT role, sync, settings, sts FROM users WHERE user_id=?', [k], function (rows) {
    if (!ACC.user) { if (cb) cb('offline'); return; }
    if (rows && rows[0]) { fhRowSeen(k); accApplyAuth(rows); }   // 3.4.8: рядок підтверджено
    /* 3.4.5: D1 не відповіла -> до ДВОХ повторів з паузою 1,5 с (мережа могла
       блимнути саме під час входу). Раніше перший же збій вважався «офлайном»,
       вмикався майстер груп — і через кілька секунд зникав, коли повторний
       запит знаходив налаштування. Саме цей «блим» прибираємо. */
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
        // 2.8.7: групи підтягнулись із хмари під час входу -> ведемо в розклад
        if (cb) cb('ok');
        else if (force && !FIRST && S && setupOpen) { showMain(); render(); }
      } else {
        // 3.5.3: груп у D1 нема — можливо, їх налаштували НА САЙТІ:
        // спершу читаємо дзеркало, і тільки потім рішення «майстер»
        webMirrorPull(k, function (mj) {
          if (!ACC.user) return;
          if (mj && typeof mj === 'object' && cloudGroupsOk(mj) && (parseInt(mj.t, 10) || 0) >= (parseInt((p && p.t), 10) || 0)) {
            syncApply(mj, force);
            if (cb) cb('ok'); else if (!FIRST && S) { showMain(); render(); }
            return;
          }
          cleanLocalGroups();
        /* 3.4.5: в хмарі нічого нема -> відновлюємо кеш САМЕ ЦЬОГО аккаунта
           (це його власні налаштування). Якщо в кеші валідні групи —
           аккаунт вважається налаштованим, майстер не показуємо. */
        if (p.rs !== 1 && paccRestore() && validS(S)) {   // 3.4.8: rs:1 — кеш не відновлюємо, майстер обов'язковий
          FIRST = false;
          try { if (groupsOpen()) closeGroups(); } catch (eCR) {}   // 3.4.5: кеш дав групи — майстер більше не потрібен
          if (cb) cb('ok'); else { showMain(); render(); }
        } else if (cb) cb('master');
        /* 3.4.5: виклик БЕЗ колбека (healFid-повтор/фонові шляхи) НІКОЛИ не
           відкриває майстер сам — раніше саме він блимав поверх уже ухваленого
           рішення. Майстер відкриває ЛИШЕ той, хто обробляє рішення входу. */
        });
      }
    } else if (rows) {
      // РЯДКА В ХМАРІ НЕМАЄ = ПЕРШИЙ ВХІД ЦЬОГО АККАУНТА — майстер обов'язковий.
      // 3.5.3: але якщо налаштування є в дзеркалі веб-версії — беремо ЇХ
      webMirrorPull(k, function (mj) {
        if (!ACC.user) return;
        if (mj && typeof mj === 'object' && cloudGroupsOk(mj)) {
          syncApply(mj, force);
          if (cb) cb('ok'); else { showMain(); render(); }
          return;
        }
        cleanLocalGroups();
      if (paccRestore() && validS(S)) {   // 3.4.5: пер-акаунтний кеш (повторний вхід без синку)
        FIRST = false;
        try { if (groupsOpen()) closeGroups(); } catch (eCR) {}   // 3.4.5: кеш дав групи — майстер більше не потрібен
        if (cb) cb('ok'); else { showMain(); render(); }
      } else if (cb) cb('master');
      /* 3.4.5: без колбека майстер сам НЕ відкривається (див. коментар вище) */
      });
    } else {
      // rows === null -> D1 недоступна (після ретраїв): 3.5.3 — спершу
      // дзеркало веб-версії, і тільки потім офлайн-режим
      webMirrorPull(k, function (mj) {
        if (!ACC.user) return;
        if (mj && typeof mj === 'object' && cloudGroupsOk(mj)) {
          syncApply(mj, force);
          if (cb) cb('ok'); else if (force && !FIRST && S && setupOpen) { showMain(); render(); }
          return;
        }
      // 3.4.5: спершу пер-акаунтний кеш — якщо в ньому валідні групи,
      // аккаунт вважається налаштованим і майстер не блимає.
      if (paccRestore() && validS(S)) {
        FIRST = false;
        try { if (groupsOpen()) closeGroups(); } catch (eCR) {}
        if (cb) cb('ok'); else { showMain(); render(); }
      } else if (cb) cb('offline');
      /* 3.4.5: без колбека і без кешу — нічого не відкриваємо самі */
      });
    }
  });
}
/* 2.8.6: РЕАЛЬНИЙ ЧАС — легке спостереження за знімком у хмарі.
   Кожні 8 с — запит ТІЛЬКИ ts (мікро-відповідь, не витрачає ліміти D1);
   повне тягнемо лише коли знімок чужий і новіший. Вимкнена синхронізація —
   годинник стоїть. Завдяки цьому зміна теми/груп на ПК доїжджає на
   телефон за кілька секунд (і навпаки) без кнопки «Синхронізувати». */
let syncWatchT = 0;
function syncWatchStop() { clearTimeout(syncWatchT); syncWatchT = 0; }
function syncWatchTick() {
  syncWatchT = 0;
  if (!ACC.user) return;                        // не в акаунті — не маємо діла
  const k = userKey(ACC.user);
  if (!k) {   // 3.4.8: fid ще не здобуто — годинник НЕ гасне, чекає наступного тіка
    if (ACC.user && !syncWatchT) syncWatchT = setTimeout(syncWatchTick, 5000);
    return;
  }   // 2.8.9: лише за Firebase UID
  /* 3.5.3: ДЗЕРКАЛО ВЕБ-ВЕРСІЇ (update/web/<uid>) — зміни, зроблені на сайті
     на айфоні, доїжджають на ПК/телефон у той самий 5-секундний цикл, що й D1.
     3.5.5: опитуємо навіть КОЛИ синк вимкнено — але тільки за перемикачем:
     як тільки синк увімкнули на іншому пристрої, тут він сам відновиться. */
  fetch(DB_URL + fbEnc('update/web/' + k) + '.json?cb=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (j) {
      if (!ACC.user || !j || typeof j !== 'object') { if (ACC.user && !syncWatchT) syncWatchT = setTimeout(syncWatchTick, 5000); return; }
      if (!ACC.sync) {
        const svOn = !(j.sync === 0 || j.sync === false || j.sync === '0');
        if (typeof j.sync === 'undefined' || !svOn) { if (!syncWatchT) syncWatchT = setTimeout(syncWatchTick, 5000); return; }
        ACC.sync = true;
        try { localStorage.setItem('fh_sync', '1'); } catch (eSY6) {}
        const sc6 = byId('acSync'); if (sc6) sc6.checked = true;
        refreshAccUI();
      }
      if ((j.g || j.n || j.th) && (parseInt(j.t, 10) || 0) > syncLastTs) {
        try { syncApply(j, false); } catch (eWM) {}
      }
      if (!syncWatchT) syncWatchT = setTimeout(syncWatchTick, 5000);
    });
  cfExec('SELECT sts FROM users WHERE user_id=?', [k], function (rows) {
    if (!ACC.user) return;
    /* 2.9.1: D1 відповіла, а рядка НЕМА -> аккаунт видалили з бази.
       Підтверджуємо повторним запитом і викидаємо з акаунта. */
    /* 3.4.8: D1 відповіла, а рядка НЕМА. Рядок БАЧИЛИ раніше -> аккаунт
       справді видалили (підтвердження + викид). НЕ БАЧИЛИ -> новий акаунт
       ще реєструється: ДОГАНЯЄМО реєстрацію, ніякого викиду. */
    if (rows && !rows[0]) {
      if (fhRowKnown(k)) { confirmAccountGone(); }
      else { usersUpsert(ACC.user, null); }
      if (ACC.user && !syncWatchT) syncWatchT = setTimeout(syncWatchTick, 5000);
      return;
    }
    if (rows && rows[0]) fhRowSeen(k);   // 3.4.8: рядок підтверджено
    if (rows && rows[0]) {
      const ts = parseInt(rows[0].sts, 10) || 0;
      if (ts > syncLastTs && ACC.sync) {
        // чужий новіший знімок — тягнемо повністю (syncApply сам оминає свій запис:
        // syncUp оновлює syncLastTs ДО повернення, тому власний запис не тригерить)
        cfExec('SELECT settings FROM users WHERE user_id=?', [k], function (rows2) {
          if (rows2 && rows2[0] && ACC.user) { try { syncApply(JSON.parse(rows2[0].settings), false); } catch (e) {} }
        });
      }
    }
    if (ACC.user && !syncWatchT) syncWatchT = setTimeout(syncWatchTick, 5000);
  });
}
function syncWatchStart() {
  syncWatchStop();
  if (ACC.user) syncWatchT = setTimeout(syncWatchTick, 5000);
}
/* 3.4.15: МИТТЄВЕ ПІДТЯГУВАННЯ при поверненні з фону — налаштування (тема,
   звуки, підтвердження, групи), змінені на іншому пристрої, з'являються ще
   до першого планового тіка (телефон <-> ПК — обидва боки). */
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState !== 'visible') return;
  if (ACC.user) { try { clearTimeout(syncWatchT); syncWatchT = 0; syncWatchTick(); } catch (e) {} }
});

// ---------- вкладка розробника (тільки Адмін/Розробник) ----------
function applyDevVis() {
  const sa = byId('segAdmin'); if (sa) sa.style.display = (ACC.user && admStaff()) ? '' : 'none';   // 3.3.0: адмін-панель
}

function escH(s) {
  return String(s || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// --- ТЕСТОВЕ ОНОВЛЕННЯ (UI) ---
// ---------------- банер сповіщень (телефон) ----------------
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

// ---------------- ініціалізація ----------------
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
        document.body.classList.remove('booting');
        try { gateHide(); } catch (eGH2) {}
        if (b) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 580); }
        try { wnSchedule(900); } catch (eWN) {}   // 3.5.1: «Що нового» після завантаження даних
        return;
      }
      // 2.8.2: АНТИ-СПАЛАХ — якщо акаунта немає, ПІД завантаженням показуємо
      // гейт входу, а не головний інтерфейс: користувач НІКОЛИ не бачить
      // розклад/вкладки до входу (раніше головний екран блимав на ~0,5 с)
      if (!ACC.user) {
        // 2.8.8: якщо відкрита модалка оновлення — гейт не показуємо,
        // інакше він (z 230) перекриє її (z 120)
        if (!updOpen()) { try { gateShow(); } catch (e1) {} }
        // 'booting' ховає лого в панелі — на гейті панель має бути повна (лого зліва)
        document.body.classList.remove('booting');
        if (b) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 580); }
      } else {
        document.body.classList.add('ready');
        // 2.8.0: завантаження завершено -> у титульній панелі з'являються вкладки й акаунт
        document.body.classList.remove('booting');
        // 3.3.1: страховка — з живою сесією гейту бути не повинно ні на одному кадрі
        try { gateHide(); } catch (eGH) {}
        if (b) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 580); }
        try { wnSchedule(900); } catch (eWN2) {}   // 3.5.1: «Що нового» після входу в акаунт
      }
    }
    return;
  }
  bootRaf(bootLoop);
}
function init() {
  // 2.3.9: системні підказки (title) у WebView2 малюються криво (біля верхнього краю вікна)
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
  // 2.7.5: якщо користувача немає — режим гейта ВмиКАЄМО ЩЕ ДО зникнення сплеша:
  // титулбар одразу показує лише кнопки «Згорнути»/«Закрити» (вкладок немає),
  // тож власник більше НІКОЛИ не побачить «панельку, що блимає і зникає» —
  // кнопки накладені на екран входу з першого кадру. Якщо користувач є —
  // клас лишається тільки на час сплеша і зникає разом із показом інтерфейсу.
  try { if (!ACC.user) document.body.classList.add('gate-on'); else setTimeout(function () { document.body.classList.remove('gate-on'); }, 50); } catch (e) {}
  // лого в титульній панелі ТЕПЕР СТАТИЧНИЙ <img> у HTML — малюється разом
  // із першим кадром (раніше його вставляв JS -> «іконки вгорі немає»)
  const dwl = byId('dwLogo'); if (dwl) dwl.innerHTML = logoMark(36);
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
  const uln5 = byId('updLater'); if (uln5) uln5.onclick = function () { try { toast('Оновлення відкладено — можна встановити пізніше в Налаштуваннях'); } catch (e5) {} updLater(); };
  /* 3.5.5: помилка завантаження -> «Повторити знову» і «Завантажити оновлення
     вручну» (перекидає в браузер на fluxhelper.pages.dev — exe качається сам) */
  const urt5 = byId('updRetry'); if (urt5) urt5.onclick = function () { updErrButtons(false); UPD.busy = false; startUpdate(); };
  const umn5 = byId('updMan'); if (umn5) umn5.onclick = function () { try { toast('Відкриваю сайт — файл завантажиться сам'); } catch (e5) {} try { host('fh:join|' + updManUrl()); } catch (e6) { window.open(updManUrl(), '_blank'); } };

  const ba2 = byId('bAcc2'); if (ba2) ba2.onclick = function () { showAcc(); };
  byId('bMin').onclick = function () { host('fh:min'); };
  byId('bClose').onclick = function () { host('fh:close'); };
  // 3.3.1: плаваючі кнопки вікна на екрані входу (титульної панелі там більше нема)
  // 3.3.2: agMin/agClose знесено — кнопки вікна під час входу живуть у
  // титульній панелі (bMin/bClose вище), гейт більше не малює своїх кнопок
  const ab2 = byId('tbAcc'); if (ab2) ab2.onclick = function () { showAcc(); };   // 2.8.0: пілюля акаунта в панелі
  const ago = byId('agGo'); if (ago) ago.onclick = function () { authStart(); };
  /* 3.5.20: accBack прибрано разом з кнопкою «Назад» */
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
      // налаштування (без очікування 8-секундного годинника); після цього
      // наш знімок летить на сервер — обидві сторони сині за секунду
      /* 3.4.4: під час перевірки — видиме завантаження (як на вході) */
      showDataLoad('Синхронізація…', 'отримуємо налаштування з бази');
      dlSafety();
      syncPull(true, function () { hideDataLoad(); });
      syncWatchStart();
      setTimeout(function () { if (ACC.user) syncUp(true); }, 1500);
    } else { syncWatchStop(); deviceWrite(); }   // вимкнено — годинник стоїть, але знімок на сервері оновлюється
    toast(ACC.sync ? 'Синхронізацію увімкнено' : 'Синхронізацію вимкнено (копія на сервері лишається)');
  };
  // 2.8.6: кнопка «Завантажити з хмари» видалена — налаштування підтягуються
  // автоматично: syncPull(true) на вході + syncWatch у реальному часі
  const aou = byId('acOut'); if (aou) aou.onclick = function () { authLogout(); };
  /* 3.4.8: «Скинути налаштування акаунта» — підтвердження прямо на кнопці:
     перший тап озброює (4 с), другий — виконує. Працює однаково на ПК і телефоні. */
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
  // 3.3.1: кнопки «Розробника» (devRef/devNotif) знесено разом із вкладкою
  // кінець 2.7.2 хуків
  // 2.7.6: акаунт із settings.json (хост підставляє після повернення зі сторінки
  // Google) — localStorage читається далі, вхід продовжується без перелогіну
  try {
    const A0 = (function(){try{return JSON.parse(localStorage.getItem('fh_user')||'null')}catch(e){return null}})();
    if (A0 && A0.sub && !ACC.user) {
      const p0 = { sub: String(A0.sub), name: String(A0.name || 'Користувач'), email: String(A0.email || ''), pic: String(A0.pic || '') };
      if (A0.fid) p0.fid = String(A0.fid);   // 2.8.8: fid теж відновлюємо (без healFid-запиту)
      authAccept(p0, true);   // 3.4.9: профіль від хоста — сесія вже в Credential Manager
    }
  } catch (e) {}
  if (!ANDROID) { try { localStorage.removeItem('fh_user'); } catch (ePc) {} }   // 3.4.0: сліди старих версій
  accBoot();
  // 2.7.6: помилка останнього входу — ПІСЛЯ accBoot (gateStart стирає agStat)
  try { const AERR = ""; if (AERR) agFail(String(AERR)); } catch (e) {}
  // вкладки в центрі титульної панелі
  const sg1 = byId('segSched'); if (sg1) sg1.onclick = function () { showMain(); };
  const sg2 = byId('segSetup'); if (sg2) sg2.onclick = function () { showSetup(); };
  const sgA = byId('segAdmin'); if (sgA) sgA.onclick = function () { admShow(); };   // 3.3.0
  // режим запуску Zoom (тільки ПК)
  const zA = byId('zApp'); if (zA) zA.onclick = function () { ZOOM.mode = 'app'; saveZoom(); refreshZoomUI(); toast('Zoom відкриватиметься через додаток'); };
  const zW = byId('zWeb'); if (zW) zW.onclick = function () { ZOOM.mode = 'web'; saveZoom(); refreshZoomUI(); toast('Zoom відкриватиметься через браузер'); };
  refreshZoomUI();
  // підтвердження заходу на урок
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
      toast(cplT.checked ? 'Посилання копіюється ПКМ по уроку' : 'Копіювання посилання вимкнено');
    };
  }
  /* 3.5.21: рамка «Автоматичний вхід у Zoom (тест)» — ЛИШЕ Windows-застосунок
     (на сайті секцію ховає webhost.js, а міст fh:zautojoin існує лише в exe).
     Перемикач живе в localStorage, виконання — нативне (PowerShell + UIA). */
  const zaT = byId('zautoOn');
  if (zaT) {
    try { zaT.checked = zautoOn(); } catch (eZA) { zaT.checked = false; }
    zaT.onchange = function () {
      try { localStorage.setItem('fh_zauto', zaT.checked ? '1' : '0'); } catch (eZA2) {}
      toast(zaT.checked ? 'Автоматичний вхід у Zoom увімкнено (тест)' : 'Автоматичний вхід у Zoom вимкнено');
    };
  }
  const zaB = byId('zautoTest');
  if (zaB) zaB.onclick = function () { zautoFire(ZAUTO_TEST_URL, 'ТЕСТ — автоматичний вхід у Zoom'); };
  const cY = byId('cYes'); if (cY) cY.onclick = confirmYes;
  const cN = byId('cNo'); if (cN) cN.onclick = closeConfirm;
  const cB = byId('cback'); if (cB) cB.onclick = closeConfirm;
  byId('tbar').addEventListener('mousedown', function (e) {
    // перетягування вікна за вільну зону панелі (кнопки й перемикач не чіпаємо)
    if (e.button === 0 && !(e.target && e.target.closest && e.target.closest('button'))) host('fh:drag');
  });
  // 2.8.1: ПЕРЕТЯГУВАННЯ ЗВІДСІЛЬ — за фон будь-якого екрана (розклад,
  // налаштування, акаунт, екран входу). Клікабельні елементи (кнопки, картки
  // уроків, поля, списки) перетягування НЕ перехоплюють — вони працюють як було.
  document.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    const t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('#tbar')) return;   // вже оброблено вище
    // усе, з чим користувач взаємодіє, — не тягнемо
    if (t.closest('button,a,input,textarea,select,label,img,svg,canvas,.card,.lcard,.ag-card,.us-card,.modal,.drawer,.pill,.chip,.tab,.tb-seg,.tb-acc,.daytabs,.g-card,.s-card,.m-item,.n-row,.theme-tile,.range,.sw,[data-nodrag]')) return;
    // тягнемо лише за «порожній» фон: контейнер екрана, секцію, body
    if (t.id === 'app' || t.id === 'agate' || t.id === 'vMain' || t.id === 'vSetup' ||
        t.id === 'vAcc' || t.id === 'vAdmin' || t.tagName === 'BODY' || t.tagName === 'HTML' ||
        (t.classList && (t.classList.contains('view') || t.classList.contains('view-sec') ||
                         t.classList.contains('wrap') || t.classList.contains('acc-wrap') ||
                         t.classList.contains('sec')))) {
      host('fh:drag');
    }
  });
  const bgEl = byId('bGroups'); if (bgEl) bgEl.onclick = openGroups;   // на ПК кнопки немає (є перемикачі 1|2 біля предметів)
  byId('gSave').onclick = saveSettings;
  byId('gCancel').onclick = closeGroups;
  byId('gback').onclick = closeGroups;
  byId('nOn').onchange = function () {
    NOTIF.on = byId('nOn').checked; saveNotif(); refreshNotifUI(); pushNotifSched(); syncUp();
    toast(NOTIF.on ? 'Сповіщення про уроки увімкнено \u2713' : 'Сповіщення про уроки вимкнено');   // 3.4.10
  };
  // 2.8.0: звук сповіщень + тестове сповіщення (ПК і телефон)
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
    /* 2.9.1: ЖОРСТКА ПЕРЕВІРКА ЖЕСТІВ на слайдері «повідомити за».
       Скрол (вертикальний рух, що почався на слайдері) більше НЕ змінює
       хвилини — значення відкочується, зміни не зберігаються. Реальна
       зміна = горизонтальний рух/тап, що почався на слайдері. */
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
    nMinSl.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
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
  // 2.3.9: 5-тапний режим прибрано — рамки «Про програму» більше немає.
  // Вкладка «Розробник» відкривається лише за роллю (DEV-прапорець або admin).
  // 2.3.7: перемикач синхронізації
  devicePing();   // 2.9.0: запис пристрою в базу при кожному запуску
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

  // 2.3.10: рамка «Про програму» (іконка + версія) і кнопка «Перевірити оновлення»
  const abL = byId('abLogo'); if (abL) abL.innerHTML = logoMark(40);
  const abV = byId('abVer'); if (abV) abV.textContent = 'версія ' + verLabel();
  const bun = byId('bUpdNow'); if (bun) bun.onclick = function () { needOnline(manualUpdCheck); };
  // тема + акаунт (2.1.0)
  const tr = byId('themeRows');
  if (tr) {
    const tiles = tr.querySelectorAll('.theme-tile');
    for (let i = 0; i < tiles.length; ++i) {
      tiles[i].onclick = function () { needOnline(function () { applyTheme(tiles[i].getAttribute('data-t') || 'standard', true); }); };
    }
  }
  applyTheme(THEME, false);
  // 2.2.0: дистанційна конфігурація (OAuth Client ID / CF Account ID) + D1
  loadRemoteCfg();
  // 2.7.2: d1Init() не потрібен — таблиці D1 створюються міграцією на сервері

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
  } else if (S) { showMain(); render(); }
  else { showMain(true); render(false); }   // 3.4.6: майстер НЕ відкриваємо до входу — рішення після бази
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

  // живі дані + ОБОВ'ЯЗКОВА мережева перевірка (без інтернету — інтерфейсу немає)
  // 3.5.10: pubEarly — базовий розклад летить ще ДО появи екрана (сплеш)
  pubEarly();
  doFetch(false);
  startLive();
  pollSchedule();
  pollSubjects();
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { clearTimeout(poolSchedT); poolSchedT = setTimeout(pollSchedule, 300); }
  });
  pushNotifSched();
  netProbe(false);
  netWatchStart();   // 3.4.10: фоновий нагляд за інтернетом

  // авто-стеження за версією: SSE + тихий опитування /update кожні 25 с
  // + перевірка одразу після повернення у вікно — «Доступне оновлення»
  // з'являється САМО, щойно версія на сервері зміниться
  setInterval(watchUpdate, 25000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { liveTick(true); watchUpdate(); doFetch(false); }
  });

  // на телефоні одразу просимо дозвіл на сповіщення
  if (ANDROID && !notifPermOk()) {
    setTimeout(function () { try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (e) {} }, 1200);
  }

  liveTickStart();
  // ФІКС «лого із затримкою»: сплеш показуємо лише тоді, коли іконка вже
  // декодована — іконка/назва/смуга з'являються ОДНОЧАСНО (під HTML-сплешем
  // усе цей час малюється такий самий GDI-сплеш із іконкою)
  (function bootRevealLogo() {
    const b = byId('boot');
    if (!b) return;
    // 2.8.8: кнопки вікна на сплеші — працюють з першого кадру (як у програмі)
    const bMin = byId('btMin'), bClose = byId('btClose'), bTb = byId('btTb');
    if (bMin) bMin.onclick = function () { host('fh:min'); };
    if (bClose) bClose.onclick = function () { host('fh:close'); };
    if (bTb) bTb.addEventListener('mousedown', function (e) {
      // перетягування вікна за міні-титулбар сплеша (кнопки не чіпаємо)
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
    setTimeout(go, 700);   // страховка — без лого не лишаємось ніколи
  })();

  // плавне завершення екрана завантаження: netProbe вирішує — оновлення чи головний екран
  bootLoop();
}

// хук для тестів/прев'ю (не впливає на звичайну роботу)
window.__fh = {
  // 2.7.6: команди нативної титульної панелі (Win32)
  seg: function (v) { if (!ACC.user) return; if (v === 'setup') showSetup(); else showMain(); },
  // 2.7.6: результат входу від AndroidHost (JSON профілю) / помилка
  authResult: function (j) {
    try {
      const u = (typeof j === 'string') ? JSON.parse(j) : j;
      if (u && u.sub) {
        const p = { sub: String(u.sub), name: String(u.name || 'Користувач'), email: String(u.email || ''), pic: String(u.pic || '') };
        if (u.fid) p.fid = String(u.fid);   // 2.8.7: fid більше не втрачається
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
  notifFired: function (name, t, delta) { LAST_NOTIF = { name: name, t: t, delta: delta }; },
  notifAction: function (act, url2) {
    // кнопка «Зайти» в тості Windows -> відкриваємо той урок
    if (updOpen()) return;
    /* 3.4.6: НЕ показуємо головне вікно (хост не викликає ShowWindow для
       join/snooze) і НЕ відкриваємо діалог підтвердження — клік по кнопці
       сповіщення = свідома дія «зайти на урок»: Zoom-додаток або браузер
       відкриваються ОДРАЗУ, без зайвих вікон. */
    resolveLessons();
    const d = new Date();
    let dow = d.getDay(); if (dow === 0) dow = 7;
    const day = RES[dow - 1] || [];
    /* тестовий тост несе власний URL (?u=) — відкриваємо його,
       поки тест «свіжий» (10 хв), щоб кнопка не влучила в чужий урок */
    const tt = window.__fhTest;
    if (url2 && tt && tt.url === String(url2) && (Date.now() - tt.ts) < 600000) {
      setTimeout(function () { openL(String(url2)); }, 150);
      return;
    }
    let target = null;
    if (LAST_NOTIF && LAST_NOTIF.name) {
      for (let i = 0; i < day.length; i++) if (day[i].name === LAST_NOTIF.name) { target = day[i]; break; }
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
    /* 3.4.6: посилання приходить прямо в аргументі кнопки тоста (зашифроване
       в ?u=) — навіть якщо пошук уроку не влучив, join спрацює */
    if (target && target.url) { setTimeout(function () { openL(target.url); }, 150); }
    else if (target) { setTimeout(function () { joinLesson(target); }, 150); }
    else if (url2)   { setTimeout(function () { openL(String(url2)); }, 150); }
  },
  authOk: function (u) { if (u && u.sub) authAccept(u, true); },   // 3.4.9: канал хоста — сесію він уже зберіг
  authErr: function (m) { agState = ''; agFail(m || 'Не вдалося підтвердити вхід'); },
  // 2.8.1: хост повідомив state локального слухача входу -> запускаємо
  // резервне опитування Firebase (основний канал — loopback у хості)
  authWait: function (st, port) {
    if (!st || ACC.user) return;
    agState = String(st);
    authPollDb(String(st));
  },
  cfqCb: function (id, status, json) {
    cfLast = status || 0;   // 2.7.3: діагностика «немає зв'язку»
    const cb2 = cfCbs[id]; delete cfCbs[id];
    if (!cb2) return;
    let rows = null;
    try {
      const r = (typeof json === 'string') ? JSON.parse(json) : json;
      if (r && r.success && r.result && r.result[0] && r.result[0].results) rows = r.result[0].results;
    } catch (e) {}
    cb2(rows);
  },
  cloudCb: function (id, status, json) { __fhFbResult(id, status >= 200 && status < 300); },   // 3.4.0 ФІКС: callback-и dbPut/dbDel на ПК губилися -> тижні/кopts оновлювались лише після перезаходу
  verCmp: verCmp,
  back: function () {
    if (updOpen()) return true;              // оновлення обов'язкове — назад шляху немає
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
window.__fh.zoomStarting = zoomStarting;   // хост: запуск zoommtg:// відбувся
window.__fh.zoomWait = zoomWait;           // хост: повторний клік під час запуску
window.__fh.zoomFallback = zoomFallback;   // хост: Zoom не знайдено -> браузер
window.__fh.joinLesson = joinLesson;       // тести: клік по уроку
window.__fh.confirmState = function () { return CONFIRM; };

try { init(); } catch (err) {
  bootReady = true;
  try { bootLoop(); } catch (e2) { hideBoot(); }
  document.body.innerHTML = '<p style="padding:30px;color:#fff">Помилка інтерфейсу: ' + err.message + '</p>';
}
