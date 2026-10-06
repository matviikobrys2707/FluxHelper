@echo off
setlocal EnableExtensions
chcp 65001 >nul
title FluxHelper - сборка и деплой
cd /d "%~dp0"

rem ================================================================
rem  FluxHelper - ОДИН скрипт: сборка EXE, сборка APK, публикация.
rem  Все инструменты скачиваются САМИ в папку tools\ (один раз).
rem ================================================================

set "TOOLS=%~dp0tools"
set "LLVMDIR=%TOOLS%\llvm-mingw-20240917-ucrt-x86_64"
set "BTDIR=%TOOLS%\android-14"
set "PFDIR=%TOOLS%\android-13"
set "JDKDIR="
set "PS=powershell -NoProfile -ExecutionPolicy Bypass"
set "VER="

if not exist "src\main.cpp" (
    echo [ОШИБКА] Запусти Build.bat из папки пакета FluxHelper ^(рядом должна быть папка src^)
    pause
    exit /b 1
)

:menu
cls
echo.
echo   ==========================================================
echo      FluxHelper  -  СБОРКА И ПУБЛИКАЦИЯ
echo   ==========================================================
for /f %%v in ('%PS% -File tools\ps\get_version.ps1') do set "CURVER=%%v"
echo.
echo     Версия в исходниках:  %CURVER%
echo     Собранные файлы:      prebuilt\FluxHelper.exe / .apk
echo.
echo     [1] ПОЛНЫЙ ДЕПЛОЙ - собрать EXE + APK и опубликовать на GitHub
echo     [2] Собрать только EXE (без публикации)
echo     [3] Собрать только APK (без публикации)
echo     [4] Опубликовать уже собранные файлы (без сборки)
echo     [5] Только проверка - ничего не публикует
echo     [0] Выход
echo.
set "MENU="
set /p "MENU=  Выбери пункт и нажми Enter: "
if "%MENU%"=="1" goto opt_full
if "%MENU%"=="2" goto opt_exe
if "%MENU%"=="3" goto opt_apk
if "%MENU%"=="4" goto opt_deploy
if "%MENU%"=="5" goto opt_check
if "%MENU%"=="0" exit /b 0
goto menu

rem ---------------- [1] полный деплой ----------------
:opt_full
call :nextver
echo.
echo   Версия для сборки и публикации. Enter = следующая (%NEXTVER%)
set "VER="
set /p "VER=  Версия: "
if "%VER%"=="" set "VER=%NEXTVER%"
call :setver || goto menu
call :build_exe
if errorlevel 1 goto menu
call :build_apk
if errorlevel 1 goto menu
set "DEPLOY_ARGS=-Version %VER%"
call :do_deploy
echo.
pause
goto menu

rem ---------------- [2] только EXE ----------------
:opt_exe
call :curver
echo.
echo   Версия для сборки EXE. Enter = оставить %CURVER%
set "VER="
set /p "VER=  Версия: "
if not "%VER%"=="" call :setver
call :build_exe
echo.
pause
goto menu

rem ---------------- [3] только APK ----------------
:opt_apk
call :curver
echo.
echo   Версия для сборки APK. Enter = оставить %CURVER%
set "VER="
set /p "VER=  Версия: "
if not "%VER%"=="" call :setver
call :build_apk
echo.
pause
goto menu

rem ---------------- [4] деплой без сборки ----------------
:opt_deploy
set "DEPLOY_ARGS="
call :do_deploy
echo.
pause
goto menu

rem ---------------- [5] проверка ----------------
:opt_check
echo.
%PS% -File deploy\deploy.ps1 -Check
echo.
pause
goto menu

rem ================= функции =================

:curver
for /f %%v in ('%PS% -File tools\ps\get_version.ps1') do set "CURVER=%%v"
goto :eof

:nextver
for /f %%n in ('%PS% -File tools\ps\get_version.ps1 -Next') do set "NEXTVER=%%n"
if "%NEXTVER%"=="" call :curver & set "NEXTVER=%CURVER%"
goto :eof

:setver
%PS% -File tools\ps\set_version.ps1 -V %VER%
goto :eof

:do_deploy
echo.
echo   ---------- [ДЕПЛОЙ НА GITHUB] ----------
%PS% -File deploy\deploy.ps1 %DEPLOY_ARGS%
goto :eof

rem ---------- скачивание (curl или PowerShell) ----------
:dl
rem %1 = URL, %2 = куда сохранить
where curl >nul 2>&1
if not errorlevel 1 (
    curl -L --fail --retry 3 --progress-bar -o "%~2" "%~1"
    goto :eof
)
%PS% -Command "[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%~1' -OutFile '%~2'"
goto :eof

