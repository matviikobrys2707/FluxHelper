# ==================================================================
#  FLUXCONTROL DEPLOY - публикация обновлений одной командой
#  Автор приложения: Blazix   |   Репозиторий: matviikobrys2707/FluxHelper
#
#  Что делает:
#   [1/9] проверяет ключ GitHub и репозиторий
#   [2/9] находит собранные FluxControl.exe / FluxControl.apk
#   [3/9] определяет текущую версию (Firebase -> GitHub -> сборка)
#   [4/9] спрашивает только версию (Enter = следующая) и описание
#   [5/9] чистит файлы с незнакомыми именами в versions/ на GitHub
#   [6/9] публикует versions/<версия>/FluxControl.exe | .apk | changelog.txt
#         + копии Blazix.* / FluxHelper.* (чтобы могли обновиться старые сборки)
#   [7/9] обновляет Firebase: update/latest + update/notes
#   [8/9] создаёт GitHub Release - постоянную ссылку «всегда последняя версия»
#   [9/9] проверяет, что всё реально скачивается
#
#  Запуск:  powershell -ExecutionPolicy Bypass -File deploy.ps1
#  Только проверка (ничего не публикует):
#           powershell -ExecutionPolicy Bypass -File deploy.ps1 -Check
#  Можно сразу передать версию и описание (из Build.bat):
#           deploy.ps1 -Version 1.7.2 -Notes "пункт 1 | пункт 2"
# ==================================================================
param(
    [switch]$Check,
    [switch]$Force,
    [string]$Version,
    [string]$Notes
)

# ---------------- НАСТРОЙКИ (обычно менять не нужно) -------------
$Token       = ""   # <--- ВСТАВЬ СВІЙ GITHUB-ТОКЕН СЮДИ (github_pat_...)
$Repo        = "matviikobrys2707/FluxHelper"
$Branch      = "main"
$AppName     = "FluxHelper"
$Author      = "Blazix"
$FirebaseUrl = "https://fluxhelper-1-default-rtdb.europe-west1.firebasedatabase.app"
# приложения читают <адрес>/update.json  ->  { latest: "X.Y.Z", notes: ["+ ...", "- ..."] }
# ------------------------------------------------------------------

$ErrorActionPreference = "Stop"
try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false) } catch {}
try { $null = & cmd.exe /c "chcp 65001 >nul" } catch {}
try { [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12 } catch {}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = (Get-Location).Path }

# ---------------- вспомогательные --------------------------------
$script:StepNo    = 0
$script:StepTotal = 8
function Step([string]$t) {
    $script:StepNo++
    Write-Host ""
    Write-Host "  [$script:StepNo/$script:StepTotal] $t" -ForegroundColor Cyan
}
function Ok([string]$t)   { Write-Host "          OK   $t" -ForegroundColor Green }
function Warn2([string]$t){ Write-Host "          !!   $t" -ForegroundColor Yellow }
function Fail([string]$t) { Write-Host "          XX   $t" -ForegroundColor Red }
function Info([string]$t) { Write-Host "          ..   $t" -ForegroundColor Gray }

function Wait-Exit([int]$Code) {
    if (-not $Check) {
        Write-Host ""
        Read-Host "  Нажми Enter для выхода" | Out-Null
    }
    exit $Code
}

function HttpCode($err) {
    try { return [int]$err.Exception.Response.StatusCode } catch { return 0 }
}

function NormVer([string]$v) {
    if ([string]::IsNullOrWhiteSpace($v)) { return "" }
    $m = [regex]::Match($v.Trim(), '(\d+(\.\d+){1,3})')
    if (-not $m.Success) { return "" }
    $p = $m.Groups[1].Value.Split('.')
    while ($p.Count -lt 3) { $p += "0" }
    return ($p[0..2] -join '.')
}
function NextPatch([string]$v) {
    if (-not $v) { return "1.0.0" }
    $p = $v.Split('.')
    $p[2] = [string]([int]$p[2] + 1)
    return ($p -join '.')
}

