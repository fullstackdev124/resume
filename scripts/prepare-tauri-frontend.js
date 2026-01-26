const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const standaloneDir = path.join(projectRoot, '.next', 'standalone');
const tauriDistDir = path.join(projectRoot, '.next', 'tauri-dist');
const staticDir = path.join(projectRoot, '.next', 'static');
const publicDir = path.join(projectRoot, 'public');

// Clean and create tauri-dist directory
if (fs.existsSync(tauriDistDir)) {
  fs.rmSync(tauriDistDir, { recursive: true, force: true });
}
fs.mkdirSync(tauriDistDir, { recursive: true });

// Copy .next/static to tauri-dist/.next/static
const tauriStaticDir = path.join(tauriDistDir, '.next', 'static');
fs.mkdirSync(tauriStaticDir, { recursive: true });
if (fs.existsSync(staticDir)) {
  copyRecursive(staticDir, tauriStaticDir);
}

// Copy public files
if (fs.existsSync(publicDir)) {
  copyRecursive(publicDir, path.join(tauriDistDir, 'public'));
}

// Copy server files (but not node_modules)
const standaloneServerDir = path.join(standaloneDir, '.next', 'server');
const tauriServerDir = path.join(tauriDistDir, '.next', 'server');
if (fs.existsSync(standaloneServerDir)) {
  fs.mkdirSync(tauriServerDir, { recursive: true });
  copyRecursive(standaloneServerDir, tauriServerDir);
}

// Copy other .next files (but not node_modules)
const standaloneNextDir = path.join(standaloneDir, '.next');
const tauriNextDir = path.join(tauriDistDir, '.next');
if (fs.existsSync(standaloneNextDir)) {
  const entries = fs.readdirSync(standaloneNextDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'server' || entry.name === 'static' || entry.name === 'node_modules') {
      // Already handled or skip
      continue;
    }
    const src = path.join(standaloneNextDir, entry.name);
    const dest = path.join(tauriNextDir, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

// Copy package.json and other necessary files (but not node_modules)
const filesToCopy = ['package.json'];
for (const file of filesToCopy) {
  const src = path.join(standaloneDir, file);
  const dest = path.join(tauriDistDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

// Create index.html at root - This will redirect to the Next.js server
const indexHtmlPath = path.join(tauriDistDir, 'index.html');
fs.writeFileSync(indexHtmlPath, `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume - Loading...</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #f5f5f5;
    }
    .loader {
      text-align: center;
    }
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <p>Starting server...</p>
  </div>
  <script>
    (function() {
      'use strict';
      // Check if running in Tauri
      const isTauri = typeof window !== 'undefined' && window.__TAURI__;
      
      // Wait for server to be ready, then redirect
      let attempts = 0;
      const maxAttempts = 40; // 20 seconds total
      
      async function checkNodeJs() {
        if (isTauri) {
          try {
            const { invoke } = window.__TAURI__.core;
            const hasNode = await invoke('check_nodejs');
            if (!hasNode) {
              document.querySelector('.loader p').innerHTML = 
                'Node.js is not installed.<br><br>' +
                'Please install Node.js from <a href="https://nodejs.org" target="_blank" style="color: #3498db;">nodejs.org</a><br>' +
                'Then restart this application.';
              return false;
            }
            return true;
          } catch (e) {
            console.error('Failed to check Node.js:', e);
            return true; // Continue anyway
          }
        }
        return true;
      }
      
      async function checkServer() {
        attempts++;
        
        // First check Node.js on first attempt
        if (attempts === 1) {
          const hasNode = await checkNodeJs();
          if (!hasNode) {
            return; // Stop if Node.js is missing
          }
          // Update message to show we're waiting for server
          document.querySelector('.loader p').textContent = 'Waiting for server to start...';
        }
        
        // Update progress message
        if (attempts > 1 && attempts % 4 === 0) {
          const seconds = Math.floor(attempts * 0.5);
          document.querySelector('.loader p').textContent = 'Waiting for server... (' + seconds + 's)';
        }
        
        try {
          const response = await fetch('http://localhost:3333', { 
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-cache'
          });
          // Server is ready, redirect
          window.location.href = 'http://localhost:3333';
        } catch (err) {
          if (attempts < maxAttempts) {
            setTimeout(checkServer, 500);
          } else {
            // Final attempt - check server status via Tauri
            let errorMsg = 'Failed to connect to server after 20 seconds.';
            if (isTauri) {
              try {
                const { invoke } = window.__TAURI__.core;
                const status = await invoke('check_server_status');
                if (status === 'not_running') {
                  errorMsg = 'Server failed to start. Please check the console for error messages.';
                }
              } catch (e) {
                console.error('Failed to check server status:', e);
              }
            }
            
            document.querySelector('.loader p').innerHTML = 
              errorMsg + '<br><br>' +
              'Possible issues:<br>' +
              '• Node.js may not be installed or not found<br>' +
              '• Server may have failed to start (check console)<br>' +
              '• Port 3333 may be in use<br>' +
              '• server.js file may be missing<br><br>' +
              'Please check the console/terminal for detailed error messages.<br>' +
              'You can also try restarting the application.';
          }
        }
      }
      
      // Start checking after a brief delay
      setTimeout(checkServer, 1000);
    })();
  </script>
</body>
</html>`);
console.log('Created index.html with server redirect');

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
      // Skip node_modules
      if (entry === 'node_modules') {
        continue;
      }
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Tauri frontend prepared successfully at:', tauriDistDir);
