import express from 'express';
import { getDb } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function sendMediaBuffer(res, media) {
  if (media.data.startsWith('data:')) {
    const matches = media.data.match(/^data:([A-Za-z0-9.+-]+\/[A-Za-z0-9.+-]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'no-cache');
      return res.send(buffer);
    }
  }

  const buffer = Buffer.from(media.data, 'base64');
  res.setHeader('Content-Type', media.type || 'image/jpeg');
  res.setHeader('Cache-Control', 'no-cache');
  return res.send(buffer);
}

// PUT /api/media/key/:key - Upsert keyed image in MongoDB
router.put('/key/:key', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const key = decodeURIComponent(req.params.key);
    const { name, type, data } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, message: 'Image data is required' });
    }

    const now = new Date().toISOString();
    const mediaDoc = {
      id: `key-${key}`,
      key,
      name: name || key,
      type: type || 'image/jpeg',
      data,
      updatedAt: now,
    };

    await db.collection('media').updateOne(
      { key },
      { $set: mediaDoc, $setOnInsert: { createdAt: now } },
      { upsert: true },
    );

    res.json({
      success: true,
      message: 'Media saved successfully',
      key,
      url: `/api/media/key/${encodeURIComponent(key)}`,
    });
  } catch (error) {
    console.error('Error saving keyed media:', error);
    res.status(500).json({ success: false, message: 'Failed to save media' });
  }
});

// GET /api/media/key/:key - Stream keyed image binary (204 if absent)
router.get('/key/:key', async (req, res) => {
  try {
    const db = getDb();
    const key = decodeURIComponent(req.params.key);
    const media = await db.collection('media').findOne({ key });

    if (!media) {
      return res.status(204).end();
    }

    return sendMediaBuffer(res, media);
  } catch (error) {
    console.error('Error retrieving keyed media:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve media' });
  }
});

// DELETE /api/media/key/:key - Delete keyed image
router.delete('/key/:key', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const key = decodeURIComponent(req.params.key);
    await db.collection('media').deleteOne({ key });
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting keyed media:', error);
    res.status(500).json({ success: false, message: 'Failed to delete media' });
  }
});

// POST /api/media/upload - Upload image/media as base64 or data URL
router.post('/upload', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { name, type, data } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, message: 'Image data is required' });
    }

    const id = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const mediaDoc = {
      id,
      name: name || 'uploaded-image',
      type: type || 'image/jpeg',
      data,
      createdAt: new Date().toISOString(),
    };

    await db.collection('media').insertOne(mediaDoc);

    res.status(201).json({
      success: true,
      message: 'Media uploaded successfully',
      id,
      url: `/api/media/${id}`,
      dataUrl: data.startsWith('data:') ? data : `data:${type || 'image/jpeg'};base64,${data}`,
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ success: false, message: 'Failed to upload media' });
  }
});

// POST /api/media/link - Add external image link / Google Drive link to Media Library
router.post('/link', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { title, url, category } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }

    const now = new Date().toISOString();
    const id = `media-${Date.now()}`;
    const mediaDoc = {
      id,
      name: title?.trim() || 'External Image',
      url: url.trim(),
      type: 'image/url',
      category: category?.trim() || 'General',
      isExternal: true,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('media').insertOne(mediaDoc);

    res.status(201).json({
      success: true,
      message: 'Media link saved to library',
      data: mediaDoc,
    });
  } catch (error) {
    console.error('Error saving media link:', error);
    res.status(500).json({ success: false, message: 'Failed to save media link' });
  }
});

// GET /api/media - List all media items
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const mediaList = await db
      .collection('media')
      .find({}, { projection: { id: 1, key: 1, name: 1, url: 1, type: 1, category: 1, isExternal: 1, createdAt: 1, updatedAt: 1 } })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      data: mediaList.map((m) => ({
        ...m,
        url: m.url || (m.key ? `/api/media/key/${encodeURIComponent(m.key)}` : `/api/media/${m.id}`),
      })),
    });
  } catch (error) {
    console.error('Error fetching media list:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch media list' });
  }
});

// GET /api/media/:id - Stream media binary or send data
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const media = await db.collection('media').findOne({ id: req.params.id });

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    return sendMediaBuffer(res, media);
  } catch (error) {
    console.error('Error serving media:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve media' });
  }
});

// DELETE /api/media/:id - Delete media item
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('media').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ success: false, message: 'Failed to delete media' });
  }
});

export default router;
