import express from 'express';
import { getDb } from '../db.js';
import { heroData } from '../data/contentDefaults.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/hero - Fetch hero section content
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    let hero = await db.collection('hero_content').findOne({ _id: 'hero' });
    if (!hero) {
      hero = heroData;
    }
    res.json({ success: true, data: hero });
  } catch (error) {
    console.error('Error fetching hero content:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch hero content' });
  }
});

// PUT /api/hero - Update hero section content
router.put('/', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { _id, ...body } = req.body;
    const updateData = {
      ...body,
      _id: 'hero',
      updatedAt: new Date().toISOString(),
    };

    await db.collection('hero_content').replaceOne(
      { _id: 'hero' },
      updateData,
      { upsert: true }
    );

    res.json({ success: true, message: 'Hero content updated successfully', data: updateData });
  } catch (error) {
    console.error('Error updating hero content:', error);
    res.status(500).json({ success: false, message: 'Failed to update hero content' });
  }
});

// POST /api/hero/reset - Reset hero section to default
router.post('/reset', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    await db.collection('hero_content').updateOne(
      { _id: 'hero' },
      { $set: { ...heroData, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    res.json({ success: true, message: 'Hero content reset to default', data: heroData });
  } catch (error) {
    console.error('Error resetting hero content:', error);
    res.status(500).json({ success: false, message: 'Failed to reset hero content' });
  }
});

export default router;
