package com.fluxhelper.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.NotificationManager;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.ValueCallback;
import android.widget.Toast;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * FluxHelper — WebView-обгортка того самого інтерфейсу (assets/www/index.html),
 * що й в EXE: той самий дизайн, групи, Firebase Realtime Database.
 *
 *  • Zoom-посилання відкриваються зовні (Zoom-додаток або браузер)
 *  • AndroidHost.copy(text)  — буфер обміну (довге натискання = ПКМ)
 *  • AndroidHost.open(url)   — відкриття посилання
 *  • AndroidHost.setNotif(json) — сповіщення про початок уроку (AlarmManager)
 *  • AndroidHost.hasNotifPerm() / requestNotifPerm() — дозвіл на сповіщення
 *  • AndroidHost.testNotif(title, text) — тестове сповіщення (режим розробника)
 *  • AndroidHost.upd(json)   — завантаження APK-оновлення з GitHub + встановлення
 */
public class MainActivity extends Activity {

    private WebView wv;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // темні статус-бар / навігація під дизайн #050508
        Window w = getWindow();
        w.setStatusBarColor(Color.parseColor("#050508"));
        w.setNavigationBarColor(Color.parseColor("#050508"));

        wv = new WebView(this);
        WebSettings s = wv.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);              // localStorage: групи + кеш розкладу
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        // локальна сторінка -> fetch до Firebase (CORS дозволяє, але підстрахуємось)
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        wv.setBackgroundColor(Color.parseColor("#050508"));

        wv.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file://")) return false;
                openExternal(url);
                return true;
            }
        });

        wv.addJavascriptInterface(new Host(), "AndroidHost");
        wv.loadUrl("file:///android_asset/www/index.html");
        wv.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        setContentView(wv);

        Notifs.ensureChannel(this);
        Notifs.reschedule(this);   // плануємо наступне сповіщення з prefs
    }

    @Override
    protected void onResume() {
        super.onResume();
        // повернулись з налаштувань «встановлення невідомих застосунків» -> продовжуємо
        if (pendingInstall) {
            File base = getExternalFilesDir(null);
            File apk = (base == null) ? null : new File(base, "update/update.apk");
            if (apk != null && apk.exists() && apk.length() > 50000) tryInstall();
        }
    }

    // ------------------------------------------------- автооновлення (Android)
    private volatile boolean pendingInstall = false;

    private void jsCall(final String js) {
        runOnUiThread(new Runnable() {
            @Override public void run() {
                if (wv != null) wv.evaluateJavascript(js, null);
            }
        });
    }

    private void jsErr(String msg) {
        final String safe = msg == null ? "помилка" : msg.replace("'", " ").replace("\\", " ");
        jsCall("window.__fh&&window.__fh.dlErr('" + safe + "')");
    }

    /**{"v":"1.5.1","repo":"user/FluxHelper"} -> завантажити APK -> встановити */
    @JavascriptInterface
    public void upd(final String json) {
        String ver = null, repo = null;
        if (json != null) {
            java.util.regex.Matcher m1 = java.util.regex.Pattern
                    .compile("\"v\"\\s*:\\s*\"([^\"]+)\"").matcher(json);
            if (m1.find()) ver = m1.group(1);
            java.util.regex.Matcher m2 = java.util.regex.Pattern
                    .compile("\"repo\"\\s*:\\s*\"([^\"]+)\"").matcher(json);
            if (m2.find()) repo = m2.group(1);
        }
        if (ver == null || repo == null || repo.indexOf('/') < 0) {
            jsErr("некоректні дані оновлення");
            return;
        }
        final String url = "https://raw.githubusercontent.com/" + repo
                + "/main/versions/" + ver + "/FluxHelper.apk";
        jsCall("window.__fh&&window.__fh.dlProg(0)");
        new Thread(new Runnable() {
            @Override public void run() {
                try {
                    File base = getExternalFilesDir(null);
                    if (base == null) { jsErr("пам'ять телефону недоступна"); return; }
                    HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
                    con.setConnectTimeout(15000);
                    con.setReadTimeout(30000);
                    con.setInstanceFollowRedirects(true);
                    con.connect();
                    int code = con.getResponseCode();
                    if (code != 200) { jsErr("GitHub відповів " + code); return; }
                    long total = con.getContentLength();
                    File dir = new File(base, "update");
                    dir.mkdirs();
                    File out = new File(dir, "update.apk");
                    InputStream in = new BufferedInputStream(con.getInputStream());
                    OutputStream os = new FileOutputStream(out);   // перезаписує старий файл з нуля
                    byte[] buf = new byte[16384];
                    long got = 0;
                    int n, lastPct = -1;
                    while ((n = in.read(buf)) > 0) {
                        os.write(buf, 0, n);
                        got += n;
                        if (total > 0) {
                            final int pct = (int) (got * 100 / total);
                            if (pct != lastPct) {
                                lastPct = pct;
                                jsCall("window.__fh&&window.__fh.dlProg(" + pct + ")");
                            }
                        }
                    }
                    os.flush();
                    os.close();
                    in.close();
                    con.disconnect();
                    if (out.length() < 50000) { out.delete(); jsErr("файл оновлення пошкоджений"); return; }
                    if (total > 0 && out.length() != total) { out.delete(); jsErr("файл завантажився не повністю — спробуй ще раз"); return; }
                    jsCall("window.__fh&&window.__fh.dlProg(100)");
                    pendingInstall = true;
                    runOnUiThread(new Runnable() {
                        @Override public void run() { tryInstall(); }
                    });
                } catch (Exception e) {
                    jsErr("немає з'єднання з GitHub — перевір інтернет");
                }
            }
        }).start();
    }

    private void tryInstall() {
        File base = getExternalFilesDir(null);
        File apk = (base == null) ? null : new File(base, "update/update.apk");
        if (apk == null || !apk.exists()) { jsErr("файл оновлення не знайдено"); return; }
        if (Build.VERSION.SDK_INT >= 26 && !getPackageManager().canRequestPackageInstalls()) {
            pendingInstall = true;   // продовжимо у onResume після дозволу
            try {
                Intent i = new Intent(android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:" + getPackageName()));
                startActivity(i);
                Toast.makeText(this, "Дозволь встановлення — і оновлення продовжиться",
                        Toast.LENGTH_LONG).show();
            } catch (Exception e) {
                jsErr("дозволь встановлення застосунків у налаштуваннях");
            }
            return;
        }
        pendingInstall = false;
        Uri uri = Uri.parse("content://" + UpdProvider.AUTHORITY + "/apk");
        boolean opened = false;
        try {
            // ACTION_INSTALL_PACKAGE — штатний спосіб оновлення (краще працює на нових Android)
            Intent i = new Intent(Intent.ACTION_INSTALL_PACKAGE);
            i.setDataAndType(uri, "application/vnd.android.package-archive");
            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
            opened = true;
        } catch (Exception e1) {
            try {
                Intent i = new Intent(Intent.ACTION_VIEW);
                i.setDataAndType(uri, "application/vnd.android.package-archive");
                i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(i);
                opened = true;
            } catch (Exception e2) { }
        }
        if (opened) {
            jsCall("window.__fh&&window.__fh.dlDone()");
        } else {
            jsErr("не вдалося відкрити встановлювач");
        }
    }

    private void openExternal(String url) {
        try {
            Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
        } catch (Exception ignored) { }
    }

    @Override
    public void onBackPressed() {
        // спочатку даємо інтерфейсу закрити меню/модалку/налаштування,
        // і тільки якщо закривати нічого — згортаємо застосунок
        if (wv != null) {
            wv.evaluateJavascript("(window.__fh&&window.__fh.back)?(!!window.__fh.back()):false",
                new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String v) {
                        if (!"true".equals(v)) moveTaskToBack(true);
                    }
                });
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (wv != null) wv.destroy();
        super.onDestroy();
    }

    /** JS-міст: window.AndroidHost.* */
    public class Host {
        @JavascriptInterface
        public void open(String url) {
            if (url != null && !url.startsWith("file://")) openExternal(url);
        }

        @JavascriptInterface
        public void copy(String text) {
            if (text == null) return;
            ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            if (cm != null) {
                cm.setPrimaryClip(ClipData.newPlainText("FluxHelper", text));
            }
        }

        /** {"on":true,"min":5,"items":[{"dow":1,"t":"08:30","n":"Алгебра"},...]} */
        @JavascriptInterface
        public void setNotif(String json) {
            Notifs.handleJson(MainActivity.this, json);
        }

        @JavascriptInterface
        public boolean hasNotifPerm() {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return false;
            if (Build.VERSION.SDK_INT >= 24) return nm.areNotificationsEnabled();
            return true;
        }

        @JavascriptInterface
        public void requestNotifPerm() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (Build.VERSION.SDK_INT >= 33) {
                        requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 11);
                    }
                }
            });
        }

        /** РЕЖИМ РОЗРОБНИКА: тестове сповіщення з інтерфейсу (показ одразу). */
        @JavascriptInterface
        public void testNotif(String title, String text) {
            Notifs.ensureChannel(MainActivity.this);
            Notifs.showNow(MainActivity.this, title, text);
        }
    }
}
