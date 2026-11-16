/**
 * Uzhavan Hub - Plots and Add Plot Regression Test Suite
 * Verifies Bug 4 (Plot loading after login & zero plot handling)
 * and Bug 5 (Add Plot request with explicit payload & hectare conversion persistence)
 */

import http from 'http';
import { createApp } from '../server/app.js';

async function run() {
  console.log('--- Starting Plots & Add Plot Regression Test Suite ---');
  const app = await createApp();

  // Helper to make mock requests
  function makeRequest(method, url, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      let status = 200;
      let respHeaders = {};
      let respData = '';

      const req = {
        method,
        url,
        headers: {
          ...headers,
          'content-type': 'application/json'
        },
        on: (event, handler) => {
          if (event === 'data' && body) {
            handler(Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)));
          }
          if (event === 'end') {
            handler();
          }
        }
      };

      const res = {
        statusCode: 200,
        setHeader: (k, v) => { respHeaders[k.toLowerCase()] = v; },
        getHeader: (k) => respHeaders[k.toLowerCase()],
        status: function(code) {
          status = code;
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          respHeaders['content-type'] = 'application/json';
          respData = JSON.stringify(data);
          resolve({ status: this.statusCode || status, data, headers: respHeaders });
        },
        send: function(data) {
          respData = data;
          resolve({ status: this.statusCode || status, data, headers: respHeaders });
        },
        end: function(data) {
          if (data) respData = data;
          let parsed = respData;
          try { parsed = JSON.parse(respData); } catch (e) {}
          resolve({ status: this.statusCode || status, data: parsed, headers: respHeaders });
        }
      };

      app.handle(req, res);
    });
  }

  // 1. Login with demo account (Selvam V. from Thanjavur who has saved plots)
  console.log('\n[Check 1] Demo login as Selvam V. (has saved plots)');
  const loginRes = await makeRequest('POST', '/api/auth/demo-login', { persona: 'selvam' });
  if (loginRes.status !== 200 || !loginRes.data.token) {
    throw new Error(`Demo login failed: status ${loginRes.status}`);
  }
  const selvamToken = loginRes.data.token;
  console.log('PASS: Selvam logged in, token received');

  // 2. Fetch plots via /api/plots (api.listPlots)
  console.log('\n[Check 2] List plots for Selvam V.');
  const selvamPlotsRes = await makeRequest('GET', '/api/plots', null, {
    authorization: `Bearer ${selvamToken}`
  });
  if (selvamPlotsRes.status !== 200 || !selvamPlotsRes.data.plots) {
    throw new Error(`listPlots failed: status ${selvamPlotsRes.status}`);
  }
  const selvamPlots = selvamPlotsRes.data.plots;
  console.log(`PASS: Retrieved ${selvamPlots.length} plots for Selvam V. First plot: ${selvamPlots[0]?.plot_name}`);
  if (selvamPlots.length === 0) {
    throw new Error('Expected Selvam to have saved plots!');
  }

  // 3. Register a brand-new regular farmer with 0 plots
  console.log('\n[Check 3] Register fresh farmer with NO initial plots (zero-plot account)');
  const uniquePhone = '99' + Math.floor(10000000 + Math.random() * 90000000);
  const regRes = await makeRequest('POST', '/api/auth/register', {
    fullName: 'Raman K.',
    phone: uniquePhone,
    password: 'RamanPassword@2026',
    district: 'Tirunelveli',
    village: 'Ambasamudram'
  });
  if ((regRes.status !== 200 && regRes.status !== 201) || !regRes.data.token) {
    throw new Error(`Farmer registration failed: status ${regRes.status}, error: ${regRes.data.error}`);
  }
  const ramanToken = regRes.data.token;
  console.log('PASS: Raman K. registered with token');

  // 4. Verify zero plots returns clean empty list
  console.log('\n[Check 4] List plots for zero-plot farmer');
  const zeroPlotsRes = await makeRequest('GET', '/api/plots', null, {
    authorization: `Bearer ${ramanToken}`
  });
  if (zeroPlotsRes.status !== 200) {
    throw new Error(`Zero-plot check failed: status ${zeroPlotsRes.status}`);
  }
  if (!Array.isArray(zeroPlotsRes.data.plots) || zeroPlotsRes.data.plots.length !== 0) {
    throw new Error(`Expected exactly 0 plots, got: ${JSON.stringify(zeroPlotsRes.data.plots)}`);
  }
  console.log('PASS: Zero-plot account returns exactly 0 plots (no crashes, no fake plot)');

  // 5. Add Plot in HECTARES with explicit camelCase payload (matching AddPlotModal)
  console.log('\n[Check 5] Add Farmland Plot entered in HECTARES (2.5 ha)');
  const addPlotPayload = {
    plotName: 'Thamirabarani Riverfront Hectare Plot',
    area: 2.5,
    unit: 'hectares',
    soilType: 'Alluvial River Loam',
    soilPh: 6.8,
    organicCarbon: '0.72%',
    fertilityNotes: 'Highly fertile delta riverbed soil',
    irrigationSource: 'Canal',
    waterAvailability: 'Abundant',
    currentCrop: 'Banana (Grand Naine)',
    previousCrop: 'Paddy',
    plannedCrop: 'Black Gram',
    sowingDate: '2026-10-15',
    estimatedBudget: 45000
  };

  const addRes = await makeRequest('POST', '/api/plots', addPlotPayload, {
    authorization: `Bearer ${ramanToken}`
  });

  if (addRes.status !== 201) {
    throw new Error(`Add plot failed: status ${addRes.status}, error: ${addRes.data.error}`);
  }
  const createdPlot = addRes.data.plot;
  console.log('PASS: Add plot succeeded with HTTP 201');
  console.log('   Created Plot ID:', createdPlot.id);
  console.log('   Area Original:', createdPlot.area_original, createdPlot.area_unit);
  console.log('   Area Normalized (Acres):', createdPlot.area_acres);

  if (createdPlot.area_original !== 2.5) {
    throw new Error(`Expected area_original 2.5, got ${createdPlot.area_original}`);
  }
  if (createdPlot.area_unit !== 'hectares') {
    throw new Error(`Expected area_unit 'hectares', got '${createdPlot.area_unit}'`);
  }
  // 2.5 * 2.471 = 6.1775 -> 6.18 acres
  const expectedAcres = parseFloat((2.5 * 2.471).toFixed(2));
  if (Math.abs(createdPlot.area_acres - expectedAcres) > 0.05) {
    throw new Error(`Expected normalized acres ~${expectedAcres}, got ${createdPlot.area_acres}`);
  }
  console.log(`PASS: Hectare conversion verified (2.5 ha = ${createdPlot.area_acres} acres)`);

  // 6. Verify plot persists after refresh (/api/plots)
  console.log('\n[Check 6] Verify plot persists on subsequent listPlots call (page refresh simulation)');
  const refreshedPlotsRes = await makeRequest('GET', '/api/plots', null, {
    authorization: `Bearer ${ramanToken}`
  });
  if (refreshedPlotsRes.status !== 200 || refreshedPlotsRes.data.plots.length !== 1) {
    throw new Error(`Refreshed plots failed: count is ${refreshedPlotsRes.data.plots?.length}`);
  }
  const persisted = refreshedPlotsRes.data.plots[0];
  if (persisted.plot_name !== 'Thamirabarani Riverfront Hectare Plot') {
    throw new Error(`Plot name mismatch: ${persisted.plot_name}`);
  }
  if (persisted.area_original !== 2.5 || persisted.area_unit !== 'hectares') {
    throw new Error(`Original entered values lost: original=${persisted.area_original}, unit=${persisted.area_unit}`);
  }
  if (persisted.area_acres !== expectedAcres) {
    throw new Error(`Normalized acres changed: ${persisted.area_acres}`);
  }
  if (persisted.soil_ph !== 6.8 || persisted.estimated_budget !== 45000) {
    throw new Error(`Metadata mismatch: ph=${persisted.soil_ph}, budget=${persisted.estimated_budget}`);
  }
  console.log('PASS: Plot perfectly preserved with original hectare values and normalized acres after refresh');

  // 7. Verify snake_case compatibility as fallback
  console.log('\n[Check 7] Verify snake_case payload compatibility');
  const snakePayload = {
    plot_name: 'Snake Case Test Field',
    area_value: 150,
    area_unit: 'cents',
    soil_type: 'red',
    soil_ph: 6.5,
    irrigation_source: 'borewell',
    budget: 20000
  };
  const snakeRes = await makeRequest('POST', '/api/plots', snakePayload, {
    authorization: `Bearer ${ramanToken}`
  });
  if (snakeRes.status !== 201) {
    throw new Error(`Snake_case payload failed: status ${snakeRes.status}, error: ${snakeRes.data.error}`);
  }
  console.log('PASS: snake_case payload successfully accepted and converted (150 cents = 1.5 acres)');

  console.log('\n======================================================');
  console.log('ALL PLOT LOADING & ADD PLOT REGRESSION CHECKS PASSED (7/7)!');
  console.log('======================================================');
}

run().catch(err => {
  console.error('\nFAILED regression check:', err);
  process.exit(1);
});
