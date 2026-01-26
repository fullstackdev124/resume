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

// Skip if we already have the slim bundle (node.exe only, no npm/node_modules)
if (fs.existsSync(nodeExe) && !fs.existsSync(path.join(nodeWin, "node_modules"))) {
  console.log("ensure-node-binary: node/win/node.exe (slim) already exists.");
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
  // Remove old node/win (fat or partial) so we can create a slim bundle
  if (fs.existsSync(nodeWin)) rm(nodeWin);
  fs.mkdirSync(nodeWin, { recursive: true });
  // Bundle only node.exe and *.dll (omit npm, npx, corepack, node_modules = ~40MB+)
  const nodeExeSrc = path.join(inner, "node.exe");
  if (!fs.existsSync(nodeExeSrc)) throw new Error("node.exe not found in " + inner);
  fs.copyFileSync(nodeExeSrc, path.join(nodeWin, "node.exe"));
  for (const name of fs.readdirSync(inner)) {
    if (name.toLowerCase().endsWith(".dll")) {
      fs.copyFileSync(path.join(inner, name), path.join(nodeWin, name));
    }
  }
  console.log("ensure-node-binary: copied node.exe (slim) to node/win");
} finally {
  try { if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath); } catch (_) {}
  try { if (fs.existsSync(extractDir)) rm(extractDir); } catch (_) {}
}
process.exit(0);
})().catch((err) => {
  console.error("ensure-node-binary failed:", err);
  process.exit(1);
});
