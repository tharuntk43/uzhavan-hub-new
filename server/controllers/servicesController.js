/**
 * Uzhavan Hub - Farm Services Controller (Modules 13 & 14)
 * Labour Booking & Machinery Rental Marketplace
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { db } from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

function loadJSON(filename) {
  const fp = path.join(DATA_DIR, filename);
  if (fs.existsSync(fp)) return JSON.parse(fs.readFileSync(fp, 'utf-8'));
  return [];
}

// Module 13: Farm Labour
export async function getLabourListings(req, res) {
  try {
    const listings = loadJSON('labor_listings.json');
    const { operation, district } = req.query;

    let filtered = listings;
    if (district) {
      filtered = filtered.filter(l => l.district.toLowerCase().includes(district.toLowerCase()));
    }
    if (operation) {
      filtered = filtered.filter(l => l.primarySkills.some(s => s.toLowerCase().includes(operation.toLowerCase())));
    }

    return res.json({ success: true, count: filtered.length, listings: filtered });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve labour listings.' });
  }
}

export async function bookLabour(req, res) {
  try {
    const {
      workerId,
      workerName,
      operationType = 'Paddy Transplanting',
      bookingDate,
      workingHours = 'Full Day (8 hrs)',
      requiredWorkers = 8,
      dailyWage = 650,
      plotName = 'Main Plot',
      notes = ''
    } = req.body;

    if (!workerId || !bookingDate) {
      return res.status(400).json({ success: false, error: 'Worker team and booking date are required.' });
    }

    const totalAmount = parseFloat(dailyWage) * parseInt(requiredWorkers, 10);
    const bookingId = 'lbook_' + crypto.randomBytes(12).toString('hex');

    await db.run(`
      INSERT INTO labour_bookings (
        id, user_id, worker_id, worker_name, operation_type, booking_date,
        working_hours, required_workers, total_amount, plot_name, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      bookingId,
      req.user.id,
      workerId,
      workerName || 'Labour Group Leader',
      operationType,
      bookingDate,
      workingHours,
      parseInt(requiredWorkers, 10),
      totalAmount,
      plotName,
      'Pending',
      notes
    ]);

    const created = await db.get('SELECT * FROM labour_bookings WHERE id = ?', [bookingId]);
    return res.status(201).json({
      success: true,
      message: `Booking request sent to ${workerName}. Status: Pending farmer-labour confirmation.`,
      booking: created
    });
  } catch (err) {
    console.error('[Labour Booking Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to submit labour booking.' });
  }
}

export async function getMyLabourBookings(req, res) {
  try {
    const bookings = await db.query(`
      SELECT * FROM labour_bookings WHERE user_id = ? ORDER BY created_at DESC
    `, [req.user.id]);
    return res.json({ success: true, bookings: bookings.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch your bookings.' });
  }
}

// Module 14: Agricultural Machinery
export async function getMachineryListings(req, res) {
  try {
    const listings = loadJSON('machinery_catalog.json');
    const { category, district } = req.query;

    let filtered = listings;
    if (district) {
      filtered = filtered.filter(m => m.district.toLowerCase().includes(district.toLowerCase()));
    }
    if (category) {
      filtered = filtered.filter(m => m.category.toLowerCase().includes(category.toLowerCase()));
    }

    return res.json({ success: true, count: filtered.length, listings: filtered });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve machinery catalog.' });
  }
}

export async function bookMachinery(req, res) {
  try {
    const {
      machineryId,
      machineryName,
      rentalType = 'Hourly',
      duration = 4,
      rate = 750,
      startDate,
      plotName = 'Main Plot',
      notes = ''
    } = req.body;

    if (!machineryId || !startDate) {
      return res.status(400).json({ success: false, error: 'Machinery and start date are required.' });
    }

    const totalAmount = parseFloat(rate) * parseInt(duration, 10);
    const bookingId = 'mbook_' + crypto.randomBytes(12).toString('hex');

    await db.run(`
      INSERT INTO machinery_bookings (
        id, user_id, machinery_id, machinery_name, rental_type, duration,
        start_date, total_amount, plot_name, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      bookingId,
      req.user.id,
      machineryId,
      machineryName || 'Farm Machine',
      rentalType,
      parseInt(duration, 10),
      startDate,
      totalAmount,
      plotName,
      'Pending',
      notes
    ]);

    const created = await db.get('SELECT * FROM machinery_bookings WHERE id = ?', [bookingId]);
    return res.status(201).json({
      success: true,
      message: `Rental request submitted for ${machineryName}. Status: Pending owner dispatch confirmation.`,
      booking: created
    });
  } catch (err) {
    console.error('[Machinery Booking Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to submit machinery rental.' });
  }
}

export async function getMyMachineryBookings(req, res) {
  try {
    const bookings = await db.query(`
      SELECT * FROM machinery_bookings WHERE user_id = ? ORDER BY created_at DESC
    `, [req.user.id]);
    return res.json({ success: true, bookings: bookings.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch your machinery rentals.' });
  }
}
