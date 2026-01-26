const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const standalone = path.join(projectRoot, ".next", "standalone");
const nextStatic = path.join(projectRoot, ".next", "static");
const publicDir = path.join(projectRoot, "public");

const standaloneNext = path.join(standalone, ".next");
const standaloneStatic = path.join(standaloneNext, "static");
const standalonePublic = path.join(standalone, "public");

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

if (!fs.existsSync(standalone)) {
  console.error(".next/standalone not found. Run 'next build' first.");
  process.exit(1);
}

if (fs.existsSync(nextStatic)) {
  fs.mkdirSync(path.dirname(standaloneStatic), { recursive: true });
  copyRecursive(nextStatic, standaloneStatic);
  console.log("Copied .next/static -> .next/standalone/.next/static");
}

if (fs.existsSync(publicDir)) {
  copyRecursive(publicDir, standalonePublic);
  console.log("Copied public -> .next/standalone/public");
}

console.log("Standalone is ready.");
