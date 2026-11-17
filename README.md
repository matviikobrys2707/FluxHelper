# FluxHelper — розклад 8-Б класу

Застосунок розкладу уроків з посиланнями на Zoom, групами, сповіщеннями та синхронізацією.
Вхід захищає Google.

- **Сайт**: [fluxhelper.pages.dev](https://fluxhelper.pages.dev)
  - Веб-версія для ВСІХ пристроїв (головна): [fluxhelper.pages.dev/main](https://fluxhelper.pages.dev/main)
    — сам визначає пристрій: телефон -> мобільна версія, комп'ютер -> десктопна;
    вкладки в URL англійською (`#schedule`, `#settings`, `#account`, `#admin`)
  - Версія для iPhone (лише iPhone): [fluxhelper.pages.dev/iphone/](https://fluxhelper.pages.dev/iphone/)
  - Версія для Mac (лише Mac): [fluxhelper.pages.dev/mac/](https://fluxhelper.pages.dev/mac/)
- **Windows**: [FluxHelper.exe](https://fluxhelper.pages.dev/FluxHelper.exe)
- **Android**: [FluxHelper.apk](https://fluxhelper.pages.dev/FluxHelper.apk)
- **Повний пакет (все в одному)**: [FluxHelper_3.5.56_FULL.zip](FluxHelper_3.5.56_FULL.zip)
  — готові APK + EXE 3.5.56, джерела сайту 3.5.56 (як задеплоєно на Pages),
  smali-джерела APK (dex_src) + інструменти збирання, патч-скрипти EXE,
  changelog і контрольні суми (HASHES.txt) — одним файлом для скачування на ПК.

## Версії сайту (реліз і бета)

Сайт існує у ДВОХ версіях, і обидві зберігаються тут, на GitHub:

| Версія | Де живе | Хто бачить |
|---|---|---|
| **Реліз** (стабільна) | гілка **`site-release`** | усі звичайні користувачі сайту |
| **Бета** (нові функції) | гілка **`main`** (деплоється на Pages) | адміни з увімкненим перемикачем «Бета-версії» |

Як це працює:

- На сайт ЗАВЖДИ деплоїться гілка `main` — але нові функції в ній
  **перемкнуті прапорцем бета-режиму** і звичайним користувачам не показуються.
- Адмін бачить у профілі рядок «Бета-версії» (пераметр `bt` у знімку налаштувань,
  синхронізується з базою). Вмикає перемикач → перезавантажує сторінку →
  отримує бета-версію сайту з новими функціями і підписом «X.Y.Z beta»
  у рамці версії. URL при цьому НЕ змінюється.
- Коли бета стає релізом: гілку `main` (з вже ввімкненими для всіх функціями)
  зливають у `site-release`, і нові можливості отримують усі.

## Структура репозиторію

- `iphone/` — код веб-версії для iPhone (дзеркало `assets/www` Android-застосунку)
- `mac/` — код веб-версії для Mac (дзеркало інтерфейсу Windows-програми)
- `versions/release/` — стабільні збірки (APK/EXE) попередніх поколінь
- `versions/beta/` — бета-канал: `latest.json` + папки версій (`APK`, `EXE`, `changelog.txt`)
  — поточна бета: **3.5.57** (Google-вхід на Android: діагностика Credential Manager)
- `FluxHelper.apk` / `FluxHelper.exe` в корені — завжди ОСТАННІЙ реліз
- `FluxHelper_3.5.56_FULL.zip` — повний пакет бети 3.5.56: бінарники + джерела одним архівом
- `auth.html`, `fbauth.html` — сторінки входу Google для застосунків

## Оновлення застосунків

Застосунки перевіряють `versions/release/latest.json` (стабільний канал) та
`versions/beta/latest.json` (для адмінів з перемикачем «Бета-версії») і
качають файл із папки версії — з сайту (Cloudflare), з GitHub RAW або з Releases.

Автор: **Blazix**
