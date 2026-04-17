/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 *
 * "Memory, Not Code."
 * ============================================================ */

const { execSync } = require('child_process');

/**
 * SOVEREIGN RELEASE CLI
 * Automates the promotion of code through Alpha, Beta, and Production tiers.
 */

const target = process.argv[2]; // alpha, beta, prod

function run(cmd) {
  try {
    console.log(`\x1b[36m> ${cmd}\x1b[0m`);
    return execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.error(`\x1b[31m[FAILED]: ${cmd}\x1b[0m`);
    process.exit(1);
  }
}

const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

if (target === 'alpha') {
  console.log('💎 Promoting to ALPHA (Internal Hardening)...');
  run(`git checkout alpha`);
  run(`git merge ${currentBranch} --no-ff -m "chore(release): merge ${currentBranch} into alpha"`);
  run(`git push origin alpha`);
  run(`git checkout ${currentBranch}`);
} else if (target === 'beta') {
  console.log('🛡️ Promoting to BETA (Cultural Polish)...');
  run(`git checkout beta`);
  run(`git merge alpha --no-ff -m "chore(release): merge alpha into beta"`);
  run(`git push origin beta`);
  run(`git checkout ${currentBranch}`);
} else if (target === 'prod' || target === 'production') {
  console.log('💎 Promoting to PRODUCTION (Stable Release)...');
  run(`git checkout production`);
  run(`git merge beta --no-ff -m "chore(release): merge beta into production"`);
  run(`git push origin production`);
  run(`git checkout ${currentBranch}`);
} else {
  console.log('Usage: node scripts/sovereign.js [alpha|beta|prod]');
  process.exit(1);
}

console.log(`\x1b[32m[SUCCESS]: ${target} deployment complete.\x1b[0m`);
