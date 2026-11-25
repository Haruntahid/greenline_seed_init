import { verifyJwt } from '../auth/jwt.js';
import { getDb } from '../db.js';

export const AUTH_COOKIE_NAME = 'greenline_admin_token';

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  for (const pair of cookieHeader.split(';')) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) {
      cookies[key] = decodeURIComponent(val);
    }
  }
  return cookies;
}

export function extractTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken) return bearerToken;
  }

  const cookies = parseCookies(req.headers.cookie);
  if (cookies[AUTH_COOKIE_NAME]) {
    return cookies[AUTH_COOKIE_NAME];
  }

  return null;
}

export async function requireAuth(req, res, next) {
  try {
    const token = extractTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in.',
      });
    }

    const payload = verifyJwt(token);
    if (!payload || !payload.sub) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.',
      });
    }

    const db = getDb();
    const user = await db.collection('admin_users').findOne(
      { uuid: payload.sub, active: { $ne: false } },
      { projection: { passwordHash: 0 } },
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or inactive.',
      });
    }

    req.user = {
      uuid: user.uuid,
      role: user.role,
      displayName: user.displayName,
      authenticatedAt: payload.authenticatedAt || new Date(payload.iat * 1000).toISOString(),
    };
    req.jwtPayload = payload;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Authentication verification failed.' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
}
