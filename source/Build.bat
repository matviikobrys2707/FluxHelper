@echo off
setlocal EnableExtensions
title FluxHelper - build and deploy
cd /d "%~dp0"

rem ================================================================
rem  FluxHelper - ONE script: build EXE, build APK, publish.
rem  All tools are downloaded AUTOMATICALLY into tools\ (once).
rem  Text is ASCII-only on purpose: cmd batch files break when the
rem  console codepage differs from the file encoding.
rem ================================================================

set "TOOLS=%~dp0tools"
set "LLVMDIR=%TOOLS%\llvm-mingw-20240917-ucrt-x86_64"
set "BTDIR=%TOOLS%\android-14"
set "PFDIR=%TOOLS%\android-13"
set "WV2INC=%TOOLS%\webview2\include\WebView2.h"
set "WV2DLL=%TOOLS%\webview2\WebView2Loader.dll"
set "ECJJAR=%TOOLS%\ecj.jar"
set "KEYS=%~dp0keys\fluxhelper.keystore"
set "PS=powershell -NoProfile -ExecutionPolicy Bypass"
set "VER="
set "CURVER="
set "NOTES="

if not exist "src\main.cpp" (
    echo.
    echo   [ERROR] Run Build.bat from the FluxHelper package folder
    echo           ^(the folder must contain src\ and apk\^)
    echo.
    pause
    exit /b 1
)

:menu
cls
call :curver
echo.
echo   ==========================================================
echo      FluxHelper  -  BUILD AND PUBLISH          by Blazix
echo   ==========================================================
echo.
echo     Version in sources:  %CURVER%
echo     Built files:         prebuilt\FluxHelper.exe / .apk
echo.
echo     [1] FULL DEPLOY - build EXE + APK and publish to GitHub
echo     [2] Build EXE only ^(no publish^)
echo     [3] Build APK only ^(no publish^)
echo     [4] Publish already built files ^(no build^)
echo     [5] Check only - publishes nothing
echo     [0] Exit
echo.
set "MENU="
set /p "MENU=  Choose an option and press Enter: "
if "%MENU%"=="1" goto opt_full
if "%MENU%"=="2" goto opt_exe
if "%MENU%"=="3" goto opt_apk
if "%MENU%"=="4" goto opt_deploy
if "%MENU%"=="5" goto opt_check
if "%MENU%"=="0" exit /b 0
goto menu

rem ---------------- [1] full deploy ----------------
:opt_full
call :nextver
echo.
echo   Version to build and publish. Enter = next (%NEXTVER%)
set "VER="
set /p "VER=  Version: "
if "%VER%"=="" set "VER=%NEXTVER%"
call :asknotes
call :setver
if errorlevel 1 goto menu
call :build_exe
if errorlevel 1 goto menu
call :build_apk
if errorlevel 1 goto menu
call :do_deploy
echo.
pause
goto menu

rem ---------------- [2] EXE only ----------------
:opt_exe
call :curver
echo.
echo   Version for the EXE build. Enter = keep %CURVER%
set "VER="
set /p "VER=  Version: "
if not "%VER%"=="" call :setver
call :build_exe
echo.
pause
goto menu

rem ---------------- [3] APK only ----------------
:opt_apk
call :curver
echo.
echo   Version for the APK build. Enter = keep %CURVER%
set "VER="
set /p "VER=  Version: "
if not "%VER%"=="" call :setver
call :build_apk
echo.
pause
goto menu

rem ---------------- [4] publish without build ----------------
:opt_deploy
call :asknotes
call :do_deploy
echo.
pause
goto menu

rem ---------------- [5] check only ----------------
:opt_check
echo.
%PS% -File "deploy\deploy.ps1" -Check
echo.
pause
goto menu

rem ================= functions =================

:curver
set "CURVER=?"
for /f "usebackq delims=" %%v in (`%PS% -File "tools\ps\get_version.ps1"`) do set "CURVER=%%v"
goto :eof

:nextver
set "NEXTVER="
for /f "usebackq delims=" %%n in (`%PS% -File "tools\ps\get_version.ps1" -Next`) do set "NEXTVER=%%n"
if "%NEXTVER%"=="" call :curver
if "%NEXTVER%"=="" set "NEXTVER=%CURVER%"
goto :eof

:asknotes
echo.
echo   Changelog lines for the update window (Ukrainian).
echo   Example: + novyi dyzain nalashtuvan | + rezhym rozrobnyka
echo   Separate several items with | . Press Enter to skip.
set "NOTES="
set /p "NOTES=  Notes: "
goto :eof

:setver
%PS% -File "tools\ps\set_version.ps1" -V %VER%
if errorlevel 1 (
    echo   [ERROR] could not write version %VER%
    pause
    exit /b 1
)
goto :eof

