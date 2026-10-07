// ============================================================
//  FluxControl — розклад уроків + швидкі посилання на Zoom
//  C++ / Win32 / WebView2 (Microsoft Edge Chromium)
//
//  Особливості:
//   • безрамкове вікно із заокругленими кутами (DWM, Win 11;
//     на Win 10 — SetWindowRgn), власна титульна панель у HTML
//   • кастомні кнопки «Згорнути» / «Закрити» через WebMessage
//   • налаштування груп: %APPDATA%\FluxControl\settings.json
//   • інтерфейс генерується у файл %APPDATA%\FluxControl\ui.html
//   • ПКМ-меню, DevTools і браузерні гарячі клавіші вимкнено
//
//  Збірка (MinGW-w64, див. build.sh):
//    x86_64-w64-mingw32-windres app.rc -O coff -o build/app.res
//    x86_64-w64-mingw32-g++ -std=gnu++17 -O2 -municode -mwindows
//        main.cpp build/app.res -o build/FluxHelper.exe ...
// ============================================================
#ifndef UNICODE
#define UNICODE
#endif
#ifndef _UNICODE
#define _UNICODE
#endif

#include <windows.h>
#include <windowsx.h>
#include <shellapi.h>
#include <shlobj.h>
#include <objidl.h>
#include <dwmapi.h>
#include <winhttp.h>
#include <gdiplus.h>

#include "WebView2.h"

#include "version.h"   // FH_VER_STR — версія (єдине джерело разом з app.rc)
#include "assets.h"    // kLogoB64 — логотип у base64
#include "ui_desktop.h"   // kUiHtmlDesktop — інтерфейс ТІЛЬКИ для ПК (HTML/CSS/JS)

#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
#include <vector>
#include <thread>

#ifndef DWMWA_USE_IMMERSIVE_DARK_MODE
#define DWMWA_USE_IMMERSIVE_DARK_MODE 20
#endif
#ifndef DWMWA_WINDOW_CORNER_PREFERENCE
#define DWMWA_WINDOW_CORNER_PREFERENCE 33
#endif
#ifndef DWMWA_BORDER_COLOR
#define DWMWA_BORDER_COLOR 34
#endif
#ifndef DWMWA_COLOR_NONE
#define DWMWA_COLOR_NONE 0xFFFFFFFE
#endif
#ifndef DWMWCP_ROUND
#define DWMWCP_ROUND 2
#endif

// IID-константи (крос-компіляція MinGW: обходимо __uuidof)
static const IID kIID_IUnknown = {0x00000000,0x0000,0x0000,{0xC0,0x00,0x00,0x00,0x00,0x00,0x00,0x46}};
static const IID kIID_EnvironmentHandler = {0x4e8a3389,0xc9d8,0x4bd2,{0xb6,0xb5,0x12,0x4f,0xee,0x6c,0xc1,0x4d}};
static const IID kIID_ControllerHandler  = {0x6c4819f3,0xc9b7,0x4260,{0x81,0x27,0xc9,0xf5,0xbd,0xe7,0xf6,0x8c}};
static const IID kIID_Controller2        = {0xc979903e,0xd4ca,0x4228,{0x92,0xeb,0x47,0xee,0x3f,0xa9,0x6e,0xab}};
static const IID kIID_NewWindowHandler   = {0xd4c185fe,0xc81c,0x4989,{0x97,0xaf,0x2d,0x3f,0xa7,0xab,0x56,0x51}};
//IID_ICoreWebView2WebMessageReceivedEventHandler та IID_ICoreWebView2Settings4 беруться з WebView2.h

static HWND g_hwnd = nullptr;
static ICoreWebView2Controller* g_ctrl = nullptr;
static ICoreWebView2* g_web = nullptr;
static UINT g_dpi = 96;         // системний масштаб
static int  g_bezel = 6;        // рамка для зміни розміру (px)
static bool g_dwmRound = false; // чи підтримує DWM заокруглення
static std::string g_uiHtml;    // згенерований HTML (аварійний показ із пам'яті)
static bool g_fallbackUsed = false;

// екран завантаження (GDI, поки WebView2 ініціалізується)
static bool g_bootDone = false;
static bool g_webShown = false;   // WebView показано (після готовності сторінки)
static int  g_splashTick = 0;

// налаштування (settings.json): групи + розмір вікна + сповіщення
struct AppCfg {
    int ang = 0, nim = 0, ukr = 0, inf = 0, trud = 0;
    int w = 0, h = 0;       // збережений розмір вікна (пікселі)
    int notif = 1;          // сповіщення про початок уроку (увімк/викл)
    int notifmin = 5;       // за скільки хвилин попереджати
    int ver = 0;            // версія файлу налаштувань (2 -> 3: миграція без втрат)
};
static AppCfg g_cfg;

// сповіщення про початок уроків (розклад надсилає інтерфейс через fh:notif|)
struct NItem { int dow = 0; int startMin = 0; std::string name; };
static std::vector<NItem> g_sched;
static long long g_notifKey = 0;   // щоб не спамити одне й те саме
static NOTIFYICONDATAW g_nid = {};

// смуги зміни розміру за краї (визначені нижче)
static void LayoutEdges();

// ------------------------------------------------- GDI+ (сплеш: оригінальний PNG-логотип)
static ULONG_PTR g_gdipTok = 0;
static Gdiplus::Bitmap* g_logoBmp = nullptr;

static int B64Val(int c) {
    if (c >= 'A' && c <= 'Z') return c - 'A';
    if (c >= 'a' && c <= 'z') return c - 'a' + 26;
    if (c >= '0' && c <= '9') return c - '0' + 52;
    if (c == '+') return 62;
    if (c == '/') return 63;
    return -1;
}
static bool B64Decode(const char* in, std::vector<unsigned char>& out) {
    out.clear();
    out.reserve(strlen(in) * 3 / 4 + 4);
    int val = 0, valb = -8;
    for (const char* p = in; *p; ++p) {
        if (*p == '\n' || *p == '\r' || *p == ' ') continue;
        int d = B64Val((unsigned char)*p);
        if (d < 0) return false;
        val = (val << 6) + d;
        valb += 6;
        if (valb >= 0) { out.push_back((char)((val >> valb) & 0xFF)); valb -= 8; }
    }
    return !out.empty();
}
static void InitSplashLogo() {
    Gdiplus::GdiplusStartupInput si;
    if (Gdiplus::GdiplusStartup(&g_gdipTok, &si, nullptr) != Gdiplus::Ok) return;
    std::vector<unsigned char> png;
    if (!B64Decode(kLogoB64, png)) return;
    HGLOBAL hg = GlobalAlloc(GMEM_MOVEABLE, png.size());
    if (!hg) return;
    void* pd = GlobalLock(hg);
    if (!pd) { GlobalFree(hg); return; }
    memcpy(pd, png.data(), png.size());
    GlobalUnlock(hg);
    IStream* stm = nullptr;
    if (SUCCEEDED(CreateStreamOnHGlobal(hg, TRUE, &stm)))
        g_logoBmp = Gdiplus::Bitmap::FromStream(stm);   // потік звільняється разом з Bitmap
    else
        GlobalFree(hg);
    // ФІКС «лого з'являється із затримкою»: GDI+ декодує PNG ЛІНИВО при першому
    // малюванні, тому перший кадр сплеша міг виходити без іконки. Примусово
    // декодуємо ВСЕ зображення прямо тут (offscreen того самого розміру),
    // щоб сплеш мав іконку вже на ПЕРШОМУ кадрі — разом із фоном і назвою.
    if (g_logoBmp) {
        const UINT lw = g_logoBmp->GetWidth(), lh = g_logoBmp->GetHeight();
        if (lw > 0 && lh > 0) {
            Gdiplus::Bitmap warm(lw, lh, PixelFormat32bppARGB);
            Gdiplus::Graphics gw(&warm);
            gw.DrawImage(g_logoBmp, 0, 0, (INT)lw, (INT)lh);   // малюнок 1-в-1 -> повне декодування зараз
        }
    }
}

// ------------------------------------------------- конвертації рядків
static std::wstring Utf8ToWide(const std::string& s) {
    if (s.empty()) return std::wstring();
    int n = MultiByteToWideChar(CP_UTF8, 0, s.data(), (int)s.size(), nullptr, 0);
    std::wstring w((size_t)n, L'\0');
    MultiByteToWideChar(CP_UTF8, 0, s.data(), (int)s.size(), &w[0], n);
    return w;
}
static std::string WideToUtf8(const std::wstring& w) {
    if (w.empty()) return std::string();
    int n = WideCharToMultiByte(CP_UTF8, 0, w.data(), (int)w.size(), nullptr, 0, nullptr, nullptr);
    std::string s((size_t)n, '\0');
    WideCharToMultiByte(CP_UTF8, 0, w.data(), (int)w.size(), &s[0], n, nullptr, nullptr);
    return s;
}

