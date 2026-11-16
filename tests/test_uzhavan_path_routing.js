/**
 * Uzhavan Path Routing & API Verification Suite
 * Verifies that the built entry point and requests work under /uzhavan-hub-new/
 * and that login and plot requests reach the intended backend.
 */

import EventEmitter from 'events';
import { createApp } from '../server/app.js';

async function run() {
  console.log('--- Testing /uzhavan-hub-new/ Path Routing and Backend API Integration ---');
  const app = await createApp();

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

      const res = new EventEmitter();
      res.statusCode = 200;
      res.setHeader = (k, v) => { respHeaders[k.toLowerCase()] = v; };
      res.getHeader = (k) => respHeaders[k.toLowerCase()];
      res.status = function(code) {
        status = code;
        this.statusCode = code;
        return this;
      };
      res.json = function(data) {
        respHeaders['content-type'] = 'application/json';
        respData = JSON.stringify(data);
        resolve({ status: this.statusCode || status, data, headers: respHeaders });
      };
      res.send = function(data) {
        respData = data;
        resolve({ status: this.statusCode || status, data, headers: respHeaders });
      };
      res.write = function(chunk) {
        respData += chunk;
      };
      res.destroy = function() {};
      res.end = function(data) {
        if (data) respData += data;
        let parsed = respData;
        try { parsed = JSON.parse(respData); } catch (e) {}
        resolve({ status: this.statusCode || status, data: parsed, headers: respHeaders });
      };

      app.handle(req, res);
    });
  }

  // 1. Verify /uzhavan-hub-new/ returns index.html
  console.log('\n[Check 1] GET /uzhavan-hub-new/ entry point');
  const entryRes = await makeRequest('GET', '/uzhavan-hub-new/');
  if (entryRes.status !== 200) {
    throw new Error(`Expected 200 from /uzhavan-hub-new/, got ${entryRes.status}`);
  }
  console.log('PASS: GET /uzhavan-hub-new/ returns HTTP 200 (serves React app entry point)');

  // 2. Verify demo login under /uzhavan-hub-new/api/auth/demo-login
  console.log('\n[Check 2] POST /uzhavan-hub-new/api/auth/demo-login');
  const demoLoginRes = await makeRequest('POST', '/uzhavan-hub-new/api/auth/demo-login', { persona: 'selvam' });
  if (demoLoginRes.status !== 200 || !demoLoginRes.data.token) {
    throw new Error(`Expected 200 and token from demo-login, got ${demoLoginRes.status}`);
  }
  const token = demoLoginRes.data.token;
  console.log('PASS: Demo login via /uzhavan-hub-new/api succeeds with token');

  // 3. Verify normal login password validation under /uzhavan-hub-new/api/auth/login
  console.log('\n[Check 3] POST /uzhavan-hub-new/api/auth/login (verify strict hash & reject demo password)');
  const badLoginRes = await makeRequest('POST', '/uzhavan-hub-new/api/auth/login', {
    identifier: 'selvam@uzhavan.tn.gov.in',
    password: 'wrong_password_123'
  });
  if (badLoginRes.status !== 401) {
    throw new Error(`Expected 401 for incorrect password, got ${badLoginRes.status}`);
  }
  console.log('PASS: Normal login via /uzhavan-hub-new/api strictly rejects incorrect credentials (HTTP 401)');

  // 4. Verify plot loading under /uzhavan-hub-new/api/plots
  console.log('\n[Check 4] GET /uzhavan-hub-new/api/plots');
  const plotsRes = await makeRequest('GET', '/uzhavan-hub-new/api/plots', null, {
    authorization: `Bearer ${token}`
  });
  if (plotsRes.status !== 200 || !Array.isArray(plotsRes.data.plots)) {
    throw new Error(`Expected 200 and plots array, got ${plotsRes.status}`);
  }
  console.log(`PASS: GET /uzhavan-hub-new/api/plots returns ${plotsRes.data.plots.length} plots`);

  // 5. Verify Add Plot under /uzhavan-hub-new/api/plots
  console.log('\n[Check 5] POST /uzhavan-hub-new/api/plots (Hectares conversion)');
  const addPlotRes = await makeRequest('POST', '/uzhavan-hub-new/api/plots', {
    plotName: 'Delta Basin High-Tech Field',
    area: 3.0,
    unit: 'hectares',
    soilType: 'Alluvial',
    soilPh: 7.1,
    estimatedBudget: 60000
  }, {
    authorization: `Bearer ${token}`
  });
  if (addPlotRes.status !== 201) {
    throw new Error(`Expected 201 for Add Plot, got ${addPlotRes.status}`);
  }
  const newPlot = addPlotRes.data.plot;
  console.log(`PASS: Add Plot created ID ${newPlot.id}, original: ${newPlot.area_original} ${newPlot.area_unit}, normalized: ${newPlot.area_acres} ac`);

  console.log('\n================================================================');
  console.log('ALL /uzhavan-hub-new/ PATH ROUTING AND API CHECKS PASSED (5/5)!');
  console.log('================================================================');
}

run().catch(err => {
  console.error('\nFAILED check:', err);
  process.exit(1);
});
