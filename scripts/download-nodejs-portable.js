const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const projectRoot = path.join(__dirname, '..');
const nodeDir = path.join(projectRoot, 'src-tauri', 'nodejs-portable');

// Node.js portable download URLs (Windows x64)
const NODE_VERSION = '20.18.0';
const NODE_URL = `https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-win-x64.zip`;
const NODE_ZIP = path.join(projectRoot, 'nodejs-portable.zip');

console.log('Checking for portable Node.js...');

// Check if already manually placed or downloaded
if (fs.existsSync(nodeDir) && fs.existsSync(path.join(nodeDir, 'node.exe'))) {
  console.log('Portable Node.js already exists at:', nodeDir);
  console.log('Skipping download. Using existing Node.js.');
  process.exit(0);
}

console.log(`Node.js not found. Downloading Node.js v${NODE_VERSION} portable...`);
console.log('This may take a few minutes...');
console.log('Alternatively, you can manually download from:');
console.log(NODE_URL);
console.log('And extract node.exe to:', nodeDir);

// Download Node.js
const file = fs.createWriteStream(NODE_ZIP);
https.get(NODE_URL, (response) => {
  if (response.statusCode === 302 || response.statusCode === 301) {
    // Follow redirect
    https.get(response.headers.location, (redirectResponse) => {
      redirectResponse.pipe(file);
      file.on('finish', () => {
        file.close();
        extractNodeJs();
      });
    });
  } else {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      extractNodeJs();
    });
  }
}).on('error', (err) => {
  fs.unlinkSync(NODE_ZIP);
  console.error('Failed to download Node.js:', err.message);
  console.error('Please download Node.js manually from https://nodejs.org');
  process.exit(1);
});

function extractNodeJs() {
  console.log('Extracting Node.js...');
  
  try {
    // Use PowerShell to extract (Windows)
    if (process.platform === 'win32') {
      // Create nodejs-portable directory
      if (!fs.existsSync(nodeDir)) {
        fs.mkdirSync(nodeDir, { recursive: true });
      }
      
      // Extract using PowerShell Expand-Archive
      execSync(`powershell -Command "Expand-Archive -Path '${NODE_ZIP}' -DestinationPath '${path.dirname(nodeDir)}' -Force"`, { stdio: 'inherit' });
      
      // Move files from node-v* to nodejs-portable
      const extractedDir = path.join(path.dirname(nodeDir), `node-v${NODE_VERSION}-win-x64`);
      if (fs.existsSync(extractedDir)) {
        // Copy node.exe and npm files
        const filesToCopy = ['node.exe', 'npm', 'npm.cmd', 'npx', 'npx.cmd'];
        for (const file of filesToCopy) {
          const src = path.join(extractedDir, file);
          const dest = path.join(nodeDir, file);
          if (fs.existsSync(src)) {
            if (fs.statSync(src).isDirectory()) {
              // Copy directory recursively
              copyRecursive(src, dest);
            } else {
              fs.copyFileSync(src, dest);
            }
          }
        }
        
        // Remove extracted directory
        fs.rmSync(extractedDir, { recursive: true, force: true });
      }
      
      // Remove zip file
      fs.unlinkSync(NODE_ZIP);
      
      console.log('Node.js portable extracted successfully to:', nodeDir);
    } else {
      console.error('This script only supports Windows. Please install Node.js manually.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Failed to extract Node.js:', err.message);
    process.exit(1);
  }
}

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
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}
