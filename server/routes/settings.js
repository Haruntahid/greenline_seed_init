import express from 'express';
import { getDb } from '../db.js';
import { sectionsConfigData, siteSettingsData, themeConfigData } from '../data/initialData.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/settings/site - Site settings
router.get('/site', async (req, res) => {
  try {
    const db = getDb();
    let site = await db.collection('site_settings').findOne({ _id: 'site_settings' });
    if (!site) site = siteSettingsData;
    res.json({ success: true, data: site });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch site settings' });
  }
});

// PUT /api/settings/site - Update site settings
router.put('/site', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const db = getDb();
    const updateData = {
      ...req.body,
      _id: 'site_settings',
      updatedAt: new Date().toISOString(),
    };
    await db.collection('site_settings').updateOne(
      { _id: 'site_settings' },
      { $set: updateData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Site settings updated', data: updateData });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update site settings' });
  }
});

// GET /api/settings/sections - Sections configuration & order
router.get('/sections', async (req, res) => {
  try {
    const db = getDb();
    let sections = await db.collection('sections_config').findOne({ _id: 'sections_config' });
    if (!sections) sections = sectionsConfigData;
    res.json({ success: true, data: sections.sections || [] });
  } catch (error) {
    console.error('Error fetching sections config:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sections config' });
  }
});

// PUT /api/settings/sections - Update sections configuration
router.put('/sections', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const db = getDb();
    const sectionsArray = Array.isArray(req.body) ? req.body : req.body.sections;
    const updateDoc = {
      _id: 'sections_config',
      sections: sectionsArray,
      updatedAt: new Date().toISOString(),
    };
    await db.collection('sections_config').updateOne(
      { _id: 'sections_config' },
      { $set: updateDoc },
      { upsert: true }
    );
    res.json({ success: true, message: 'Sections updated', data: sectionsArray });
  } catch (error) {
    console.error('Error updating sections config:', error);
    res.status(500).json({ success: false, message: 'Failed to update sections config' });
  }
});

// GET /api/settings/theme - Theme appearance & colors
router.get('/theme', async (req, res) => {
  try {
    const db = getDb();
    let theme = await db.collection('theme_config').findOne({ _id: 'theme_config' });
    if (!theme) theme = themeConfigData;
    res.json({ success: true, data: theme });
  } catch (error) {
    console.error('Error fetching theme config:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch theme config' });
  }
});

// PUT /api/settings/theme - Update theme
router.put('/theme', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const db = getDb();
    const updateData = {
      ...req.body,
      _id: 'theme_config',
      updatedAt: new Date().toISOString(),
    };
    await db.collection('theme_config').updateOne(
      { _id: 'theme_config' },
      { $set: updateData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Theme updated', data: updateData });
  } catch (error) {
    console.error('Error updating theme config:', error);
    res.status(500).json({ success: false, message: 'Failed to update theme config' });
  }
});

export default router;