// ------------------------------------------------- папки даних
// %APPDATA%\FluxControl — налаштування + згенерований ui.html + DLL лоадер.
// Разова міграція зі старих %APPDATA%\FluxHelper та %APPDATA%\Blazix:
// копіюємо верхньорівневі файли (settings.json = групи/розмір вікна/сповіщення,
// ui.html, лоадер), щоб після перейменування програми нічого не загубилось.
static std::wstring DataDir() {
    PWSTR p = nullptr;
    if (FAILED(SHGetKnownFolderPath(FOLDERID_RoamingAppData, 0, nullptr, &p)))
        return std::wstring(L".");
    std::wstring base = p;
    CoTaskMemFree(p);
    std::wstring d = base + L"\\FluxControl";
    CreateDirectoryW(d.c_str(), nullptr);
    static bool migrated = false;
    if (!migrated) {
        migrated = true;
        const wchar_t* oldNames[] = { L"Blazix", L"FluxHelper" };
        for (const wchar_t* on : oldNames) {
            std::wstring oldDir = base + L"\\" + on;
            if (GetFileAttributesW(oldDir.c_str()) == INVALID_FILE_ATTRIBUTES) continue;
            if (GetFileAttributesW((d + L"\\settings.json").c_str()) != INVALID_FILE_ATTRIBUTES) break;   // уже є налаштування
            WIN32_FIND_DATAW fd;
            HANDLE h = FindFirstFileW((oldDir + L"\\*").c_str(), &fd);
            if (h != INVALID_HANDLE_VALUE) {
                do {
                    if (fd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) continue;   // WebView2-кеш починає з нуля
                    CopyFileW((oldDir + L"\\" + fd.cFileName).c_str(),
                              (d + L"\\" + fd.cFileName).c_str(), TRUE);
                } while (FindNextFileW(h, &fd));
                FindClose(h);
            }
            break;
        }
    }
    return d;
}
// %APPDATA%\FluxControl\WebView2 — кеш браузерного рушія (усе в одному місці)
static std::wstring CacheDir() {
    std::wstring d = DataDir() + L"\\WebView2";
    CreateDirectoryW(d.c_str(), nullptr);
    return d;
}

// ------------------------------------------------- налаштування (settings.json)
static bool CfgValid(const AppCfg& c) {
    return (c.ang == 1 || c.ang == 2) && (c.nim == 1 || c.nim == 2) &&
           (c.ukr == 1 || c.ukr == 2) && (c.inf == 1 || c.inf == 2) &&
           (c.trud == 1 || c.trud == 2);
}

static void LoadAllCfg() {
    HANDLE f = CreateFileW((DataDir() + L"\\settings.json").c_str(),
                           GENERIC_READ, FILE_SHARE_READ, nullptr, OPEN_EXISTING, 0, nullptr);
    if (f == INVALID_HANDLE_VALUE) return;
    char buf[1024] = {};
    DWORD rd = 0;
    ReadFile(f, buf, sizeof(buf) - 1, &rd, nullptr);
    CloseHandle(f);
    auto get = [&](const char* key, int def) -> int {
        const char* p = strstr(buf, key);
        if (!p) return def;
        p = strchr(p + strlen(key), ':');
        if (!p) return def;
        return atoi(p + 1);
    };
    g_cfg.ang  = get("\"ang\"", 0);
    g_cfg.nim  = get("\"nim\"", 0);
    g_cfg.ukr  = get("\"ukr\"", 0);
    g_cfg.inf  = get("\"inf\"", 0);
    g_cfg.trud = get("\"trud\"", 0);
    g_cfg.w    = get("\"w\"", 0);
    g_cfg.h    = get("\"h\"", 0);
    int nf = get("\"notif\"", 1);
    g_cfg.notif = (nf == 0) ? 0 : 1;
    int nm = get("\"notifmin\"", 5);
    g_cfg.notifmin = (nm >= 1 && nm <= 15) ? nm : 5;
    g_cfg.ver = get("\"v\"", 0);   // старі версії не писали "v" -> мігруємо без змін ключів
}

static void SaveAllCfg() {
    char j[512];
    snprintf(j, sizeof(j),
             "{\"ang\":%d,\"nim\":%d,\"ukr\":%d,\"inf\":%d,\"trud\":%d,"
             "\"w\":%d,\"h\":%d,\"notif\":%d,\"notifmin\":%d,\"v\":3}",
             g_cfg.ang, g_cfg.nim, g_cfg.ukr, g_cfg.inf, g_cfg.trud,
             g_cfg.w, g_cfg.h, g_cfg.notif, g_cfg.notifmin);
    HANDLE f = CreateFileW((DataDir() + L"\\settings.json").c_str(),
                           GENERIC_WRITE, 0, nullptr, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, nullptr);
    if (f == INVALID_HANDLE_VALUE) return;
    DWORD w = 0;
    WriteFile(f, j, (DWORD)strlen(j), &w, nullptr);
    CloseHandle(f);
}

// запам'ятовуємо розмір вікна, який поставив користувач
static void SaveWindowSize() {
    if (!g_hwnd) return;
    RECT rc;
    GetWindowRect(g_hwnd, &rc);
    int w = rc.right - rc.left, h = rc.bottom - rc.top;
    if (w < 200 || h < 150) return;   // згорнуте вікно — не зберігаємо
    g_cfg.w = w; g_cfg.h = h;
    SaveAllCfg();
}

// копіювання тексту (форматування уроку з інтерфейсу) в буфер обміну Windows
static void CopyToClipboard(const std::wstring& text) {
    if (!OpenClipboard(g_hwnd)) return;
    EmptyClipboard();
    const SIZE_T bytes = (text.size() + 1) * sizeof(wchar_t);
    HGLOBAL g = GlobalAlloc(GMEM_MOVEABLE, bytes);
    if (g) {
        void* p = GlobalLock(g);
        if (p) { memcpy(p, text.c_str(), bytes); GlobalUnlock(g); }
        if (SetClipboardData(CF_UNICODETEXT, g) == nullptr) GlobalFree(g);
    }
    CloseClipboard();
}

// ------------------------------------------------- сповіщення про початок уроку
// Інтерфейс надсилає fh:notif|{"on":true,"min":5,"items":[{"dow":1,"t":"08:30","n":"Алгебра"},...]}
// Розклад тримаємо в пам'яті й раз на 15 с перевіряємо, чи не починається урок.
static void ParseNotif(const std::wstring& j) {
    size_t p = j.find(L"\"on\":");
    if (p != std::wstring::npos)
        g_cfg.notif = (j.compare(p + 5, 4, L"true") == 0) ? 1 : 0;
    p = j.find(L"\"min\":");
    if (p != std::wstring::npos) {
        int v = _wtoi(j.c_str() + p + 6);
        if (v >= 1 && v <= 15) g_cfg.notifmin = v;
    }
    g_sched.clear();
    p = j.find(L"\"items\":");
    if (p == std::wstring::npos) return;
    std::wstring s = j.substr(p);
    size_t q = 0;
    while ((q = s.find(L"\"dow\":", q)) != std::wstring::npos) {
        NItem it;
        it.dow = _wtoi(s.c_str() + q + 6);
        size_t t1 = s.find(L"\"t\":\"", q);
        if (t1 != std::wstring::npos) {
            int h = 0, m2 = 0;
            if (swscanf(s.c_str() + t1 + 5, L"%d:%d", &h, &m2) == 2) it.startMin = h * 60 + m2;
        }
        size_t n1 = s.find(L"\"n\":\"", q);
        if (n1 != std::wstring::npos) {
            std::wstring nm;
            const wchar_t* r = s.c_str() + n1 + 5;
            while (*r && *r != L'"') { nm += *r; ++r; }
            it.name = WideToUtf8(nm);
        }
        if (it.dow >= 1 && it.dow <= 7 && it.startMin > 0) g_sched.push_back(it);
        q += 6;
    }
}

static void ShowBalloon(const std::wstring& title, const std::wstring& text) {
    if (!g_hwnd) return;
    NOTIFYICONDATAW nid = {};
    nid.cbSize = sizeof(nid);
    nid.hWnd = g_hwnd;
    nid.uID = 1;
    nid.uFlags = NIF_INFO;
    wcsncpy(nid.szInfoTitle, title.c_str(), 63);
    wcsncpy(nid.szInfo, text.c_str(), 255);
    nid.dwInfoFlags = NIIF_INFO;
    Shell_NotifyIconW(NIM_MODIFY, &nid);
}

static void CheckNotifs() {
    if (!g_cfg.notif || g_sched.empty() || !g_hwnd) return;
    SYSTEMTIME st;
    GetLocalTime(&st);
    if (st.wDayOfWeek < 1 || st.wDayOfWeek > 5) return;
    int nowM = st.wHour * 60 + st.wMinute;
    long long dayKey = (long long)st.wYear * 10000 + st.wMonth * 100 + st.wDay;
    for (size_t i = 0; i < g_sched.size(); ++i) {
        const NItem& it = g_sched[i];
        if (it.dow != (int)st.wDayOfWeek) continue;
        int delta = it.startMin - nowM;
        if (delta >= 0 && delta <= g_cfg.notifmin) {
            long long key = dayKey * 1000 + (long long)i;
            if (key == g_notifKey) return;
            g_notifKey = key;
            std::wstring nm = Utf8ToWide(it.name);
            wchar_t msg[300];
            swprintf(msg, 300, L"🔔 %s\nпочаток о %02d:%02d — через %d хв",
                     nm.c_str(), it.startMin / 60, it.startMin % 60, g_cfg.notifmin);
            ShowBalloon(L"Скоро почнеться урок", msg);
            return;
        }
    }
}

