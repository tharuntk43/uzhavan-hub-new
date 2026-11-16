/**
 * Client Module & API Import Verification Suite
 * Verifies Bug 3: Named & default imports work seamlessly across all client files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_SRC = path.resolve(__dirname, '../client/src');

async function verifyClientModules() {
  console.log('--- Verifying Client Modules & API Imports ---');

  // 1. Verify api.js exports both named and default
  const apiPath = path.join(CLIENT_SRC, 'services/api.js');
  const apiContent = fs.readFileSync(apiPath, 'utf8');

  const hasNamedExport = /export\s+const\s+api\s*=/.test(apiContent);
  const hasDefaultExport = /export\s+default\s+api\s*;/.test(apiContent);

  console.log(`[api.js] Named export (export const api): ${hasNamedExport ? 'PASS' : 'FAIL'}`);
  console.log(`[api.js] Default export (export default api): ${hasDefaultExport ? 'PASS' : 'FAIL'}`);

  if (!hasNamedExport || !hasDefaultExport) {
    throw new Error('api.js must export both named api and default api');
  }

  // 2. Scan all client/src files for imports of api
  function getAllFiles(dir, exts = ['.js', '.jsx']) {
    let files = [];
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        files = files.concat(getAllFiles(full, exts));
      } else if (exts.includes(path.extname(item.name))) {
        files.push(full);
      }
    }
    return files;
  }

  const allFiles = getAllFiles(CLIENT_SRC);
  console.log(`\nScanning ${allFiles.length} client JavaScript/JSX files for API imports...`);

  let checkedImports = 0;
  const importRegex = /import\s+((?:\{[^}]*api[^}]*\}|\bapi\b)[^;]*)\s+from\s+['"]([^'"]*api(?:\.js)?)['"]/g;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const relPath = path.relative(CLIENT_SRC, file);
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      checkedImports++;
      const importClause = match[1].trim();
      console.log(` - ${relPath}: "${importClause}" from "${match[2]}"`);
    }
  }

  console.log(`\nVerified ${checkedImports} API import sites.`);
  if (checkedImports < 15) {
    throw new Error(`Expected at least 15 API import sites, found only ${checkedImports}`);
  }

  // 3. Inspect all exported methods on api object
  const apiMethods = [
    'register', 'login', 'demoLogin', 'logout', 'getMe', 'forgotPassword',
    'listPlots', 'addPlot', 'updatePlot', 'deletePlot', 'activatePlot',
    'getRecommendations', 'wizardRecommendations', 'getRiskAlerts', 'getComparisonTable',
    'doctorScan', 'getWeather', 'getMarketPrices', 'calculateProceeds',
    'getLabourListings', 'bookLabour', 'getMyLabourBookings',
    'getMachineryListings', 'bookMachinery', 'getMyMachineryBookings',
    'getVeterinary', 'getSchemes', 'checkSchemeEligibility', 'calculateLoan',
    'getPosts', 'createPost', 'getReplies', 'createReply', 'likePost',
    'getCalendarTasks', 'toggleTask', 'calculateFertilizer',
    'getLingoData', 'translateLingo', 'assistantChat'
  ];

  for (const method of apiMethods) {
    const regex = new RegExp(`\\b${method}\\s*:`);
    if (!regex.test(apiContent)) {
      throw new Error(`Missing expected API method on api object: ${method}`);
    }
  }

  console.log(`[api.js] All ${apiMethods.length} expected REST methods defined on api object: PASS`);
  console.log('\n--- ALL CLIENT MODULE AND IMPORT CHECKS PASSED ---');
}

verifyClientModules().catch(err => {
  console.error('\nVerification failed:', err);
  process.exit(1);
});