:do_deploy
echo.
echo   ---------- [DEPLOY TO GITHUB] ----------
if not exist "deploy\deploy.ps1" (
    echo   [ERROR] deploy\deploy.ps1 not found.
    echo   This file is in the full package zip. Publish manually or get the full pack.
    goto :eof
)
rem  check that the GitHub token was filled in
findstr /c:"REDACTED" "deploy\deploy.ps1" >nul 2>&1
if not errorlevel 1 (
    echo   [WARN] deploy\deploy.ps1 has a REDACTED GitHub token.
    echo          Open deploy\deploy.ps1 and paste your real token into $Token.
)
if "%NOTES%"=="" (
    %PS% -File "deploy\deploy.ps1" -Version %VER%
) else (
    %PS% -File "deploy\deploy.ps1" -Version %VER% -Notes "%NOTES%"
)
goto :eof

rem ---------- download (curl or PowerShell) ----------
:dl
rem %1 = URL, %2 = destination
where curl >nul 2>&1
if not errorlevel 1 (
    curl -L --fail --retry 3 --progress-bar -o "%~2" "%~1"
    exit /b %errorlevel%
)
%PS% -Command "[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%~1' -OutFile '%~2'"
exit /b %errorlevel%

rem ---------- llvm-mingw (C++ compiler for the EXE) ----------
:get_llvm
if exist "%LLVMDIR%\bin\x86_64-w64-mingw32-g++.exe" exit /b 0
echo.
echo   Downloading llvm-mingw - C++ compiler (~142 MB, once)...
if not exist "%TOOLS%" mkdir "%TOOLS%"
call :dl "https://github.com/mstorsjo/llvm-mingw/releases/download/20240917/llvm-mingw-20240917-ucrt-x86_64.zip" "%TOOLS%\llvm.zip"
if errorlevel 1 ( echo   [ERROR] llvm-mingw download failed & exit /b 1 )
echo   Extracting...
tar -xf "%TOOLS%\llvm.zip" -C "%TOOLS%"
if errorlevel 1 ( echo   [ERROR] could not extract llvm.zip & exit /b 1 )
del /q "%TOOLS%\llvm.zip" >nul 2>&1
if exist "%LLVMDIR%\bin\x86_64-w64-mingw32-g++.exe" exit /b 0
echo   [ERROR] compiler not found after extraction
exit /b 1

rem ---------- Java 17 (for the APK build) ----------
:get_jdk
set "JDKDIR="
for /d %%d in ("%TOOLS%\jdk*") do if exist "%%d\bin\java.exe" set "JDKDIR=%%d"
if not defined JDKDIR for /d %%d in ("%TOOLS%\openjdk*") do if exist "%%d\bin\java.exe" set "JDKDIR=%%d"
if defined JDKDIR exit /b 0
echo.
echo   Downloading Java 17 - Temurin JRE (~45 MB, once)...
if not exist "%TOOLS%" mkdir "%TOOLS%"
call :dl "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jre/hotspot/normal/eclipse" "%TOOLS%\jdk.zip"
if errorlevel 1 ( echo   [ERROR] Java download failed & exit /b 1 )
echo   Extracting...
tar -xf "%TOOLS%\jdk.zip" -C "%TOOLS%"
if errorlevel 1 ( echo   [ERROR] could not extract jdk.zip & exit /b 1 )
del /q "%TOOLS%\jdk.zip" >nul 2>&1
for /d %%d in ("%TOOLS%\jdk*") do if exist "%%d\bin\java.exe" set "JDKDIR=%%d"
if not defined JDKDIR for /d %%d in ("%TOOLS%\openjdk*") do if exist "%%d\bin\java.exe" set "JDKDIR=%%d"
if defined JDKDIR exit /b 0
echo   [ERROR] java.exe not found after extraction
exit /b 1

rem ---------- Android build-tools (aapt2, d8, zipalign, apksigner) ----------
:get_bt
if exist "%BTDIR%\aapt2.exe" exit /b 0
echo.
echo   Downloading Android build-tools r34 (~56 MB, once)...
if not exist "%TOOLS%" mkdir "%TOOLS%"
call :dl "https://dl.google.com/android/repository/build-tools_r34-windows.zip" "%TOOLS%\bt.zip"
if errorlevel 1 ( echo   [ERROR] build-tools download failed & exit /b 1 )
echo   Extracting...
tar -xf "%TOOLS%\bt.zip" -C "%TOOLS%"
if errorlevel 1 ( echo   [ERROR] could not extract bt.zip & exit /b 1 )
del /q "%TOOLS%\bt.zip" >nul 2>&1
if exist "%BTDIR%\aapt2.exe" exit /b 0
echo   [ERROR] aapt2.exe not found after extraction
exit /b 1