static void AddTray() {
    if (!g_hwnd) return;
    g_nid.cbSize = sizeof(g_nid);
    g_nid.hWnd = g_hwnd;
    g_nid.uID = 1;
    g_nid.uFlags = NIF_MESSAGE | NIF_ICON | NIF_TIP;
    g_nid.uCallbackMessage = WM_APP + 1;
    g_nid.hIcon = LoadIconW(GetModuleHandleW(nullptr), MAKEINTRESOURCEW(1));
    wcsncpy(g_nid.szTip, L"FluxHelper", 63);
    Shell_NotifyIconW(NIM_ADD, &g_nid);
}

// ------------------------------------------------- збірка HTML
static void ReplaceFirst(std::string& s, const std::string& from, const std::string& to) {
    size_t p = s.find(from);
    if (p != std::string::npos) s.replace(p, from.size(), to);
}
static void ReplaceAll(std::string& s, const std::string& from, const std::string& to) {
    if (from.empty()) return;
    size_t p = 0;
    while ((p = s.find(from, p)) != std::string::npos) {
        s.replace(p, from.size(), to);
        p += to.size();
    }
}
static std::string BuildUiHtml() {
    std::string tpl = kUiHtmlDesktop;
    // ГОЛОВНИЙ ФІКС «іконки немає вгорі»: плейсхолдер логотипа зустрічається у
    // HTML КІЛЬКА разів (статичний <img> у титульній панелі + <img> сплеша +
    // const LOGO у JS). Колишній ReplaceFirst підставляв base64 ЛИШЕ В ПЕРШЕ
    // входження -> сплеш мав іконку, а решта (лого у шапці, вікна помилок)
    // залишались з буквальним "__LOGO_B64__" = биті картинки. Замінюємо ВСЕ.
    ReplaceAll(tpl, "__LOGO_B64__", kLogoB64);
    ReplaceAll(tpl, "__APP_VER__", FH_VER_STR);   // APP_VER в JS + футери = версія з version.h
    char buf[128];
    if (CfgValid(g_cfg))
        snprintf(buf, sizeof(buf), "{\"ang\":%d,\"nim\":%d,\"ukr\":%d,\"inf\":%d,\"trud\":%d}",
                 g_cfg.ang, g_cfg.nim, g_cfg.ukr, g_cfg.inf, g_cfg.trud);
    else
        snprintf(buf, sizeof(buf), "null");
    ReplaceFirst(tpl, "__SETTINGS_JSON__", buf);
    return tpl;
}

static bool WriteUiFile(const std::string& html, std::wstring& outPath) {
    std::wstring path = DataDir() + L"\\ui.html";
    HANDLE f = CreateFileW(path.c_str(), GENERIC_WRITE, 0, nullptr,
                           CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, nullptr);
    if (f == INVALID_HANDLE_VALUE) return false;
    DWORD w = 0;
    WriteFile(f, html.data(), (DWORD)html.size(), &w, nullptr);
    CloseHandle(f);
    outPath = path;
    return true;
}

// Правильний file:///URL: зворотні слеші -> прямі, двокрапку літери диска НЕ кодуємо.
// (Колишнє кодування давало file:///C%3A%5CUsers%5C... -> ERR_INVALID_URL у Chromium)
static std::wstring FileUrl(const std::wstring& path) {
    std::string u8 = WideToUtf8(path);
    std::string out = "file:///";
    char b[8];
    for (unsigned char c : u8) {
        if (c == '\\') { out += '/'; continue; }          // C:\Users -> C:/Users
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') ||
            c == '/' || c == ':' ||                        // літера диска (C:)
            c == '-' || c == '_' || c == '.' || c == '~' || c == '!')
            out += (char)c;
        else { snprintf(b, sizeof(b), "%%%02X", (unsigned)c); out += b; }  // пробіли/кирилиця -> %XX
    }
    return Utf8ToWide(out);
}

// ================================================== автооновлення (PC)
// Інтерфейс надсилає  fh:update|{"v":"1.5.4","repo":"user/FluxHelper"}.
// 1) Качаємо НОВИЙ exe з GitHub (versions/<v>/FluxControl.exe, запасний варіант —
//    старе ім'я FluxHelper.exe) ПРЯМО В ПАПКУ, ДЕ ЛЕЖИТЬ ЗАПУЩЕНИЙ exe —
//    щоб після оновлення програма лишилась на тому самому місці (стіл тощо).
// 2) ПЕРЕВІРЯЄМО, що завантажений файл — справді потрібна версія (у VERSIONINFO
//    всередині exe рядок версії лежить у UTF-16). Раніше саме несвіжий файл у
//    versions/<v> спричиняв «скачує ту саму версію» — тепер таке ловиться.
// 3) Заміна «на гарячому» БЕЗ .bat: працюючий exe перейменовується у
//    FluxControl.old.tmp.exe (Windows дозволяє перейменувати запущений файл),
//    FluxControl.new.exe стає FluxControl.exe -> запуск нової версії -> вихід.
//    Старий .bat-механізм часом мовчки падав (файл заблокований антивірусом
//    або OneDrive) — тоді версія залишалась старою і з'являвся зайвий «термінал».
// Прогрес -> вікно через WM_APP+3/+4/+5 (з потоку можна лише PostMessage).

static const UINT WM_UPD_PROG = WM_APP + 3;   // wp = 0..100
static const UINT WM_UPD_ERR  = WM_APP + 4;   // lp = new std::wstring
static const UINT WM_UPD_DONE = WM_APP + 5;   // завантажено, запускаємо

static void UpdPostErr(const wchar_t* msg) {
    PostMessageW(g_hwnd, WM_UPD_ERR, 0, (LPARAM)(void*)new std::wstring(msg));
}

// повний шлях до поточного exe
static std::wstring ExePath() {
    wchar_t buf[MAX_PATH] = {};
    GetModuleFileNameW(nullptr, buf, MAX_PATH);
    return std::wstring(buf);
}

// папка, де лежить поточний exe (оновлення ставиться поруч, а не в %TEMP%)
static std::wstring ExeDirUpd() {
    std::wstring p = ExePath();
    size_t s = p.find_last_of(L"\\/");
    return (s == std::wstring::npos) ? std::wstring(L".") : p.substr(0, s);
}

// Заміна exe «на гарячому»: запущений exe НЕ вдасться видалити, але МОЖНА
// перейменувати. 1) <self> -> FluxHelper.old.tmp.exe (процес далі працює),
// 2) FluxHelper.new.exe -> <self> (нова версія стає на місце старої,
//    під ЯКИМ ІМ'ЯМ програма була запущена — під таким і лишається).
// Невдала спроба -> відкат. Це надійніше за .bat: не залежить від кодових
// сторінок cmd, антивірусів і OneDrive, не показує вікон консолі.
static bool InstallUpdateFiles(const std::wstring& exePath) {
    size_t s = exePath.find_last_of(L"\\/");
    if (s == std::wstring::npos) return false;
    const std::wstring dir = exePath.substr(0, s);
    const std::wstring oldP = dir + L"\\FluxHelper.old.tmp.exe";
    const std::wstring newP = dir + L"\\FluxHelper.new.exe";
    DeleteFileW(oldP.c_str());   // залишок давнішого оновлення (якщо зараз не зайнятий)
    for (int attempt = 0; attempt < 3; ++attempt) {
        if (MoveFileExW(exePath.c_str(), oldP.c_str(), MOVEFILE_REPLACE_EXISTING)) {
            if (MoveFileExW(newP.c_str(), exePath.c_str(), MOVEFILE_REPLACE_EXISTING))
                return true;
            MoveFileExW(oldP.c_str(), exePath.c_str(), MOVEFILE_REPLACE_EXISTING);   // відкат
        }
        Sleep(400);
    }
    return false;
}

// Стартова чистка: залишки старих оновлень і давні назви exe (Blazix/FluxHelper).
// Файл, з якого зараз працює процес, і тимчасово зайняті — пропускаються мовчки
// (спроба повториться при наступному запуску й у таймері WM_TIMER(2)).
static void CleanupOldFiles() {
    const std::wstring dir = ExeDirUpd();
    const std::wstring self = ExePath();
    const wchar_t* junk[] = {
        L"\\fh_upd.bat", L"\\FluxControl.new.exe", L"\\FluxControl.old.tmp.exe",
        L"\\FluxHelper.new.exe", L"\\FluxHelper.old.tmp.exe",
        L"\\Blazix.exe", L"\\FluxControl.exe", nullptr };
    for (int i = 0; junk[i]; ++i) {
        std::wstring p = dir + junk[i];
        if (_wcsicmp(p.c_str(), self.c_str()) == 0) continue;   // це ми самі — не чіпаємо
        DeleteFileW(p.c_str());   // зайнятий іншим процесом -> спробуємо пізніше
    }
}

