const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const standaloneDir = path.join(projectRoot, '.next', 'standalone');
const tauriServerDir = path.join(projectRoot, 'src-tauri', 'server');

// Copy standalone server files to Tauri server directory
if (!fs.existsSync(standaloneDir)) {
  console.error('.next/standalone not found. Run "next build" first.');
  process.exit(1);
}

// Clean and create Tauri server directory
if (fs.existsSync(tauriServerDir)) {
  fs.rmSync(tauriServerDir, { recursive: true, force: true });
}
fs.mkdirSync(tauriServerDir, { recursive: true });

// Copy entire standalone directory
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }
  
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      // Skip node_modules - we'll handle it separately if needed
      if (entry === 'node_modules' && src === standaloneDir) {
        // Copy node_modules but filter out unnecessary packages
        continue;
      }
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursive(standaloneDir, tauriServerDir);

// Copy node_modules from standalone (it's already filtered by Next.js)
const standaloneNodeModules = path.join(standaloneDir, 'node_modules');
const tauriNodeModules = path.join(tauriServerDir, 'node_modules');
if (fs.existsSync(standaloneNodeModules)) {
  copyRecursive(standaloneNodeModules, tauriNodeModules);
}

// Copy .next/static and public if they exist
const nextStatic = path.join(projectRoot, '.next', 'static');
const tauriNextStatic = path.join(tauriServerDir, '.next', 'static');
if (fs.existsSync(nextStatic)) {
  copyRecursive(nextStatic, tauriNextStatic);
}

const publicDir = path.join(projectRoot, 'public');
const tauriPublic = path.join(tauriServerDir, 'public');
if (fs.existsSync(publicDir)) {
  copyRecursive(publicDir, tauriPublic);
}

console.log('Tauri server files prepared successfully at:', tauriServerDir);
