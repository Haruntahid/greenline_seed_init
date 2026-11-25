import express from 'express';
import { getDb } from '../db.js';
import { statsData, statsMetaData } from '../data/contentDefaults.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats/meta/content - Get stats section metadata
router.get('/meta/content', async (req, res) => {
  try {
    const db = getDb();
    let meta = await db.collection('stats_meta').findOne({ _id: 'stats_meta' });
    if (!meta) meta = statsMetaData;
    res.json({ success: true, data: meta });
  } catch (error) {
    console.error('Error fetching stats meta:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats metadata' });
  }
});

// PUT /api/stats/meta/content - Update stats section metadata
router.put('/meta/content', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { _id, ...body } = req.body;
    const updateData = {
      ...body,
      _id: 'stats_meta',
      updatedAt: new Date().toISOString(),
    };
    await db.collection('stats_meta').updateOne(
      { _id: 'stats_meta' },
      { $set: updateData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Stats metadata updated', data: updateData });
  } catch (error) {
    console.error('Error updating stats meta:', error);
    res.status(500).json({ success: false, message: 'Failed to update stats metadata' });
  }
});

// PUT /api/stats/content - Replace stats metadata and items
router.put('/content', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const stats = Array.isArray(req.body.stats) ? req.body.stats : [];
    const meta = {
      _id: 'stats_meta',
      eyebrow: req.body.eyebrow,
      title: req.body.title,
      description: req.body.description,
      featuredStatId: req.body.featuredStatId,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('stats_meta').replaceOne({ _id: 'stats_meta' }, meta, { upsert: true });
    await db.collection('stats').deleteMany({});
    if (stats.length > 0) {
      await db.collection('stats').insertMany(
        stats.map(({ _id, ...stat }, index) => ({
          ...stat,
          order: stat.order ?? index + 1,
          updatedAt: new Date().toISOString(),
        }))
      );
    }

    res.json({ success: true, message: 'Stats content updated', data: req.body });
  } catch (error) {
    console.error('Error replacing stats content:', error);
    res.status(500).json({ success: false, message: 'Failed to update stats content' });
  }
});

// GET /api/stats - List all stats items
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const filter = {};
    if (req.query.enabled === 'true') {
      filter.enabled = true;
    }
    const stats = await db.collection('stats').find(filter).sort({ order: 1 }).toArray();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// GET /api/stats/:id - Get single stat item
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const stat = await db.collection('stats').findOne({ id: req.params.id });
    if (!stat) {
      return res.status(404).json({ success: false, message: 'Stat item not found' });
    }
    res.json({ success: true, data: stat });
  } catch (error) {
    console.error('Error fetching stat:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stat' });
  }
});

// POST /api/stats - Create new stat item
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const newStat = {
      ...req.body,
      id: req.body.id || `stat-${Date.now()}`,
      order: req.body.order ?? (await db.collection('stats').countDocuments()) + 1,
      enabled: req.body.enabled !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('stats').insertOne(newStat);
    res.status(201).json({ success: true, message: 'Stat created successfully', data: newStat });
  } catch (error) {
    console.error('Error creating stat:', error);
    res.status(500).json({ success: false, message: 'Failed to create stat' });
  }
});

// PUT /api/stats/:id - Update existing stat item
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { _id, ...cleanUpdate } = req.body;
    cleanUpdate.updatedAt = new Date().toISOString();

    const result = await db.collection('stats').findOneAndUpdate(
      { id: req.params.id },
      { $set: { ...cleanUpdate, id: req.params.id } },
      { upsert: true, returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Stat item not found' });
    }

    res.json({ success: true, message: 'Stat item updated successfully', data: result });
  } catch (error) {
    console.error('Error updating stat:', error);
    res.status(500).json({ success: false, message: 'Failed to update stat' });
  }
});

// DELETE /api/stats/:id - Delete stat item
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('stats').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Stat item not found' });
    }
    res.json({ success: true, message: 'Stat item deleted successfully' });
  } catch (error) {
    console.error('Error deleting stat:', error);
    res.status(500).json({ success: false, message: 'Failed to delete stat' });
  }
});

// POST /api/stats/reset - Reset stats to default
router.post('/reset', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    await db.collection('stats').deleteMany({});
    await db.collection('stats').insertMany(statsData.map(s => ({ ...s })));
    await db.collection('stats_meta').updateOne(
      { _id: 'stats_meta' },
      { $set: statsMetaData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Stats reset to default' });
  } catch (error) {
    console.error('Error resetting stats:', error);
    res.status(500).json({ success: false, message: 'Failed to reset stats' });
  }
});

export default router;