static bool ReadFileBin(const std::wstring& path, std::vector<unsigned char>& out) {
    HANDLE f = CreateFileW(path.c_str(), GENERIC_READ, FILE_SHARE_READ, nullptr,
                           OPEN_EXISTING, 0, nullptr);
    if (f == INVALID_HANDLE_VALUE) return false;
    out.clear();
    char buf[65536];
    DWORD rd = 0;
    for (;;) {
        if (!ReadFile(f, buf, sizeof(buf), &rd, nullptr) || !rd) break;
        out.insert(out.end(), buf, buf + rd);
        if (out.size() > 200u * 1024 * 1024) break;
    }
    CloseHandle(f);
    return !out.empty();
}

// чи є в бінарних даних рядок у UTF-16LE (так VERSIONINFO зберігає версію)
static bool MemHasUtf16(const std::vector<unsigned char>& data, const std::wstring& s) {
    if (s.empty() || data.empty()) return false;
    std::vector<unsigned char> pat;
    pat.reserve(s.size() * 2);
    for (wchar_t c : s) {
        pat.push_back((unsigned char)(c & 0xFF));
        pat.push_back((unsigned char)(((unsigned)c) >> 8));
    }
    if (data.size() < pat.size()) return false;
    const unsigned char* d = data.data();
    for (size_t i = 0; i + pat.size() <= data.size(); ++i)
        if (d[i] == pat[0] && memcmp(d + i, pat.data(), pat.size()) == 0) return true;
    return false;
}

// (старий скрипт fh_upd.bat видалено — заміна файлів тепер у InstallUpdateFiles вище)

// 0 = ок; інакше HTTP-код або -1 (мережа) / -2 (диск). Прогрес -> WM_UPD_PROG.
static int HttpDownloadTo(const std::wstring& url, const std::wstring& dst) {
    wchar_t host[256] = {}, path[1024] = {};
    URL_COMPONENTSW uc{};
    uc.dwStructSize = sizeof(uc);
    uc.lpszHostName = host;  uc.dwHostNameLength = 255;
    uc.lpszUrlPath  = path;  uc.dwUrlPathLength  = 1023;
    if (!WinHttpCrackUrl(url.c_str(), (DWORD)url.size(), 0, &uc)) return -1;

    HINTERNET ses = WinHttpOpen(L"FluxHelper-Updater", WINHTTP_ACCESS_TYPE_DEFAULT_PROXY,
                                WINHTTP_NO_PROXY_NAME, WINHTTP_NO_PROXY_BYPASS, 0);
    if (!ses) return -1;
    DWORD redir = WINHTTP_OPTION_REDIRECT_POLICY_ALWAYS;
    WinHttpSetOption(ses, WINHTTP_OPTION_REDIRECT_POLICY, &redir, sizeof(redir));

    HINTERNET con = WinHttpConnect(ses, host, uc.nPort, 0);
    HINTERNET req = con ? WinHttpOpenRequest(con, L"GET", path, nullptr, WINHTTP_NO_REFERER,
                          WINHTTP_DEFAULT_ACCEPT_TYPES,
                          (uc.nScheme == INTERNET_SCHEME_HTTPS) ? WINHTTP_FLAG_SECURE : 0) : nullptr;
    bool sent = false;
    if (req) sent = WinHttpSendRequest(req, WINHTTP_NO_ADDITIONAL_HEADERS, 0,
                                       WINHTTP_NO_REQUEST_DATA, 0, 0, 0)
                  && WinHttpReceiveResponse(req, nullptr);
    int res = -1;
    DWORD status = 0, sz = sizeof(status);
    if (sent && WinHttpQueryHeaders(req, WINHTTP_QUERY_STATUS_CODE | WINHTTP_QUERY_FLAG_NUMBER,
                                    WINHTTP_HEADER_NAME_BY_INDEX, &status, &sz, WINHTTP_NO_HEADER_INDEX)) {
        if (status != 200) {
            res = (int)status;
        } else {
            HANDLE f = CreateFileW(dst.c_str(), GENERIC_WRITE, 0, nullptr, CREATE_ALWAYS,
                                   FILE_ATTRIBUTE_NORMAL, nullptr);
            if (f == INVALID_HANDLE_VALUE) {
                res = -2;
            } else {
                DWORD total = 0; sz = sizeof(total);
                WinHttpQueryHeaders(req, WINHTTP_QUERY_CONTENT_LENGTH | WINHTTP_QUERY_FLAG_NUMBER,
                                    WINHTTP_HEADER_NAME_BY_INDEX, &total, &sz, WINHTTP_NO_HEADER_INDEX);
                DWORD got = 0, lastPct = -1;
                bool ok = true;
                for (;;) {
                    DWORD avail = 0;
                    if (!WinHttpQueryDataAvailable(req, &avail)) { ok = false; break; }
                    if (!avail) break;
                    std::vector<char> buf(avail);
                    DWORD rd = 0;
                    if (!WinHttpReadData(req, buf.data(), avail, &rd) || !rd) { ok = false; break; }
                    DWORD wr = 0;
                    if (!WriteFile(f, buf.data(), rd, &wr, nullptr) || wr != rd) { ok = false; break; }
                    got += rd;
                    if (total > 0) {
                        DWORD pct = (DWORD)((unsigned long long)got * 100 / total);
                        if (pct != lastPct) { lastPct = pct; PostMessageW(g_hwnd, WM_UPD_PROG, pct, 0); }
                    }
                }
                CloseHandle(f);
                if (!ok || got < 100000) {           // надто маленький файл = явно не exe
                    DeleteFileW(dst.c_str());
                    res = ok ? -3 : -1;
                } else {
                    res = 0;
                }
            }
        }
    }
    if (req) WinHttpCloseHandle(req);
    if (con) WinHttpCloseHandle(con);
    WinHttpCloseHandle(ses);
    return res;
}

struct UpdParams { std::wstring ver, repo; };

static void UpdateThreadMain(UpdParams p) {
    const std::wstring base = L"https://raw.githubusercontent.com/" + p.repo
                            + L"/main/versions/" + p.ver + L"/";
    // качаємо в папку запущеного exe (стіл тощо) — після оновлення файл лишається на місці
    const std::wstring dst = ExeDirUpd() + L"\\FluxHelper.new.exe";

    // 1.7.1+: канонічне ім'я — FluxHelper.exe; далі старі назви для давніх версій
    int st = HttpDownloadTo(base + L"FluxHelper.exe", dst);
    if (st == 404) st = HttpDownloadTo(base + L"FluxControl.exe", dst);   // 1.5.3..1.7.0
    if (st == 404) st = HttpDownloadTo(base + L"Blazix.exe", dst);        // ім'я 1.5.4
    if (st != 0) {
        if (st == 404)     UpdPostErr(L"версію не знайдено на GitHub (404)");
        else if (st == -2) UpdPostErr(L"не вдалося зберегти файл поруч із програмою (папка без прав запису?)");
        else               UpdPostErr(L"немає з'єднання з GitHub — перевір інтернет");
        return;
    }

    // ПЕРЕВІРКА ВЕРСІЇ всередині завантаженого файлу: страховка від несвіжого
    // білда в versions/<v> (саме це колись давало «скачує ту саму версію»)
    {
        std::vector<unsigned char> data;
        if (!ReadFileBin(dst, data) || data.size() < 100000 ||
            !MemHasUtf16(data, p.ver)) {
            DeleteFileW(dst.c_str());
            UpdPostErr(L"файл оновлення на сервері пошкоджений або стара версія — спробуй пізніше");
            return;
        }
    }

    // заміна файлів «на гарячому»: працюючий exe перейменовується, новий стає на його місце
    const std::wstring exePath = ExePath();
    PostMessageW(g_hwnd, WM_UPD_PROG, 100, 0);
    Sleep(250);                        // даємо JS показати «встановлення…»
    if (!InstallUpdateFiles(exePath)) {
        DeleteFileW(dst.c_str());
        UpdPostErr(L"не вдалося замінити файл — закрий інші копії програми й спробуй ще раз");
        return;
    }

    PostMessageW(g_hwnd, WM_UPD_DONE, 0, 0);
    Sleep(700);                        // даємо JS показати «застосунок зараз перезапуститься»
    // запускаємо НОВУ версію (вона вже на місці старого exe) і виходимо
    STARTUPINFOW si{};
    si.cb = sizeof(si);
    PROCESS_INFORMATION pi{};
    if (CreateProcessW(exePath.c_str(), nullptr, nullptr, nullptr, FALSE,
                       0, nullptr, nullptr, &si, &pi)) {
        CloseHandle(pi.hThread); CloseHandle(pi.hProcess);
        Sleep(250);
        PostMessageW(g_hwnd, WM_CLOSE, 0, 0);   // вихід -> нова версія вже працює
    } else {
        UpdPostErr(L"нова версія встановлена — запусти програму ще раз");
    }
}

// виклик JS з головного потоку (для прогресу завантаження)
static void UiScript(const std::wstring& js) {
    if (g_web) g_web->ExecuteScript(js.c_str(), nullptr);
}

