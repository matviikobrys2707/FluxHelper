// ============================================================================
// FluxHelper 2.3.4 — JAVA-ПАТЧ (MainActivity.java)
// ============================================================================
// Головний баг 2.3.3: методи oauthStart(), oauthLoopback(), authStart() були
// оголошені в класі MainActivity, але в WebView зареєстровано ЛИШЕ внутрішній
// об'єкт Host:
//
//     this.wv.addJavascriptInterface(new Host(), "AndroidHost");   // ← рядок ~95
//
// Android віддає у JS тільки @JavascriptInterface-методи САМЕ того об'єкта,
// що зареєстрований. Методи активності всередину моста НЕ потрапляють.
// Тому з JS виклики AndroidHost.oauthStart() / .oauthLoopback() / .authStart()
// кидали TypeError (методу не існує), помилка мовчки ковталася try/catch,
// і вхід завжди падав у «мертвий» шлях AndroidHost.open() з loopback-URL,
// який ніхто не слухав -> «localhost вбито», ERR_CONNECTION_REFUSED.
//
// ФІКС: додати в клас Host чотири методи-проксії (секція A нижче)
// і два хелпери для PKCE в MainActivity (секція B).
// Міняти AuthActivity / OAuthService / login-логіку НЕ треба.
// ============================================================================


// ============================================================================
// СЕКЦІЯ A — всередині існуючого класу `public class Host { ... }`
// (той, що містить ver(), open(), copy(), canInstall() тощо).
// Встав ці 4 методи в кінець Host, перед закриваючою дужкою класу:
// ============================================================================

        // ---- 2.3.4: проксії входу. Раніше цих методів у Host НЕ БУЛО,
        // тому JS не міг їх викликати — саме це ламало вхід на телефоні ----

        @JavascriptInterface
        public void oauthStart() {
            MainActivity.this.oauthStart();          // системний вхід через акаунт пристрою
        }

        @JavascriptInterface
        public void oauthLoopback() {
            MainActivity.this.oauthLoopback();       // стара петля loopback (запасний шлях)
        }

        @JavascriptInterface
        public void authStart(String url, String redirect) {
            MainActivity.this.authStart(url, redirect);   // ЗОВНІШНІЙ браузер (Worker / схема)
        }

        @JavascriptInterface
        public String pkce() {
            return MainActivity.this.pkce();         // verifier + challenge для прямої схеми
        }


// ============================================================================
// СЕКЦІЯ B — у сам клас MainActivity (поруч з oauthStart()/authStart(),
// НЕ всередині Host). Встав ці 2 методи:
// ============================================================================

    // 2.3.4: PKCE-пара для прямої авторизації Android-клієнтом.
    // Повертає "verifier challenge" (обидва base64url, 43+ символів) або "".
    // Формат символів base64url ([A-Za-z0-9_-]) повністю задовольняє
    // RFC 7636 (unreserved chars), перетворювати далі не треба.
    public String pkce() {
        try {
            byte[] buf = new byte[32];
            new java.security.SecureRandom().nextBytes(buf);
            String verifier = b64url(buf);
            byte[] dig = java.security.MessageDigest.getInstance("SHA-256")
                    .digest(verifier.getBytes("UTF-8"));
            return verifier + " " + b64url(dig);      // challenge = BASE64URL(SHA256(verifier))
        } catch (Exception e) {
            return "";
        }
    }

    private static String b64url(byte[] b) {
        return android.util.Base64.encodeToString(b,
                android.util.Base64.URL_SAFE | android.util.Base64.NO_WRAP | android.util.Base64.NO_PADDING);
    }


// ============================================================================
// СЕКЦІЯ C — ЩО ВЖЕ Є І НЕ ПОТРЕБУЄ ЗМІН (перевір, але не міняй):
// ============================================================================
// 1) handleOAuth(Intent) — ловить повернення за схемою com.googleusercontent.apps.*
//    і передає код у JS (window.__fh.oauthCode). Працює як є і для мосту
//    (код виду FH1.…), і для прямої схеми.
// 2) Intent-filter в AndroidManifest.xml для схем
//    com.googleusercontent.apps.668834523935-14h6abj…:/oauth2redirect — УЖЕ Є.
//    Схему kyiv1.blazix1.blazix1://oauth НЕ додавай — Google її все одно
//    не приймає (custom schemes для Android заборонені з 2023).
// 3) Порядок шляхів входу на телефоні після патчу:
//      [Головна кнопка]  системний акаунт пристрою (AccountManager) — без браузера;
//      [«Увійти через браузер»]
//           1. Cloudflare Worker (якщо заданий oauth.worker) — рекомендовано;
//           2. пряма схема Android-клієнта + PKCE (якщо в консолі правильний пакет);
//           3. стара loopback-петля (як на ПК).
// ============================================================================
