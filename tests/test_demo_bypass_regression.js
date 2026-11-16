/**
 * Regression Test: Demo Password Bypass Fix
 * Verifies that a regular farmer whose email contains a demo persona name
 * cannot be accessed via shared demo passwords, but can log in with their own password.
 */

import { EventEmitter } from 'events';
import { createApp } from '../server/app.js';
import { db } from '../server/database/db.js';

class MockRequest extends EventEmitter {
  constructor(method, url, body = null, headers = {}) {
    super();
    this.method = method.toUpperCase();
    this.url = url;
    this.headers = { 'content-type': 'application/json', ...headers };
    this.bodyPayload = body ? JSON.stringify(body) : '';
  }

  start() {
    process.nextTick(() => {
      if (this.bodyPayload) {
        this.emit('data', Buffer.from(this.bodyPayload));
      }
      this.emit('end');
    });
  }
}

class MockResponse extends EventEmitter {
  constructor() {
    super();
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
    this.finished = false;
  }

  setHeader(key, value) {
    this.headers[key.toLowerCase()] = value;
  }

  getHeader(key) {
    return this.headers[key.toLowerCase()];
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  end(data) {
    if (data) this.body += data;
    this.finished = true;
    this.emit('finish');
  }

  json(data) {
    this.setHeader('Content-Type', 'application/json');
    this.body = JSON.stringify(data);
    this.end();
  }

  send(data) {
    this.body = data;
    this.end();
  }
}

async function dispatch(app, method, url, body = null, token = null) {
  return new Promise((resolve) => {
    const headers = {};
    if (token) headers['authorization'] = `Bearer ${token}`;
    const req = new MockRequest(method, url, body, headers);
    const res = new MockResponse();

    res.on('finish', () => {
      let parsed = null;
      try {
        parsed = JSON.parse(res.body);
      } catch (e) {
        parsed = res.body;
      }
      resolve({ status: res.statusCode, body: parsed });
    });

    app.handle(req, res);
    req.start();
  });
}

async function runRegressionTest() {
  console.log('--- Starting Demo Password Bypass Regression Tests ---');
  const app = await createApp();

  // Test farmer whose email contains 'murugan'
  const regularFarmerMurugan = {
    fullName: 'Murugesan K.',
    email: `murugan.kumar.${Date.now()}@deltafarms.in`,
    phone: '98765' + Math.floor(10000 + Math.random() * 90000),
    password: 'MuruganCustomPassword!2026',
    confirmPassword: 'MuruganCustomPassword!2026',
    district: 'Thanjavur'
  };

  // 1. Register regular farmer
  const regRes = await dispatch(app, 'POST', '/api/auth/register', regularFarmerMurugan);
  if (regRes.status !== 201 || !regRes.body.success) {
    console.error('Registration failed:', regRes);
    process.exit(1);
  }
  console.log('[Test 1] Regular farmer with "murugan" in email registered successfully: PASS');

  // 2. Attempt normal login with demo password 'Farmer@123' -> MUST FAIL (401)
  const failDemoPass1 = await dispatch(app, 'POST', '/api/auth/login', {
    identifier: regularFarmerMurugan.email,
    password: 'Farmer@123'
  });
  if (failDemoPass1.status === 401 && !failDemoPass1.body.success) {
    console.log('[Test 2] Login with demo password "Farmer@123" rejected with 401: PASS');
  } else {
    console.error('[Test 2 FAILED] Demo password "Farmer@123" bypassed authentication! Response:', failDemoPass1);
    process.exit(1);
  }

  // 3. Attempt normal login with demo password 'password123' -> MUST FAIL (401)
  const failDemoPass2 = await dispatch(app, 'POST', '/api/auth/login', {
    identifier: regularFarmerMurugan.email,
    password: 'password123'
  });
  if (failDemoPass2.status === 401 && !failDemoPass2.body.success) {
    console.log('[Test 3] Login with demo password "password123" rejected with 401: PASS');
  } else {
    console.error('[Test 3 FAILED] Demo password "password123" bypassed authentication! Response:', failDemoPass2);
    process.exit(1);
  }

  // 4. Attempt normal login with farmer's own password -> MUST SUCCEED (200)
  const successOwnPass = await dispatch(app, 'POST', '/api/auth/login', {
    identifier: regularFarmerMurugan.email,
    password: regularFarmerMurugan.password
  });
  if (successOwnPass.status === 200 && successOwnPass.body.success && successOwnPass.body.user.email === regularFarmerMurugan.email) {
    console.log('[Test 4] Login with farmer\'s own password succeeded with 200: PASS');
  } else {
    console.error('[Test 4 FAILED] Login with own password failed! Response:', successOwnPass);
    process.exit(1);
  }

  // 5. Test another farmer whose email contains 'anitha'
  const regularFarmerAnitha = {
    fullName: 'Anithamani S.',
    email: `anitha.orchards.${Date.now()}@agrovalley.in`,
    phone: '98766' + Math.floor(10000 + Math.random() * 90000),
    password: 'AnithaSecurePassword#999',
    confirmPassword: 'AnithaSecurePassword#999',
    district: 'Madurai'
  };

  const regAnitha = await dispatch(app, 'POST', '/api/auth/register', regularFarmerAnitha);
  if (regAnitha.status !== 201) {
    console.error('Anitha registration failed:', regAnitha);
    process.exit(1);
  }

  const failAnithaDemo = await dispatch(app, 'POST', '/api/auth/login', {
    identifier: regularFarmerAnitha.email,
    password: 'Farmer@123'
  });
  if (failAnithaDemo.status === 401) {
    console.log('[Test 5] Farmer with "anitha" in email rejected demo password: PASS');
  } else {
    console.error('[Test 5 FAILED] Demo password allowed on regular anitha account! Response:', failAnithaDemo);
    process.exit(1);
  }

  const successAnitha = await dispatch(app, 'POST', '/api/auth/login', {
    identifier: regularFarmerAnitha.email,
    password: regularFarmerAnitha.password
  });
  if (successAnitha.status === 200 && successAnitha.body.user.email === regularFarmerAnitha.email) {
    console.log('[Test 6] Farmer with "anitha" in email succeeded with own password: PASS');
  } else {
    console.error('[Test 6 FAILED] Login with own password failed for anitha: Response:', successAnitha);
    process.exit(1);
  }

  // 6. Verify dedicated demoLogin feature still works and returns seeded demo account
  const demoRes = await dispatch(app, 'POST', '/api/auth/demo-login', { persona: 'murugan' });
  if (demoRes.status === 200 && demoRes.body.user.email === 'murugan@uzhavan.tn.gov.in') {
    console.log('[Test 7] Dedicated demo-login returns explicitly seeded demo account: PASS');
  } else {
    console.error('[Test 7 FAILED] Dedicated demo login failed! Response:', demoRes);
    process.exit(1);
  }

  console.log('--- ALL DEMO PASSWORD BYPASS REGRESSION TESTS PASSED! ---');
}

runRegressionTest().catch(err => {
  console.error('Fatal error running regression tests:', err);
  process.exit(1);
});