function Invoke-GH([string]$Method, [string]$Path, $BodyObj) {
    $h = @{
        Authorization         = "Bearer $Token"
        Accept                = "application/vnd.github+json"
        "X-GitHub-Api-Version" = "2022-11-28"
    }
    if ($null -ne $BodyObj) {
        $json = $BodyObj
        if (-not ($BodyObj -is [string])) { $json = $BodyObj | ConvertTo-Json -Depth 4 }
        return Invoke-RestMethod -Method $Method -Uri ("https://api.github.com" + $Path) `
            -Headers $h -Body $json -ContentType "application/json; charset=utf-8"
    }
    return Invoke-RestMethod -Method $Method -Uri ("https://api.github.com" + $Path) -Headers $h
}

function RawUrl([string]$path) {
    return "https://raw.githubusercontent.com/$Repo/$Branch/$path"
}

function Find-FirebaseUrl([string]$ExePath) {
    $found = @()
    if ($FirebaseUrl -ne "") { return ,@($FirebaseUrl.TrimEnd('/')) }
    $roots = @($ScriptDir)
    $parent = Split-Path -Parent $ScriptDir
    if ($parent -and (Test-Path $parent) -and ((Split-Path -Leaf $parent) -match 'FluxHelper|FluxControl')) { $roots += $parent }
    $exts = @(".cpp",".h",".hpp",".rc",".ps1",".txt",".json",".html",".java",".kt",".gradle",".xml",".properties",".js")
    foreach ($r in $roots) {
        if (-not (Test-Path $r)) { continue }
        $files = Get-ChildItem -Path $r -Recurse -Depth 3 -File -ErrorAction SilentlyContinue |
            Where-Object { ($exts -contains $_.Extension.ToLower()) -and ($_.FullName -notmatch '\\\.git\\|\\node_modules\\') }
        foreach ($f in $files) {
            try {
                $txt = [IO.File]::ReadAllText($f.FullName)
                foreach ($m in [regex]::Matches($txt, 'https://[A-Za-z0-9][A-Za-z0-9\.\-]*\.(firebaseio\.com|firebasedatabase\.app)(/[A-Za-z0-9\._\-]*)?')) { $found += $m.Value }
            } catch {}
        }
    }
    if ($ExePath -and (Test-Path $ExePath)) {
        try {
            $bytes = [IO.File]::ReadAllBytes($ExePath)
            foreach ($enc in @([Text.Encoding]::ASCII, [Text.Encoding]::Unicode)) {
                $txt = $enc.GetString($bytes)
                foreach ($m in [regex]::Matches($txt, 'https://[A-Za-z0-9][A-Za-z0-9\.\-]*\.(firebaseio\.com|firebasedatabase\.app)(/[A-Za-z0-9\._\-]*)?')) { $found += $m.Value }
            }
        } catch {}
    }
    $norm = @()
    foreach ($u in $found) {
        $x = ($u -replace '\.json$', '').TrimEnd('/')
        if ($x -and ($norm -notcontains $x)) { $norm += $x }
    }
    return ,$norm
}

function Get-FirebaseLatest([string]$Url) {
    # приложения читают узел update: { latest: "X.Y.Z", notes: [...] }
    try {
        $o = Invoke-RestMethod -Uri ($Url + "/update.json")
        if ($o -is [string]) { return (NormVer $o) }
        if ($o.PSObject.Properties.Name -contains "latest") { return (NormVer [string]$o.latest) }
        if ($o.PSObject.Properties.Name -contains "version") { return (NormVer [string]$o.version) }
        return ""
    } catch { return "" }
}

function Esc-J([string]$s) {
    return ($s -replace '\\', '\\\\').Replace('"', '\"').Replace("`r", " ").Replace("`n", " ")
}
function Update-Firebase([string]$Url, [string]$Ver, [string[]]$Notes) {
    # пишем РОВНО ту схему, которую читают приложения: update/latest + update/notes
    # JSON собираем вручную: ConvertTo-Json в PS 5.1 схлопывает массив из одного элемента,
    # а тело отправляем байтами UTF-8, чтобы кириллица не превратилась в вопросики
    $notesJson = ""
    foreach ($n in @($Notes)) {
        if ($notesJson) { $notesJson += "," }
        $notesJson += '"' + (Esc-J $n) + '"'
    }
    $ts = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    $payload = '{"latest":"' + $Ver + '","notes":[' + $notesJson + '],"updated_at":"' + $ts + '"}'
    $h = @{ "X-HTTP-Method-Override" = "PATCH" }
    Invoke-RestMethod -Method Put -Uri ($Url + "/update.json") -Body ([Text.Encoding]::UTF8.GetBytes($payload)) `
        -ContentType "application/json; charset=utf-8" -Headers $h | Out-Null
}

function Upload-File([string]$Local, [string]$RemotePath, [string]$Ver) {
    $sha = $null
    try {
        $ex = Invoke-GH "GET" ("/repos/" + $Repo + "/contents/" + $RemotePath)
        $sha = $ex.sha
    } catch {
        if ((HttpCode $_) -ne 404) { throw }
    }
    $b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($Local))
    $body = @{
        message = "Deploy $AppName $Ver - $([IO.Path]::GetFileName($RemotePath))"
        content = $b64
        branch  = $Branch
    }
    if ($sha) { $body.sha = $sha }
    Invoke-GH "PUT" ("/repos/" + $Repo + "/contents/" + $RemotePath) $body | Out-Null
}

