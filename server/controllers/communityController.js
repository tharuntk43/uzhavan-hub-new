/**
 * Uzhavan Hub - Community Forum (Module 18), Farm Calendar (Module 19), Fertilizer (Module 20)
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
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

// Module 18: Farmer Community & Q&A Forum
export async function getPosts(req, res) {
  try {
    const { crop, district, category } = req.query;
    let sql = 'SELECT * FROM community_posts WHERE 1=1';
    const params = [];

    if (crop) {
      sql += ' AND crop_tag = ?';
      params.push(crop);
    }
    if (district) {
      sql += ' AND district = ?';
      params.push(district);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY created_at DESC LIMIT 50';

    const posts = await db.query(sql, params);
    return res.json({ success: true, count: posts.rowCount, posts: posts.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load community discussions.' });
  }
}

export async function createPost(req, res) {
  try {
    const { title, content, cropTag = 'General', category = 'Discussion', district } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required.' });
    }

    const postId = 'post_' + crypto.randomBytes(12).toString('hex');
    const authorName = req.user.fullName || 'Verified Farmer';
    const postDistrict = district || req.user.profile?.district || 'Tamil Nadu';

    await db.run(`
      INSERT INTO community_posts (
        id, user_id, author_name, district, crop_tag, category, title, content, is_verified_expert
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [postId, req.user.id, authorName, postDistrict, cropTag, category, title.trim(), content.trim(), 0]);

    const created = await db.get('SELECT * FROM community_posts WHERE id = ?', [postId]);
    return res.status(201).json({ success: true, message: 'Discussion posted to Uzhavan Community!', post: created });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to create community post.' });
  }
}

export async function getReplies(req, res) {
  try {
    const { id } = req.params;
    const replies = await db.query(`
      SELECT * FROM community_replies WHERE post_id = ? ORDER BY created_at ASC
    `, [id]);
    return res.json({ success: true, replies: replies.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load replies.' });
  }
}

export async function createReply(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Reply text is required.' });
    }

    const replyId = 'rep_' + crypto.randomBytes(12).toString('hex');
    const authorName = req.user.fullName || 'Verified Farmer';

    await db.run(`
      INSERT INTO community_replies (id, post_id, user_id, author_name, content, is_expert)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [replyId, id, req.user.id, authorName, content.trim(), 0]);

    await db.run('UPDATE community_posts SET replies_count = replies_count + 1 WHERE id = ?', [id]);

    const created = await db.get('SELECT * FROM community_replies WHERE id = ?', [replyId]);
    return res.status(201).json({ success: true, reply: created });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to post reply.' });
  }
}

export async function likePost(req, res) {
  try {
    const { id } = req.params;
    await db.run('UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = ?', [id]);
    const updated = await db.get('SELECT likes_count FROM community_posts WHERE id = ?', [id]);
    return res.json({ success: true, likesCount: updated.likes_count });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to like post.' });
  }
}

// Module 19: Weekly Farm Action Plan & Crop Calendar
export async function getCalendarTasks(req, res) {
  try {
    const plotId = req.query.plotId;
    let tasks;

    if (req.user && plotId) {
      tasks = await db.query(`
        SELECT * FROM farm_tasks WHERE user_id = ? AND plot_id = ? ORDER BY week_number ASC
      `, [req.user.id, plotId]);
    } else if (req.user) {
      tasks = await db.query(`
        SELECT * FROM farm_tasks WHERE user_id = ? ORDER BY week_number ASC
      `, [req.user.id]);
    }

    if (!tasks || tasks.rowCount === 0) {
      // Fallback template from JSON
      const templates = loadJSON('farm_calendar_templates.json');
      return res.json({
        success: true,
        isTemplate: true,
        schedule: templates.paddy_samba
      });
    }

    const total = tasks.rowCount;
    const completed = tasks.rows.filter(t => t.is_completed === 1 || t.is_completed === true).length;
    const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.json({
      success: true,
      tasks: tasks.rows,
      progressPercentage: progressPct,
      completedCount: completed,
      totalCount: total
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load action plan tasks.' });
  }
}

export async function toggleTask(req, res) {
  try {
    const { id } = req.params;
    const { isCompleted } = req.body;

    const task = await db.get('SELECT * FROM farm_tasks WHERE id = ?', [id]);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }

    if (task.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    const newVal = isCompleted ? 1 : 0;
    const completedAt = isCompleted ? new Date().toISOString() : null;

    await db.run(`
      UPDATE farm_tasks SET is_completed = ?, completed_at = ? WHERE id = ?
    `, [newVal, completedAt, id]);

    return res.json({ success: true, taskId: id, isCompleted: !!newVal });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update task state.' });
  }
}

// Module 20: Fertilizer & Nutrient Management
export async function calculateFertilizer(req, res) {
  try {
    const {
      cropId = 'paddy_bpt5204',
      plotAreaAcres = 1.0,
      customN,
      customP,
      customK
    } = req.body;

    const guidelines = loadJSON('fertilizer_guidelines.json');
    const guideline = guidelines.find(g => g.cropId === cropId) || guidelines[0];

    const acres = parseFloat(plotAreaAcres) || 1.0;

    // Base NPK requirements per acre
    const n = customN ? parseFloat(customN) : guideline.standardRecommendationKgPerAcre.N;
    const p = customP ? parseFloat(customP) : guideline.standardRecommendationKgPerAcre.P;
    const k = customK ? parseFloat(customK) : guideline.standardRecommendationKgPerAcre.K;

    const totalN = Math.round(n * acres);
    const totalP = Math.round(p * acres);
    const totalK = Math.round(k * acres);

    // Standard commercial fertilizer conversions
    // DAP (18% N, 46% P2O5) -> 100 kg DAP = 18kg N + 46kg P
    const dapRequiredKg = Math.round((totalP / 0.46));
    const nFromDap = dapRequiredKg * 0.18;
    const remainingN = Math.max(0, totalN - nFromDap);
    // Urea (46% N) -> 100 kg Urea = 46kg N
    const ureaRequiredKg = Math.round(remainingN / 0.46);
    // MOP (60% K2O) -> 100 kg MOP = 60kg K
    const mopRequiredKg = Math.round(totalK / 0.60);

    // 50 kg bags
    const dapBags = (dapRequiredKg / 50).toFixed(1);
    const ureaBags = (ureaRequiredKg / 50).toFixed(1);
    const mopBags = (mopRequiredKg / 50).toFixed(1);

    const splitSchedule = [
      {
        stage: 'Basal Application (At Sowing / Puddling)',
        stageTa: 'அடி உரம் (விதைப்பு / நடவு போது)',
        ureaKg: Math.round(ureaRequiredKg * 0.2),
        dapKg: dapRequiredKg,
        mopKg: Math.round(mopRequiredKg * 0.4),
        microKg: Math.round(10 * acres),
        instructions: 'Broadcast DAP, zinc sulfate and 40% potash into mud and incorporate thoroughly before transplanting.'
      },
      {
        stage: 'Active Tillering (21-25 Days After Sowing)',
        stageTa: 'தூர்கட்டும் பருவம் (21-25 நாட்கள்)',
        ureaKg: Math.round(ureaRequiredKg * 0.5),
        dapKg: 0,
        mopKg: 0,
        microKg: 0,
        instructions: 'Apply 50% of Urea split when thin water film is present in the field. Avoid draining for 48 hours.'
      },
      {
        stage: 'Panicle Initiation / Flowering (50-55 DAS)',
        stageTa: 'கதிர் உருவாகும் பருவம் (50-55 நாட்கள்)',
        ureaKg: Math.round(ureaRequiredKg * 0.3),
        dapKg: 0,
        mopKg: Math.round(mopRequiredKg * 0.6),
        microKg: 0,
        instructions: 'Apply final split of Urea and remaining 60% Potash (MOP) to optimize grain weight and prevent sheath lodging.'
      }
    ];

    let specialCropAdvice = '';
    if (cropId.includes('groundnut')) {
      specialCropAdvice = 'Gypsum Recommendation: Apply 200 kg Gypsum per acre in two splits (100 kg basal + 100 kg at 40-45 DAS during earthing up) to ensure pod calcium filling and bold kernels.';
    } else if (cropId.includes('paddy')) {
      specialCropAdvice = 'Delta Zinc Advisory: Delta soils frequently exhibit zinc deficiency. Incorporate 10 kg Zinc Sulfate per acre during final puddling. Do not mix zinc sulfate directly with DAP.';
    }

    return res.json({
      success: true,
      parameters: {
        cropId,
        cropName: guideline.cropName,
        plotAreaAcres: acres,
        recommendedNPKKgPerAcre: { N: n, P: p, K: k },
        totalPlotNPKKg: { N: totalN, P: totalP, K: totalK }
      },
      commercialFertilizerSummary: {
        dapKg: dapRequiredKg,
        dapBags: `${dapBags} Bags (50kg)`,
        ureaKg: ureaRequiredKg,
        ureaBags: `${ureaBags} Bags (50kg)`,
        mopKg: mopRequiredKg,
        mopBags: `${mopBags} Bags (50kg)`
      },
      splitSchedule,
      specialCropAdvice
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Fertilizer calculation failure.' });
  }
}
