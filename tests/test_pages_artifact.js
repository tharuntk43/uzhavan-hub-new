/**
 * Pages Artifact Verification Suite
 * Verifies that the frontend artifact contains all required static web entrypoints
 * and NO database, WAL, SHM, sqlite, or secret files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist_test');

async function testArtifact() {
  console.log('--- Testing GitHub Pages Static Artifact Generation ---');

  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST, { recursive: true });

  // 1. Copy entrypoint
  const indexPath = fs.existsSync(path.join(ROOT, 'client/index.html'))
    ? path.join(ROOT, 'client/index.html')
    : path.join(ROOT, 'index.html');
  fs.copyFileSync(indexPath, path.join(DIST, 'index.html'));

  if (fs.existsSync(path.join(ROOT, '404.html'))) {
    fs.copyFileSync(path.join(ROOT, '404.html'), path.join(DIST, '404.html'));
  }
  fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

  // 2. Copy static assets
  const assetsDir = path.join(ROOT, 'assets');
  if (fs.existsSync(assetsDir)) {
    fs.cpSync(assetsDir, path.join(DIST, 'assets'), { recursive: true });
  }

  // 3. Scan DIST recursively for any database or sensitive files
  function scan(dir) {
    let files = [];
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, item.name);
      if (item.isDirectory()) {
        files = files.concat(scan(p));
      } else {
        files.push(p);
      }
    }
    return files;
  }

  const allFiles = scan(DIST);
  console.log(`Generated test artifact with ${allFiles.length} files.`);

  // Check required entrypoint
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    throw new Error('Missing index.html in Pages artifact!');
  }
  console.log('[PASS] index.html present');

  if (!fs.existsSync(path.join(DIST, '.nojekyll'))) {
    throw new Error('Missing .nojekyll in Pages artifact!');
  }
  console.log('[PASS] .nojekyll present');

  // Check forbidden files
  const forbiddenExts = ['.db', '.db-wal', '.db-shm', '.db-journal', '.sqlite', '.sqlite3', '.env'];
  for (const f of allFiles) {
    const name = path.basename(f).toLowerCase();
    for (const ext of forbiddenExts) {
      if (name.endsWith(ext) || name.includes('uzhavan.db')) {
        throw new Error(`CRITICAL: Forbidden file found in Pages artifact: ${f}`);
      }
    }
  }
  console.log('[PASS] Zero database or sensitive files found in Pages artifact');

  // Clean up test dist
  fs.rmSync(DIST, { recursive: true, force: true });
  console.log('--- PAGES ARTIFACT VERIFICATION PASSED ---');
}

testArtifact().catch(err => {
  console.error('\nArtifact test failed:', err);
  process.exit(1);
});
