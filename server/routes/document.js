import express from 'express';
import { getDb } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export function createDocumentRouter({ collectionName, id, getDefault }) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const db = getDb();
      let doc = await db.collection(collectionName).findOne({ _id: id });
      if (!doc) {
        doc = getDefault();
      }
      res.json({ success: true, data: doc });
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      res.status(500).json({ success: false, message: `Failed to fetch ${collectionName}` });
    }
  });

  router.put('/', requireAuth, async (req, res) => {
    try {
      const db = getDb();
      const { _id, ...body } = req.body;
      const updateData = {
        ...body,
        _id: id,
        updatedAt: new Date().toISOString(),
      };
      await db.collection(collectionName).replaceOne({ _id: id }, updateData, { upsert: true });
      res.json({ success: true, message: 'Content updated', data: updateData });
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      res.status(500).json({ success: false, message: `Failed to update ${collectionName}` });
    }
  });

  router.post('/reset', requireAuth, async (req, res) => {
    try {
      const db = getDb();
      const updateData = {
        ...getDefault(),
        updatedAt: new Date().toISOString(),
      };
      await db.collection(collectionName).replaceOne({ _id: id }, updateData, { upsert: true });
      res.json({ success: true, message: 'Content reset', data: updateData });
    } catch (error) {
      console.error(`Error resetting ${collectionName}:`, error);
      res.status(500).json({ success: false, message: `Failed to reset ${collectionName}` });
    }
  });

  return router;
}
