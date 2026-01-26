@echo off
REM Initialize Visual Studio Build Tools environment and run Tauri dev build

REM Try different possible locations for vcvars64.bat
set "VCVARS="
if exist "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat" (
    set "VCVARS=C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
) else if exist "C:\Program Files\Microsoft Visual Studio\18\Community\VC\Auxiliary\Build\vcvars64.bat" (
    set "VCVARS=C:\Program Files\Microsoft Visual Studio\18\Community\VC\Auxiliary\Build\vcvars64.bat"
) else if exist "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat" (
    set "VCVARS=C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
) else if exist "C:\Program Files\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat" (
    set "VCVARS=C:\Program Files\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
)

if "%VCVARS%"=="" (
    echo Error: Could not find vcvars64.bat
    echo Please ensure Visual Studio Build Tools or Community is installed.
    pause
    exit /b 1
)

echo Initializing Visual Studio Build Tools environment...
call "%VCVARS%"
if errorlevel 1 (
    echo Failed to initialize Visual Studio environment
    pause
    exit /b 1
)

echo Running Tauri dev build...
call npm run tauri:dev