// ------------------------------------------------- COM-база для обробників
template <class T, const IID& IID_T>
struct ComImpl : T {
    ULONG m_ref = 1;
    virtual ~ComImpl() {}
    STDMETHODIMP QueryInterface(REFIID riid, void** ppv) override {
        if (!ppv) return E_POINTER;
        *ppv = nullptr;
        if (riid == IID_T || riid == kIID_IUnknown) {
            *ppv = static_cast<T*>(this);
            AddRef();
            return S_OK;
        }
        return E_NOINTERFACE;
    }
    STDMETHODIMP_(ULONG) AddRef()  override { return ++m_ref; }
    STDMETHODIMP_(ULONG) Release() override {
        ULONG r = --m_ref;
        if (r == 0) delete this;
        return r;
    }
};

struct CtrlHandler;

// Середовище створено -> створюємо контролер (тіло — після CtrlHandler)
struct EnvHandler : ComImpl<ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler, kIID_EnvironmentHandler> {
    STDMETHODIMP Invoke(HRESULT err, ICoreWebView2Environment* env) override;
};

// Клік по посиланню -> відкриваємо у браузері за замовчуванням (Zoom запуститься сам)
struct NewWindowHandler : ComImpl<ICoreWebView2NewWindowRequestedEventHandler, kIID_NewWindowHandler> {
    STDMETHODIMP Invoke(ICoreWebView2*, ICoreWebView2NewWindowRequestedEventArgs* args) override {
        if (!args) return S_OK;
        LPWSTR uri = nullptr;
        if (SUCCEEDED(args->get_Uri(&uri)) && uri) {
            ShellExecuteW(g_hwnd, L"open", uri, nullptr, nullptr, SW_SHOWNORMAL);
            CoTaskMemFree(uri);
        }
        args->put_Handled(TRUE);
        return S_OK;
    }
};

// Повідомлення з інтерфейсу: кнопки заголовка, перетягування, збереження груп
struct MsgHandler : ComImpl<ICoreWebView2WebMessageReceivedEventHandler, IID_ICoreWebView2WebMessageReceivedEventHandler> {
    STDMETHODIMP Invoke(ICoreWebView2*, ICoreWebView2WebMessageReceivedEventArgs* args) override {
        if (!args) return S_OK;
        LPWSTR raw = nullptr;
        if (FAILED(args->TryGetWebMessageAsString(&raw)) || !raw) return S_OK;
        std::wstring m(raw);
        CoTaskMemFree(raw);
        if      (m == L"fh:min")   ShowWindow(g_hwnd, SW_MINIMIZE);
        else if (m == L"fh:close") DestroyWindow(g_hwnd);
        else if (m == L"fh:drag") {
            // перетягування за власну титульну панель
            ReleaseCapture();
            SendMessageW(g_hwnd, WM_NCLBUTTONDOWN, HTCAPTION, 0);
        }
        else if (m.rfind(L"fh:join|", 0) == 0)
            ShellExecuteW(g_hwnd, L"open", m.c_str() + 8, nullptr, nullptr, SW_SHOWNORMAL);
        else if (m.rfind(L"fh:save|", 0) == 0) {
            // {"ang":1,...} — групи з інтерфейсу; решта полів settings.json зберігається
            const std::wstring j = std::wstring(m.c_str() + 8);
            auto gi = [&](const wchar_t* k) -> int {
                size_t p = j.find(k);
                if (p == std::wstring::npos) return 0;
                p = j.find(L':', p);
                if (p == std::wstring::npos) return 0;
                return _wtoi(j.c_str() + p + 1);
            };
            g_cfg.ang = gi(L"\"ang\"");   g_cfg.nim = gi(L"\"nim\"");
            g_cfg.ukr = gi(L"\"ukr\"");   g_cfg.inf = gi(L"\"inf\"");
            g_cfg.trud = gi(L"\"trud\"");
            if (CfgValid(g_cfg)) SaveAllCfg();
        }
        else if (m.rfind(L"fh:notif|", 0) == 0) {
            ParseNotif(std::wstring(m.c_str() + 9));
            SaveAllCfg();
        }
        else if (m.rfind(L"fh:copy|", 0) == 0)
            CopyToClipboard(std::wstring(m.c_str() + 8));
        else if (m.rfind(L"fh:notif-test|", 0) == 0) {
            // РЕЖИМ РОЗРОБНИКА: тестове сповіщення з інтерфейсу.
            // {"title":"...","text":"..."} -> балун Windows (як для звичайних сповіщень)
            std::wstring j(m.c_str() + 14);
            auto jv = [&](const wchar_t* key) -> std::wstring {
                size_t p = j.find(key);
                if (p == std::wstring::npos) return L"";
                p = j.find(L'"', p);
                if (p == std::wstring::npos) return L"";
                size_t e = j.find(L'"', p + 1);
                if (e == std::wstring::npos) return L"";
                return j.substr(p + 1, e - p - 1);
            };
            std::wstring ti = jv(L"\"title\""), tx = jv(L"\"text\"");
            if (ti.empty()) ti = L"Тестове сповіщення";
            if (tx.empty()) tx = L"Урок почнеться через 5 хв";
            ShowBalloon(ti, tx);
        }
        else if (m.rfind(L"fh:update|", 0) == 0) {
            // {"v":"1.5.1","repo":"user/FluxHelper"} — завантажити та встановити
            std::wstring j(m.c_str() + 10);
            auto jv = [&](const wchar_t* key) -> std::wstring {
                size_t p = j.find(key);
                if (p == std::wstring::npos) return L"";
                p = j.find(L':', p);
                if (p == std::wstring::npos) return L"";
                p = j.find(L'\"', p);
                if (p == std::wstring::npos) return L"";
                size_t e = j.find(L'\"', p + 1);
                if (e == std::wstring::npos) return L"";
                return j.substr(p + 1, e - p - 1);
            };
            std::wstring v = jv(L"\"v\""), repo = jv(L"\"repo\"");
            bool okV = (v.size() >= 5);
            for (wchar_t c : v) if (!(c == L'.' || (c >= L'0' && c <= L'9'))) okV = false;
            if (okV && repo.find(L'/') != std::wstring::npos)
                std::thread(UpdateThreadMain, UpdParams{v, repo}).detach();
            else
                UpdPostErr(L"некоректні дані оновлення");
        }
        return S_OK;
    }
};

// Страховка: якщо %APPDATA%\FluxControl\ui.html не завантажився з диска
// (антивірус, незвичний шлях) — показуємо той самий HTML напряму з пам'яті
struct NavCompletedHandler : ComImpl<ICoreWebView2NavigationCompletedEventHandler, IID_ICoreWebView2NavigationCompletedEventHandler> {
    STDMETHODIMP Invoke(ICoreWebView2* web, ICoreWebView2NavigationCompletedEventArgs* args) override {
        if (!args || !web) { g_bootDone = true; g_webShown = true; return S_OK; }
        BOOL ok = TRUE;
        if (SUCCEEDED(args->get_IsSuccess(&ok)) && !ok && !g_fallbackUsed && !g_uiHtml.empty()) {
            g_fallbackUsed = true;
            web->NavigateToString(Utf8ToWide(g_uiHtml).c_str());
            return S_OK;   // таймер поставить наступний NavigationCompleted
        }
        // сторінка завантажилась: даємо їй ~0.3 с намалювати перший кадр (разом
        // з іконкою) і ЛИШЕ ПОТІМ показуємо WebView — GDI-сплеш з іконкою
        // лишається на екрані до останнього кадру, «мигання без іконки» зникло
        SetTimer(g_hwnd, 4, 320, nullptr);
        return S_OK;
    }
};

static void UpdateBounds() {
    if (!g_ctrl || !g_hwnd) return;
    RECT rc;
    GetClientRect(g_hwnd, &rc);
    // WebView займає УСЮ клієнтську область (без рамки-пояска навколо —
    // інакше під час зміни розміру видно артефакти по краях)
    g_ctrl->put_Bounds(rc);
    LayoutEdges();   // смуги зміни розміру — поверх WebView
}

// смуги зміни розміру (визначені нижче, потрібні тут)
static void LayoutEdges();

// повторно ховаємо кольорову окантовку DWM (іноді скидається після тем/фокусу)
static void RefreshBorderColor() {
    if (g_dwmRound && g_hwnd) {
        COLORREF bc = DWMWA_COLOR_NONE;
        DwmSetWindowAttribute(g_hwnd, DWMWA_BORDER_COLOR, &bc, sizeof(bc));
    }
}

