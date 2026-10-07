// ============================================================
//  FluxHelper — ІНТЕРФЕЙС ДЛЯ ПК (цей файл вбудовується в exe)
//  Тільки десктопна розкладка: титульна панель із кнопками вікна
//  (згорнути/закрити, перетягування), zoom-масштабування під розмір
//  вікна, клавіші 1..5 для днів. Мобільних елементів НЕМАЄ.
//  Дані беруться з Firebase Realtime DB (teachers / subjects / schedule),
//  вбудований BUILTIN — офлайн-fallback. Розклад містить тільки назву
//  предмета -> застосунок сам підставляє вчителя групи й посилання.
//  __LOGO_B64__        -> base64 логотипа (підставляє main.cpp)
//  __SETTINGS_JSON__   -> {"ang":1,...} або null (підставляє main.cpp)
//  __APP_VER__         -> версія з version.h (підставляє main.cpp)
// ============================================================
static const char kUiHtmlDesktop[] = R"HTML(<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>FluxHelper</title>
<style>

*{margin:0;padding:0;box-sizing:border-box}
::selection{background:rgba(99,102,241,.35);color:#e0e7ff}
/* гарний скролбар скрізь (тонкий, округлий, у тоні градієнта) */
::-webkit-scrollbar{width:9px;height:9px}
::-webkit-scrollbar-thumb{background:rgba(139,92,246,.35);border-radius:99px}
::-webkit-scrollbar-thumb:hover{background:rgba(139,92,246,.6)}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-corner{background:transparent}
html,body{height:100%;overflow:hidden}
#app{flex:1;min-height:0;display:flex;flex-direction:column}
body{
  font-family:'Segoe UI Variable','Segoe UI',system-ui,-apple-system,sans-serif;
  color:#f4f4f8;-webkit-font-smoothing:antialiased;
  background:
    radial-gradient(540px 360px at 14% -10%, rgba(124,58,237,.17), transparent 68%),
    radial-gradient(580px 400px at 88% 114%, rgba(79,70,229,.14), transparent 66%),
    #050508;
  display:flex;flex-direction:column;
}
button{font-family:inherit}
.hidden{display:none!important}

/* ---------- титульна панель ---------- */
#tbar{height:48px;flex:none;display:flex;align-items:center;justify-content:space-between;
  padding-left:14px;user-select:none;-webkit-user-select:none;
  app-region:drag;-webkit-app-region:drag;
  border-bottom:1px solid rgba(255,255,255,.06);background:rgba(9,9,16,.6);position:relative;z-index:5}
