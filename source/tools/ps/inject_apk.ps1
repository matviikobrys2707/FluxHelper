# ============================================================
#  inject_apk.ps1 [-V X.Y.Z]
#  Builds apk\build\assets\www\index.html from the template:
#    __LOGO_B64__       -> base64 of src\logo.png   (ALL occurrences)
#    __APP_VER__        -> version                  (ALL occurrences)
#    __SETTINGS_JSON__  -> null
#  (Python's .replace() in build.sh replaces ALL - so must we)
# ============================================================
param([string]$V = "")
$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path

# version: param -> manifest -> version.h
if (-not $V) {
    $mf = Join-Path $root 'apk\AndroidManifest.xml'
    if (Test-Path $mf) {
        $mx = [IO.File]::ReadAllText($mf)
        $m = [regex]::Match($mx, 'android:versionName="([0-9.]+)"')
        if ($m.Success) { $V = $m.Groups[1].Value }
    }
}
if (-not $V) { Write-Host "  [ERROR] no version (-V or AndroidManifest.xml)"; exit 1 }

$tplPath = Join-Path $root 'apk\assets\www\index.html'
$logoPath = Join-Path $root 'src\logo.png'
if (-not (Test-Path $tplPath)) { Write-Host "  [ERROR] apk\assets\www\index.html not found"; exit 1 }
if (-not (Test-Path $logoPath)) { Write-Host "  [ERROR] src\logo.png not found"; exit 1 }

$tpl = [IO.File]::ReadAllText($tplPath, [Text.Encoding]::UTF8)
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($logoPath))
# break the base64 into chunks so no single line gets gigantic (same as build tools do)
$b64 = ($b64 -replace '(.{96})', "`$1`n").TrimEnd()
$tpl = $tpl.Replace('__LOGO_B64__', $b64)
$tpl = $tpl.Replace('__APP_VER__', $V)
$tpl = $tpl.Replace('__SETTINGS_JSON__', 'null')

$outDir = Join-Path $root 'apk\build\assets\www'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$enc = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText((Join-Path $outDir 'index.html'), $tpl, $enc)
Write-Host "  OK   assets injected: apk\build\assets\www\index.html ($([math]::Round((Get-Item (Join-Path $outDir 'index.html')).Length/1KB)) KB, ver $V)"
exit 0
