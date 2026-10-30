#!/usr/bin/env node
let { downloadAndInstallMise } = require('./miseInstaller.js');

async function main() {
  const fs = require('fs');
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

  // ── 1. 確保 mise binary 可用 ─────────────────────────────────

  const isWin = platform() === 'win32';
  const isMac=platform()==="darwin";
  
  const cacheDir = (!process.env.GG_CACHE_DIR) ?
    path.join(homedir(), '.cache', 'gg', 'mise', 'mise_eq_2026.10.17') :
    path.join(process.env.GG_CACHE_DIR, 'mise', 'mise_eq_2026.10.17');
  const miseBin = path.join(cacheDir, isWin ? 'mise.exe' : 'mise');
  const ggCmd = path.join(process.cwd(), isWin ? 'gg.cmd' : './gg.cmd');


  function findMiseBinary() {
    if (!existsSync(cacheDir)) return null;
    return readdirSync(cacheDir).find(f => f.startsWith('mise'));
  }

  async function installMise(directDownload=false) {
    console.error('[setup] Downloading mise via '+(directDownload?"http":"gg")+" ...");
    try {
      if (!directDownload) {
        // console.log(`"${ggCmd}" gh/jdx/mise@2026.10.17 --version`);
        execSync(`"${ggCmd}" gh/jdx/mise@2026.10.17 --version`, {
          stdio: 'inherit'
        });
      } else {
        // console.log(`"${ggCmd}" -l gh/jdx/mise@2026.10.17 --version`);
        await downloadAndInstallMise();
      }
      //validate
      let ret= findMiseBinary();
      return ret;
    } catch (_) {
      // 下載過程 gg 可能 fallback 失敗，只要檔案存在就好
    }
  }
  let miseBinaryExists=findMiseBinary();
  // console.log("miseBinaryExists="+miseBinaryExists);
  if (!miseBinaryExists) {
    if (!await installMise()) {
      if (!await installMise(true)) {
        console.error('[error] Failed installing mise via gg, exit...');
        process.exit(1);
      }
    }
  }

  let args = process.argv.slice(2);

  const ggToml = `[aliases]
mise = "gh/jdx/mise@2026.10.17"
uv   = "gh/jdx/mise@2026.10.17 exec uv@latest -- uv"
`;

  if (!existsSync('gg.toml')) {
    fs.writeFileSync('gg.toml', ggToml);
    console.log('gg.toml created');
  }

  execSync(`"${ggCmd}" mise trust`, {
    stdio: 'inherit'
  });

  execSync(`"${ggCmd}" mise run `, ...args, {
    stdio: 'inherit'
  });
}

main();