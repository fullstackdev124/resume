# Tauri Setup Guide

## Prerequisites

### 1. Install Rust
Download and install Rust from https://rustup.rs/
Or run in PowerShell:
```powershell
winget install Rustlang.Rustup
```

### 2. Install C++ Build Tools (Required for Windows)

You have **two options** - choose ONE:

#### Option A: Microsoft Build Tools (Recommended - ~3-6 GB, no IDE)
**You do NOT need Visual Studio Community!** Just the build tools:

1. Download: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
2. Run installer, select **"Desktop development with C++"** workload
3. **IMPORTANT:** In the installation details, make sure **"Windows 10 SDK"** or **"Windows 11 SDK"** is checked (usually version 10.0.22621.0 or later)
4. Install (much smaller than full Visual Studio)

**If you already installed but missing Windows SDK:**
1. Open Visual Studio Installer
2. Click "Modify" on your installation
3. Under "Desktop development with C++", check **"Windows 10 SDK"** or **"Windows 11 SDK"**
4. Click "Modify" to install

Or via winget:
```powershell
winget install Microsoft.VisualStudio.2022.BuildTools --override "--add Microsoft.VisualStudio.Workload.VCTools --add Microsoft.VisualStudio.Component.Windows11SDK.22621 --quiet"
```

#### Option B: GNU Toolchain via MSYS2 (Not Recommended - Has Issues)
⚠️ **Warning:** The GNU toolchain often has linker compatibility issues on Windows. **Strongly recommend Option A instead.**

If you must use GNU toolchain:
1. Install MSYS2: https://www.msys2.org/
2. Open MSYS2 MinGW 64-bit terminal
3. Run:
   ```bash
   pacman -Syu
   pacman -S --needed base-devel mingw-w64-x86_64-toolchain mingw-w64-x86_64-binutils
   ```
4. Switch Rust to GNU toolchain:
   ```bash
   rustup install stable-x86_64-pc-windows-gnu
   rustup default stable-x86_64-pc-windows-gnu
   ```
5. Configure Cargo (create/edit `C:\Users\<YourUsername>\.cargo\config.toml`):
   ```toml
   [target.x86_64-pc-windows-gnu]
   linker = "C:\\msys64\\mingw64\\bin\\gcc.exe"
   ar = "C:\\msys64\\mingw64\\bin\\ar.exe"
   ```

**If you're getting linker errors with GNU toolchain:**
- Switch back to MSVC: `rustup default stable-x86_64-pc-windows-msvc`
- Remove/rename `C:\Users\<YourUsername>\.cargo\config.toml` if it has GNU settings
- Install Microsoft Build Tools (Option A) instead

### 3. Restart Your Terminal
After installing, close and reopen your terminal/PowerShell.

## Verify Installation

```bash
rustc --version
cargo --version
```

## Build Tauri App

**Important:** On Windows, you need to initialize the Visual Studio Build Tools environment first.

**Option 1: Use the helper script (Recommended)**
```cmd
npm install
build-tauri.bat
```

**Option 2: Use Developer Command Prompt**
1. Open "Developer Command Prompt for VS 2022" from Start Menu
2. Navigate to your project
3. Run:
```bash
npm install
npm run tauri:dev
```

**Option 3: Standard terminal (if environment is already set)**
```bash
npm install
npm run tauri:dev
```

## Running on Other PCs

### Runtime Requirements

When you build the Tauri app and distribute the `.exe` to another PC, the user needs:

**Windows 10:**
- **WebView2 Runtime** (usually auto-installed by Windows Update, or the installer can download it)
- That's it! No Node.js, Rust, or other development tools needed

**Windows 11:**
- **Nothing!** WebView2 is pre-installed

### Distribution Options

1. **Portable `.exe`** (single file):
   - Located in `src-tauri/target/release/bundle/nsis/` after build
   - Can be copied to any Windows PC and run directly
   - WebView2 will be checked/installed automatically if needed

2. **Installer (`.msi` or `-setup.exe`)**:
   - Also in `src-tauri/target/release/bundle/`
   - Provides better installation experience
   - Can bundle WebView2 if needed

**Note:** The built app is self-contained - it includes everything needed except WebView2 (which is standard on modern Windows).

## Troubleshooting

### Linker Errors

**If you get `cannot open input file 'kernel32.lib'` (LNK1181):**

This means the **Windows SDK is missing**. The C++ build tools are installed, but Windows SDK libraries are not.

**Solution:**
1. Open Visual Studio Installer
2. Click "Modify" on your Visual Studio installation
3. Under "Desktop development with C++", expand "Optional" components
4. Check **"Windows 10 SDK"** (version 10.0.22621.0 or later) or **"Windows 11 SDK"**
5. Click "Modify" to install
6. Restart your computer
7. Try building again

**If you get `linker 'link.exe' not found` (even after installing Build Tools):**

The build tools are installed, but the environment isn't initialized. Use one of these solutions:

**Solution 1: Use the helper script (Easiest)**
```cmd
build-tauri.bat
```

**Solution 2: Use Developer Command Prompt**
1. Open "Developer Command Prompt for VS 2022" from Start Menu
2. Navigate to your project: `cd "e:\Project\My_Git_Repo\resume"`
3. Run: `npm run tauri:dev`

**Solution 3: Initialize environment manually**
```powershell
# Find your vcvars64.bat (usually in one of these locations):
& "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
# OR
& "C:\Program Files\Microsoft Visual Studio\18\Community\VC\Auxiliary\Build\vcvars64.bat"

# Then run your build:
npm run tauri:dev
```

**Note:** After installing Build Tools, you may need to restart your terminal or use one of the methods above.

**If you get GNU linker errors (`ld returned 53 exit status`):**
- Switch to MSVC toolchain: `rustup default stable-x86_64-pc-windows-msvc`
- Remove GNU config: Delete or rename `C:\Users\<YourUsername>\.cargo\config.toml`
- Install Microsoft Build Tools (Option A)
- Run: `cargo clean` in `src-tauri/` directory
- Rebuild: `npm run tauri:dev`

### Other Issues

1. Restart your computer after installing C++ Build Tools
2. Run: `rustup update`
3. Try: `cargo clean` in `src-tauri/` directory
4. Rebuild: `npm run tauri:dev`
