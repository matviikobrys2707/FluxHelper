# ============================================================
#  add_dex.ps1 [apkDir]
#  Adds (or replaces) classes.dex inside build\unsigned.apk.
#  Runs with CWD = apk\  (called from Build.bat inside "pushd apk")
# ============================================================
param([string]$Apk = "build\unsigned.apk", [string]$Dex = "build\dex\classes.dex")
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$apkPath = Join-Path (Get-Location).Path $Apk
$dexPath = Join-Path (Get-Location).Path $Dex
if (-not (Test-Path $apkPath)) { Write-Host "  [ERROR] $Apk not found"; exit 1 }
if (-not (Test-Path $dexPath)) { Write-Host "  [ERROR] $Dex not found"; exit 1 }

$zip = [System.IO.Compression.ZipFile]::Open($apkPath, [System.IO.Compression.ZipArchiveMode]::Update)
try {
    $old = $zip.GetEntry('classes.dex')
    if ($old) { $old.Delete() }
    $entry = $zip.CreateEntry('classes.dex', [System.IO.Compression.CompressionLevel]::Optimal)
    $es = $entry.Open()
    $fs = [IO.File]::OpenRead($dexPath)
    try { $fs.CopyTo($es) } finally { $es.Close(); $fs.Close() }
} finally {
    $zip.Dispose()
}
Write-Host "  OK   classes.dex added to unsigned.apk ($([math]::Round((Get-Item $dexPath).Length/1KB)) KB)"
exit 0