function Delete-Remote([string]$RemotePath, [string]$Sha) {
    $body = @{
        message = "Cleanup: remove $RemotePath"
        sha     = $Sha
        branch  = $Branch
    }
    Invoke-GH "DELETE" ("/repos/" + $Repo + "/contents/" + $RemotePath) $body | Out-Null
}

function Build-NotesList([string]$Note) {
    $list = @()
    if ([string]::IsNullOrWhiteSpace($Note)) {
        $list += "виправлення помилок і дрібні покращення стабільності"
    } else {
        foreach ($p in ($Note -split '\s*\|\s*')) {
            if ($p.Trim()) { $list += $p.Trim() }
        }
    }
    return $list
}
function Build-ChangelogText([string]$Ver, [string[]]$Notes) {
    $lines = @()
    $lines += "$AppName $Ver"
    $lines += ""
    foreach ($n in @($Notes)) { $lines += ("+ " + $n) }
    return (($lines -join "`r`n") + "`r`n")
}

function Get-ReleaseByTag([string]$tag) {
    try { return Invoke-GH "GET" ("/repos/" + $Repo + "/releases/tags/" + $tag) } catch { return $null }
}

function Publish-Release([string]$Ver, [string]$ChangelogText, [hashtable]$Assets) {
    $tag = "v$Ver"
    $rel = Get-ReleaseByTag $tag
    if (-not $rel) {
        $md = ($ChangelogText -replace '(?m)^\+ ', '- ')
        $body = @{
            tag_name         = $tag
            target_commitish = $Branch
            name             = "$AppName $Ver"
            body             = $md
        }
        $rel = Invoke-GH "POST" ("/repos/" + $Repo + "/releases") $body
    }
    $relId = $rel.id
    $existing = @()
    try { $existing = @(Invoke-GH "GET" ("/repos/" + $Repo + "/releases/" + $relId + "/assets")) } catch {}
    foreach ($a in @($existing)) {
        if ($Assets.ContainsKey($a.name)) {
            try { Invoke-GH "DELETE" ("/repos/" + $Repo + "/releases/assets/" + $a.id) | Out-Null } catch {}
        }
    }
    foreach ($name in @($Assets.Keys)) {
        $bytes = [IO.File]::ReadAllBytes($Assets[$name])
        $up = Invoke-RestMethod -Method Post `
            -Uri ("https://uploads.github.com/repos/" + $Repo + "/releases/" + $relId + "/assets?name=" + $name) `
            -Headers @{ Authorization = "Bearer $Token" } `
            -ContentType "application/octet-stream" -Body $bytes
        Ok ("release asset: " + $up.browser_download_url)
    }
    return $rel
}

function Banner {
    Write-Host ""
    Write-Host "  ==========================================================" -ForegroundColor DarkGray
    Write-Host "    $AppName DEPLOY  -  публикация обновлений" -ForegroundColor Magenta
    Write-Host "    автор: $Author   |   репозиторий: $Repo" -ForegroundColor DarkGray
    Write-Host "  ==========================================================" -ForegroundColor DarkGray
}

# получаем список файлов versions/ с сервера (дерево)
function Get-VersionsTree {
    return (Invoke-GH "GET" ("/repos/" + $Repo + "/git/trees/" + $Branch + "?recursive=1"))
}

# ================================================================
#  РЕЖИМ ПРОВЕРКИ (-Check) - только чтение, ничего не публикует
# ================================================================
if ($Check) {
    $script:StepTotal = 6
    Banner
    Step "Проверяю ключ GitHub и репозиторий $Repo"
    try {
        $null = Invoke-GH "GET" "/repos/$Repo"
        Ok "ключ работает, репозиторий доступен"
    } catch {
        Fail ("ключ GitHub недействителен или нет доступа (HTTP " + (HttpCode $_) + ")")
        Wait-Exit 1
    }

    Step "Смотрю опубликованные версии"
    $dirs = @()
    try {
        $c = Invoke-GH "GET" "/repos/$Repo/contents/versions"
        foreach ($e in @($c)) { if ($e.type -eq "dir") { $dirs += $e.name } }
    } catch { Warn2 "каталога versions/ ещё нет на GitHub" }
    $dirs = @($dirs | Where-Object { NormVer $_ } | Sort-Object { [version](NormVer $_) })
    if ($dirs.Count -gt 0) {
        Ok ("найдено версий: " + $dirs.Count + " (" + ($dirs -join ", ") + ")")
    } else { Warn2 "ни одной версии не опубликовано" }

    Step "Ищу мусорные файлы в versions/"
    $junk = @()
    try {
        $tree = Get-VersionsTree
        foreach ($it in @($tree.tree)) {
            if ($it.type -ne "blob") { continue }
            if ($it.path -notlike "versions/*") { continue }
            $rest = $it.path.Substring("versions/".Length)
            $parts = $rest -split "/"
            if ($parts.Count -ne 2) { continue }
            $dver = NormVer $parts[0]
            if (-not $dver) { continue }
            $name = $parts[1]
            # копии под старыми именами НЕ мусор: под ними обновляются старые сборки
            $keep = @("$AppName.exe", "$AppName.apk", "changelog.txt", "Blazix.exe", "Blazix.apk", "FluxHelper.exe", "FluxHelper.apk", "FluxControl.exe", "FluxControl.apk")
            if ($keep -notcontains $name) {
                $junk += ,@($it.path, $it.sha)
            }
        }
    } catch { Warn2 ("не удалось прочитать дерево: " + $_.Exception.Message) }
    if ($junk.Count -eq 0) { Ok "мусора нет, всё чисто" }
    else {
        Warn2 ("лишних файлов: " + $junk.Count + " (уберутся при следующей публикации):")
        foreach ($j in $junk) { Info $j[0] }
    }

    Step "Проверяю Firebase"
    $fbList = Find-FirebaseUrl ""
    if ($fbList.Count -eq 0) { Warn2 "Firebase URL не найден — впиши его в переменную `$FirebaseUrl в начале скрипта" }
    else {
        $fb = $fbList[0]
        if ($fbList.Count -gt 1) { Warn2 ("найдено несколько, беру первую: " + ($fbList -join " | ")) }
        Ok "URL: $fb"
        $fbl = Get-FirebaseLatest $fb
        if ($fbl) { Ok "latest в базе: $fbl" } else { Warn2 "не удалось прочитать latest (правила БД или нет сети)" }
    }

    Step "Проверяю, что файлы реально скачиваются"
    if ($dirs.Count -eq 0) { Warn2 "проверять нечего - версий нет" }
    else {
        $last = $dirs[-1]
        foreach ($name in @("$AppName.exe", "$AppName.apk", "changelog.txt")) {
            try {
                $r = Invoke-WebRequest -UseBasicParsing -Uri (RawUrl "versions/$last/$name")
                Ok ("versions/$last/$name  -  HTTP 200, " + [math]::Round($r.RawContentLength/1KB) + " КБ")
            } catch { Fail ("versions/$last/$name  -  НЕ скачивается (HTTP " + (HttpCode $_) + ")") }
        }
    }
    Step "Проверяю GitHub Release (постоянная ссылка)"
    try {
        $rel = Invoke-GH "GET" "/repos/$Repo/releases/latest"
        Ok ("последний релиз: " + $rel.tag_name + "  -  " + $rel.html_url)
        foreach ($a in @($rel.assets)) { Ok ("файл: " + $a.name + " (" + [math]::Round($a.size/1KB) + " КБ)") }
        Info "ссылка всегда на последнюю версию:"
        Info ("  " + "https://github.com/" + $Repo + "/releases/latest/download/" + $AppName + ".exe")
    } catch { Warn2 "релизов ещё нет - создадутся при следующей публикации" }

    Write-Host ""
    Write-Host "  Проверка завершена (режим -Check: ничего не публиковалось)." -ForegroundColor Gray
    exit 0
}

# ================================================================
#  ОСНОВНОЙ РЕЖИМ - полная публикация
# ================================================================
$script:StepTotal = 9
Banner

# ---------- [1/9] ключ и репозиторий ----------
Step "Проверяю ключ GitHub и репозиторий $Repo"
try {
    $null = Invoke-GH "GET" "/repos/$Repo"
    Ok "ключ работает, репозиторий доступен"
} catch {
    Fail ("ключ GitHub недействителен или нет доступа (HTTP " + (HttpCode $_) + ")")
    Fail "получи новый ключ на github.com и впиши его в переменную `$Token в начале скрипта"
    Wait-Exit 1
}

# ---------- [2/9] поиск собранных файлов ----------
Step "Ищу собранные файлы (EXE / APK)"
$ExePath = ""
$ApkPath = ""
$roots = @($ScriptDir)
$parentDir = Split-Path -Parent $ScriptDir
if ($parentDir -and (Test-Path $parentDir)) { $roots += $parentDir }
$all = @()
foreach ($r in $roots) {
    if (-not (Test-Path $r)) { continue }
    $all += Get-ChildItem -Path $r -Recurse -Depth 4 -File -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch '\\\.git\\|\\node_modules\\' }
}
$exes = @($all | Where-Object { $_.Extension -eq ".exe" -and $_.Length -gt 200KB -and $_.Name -notmatch 'unins|setup|installer|deploy|upgrade|\.old' -and $_.FullName -notmatch '\\versions\\|\\updates\\' })
$exe = $exes | Where-Object { $_.Name -eq "$AppName.exe" } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $exe) { $exe = $exes | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
if ($exe) { $ExePath = $exe.FullName }

$apks = @($all | Where-Object { $_.Extension -eq ".apk" -and $_.Length -gt 100KB })
$apk = $apks | Where-Object { $_.Name -eq "$AppName.apk" } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $apk) { $apk = $apks | Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
if ($apk) { $ApkPath = $apk.FullName }

$ExeVer = ""
if ($ExePath) {
    $fv = ""
    try { $fv = $exe.VersionInfo.FileVersion } catch { $fv = "" }
    $ExeVer = NormVer $fv
    $sz = [math]::Round($exe.Length/1KB)
    Ok ("EXE: " + $exe.Name + "  (" + $sz + " КБ" + $(if ($ExeVer) { ", внутренняя версия $ExeVer" } else { ", версии внутри нет" }) + ")")
    if ($ExePath -notlike "*$AppName*") { Warn2 "файл называется не FluxControl.exe - пользователи получат обновление под этим именем" }
} else {
    Fail "EXE не найден рядом со скриптом (ищу в папке скрипта и на уровень выше, глубина 4)"
    Fail "положи deploy.ps1 в папку проекта или собери приложение"
    Wait-Exit 1
}
if ($ApkPath) {
    $sz = [math]::Round($apk.Length/1KB)
    Ok ("APK: " + $apk.Name + "  (" + $sz + " КБ)")
} else {
    Warn2 "APK не найден - Android-версия публиковаться не будет"
}

# Firebase URL ищем сразу (нужен и для определения версии, и для шага 7)
$fbList = Find-FirebaseUrl $ExePath
$FbUrl = ""
if ($fbList.Count -gt 0) {
    $FbUrl = $fbList[0]
    if ($fbList.Count -gt 1) { Warn2 ("Firebase URL найдено несколько, беру первую: " + ($fbList -join " | ")) }
    Ok "Firebase URL найден: $FbUrl"
} else {
    Warn2 "Firebase URL не найден — Firebase не будет обновлён"
    Warn2 "впиши его в переменную `$FirebaseUrl в начале скрипта и запусти ещё раз"
}

# ---------- [3/9] текущая версия ----------
Step "Определяю текущую версию"
$current = ""
$srcName = ""
$fbl = ""
if ($FbUrl) { $fbl = Get-FirebaseLatest $FbUrl }
if ($fbl) {
    $current = $fbl; $srcName = "Firebase"
} else {
    $ghDirs = @()
    try {
        $c = Invoke-GH "GET" "/repos/$Repo/contents/versions"
        foreach ($e in @($c)) { if ($e.type -eq "dir") { $ghDirs += $e.name } }
    } catch {}
    $ghDirs = @($ghDirs | Where-Object { NormVer $_ } | Sort-Object { [version](NormVer $_) })
    if ($ghDirs.Count -gt 0) {
        $current = NormVer $ghDirs[-1]; $srcName = "GitHub versions/"
    } elseif ($ExeVer) {
        $current = $ExeVer; $srcName = "версия сборки"
    }
}
if ($current) { Ok "текущая версия: $current ($srcName)" }
else { Warn2 "текущую версию не удалось определить, начинаем с 1.0.0"; $current = "" }
$default = NextPatch $current
if (-not $current) { $default = "1.0.0" }

# ---------- [4/9] версия + описание ----------
Step "Версия публикации и описание изменений"
Write-Host ""
$ver = ""
if ($Version) {
    $v = NormVer $Version
    if (-not $v) { Fail "переданная версия '$Version' не похожа на X.Y.Z"; Wait-Exit 1 }
    $ver = $v
} else {
    for ($i = 0; $i -lt 3 -and (-not $ver); $i++) {
        $inp = Read-Host "  Введите версию для публикации (Enter — $default)"
        if ([string]::IsNullOrWhiteSpace($inp)) { $ver = $default; break }
        $v = NormVer $inp
        if ($v) { $ver = $v }
        else { Fail "не похоже на версию (пример: 1.7.2). Попробуй ещё раз." }
    }
    if (-not $ver) { $ver = $default }
}
Ok "публикуем версию: $ver"

if ($current -and ([version]$ver -lt [version]$current)) {
    if ($Force) { Warn2 "даунгрейд с $current на $ver (запущено с -Force, продолжаю)" }
    else {
        Fail "версия $ver МЕНЬШЕ текущей $current - пользователи такое обновление не увидят"
        Fail "запусти с -Force, если даунгрейд действительно нужен:  deploy.ps1 -Force"
        Wait-Exit 1
    }
}
if ($current -and ([version]$ver -eq [version]$current)) {
    Warn2 "версия $ver уже опубликована - файлы будут перезаписаны"
}
if ($ExeVer -and ($ExeVer -ne $ver)) {
    if ($Force) { Warn2 "внутренняя версия EXE ($ExeVer) не совпадает с публикуемой ($ver), продолжаю по -Force" }
    else {
        Fail "ВНИМАНИЕ: в собранном EXE зашита версия $ExeVer, а публикуем $ver"
        Fail "именно из-за этого приложение пишет «файл пошкоджений або стара версія»"
        Fail "пересобери EXE с версией $ver ИЛИ запусти с -Force, чтобы опубликовать как есть"
        Wait-Exit 1
    }
}

Write-Host ""
if ($Notes) {
    $note = $Notes
    Info "описание взято из параметра -Notes"
} else {
    $note = Read-Host "  Описание изменений (по-украински; несколько пунктов через | ; Enter — автоматически)"
}

$notesList = @(Build-NotesList $note)
$clText = Build-ChangelogText $ver $notesList
$clTmp = [IO.Path]::GetTempFileName()
$utf8 = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText($clTmp, $clText, $utf8)

Write-Host ""
Info "План публикации:"
Info ("  версия:    $ver")
Info ("  EXE:       " + $(if ($ExePath) { $exe.Name + " (" + [math]::Round($exe.Length/1KB) + " КБ)" } else { "нет" }))
Info ("  APK:       " + $(if ($ApkPath) { $apk.Name + " (" + [math]::Round($apk.Length/1KB) + " КБ)" } else { "нет" }))
Info ("  GitHub:    versions/$ver/  ($Repo)")
Info ("  Firebase:  " + $(if ($FbUrl) { $FbUrl } else { "не будет обновлён (URL не найден)" }))

# ---------- [5/9] чистка мусора в versions/ ----------
Step "Чищу файлы с незнакомыми именами в versions/ на GitHub"
$junk = @()
try {
    $tree = Get-VersionsTree
    foreach ($it in @($tree.tree)) {
        if ($it.type -ne "blob") { continue }
        if ($it.path -notlike "versions/*") { continue }
        $rest = $it.path.Substring("versions/".Length)
        $parts = $rest -split "/"
        if ($parts.Count -ne 2) { continue }
        $dver = NormVer $parts[0]
        if (-not $dver) { continue }
        $name = $parts[1]
        # копии под старыми именами НЕ мусор: под ними обновляются старые сборки
        $keep = @("$AppName.exe", "$AppName.apk", "changelog.txt", "Blazix.exe", "Blazix.apk", "FluxHelper.exe", "FluxHelper.apk", "FluxControl.exe", "FluxControl.apk")
        if ($keep -notcontains $name) {
            $junk += ,@($it.path, $it.sha)
        }
    }
} catch {
    Warn2 ("не удалось прочитать дерево репозитория: " + $_.Exception.Message)
}
if ($junk.Count -eq 0) {
    Ok "мусора нет, всё чисто"
} else {
    foreach ($j in $junk) {
        try {
            Delete-Remote $j[0] $j[1]
            Ok ("удалён: " + $j[0])
        } catch {
            Warn2 ("не удалён: " + $j[0] + " (HTTP " + (HttpCode $_) + ")")
        }
    }
}

# ---------- [6/9] публикация файлов ----------
Step "Публикую файлы в versions/$ver/"
# каталог versions/<ver>/ создаётся на GitHub автоматически первой загрузкой файла
$rawExe = RawUrl "versions/$ver/$AppName.exe"
$rawApk = RawUrl "versions/$ver/$AppName.apk"
$rawCl  = RawUrl "versions/$ver/changelog.txt"
if ($ExePath) {
    try { Upload-File $ExePath "versions/$ver/$AppName.exe" $ver; Ok "$AppName.exe загружен ($([math]::Round($exe.Length/1KB)) КБ)" }
    catch { Fail ("не удалось загрузить EXE: " + $_.Exception.Message); Wait-Exit 1 }
} else {
    Warn2 "EXE не найден - пропускаю"
}
if ($ApkPath) {
    try { Upload-File $ApkPath "versions/$ver/$AppName.apk" $ver; Ok "$AppName.apk загружен ($([math]::Round($apk.Length/1KB)) КБ)" }
    catch { Warn2 ("не удалось загрузить APK: " + $_.Exception.Message) }
} else {
    Warn2 "APK не найден - пропускаю (Android-пользователи останутся на старой версии)"
}
try { Upload-File $clTmp "versions/$ver/changelog.txt" $ver; Ok "changelog.txt загружен" }
catch { Warn2 ("не удалось загрузить changelog: " + $_.Exception.Message) }
# копии под старыми именами - чтобы могли обновиться сборки 1.5.3-1.7.0 (FluxControl) и 1.5.4 (Blazix)
if ($ExePath) {
    foreach ($oldName in @("Blazix.exe", "FluxControl.exe")) {
        try { Upload-File $ExePath "versions/$ver/$oldName" $ver; Ok "$oldName загружен (копия EXE для старых сборок)" }
        catch { Warn2 ("не удалось загрузить " + $oldName + ": " + $_.Exception.Message) }
    }
}
if ($ApkPath) {
    foreach ($oldName in @("Blazix.apk", "FluxControl.apk")) {
        try { Upload-File $ApkPath "versions/$ver/$oldName" $ver; Ok "$oldName загружен (копия APK для старых сборок)" }
        catch { Warn2 ("не удалось загрузить " + $oldName + ": " + $_.Exception.Message) }
    }
}

# ---------- [7/9] Firebase ----------
Step "Обновляю Firebase (update/latest + update/notes)"
if ($FbUrl) {
    try {
        Update-Firebase $FbUrl $ver $notesList
        $check = Get-FirebaseLatest $FbUrl
        if ($check -eq $ver) { Ok "latest = $ver, notes записаны ($(@($notesList).Count) шт.)" }
        else { Warn2 "записал, но при проверке latest = '$check' (ожидал $ver)" }
    } catch {
        Warn2 ("Firebase не обновился: " + $_.Exception.Message)
        Warn2 "файлы на GitHub уже есть; проверь правила базы данных"
    }
} else {
    Warn2 "Firebase URL не найден - пропускаю (приложения не увидят обновление!)"
    Warn2 "впиши URL в `$FirebaseUrl в начале скрипта и запусти ещё раз"
}

# ---------- [8/9] GitHub Release ----------
Step "Создаю GitHub Release (постоянная ссылка на скачивание)"
$relAssets = @{}
if ($ExePath) { $relAssets["$AppName.exe"] = $ExePath }
if ($ApkPath) { $relAssets["$AppName.apk"] = $ApkPath }
if ($relAssets.Count -gt 0) {
    try {
        $rel = Publish-Release $ver $clText $relAssets
        Ok ("релиз v$ver готов: " + $rel.html_url)
    } catch {
        Warn2 ("релиз не создался: " + $_.Exception.Message)
    }
} else {
    Warn2 "нечего приложить к релизу"
}

# ---------- [9/9] финальная проверка ----------
Step "Проверяю, что всё реально скачивается"
$allOk = $true
foreach ($pair in @(@("EXE", $rawExe, $ExePath), @("APK", $rawApk, $ApkPath))) {
    $kind = $pair[0]; $url = $pair[1]; $local = $pair[2]
    if (-not $local) { continue }
    try {
        $r = Invoke-WebRequest -UseBasicParsing -Uri $url
        $same = $true
        try { if ($r.RawContentLength -ne ([IO.FileInfo]$local).Length) { $same = $false } } catch {}
        if ($same) { Ok ("$kind скачивается, размер совпадает: " + [math]::Round($r.RawContentLength/1KB) + " КБ") }
        else { Warn2 "$kind скачивается, но размер отличается от локального файла" }
    } catch {
        $allOk = $false
        Fail ("$kind НЕ скачивается (HTTP " + (HttpCode $_) + "): $url")
    }
}
try {
    $r = Invoke-WebRequest -UseBasicParsing -Uri $rawCl
    Ok "changelog.txt скачивается"
} catch { Warn2 "changelog.txt не скачивается (появится чуть позже - GitHub кэширует)" }

Write-Host ""
Write-Host "  ==========================================================" -ForegroundColor DarkGray
if ($allOk) {
    Write-Host "   ГОТОВО: $AppName $ver опубликована" -ForegroundColor Green
} else {
    Write-Host "   ОПУБЛИКОВАНО С ОШИБКАМИ: $AppName $ver" -ForegroundColor Yellow
}
Write-Host "  ==========================================================" -ForegroundColor DarkGray
Info "EXE:  $rawExe"
if ($ApkPath) { Info "APK:  $rawApk" }
if ($FbUrl)   { Info "Firebase latest: $ver" }
Write-Host ""
Write-Host "  Постоянные ссылки (всегда последняя версия):" -ForegroundColor White
Info ("страница:  https://github.com/" + $Repo + "/releases/latest")
Info ("EXE:       https://github.com/" + $Repo + "/releases/latest/download/" + $AppName + ".exe")
Info ("APK:       https://github.com/" + $Repo + "/releases/latest/download/" + $AppName + ".apk")
Write-Host ""
Write-Host "  Как проверить: запусти приложение и подожди 1-2 минуты -" -ForegroundColor White
Write-Host "  само появится окно «Доступне оновлення». Установка пройдёт сама." -ForegroundColor White

Remove-Item $clTmp -ErrorAction SilentlyContinue
Wait-Exit 0
