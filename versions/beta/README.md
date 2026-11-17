# Бета-канал оновлень FluxHelper

- `latest.json` — маніфест каналу: `latest` (номер версії), md5/розміри APK і EXE,
  notes (що нового), `updated_at`. Застосунки з увімкненою бетою читають
  `versions/beta/latest.json`, порівнюють md5 і качають файл із папки своєї версії.
- `<версія>/FluxHelper.apk` + `<версія>/FluxHelper.exe` + `<версія>/changelog.txt`
  — архів усіх бета-збірок (від 2.4.3 до поточної).
- Поточна бета: **3.5.57** — див. [latest.json](latest.json) і
  [3.5.57/changelog.txt](3.5.57/changelog.txt).
- Кореневі `FluxHelper.apk` / `FluxHelper.exe` у репо — завжди остання бета
  (дзеркало `latest.json`); кнопки «Завантажити» на сайті ведуть саме туди.