rem ---------- Android platform 33 (android.jar) ----------
:get_pf
if exist "%PFDIR%\android.jar" exit /b 0
echo.
echo   Downloading Android platform 33 (~64 MB, once)...
if not exist "%TOOLS%" mkdir "%TOOLS%"
call :dl "https://dl.google.com/android/repository/platform-33_r02.zip" "%TOOLS%\pf.zip"
if errorlevel 1 ( echo   [ERROR] platform download failed & exit /b 1 )
echo   Extracting...
tar -xf "%TOOLS%\pf.zip" -C "%TOOLS%"
if errorlevel 1 ( echo   [ERROR] could not extract pf.zip & exit /b 1 )
del /q "%TOOLS%\pf.zip" >nul 2>&1
if exist "%PFDIR%\android.jar" exit /b 0
echo   [ERROR] android.jar not found after extraction
exit /b 1

rem ---------- WebView2 SDK (shipped in the pack; download if missing) ----------
:get_wv2
if exist "%WV2INC%" if exist "%WV2DLL%" exit /b 0
echo.
echo   Downloading WebView2 SDK (NuGet, ~5 MB, once)...
if not exist "%TOOLS%" mkdir "%TOOLS%"
call :dl "https://www.nuget.org/api/v2/package/Microsoft.Web.WebView2" "%TOOLS%\wv2.zip"
if errorlevel 1 ( echo   [ERROR] WebView2 SDK download failed & exit /b 1 )
if not exist "%TOOLS%\webview2\include" mkdir "%TOOLS%\webview2\include"
tar -xf "%TOOLS%\wv2.zip" -C "%TOOLS%\wv2tmp" 2>nul || ( mkdir "%TOOLS%\wv2tmp" & tar -xf "%TOOLS%\wv2.zip" -C "%TOOLS%\wv2tmp" )
copy /y "%TOOLS%\wv2tmp\build\native\include\WebView2.h" "%WV2INC%" >nul
copy /y "%TOOLS%\wv2tmp\build\native\x64\WebView2Loader.dll" "%WV2DLL%" >nul
del /q "%TOOLS%\wv2.zip" >nul 2>&1
if exist "%WV2INC%" if exist "%WV2DLL%" exit /b 0
echo   [ERROR] WebView2.h not found after extraction
exit /b 1

rem ---------- ecj.jar (Java compiler, shipped in the pack) ----------
:get_ecj
if exist "%ECJJAR%" exit /b 0
echo.
echo   Downloading ecj.jar (Eclipse Java compiler, ~3 MB, once)...
if not exist "%TOOLS%" mkdir "%TOOLS%"
call :dl "https://repo1.maven.org/maven2/org/eclipse/jdt/ecj/3.33.0/ecj-3.33.0.jar" "%ECJJAR%"
if errorlevel 1 ( echo   [ERROR] ecj.jar download failed & exit /b 1 )
exit /b 0

rem ---------- signing keystore ----------
:get_key
if exist "%KEYS%" exit /b 0
echo.
echo   [WARN] keys\fluxhelper.keystore NOT FOUND - a NEW key will be created.
echo   APKs built with a NEW key do NOT install over an app signed with
echo   another key ^(the phone asks to delete the old app first^).
echo   Keep keys\fluxhelper.keystore from your full package to avoid this.
call :get_jdk
if errorlevel 1 exit /b 1
if not exist "keys" mkdir "keys"
"%JDKDIR%\bin\keytool.exe" -genkeypair -v -keystore "%KEYS%" -storetype PKCS12 -alias fluxhelper -keyalg RSA -keysize 2048 -validity 10950 -storepass fluxhelper -keypass fluxhelper -dname "CN=FluxHelper, OU=FluxHelper, O=Blazix, L=Kyiv, C=UA"
if errorlevel 1 ( echo   [ERROR] keytool failed & exit /b 1 )
echo   OK   keystore created: keys\fluxhelper.keystore (password: fluxhelper)
exit /b 0

