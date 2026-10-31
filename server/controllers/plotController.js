/**
 * Uzhavan Hub - Land Plot Controller
 * Multi-plot farmland management, unit conversions, and active plot switching
 */

import crypto from 'crypto';
import { db } from '../database/db.js';
import { checkOwnership } from '../middleware/auth.js';

export async function listPlots(req, res) {
  try {
    const resPlots = await db.query(`
      SELECT * FROM land_plots WHERE user_id = ? ORDER BY is_active DESC, created_at ASC
    `, [req.user.id]);

    return res.json({ success: true, plots: resPlots.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve farmland plots.' });
  }
}

export async function addPlot(req, res) {
  try {
    const {
      plotName,
      area,
      unit = 'acres',
      soilType = 'Clayey Alluvial Soil',
      soilPh = 7.0,
      organicCarbon = '0.65%',
      fertilityNotes = '',
      irrigationSource = 'Canal',
      waterAvailability = 'Abundant',
      currentCrop = 'Paddy',
      previousCrop = 'Black Gram',
      plannedCrop = 'Sesame',
      sowingDate,
      estimatedBudget = 25000,
      isActive = false
    } = req.body;

    if (!plotName || !area) {
      return res.status(400).json({ success: false, error: 'Plot name and land area are required.' });
    }

    let normalizedAcres = parseFloat(area) || 1.0;
    const cleanUnit = unit.toLowerCase();
    if (cleanUnit === 'hectares' || cleanUnit === 'ha') {
      normalizedAcres = normalizedAcres * 2.471;
    } else if (cleanUnit === 'cents') {
      normalizedAcres = normalizedAcres / 100.0;
    }

    const plotCount = await db.get('SELECT COUNT(*) as count FROM land_plots WHERE user_id = ?', [req.user.id]);
    const shouldBeActive = isActive || plotCount.count === 0 ? 1 : 0;

    if (shouldBeActive === 1) {
      await db.run('UPDATE land_plots SET is_active = 0 WHERE user_id = ?', [req.user.id]);
    }

    const plotId = 'plot_' + crypto.randomBytes(12).toString('hex');
    await db.run(`
      INSERT INTO land_plots (
        id, user_id, plot_name, area_acres, area_original, area_unit, soil_type,
        soil_ph, organic_carbon, fertility_notes, irrigation_source, water_availability,
        current_crop, previous_crop, planned_crop, sowing_date, estimated_budget, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      plotId,
      req.user.id,
      plotName.trim(),
      parseFloat(normalizedAcres.toFixed(2)),
      parseFloat(area),
      cleanUnit,
      soilType,
      parseFloat(soilPh) || 7.0,
      organicCarbon,
      fertilityNotes,
      irrigationSource,
      waterAvailability,
      currentCrop,
      previousCrop,
      plannedCrop,
      sowingDate || new Date().toISOString().split('T')[0],
      parseFloat(estimatedBudget) || 25000,
      shouldBeActive
    ]);

    const created = await db.get('SELECT * FROM land_plots WHERE id = ?', [plotId]);
    return res.status(201).json({
      success: true,
      message: `Farmland plot '${plotName}' registered successfully!`,
      plot: created
    });
  } catch (err) {
    console.error('[Add Plot Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to add farmland plot.' });
  }
}

export async function updatePlot(req, res) {
  try {
    const { id } = req.params;
    const existing = await db.get('SELECT * FROM land_plots WHERE id = ?', [id]);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Plot not found.' });
    }

    if (!checkOwnership(req, res, existing.user_id)) return;

    const {
      plotName,
      area,
      unit,
      soilType,
      soilPh,
      organicCarbon,
      fertilityNotes,
      irrigationSource,
      waterAvailability,
      currentCrop,
      previousCrop,
      plannedCrop,
      sowingDate,
      estimatedBudget
    } = req.body;

    let normalizedAcres = existing.area_acres;
    let cleanUnit = existing.area_unit;
    let originalArea = existing.area_original;

    if (area !== undefined) {
      cleanUnit = (unit || existing.area_unit || 'acres').toLowerCase();
      normalizedAcres = parseFloat(area) || 1.0;
      originalArea = parseFloat(area);
      if (cleanUnit === 'hectares' || cleanUnit === 'ha') {
        normalizedAcres = normalizedAcres * 2.471;
      } else if (cleanUnit === 'cents') {
        normalizedAcres = normalizedAcres / 100.0;
      }
      normalizedAcres = parseFloat(normalizedAcres.toFixed(2));
    }

    await db.run(`
      UPDATE land_plots SET
        plot_name = ?,
        area_acres = ?,
        area_original = ?,
        area_unit = ?,
        soil_type = ?,
        soil_ph = ?,
        organic_carbon = ?,
        fertility_notes = ?,
        irrigation_source = ?,
        water_availability = ?,
        current_crop = ?,
        previous_crop = ?,
        planned_crop = ?,
        sowing_date = ?,
        estimated_budget = ?
      WHERE id = ?
    `, [
      plotName !== undefined ? plotName.trim() : existing.plot_name,
      normalizedAcres,
      originalArea,
      cleanUnit,
      soilType || existing.soil_type,
      soilPh !== undefined ? parseFloat(soilPh) : existing.soil_ph,
      organicCarbon || existing.organic_carbon,
      fertilityNotes !== undefined ? fertilityNotes : existing.fertility_notes,
      irrigationSource || existing.irrigation_source,
      waterAvailability || existing.water_availability,
      currentCrop || existing.current_crop,
      previousCrop || existing.previous_crop,
      plannedCrop || existing.planned_crop,
      sowingDate || existing.sowing_date,
      estimatedBudget !== undefined ? parseFloat(estimatedBudget) : existing.estimated_budget,
      id
    ]);

    const updated = await db.get('SELECT * FROM land_plots WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Plot details updated.', plot: updated });
  } catch (err) {
    console.error('[Update Plot Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to update plot.' });
  }
}

export async function deletePlot(req, res) {
  try {
    const { id } = req.params;
    const existing = await db.get('SELECT * FROM land_plots WHERE id = ?', [id]);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Plot not found.' });
    }

    if (!checkOwnership(req, res, existing.user_id)) return;

    await db.run('DELETE FROM land_plots WHERE id = ?', [id]);

    // If active plot was deleted, activate the next available plot
    if (existing.is_active) {
      const remaining = await db.get('SELECT id FROM land_plots WHERE user_id = ? LIMIT 1', [req.user.id]);
      if (remaining) {
        await db.run('UPDATE land_plots SET is_active = 1 WHERE id = ?', [remaining.id]);
      }
    }

    return res.json({ success: true, message: `Plot '${existing.plot_name}' deleted successfully.` });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete plot.' });
  }
}

export async function activatePlot(req, res) {
  try {
    const { id } = req.params;
    const existing = await db.get('SELECT * FROM land_plots WHERE id = ?', [id]);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Plot not found.' });
    }

    if (!checkOwnership(req, res, existing.user_id)) return;

    await db.run('UPDATE land_plots SET is_active = 0 WHERE user_id = ?', [req.user.id]);
    await db.run('UPDATE land_plots SET is_active = 1 WHERE id = ?', [id]);

    const activated = await db.get('SELECT * FROM land_plots WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: `Active plot switched to '${activated.plot_name}'. AI decision engine recalibrated.`,
      activePlot: activated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to activate plot.' });
  }
}
