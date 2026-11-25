import crypto from 'crypto';

const DEFAULT_DEV_SECRET = 'greenline-seed-jwt-dev-secret-change-in-production';

function getJwtSecret() {
  return process.env.JWT_SECRET || DEFAULT_DEV_SECRET;
}

function getDefaultExpirySeconds() {
  const raw = process.env.JWT_EXPIRES_IN || '86400';
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric;
  }
  const match = String(raw).trim().match(/^(\d+)([smhd])$/i);
  if (match) {
    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
    return value * multipliers[unit];
  }
  return 86400; // 24h
}

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  const normalized = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + padding, 'base64').toString('utf8');
}

export function signJwt(payload, expiresInSeconds = getDefaultExpirySeconds()) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedBody = base64UrlEncode(JSON.stringify(body));
  const signingInput = `${encodedHeader}.${encodedBody}`;

  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(signingInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${signingInput}.${signature}`;
}

export function verifyJwt(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedBody, signature] = parts;
  const signingInput = `${encodedHeader}.${encodedBody}`;

  const expectedSignature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(signingInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const header = JSON.parse(base64UrlDecode(encodedHeader));
    if (header.alg !== 'HS256') {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedBody));
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === 'number' && payload.exp <= now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash || typeof storedHash !== 'string') {
    return false;
  }

  const parts = storedHash.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') {
    return false;
  }

  const [, salt, keyHex] = parts;
  const derivedBuf = crypto.scryptSync(password, salt, 64);
  const storedBuf = Buffer.from(keyHex, 'hex');

  if (derivedBuf.length !== storedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedBuf, storedBuf);
}

export function getJwtCookieMaxAgeSeconds() {
  return getDefaultExpirySeconds();
}