rem ---------- EXE BUILD ----------
:build_exe
echo.
echo   ================== [EXE BUILD] ==================
call :get_llvm
if errorlevel 1 exit /b 1
call :get_wv2
if errorlevel 1 exit /b 1
if not exist "src\build" mkdir "src\build"
copy /y "%WV2DLL%" "src\WebView2Loader.dll" >nul
echo   [1/3] Resources: icon + VERSIONINFO...
pushd src
"%LLVMDIR%\bin\x86_64-w64-mingw32-windres.exe" app.rc -O coff -o build\app.res
if errorlevel 1 ( popd & echo   [ERROR] windres failed & exit /b 1 )
echo   [2/3] Compiling...
"%LLVMDIR%\bin\x86_64-w64-mingw32-g++.exe" -std=gnu++17 -O2 -fms-extensions -municode -mwindows -DUNICODE -D_UNICODE -I"..\tools\webview2\include" -Icompat main.cpp build\app.res -o build\FluxHelper.exe -lole32 -lshell32 -luser32 -lgdi32 -ladvapi32 -luuid -ldwmapi -lwinhttp -lgdiplus
if errorlevel 1 ( popd & echo   [ERROR] compilation failed & exit /b 1 )
popd
if not exist "prebuilt" mkdir "prebuilt"
copy /y "src\build\FluxHelper.exe" "prebuilt\FluxHelper.exe" >nul
echo   [3/3] DONE: prebuilt\FluxHelper.exe
exit /b 0

rem ---------- APK BUILD ----------
:build_apk
echo.
echo   ================== [APK BUILD] ==================
call :get_jdk
if errorlevel 1 exit /b 1
call :get_bt
if errorlevel 1 exit /b 1
call :get_pf
if errorlevel 1 exit /b 1
call :get_ecj
if errorlevel 1 exit /b 1
call :get_key
if errorlevel 1 exit /b 1
set "JAVA_HOME=%JDKDIR%"
set "PATH=%JDKDIR%\bin;%PATH%"
if "%VER%"=="" call :curver
if "%VER%"=="" set "VER=%CURVER%"
for /f "tokens=1-3 delims=." %%a in ("%VER%") do set /a VC=%%a*1000+%%b*100+%%c
echo   APK version: %VER% (versionCode %VC%)
if exist "apk\build" rmdir /s /q "apk\build"
%PS% -File "tools\ps\inject_apk.ps1" -V %VER%
if errorlevel 1 exit /b 1
mkdir "apk\build\gen" 2>nul
mkdir "apk\build\dex" 2>nul
pushd apk
echo   [1/5] aapt2: resources + manifest...
"%BTDIR%\aapt2.exe" compile --dir res -o build\res.zip
if errorlevel 1 ( popd & echo   [ERROR] aapt2 compile failed & exit /b 1 )
"%BTDIR%\aapt2.exe" link -o build\unsigned.apk -I "%PFDIR%\android.jar" --manifest AndroidManifest.xml --min-sdk-version 24 --target-sdk-version 34 --version-code %VC% --version-name %VER% --java build\gen -A build\assets --auto-add-overlay build\res.zip
if errorlevel 1 ( popd & echo   [ERROR] aapt2 link failed & exit /b 1 )
echo   [2/5] Compiling java...
"%JDKDIR%\bin\java.exe" -jar "%ECJJAR%" -source 1.8 -target 1.8 -nowarn -cp "%PFDIR%\android.jar" -d build\classes src\com\fluxhelper\app\MainActivity.java src\com\fluxhelper\app\UpdProvider.java src\com\fluxhelper\app\NotifReceiver.java src\com\fluxhelper\app\Notifs.java src\com\fluxhelper\app\BootReceiver.java build\gen\com\fluxhelper\app\R.java
if errorlevel 1 ( popd & echo   [ERROR] java compilation failed & exit /b 1 )
echo   [3/5] d8: classes.dex...
dir /s /b build\classes\*.class > build\classlist.txt
call "%BTDIR%\d8.bat" --release --lib "%PFDIR%\android.jar" --min-api 24 --output build\dex @build\classlist.txt
if not exist "build\dex\classes.dex" ( popd & echo   [ERROR] d8 did not create classes.dex & exit /b 1 )
echo   [4/5] Packing apk...
%PS% -File "%TOOLS%\ps\add_dex.ps1"
if errorlevel 1 ( popd & exit /b 1 )
"%BTDIR%\zipalign.exe" -f 4 build\unsigned.apk build\aligned.apk
if errorlevel 1 ( popd & echo   [ERROR] zipalign failed & exit /b 1 )
echo   [5/5] Signing (key: keys\fluxhelper.keystore)...
call "%BTDIR%\apksigner.bat" sign --ks "..\keys\fluxhelper.keystore" --ks-pass pass:fluxhelper --key-pass pass:fluxhelper --out build\FluxHelper.apk build\aligned.apk
if errorlevel 1 ( popd & echo   [ERROR] apksigner failed & exit /b 1 )
call "%BTDIR%\apksigner.bat" verify "..\apk\build\FluxHelper.apk"
if errorlevel 1 ( popd & echo   [ERROR] signature verification failed & exit /b 1 )
popd
if not exist "prebuilt" mkdir "prebuilt"
copy /y "apk\build\FluxHelper.apk" "prebuilt\FluxHelper.apk" >nul
echo   DONE: prebuilt\FluxHelper.apk
exit /b 0
