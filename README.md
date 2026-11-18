# FluxHelper — розклад 8-Б класу

Застосунок розкладу уроків з посиланнями на Zoom, групами, сповіщеннями та синхронізацією.
Вхід захищає Google.

**Поточна бета: 3.5.67** (versionCode 30567, 18.11.2026) — ДИАГНОСТИКА «Заходимо в акаунт… і нічого»: тости-кроки FH 1..6 на всьому шляху входу (login start → CM handle/cold/exception → picker → browser → token → помилка CM з ім'ям винятку); Host.login/loginLast без catchall (як 3.5.1) — помилки Java видно в UI; Java-сторож 12с→10с; логіка входу лишається дослівною 3.5.1 (трансплантат 3.5.66) · офіційний підпис APK/EXE: `6871f0d5`

## ⬇️ Де скачати (одинакова скрізь схема)

**Головне правило: кореневі `FluxHelper.apk` / `FluxHelper.exe` — ЗАВЖДИ остання бета.**
Кнопки «Завантажити» на сайті ведуть саме на ці файли, тому сайт, GitHub і
Releases роздають одну й ту саму версію.

| Що | Посилання |
|---|---|
| Android APK (остання бета) | [fluxhelper.pages.dev/FluxHelper.apk](https://fluxhelper.pages.dev/FluxHelper.apk) |
| Windows EXE (остання бета) | [fluxhelper.pages.dev/FluxHelper.exe](https://fluxhelper.pages.dev/FluxHelper.exe) |
| Те саме на GitHub (main) | [FluxHelper.apk](FluxHelper.apk) · [FluxHelper.exe](FluxHelper.exe) |
| Реліз на GitHub (tags+assets) | [github.com/matviikobrys2707/FluxHelper/releases](https://github.com/matviikobrys2707/FluxHelper/releases) |
| Папка версії в репо | `versions/beta/3.5.65/` — [APK](versions/beta/3.5.65/FluxHelper.apk) · [EXE](versions/beta/3.5.65/FluxHelper.exe) · [changelog](versions/beta/3.5.65/changelog.txt) |
| Повний пакет (все в одному) | [FluxHelper_3.5.65_FULL.zip](FluxHelper_3.5.65_FULL.zip) — бінарники + джерела сайту + smali-джерела APK + патч-скрипти EXE + HASHES.txt |

Перевірка справжності (3.5.65): APK md5 `42784ac66fb9a074ebc7fba7a95c89f3`,
EXE md5 `c1807353902bd18a2fbc97781c5304f8`. Підпис APK: сертифікат SHA-1
`6871f0d5fadac10933492095bd322d4bf81a8373` (CN=Flux Helper, O=Blazix).

Сайт: [fluxhelper.pages.dev](https://fluxhelper.pages.dev)
- Веб-версія для ВСІХ пристроїв: [fluxhelper.pages.dev/main](https://fluxhelper.pages.dev/main)
- iPhone: [fluxhelper.pages.dev/iphone/](https://fluxhelper.pages.dev/iphone/) · Mac: [fluxhelper.pages.dev/mac/](https://fluxhelper.pages.dev/mac/)

## Канали: реліз і бета

| Канал | Маніфест | Кому |
|---|---|---|
| **Бета** | `versions/beta/latest.json` | адміни з перемикачем «Бета-версії» в профілі |
| **Реліз** (стабільний) | `versions/release/latest.json` | усі звичайні користувачі |

- На сайт деплоїться гілка `main`; бета-функції перемкнуті прапорцем бета-режиму
  і звичайним користувачам не показуються. Админ вмикає перемикач у профілі →
  отримує бета-версію сайту.
- Застосунки перевіряють свій маніфест (`latest.json` свого каналу), порівнюють
  `apk_md5`/`exe_md5` і качають файл із папки своєї версії
  (`versions/<канал>/<версія>/…`) — з сайту (Cloudflare), GitHub RAW або Releases.
- Коли бета стає релізом: `main` зливають у `site-release`, маніфест
  `versions/release/latest.json` піднімають, і нові можливості отримують усі.

## Структура репозиторію

```
FluxHelper.apk / FluxHelper.exe   — ЗАВЖДИ остання бета (зараз 3.5.65) — те, що качає сайт
FluxHelper_3.5.65_FULL.zip        — повний пакет поточної бети (бінарники + джерела + HASHES)
latest.json                       — дзеркало бета-каналу для кореневих бінарників
index.html, auth.html, fbauth.html, _headers, manifest.json — сайт + сторінки входу Google
main/  iphone/  mac/  b/          — код веб-версій (b/ — бета-сторінка без індексації)
versions/
  beta/   — бета-канал: latest.json + АРХІВ папок усіх бета-версій (2.4.3 … 3.5.65)
  release/ — стабільний канал: latest.json + папки стабільних версій (останній реліз 3.5.1)
```

- `versions/beta/<версія>/` містить `FluxHelper.apk`, `FluxHelper.exe`,
  `changelog.txt` — нічого зайвого; поточна версія завжди в `versions/beta/latest.json`.
- `FluxHelper_3.5.65_FULL.zip` — розгорнутий склад пакета див. `README.txt`
  всередині архіву.

## Оновлення застосунків

Застосунки перевіряють `versions/release/latest.json` (стабільний канал) та
`versions/beta/latest.json` (для адмінів з перемикачем «Бета-версії») і
качають файл із папки версії — з сайту (Cloudflare), з GitHub RAW або з Releases.

Автор: **Blazix**
