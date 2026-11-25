import express from 'express';
import { getDb } from '../db.js';
import { aboutData } from '../data/contentDefaults.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/about - Fetch about section content
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    let about = await db.collection('about_content').findOne({ _id: 'about' });
    if (!about) {
      about = aboutData;
    }
    res.json({ success: true, data: about });
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch about content' });
  }
});

// PUT /api/about - Update about section content
router.put('/', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { _id, ...body } = req.body;
    const updateData = {
      ...body,
      _id: 'about',
      updatedAt: new Date().toISOString(),
    };

    await db.collection('about_content').replaceOne(
      { _id: 'about' },
      updateData,
      { upsert: true }
    );

    res.json({ success: true, message: 'About content updated successfully', data: updateData });
  } catch (error) {
    console.error('Error updating about content:', error);
    res.status(500).json({ success: false, message: 'Failed to update about content' });
  }
});

// POST /api/about/reset - Reset about section to default
router.post('/reset', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    await db.collection('about_content').updateOne(
      { _id: 'about' },
      { $set: { ...aboutData, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    res.json({ success: true, message: 'About content reset to default', data: aboutData });
  } catch (error) {
    console.error('Error resetting about content:', error);
    res.status(500).json({ success: false, message: 'Failed to reset about content' });
  }
});

export default router;
