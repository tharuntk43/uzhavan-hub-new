/**
 * Uzhavan Hub - Dual-Engine Database Adapter
 * Primary: PostgreSQL (via pg / DATABASE_URL)
 * Fallback: Node.js 24 native node:sqlite (zero external daemon dependency)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../../');
const DB_FILE = path.join(ROOT_DIR, 'uzhavan.db');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

class DatabaseAdapter {
  constructor() {
    this.driver = 'sqlite';
    this.sqliteDb = null;
    this.pgPool = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    // Check if PostgreSQL is configured via environment
    const pgUrl = process.env.DATABASE_URL;
    if (pgUrl) {
      try {
        console.log(`[Database] Attempting PostgreSQL connection to: ${pgUrl.split('@')[1] || 'remote host'}`);
        // Dynamic import to handle optional pg driver
        const { default: pg } = await import('pg');
        this.pgPool = new pg.Pool({ connectionString: pgUrl, connectionTimeoutMillis: 3000 });
        await this.pgPool.query('SELECT 1');
        this.driver = 'postgres';
        console.log('[Database] Connected successfully to PostgreSQL relational database!');
      } catch (err) {
        console.warn('[Database] PostgreSQL connection failed or driver unavailable. Falling back to persistent native SQLite engine.');
        this.driver = 'sqlite';
      }
    } else {
      this.driver = 'sqlite';
    }

    if (this.driver === 'sqlite') {
      try {
        const { DatabaseSync } = await import('node:sqlite');
        this.sqliteDb = new DatabaseSync(DB_FILE);
        // Enable WAL mode and foreign keys for high concurrent performance
        this.sqliteDb.exec('PRAGMA journal_mode = WAL;');
        this.sqliteDb.exec('PRAGMA foreign_keys = ON;');
        console.log(`[Database] Native SQLite Relational Engine active: ${DB_FILE}`);
      } catch (err) {
        console.error('[Database] Failed to initialize SQLite engine:', err);
        throw err;
      }
    }

    // Run schema migrations and seeds
    await this.applySchema();
    await this.seedReferenceData();
    this.initialized = true;
  }

  async applySchema() {
    if (!fs.existsSync(SCHEMA_FILE)) return;
    const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf-8');

    if (this.driver === 'postgres') {
      await this.pgPool.query(schemaSql);
    } else {
      try {
        this.sqliteDb.exec(schemaSql);
      } catch (err) {
        console.error('[Database Schema Execution Error]:', err);
      }
    }
  }

  async query(sql, params = []) {
    if (!this.initialized) await this.init();

    if (this.driver === 'postgres') {
      // Convert ? to $1, $2 for Postgres
      let paramIdx = 1;
      const pgSql = sql.replace(/\?/g, () => `$${paramIdx++}`);
      const res = await this.pgPool.query(pgSql, params);
      return { rows: res.rows, rowCount: res.rowCount };
    } else {
      // Native SQLite StatementSync
      try {
        const trimmed = sql.trim().toUpperCase();
        if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH') || trimmed.includes('RETURNING')) {
          const stmt = this.sqliteDb.prepare(sql);
          const rows = stmt.all(...params);
          return { rows, rowCount: rows.length };
        } else {
          const stmt = this.sqliteDb.prepare(sql);
          const info = stmt.run(...params);
          return {
            rows: [],
            rowCount: info.changes,
            lastInsertRowid: info.lastInsertRowid
          };
        }
      } catch (err) {
        console.error(`[Database Error] SQL: ${sql} | Params: ${JSON.stringify(params)}`, err);
        throw err;
      }
    }
  }

  async get(sql, params = []) {
    const res = await this.query(sql, params);
    return res.rows && res.rows.length > 0 ? res.rows[0] : null;
  }

  async run(sql, params = []) {
    return await this.query(sql, params);
  }

  hashPassword(password, salt = 'uzhavan_secure_salt_2026') {
    return crypto.scryptSync(password, salt, 64).toString('hex');
  }

  async seedReferenceData() {
    // Check if demo users exist
    const existing = await this.get('SELECT COUNT(*) as count FROM users WHERE email = ?', ['murugan@uzhavan.tn.gov.in']);
    if (existing && existing.count > 0) {
      return; // Already seeded
    }

    console.log('[Database] Seeding authenticated demo farmers & land plots...');

    const demoPasswordHash = this.hashPassword('Farmer@123');

    // 1. Murugan P. from Madurai
    await this.run(`
      INSERT INTO users (id, email, password_hash, full_name, phone, language_pref, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['user_murugan_01', 'murugan@uzhavan.tn.gov.in', demoPasswordHash, 'Murugan P.', '9842145670', 'ta', 'farmer']);

    await this.run(`
      INSERT INTO farmer_profiles (id, user_id, state, district, village, farmer_type, experience_years, primary_activity, avatar, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['prof_murugan_01', 'user_murugan_01', 'Tamil Nadu', 'Madurai', 'Vadipatti', 'Owner', 18, 'Grains & Oilseeds', '👨‍🌾', 'Experienced delta margin farmer practicing integrated paddy-cotton-pulse relay farming.']);

    await this.run(`
      INSERT INTO land_plots (id, user_id, plot_name, area_acres, area_original, area_unit, soil_type, soil_ph, organic_carbon, fertility_notes, irrigation_source, water_availability, current_crop, previous_crop, planned_crop, sowing_date, estimated_budget, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['plot_murugan_01', 'user_murugan_01', 'Vadipatti Black Cotton Plot', 2.5, 2.5, 'acres', 'Black Cotton Soil (Regur)', 7.8, '0.58%', 'Deep regur clay with high moisture buffer.', 'Open Well + Rainfed', 'Moderate', 'Cotton (MCU 5)', 'Maize (CO 6)', 'Sorghum (CO 30)', '2026-08-10', 28000, 1]);

    await this.run(`
      INSERT INTO land_plots (id, user_id, plot_name, area_acres, area_original, area_unit, soil_type, soil_ph, organic_carbon, fertility_notes, irrigation_source, water_availability, current_crop, previous_crop, planned_crop, sowing_date, estimated_budget, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['plot_murugan_02', 'user_murugan_01', 'Vaigai Channel Paddy Field', 2.0, 200, 'cents', 'Alluvial Soil', 7.1, '0.65%', 'Fine river alluvium, optimal tillering bed.', 'Canal (Vaigai)', 'Seasonal/Deficit', 'Paddy (ADT 37)', 'Black Gram', 'Sesame', '2026-09-01', 24000, 0]);

    // 2. Anitha R. from Thanjavur
    await this.run(`
      INSERT INTO users (id, email, password_hash, full_name, phone, language_pref, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['user_anitha_02', 'anitha@uzhavan.tn.gov.in', demoPasswordHash, 'Anitha R.', '9443218765', 'ta', 'farmer']);

    await this.run(`
      INSERT INTO farmer_profiles (id, user_id, state, district, village, farmer_type, experience_years, primary_activity, avatar, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['prof_anitha_02', 'user_anitha_02', 'Tamil Nadu', 'Thanjavur', 'Papanasam', 'Both', 12, 'Horticulture & Dairy', '👩‍🌾', 'Progressive woman farmer operating precision drip banana grove and organic millets.']);

    await this.run(`
      INSERT INTO land_plots (id, user_id, plot_name, area_acres, area_original, area_unit, soil_type, soil_ph, organic_carbon, fertility_notes, irrigation_source, water_availability, current_crop, previous_crop, planned_crop, sowing_date, estimated_budget, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['plot_anitha_01', 'user_anitha_02', 'Papanasam Banana Grove', 3.2, 3.2, 'acres', 'Clayey Alluvial Soil', 6.9, '0.72%', 'Rich delta silt with high potassium index.', 'Borewell + Drip', 'Abundant', 'Banana (Grand Naine)', 'Black Gram', 'Banana Ratoon', '2026-03-15', 55000, 1]);

    // 3. Selvam V. from Thanjavur (Stitch Design Primary Persona)
    await this.run(`
      INSERT INTO users (id, email, password_hash, full_name, phone, language_pref, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['user_selvam_03', 'selvam@uzhavan.tn.gov.in', demoPasswordHash, 'Selvam V.', '9789012345', 'en', 'farmer']);

    await this.run(`
      INSERT INTO farmer_profiles (id, user_id, state, district, village, farmer_type, experience_years, primary_activity, avatar, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['prof_selvam_03', 'user_selvam_03', 'Tamil Nadu', 'Thanjavur', 'Kabisthalam', 'Owner', 22, 'Grains & Pulses', '👨‍🌾', 'Stitch Design Persona: Delta agro-ecological farmer cultivating Samba BPT 5204.']);

    await this.run(`
      INSERT INTO land_plots (id, user_id, plot_name, area_acres, area_original, area_unit, soil_type, soil_ph, organic_carbon, fertility_notes, irrigation_source, water_availability, current_crop, previous_crop, planned_crop, sowing_date, estimated_budget, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['plot_selvam_01', 'user_selvam_03', 'Vadavaru River Plot', 3.5, 3.5, 'acres', 'Clayey Alluvial Soil', 7.2, '0.68%', 'Heavy alluvial clay; high moisture holding capacity.', 'Canal + Deep Tube (High)', 'Abundant', 'Paddy BPT 5204 (Andhra Ponni)', 'Kuruvai ADT 43', 'Black Gram (VBN 8)', '2026-09-15', 35000, 1]);

    await this.run(`
      INSERT INTO land_plots (id, user_id, plot_name, area_acres, area_original, area_unit, soil_type, soil_ph, organic_carbon, fertility_notes, irrigation_source, water_availability, current_crop, previous_crop, planned_crop, sowing_date, estimated_budget, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['plot_selvam_02', 'user_selvam_03', 'Kabisthalam Banana Orchard', 1.8, 1.8, 'acres', 'Clayey Alluvial Soil', 6.8, '0.75%', 'Dense alluvial clay, strong nutrient holding capacity.', 'Borewell + Drip', 'Abundant', 'Banana (Grand Naine)', 'Banana Ratoon', 'Banana Ratoon 2', '2026-02-10', 60000, 0]);

    await this.run(`
      INSERT INTO land_plots (id, user_id, plot_name, area_acres, area_original, area_unit, soil_type, soil_ph, organic_carbon, fertility_notes, irrigation_source, water_availability, current_crop, previous_crop, planned_crop, sowing_date, estimated_budget, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['plot_selvam_03', 'user_selvam_03', 'Papanasam North Black Gram Plot', 2.0, 200, 'cents', 'Sandy Loam', 7.0, '0.62%', 'Well-drained sandy loam for relay pulses.', 'Canal Feeder', 'Moderate', 'Black Gram (VBN 8)', 'Samba Paddy', 'Sesame (TMV 7)', '2026-01-20', 16000, 0]);

    // Initial Community Posts
    await this.run(`
      INSERT INTO community_posts (id, user_id, author_name, district, crop_tag, category, title, content, likes_count, replies_count, is_verified_expert)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['post_01', 'user_selvam_03', 'Selvam V.', 'Thanjavur', 'Paddy', 'Pest Attack', 'Blast disease observed on Ponni BPT 5204 flag leaves after dew', 'Noticed spindle-shaped lesions with brown borders on upper leaves in Vadavaru plot. Has anyone tried Pseudomonas seed treatment or Tricyclazole spray? Looking for timing advice.', 14, 2, 0]);

    await this.run(`
      INSERT INTO community_replies (id, post_id, user_id, author_name, content, is_expert)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['rep_01', 'post_01', 'user_anitha_02', 'Dr. Sundaram (TNAU Agronomist)', 'Spray Tricyclazole 75% WP at 0.6g/L immediately during early morning. Ensure field water is not stagnant. Drain slightly and avoid urea top dressing for the next 7 days.', 1]);

    await this.run(`
      INSERT INTO community_posts (id, user_id, author_name, district, crop_tag, category, title, content, likes_count, replies_count, is_verified_expert)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['post_02', 'user_murugan_01', 'Murugan P.', 'Madurai', 'Cotton', 'Yield & Soil', 'Experience with 9-tyne cultivator in black cotton soil before sowing', 'Deep summer plowing with tractor mounted cultivator helped crack heavy black soil and reduce root-knot nematodes significantly in Vadipatti block.', 22, 1, 0]);

    // Initial Farm Tasks for Selvam's Vadavaru Plot
    const tasks = [
      { id: 'task_01', week: 2, stage: 'Basal Dosing', title: 'Broadcast DAP 45kg + MOP 15kg + Zinc Sulfate 10kg as basal dose', cat: 'Fertilizer', completed: 1 },
      { id: 'task_02', week: 4, stage: 'Transplanting', title: 'Transplant 21-day nursery seedlings with thin water layer', cat: 'Transplanting', completed: 1 },
      { id: 'task_03', week: 6, stage: 'Active Tillering', title: 'First Urea + Potash split application window (Day 35-42)', cat: 'Fertilizer', completed: 1 },
      { id: 'task_04', week: 9, stage: 'Panicle Initiation', title: 'Booting phase blast disease prophylactic surveillance and Tricyclazole spray', cat: 'Pest Surveillance', completed: 0 },
      { id: 'task_05', week: 14, stage: 'Grain Maturation', title: 'Field de-watering 10-12 days before combined harvester entry', cat: 'Harvest Prep', completed: 0 }
    ];

    for (const t of tasks) {
      await this.run(`
        INSERT INTO farm_tasks (id, user_id, plot_id, week_number, stage_name, task_title, category, is_completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [t.id, 'user_selvam_03', 'plot_selvam_01', t.week, t.stage, t.title, t.cat, t.completed]);
    }

    console.log('[Database] Seeded 3 verified farmer accounts, 5 plots, and initial records successfully!');
  }
}

export const db = new DatabaseAdapter();
