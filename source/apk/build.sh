#!/usr/bin/env bash
# ============================================================
#  Збірка FluxHelper.apk з пакета (Linux; на Windows — Build.bat).
#  aapt2 + ecj + d8 + zipalign + apksigner, ключ: keys/fluxhelper.keystore
#  Потрібно: ANDROID_BT=папка build-tools (aapt2,d8,apksigner,zipalign),
#            ANDROID_JAR=шлях до android.jar (platform-33), java 17+
# ============================================================
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
BT="${ANDROID_BT:-}"
AJ="${ANDROID_JAR:-}"
[ -n "$BT" ] && [ -n "$AJ" ] || { echo "Вкажи ANDROID_BT=... і ANDROID_JAR=..."; exit 1; }

# версія з AndroidManifest.xml
VC=$(grep -oP 'android:versionCode="\K[0-9]+' apk/AndroidManifest.xml)
VN=$(grep -oP 'android:versionName="\K[0-9.]+' apk/AndroidManifest.xml)
echo "APK версія: $VN (versionCode $VC)"

OUT=apk/build
rm -rf "$OUT"
mkdir -p "$OUT/classes" "$OUT/gen" "$OUT/dex"

# 1) assets/www/index.html: підставляємо логотип і версію
python3 - <<'EOF'
import base64, re
tpl = open('apk/assets/www/index.html', encoding='utf-8').read()
b64 = base64.b64encode(open('src/logo.png','rb').read()).decode()
ver = re.search(r'android:versionName="([0-9.]+)"', open('apk/AndroidManifest.xml', encoding='utf-8').read()).group(1)
tpl = tpl.replace('__LOGO_B64__', b64).replace('__APP_VER__', ver).replace('__SETTINGS_JSON__', 'null')
import os; os.makedirs('apk/build/assets/www', exist_ok=True)
open('apk/build/assets/www/index.html', 'w', encoding='utf-8').write(tpl)
print('index.html OK', len(tpl))
EOF

# 2) ресурси -> компіляція + link (+ R.java)
"$BT/aapt2" compile --dir apk/res -o "$OUT/res.zip"
"$BT/aapt2" link -o "$OUT/unsigned.apk" -I "$AJ" \
  --manifest apk/AndroidManifest.xml \
  --min-sdk-version 24 --target-sdk-version 34 \
  --version-code "$VC" --version-name "$VN" \
  --java "$OUT/gen" -A apk/build/assets --auto-add-overlay "$OUT/res.zip"

# 3) java -> class -> dex
java -jar tools/ecj.jar -source 1.8 -target 1.8 -nowarn \
  -cp "$AJ" -d "$OUT/classes" \
  apk/src/com/fluxhelper/app/*.java "$OUT"/gen/com/fluxhelper/app/R.java
find "$OUT/classes" -name "*.class" > "$OUT/classlist.txt"
"$BT/d8" --release --lib "$AJ" --min-api 24 --output "$OUT/dex" @"$OUT/classlist.txt" 2>/dev/null || \
  "$BT/d8" --release --lib "$AJ" --min-api 24 --output "$OUT/dex" $(find "$OUT/classes" -name "*.class")

# 4) dex в apk + вирівнювання + підпис
(cd "$OUT" && zip -q -j unsigned.apk dex/classes.dex)
"$BT/zipalign" -f 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"
"$BT/apksigner" sign --ks keys/fluxhelper.keystore --ks-pass pass:fluxhelper \
  --key-pass pass:fluxhelper --out "$OUT/FluxHelper.apk" "$OUT/aligned.apk"
"$BT/apksigner" verify --print-certs "$OUT/FluxHelper.apk" | head -3
"$BT/aapt2" dump badging "$OUT/FluxHelper.apk" | grep -aE "package:|sdkVersion|application-label" | head -4
echo "=== APK BUILD OK: apk/build/FluxHelper.apk ==="
