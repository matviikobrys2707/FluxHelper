# ============================================================
#  get_version.ps1 - reads the version from src\version.h
#  Output (stdout, ASCII only): "X.Y.Z"
#  Switch -Next: outputs "X.Y.(Z+1)"
# ============================================================
$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$h = Join-Path $root 'src\version.h'
if (-not (Test-Path $h)) { Write-Output ""; exit 1 }
$txt = [IO.File]::ReadAllText($h)
function Get-Define([string]$name) {
    $m = [regex]::Match($txt, ('#define\s+' + $name + '\s+(\d+)'))
    if ($m.Success) { return [int]$m.Groups[1].Value }
    return -1
}
$maj = Get-Define 'FH_VER_MAJ'
$min = Get-Define 'FH_VER_MIN'
$pat = Get-Define 'FH_VER_PAT'
if ($maj -lt 0 -or $min -lt 0 -or $pat -lt 0) { Write-Output ""; exit 1 }
if ($args -contains '-Next') { $pat = $pat + 1 }
Write-Output ("{0}.{1}.{2}" -f $maj, $min, $pat)
exit 0
