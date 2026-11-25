import express from 'express';
import { getDb } from '../db.js';
import {
  getJwtCookieMaxAgeSeconds,
  hashPassword,
  signJwt,
  verifyPassword,
} from '../auth/jwt.js';
import { AUTH_COOKIE_NAME, requireAuth } from '../middleware/auth.js';

const router = express.Router();

function setAuthCookie(res, token) {
  const maxAgeSeconds = getJwtCookieMaxAgeSeconds();
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isProd) {
    parts.push('Secure');
  }
  res.setHeader('Set-Cookie', parts.join('; '));
}

function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [
    `${AUTH_COOKIE_NAME}=`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (isProd) {
    parts.push('Secure');
  }
  res.setHeader('Set-Cookie', parts.join('; '));
}

// POST /api/auth/login - Authenticate admin/editor user and issue JWT
router.post('/login', async (req, res) => {
  try {
    const uuid = typeof req.body?.uuid === 'string' ? req.body.uuid.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!uuid || !password) {
      return res.status(400).json({
        success: false,
        message: 'UUID and password are required.',
      });
    }

    const db = getDb();
    const user = await db.collection('admin_users').findOne({
      uuid,
      active: { $ne: false },
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid UUID or password. Please try again.',
      });
    }

    const authenticatedAt = new Date().toISOString();
    const token = signJwt({
      sub: user.uuid,
      role: user.role,
      displayName: user.displayName,
      authenticatedAt,
    });

    setAuthCookie(res, token);

    await db.collection('admin_users').updateOne(
      { uuid: user.uuid },
      { $set: { lastLoginAt: authenticatedAt } },
    );

    res.json({
      success: true,
      token,
      user: {
        uuid: user.uuid,
        role: user.role,
        displayName: user.displayName,
        authenticatedAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Unable to sign in right now.' });
  }
});

// GET /api/auth/me - Return verified session user
router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// POST /api/auth/refresh - Refresh active JWT
router.post('/refresh', requireAuth, (req, res) => {
  const authenticatedAt = req.user.authenticatedAt || new Date().toISOString();
  const token = signJwt({
    sub: req.user.uuid,
    role: req.user.role,
    displayName: req.user.displayName,
    authenticatedAt,
  });

  setAuthCookie(res, token);

  res.json({
    success: true,
    token,
    user: req.user,
  });
});

// POST /api/auth/logout - Clear JWT auth cookie
router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Signed out successfully.' });
});

// PUT /api/auth/change-password - Update current admin password in MongoDB
router.put('/change-password', requireAuth, async (req, res) => {
  try {
    const currentPassword = typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const db = getDb();
    const user = await db.collection('admin_users').findOne({ uuid: req.user.uuid });
    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    await db.collection('admin_users').updateOne(
      { uuid: req.user.uuid },
      {
        $set: {
          passwordHash: hashPassword(newPassword),
          updatedAt: new Date().toISOString(),
        },
      },
    );

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

// GET /api/auth/users - List all admin/editor users (admin role required)
router.get('/users', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
    }

    const db = getDb();
    const users = await db
      .collection('admin_users')
      .find({}, { projection: { passwordHash: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('List admin users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
});

// POST /api/auth/users - Create new admin or editor user (admin role required)
router.post('/users', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
    }

    const uuid = typeof req.body?.uuid === 'string' ? req.body.uuid.trim() : '';
    const displayName = typeof req.body?.displayName === 'string' ? req.body.displayName.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const role = req.body?.role === 'admin' ? 'admin' : 'editor';

    if (!uuid || !password || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Username (UUID), Display Name, and Password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const db = getDb();
    const existing = await db.collection('admin_users').findOne({ uuid });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A user with identifier "${uuid}" already exists.`,
      });
    }

    const now = new Date().toISOString();
    const newUser = {
      uuid,
      displayName,
      role,
      passwordHash: hashPassword(password),
      active: true,
      createdBy: req.user.uuid,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('admin_users').insertOne(newUser);

    res.status(201).json({
      success: true,
      message: `User "${uuid}" created successfully with role "${role}".`,
      user: {
        uuid,
        displayName,
        role,
        active: true,
        createdAt: now,
      },
    });
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({ success: false, message: 'Failed to create user.' });
  }
});

// DELETE /api/auth/users/:uuid - Delete an admin or editor user (cannot delete self)
router.delete('/users/:uuid', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
    }

    const targetUuid = decodeURIComponent(req.params.uuid);
    if (targetUuid === req.user.uuid) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account while logged in.',
      });
    }

    const db = getDb();
    const result = await db.collection('admin_users').deleteOne({ uuid: targetUuid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: `User "${targetUuid}" deleted successfully.` });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
});

export default router;
