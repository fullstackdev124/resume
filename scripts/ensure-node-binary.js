/**
 * Ensures Node.js (win-x64) is present in node/win for Electron packaged app.
 * The packaged exe spawns the Next.js standalone server with this binary so users
 * don't need Node.js installed. Only runs on Windows when building for win.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const { execSync } = require("child_process");

const NODE_VERSION = "v20.18.0";
const NODE_DIST = `node-${NODE_VERSION}-win-x64`;
const ZIP_URL = `https://nodejs.org/dist/${NODE_VERSION}/${NODE_DIST}.zip`;
const projectRoot = path.join(__dirname, "..");
const nodeWin = path.join(projectRoot, "node", "win");
const nodeExe = path.join(nodeWin, "node.exe");

if (fs.existsSync(nodeExe)) {
  console.log("ensure-node-binary: node/win/node.exe already exists.");
  process.exit(0);
}

console.log("ensure-node-binary: downloading Node.js", NODE_VERSION, "win-x64...");
const zipPath = path.join(projectRoot, "node-download.zip");
const extractDir = path.join(projectRoot, "node-extract-tmp");

function rm(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      rm(p);
    } else {
      fs.unlinkSync(p);
    }
  }
  fs.rmdirSync(dir);
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) {
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

(async () => {
try {
  const file = fs.createWriteStream(zipPath);
  await new Promise((resolve, reject) => {
    https.get(ZIP_URL, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error("Download failed: " + res.statusCode));
        return;
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", (err) => {
      fs.unlink(zipPath, () => {});
      reject(err);
    });
  });

  fs.mkdirSync(extractDir, { recursive: true });
  try {
    execSync(`tar -xf "${zipPath}" -C "${extractDir}"`, { stdio: "inherit" });
  } catch (_) {
    try {
      execSync(`unzip -o "${zipPath}" -d "${extractDir}"`, { stdio: "inherit" });
    } catch (e) {
      throw new Error("Could not extract zip. Install unzip or use Windows 10+ (tar supports .zip). " + (e && e.message));
    }
  }

  const inner = path.join(extractDir, NODE_DIST);
  if (!fs.existsSync(inner)) {
    throw new Error("Extracted folder not found: " + inner);
  }
  fs.mkdirSync(path.dirname(nodeWin), { recursive: true });
  copyRecursive(inner, nodeWin);
  console.log("ensure-node-binary: copied to node/win");
} finally {
  try { if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath); } catch (_) {}
  try { if (fs.existsSync(extractDir)) rm(extractDir); } catch (_) {}
}
process.exit(0);
})().catch((err) => {
  console.error("ensure-node-binary failed:", err);
  process.exit(1);
});
