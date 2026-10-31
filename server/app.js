/**
 * Uzhavan Hub - Express Application Setup
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { ExpressApp } from './utils/expressShim.js';
import apiRouter from './routes/api.js';
import { db } from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../');
const CLIENT_DIR = path.join(ROOT_DIR, 'client');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');

export async function createApp() {
  // Initialize Relational Database & Migrations
  await db.init();

  const app = new ExpressApp();

  // Mount REST API
  app.use('/api', apiRouter);

  // Mount Static Directories
  app.static(ROOT_DIR);
  app.static(CLIENT_DIR);
  app.static(path.join(CLIENT_DIR, 'public'));
  app.static(DATA_DIR);
  app.static(ASSETS_DIR);

  return app;
}