// Контролер створено -> налаштовуємо і показуємо інтерфейс
struct CtrlHandler : ComImpl<ICoreWebView2CreateCoreWebView2ControllerCompletedHandler, kIID_ControllerHandler> {
    STDMETHODIMP Invoke(HRESULT err, ICoreWebView2Controller* ctrl) override {
        if (FAILED(err) || !ctrl) {
            g_bootDone = true;
            MessageBoxW(g_hwnd,
                L"Не вдалося створити веб-переглядач (WebView2).\n"
                L"Перевір, чи встановлений Microsoft Edge WebView2 Runtime.",
                L"FluxHelper — помилка", MB_OK | MB_ICONERROR);
            return S_OK;
        }
        g_ctrl = ctrl;
        ctrl->AddRef();  // тримаємо посилання для WM_SIZE / фокуса

        ICoreWebView2* web = nullptr;
        ctrl->get_CoreWebView2(&web);
        g_web = web;
        if (web) {
            // чистий інтерфейс: без ПКМ-меню, DevTools, статус-бару, зум-контролів
            ICoreWebView2Settings* st = nullptr;
            if (SUCCEEDED(web->get_Settings(&st)) && st) {
                st->put_AreDefaultContextMenusEnabled(FALSE);  // без меню «Оновити/Друк…»
                st->put_AreDevToolsEnabled(FALSE);
                st->put_IsStatusBarEnabled(FALSE);
                st->put_IsZoomControlEnabled(FALSE);
                // вимикаємо браузерні гарячі клавіші (Ctrl+R, F5, Ctrl+P, Ctrl+F …)
                ICoreWebView2Settings4* st4 = nullptr;
                if (SUCCEEDED(st->QueryInterface(IID_ICoreWebView2Settings4, (void**)&st4)) && st4) {
                    st4->put_AreBrowserAcceleratorKeysEnabled(FALSE);
                    st4->Release();
                }
                st->Release();
            }

            EventRegistrationToken tok{};
            auto* nh = new NewWindowHandler();
            web->add_NewWindowRequested(nh, &tok);
            nh->Release();
            auto* mh = new MsgHandler();
            web->add_WebMessageReceived(mh, &tok);
            mh->Release();

            // темний фон, щоб не блимало білим при запуску
            ICoreWebView2Controller2* c2 = nullptr;
            if (SUCCEEDED(ctrl->QueryInterface(kIID_Controller2, (void**)&c2)) && c2) {
                COREWEBVIEW2_COLOR bg{};
                bg.A = 255; bg.R = 5; bg.G = 5; bg.B = 8;
                c2->put_DefaultBackgroundColor(bg);
                c2->Release();
            }

            // інтерфейс -> файл %APPDATA%\FluxControl\ui.html і навігація на нього
            g_uiHtml = BuildUiHtml();
            g_fallbackUsed = false;
            std::wstring path;
            if (WriteUiFile(g_uiHtml, path))
                web->Navigate(FileUrl(path).c_str());
            else
                web->NavigateToString(Utf8ToWide(g_uiHtml).c_str());

            // страховка на випадок невдалої навігації на файл
            auto* nch = new NavCompletedHandler();
            web->add_NavigationCompleted(nch, &tok);
            nch->Release();
        }

        UpdateBounds();
        // НЕ показуємо WebView одразу: GDI-сплеш (з іконкою) лишається на екрані,
        // поки сторінка не допишеться і не намалюється — таймер 4 покаже WebView.
        ctrl->put_IsVisible(FALSE);
        SetTimer(g_hwnd, 5, 20000, nullptr);   // страховка: якщо навігація зависла
        ctrl->MoveFocus(COREWEBVIEW2_MOVE_FOCUS_REASON_PROGRAMMATIC);
        return S_OK;
    }
};

STDMETHODIMP EnvHandler::Invoke(HRESULT err, ICoreWebView2Environment* env) {
    if (FAILED(err) || !env) {
        MessageBoxW(g_hwnd,
            L"Не вдалося ініціалізувати WebView2.\n\n"
            L"Встанови Microsoft Edge WebView2 Runtime (безкоштовно):\n"
            L"https://go.microsoft.com/fwlink/p/?LinkId=2124703",
            L"FluxHelper — помилка", MB_OK | MB_ICONERROR);
        return S_OK;
    }
    auto* h = new CtrlHandler();
    env->CreateCoreWebView2Controller(g_hwnd, h);
    h->Release();  // володіння переходить до середовища
    return S_OK;
}

// ------------------------------------------------- лоадер WebView2
// DLL вбудовано в exe як RCDATA (ресурс 101). Витягуємо й завантажуємо з
// першої доступної локації: %APPDATA%\FluxControl -> папка exe -> %LOCALAPPDATA%.
static std::wstring ExeDir() {
    wchar_t buf[MAX_PATH] = {};
    GetModuleFileNameW(nullptr, buf, MAX_PATH);
    std::wstring p(buf);
    size_t s = p.find_last_of(L"\\/");
    return (s == std::wstring::npos) ? std::wstring(L".") : p.substr(0, s);
}

static bool ExtractRcData(const std::wstring& path) {
    HRSRC rs = FindResourceW(nullptr, MAKEINTRESOURCEW(101), RT_RCDATA);
    if (!rs) return false;
    HGLOBAL hg = LoadResource(nullptr, rs);
    if (!hg) return false;
    LPVOID p = LockResource(hg);
    DWORD sz = SizeofResource(nullptr, rs);
    if (!p || !sz) return false;
    HANDLE f = CreateFileW(path.c_str(), GENERIC_WRITE, 0, nullptr,
                           CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, nullptr);
    if (f == INVALID_HANDLE_VALUE) return false;
    DWORD w = 0;
    WriteFile(f, p, sz, &w, nullptr);
    CloseHandle(f);
    return true;
}

static HMODULE PrepareLoader() {
    PWSTR lp = nullptr;
    std::wstring local;
    if (SUCCEEDED(SHGetKnownFolderPath(FOLDERID_LocalAppData, 0, nullptr, &lp))) {
        local = std::wstring(lp) + L"\\FluxControl";
        CoTaskMemFree(lp);
        CreateDirectoryW(local.c_str(), nullptr);
    }
    const std::wstring dirs[3] = { DataDir(), ExeDir(), local };
    for (const auto& d : dirs) {
        if (d.empty()) continue;
        std::wstring path = d + L"\\WebView2Loader.dll";
        HMODULE h = LoadLibraryW(path.c_str());          // вже витягнута раніше?
        if (h) return h;
        if (!ExtractRcData(path)) continue;              // витяг з ресурсів exe
        h = LoadLibraryW(path.c_str());
        if (h) return h;
    }
    return LoadLibraryW(L"WebView2Loader.dll");          // системний пошук (папка exe)
}

// ------------------------------------------------- заокруглення кутів (Win 10 fallback)
static void ApplyRounding(HWND h) {
    if (g_dwmRound || !h) return;
    if (IsZoomed(h)) { SetWindowRgn(h, nullptr, TRUE); return; }
    RECT rc;
    GetWindowRect(h, &rc);
    int w = rc.right - rc.left, hh = rc.bottom - rc.top;
    HRGN r = CreateRoundRectRgn(0, 0, w + 1, hh + 1, 18, 18);
    SetWindowRgn(h, r, TRUE);
}

// ------------------------------------------------- зміна розміру за краї
// WebView2 — дочірнє вікно, яке перехоплює мишу по всій клієнтській області,
// тому WM_NCHITTEST головного вікна по краях не спрацьовує. Рішення — 8
// ПОВНІСТЮ ПРОЗОРИХ (layered, alpha 0) дитячих вікон-смуг ПОВЕРХ WebView:
// вони невидимі, але повертають HT* з WM_NCHITTEST -> система сама тягне край.
enum { EL = 0, ER, ET, EB, ETL, ETR, EBL, EBR, ECNT };
static HWND g_edge[ECNT] = {};

static LRESULT CALLBACK EdgeProc(HWND h, UINT m, WPARAM wp, LPARAM lp) {
    switch (m) {
    case WM_NCHITTEST: {
        switch (GetWindowLongPtrW(h, GWLP_USERDATA)) {
        case EL:  return HTLEFT;
        case ER:  return HTRIGHT;
        case ET:  return HTTOP;
        case EB:  return HTBOTTOM;
        case ETL: return HTTOPLEFT;
        case ETR: return HTTOPRIGHT;
        case EBL: return HTBOTTOMLEFT;
        case EBR: return HTBOTTOMRIGHT;
        }
        return HTCLIENT;
    }
    case WM_ERASEBKGND:
        return 1;                       // прозорі, нічого не малюємо
    case WM_PAINT: {
        PAINTSTRUCT ps;
        BeginPaint(h, &ps);
        EndPaint(h, &ps);
        return 0;
    }
    }
    return DefWindowProcW(h, m, wp, lp);
}

static void CreateEdges(HINSTANCE inst) {
    WNDCLASSEXW wc{};
    wc.cbSize = sizeof(wc);
    wc.lpfnWndProc = EdgeProc;
    wc.hInstance = inst;
    wc.hCursor = nullptr;
    wc.lpszClassName = L"FluxControlEdge";
    RegisterClassExW(&wc);
    for (int i = 0; i < ECNT; ++i) {
        g_edge[i] = CreateWindowExW(WS_EX_LAYERED, wc.lpszClassName, nullptr,
                                    WS_CHILD, 0, 0, 1, 1, g_hwnd, nullptr, inst, nullptr);
        if (g_edge[i]) {
            SetLayeredWindowAttributes(g_edge[i], 0, 0, LWA_ALPHA);   // alpha 0 = невидимі
            SetWindowLongPtrW(g_edge[i], GWLP_USERDATA, (LONG_PTR)i);
        }
    }
}

