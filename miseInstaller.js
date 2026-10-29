const axios = require("axios");
const fs = require("node:fs");
const extract = require("extract-zip");

const {
  execFileSync,
  execSync
} = require('child_process');
const {
  existsSync,
  readdirSync,
  symlinkSync,
  chmodSync
} = require('fs');
const {
  homedir,
  platform
} = require('os');
const path = require('path');

async function downloadAndExtract(url, dest) {
  const zipPath = path.join(dest, "mise.zip");

  fs.mkdirSync(dest, { recursive: true });

  // Download ZIP
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  await new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(zipPath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
    response.data.on("error", reject);
  });

  // Extract ZIP
  await extract(zipPath, { dir: dest });

  // Remove downloaded ZIP
  fs.unlinkSync(zipPath);
}

async function downloadAndInstallMise(){
    const isWin = platform() === 'win32';
    const cacheDir = (!process.env.GG_CACHE_DIR) ?
      path.join(homedir(), '.cache', 'gg', 'mise', 'mise_eq_2026.10.17') :
      path.join(process.env.GG_CACHE_DIR, 'mise', 'mise_eq_2026.10.17');
    fs.mkdirSync(cacheDir, { recursive: true });
    await downloadAndExtract(
        "https://imsofa.rocks/projects/ggrun/mise/win/mise.zip",
        cacheDir
    );
    //create config files
    const ggMeta = `
      {"version_req":"=2026.10.17","download":{"version":"2026.10.17","tags":[],"download_url":"https://github.com/jdx/mise/releases/download/v2026.10.17/mise-v2026.10.17-windows-x64.exe","arch":"X86_64","os":"Windows","variant":"Any"},"cmd":{"cmd":"gh/jdx/mise","version":"=2026.10.17","distribution":null,"include_tags":[],"exclude_tags":[],"gems":null}}
      `;
    fs.writeFileSync(path.join(cacheDir, "gg-meta.json"), ggMeta);
}

module.exports={downloadAndInstallMise}