rem ---------- llvm-mingw (компилятор C++) ----------
:get_llvm
if exist "%LLVMDIR%\bin\x86_64-w64-mingw32-g++.exe" goto :eof
echo.
echo   Скачиваю llvm-mingw - компилятор C++ (~142 МБ, один раз)...
if not exist "%TOOLS%" mkdir "%TOOLS%"
call :dl "https://github.com/mstorsjo/llvm-mingw/releases/download/20240917/llvm-mingw-20240917-ucrt-x86_64.zip" "%TOOLS%\llvm.zip"
if errorlevel 1 ( echo   [ОШИБКА] не удалось скачать llvm-mingw & exit /b 1 )
echo   Распаковываю...
tar -xf "%TOOLS%\llvm.zip" -C "%TOOLS%"
if errorlevel 1 ( echo   [ОШИБКА] не удалось распаковать llvm.zip & exit /b 1 )
del /q "%TOOLS%\llvm.zip"
if exist "%LLVMDIR%\bin\x86_64-w64-mingw32-g++.exe" goto :eof
echo   [ОШИБКА] компилятор не найден после распаковки
exit /b 1

rem ---------- Java 17 (для сборки APK) ----------
:get_jdk
if defined JDKDIR if exist "%JDKDIR%\bin\java.exe" goto :eof
set "JDKDIR="
for /d %%d in ("%TOOLS%\jdk*") do if exist "%%d\bin\java.exe" set "JDKDIR=%%d"
if not defined JDKDIR for /d %%d in ("%TOOLS%\openjdk*") do if exist "%%d\bin\java.exe" set "JDKDIR=%%d"
if defined JDKDIR goto :eof
echo.
echo   Скачиваю Java 17 - Temurin JRE (~45 МБ, один раз)...
if not exist "%TOOLS%" mkdir "%TOOLS%"
call :dl "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jre/hotspot/normal/eclipse" "%TOOLS%\jdk.zip"
if errorlevel 1 ( echo   [ОШИБКА] не удалось скачать Java & exit /b 1 )
echo   Распаковываю...
tar -xf "%TOOLS%\jdk.zip" -C "%TOOLS%"
if errorlevel 1 ( echo   [ОШИБКА] не удалось распаковать jdk.zip & exit /b 1 )
del /q "%TOOLS%\jdk.zip"
for /d %%d in ("%TOOLS%\jdk*") do if exist "%%d\bin\java.exe" set "JDKDIR=%%d"
if not defined JDKDIR for /d %%d in ("%TOOLS%\openjdk*") do if exist "%%d\bin\java.exe" set "JDKDIR=%%d"
if defined JDKDIR goto :eof
echo   [ОШИБКА] java.exe не найден после распаковки
exit /b 1

rem ---------- Android build-tools (aapt2, d8, zipalign, apksigner) ----------
:get_bt
if exist "%BTDIR%\aapt2.exe" goto :eof
echo.
echo   Скачиваю Android build-tools r34 (~56 МБ, один раз)...
if not exist "%TOOLS%" mkdir "%TOOLS%"
call :dl "https://dl.google.com/android/repository/build-tools_r34-windows.zip" "%TOOLS%\bt.zip"
if errorlevel 1 ( echo   [ОШИБКА] не удалось скачать build-tools & exit /b 1 )
echo   Распаковываю...
tar -xf "%TOOLS%\bt.zip" -C "%TOOLS%"
if errorlevel 1 ( echo   [ОШИБКА] не удалось распаковать bt.zip & exit /b 1 )
del /q "%TOOLS%\bt.zip"
if exist "%BTDIR%\aapt2.exe" goto :eof
echo   [ОШИБКА] aapt2.exe не найден после распаковки
exit /b 1

rem ---------- Android platform 33 (android.jar) ----------
:get_pf
if exist "%PFDIR%\android.jar" goto :eof
echo.
echo   Скачиваю Android platform 33 (~64 МБ, один раз)...
if not exist "%TOOLS%" mkdir "%TOOLS%"
call :dl "https://dl.google.com/android/repository/platform-33_r02.zip" "%TOOLS%\pf.zip"
if errorlevel 1 ( echo   [ОШИБКА] не удалось скачать platform & exit /b 1 )
echo   Распаковываю...
tar -xf "%TOOLS%\pf.zip" -C "%TOOLS%"
if errorlevel 1 ( echo   [ОШИБКА] не удалось распаковать pf.zip & exit /b 1 )
del /q "%TOOLS%\pf.zip"
if exist "%PFDIR%\android.jar" goto :eof
echo   [ОШИБКА] android.jar не найден после распаковки
exit /b 1