// розкладаємо смуги по краях і тримаємо їх ПОВЕРХ вікна WebView2
static void LayoutEdges() {
    if (!g_hwnd) return;
    RECT rc;
    GetClientRect(g_hwnd, &rc);
    int cw = rc.right - rc.left, ch = rc.bottom - rc.top;
    if (IsZoomed(g_hwnd) || cw < 80 || ch < 60) {
        for (int i = 0; i < ECNT; ++i)
            if (g_edge[i]) ShowWindow(g_edge[i], SW_HIDE);
        return;
    }
    const int e = g_bezel;
    const int c = e * 2 + 2;            // кутові зони трохи більші
    struct ER_ { int id, x, y, w, h; };
    const ER_ r[ECNT] = {
        { EL,  0,     c,     e, ch - 2 * c },   // лівий край
        { ER,  cw - e, c,    e, ch - 2 * c },   // правий край
        { ET,  c,     0,     cw - 2 * c, e },   // верх
        { EB,  c,     ch - e, cw - 2 * c, e },  // низ
        { ETL, 0,     0,     c, c }, { ETR, cw - c, 0,     c, c },
        { EBL, 0,     ch - c, c, c }, { EBR, cw - c, ch - c, c, c }
    };
    for (int i = 0; i < ECNT; ++i) {
        if (!g_edge[i]) continue;
        SetWindowPos(g_edge[i], HWND_TOP, r[i].x, r[i].y, r[i].w, r[i].h,
                     SWP_NOACTIVATE | SWP_SHOWWINDOW);
    }
}

