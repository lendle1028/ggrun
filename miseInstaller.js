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
      path.join(homedir(), '.cache', 'gg', 'mise', 'mise_star_') :
      path.join(process.env.GG_CACHE_DIR, 'mise', 'mise_star_');
    fs.mkdirSync(cacheDir, { recursive: true });
    await downloadAndExtract(
        "https://imsofa.rocks/projects/ggrun/mise/win/mise.zip",
        cacheDir
    );
}

module.exports={downloadAndInstallMise}