.tb-l{display:flex;align-items:center;gap:10px}
.lmark{display:grid;place-items:center;pointer-events:none}
.lmark svg{display:block}
#tbar .lmark{box-shadow:0 4px 14px rgba(99,102,241,.45);border-radius:9px}
.tb-name{font-size:14.5px;font-weight:700;letter-spacing:.3px;color:#fff}
.tb-ver{font-size:9.5px;font-weight:800;letter-spacing:1.2px;color:#a5b4fc;text-transform:uppercase;opacity:.85}
.tb-r{display:flex;height:100%}
.tb-btn{width:48px;height:100%;display:grid;place-items:center;background:transparent;border:0;cursor:pointer;
  color:#c8cad8;transition:background .15s ease,color .15s ease,transform .1s ease;
  app-region:no-drag;-webkit-app-region:no-drag}
.tb-btn:hover{background:rgba(255,255,255,.07);color:#fff}
.tb-btn:active{transform:scale(.93)}
.tb-btn.tb-x:hover{background:#f43f5e;color:#fff}
/* на ПК титульна панель — ЗАВЖДИ найвища: згорнути/закрити/лого/назва видно
   навіть поверх екранів оновлення і «немає з'єднання» (модалка нижче панелі) */
body.upd-lock #tbar,body.net-lock #tbar{z-index:130;background:rgba(10,10,18,.88)}
body.upd-lock #bCfg{display:none!important}
body.upd-lock .tb-ver,body.net-lock .tb-ver{visibility:hidden}
body.upd-lock #upd{top:48px}
body.net-lock #neterr{top:48px}

/* ---------- головний екран ---------- */
.view{flex:1;min-height:0;display:flex;flex-direction:column;padding:16px 20px 14px;position:relative;z-index:1}
.view:not(.hidden){animation:viewIn .32s ease both}
@keyframes viewIn{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:11px;gap:10px}
h2{font-size:21px;font-weight:800;letter-spacing:.3px}
.chip{font-size:11.5px;color:#c7cbe0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  padding:6px 12px;border-radius:999px;white-space:nowrap}

nav{display:flex;gap:8px;margin-bottom:11px}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;padding:7px 4px;border-radius:12px;
  cursor:pointer;user-select:none;-webkit-user-select:none;position:relative;
  background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);transition:all .18s ease}
.tab .d{font-size:13px;font-weight:700}
.tab .dt{font-size:10px;color:#8b8fa3}
.tab:hover{transform:translateY(-1px);border-color:rgba(139,92,246,.35);background:rgba(255,255,255,.05)}
.tab:active{transform:scale(.97)}
.tab.on{background:linear-gradient(135deg,#8b5cf6,#6366f1,#8b5cf6);background-size:220% 100%;border-color:transparent;
  box-shadow:0 8px 22px rgba(99,102,241,.30);animation:tabg 3.4s ease infinite}
@keyframes tabg{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.tab.on .dt{color:rgba(255,255,255,.85)}
.tab .tdot{position:absolute;top:6px;right:8px;width:6px;height:6px;border-radius:50%;background:#818cf8;box-shadow:0 0 8px #818cf8;display:none}
.tab.td .tdot{display:block}

main{flex:1;min-height:0;overflow-y:auto;padding-right:2px}
main::-webkit-scrollbar{width:8px}
main::-webkit-scrollbar-thumb{background:rgba(124,58,237,.35);border-radius:8px}
main::-webkit-scrollbar-thumb:hover{background:rgba(124,58,237,.55)}
main::-webkit-scrollbar-track{background:transparent}
.empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:60px 0;color:#8b8fa3;font-size:13px}
.empty svg{opacity:.5}

.card{position:relative;display:grid;grid-template-columns:46px minmax(0,1fr) auto;gap:13px;align-items:center;
  padding:13px 15px;border-radius:18px;margin-bottom:10px;cursor:pointer;overflow:hidden;
  background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.075);
  transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease;animation:pop .3s ease both}
.card:hover{transform:translateY(-2px);border-color:rgba(139,92,246,.28);box-shadow:0 10px 34px -18px rgba(99,102,241,.5)}
.card:hover .ic{transform:scale(1.07) rotate(-2deg)}
@keyframes pop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
main.still .card{animation:none!important}
.ic{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;color:#fff;flex:none;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.14),0 4px 12px rgba(0,0,0,.3);transition:transform .25s ease}
.ic svg{display:block}
.mid{min-width:0}
.card h3{font-size:15px;font-weight:700;line-height:1.25;color:#f4f4f8}
.meta{display:flex;align-items:center;gap:11px;margin-top:5px;flex-wrap:wrap}
.tc{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:#9aa0b4;font-weight:600;white-space:nowrap}
.tc svg{opacity:.75;flex:none}
.card,.card *{user-select:none;-webkit-user-select:none;cursor:pointer}

.b-join{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;color:#fff;
  border:0;border-radius:13px;padding:10px 16px;cursor:pointer;white-space:nowrap;
  background:linear-gradient(135deg,#8b5cf6,#6366f1);box-shadow:0 8px 22px rgba(99,102,241,.28);transition:all .16s ease}
.b-join:hover{transform:translateY(-1px);filter:brightness(1.14);box-shadow:0 10px 26px rgba(99,102,241,.45)}
.b-join:active{transform:scale(.97)}
/* блиск, що пробігає головними кнопками при наведенні */
.b-join,.b-save,.b-groups,.us-btn,.bn-btn{position:relative;overflow:hidden}
.b-join::after,.b-save::after,.b-groups::after,.us-btn::after,.bn-btn::after{content:'';position:absolute;top:0;left:-90%;
  width:55%;height:100%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.30),transparent);
  transform:skewX(-18deg);pointer-events:none}
.b-join:hover::after,.b-save:hover::after,.b-groups:hover::after,.us-btn:hover::after,.bn-btn:hover::after{animation:shine .75s ease}
@keyframes shine{from{left:-90%}to{left:140%}}

/* поточний (зелений) / наступний (жовтий) урок */
.now-chip{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:800;letter-spacing:1px;
  color:#34d399;margin-left:8px;vertical-align:1px}
.now-chip i,.next-chip i{width:6px;height:6px;border-radius:50%;animation:pulse 1.4s infinite}
.now-chip i{background:#34d399}
.next-chip{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:800;letter-spacing:1px;
  color:#fbbf24;margin-left:8px;vertical-align:1px}
.next-chip i{background:#fbbf24}
@keyframes pulse{0%,100%{opacity:1;transform:scale(.85)}50%{opacity:.45;transform:scale(1.12)}}
.card.now{border-color:rgba(52,211,153,.5);box-shadow:0 0 0 1px rgba(52,211,153,.2),0 14px 36px rgba(52,211,153,.09)}
.card.next{border-color:rgba(251,191,36,.5);box-shadow:0 0 0 1px rgba(251,191,36,.18),0 14px 36px rgba(251,191,36,.08)}
.prog{position:absolute;left:0;right:0;bottom:0;height:3px;border-radius:3px 3px 0 0;
  background:linear-gradient(90deg,#34d399,#10b981);box-shadow:0 0 14px rgba(52,211,153,.55)}
.today-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#34d399;margin-left:4px;vertical-align:1px;
  box-shadow:0 0 8px rgba(52,211,153,.9);animation:pulse 1.4s infinite}

/* ---------- ЕКРАН НАЛАШТУВАНЬ (ПК) ----------
   Окремий «десктопний» стиль: широкі картки у сітці, сегмент-кнопки
   груп (перемикання на місці, без вікон), рядки як у Windows 11.
   Це НЕ той самий дизайн, що на телефоні (там — великий список і
   шторка знизу). */
#vSetup{display:block;overflow-y:auto;padding:18px 24px 24px}
#vSetup::-webkit-scrollbar{width:8px}
#vSetup::-webkit-scrollbar-thumb{background:rgba(124,58,237,.35);border-radius:8px}
#vSetup::-webkit-scrollbar-track{background:transparent}
.sw-wrap{width:100%;max-width:780px;margin:0 auto}
.sw-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:16px}
.sw-title-row{display:flex;align-items:center;gap:10px}
.sw-title-row h2{font-size:24px}
.sw-verpill{font-size:10px;font-weight:800;letter-spacing:.8px;color:#c4b5fd;background:rgba(139,92,246,.14);
  border:1px solid rgba(139,92,246,.35);border-radius:999px;padding:3px 10px;text-transform:uppercase}
.sw-sub{display:block;font-size:12px;color:#8b8fa3;margin-top:3px}
.sw-head .su-back{margin-top:4px}
.sw-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}
.sw-card{position:relative;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.085);
  border-radius:18px;padding:15px 17px 14px;overflow:hidden;animation:secIn .4s ease both;
  transition:border-color .2s ease,box-shadow .2s ease}
.sw-card:hover{border-color:rgba(139,92,246,.30);box-shadow:0 18px 44px rgba(0,0,0,.35),0 0 34px rgba(99,102,241,.06)}
.sw-card.sw-wide{grid-column:1 / -1}
.sw-grid > .sw-card:nth-child(2){animation-delay:.05s}
.sw-grid > .sw-card:nth-child(3){animation-delay:.1s}
.sw-card::before{content:'';position:absolute;top:0;left:8%;right:8%;height:1px;
  background:linear-gradient(90deg,transparent,rgba(139,92,246,.5),rgba(99,102,241,.5),transparent)}
@keyframes secIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.sw-c-head{display:flex;align-items:center;gap:11px;margin-bottom:12px}
.sw-c-ic{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;color:#fff;flex:none;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.14),0 4px 12px rgba(0,0,0,.3)}
.sw-c-ic.grad{background:linear-gradient(135deg,#8b5cf6,#6366f1)}
.sw-c-ic.plain{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#a5b4fc}
.sw-c-tt{flex:1;min-width:0}
.sw-c-tt b{display:block;font-size:14.5px;font-weight:800;color:#f4f4f8;letter-spacing:.2px}
.sw-c-tt span{display:block;font-size:11px;color:#8b8fa3;margin-top:1px;line-height:1.4}
/* сегмент-перемикач групи (1 | 2) — миттєве застосування */
.seg{display:inline-flex;flex:none;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
  border-radius:11px;padding:3px;gap:3px}
.seg button{border:0;background:transparent;color:#9aa0b4;font-family:inherit;font-size:11.5px;font-weight:800;
  padding:6px 14px;border-radius:8px;cursor:pointer;transition:all .15s ease;white-space:nowrap}
.seg button:hover{color:#e0e2f0;background:rgba(255,255,255,.06)}
.seg button.on{background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;
  box-shadow:0 4px 14px rgba(99,102,241,.4)}
.sw-row{display:flex;align-items:center;gap:12px;padding:9px 10px;border-radius:13px;margin-bottom:7px;
  background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.055);transition:all .16s ease}
.sw-row:last-child{margin-bottom:0}
.sw-row:hover{border-color:rgba(139,92,246,.3);background:rgba(255,255,255,.045)}
.sw-row .su-tile{width:34px;height:34px;border-radius:10px}
.sw-gname{flex:1;min-width:0}
.sw-gname b{display:block;font-size:12.5px;font-weight:700;color:#f0f1f7}
.sw-gname span{display:block;font-size:10.5px;color:#8b8fa3;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sum-tch{font-size:11px;color:#9aa0b4;line-height:1.4;margin-top:3px}
.sum-hint{font-size:11.5px;color:#8b8fa3;line-height:1.55;padding:2px 2px 4px}
.b-groups{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:12px;
  font-size:12.5px;font-weight:800;color:#fff;border:0;border-radius:13px;padding:11px;cursor:pointer;
  background:linear-gradient(135deg,#8b5cf6,#6366f1);box-shadow:0 8px 22px rgba(99,102,241,.32);transition:all .18s ease}
.b-groups:hover{filter:brightness(1.14);transform:translateY(-1px)}
.b-groups:active{transform:scale(.98)}
.setup{width:100%;max-width:600px;background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.09);
  border-radius:22px;padding:16px 18px 15px;box-shadow:0 24px 60px rgba(0,0,0,.45),0 0 44px rgba(99,102,241,.07);
  animation:pop .35s ease both;margin:auto;position:relative;overflow:hidden}
.setup::before{content:'';position:absolute;top:0;left:10%;right:10%;height:1px;
  background:linear-gradient(90deg,transparent,rgba(139,92,246,.8),rgba(99,102,241,.8),transparent)}
.su-head{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.su-gear{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,#8b5cf6,#6366f1);
  display:grid;place-items:center;color:#fff;flex:none;box-shadow:0 8px 24px rgba(99,102,241,.35)}
.su-head h2{font-size:18px}
.su-head .su-sub{font-size:11px;color:#8b8fa3;display:block;margin-top:1px}
.su-back{display:inline-flex;align-items:center;gap:7px;padding:9px 15px 9px 12px;border-radius:12px;flex:none;
  border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#e0e2f0;font-size:12.5px;font-weight:800;
  cursor:pointer;transition:all .18s ease}
.su-back:hover{background:linear-gradient(135deg,rgba(139,92,246,.38),rgba(99,102,241,.26));border-color:rgba(129,140,248,.55);
  color:#fff;transform:translateX(-2px);box-shadow:0 6px 18px rgba(99,102,241,.25)}
.su-back:active{transform:scale(.96)}
.su-back svg{flex:none}
/* рядки-налаштування (перемикачі) */
.su-item{display:flex;gap:12px;align-items:center;padding:10px 11px;margin-bottom:8px;border-radius:15px;
  background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06);transition:all .18s ease}
.su-item:last-child{margin-bottom:0}
.su-item:hover{border-color:rgba(139,92,246,.35);background:rgba(255,255,255,.055);transform:translateX(3px)}
.su-tile{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:#fff;flex:none;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.14),0 4px 12px rgba(0,0,0,.3);transition:transform .22s ease}
.su-item:hover .su-tile{transform:scale(1.08) rotate(-3deg)}
.su-tile svg{display:block}
.su-body{flex:1;min-width:0}
.su-name{font-weight:700;font-size:12.5px;margin-bottom:6px}
.su-opts{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.su-opt{position:relative;text-align:left;cursor:pointer;border-radius:13px;padding:8px 30px 8px 30px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);color:#c7cbe0;transition:all .16s ease}
.su-opt b{display:block;font-size:11.5px;color:#fff;font-weight:700}
.su-opt span{font-size:10px;color:#8b8fa3;line-height:1.35;display:block;margin-top:2px}
.su-opt:hover{border-color:rgba(139,92,246,.45);background:rgba(255,255,255,.055);transform:translateY(-1px)}
.su-opt.on{background:linear-gradient(135deg,rgba(139,92,246,.32),rgba(99,102,241,.22));border-color:#818cf8;
  box-shadow:0 8px 22px rgba(99,102,241,.28)}
.su-opt.on span{color:#dfe3ff}
.su-opt::before{content:'';position:absolute;left:11px;top:14px;width:9px;height:9px;border-radius:50%;
  border:2px solid rgba(255,255,255,.3);transition:all .15s ease}
.su-opt.on::before{border-color:#c7d2fe;background:#818cf8;box-shadow:0 0 10px rgba(129,140,248,.9)}
.su-opt .ck{position:absolute;right:9px;top:10px;color:#c7d2fe;opacity:0;transform:scale(.5);transition:all .18s ease}
.su-opt.on .ck{opacity:1;transform:scale(1)}
.s-prog{font-size:10px;font-weight:800;letter-spacing:.6px;color:#a5b4fc;background:rgba(99,102,241,.12);
  border:1px solid rgba(99,102,241,.28);padding:3px 11px;border-radius:999px}
.sw-tog-row{display:flex;align-items:center;gap:12px;padding:2px 0}
.su-ic2{width:36px;height:36px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
  display:grid;place-items:center;color:#a5b4fc;flex:none}
.su-body b{display:block;font-size:12.5px;font-weight:700;color:#f0f1f7}
.su-body > span{font-size:10.5px;color:#8b8fa3;display:block;margin-top:2px;line-height:1.4}
.sw{position:relative;display:inline-block;width:44px;height:25px;flex:none;cursor:pointer}
.sw input{opacity:0;width:0;height:0;position:absolute}
.sw i{position:absolute;inset:0;border-radius:999px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.12);transition:all .2s ease}
.sw i::after{content:'';position:absolute;left:3px;top:2.5px;width:17px;height:17px;border-radius:50%;background:#c7cbe0;transition:all .2s ease}
.sw input:checked + i{background:linear-gradient(135deg,#8b5cf6,#6366f1);border-color:transparent;box-shadow:0 4px 14px rgba(99,102,241,.4)}
.sw input:checked + i::after{left:22px;background:#fff}
/* слайдер хвилин до уроку (1–15) */
.nslider{margin:11px 0 2px;padding:13px 15px 11px;border-radius:15px;background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.07)}
.ns-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:11px}
.ns-lbl{font-size:11px;color:#8b8fa3;font-weight:700;letter-spacing:.3px}
.ns-val{font-size:14px;font-weight:800;background:linear-gradient(90deg,#a78bfa,#818cf8);
  -webkit-background-clip:text;background-clip:text;color:transparent}
input[type=range]#nMin{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:99px;outline:none;cursor:pointer;
  background:linear-gradient(90deg,#8b5cf6,#6366f1 var(--p,28.6%),rgba(255,255,255,.12) var(--p,28.6%))}
input[type=range]#nMin::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#fff;
  border:3px solid #818cf8;box-shadow:0 0 0 4px rgba(129,140,248,.20),0 4px 14px rgba(99,102,241,.45);
  cursor:pointer;transition:transform .15s ease,box-shadow .2s ease}
input[type=range]#nMin::-webkit-slider-thumb:hover{transform:scale(1.14)}
input[type=range]#nMin::-webkit-slider-thumb:active{transform:scale(1.26);box-shadow:0 0 0 7px rgba(129,140,248,.24),0 4px 18px rgba(99,102,241,.6)}
input[type=range]#nMin::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid #818cf8;cursor:pointer}
.ns-scale{display:flex;justify-content:space-between;margin-top:8px;font-size:9.5px;color:#6b6f85;font-weight:700;letter-spacing:.4px}
.su-perm{margin:10px 0 0;padding:8px 14px;font-size:11.5px;font-weight:700;color:#fde68a;background:rgba(245,158,11,.12);
  border:1px solid rgba(245,158,11,.4);border-radius:12px;cursor:pointer;width:100%;text-align:left}
.b-mini{font-size:11px;font-weight:700;color:#c7d2fe;background:rgba(99,102,241,.14);border:1px solid rgba(99,102,241,.35);
  padding:7px 13px;border-radius:10px;cursor:pointer;transition:all .15s ease;display:inline-flex;align-items:center;gap:6px;flex:none}
.b-mini:hover{background:rgba(99,102,241,.28);color:#fff}
.b-save{width:100%;margin-top:3px;font-size:13px;font-weight:800;color:#fff;border:0;border-radius:13px;padding:11px;
  cursor:pointer;background:linear-gradient(135deg,#8b5cf6,#6366f1);box-shadow:0 8px 22px rgba(99,102,241,.32);transition:all .18s ease}
.b-save:hover:not(:disabled){filter:brightness(1.14);transform:translateY(-1px)}
.b-save:active:not(:disabled){transform:scale(.98)}
.b-save:disabled{opacity:.35;cursor:not-allowed;box-shadow:none}
/* блок «Про програму» — тут ховається пасхалка режиму розробника (5 тапів по версії) */
.sw-about{display:flex;align-items:center;gap:12px;margin-top:16px;padding:13px 15px;border-radius:18px;
  background:rgba(255,255,255,.025);border:1px dashed rgba(255,255,255,.1)}
.sw-about .lmark img{display:block;border-radius:9px}
.sw-about .ab-t{flex:1;min-width:0}
.sw-about .ab-t b{display:block;font-size:13.5px;color:#fff;letter-spacing:.3px}
.sw-about .ab-t span{display:block;font-size:10.5px;color:#8b8fa3;margin-top:2px}
.sw-ver{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#c7cbe0;font-family:inherit;
  font-size:11px;font-weight:800;padding:7px 13px;border-radius:999px;cursor:pointer;transition:all .15s ease;flex:none;
  user-select:none;-webkit-user-select:none}
.sw-ver:hover{border-color:rgba(139,92,246,.45);color:#fff}
.sw-ver:active{transform:scale(.94)}
/* секція режиму розробника */
.sw-card.dev{border-color:rgba(251,191,36,.35);background:linear-gradient(180deg,rgba(251,191,36,.06),rgba(255,255,255,.02))}
.sw-card.dev::before{background:linear-gradient(90deg,transparent,rgba(251,191,36,.6),rgba(245,158,11,.5),transparent)}
.dev-btn{display:flex;align-items:center;gap:11px;width:100%;text-align:left;font-family:inherit;font-size:12.5px;
  font-weight:800;color:#fde68a;background:rgba(251,191,36,.09);border:1px solid rgba(251,191,36,.4);
  padding:11px 14px;border-radius:13px;cursor:pointer;transition:all .16s ease;margin-bottom:8px}
.dev-btn:hover{background:rgba(251,191,36,.17);transform:translateY(-1px);box-shadow:0 8px 22px rgba(245,158,11,.15)}
.dev-btn:active{transform:scale(.98)}
.dev-btn.ghost{color:#c7cbe0;background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12)}
.dev-btn.ghost:hover{background:rgba(255,255,255,.08);box-shadow:none}
.dev-btn svg{flex:none}
.dev-btn .dsub{display:block;font-size:10.5px;font-weight:600;color:#8b8fa3;margin-top:2px}
/* діалог підтвердження режиму розробника (по центру, поверх усього) */
#devwrap{position:fixed;inset:0;z-index:82;display:flex;align-items:center;justify-content:center;padding:20px}

/* ---------- модальне вікно копіювання (по центру екрана) ---------- */
#mwrap{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:20px}
.mback{position:absolute;inset:0;background:rgba(3,3,7,.62);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);
  animation:fdin .18s ease both}
@keyframes fdin{from{opacity:0}to{opacity:1}}
.modal{position:relative;width:min(432px,100%);background:rgba(17,17,26,.97);border:1px solid rgba(255,255,255,.1);
  border-radius:22px;padding:16px;box-shadow:0 30px 90px rgba(0,0,0,.65),0 0 0 1px rgba(99,102,241,.14);
  animation:mup .24s cubic-bezier(.2,.9,.3,1.15) both}
@keyframes mup{from{opacity:0;transform:scale(.9) translateY(16px)}to{opacity:1;transform:none}}
.m-head{display:flex;align-items:center;gap:11px;margin-bottom:13px}
.m-ic{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;color:#fff;flex:none;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.15)}
.m-ic svg{display:block}
.m-head .m-tt{min-width:0}
.m-head b{display:block;font-size:15px;color:#fff;line-height:1.25}
.m-head span{font-size:11px;color:#8b8fa3;display:block;margin-top:2px}
.m-x{margin-left:auto;width:32px;height:32px;border-radius:10px;border:1px solid rgba(255,255,255,.1);
  background:rgba(255,255,255,.04);color:#c8cad8;cursor:pointer;display:grid;place-items:center;transition:all .15s ease;flex:none}
.m-x:hover{background:rgba(255,255,255,.1);color:#fff}
.m-item{display:flex;align-items:center;gap:11px;width:100%;text-align:left;border:1px solid rgba(255,255,255,.09);
  background:rgba(255,255,255,.035);color:#e8eaf2;border-radius:15px;padding:11px 14px;cursor:pointer;
  margin-bottom:8px;transition:all .15s ease}
.m-item:last-child{margin-bottom:0}
.m-item:hover{background:linear-gradient(135deg,rgba(139,92,246,.32),rgba(99,102,241,.24));
  border-color:rgba(129,140,248,.5);transform:translateY(-1px)}
.m-item svg{flex:none;opacity:.8}
.m-item .m-l{min-width:0}
.m-item .m-lbl{font-weight:800;font-size:12.5px;color:#fff;display:block}
.m-item .m-t{font-size:11px;color:#9aa0b4;display:block;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.m-item small{margin-left:auto;font-size:9.5px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;
  color:#a5b4fc;display:inline-flex;align-items:center;gap:5px;flex:none}

/* ---------- модальне вікно налаштування груп ---------- */
#gwrap{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:20px}
.gmodal{width:min(524px,100%)}
.g-rows{max-height:min(56vh,470px);overflow-y:auto;margin:0 -3px;padding:0 3px}
.g-rows::-webkit-scrollbar{width:7px}
.g-rows::-webkit-scrollbar-thumb{background:rgba(124,58,237,.4);border-radius:8px}
.g-rows::-webkit-scrollbar-track{background:transparent}
.g-foot{display:flex;align-items:center;gap:9px;margin-top:13px}
.g-foot .b-save{width:auto;flex:1;margin:0;padding:11px 16px}

/* ---------- банери на головному екрані (оновлення / сповіщення) ---------- */
.ban{display:flex;align-items:center;gap:11px;margin:0 0 11px;padding:11px 13px;border-radius:16px;
  background:linear-gradient(135deg,rgba(139,92,246,.17),rgba(99,102,241,.10));
  border:1px solid rgba(139,92,246,.42);box-shadow:0 10px 30px rgba(99,102,241,.15)}
.bn-ic{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#8b5cf6,#6366f1);
  display:grid;place-items:center;color:#fff;flex:none;box-shadow:0 6px 16px rgba(99,102,241,.35)}
.bn-t{flex:1;min-width:0}
.bn-t b{display:block;font-size:13px;color:#fff}
.bn-t span{display:block;font-size:11px;color:#c7cbe0;margin-top:2px;line-height:1.35}
.bn-btn{font-size:11.5px;font-weight:800;color:#fff;border:0;border-radius:11px;padding:9px 14px;cursor:pointer;
  background:linear-gradient(135deg,#8b5cf6,#6366f1);box-shadow:0 6px 18px rgba(99,102,241,.35);flex:none;
  white-space:nowrap;transition:all .15s ease}
.bn-btn:hover{filter:brightness(1.14);transform:translateY(-1px)}
.bn-x{width:30px;height:30px;border-radius:9px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);
  color:#c8cad8;cursor:pointer;display:grid;place-items:center;flex:none;transition:all .15s ease}
.bn-x:hover{background:rgba(255,255,255,.1);color:#fff}

/* ---------- тост ---------- */
#toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(18px);z-index:90;
  background:rgba(20,20,32,.96);border:1px solid rgba(52,211,153,.35);color:#a7f3d0;font-size:12.5px;font-weight:700;
  padding:10px 18px;border-radius:999px;box-shadow:0 12px 34px rgba(0,0,0,.5);opacity:0;pointer-events:none;
  transition:opacity .2s ease,transform .2s ease;max-width:82vw;text-align:center}
#toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

/* ---------- екран завантаження (плавні 100%) ---------- */
#boot{position:fixed;inset:0;z-index:100;background:#050508;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:15px;transition:opacity .5s ease}
#boot.off{opacity:0;pointer-events:none}
/* іконка на сплеші: статичний <img> з data-URI прямо в HTML (не через JS) —
   декодується синхронно і малюється РАЗОМ з першим кадром екрана завантаження */
.bt-mark img{display:block;filter:drop-shadow(0 12px 36px rgba(99,102,241,.5))}
.bt-name{font-size:20px;font-weight:800;color:#fff;letter-spacing:.4px}
.bt-bar{width:198px;height:5px;border-radius:99px;background:rgba(255,255,255,.09);overflow:hidden;margin-top:4px}
.bt-bar i{display:block;height:100%;width:0%;border-radius:99px;
  background:linear-gradient(90deg,#8b5cf6,#6366f1);box-shadow:0 0 12px rgba(129,140,248,.85)}
.bt-pct{font-size:10.5px;color:#8b8fa3;font-weight:800;letter-spacing:1.5px}
body.ready #app{animation:apin .55s cubic-bezier(.16,1,.3,1) both}
@keyframes apin{from{opacity:0;transform:translateY(12px) scale(.995)}to{opacity:1;transform:none}}

/* ---------- блокуючі екрани: оновлення / без інтернету ---------- */
#neterr,#upd{position:fixed;inset:0;z-index:118;background:rgba(3,3,7,.84);backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:20px}
#upd{z-index:120;padding:0}
#neterr.hidden,#upd.hidden{display:none}
.us-card{width:500px;max-width:min(94vw,560px);max-height:calc(92vh - 48px);overflow:auto;background:rgba(17,17,28,.97);
  border:1px solid rgba(139,92,246,.28);border-radius:22px;padding:26px 28px 22px;text-align:center;
  box-shadow:0 30px 80px rgba(0,0,0,.6);animation:usin .45s cubic-bezier(.16,1,.3,1) both}
@keyframes usin{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
.us-logo img{width:74px;height:74px;border-radius:17px;display:block;margin:0 auto 10px;
  filter:drop-shadow(0 10px 26px rgba(99,102,241,.45))}
#neterr h2,#upd h2{font-size:21px;color:#fff;margin:2px 0 5px;letter-spacing:.2px}
#upd h2 b{background:linear-gradient(90deg,#a78bfa,#818cf8);-webkit-background-clip:text;background-clip:text;color:transparent}
.us-chip{display:inline-block;font-size:10px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;
  color:#c4b5fd;background:rgba(139,92,246,.16);border:1px solid rgba(139,92,246,.35);border-radius:99px;
  padding:4px 12px;margin-bottom:8px}
.us-sub{font-size:12.5px;color:#8b8fa3;margin:0 0 14px;line-height:1.5}
.us-notes{text-align:left;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
  border-radius:14px;padding:12px 15px;margin:0 0 14px;max-height:46vh;overflow:auto}
.us-notes::-webkit-scrollbar{width:8px}
.us-notes::-webkit-scrollbar-thumb{background:rgba(139,92,246,.35);border-radius:99px}
.un{display:flex;gap:9px;font-size:12.5px;color:#c9cbe0;line-height:1.5;padding:3px 0;align-items:flex-start}
.un b{flex:none;width:15px;height:15px;border-radius:5px;font-size:11px;font-weight:800;display:flex;
  align-items:center;justify-content:center;margin-top:2px}
.un.p b{color:#050508;background:#34d399}
.un.m b{color:#fda4af;background:rgba(244,63,94,.18)}
.un.n b{color:#c4b5fd;background:rgba(139,92,246,.22)}
.us-prog{display:none;height:6px;border-radius:99px;background:rgba(255,255,255,.09);overflow:hidden;margin:2px 0 8px}
.us-prog.on{display:block}
.us-prog i{display:block;height:100%;width:0%;border-radius:99px;background:linear-gradient(90deg,#8b5cf6,#6366f1);
  box-shadow:0 0 12px rgba(129,140,248,.85);transition:width .25s ease}
.us-row{display:flex;justify-content:space-between;gap:10px;font-size:11px;color:#8b8fa3;font-weight:700;margin:0 2px 14px;min-height:14px}
.us-btn{width:100%;padding:13px;border:none;border-radius:14px;font-size:14px;font-weight:800;color:#fff;cursor:pointer;
  font-family:inherit;background:linear-gradient(135deg,#8b5cf6,#6366f1);
  box-shadow:0 10px 26px rgba(99,102,241,.35);transition:transform .15s ease,box-shadow .2s ease,opacity .2s}
.us-btn:hover{transform:translateY(-1px);box-shadow:0 14px 30px rgba(99,102,241,.45)}
.us-btn:disabled{opacity:.55;cursor:default;transform:none}

/* ---------- анімації зміни дня (свайп/клік) ---------- */
#list.slide-l{animation:slideL .28s cubic-bezier(.2,.9,.3,1) both}
#list.slide-r{animation:slideR .28s cubic-bezier(.2,.9,.3,1) both}
@keyframes slideL{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
@keyframes slideR{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}
.dchg{animation:dchg .32s ease}
@keyframes dchg{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}

</style>
</head>
<body>
<div id="app">

<div id="tbar">
  <div class="tb-l">
    <span class="lmark" id="logo" aria-hidden="true"><img src="data:image/png;base64,__LOGO_B64__" width="27" height="27" alt="" decoding="sync" style="display:block;border-radius:8px"></span>
    <span class="tb-name">FluxHelper</span>
    <span class="tb-ver" id="tbSec">розклад</span>
  </div>
  <div class="tb-r">
    <button class="tb-btn" id="bCfg" title="Налаштування">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    </button>
    <button class="tb-btn win-only" id="bMin" title="Згорнути">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </button>
    <button class="tb-btn tb-x win-only" id="bClose" title="Закрити">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
    </button>
  </div>
</div>

<div id="vMain" class="view">
  <div id="nban" class="ban hidden">
    <div class="bn-ic">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
    </div>
    <div class="bn-t"><b>Сповіщення про початок уроку</b><span>підкажемо завчасно — щоб ти не запізнився</span></div>
    <button class="bn-btn" id="nbOn">Увімкнути</button>
    <button class="bn-x" id="nbX" title="Сховати">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
    </button>
  </div>
  <header>
    <h2 id="dayName">Понеділок</h2>
    <div class="chip" id="chip"></div>
  </header>
  <nav id="tabs"></nav>
  <main id="list"></main>
</div>

<div id="vSetup" class="view hidden">
  <div class="sw-wrap">
    <div class="sw-head">
      <div class="sw-head-l">
        <div class="sw-title-row">
          <h2>Налаштування</h2>
          <span class="sw-verpill">FluxHelper для Windows</span>
        </div>
        <span class="sw-sub">групи перемикаються на місці · сповіщення · оновлення</span>
      </div>
      <button class="su-back" id="bBack" title="Назад до розкладу">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        <span>Розклад</span>
      </button>
    </div>

    <div class="sw-grid">
      <section class="sw-card sw-wide">
        <div class="sw-c-head">
          <span class="sw-c-ic grad"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
          <div class="sw-c-tt">
            <b>Мої групи</b>
            <span>натисни 1 або 2 — вчитель і посилання підставляться скрізь одразу</span>
          </div>
          <span class="s-prog" id="sSum">—</span>
        </div>
        <div id="sumRows"></div>
        <button class="b-groups" id="bGroups">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Деталі та вчителі обох груп…
        </button>
      </section>

      <section class="sw-card">
        <div class="sw-c-head">
          <span class="sw-c-ic plain"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg></span>
          <div class="sw-c-tt"><b>Сповіщення</b><span>нагадаємо до дзвінка</span></div>
        </div>
        <div class="sw-tog-row">
          <div class="su-ic2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          </div>
          <div class="su-body">
            <b>Повідомити про початок уроку</b>
            <span>сповіщення Windows з назвою уроку</span>
          </div>
          <label class="sw"><input type="checkbox" id="nOn"><i></i></label>
        </div>
        <div class="nslider hidden" id="nMinRow">
          <div class="ns-top"><span class="ns-lbl">повідомити за</span><span class="ns-val" id="nMinVal">5 хв</span></div>
          <input type="range" id="nMin" min="1" max="15" step="1" value="5" aria-label="Хвилин до уроку">
          <div class="ns-scale"><span>1 хв</span><span>5</span><span>10</span><span>15 хв</span></div>
        </div>
        <button class="su-perm hidden" id="bPerm">Надати дозвіл на сповіщення</button>
      </section>

      <section class="sw-card">
        <div class="sw-c-head">
          <span class="sw-c-ic plain"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
          <div class="sw-c-tt"><b>Оновлення</b><span>FluxHelper оновлюється сам</span></div>
        </div>
        <div class="sw-tog-row">
          <div class="su-ic2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5"/><path d="M12 12v9"/><path d="M12 12L4 7.5"/></svg>
          </div>
          <div class="su-body">
            <b>Версія <span id="upCur"></span></b>
            <span id="upStat">перевіряємо…</span>
          </div>
          <button class="b-mini" id="bUpd">Перевірити</button>
        </div>
      </section>

      <section class="sw-card dev sw-wide hidden" id="devSec">
        <div class="sw-c-head">
          <span class="sw-c-ic" style="background:linear-gradient(135deg,#f59e0b,#f97316)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></span>
          <div class="sw-c-tt">
            <b>Режим розробника</b>
            <span>тестові функції — для перевірки сповіщень</span>
          </div>
          <span class="s-prog" style="color:#fde68a;background:rgba(245,158,11,.12);border-color:rgba(245,158,11,.4)">DEV</span>
        </div>
        <button class="dev-btn" id="bTestNotif">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
          <span>Надіслати тестове сповіщення<span class="dsub" id="devTestSub">приклад: «Урок почнеться через 5 хв»</span></span>
        </button>
        <button class="dev-btn ghost" id="bDevOff">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
          <span>Вимкнути режим розробника<span class="dsub">або натисни на версію внизу ще 5 разів</span></span>
        </button>
      </section>
    </div>

    <div class="sw-about">
      <span class="lmark"><img src="data:image/png;base64,__LOGO_B64__" width="40" height="40" alt="" decoding="sync"></span>
      <div class="ab-t">
        <b>FluxHelper</b>
        <span>розклад 8-Б класу · автор Blazix</span>
      </div>
      <button class="sw-ver" id="verTap" title="FluxHelper">версія __APP_VER__</button>
    </div>
  </div>
</div>

</div><!-- /#app -->

<div id="mwrap" class="hidden">
  <div class="mback" id="mback"></div>
  <div class="modal">
    <div class="m-head">
      <div class="m-ic" id="mIc"></div>
      <div class="m-tt"><b id="mName"></b><span id="mSub">обери групу — скопіюємо посилання</span></div>
    </div>
    <div id="mItems"></div>
  </div>
</div>

<div id="gwrap" class="hidden">
  <div class="mback" id="gback"></div>
  <div class="modal gmodal">
    <div class="m-head">
      <div class="m-ic" style="background:linear-gradient(135deg,#8b5cf6,#6366f1)">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div class="m-tt"><b>Мої групи</b><span id="gSub">обери групу для кожного предмета</span></div>
    </div>
    <div class="g-rows" id="gRows"></div>
    <div class="g-foot">
      <span class="s-prog" id="gProg">0/5</span>
      <button class="b-mini" id="gCancel">Скасувати</button>
      <button class="b-save" id="gSave" disabled>Зберегти</button>
    </div>
  </div>
</div>

<div id="toast"></div>

<div id="devwrap" class="hidden">
  <div class="mback" id="devback"></div>
  <div class="modal" style="width:min(400px,100%)">
    <div class="m-head">
      <div class="m-ic" style="background:linear-gradient(135deg,#f59e0b,#f97316)">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      </div>
      <div class="m-tt"><b id="devTitle">Увімкнути режим розробника?</b><span id="devSub">з'явиться тестове сповіщення у налаштуваннях</span></div>
    </div>
    <div class="g-foot" style="margin-top:2px">
      <button class="b-mini" id="devCancel">Скасувати</button>
      <button class="b-save" id="devOk" style="width:auto">Увімкнути</button>
    </div>
  </div>
</div>

<div id="boot">
  <div class="bt-mark" id="btMark"><img src="data:image/png;base64,__LOGO_B64__" width="92" height="92" alt="" decoding="sync" fetchpriority="high" style="display:block;border-radius:20px"></div>
  <div class="bt-name">FluxHelper</div>
  <div class="bt-bar"><i id="btFill"></i></div>
  <div class="bt-pct" id="btPct">0%</div>
</div>

<div id="neterr" class="hidden">
  <div class="us-card">
    <div class="us-logo" id="neLogo"></div>
    <h2>Немає з'єднання</h2>
    <p class="us-sub" id="neStat">FluxHelper бере розклад з інтернету — увімкни мережу і спробуй ще раз.</p>
    <button class="us-btn" id="neRetry">Спробувати ще раз</button>
  </div>
</div>

<div id="upd" class="hidden">
  <div class="us-card">
    <div class="us-logo" id="upLogo"></div>
    <div class="us-chip">доступне оновлення</div>
    <h2><span id="updOld"></span> → <b id="updNew"></b></h2>
    <p class="us-sub">щоб користуватися програмою, спершу встанови нову версію</p>
    <div class="us-notes" id="updNotes"></div>
    <div class="us-prog" id="updProg"><i id="upFill"></i></div>
    <div class="us-row"><span id="uStat">готово до встановлення</span><span id="upPct"></span></div>
    <button class="us-btn" id="updGo">Оновити</button>
  </div>
</div>

<script>
"use strict";
const LOGO = "data:image/png;base64,__LOGO_B64__";
const SETTINGS0 = __SETTINGS_JSON__;

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
    'алгебра':                 { icon: 'sigma',    link: 'https://us04web.zoom.us/j/74715960561?pwd=lzq3MwKhbj9g29rudFrXzaahMwqMkK.1' },
    'геометрія':               { icon: 'shape',    link: 'https://us04web.zoom.us/j/74715960561?pwd=lzq3MwKhbj9g29rudFrXzaahMwqMkK.1' },
    'зарубіжна література':    { icon: 'bookopen', link: 'https://us05web.zoom.us/j/3362996170?pwd=UDFMbkRaU3BRaDF5UUxhcWY1NTIxUT09' },
    'основи медіаграмотності': { icon: 'film',     link: 'https://us04web.zoom.us/j/3087220547?pwd=OHFkb3RuZHFEc2hFbUdpQ09UazFydz09' },
    'англійська мова':         { icon: 'msg',      links: { '1': 'https://us04web.zoom.us/j/78501670655?pwd=jvkDLg5Zr0yftjC45RshgmVk1DI71b.1', '2': 'https://us04web.zoom.us/j/2789884374?pwd=40c3JMgJgB7Af9fO3iMAab1yKsDD1Q.1' } },
    'німецька мова':           { icon: 'globe',    links: { '1': 'https://us05web.zoom.us/j/3362996170?pwd=UDFMbkRaU3BRaDF5UUxhcWY1NTIxUT09', '2': 'https://us04web.zoom.us/j/7383966360?pwd=aTVZcUdMNW15R3pOa09YVnZXY1h4QT09' } },
    'українська мова':         { icon: 'book',     links: { '1': 'https://us05web.zoom.us/j/7865109402?pwd=Z2NSY0g4eGtYUGpEM1Y3OUF6c3o2QT09', '2': 'https://us05web.zoom.us/j/8988356507?pwd=OXFEU1lucjBHcEhYNXdZL1p0UThMUT09' } },
    'українська література':   { icon: 'bookopen', link: 'https://us05web.zoom.us/j/7865109402?pwd=Z2NSY0g4eGtYUGpEM1Y3OUF6c3o2QT09' },
    'історія україни':         { icon: 'landmark', link: 'https://us05web.zoom.us/j/3749252625?pwd=n9BlQwCIZnBHwKabIs7EtF9EKaSdbk.1' },
    'фізика':                  { icon: 'atom',     link: 'https://us05web.zoom.us/j/2891383331?pwd=F0jxnmfiTOxydHzcOLugDXOPsR7AN9.1' },
    'фізична культура':        { icon: 'ball',     link: 'https://us04web.zoom.us/j/7328694112?pwd=T2NucVJwS21UbHhubE9yL3BpcytyUT09' },
    'хімія':                   { icon: 'flask',    link: 'https://us04web.zoom.us/j/2229570959?pwd=aWV5enFmN3BLVlgvUHU1ckFJelpHUT09' },
    'громадянська освіта':     { icon: 'users',    link: 'https://us04web.zoom.us/j/8101017692?pwd=ajEvMHVvZmsycjc5SFhGeDNHNzgvZz09' },
    'інформатика':             { icon: 'monitor',  links: { '1': 'https://us05web.zoom.us/j/2621050038?pwd=S2xMWTJ4ZnFWeW9pZDRDRkZKSzI5UT09', '2': 'https://us04web.zoom.us/j/73998115709?pwd=BEwuKbgpHj0GKDQYf8wWb8simysaJS.1' } },
    'географія':               { icon: 'map',      link: 'https://us05web.zoom.us/j/7923390560?pwd=clJYM3FiN2xISi9lRk1xMFMwcDB3QT09' },
    'трудове навчання':        { icon: 'wrench',   lbl: ['Дівчата', 'Хлопці'], links: { '1': 'https://us04web.zoom.us/j/9260090464?pwd=cTZzMlRjTWpqUHVyeU0xZWw5QkxaUT09', '2': 'https://us04web.zoom.us/j/5931128404?pwd=ARgqPxXvvs7WVlSJuLbMXHHfdmvxqv.1' } },
    'біологія':                { icon: 'leaf',     link: 'https://us05web.zoom.us/j/6689709542?pwd=SFZjTDQ1eU1uQlppSCt1UGhlYXNGUT09&omn=85627260742' }
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
const APP_VER = '__APP_VER__';                  // версія X.Y.Z — з version.h (див. main.cpp)
let FIRST = !S;                             // групи ще не налаштовані -> майстер обов'язковий

// ---------------- сповіщення ----------------
let NOTIF = { on: true, min: 5 };
try {
  const n = JSON.parse(localStorage.getItem('fh_notif') || 'null');
  if (n && typeof n === 'object') {
    if (typeof n.on === 'boolean') NOTIF.on = n.on;
    if (typeof n.min === 'number' && n.min >= 1 && n.min <= 15) NOTIF.min = n.min;
  }
} catch (e) {}
function saveNotif() { try { localStorage.setItem('fh_notif', JSON.stringify(NOTIF)); } catch (e) {} }

// ---------------- дані з Firebase (поверх вбудованих) ----------------
let DBD = { teachers: null, subjects: null, schedule: null };
function teachFor(key) { return DBD.teachers ? (DBD.teachers[key] || null) : (BUILTIN.teachers[key] || null); }
function subjFor(key) { return DBD.subjects ? (DBD.subjects[key] || null) : (BUILTIN.subjects[key] || null); }
function schedFor(dk) { const a = DBD.schedule ? DBD.schedule[dk] : BUILTIN.schedule[dk]; return Array.isArray(a) ? a : null; }

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
function openL(u) {
  if (!u) return;
  if (ANDROID) { try { AndroidHost.open(u); return; } catch (e) {} }
  if (!host('fh:join|' + u)) window.open(u, '_blank');
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
function tileGrad(name) {
  let h = 0; for (const ch of String(name)) h = (h * 31 + ch.codePointAt(0)) % 1000;
  const hue = 236 + (h % 54);
  return 'linear-gradient(135deg,hsl(' + hue + ',62%,58%),hsl(' + ((hue + 34) % 360) + ',68%,46%))';
}

// ---------------- SVG-ІКОНКИ ----------------
const ICONS = {
  book:     '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  bookopen: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  msg:      '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>',
  globe:    '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  sigma:    '<path d="M17 5H7l6 7-6 7h10"/>',
  shape:    '<path d="M12 3.5 21 20H3z"/>',
  flask:    '<path d="M9 3h6"/><path d="M10 3v5.2L4.6 17a2.3 2.3 0 0 0 2 3.4h10.8a2.3 2.3 0 0 0 2-3.4L14 8.2V3"/><path d="M7.4 14.5h9.2"/>',
  atom:     '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9.4" ry="4"/><ellipse cx="12" cy="12" rx="9.4" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.4" ry="4" transform="rotate(-60 12 12)"/>',
  ball:     '<circle cx="12" cy="12" r="9"/><path d="M3.4 8.7c2.7 1.3 5.6 2 8.6 2s5.9-.7 8.6-2"/><path d="M3.4 15.3c2.7-1.3 5.6-2 8.6-2s5.9.7 8.6 2"/><path d="M12 3v18"/>',
  landmark: '<path d="M3 21h18"/><path d="M5 18v-8"/><path d="M9.5 18v-8"/><path d="M14.5 18v-8"/><path d="M19 18v-8"/><path d="M3 7l9-4.5L21 7z"/>',
  monitor:  '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
  wrench:   '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  map:      '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',
  leaf:     '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  users:    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  copy:     '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  film:     '<rect x="2" y="3" width="20" height="18" rx="2.5"/><line x1="7" y1="3" x2="7" y2="21"/><line x1="17" y1="3" x2="17" y2="21"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7.5" x2="7" y2="7.5"/><line x1="2" y1="16.5" x2="7" y2="16.5"/><line x1="17" y1="16.5" x2="22" y2="16.5"/><line x1="17" y1="7.5" x2="22" y2="7.5"/>',
  clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  user:     '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  check:    '<polyline points="20 6 9 17 4 12"/>',
  link:     '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'
};
function icon(name, sz) {
  return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.book) + '</svg>';
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
  // ПК: масштабуємо весь інтерфейс zoom'ом, щоб за будь-якого розміру
  // вікна все вміщалось (мобільного режиму в цьому файлі немає)
  const w = window.innerWidth || 1040, h = window.innerHeight || 700;
  const app = byId('app');
  if (!app) return;
  let s = Math.min(w / 1040, h / 700);
  s = Math.max(0.8, Math.min(2.2, s));
  app.style.zoom = s;
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
    if (anim !== false) card.style.animationDelay = (i * 0.05) + 's';

    const tile = el('div', 'ic');
    tile.innerHTML = icon(l.icon, 21);
    tile.style.background = tileGrad(l.name);

    const mid = el('div', 'mid');
    const h3 = el('h3'); h3.textContent = l.name;
    if (i === nowIdx) h3.appendChild(el('span', 'now-chip', '<i></i>ЗАРАЗ'));
    if (i === nextIdx) h3.appendChild(el('span', 'next-chip', '<i></i>ДАЛІ'));
    mid.appendChild(h3);

    const meta = el('div', 'meta');
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
    b.onclick = function (ev) { ev.stopPropagation(); openL(l.url); };

    card.onclick = function () {
      if (lpFired) { lpFired = false; return; }
      if (swipeFired) { swipeFired = false; return; }
      openL(l.url);
    };
    card.addEventListener('contextmenu', function (ev) {
      ev.preventDefault();
      if (lpFired) { lpFired = false; return; }
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
  tabEls.forEach(function (t, i) { if (t.classList) t.classList.toggle('on', i === sel); });
  setChip();
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
  chip.innerHTML = cap + ', ' + dm + (isToday ? ' <i class="today-dot"></i>' : '');
}

function todayIdx() { const d = todayDow(); return (d >= 1 && d <= 5) ? d - 1 : 0; }

function setTbSec(t) { const e = byId('tbSec'); if (e) e.textContent = t; }
function showMain() {
  if (FIRST) { showSetup(); openGroups(); return; }   // перший запуск — спершу групи
  setupOpen = false;
  byId('vSetup').classList.add('hidden');
  byId('vMain').classList.remove('hidden');
  setChip();
  markNav('sched');
  setTbSec('розклад');
  checkNban();
}
function showSetup() {
  setupOpen = true;
  closeDrawer();
  byId('vMain').classList.add('hidden');
  byId('vSetup').classList.remove('hidden');
  const bb = byId('bBack');
  if (bb) bb.style.display = FIRST ? 'none' : '';     // у майстрі першого запуску немає «назад»
  buildSummary();
  refreshNotifUI();
  refreshDev();
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
  ['dwSched', 'dwSet'].forEach(function (id) {
    const e2 = byId(id); if (e2) e2.classList.remove('on');
  });
  const map = { home: 'dwSched', sched: 'dwSched', setup: 'dwSet' };
  const t = byId(map[view] || 'dwSched');
  if (t) t.classList.add('on');
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
  const sp = byId('sSum');
  if (sp) sp.textContent = done + '/' + keys.length;
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
// ---------------- РЕЖИМ РОЗРОБНИКА ----------------
// 5 натискань на версію внизу налаштувань -> діалог -> тестові функції.
// Стан зберігається у localStorage (fh_dev). Працює і на ПК, і на телефоні.
let DEV = false;
try { DEV = localStorage.getItem('fh_dev') === '1'; } catch (e) {}
let devTaps = 0, devTapT = null;
function tapVersion() {
  devTaps++;
  clearTimeout(devTapT);
  devTapT = setTimeout(function () { devTaps = 0; }, 1600);
  if (devTaps >= 5) {
    devTaps = 0;
    askDev(!DEV);
  } else if (devTaps >= 3) {
    toast(DEV ? ('вимкнути? ще ' + (5 - devTaps) + '…') : ('ще ' + (5 - devTaps) + ' натискання…'));
  }
}
function askDev(on) {
  const w = byId('devwrap');
  if (!w) { setDev(on); return; }
  byId('devTitle').textContent = on ? 'Увімкнути режим розробника?' : 'Вимкнути режим розробника?';
  byId('devSub').textContent = on ? 'у налаштуваннях з’явиться тестове сповіщення'
                                  : 'тестові функції будуть сховані';
  byId('devOk').textContent = on ? 'Увімкнути' : 'Вимкнути';
  byId('devOk').onclick = function () { setDev(on); w.classList.add('hidden'); };
  w.classList.remove('hidden');
}
function setDev(on) {
  DEV = on;
  try { localStorage.setItem('fh_dev', on ? '1' : '0'); } catch (e) {}
  refreshDev();
  toast(on ? 'Режим розробника увімкнено' : 'Режим розробника вимкнено');
}
function refreshDev() {
  const s = byId('devSec');
  if (s) s.classList.toggle('hidden', !DEV);
  const ts = byId('devTestSub');
  if (ts) ts.textContent = 'приклад: «Урок почнеться через ' + NOTIF.min + ' хв»';
}
// тестове сповіщення: беремо НАСТУПНИЙ урок із реального розкладу
function nextLessonName() {
  resolveLessons();
  const ti = todayIdx();
  const m = nowMin();
  const days = [RES[ti] || [], RES[(ti + 1) % 5] || []];
  for (let d = 0; d < 2; ++d) {
    for (let i = 0; i < days[d].length; ++i) {
      const a = toMin(days[d][i].t);
      if (a && (d === 1 || a > m)) return days[d][i].name || 'Урок';
    }
  }
  return (days[0][0] && days[0][0].name) || 'Урок';
}
function sendTestNotif() {
  const nm = nextLessonName();
  const title = '🔔 Скоро почнеться урок';
  const text = nm + ' почнеться через ' + NOTIF.min + ' хв (тест)';
  if (ANDROID) {
    try { AndroidHost.testNotif(title, text); toast('Тестове сповіщення надіслано ✓'); return; } catch (e) {}
  }
  if (host('fh:notif-test|' + JSON.stringify({ title: title, text: text }))) {
    toast('Тестове сповіщення надіслано ✓'); return;
  }
  toast('Сповіщення недоступні на цьому пристрої');
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
  if (first) showMain();   // після першого збереження одразу показуємо розклад
}

// ---------------- сповіщення: інтерфейс + push до хостів ----------------
function pushNotifSched() {
  resolveLessons();
  const items = [];
  RES.forEach(function (day, i) {
    (day || []).forEach(function (l) {
      if (l.t) items.push({ dow: i + 1, t: l.t, n: l.name });
    });
  });
  const payload = JSON.stringify({ on: NOTIF.on, min: NOTIF.min, items: items });
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
    DBD.teachers = t; changed = true;
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
    DBD.subjects = t; changed = true;
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
    if (okCnt) { DBD.schedule = t; changed = true; }
  }
  if (db.app !== undefined && validNode(db.app)) {
    const r = (typeof db.app.repo === 'string') ? db.app.repo.trim() : '';
    if (r && r !== UPDATE_REPO) {
      UPDATE_REPO = r;
      try { localStorage.setItem('fh_repo', r); } catch (e) {}
    }
  }
  if (changed) {
    if (!fromCache) {
      try { localStorage.setItem('fh_cache', JSON.stringify({ ts: Date.now(), data: db })); } catch (e) {}
      cacheTs = Date.now();
    }
    dbOnline = true;
    if (!setupOpen) render(false);
    pushNotifSched();
  }
  // живе відстеження версії: поки програма відкрита — як тільки в базі з'явиться
  // нова версія (SSE/doFetch), одразу показуємо модалку оновлення
  if (!fromCache && db && typeof db.update !== 'undefined') updFromDb(db.update);
  return changed;
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

// ---------------- система оновлень ----------------
// Firebase /update = { latest: "X.Y.Z", notes: ["+ ...", "- ..."] } — пише deploy-скрипт.
// Програма порівнює latest із своєю версією; якщо відрізняється і папка
// versions/<v>/ реально є на GitHub — показує МОДАЛКУ, яку не можна закрити,
// і встановлює нову версію (PC: exe сам себе замінює; телефон: APK-інсталятор).
const DEFAULT_REPO = 'matviikobrys2707/FluxHelper';
let UPDATE_REPO = DEFAULT_REPO;
try { const _r = localStorage.getItem('fh_repo'); if (_r) UPDATE_REPO = _r; } catch (e) {}
let UPD = { avail: false, ver: '', busy: false, pending: '', watch: 0, dbNotes: null, dbVer: '' };
function verCmp(a, b) {
  const p = String(a).split('.'), q = String(b).split('.');
  for (let i = 0; i < 3; i++) {
    const x = parseInt(p[i], 10) || 0, y = parseInt(q[i], 10) || 0;
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}
function updOpen() { return UPD.avail; }
function parseNotes(txt) {
  return String(txt || '').split(/\r?\n/).map(function (s) { return s.trim(); })
    .filter(function (s) { return s.length > 0; }).slice(0, 24);
}
// плавний показ головного екрана (дозволено лише один раз і без відкритої модалки)
function revealNow() {
  if (bootRevealed || updOpen()) return;
  bootReady = true;
}
function showUpd(v, notes) {
  UPD.avail = true; UPD.ver = v; UPD.busy = false; UPD.pending = '';
  const b = byId('boot');
  if (b && !b.classList.contains('hidden')) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 560); }
  hideNetErr();
  byId('updOld').textContent = APP_VER;
  byId('updNew').textContent = v;
  const nx = byId('updNotes');
  nx.innerHTML = '';
  const list = (notes && notes.length) ? notes : [];
  if (!list.length) list.push('виправлення та покращення');
  list.forEach(function (raw) {
    const s = String(raw).trim(); if (!s) return;
    let cls = 'n', mark = '•', txt = s;
    if (s.charAt(0) === '+') { cls = 'p'; mark = '+'; txt = s.slice(1).trim(); }
    else if (s.charAt(0) === '-') { cls = 'm'; mark = '−'; txt = s.slice(1).trim(); }
    const li = el('div', 'un ' + cls);
    const bb = document.createElement('b'); bb.textContent = mark;
    const sp = document.createElement('span'); sp.textContent = txt || s;
    li.appendChild(bb); li.appendChild(sp);
    nx.appendChild(li);
  });
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
function updCheck(latest) {
  if (!/^\d+\.\d+\.\d+$/.test(latest || '') || verCmp(latest, APP_VER) <= 0) { revealNow(); return; }
  if (UPD.avail || UPD.pending === latest) return;
  UPD.pending = latest;
  fetch('https://raw.githubusercontent.com/' + UPDATE_REPO + '/main/versions/' + latest + '/changelog.txt?_=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw 0; return r.text(); })
    .then(function (txt) {
      if (UPD.avail) return;
      const notes = (UPD.dbVer === latest && UPD.dbNotes && UPD.dbNotes.length) ? UPD.dbNotes : parseNotes(txt);
      showUpd(latest, notes);
    })
    .catch(function () {
      UPD.pending = '';
      revealNow();          // папки немає — не блокуємо застосунок
    });
}
function updFromDb(u) {
  const latest = (u && typeof u.latest === 'string') ? u.latest : '';
  const notes = (u && Array.isArray(u.notes)) ? u.notes.map(String).slice(0, 24) : null;
  if (notes && notes.length) { UPD.dbNotes = notes; UPD.dbVer = latest; }
  if (UPD.avail) return;
  updCheck(latest);
}
// --- миттєве відстеження версії: застосунок САМ дивиться на Firebase —
// щойно в базі зміниться update.latest (і зросте) — одразу перевіряємо GitHub
// і показуємо вікно оновлення. Без кнопки «Перевірити» і без перезапуску.
let updWatchBusy = false;
function watchUpdate() {
  if (updOpen() || updWatchBusy || document.hidden) return;
  updWatchBusy = true;
  fetch(DB_URL + '/update.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (u) {
      updWatchBusy = false;
      if (!u || typeof u !== 'object') return;
      const latest = (typeof u.latest === 'string') ? u.latest : '';
      if (latest && Array.isArray(u.notes) && u.notes.length) {
        UPD.dbNotes = u.notes.map(String).slice(0, 24);
        UPD.dbVer = latest;
      }
      if (/^\d+\.\d+\.\d+$/.test(latest) && verCmp(latest, APP_VER) > 0) updCheck(latest);
    })
    .catch(function () { updWatchBusy = false; });
}
// --- завантаження + встановлення ---
function setUpdBtn(en) { const b = byId('updGo'); if (b) b.disabled = !en; }
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
  setUpdBtn(true);
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
  if (ANDROID) {
    // ТЕЛЕФОН: Android блокує встановлення APK прямо з застосунку, тому ми
    // НЕ качаємо файл самі — відкриваємо ПРЯМИЙ ПОСИЛАННЯ у браузері.
    // Користувач вже там завантажує APK і встановлює його (як звичайний файл).
    byId('uStat').textContent = 'шукаю файл оновлення…';
    const base = 'https://raw.githubusercontent.com/' + UPDATE_REPO + '/main/versions/' + UPD.ver + '/';
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
  byId('uStat').textContent = 'готуємо завантаження…';
  const payload = JSON.stringify({ v: UPD.ver, repo: UPDATE_REPO });
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
// --- немає інтернету: жодного інтерфейсу, тільки екран помилки ---
function showNetErr(msg) {
  const ne = byId('neterr');
  if (!ne) return;
  document.body.classList.add('net-lock');   // титульна панель поверх (ПК)
  const s = byId('neStat');
  if (s) s.textContent = msg || 'Flux Helper бере розклад з інтернету — увімкни мережу і спробуй ще раз.';
  const b = byId('boot');
  if (b && !b.classList.contains('hidden')) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 400); }
  ne.classList.remove('hidden');
  const r = byId('neRetry');
  if (r) { r.disabled = false; r.textContent = 'Спробувати ще раз'; }
}
function hideNetErr() {
  const ne = byId('neterr'); if (ne) ne.classList.add('hidden');
  document.body.classList.remove('net-lock');
}
let netBusy = false;
function netProbe(retry) {
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
  const el = Date.now() - bootStart;
  const target = (bootReady && el >= 1100) ? 100 : Math.min(88, (el / 1500) * 88);
  bootP += (target - bootP) * ((target === 100) ? 0.14 : 0.09);
  if (target === 100 && target - bootP < 0.5) bootP = 100;
  const f = byId('btFill'), pc = byId('btPct');
  if (f) f.style.width = bootP.toFixed(1) + '%';
  if (pc) pc.textContent = Math.round(bootP) + '%';
  if (bootP >= 100) {
    if (!bootRevealed) {
      bootRevealed = true;
      document.body.classList.add('ready');
      const b = byId('boot');
      if (b) { b.classList.add('off'); setTimeout(function () { b.classList.add('hidden'); }, 580); }
    }
    return;
  }
  bootRaf(bootLoop);
}
function init() {
  if (ANDROID) { document.body.classList.add('android'); document.documentElement.classList.add('android'); }
  // лого в титульній панелі ТЕПЕР СТАТИЧНИЙ <img> у HTML — малюється разом
  // із першим кадром (раніше його вставляв JS -> «іконки вгорі немає»)
  const dwl = byId('dwLogo'); if (dwl) dwl.innerHTML = logoMark(36);
  byId('upCur').textContent = APP_VER;
  const st = byId('upStat'); if (st) st.textContent = 'встановлена версія ' + APP_VER;  // рядок у налаштуваннях
  byId('neLogo').innerHTML = logoMark(74);
  byId('upLogo').innerHTML = logoMark(74);
  byId('neRetry').onclick = function () { netProbe(true); };
  byId('updGo').onclick = startUpdate;

  byId('bMin').onclick = function () { host('fh:min'); };
  byId('bClose').onclick = function () { host('fh:close'); };
  byId('bCfg').onclick = function () { showSetup(); };
  byId('bBack').onclick = function () { showMain(); };
  byId('tbar').addEventListener('mousedown', function (e) {
    if (e.button === 0 && !(e.target && e.target.closest && e.target.closest('.tb-btn'))) host('fh:drag');
  });
  byId('bGroups').onclick = openGroups;
  byId('gSave').onclick = saveSettings;
  byId('gCancel').onclick = closeGroups;
  byId('gback').onclick = closeGroups;
  byId('nOn').onchange = function () { NOTIF.on = byId('nOn').checked; saveNotif(); refreshNotifUI(); pushNotifSched(); };
  const nMinSl = byId('nMin');
  if (nMinSl) {
    nMinSl.oninput = function () {
      NOTIF.min = parseInt(nMinSl.value, 10) || 5;
      nMinSl.style.setProperty('--p', (((NOTIF.min - 1) / 14) * 100).toFixed(1) + '%');
      const sv = byId('nMinVal'); if (sv) sv.textContent = NOTIF.min + ' хв';
    };
    nMinSl.onchange = function () { saveNotif(); pushNotifSched(); };
  }
  byId('bPerm').onclick = function () { if (ANDROID) { try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (e) {} } };
  // --- режим розробника: 5 тапів на версію в блоці «Про програму» ---
  const vt = byId('verTap');
  if (vt) vt.onclick = tapVersion;
  const dc = byId('devCancel'); if (dc) dc.onclick = function () { byId('devwrap').classList.add('hidden'); };
  const db2 = byId('devback'); if (db2) db2.onclick = function () { byId('devwrap').classList.add('hidden'); };
  const btn = byId('bTestNotif'); if (btn) btn.onclick = sendTestNotif;
  const boff = byId('bDevOff'); if (boff) boff.onclick = function () { setDev(false); };
  refreshDev();
  byId('mback').onclick = closeModal;
  byId('nbOn').onclick = function () {
    if (ANDROID) { try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (e) {} }
  };
  byId('nbX').onclick = function () {
    try { localStorage.setItem('fh_nban', 'off'); } catch (e) {}
    byId('nban').classList.add('hidden');
  };
  byId('bUpd').onclick = function () {
    if (updOpen()) return;
    const st2 = byId('upStat');
    if (st2) st2.textContent = 'перевіряємо…';
    fetch(DB_URL + '/update.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (u) {
        const latest = (u && typeof u.latest === 'string') ? u.latest : '';
        if (/^\d+\.\d+\.\d+$/.test(latest) && verCmp(latest, APP_VER) > 0) {
          UPD.dbNotes = (u && Array.isArray(u.notes)) ? u.notes.map(String).slice(0, 24) : null;
          UPD.dbVer = latest;
          updCheck(latest);
          if (st2) st2.textContent = 'знайдено ' + latest + ' — відкриваю оновлення…';
        } else if (st2) st2.textContent = 'у тебе найновіша версія (' + APP_VER + ')';
      })
      .catch(function () { if (st2) st2.textContent = 'немає з\u2019єднання — спробуй пізніше'; });
  };
  window.addEventListener('keydown', function (e) {
    if (updOpen()) return;   // блокуюча модалка оновлення — керування вимкнено
    if (e.key === 'Escape') {
      if (groupsOpen()) { closeGroups(); return; }
      const dw2 = byId('devwrap');
      if (dw2 && !dw2.classList.contains('hidden')) { dw2.classList.add('hidden'); return; }
      if (drawerOpen()) { closeDrawer(); return; }
      closeModal();
      return;
    }
    if (setupOpen) return;
    const k = parseInt(e.key, 10);
    if (k >= 1 && k <= 5) { sel = k - 1; render(); }
  });


  buildTabs();
  if (S) { showMain(); render(); } else { showSetup(); openGroups(); }
  applyScale();
  window.addEventListener('resize', applyScale);

  // миттєвий показ із кешу (економія лімітів Firebase)
  try {
    const c = JSON.parse(localStorage.getItem('fh_cache') || 'null');
    if (c && c.data) { cacheTs = c.ts || 0; applyDb(c.data, true); }
  } catch (e) {}

  // живі дані + ОБОВ'ЯЗКОВА мережева перевірка (без інтернету — інтерфейсу немає)
  doFetch(false);
  startLive();
  pushNotifSched();
  netProbe(false);

  // авто-стеження за версією: SSE + тихий опитування /update кожні 25 с
  // + перевірка одразу після повернення у вікно — «Доступне оновлення»
  // з'являється САМО, щойно версія на сервері зміниться
  setInterval(watchUpdate, 25000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { watchUpdate(); doFetch(false); }
  });

  // на телефоні одразу просимо дозвіл на сповіщення
  if (ANDROID && !notifPermOk()) {
    setTimeout(function () { try { AndroidHost.requestNotifPerm(); pollNotifPerm(); } catch (e) {} }, 1200);
  }

  // тихий тік: ЗАРАЗ/ДАЛІ/прогрес — без анімації, раз на хвилину зміни
  let lastTick = '';
  setInterval(function () {
    const d = new Date();
    const k = sel + '|' + FAKENOW + '|' + d.getHours() + ':' + d.getMinutes();
    if (k !== lastTick) { lastTick = k; if (!setupOpen) render(false); }
  }, 15000);

  // плавне завершення екрана завантаження: netProbe вирішує — оновлення чи головний екран
  bootLoop();
}

// хук для тестів/прев'ю (не впливає на звичайну роботу)
window.__fh = {
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
    if (updOpen()) return true;              // оновлення обов'язкове — назад шляху немає
    if (groupsOpen()) { closeGroups(); return true; }
    if (FIRST) return true;
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
  st: function () { return { S: S, NOTIF: NOTIF, sel: sel, DBD: DBD, FIRST: FIRST, APP_VER: APP_VER, UPDATE_REPO: UPDATE_REPO, DEV: DEV }; },
  tapVersion: tapVersion, setDev: setDev, devOn: function () { return DEV; },
  sendTestNotif: sendTestNotif
};

try { init(); } catch (err) {
  bootReady = true;
  try { bootLoop(); } catch (e2) { hideBoot(); }
  document.body.innerHTML = '<p style="padding:30px;color:#fff">Помилка інтерфейсу: ' + err.message + '</p>';
}
</script>
</body>
</html>)HTML";
