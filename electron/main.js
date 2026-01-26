const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");

const isDev = !app.isPackaged;
const PORT = 3333;
const NEXT_URL = `http://127.0.0.1:${PORT}`;

let nextProcess = null;
let mainWindow = null;
let lastStandaloneStderr = "";

function spawnNextDev() {
  const isWin = process.platform === "win32";
  const cmd = isWin ? "npm.cmd" : "npm";
  nextProcess = spawn(cmd, ["run", "dev"], {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
    shell: isWin,
  });
  nextProcess.on("error", (err) => console.error("Next dev spawn error:", err));
  nextProcess.on("exit", (code) => console.log("Next dev exit:", code));
}

function runNextStandalone() {
  lastStandaloneStderr = "";
  const standalonePath = path.join(process.resourcesPath, "standalone");
  const serverPath = path.join(standalonePath, "server.js");
  if (!fs.existsSync(serverPath)) {
    throw new Error("server.js not found at: " + serverPath);
  }
  // Use bundled Node.js when available (packaged app); otherwise fall back to system "node" (requires Node in PATH).
  const nodeExe = path.join(process.resourcesPath, "node", "node.exe");
  const nodeBin = fs.existsSync(nodeExe) ? nodeExe : "node";

  nextProcess = spawn(nodeBin, [serverPath], {
    cwd: standalonePath,
    env: { ...process.env, PORT: String(PORT), HOSTNAME: "127.0.0.1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  nextProcess.stdout?.on("data", (chunk) => { lastStandaloneStderr += chunk.toString(); });
  nextProcess.stderr?.on("data", (chunk) => { lastStandaloneStderr += chunk.toString(); });
  nextProcess.on("error", (err) => {
    lastStandaloneStderr = "Spawn error: " + (err && err.message) + (lastStandaloneStderr ? "\n\n" + lastStandaloneStderr : "");
    console.error("Next standalone spawn error:", err);
  });
  nextProcess.on("exit", (code) => console.log("Next standalone exit:", code));
}

function waitForServer(maxWait = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryReq = () => {
      const req = http.get(NEXT_URL, () => { req.destroy(); resolve(); });
      req.on("error", () => {
        if (Date.now() - start > maxWait) return reject(new Error("Server failed to start within " + (maxWait / 1000) + "s. Port " + PORT + " may be in use."));
        setTimeout(tryReq, 500);
      });
    };
    tryReq();
  });
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function showError(msg, detail) {
  const html = "<!DOCTYPE html><html><head><meta charset=utf-8></head><body style=\"font-family:sans-serif;padding:2em;max-width:600px\"><h1>Startup Error</h1><p>" + escapeHtml(msg) + "</p>" + (detail ? "<pre style=\"background:#f4f4f4;padding:1em;overflow:auto;font-size:12px\">" + escapeHtml(detail) + "</pre>" : "") + "</body></html>";
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
}

function createWindow(initialUrl) {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.loadURL(initialUrl || NEXT_URL);
  mainWindow = win;
  if (isDev) win.webContents.openDevTools();
  return win;
}

const LOADING_HTML = "data:text/html;charset=utf-8," + encodeURIComponent("<!DOCTYPE html><html><head><meta charset=utf-8></head><body style=\"font-family:sans-serif;padding:2em;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0\"><h1>Starting...</h1><p style=margin-left:1em>Please wait.</p></body></html>");

app.whenReady().then(async () => {
  createWindow(LOADING_HTML);
  try {
    if (isDev) {
      spawnNextDev();
    } else {
      runNextStandalone();
    }
    await waitForServer();
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.loadURL(NEXT_URL);
  } catch (e) {
    const detail = lastStandaloneStderr || e.stack || "";
    showError(e.message, detail.trim() ? detail : undefined);
  }
});

app.on("window-all-closed", () => {
  if (nextProcess) nextProcess.kill();
  app.quit();
});

app.on("before-quit", () => {
  if (nextProcess) nextProcess.kill();
});

// --- save-file: write to Downloads and overwrite if exists ---
ipcMain.handle("save-file", async (_event, { filename, data, encoding }) => {
  const dir = app.getPath("downloads");
  const fullPath = path.join(dir, filename);
  try {
    if (encoding === "base64") {
      fs.writeFileSync(fullPath, Buffer.from(data, "base64"));
    } else {
      fs.writeFileSync(fullPath, data, { encoding: "utf8" });
    }
    return { ok: true, path: fullPath };
  } catch (err) {
    return { ok: false, error: String(err && err.message) };
  }
});
