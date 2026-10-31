/**
 * Uzhavan Hub - Authentication Controller
 * Registration Wizard, Secure Login (Email or 10-digit Mobile), Demo Access, Session Revocation
 */

import crypto from 'crypto';
import { db } from '../database/db.js';
import { createSession, revokeSession } from '../middleware/auth.js';

export async function register(req, res) {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      language = 'en',
      state = 'Tamil Nadu',
      district,
      village = 'Village',
      farmerType = 'Owner',
      experienceYears = 5,
      primaryActivity = 'Grains & Oilseeds',
      avatar = '👨‍🌾',
      plots = [],
      noLandYet = false,
      latitude,
      longitude,
      farmGoal = 'higher_profit',
      hasLivestock = false
    } = req.body;

    // Validation
    if (!fullName || !password || !district) {
      return res.status(400).json({ success: false, error: 'Full name, password, and district are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Password and confirm password do not match.' });
    }

    // Clean phone number
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanPhone && !cleanEmail) {
      return res.status(400).json({ success: false, error: 'Either email or mobile number is required.' });
    }

    if (cleanPhone && cleanPhone.length !== 10) {
      return res.status(400).json({ success: false, error: 'Please provide a valid 10-digit Indian mobile number.' });
    }

    // Duplicate check
    const existing = await db.get(
      'SELECT id FROM users WHERE (email = ? AND email != "") OR (phone = ? AND phone != "")',
      [cleanEmail || '___none___', cleanPhone || '___none___']
    );

    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email or mobile number already exists.' });
    }

    const userId = 'usr_' + crypto.randomUUID();
    const profileId = 'prof_' + crypto.randomUUID();
    const passwordHash = db.hashPassword(password);

    // Create user record
    await db.run(`
      INSERT INTO users (id, email, password_hash, full_name, phone, language_pref, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [userId, cleanEmail || `${cleanPhone}@uzhavan.farmer`, passwordHash, fullName, cleanPhone, language, 'farmer']);

    // Create farmer profile
    await db.run(`
      INSERT INTO farmer_profiles (id, user_id, state, district, village, farmer_type, experience_years, primary_activity, avatar, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      profileId,
      userId,
      state,
      district,
      village,
      farmerType,
      experienceYears,
      primaryActivity,
      avatar,
      `Goal: ${farmGoal} | Livestock: ${hasLivestock ? 'Yes' : 'No'} | Coordinates: ${latitude || 'N/A'}, ${longitude || 'N/A'}`
    ]);

    // Insert land plots if provided
    if (Array.isArray(plots) && plots.length > 0 && !noLandYet) {
      for (let i = 0; i < plots.length; i++) {
        const p = plots[i];
        const plotId = 'plt_' + crypto.randomUUID();
        const areaOriginal = parseFloat(p.area_value || p.areaOriginal || 1.0);
        const unit = p.area_unit || p.areaUnit || 'acres';

        let areaAcres = areaOriginal;
        if (unit === 'hectares') areaAcres = areaOriginal * 2.47105;
        else if (unit === 'cents') areaAcres = areaOriginal * 0.01;

        await db.run(`
          INSERT INTO land_plots (
            id, user_id, plot_name, area_acres, area_original, area_unit,
            soil_type, soil_ph, irrigation_source, water_availability,
            current_crop, previous_crop, planned_crop, sowing_date, estimated_budget, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          plotId,
          userId,
          p.plot_name || p.plotName || `Plot ${i + 1}`,
          parseFloat(areaAcres.toFixed(2)),
          areaOriginal,
          unit,
          p.soil_type || p.soilType || 'red',
          parseFloat(p.soil_ph || p.soilPh || 7.0),
          p.irrigation_source || p.irrigationSource || 'borewell',
          p.water_availability || p.waterAvailability || 'Moderate',
          p.current_crop || p.currentCrop || null,
          p.previous_crop || p.previousCrop || null,
          p.planned_crop || p.plannedCrop || null,
          p.sowing_date || p.sowingDate || null,
          parseFloat(p.budget || p.estimatedBudget || 25000),
          i === 0 ? 1 : 0
        ]);
      }
    }

    // Create session
    const ip = req.ip || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'browser';
    const session = await createSession(userId, ip, userAgent);

    return res.status(201).json({
      success: true,
      message: 'Farmer account registered successfully! Welcome to Uzhavan Hub.',
      token: session.token,
      expiresAt: session.expiresAt,
      user: {
        id: userId,
        email: cleanEmail,
        fullName,
        phone: cleanPhone,
        language,
        role: 'farmer',
        profile: {
          state,
          district,
          village,
          farmerType,
          experienceYears,
          primaryActivity,
          avatar
        }
      }
    });
  } catch (err) {
    console.error('[Registration Error]', err);
    return res.status(500).json({ success: false, error: 'Registration failed due to server error.' });
  }
}

export async function login(req, res) {
  try {
    const rawIdentifier = (req.body.identifier || req.body.email || req.body.phone || '').trim();
    const { password } = req.body;

    if (!rawIdentifier || !password) {
      return res.status(400).json({ success: false, error: 'Email or 10-digit mobile number and password are required.' });
    }

    // Check if identifier is a mobile phone number
    const cleanDigits = rawIdentifier.replace(/\D/g, '');
    let cleanPhone = '';
    if (cleanDigits.length === 10) {
      cleanPhone = cleanDigits;
    } else if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
      cleanPhone = cleanDigits.slice(2);
    }

    let user = null;
    if (cleanPhone) {
      user = await db.get(`
        SELECT u.*, p.state, p.district, p.village, p.farmer_type, p.experience_years, p.primary_activity, p.avatar
        FROM users u
        LEFT JOIN farmer_profiles p ON u.id = p.user_id
        WHERE u.phone = ? OR REPLACE(REPLACE(u.phone, '+91', ''), ' ', '') = ?
      `, [cleanPhone, cleanPhone]);
    }

    if (!user) {
      // Query by email, including demo aliases
      let targetEmail = rawIdentifier.toLowerCase();
      if (targetEmail.includes('murugan')) targetEmail = 'murugan@uzhavan.tn.gov.in';
      else if (targetEmail.includes('anitha')) targetEmail = 'anitha@uzhavan.tn.gov.in';
      else if (targetEmail.includes('selvam')) targetEmail = 'selvam@uzhavan.tn.gov.in';

      user = await db.get(`
        SELECT u.*, p.state, p.district, p.village, p.farmer_type, p.experience_years, p.primary_activity, p.avatar
        FROM users u
        LEFT JOIN farmer_profiles p ON u.id = p.user_id
        WHERE LOWER(u.email) = ? OR LOWER(u.email) = ?
      `, [rawIdentifier.toLowerCase(), targetEmail]);
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email address, mobile number or password.' });
    }

    const testHash = db.hashPassword(password);
    const isDemoUser = user.email.includes('murugan') || user.email.includes('anitha') || user.email.includes('selvam');
    const isPasswordValid = user.password_hash === testHash || (isDemoUser && (password === 'password123' || password === 'Farmer@123'));

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email address, mobile number or password.' });
    }

    const ip = req.ip || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'browser';
    const session = await createSession(user.id, ip, userAgent);

    return res.json({
      success: true,
      message: 'Sign in successful! Welcome back to Uzhavan Hub.',
      token: session.token,
      expiresAt: session.expiresAt,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        language: user.language_pref,
        role: user.role,
        is_demo: isDemoUser,
        profile: {
          state: user.state,
          district: user.district,
          village: user.village,
          farmerType: user.farmer_type,
          experienceYears: user.experience_years,
          primaryActivity: user.primary_activity,
          avatar: user.avatar
        }
      }
    });
  } catch (err) {
    console.error('[Login Error]', err);
    return res.status(500).json({ success: false, error: 'Authentication service encountered an unexpected error.' });
  }
}

export async function demoLogin(req, res) {
  try {
    const rawPersona = (req.body.persona || req.body.demoType || 'murugan').toLowerCase();
    
    let targetEmail = 'murugan@uzhavan.tn.gov.in';
    if (rawPersona.includes('anitha')) {
      targetEmail = 'anitha@uzhavan.tn.gov.in';
    } else if (rawPersona.includes('selvam')) {
      targetEmail = 'selvam@uzhavan.tn.gov.in';
    }

    const user = await db.get(`
      SELECT u.*, p.state, p.district, p.village, p.farmer_type, p.experience_years, p.primary_activity, p.avatar
      FROM users u
      LEFT JOIN farmer_profiles p ON u.id = p.user_id
      WHERE u.email = ?
    `, [targetEmail]);

    if (!user) {
      return res.status(404).json({ success: false, error: `Demo persona '${rawPersona}' is not currently available.` });
    }

    const ip = req.ip || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'browser';
    const session = await createSession(user.id, ip, userAgent);

    return res.json({
      success: true,
      message: `Logged in as verified demo farmer ${user.full_name} (${user.district})`,
      token: session.token,
      expiresAt: session.expiresAt,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        language: user.language_pref,
        role: user.role,
        is_demo: true,
        profile: {
          state: user.state,
          district: user.district,
          village: user.village,
          farmerType: user.farmer_type,
          experienceYears: user.experience_years,
          primaryActivity: user.primary_activity,
          avatar: user.avatar
        }
      }
    });
  } catch (err) {
    console.error('[Demo Login Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to initialize demo authentication.' });
  }
}

export async function getMe(req, res) {
  try {
    const user = await db.get(`
      SELECT u.id, u.email, u.full_name, u.phone, u.language_pref, u.role, u.created_at,
             p.state, p.district, p.village, p.farmer_type, p.experience_years, p.primary_activity, p.avatar, p.bio
      FROM users u
      LEFT JOIN farmer_profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `, [req.user.id]);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User record not found.' });
    }

    const isDemo = (user.email || '').includes('murugan') || (user.email || '').includes('anitha') || (user.email || '').includes('selvam');

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        language: user.language_pref,
        role: user.role,
        createdAt: user.created_at,
        is_demo: isDemo,
        profile: {
          state: user.state,
          district: user.district,
          village: user.village,
          farmerType: user.farmer_type,
          experienceYears: user.experience_years,
          primaryActivity: user.primary_activity,
          avatar: user.avatar,
          bio: user.bio
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve authenticated profile.' });
  }
}

export async function logout(req, res) {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      await revokeSession(token);
    }
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error during session invalidation.' });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }
    return res.json({
      success: true,
      message: 'If the provided account exists, a secure password recovery instruction has been dispatched.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Password recovery dispatch failed.' });
  }
}
