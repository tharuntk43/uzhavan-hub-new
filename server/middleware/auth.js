/**
 * Uzhavan Hub - Authentication & Authorization Middleware
 * Persistent session management with 30-day lifetime, HTTP-only cookie support,
 * and strict farmer-level authorization.
 */

import crypto from 'crypto';
import { db } from '../database/db.js';

export async function createSession(userId, ip = '127.0.0.1', userAgent = 'browser') {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = 'sess_' + crypto.randomBytes(16).toString('hex');
  
  // 30 days session lifetime
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await db.run(`
    INSERT INTO user_sessions (id, user_id, session_token, ip_address, user_agent, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [sessionId, userId, token, ip, userAgent, expiresAt]);

  return { token, expiresAt };
}

export async function revokeSession(token) {
  if (!token) return;
  await db.run('DELETE FROM user_sessions WHERE session_token = ?', [token]);
}

export function extractToken(req) {
  // Check Authorization header: Bearer <token>
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Check Cookies
  const cookieHeader = req.headers['cookie'];
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const sessCookie = cookies.find(c => c.startsWith('uzhavan_session='));
    if (sessCookie) {
      return sessCookie.split('=')[1].trim();
    }
  }

  // Check query parameter fallback
  if (req.query && req.query.token) {
    return req.query.token;
  }

  return null;
}

export async function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to access your farmer account.'
    });
  }

  try {
    const session = await db.get(`
      SELECT s.*, u.email, u.full_name, u.phone, u.language_pref, u.role,
             p.state, p.district, p.village, p.farmer_type, p.experience_years, p.primary_activity, p.avatar
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN farmer_profiles p ON u.id = p.user_id
      WHERE s.session_token = ? AND datetime(s.expires_at) > datetime('now')
    `, [token]);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Session expired or invalid. Please sign in again.'
      });
    }

    req.user = {
      id: session.user_id,
      email: session.email,
      fullName: session.full_name,
      phone: session.phone,
      language: session.language_pref,
      role: session.role,
      profile: {
        state: session.state,
        district: session.district,
        village: session.village,
        farmerType: session.farmer_type,
        experienceYears: session.experience_years,
        primaryActivity: session.primary_activity,
        avatar: session.avatar
      },
      sessionToken: token
    };

    next();
  } catch (err) {
    console.error('[Auth Middleware Error]', err);
    return res.status(500).json({ success: false, error: 'Internal authentication validation failure.' });
  }
}

export async function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const session = await db.get(`
      SELECT s.*, u.email, u.full_name, u.phone, u.language_pref, u.role,
             p.state, p.district, p.village, p.farmer_type, p.experience_years, p.primary_activity, p.avatar
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN farmer_profiles p ON u.id = p.user_id
      WHERE s.session_token = ? AND datetime(s.expires_at) > datetime('now')
    `, [token]);

    if (session) {
      req.user = {
        id: session.user_id,
        email: session.email,
        fullName: session.full_name,
        phone: session.phone,
        language: session.language_pref,
        role: session.role,
        profile: {
          state: session.state,
          district: session.district,
          village: session.village,
          farmerType: session.farmer_type,
          experienceYears: session.experience_years,
          primaryActivity: session.primary_activity,
          avatar: session.avatar
        },
        sessionToken: token
      };
    } else {
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }
  next();
}

/**
 * Enforce resource ownership.
 * A farmer must never read or edit another farmer's records.
 */
export function checkOwnership(req, res, resourceOwnerId) {
  if (!req.user || req.user.id !== resourceOwnerId) {
    res.status(403).json({
      success: false,
      error: 'Access denied: You are not authorized to modify or view this record.'
    });
    return false;
  }
  return true;
}
