/**
 * Test: Static File Database Protection
 * Verifies that the Node static server does NOT expose database files or secrets.
 */

import { EventEmitter } from 'events';
import { createApp } from '../server/app.js';

class MockReq extends EventEmitter {
  constructor(url) {
    super();
    this.method = 'GET';
    this.url = url;
    this.headers = {};
  }
  start() {
    process.nextTick(() => this.emit('end'));
  }
}

class MockRes extends EventEmitter {
  constructor() {
    super();
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
  }
  setHeader(k, v) { this.headers[k] = v; }
  status(c) { this.statusCode = c; return this; }
  write(d) { if (d) this.body += d; return true; }
  end(d) { if (d) this.body += d; this.emit('finish'); }
  destroy() { this.emit('close'); }
  json(d) { this.body = JSON.stringify(d); this.end(); }
}

async function checkPath(app, path) {
  return new Promise((resolve) => {
    const req = new MockReq(path);
    const res = new MockRes();
    res.on('finish', () => resolve(res.statusCode));
    app.handle(req, res);
    req.start();
  });
}

async function runTest() {
  console.log('--- Testing Static Server Database Exposure ---');
  const app = await createApp();

  const protectedPaths = [
    '/uzhavan.db',
    '/uzhavan.db-wal',
    '/uzhavan.db-shm',
    '/server/database/uzhavan.db',
    '/server/database/schema.sql',
    '/data/uzhavan.db',
    '/.env'
  ];

  for (const p of protectedPaths) {
    const status = await checkPath(app, p);
    if (status === 404) {
      console.log(`[PASS] ${p} -> Status 404 (Protected)`);
    } else {
      console.error(`[FAIL] ${p} -> Status ${status} (Exposed!)`);
      process.exit(1);
    }
  }

  // Also check that site entry point is accessible
  const indexStatus = await checkPath(app, '/');
  if (indexStatus === 200) {
    console.log('[PASS] / (index.html) -> Status 200 (Accessible)');
  } else {
    console.error(`[FAIL] / -> Status ${indexStatus}`);
    process.exit(1);
  }

  console.log('--- ALL STATIC SERVER DATABASE EXPOSURE TESTS PASSED! ---');
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