rem ---------- СБОРКА EXE ----------
:build_exe
echo.
echo   ================== [СБОРКА EXE] ==================
call :get_llvm
if errorlevel 1 exit /b 1
if not exist "src\WebView2Loader.dll" copy /y "%TOOLS%\WebView2Loader.dll" "src\WebView2Loader.dll" >nul
if not exist "src\build" mkdir "src\build"
echo   [1/3] Ресурсы: иконка + VERSIONINFO...
pushd src
"%LLVMDIR%\bin\x86_64-w64-mingw32-windres.exe" app.rc -O coff -o build\app.res
if errorlevel 1 ( popd & echo   [ОШИБКА] windres & exit /b 1 )
echo   [2/3] Компиляция...
"%LLVMDIR%\bin\x86_64-w64-mingw32-g++.exe" -std=gnu++17 -O2 -fms-extensions -municode -mwindows -DUNICODE -D_UNICODE -I"..\tools\webview2\include" -Icompat main.cpp build\app.res -o build\FluxHelper.exe -lole32 -lshell32 -luser32 -lgdi32 -ladvapi32 -luuid -ldwmapi -lwinhttp -lgdiplus
if errorlevel 1 ( popd & echo   [ОШИБКА] компиляция & exit /b 1 )
popd
if not exist "prebuilt" mkdir "prebuilt"
copy /y "src\build\FluxHelper.exe" "prebuilt\FluxHelper.exe" >nul
for /f %%s in ('%PS% -Command "(Get-Item 'prebuilt\FluxHelper.exe').Length"') do set /a EXEKB=%%s/1024
echo   [3/3] Готово: prebuilt\FluxHelper.exe  (%EXEKB% КБ)
goto :eof

rem ---------- СБОРКА APK ----------
:build_apk
echo.
echo   ================== [СБОРКА APK] ==================
call :get_jdk
if errorlevel 1 exit /b 1
call :get_bt
if errorlevel 1 exit /b 1
call :get_pf
if errorlevel 1 exit /b 1
set "JAVA_HOME=%JDKDIR%"
set "PATH=%JDKDIR%\bin;%PATH%"
if "%VER%"=="" call :curver & set "VER=%CURVER%"
for /f %%c in ('%PS% -Command "$v='%VER%'.Split('.'); Write-Output ([int]$v[0]*1000+[int]$v[1]*100+[int]$v[2])"') do set "VC=%%c"
echo   Версия APK: %VER% (versionCode %VC%)
if exist "apk\build" rmdir /s /q "apk\build"
%PS% -File tools\ps\inject_apk.ps1 -V %VER%
if errorlevel 1 exit /b 1
mkdir "apk\build\gen" 2>nul
mkdir "apk\build\dex" 2>nul
pushd apk
echo   [1/5] aapt2: ресурсы и манифест...
"%BTDIR%\aapt2.exe" compile --dir res -o build\res.zip
if errorlevel 1 ( popd & echo   [ОШИБКА] aapt2 compile & exit /b 1 )
"%BTDIR%\aapt2.exe" link -o build\unsigned.apk -I "%PFDIR%\android.jar" --manifest AndroidManifest.xml --min-sdk-version 24 --target-sdk-version 34 --version-code %VC% --version-name %VER% --java build\gen -A build\assets --auto-add-overlay build\res.zip
if errorlevel 1 ( popd & echo   [ОШИБКА] aapt2 link & exit /b 1 )
echo   [2/5] Компиляция java...
"%JDKDIR%\bin\java.exe" -jar "%TOOLS%\ecj.jar" -source 1.8 -target 1.8 -nowarn -cp "%PFDIR%\android.jar" -d build\classes src\com\fluxhelper\app\MainActivity.java src\com\fluxhelper\app\UpdProvider.java src\com\fluxhelper\app\NotifReceiver.java src\com\fluxhelper\app\Notifs.java src\com\fluxhelper\app\BootReceiver.java build\gen\com\fluxhelper\app\R.java
if errorlevel 1 ( popd & echo   [ОШИБКА] компиляция java & exit /b 1 )
echo   [3/5] d8: classes.dex...
dir /s /b build\classes\*.class > build\classlist.txt
call "%BTDIR%\d8.bat" --release --lib "%PFDIR%\android.jar" --min-api 24 --output build\dex @build\classlist.txt
if not exist "build\dex\classes.dex" ( popd & echo   [ОШИБКА] d8 не создал classes.dex & exit /b 1 )
echo   [4/5] Сборка apk...
%PS% -File "%TOOLS%\ps\add_dex.ps1"
if errorlevel 1 ( popd & exit /b 1 )
"%BTDIR%\zipalign.exe" -f 4 build\unsigned.apk build\aligned.apk
if errorlevel 1 ( popd & echo   [ОШИБКА] zipalign & exit /b 1 )
echo   [5/5] Подпись (ключ keys\fluxhelper.keystore)...
call "%BTDIR%\apksigner.bat" sign --ks "..\keys\fluxhelper.keystore" --ks-pass pass:fluxhelper --key-pass pass:fluxhelper --out build\FluxHelper.apk build\aligned.apk
if errorlevel 1 ( popd & echo   [ОШИБКА] apksigner & exit /b 1 )
call "%BTDIR%\apksigner.bat" verify "..\apk\build\FluxHelper.apk"
if errorlevel 1 ( popd & echo   [ОШИБКА] подпись не прошла проверку & exit /b 1 )
popd
if not exist "prebuilt" mkdir "prebuilt"
copy /y "apk\build\FluxHelper.apk" "prebuilt\FluxHelper.apk" >nul
echo   Готово: prebuilt\FluxHelper.apk
goto :eof
