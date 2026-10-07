# ============================================================
#  set_version.ps1 -V X.Y.Z
#  Writes the version into src\version.h AND apk\AndroidManifest.xml
#  (versionCode = major*1000 + minor*100 + patch,  1.7.2 -> 1702)
# ============================================================
param([string]$V = "")
$ErrorActionPreference = 'Stop'
if ($V -notmatch '^\d+\.\d+\.\d+$') { Write-Host "  [ERROR] bad version '$V' (expected X.Y.Z)"; exit 1 }
$p = $V.Split('.')
$maj = [int]$p[0]; $min = [int]$p[1]; $pat = [int]$p[2]
$code = $maj * 1000 + $min * 100 + $pat

# --- src\version.h ---
$h = Join-Path (Get-Location).Path 'src\version.h'
if (-not (Test-Path $h)) { Write-Host "  [ERROR] src\version.h not found"; exit 1 }
$txt = [IO.File]::ReadAllText($h)
$txt = [regex]::Replace($txt, '#define\s+FH_VER_MAJ\s+\d+', ('#define FH_VER_MAJ ' + $maj))
$txt = [regex]::Replace($txt, '#define\s+FH_VER_MIN\s+\d+', ('#define FH_VER_MIN ' + $min))
$txt = [regex]::Replace($txt, '#define\s+FH_VER_PAT\s+\d+', ('#define FH_VER_PAT ' + $pat))
$enc = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText($h, $txt, $enc)

# --- apk\AndroidManifest.xml ---
$mf = Join-Path (Get-Location).Path 'apk\AndroidManifest.xml'
if (Test-Path $mf) {
    $mx = [IO.File]::ReadAllText($mf)
    $mx = [regex]::Replace($mx, 'android:versionCode="\d+', ('android:versionCode="' + $code))
    $mx = [regex]::Replace($mx, 'android:versionName="[0-9.]+', ('android:versionName="' + $V))
    [IO.File]::WriteAllText($mf, $mx, $enc)
}
Write-Host "  OK   version $V (versionCode $code) written to version.h + AndroidManifest.xml"
exit 0