// ------------------------------------------------- екран завантаження (GDI)
// Малюється, поки WebView2 ініціалізується. Виглядає ТОЧНО ЯК HTML-екран
// завантаження (той самий фон, логотип 92px, назва, смуга 198x5) — тому
// для користувача це ОДИН екран завантаження, а не два.
static void DrawSplash(HDC dc, const RECT& rc) {
    int w = rc.right - rc.left, hh = rc.bottom - rc.top;
    if (w <= 0 || hh <= 0) return;
    HDC mem = CreateCompatibleDC(dc);
    HBITMAP bmp = CreateCompatibleBitmap(dc, w, hh);
    HGDIOBJ ob = SelectObject(mem, bmp);
    HBRUSH bg = CreateSolidBrush(RGB(5, 5, 8));
    RECT full = { 0, 0, w, hh };
    FillRect(mem, &full, bg);
    DeleteObject(bg);

    const double k = (double)g_dpi / 96.0;
    const int logoSz = (int)(92 * k);
    const int bw = (int)(198 * k), bh = (int)(5 * k);
    // приблизно та ж вертикальна компоновка, що у flex-колонки #boot:
    // логотип 92 + gap 15 + назва 24 + gap 19 + смуга 5 + gap 15 + підпис 13
    const int total = (int)(183 * k);
    int y = (hh - total) / 2; if (y < (int)(8 * k)) y = (int)(8 * k);
    const int cx = w / 2;
    if (g_logoBmp) {
        // оригінальна іконка автора (PNG з прозорими кутами)
        Gdiplus::Graphics gfx(mem);
        gfx.SetInterpolationMode(Gdiplus::InterpolationModeHighQualityBicubic);
        Gdiplus::Rect dst(cx - logoSz / 2, y, logoSz, logoSz);
        gfx.DrawImage(g_logoBmp, dst);
    }

    int y2 = y + logoSz + (int)(15 * k);
    SetBkMode(mem, TRANSPARENT);
    SetTextColor(mem, RGB(255, 255, 255));
    HFONT f2 = CreateFontW(-(int)MulDiv(20, g_dpi, 96), 0, 0, 0, FW_BOLD, 0, 0, 0, DEFAULT_CHARSET,
                           OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                           DEFAULT_PITCH, L"Segoe UI");
    HGDIOBJ of2 = SelectObject(mem, f2);
    RECT tr2 = { 0, y2, w, y2 + (int)(26 * k) };
    DrawTextW(mem, L"FluxHelper", -1, &tr2, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
    SelectObject(mem, of2);
    DeleteObject(f2);

    const int by = y2 + (int)(26 * k) + (int)(19 * k);
    HBRUSH bb = CreateSolidBrush(RGB(28, 28, 36));   // rgba(255,255,255,.09) на #050508
    RECT bar = { cx - bw / 2, by, cx + bw / 2, by + bh };
    FillRect(mem, &bar, bb);
    DeleteObject(bb);
    const int seg = (int)(64 * k);
    const int period = bw + seg;
    int sx = (g_splashTick * 3) % period;
    int x0 = cx - bw / 2 + sx - seg;
    int x1 = cx - bw / 2 + sx;
    if (x0 < cx - bw / 2) x0 = cx - bw / 2;
    if (x1 > cx + bw / 2) x1 = cx + bw / 2;
    if (x1 > x0) {
        HBRUSH sb = CreateSolidBrush(RGB(139, 92, 246));
        RECT sr = { x0, by, x1, by + bh };
        FillRect(mem, &sr, sb);
        DeleteObject(sb);
    }

    BitBlt(dc, 0, 0, w, hh, mem, 0, 0, SRCCOPY);
    SelectObject(mem, ob);
    DeleteObject(bmp);
    DeleteDC(mem);
}

// ------------------------------------------------- вікно
static LRESULT CALLBACK WndProc(HWND h, UINT m, WPARAM wp, LPARAM lp) {
    switch (m) {
    case WM_GETMINMAXINFO: {
        MINMAXINFO* mmi = (MINMAXINFO*)lp;
        mmi->ptMinTrackSize.x = MulDiv(640, g_dpi, 96);
        mmi->ptMinTrackSize.y = MulDiv(440, g_dpi, 96);
        return 0;
    }
    case WM_NCCALCSIZE:
        // прибираємо стандартну рамку/заголовок: клієнтська область = усе вікно
        if (!wp) break;
        if (IsZoomed(h)) {
            int pad = GetSystemMetrics(SM_CXFRAME) + GetSystemMetrics(SM_CXPADDEDBORDER);
            RECT* r = (RECT*)lp;
            r->left += pad; r->top += pad; r->right -= pad; r->bottom -= pad;
        }
        return 0;
    case WM_NCHITTEST: {
        // тонка рамка навколо WebView -> зміна розміру перетягуванням країв
        if (IsZoomed(h)) break;
        POINT pt = { GET_X_LPARAM(lp), GET_Y_LPARAM(lp) };
        RECT rc;
        GetWindowRect(h, &rc);
        int x = pt.x - rc.left, y = pt.y - rc.top;
        int w = rc.right - rc.left, hh = rc.bottom - rc.top;
        int bd = g_bezel;
        bool l = x < bd, r = x >= w - bd, t = y < bd, b = y >= hh - bd;
        if (t && l) return HTTOPLEFT;
        if (t && r) return HTTOPRIGHT;
        if (b && l) return HTBOTTOMLEFT;
        if (b && r) return HTBOTTOMRIGHT;
        if (l) return HTLEFT;
        if (r) return HTRIGHT;
        if (t) return HTTOP;
        if (b) return HTBOTTOM;
        break;
    }
    case WM_SIZE:
        if (wp == SIZE_MINIMIZED) {
            if (g_ctrl) g_ctrl->put_IsVisible(FALSE);
            return 0;
        }
        if (g_ctrl) {
            if (g_webShown) g_ctrl->put_IsVisible(TRUE);   // до готовності сторінки тримаємо схованим
            UpdateBounds();
        }
        LayoutEdges();
        ApplyRounding(h);
        RefreshBorderColor();
        return 0;
    case WM_EXITSIZEMOVE:
        // користувач закінчив тягнути вікно -> запам'ятовуємо розмір назавжди
        SaveWindowSize();
        return 0;
    case WM_APP + 1:
        // клік по іконці в треї -> показати вікно
        if (lp == WM_LBUTTONUP || lp == WM_LBUTTONDBLCLK) {
            ShowWindow(h, SW_RESTORE);
            SetForegroundWindow(h);
        }
        break;
    case WM_APP + 3:   // прогрес завантаження оновлення (wp = 0..100)
        UiScript(L"window.__fh&&window.__fh.dlProg(" + std::to_wstring((int)wp) + L")");
        return 0;
    case WM_APP + 4: { // помилка завантаження оновлення (lp = new std::wstring)
        std::wstring* msg = (std::wstring*)lp;
        if (msg) {
            std::wstring t = *msg;
            for (auto& c : t) if (c == L'\"' || c == L'\\') c = L' ';
            UiScript(L"window.__fh&&window.__fh.dlErr(\"" + t + L"\")");
            delete msg;
        }
        return 0;
    }
    case WM_APP + 5:   // завантаження завершено, запускаємо встановлення
        UiScript(L"window.__fh&&window.__fh.dlDone()");
        return 0;
    case WM_TIMER:
        if (wp == 3) {
            if (g_bootDone) { KillTimer(h, 3); InvalidateRect(h, nullptr, FALSE); }
            else { ++g_splashTick; InvalidateRect(h, nullptr, FALSE); }
            return 0;
        }
        if (wp == 4 || wp == 5) {   // сторінка готова (або таймаут) -> показуємо WebView
            KillTimer(h, 4); KillTimer(h, 5);
            if (!g_webShown) {
                g_webShown = true;
                if (g_ctrl) g_ctrl->put_IsVisible(TRUE);
                g_bootDone = true;   // ховаємо GDI-сплеш — інтерфейс уже з іконкою
                InvalidateRect(h, nullptr, FALSE);
            }
            return 0;
        }
        if (wp == 2) {
            CheckNotifs();
            CleanupOldFiles();   // дозчищаємо залишки оновлень, якщо були зайняті
            LayoutEdges();   // страховка: смуги завжди поверх вікна WebView2
            return 0;
        }
        break;
    case WM_ACTIVATE:
        RefreshBorderColor();
        break;
    case WM_NCACTIVATE:
        // без перемальовки неклієнтської рамки — усуває білі спалахи по краях
        // при зміні фокусу/розміру вікна (стандартний трюк для безрамкових вікон)
        return DefWindowProcW(h, m, wp, -1);
    case WM_ERASEBKGND: {
        HDC dc = (HDC)wp;
        RECT rc;
        GetClientRect(h, &rc);
        static HBRUSH br = CreateSolidBrush(RGB(5, 5, 8));
        FillRect(dc, &rc, br);
        return 1;
    }
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC dc = BeginPaint(h, &ps);
        if (!g_bootDone) {
            RECT rc;
            GetClientRect(h, &rc);
            DrawSplash(dc, rc);   // гарний екран завантаження, поки WebView2 стартує
        }
        EndPaint(h, &ps);
        return 0;
    }
    case WM_SETFOCUS:
        if (g_ctrl) g_ctrl->MoveFocus(COREWEBVIEW2_MOVE_FOCUS_REASON_PROGRAMMATIC);
        return 0;
    case WM_DESTROY:
        Shell_NotifyIconW(NIM_DELETE, &g_nid);
        KillTimer(h, 2);
        KillTimer(h, 3);
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(h, m, wp, lp);
}

int WINAPI wWinMain(HINSTANCE hInst, HINSTANCE, PWSTR, int nCmdShow) {
    SetProcessDPIAware();
    CoInitializeEx(nullptr, COINIT_APARTMENTTHREADED);
    InitSplashLogo();   // GDI+ + PNG-логотип для сплеша
    LoadAllCfg();   // групи + розмір вікна + сповіщення з минулого запуску
    CleanupOldFiles();   // залишки минулих оновлень (.bat/.new/.old, старі імена exe)

    // масштаб інтерфейсу під системний DPI
    typedef UINT (WINAPI *FnGetDpiForSystem)(void);
    FnGetDpiForSystem gdf = (FnGetDpiForSystem)(void*)GetProcAddress(
        GetModuleHandleW(L"user32.dll"), "GetDpiForSystem");
    if (gdf) g_dpi = gdf();
    g_bezel = MulDiv(6, (int)g_dpi, 96);
    if (g_bezel < 4) g_bezel = 4;

    WNDCLASSEXW wc{};
    wc.cbSize        = sizeof(wc);
    wc.style         = 0;   // без CS_HREDRAW/CS_VREDRAW — менше перемальовок при розтягуванні
    wc.lpfnWndProc   = WndProc;
    wc.hInstance     = hInst;
    wc.hIcon         = LoadIconW(hInst, MAKEINTRESOURCEW(1));
    wc.hIconSm       = LoadIconW(hInst, MAKEINTRESOURCEW(1));
    wc.hCursor       = LoadCursorW(nullptr, IDC_ARROW);
    wc.hbrBackground = CreateSolidBrush(RGB(5, 5, 8));
    wc.lpszClassName = L"FluxControlWnd";
    RegisterClassExW(&wc);

    // вікно по центру екрана; якщо минулого разу розмір змінювали — відновлюємо
    RECT wa{};
    SystemParametersInfoW(SPI_GETWORKAREA, 0, &wa, 0);
    int W = MulDiv(1040, (int)g_dpi, 96);
    int H = MulDiv(700, (int)g_dpi, 96);
    if (g_cfg.w >= MulDiv(640, (int)g_dpi, 96) && g_cfg.h >= MulDiv(440, (int)g_dpi, 96)) {
        W = g_cfg.w;
        H = g_cfg.h;
    }
    if (W > wa.right - wa.left - 20) W = wa.right - wa.left - 20;
    if (H > wa.bottom - wa.top - 20) H = wa.bottom - wa.top - 20;
    int x = wa.left + ((wa.right - wa.left) - W) / 2;
    int y = wa.top  + ((wa.bottom - wa.top) - H) / 2;

    // безрамкове вікно: стандартний заголовок вимкнено через WM_NCCALCSIZE
    g_hwnd = CreateWindowExW(0, wc.lpszClassName, L"FluxHelper",
                             WS_POPUP | WS_THICKFRAME | WS_CAPTION | WS_SYSMENU |
                             WS_MINIMIZEBOX | WS_MAXIMIZEBOX,
                             x, y, W, H, nullptr, nullptr, hInst, nullptr);
    if (!g_hwnd) return 1;

    // ФІКС «іконки вгорі»: у безрамкових вікон (WS_POPUP) іконка класу не
    // завжди підхоплюється системою -> примусово шлем WM_SETICON (велика
    // для Alt+Tab/панелі задач, мала — для заголовка/панелі задач).
    {
        HICON icB = (HICON)LoadImageW(hInst, MAKEINTRESOURCEW(1), IMAGE_ICON,
            GetSystemMetrics(SM_CXICON), GetSystemMetrics(SM_CYICON), LR_DEFAULTCOLOR);
        HICON icS = (HICON)LoadImageW(hInst, MAKEINTRESOURCEW(1), IMAGE_ICON,
            GetSystemMetrics(SM_CXSMICON), GetSystemMetrics(SM_CYSMICON), LR_DEFAULTCOLOR);
        if (icB) { SendMessageW(g_hwnd, WM_SETICON, ICON_BIG, (LPARAM)icB); }
        if (icS) { SendMessageW(g_hwnd, WM_SETICON, ICON_SMALL, (LPARAM)icS); }
    }

    // прозорі смуги по краях: тягнути край -> зміна розміру (розмір запам'ятовується)
    CreateEdges(hInst);

    BOOL dark = TRUE;
    DwmSetWindowAttribute(g_hwnd, DWMWA_USE_IMMERSIVE_DARK_MODE, &dark, sizeof(dark));

    // заокруглені кути (Windows 11); кольорову окантовку навколо вікна не малюємо
    UINT pref = DWMWCP_ROUND;
    g_dwmRound = SUCCEEDED(DwmSetWindowAttribute(g_hwnd, DWMWA_WINDOW_CORNER_PREFERENCE, &pref, sizeof(pref)));
    if (g_dwmRound) {
        COLORREF bc = DWMWA_COLOR_NONE;          // без рамки навколо вікна
        DwmSetWindowAttribute(g_hwnd, DWMWA_BORDER_COLOR, &bc, sizeof(bc));
    } else {
        ApplyRounding(g_hwnd);  // Windows 10: регіон
    }

    ShowWindow(g_hwnd, nCmdShow);
    UpdateWindow(g_hwnd);

    // сплеш-анімація (поки WebView2 стартує) + перевірка сповіщень раз на 15 с
    SetTimer(g_hwnd, 3, 33, nullptr);
    SetTimer(g_hwnd, 2, 15000, nullptr);
    AddTray();   // іконка в треї — для сповіщень Windows про початок уроку

    // WebView2Loader.dll вбудовано в exe: витягуємо й завантажуємо з першої
    // доступної локації (%APPDATA% -> папка exe -> %LOCALAPPDATA%)
    HMODULE hLoader = PrepareLoader();
    if (!hLoader) {
        MessageBoxW(g_hwnd,
            L"Не вдалося підготувати WebView2Loader.dll.\n"
            L"Перевстанови програму або перевір, чи не блокує її антивірус.",
            L"FluxHelper — помилка", MB_OK | MB_ICONERROR);
        return 1;
    }

    auto createEnv = (decltype(&CreateCoreWebView2EnvironmentWithOptions))
        GetProcAddress(hLoader, "CreateCoreWebView2EnvironmentWithOptions");
    if (!createEnv) {
        MessageBoxW(g_hwnd, L"WebView2Loader.dll пошкоджений. Перевстанови програму.",
                    L"FluxHelper — помилка", MB_OK | MB_ICONERROR);
        return 1;
    }

    std::wstring cacheDir = CacheDir();
    auto* eh = new EnvHandler();
    createEnv(nullptr, cacheDir.c_str(), nullptr, eh);
    eh->Release();

    MSG msg;
    while (GetMessageW(&msg, nullptr, 0, 0) > 0) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }
    CoUninitialize();
    return (int)msg.wParam;
}
