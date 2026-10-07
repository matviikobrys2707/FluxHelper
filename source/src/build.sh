#!/usr/bin/env bash
# ============================================================
#  Збірка FluxHelper.exe (Windows x64) з Linux через llvm-mingw.
#  (На Windows використовуй Build.bat — він сам все завантажить.)
#  WebView2Loader.dll вбудовується в exe (RCDATA) і витягується
#  при запуску: %APPDATA%\FluxControl -> папка exe -> %LOCALAPPDATA%.
# ============================================================
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
TC="${LLVM_MINGW_BIN:-}"          # напр. /opt/llvm-mingw/bin
[ -n "$TC" ] || { echo "Вкажи LLVM_MINGW_BIN=/шлях/до/llvm-mingw/bin"; exit 1; }
SDKINC="$ROOT/tools/webview2/include"
mkdir -p src/build

# 1) DLL лоадера поруч (вбудовується в ресурси)
cp -f tools/webview2/WebView2Loader.dll src/WebView2Loader.dll

# 2) ресурси (іконка + DLL + VERSIONINFO) — FileDescription тепер ASCII (FH_DESC),
#    тому жодних патчів після windres не потрібно
cd src
"$TC/x86_64-w64-mingw32-windres" app.rc -O coff -o build/app.res

# 3) компіляція
"$TC/x86_64-w64-mingw32-g++" -std=gnu++17 -O2 -fms-extensions \
  -municode -mwindows -DUNICODE -D_UNICODE -I"$SDKINC" -Icompat \
  main.cpp build/app.res -o build/FluxHelper.exe \
  -lole32 -lshell32 -luser32 -lgdi32 -ladvapi32 -luuid -ldwmapi -lwinhttp -lgdiplus

echo "=== BUILD OK: src/build/FluxHelper.exe ==="
