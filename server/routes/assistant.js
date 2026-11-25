import express from 'express';
import { getDb } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

const defaultAssistantConfig = {
  _id: 'assistant_config',
  enabled: true,
  name: 'Seed Assistant',
  welcomeMessage:
    "Hello! Welcome to Green Line Seed Store. How can we help you today with our quality seeds and farming solutions?",
  quickActions: [
    {
      id: 'qa-1',
      label: 'Our Products',
      response:
        'We offer a wide collection of high-yielding Vegetable, Flower, Crop and Hybrid seeds. Explore the Products section to browse our catalog.',
    },
    {
      id: 'qa-2',
      label: 'Office & Store Location',
      response:
        'We are located at B55, Bazar Road, Savar 1340, Dhaka, Bangladesh. Feel free to visit us or call ahead!',
    },
    {
      id: 'qa-3',
      label: 'Contact & WhatsApp',
      response:
        'You can call or WhatsApp us directly at 01805917900 or email greenlineseedbd@gmail.com for fast support.',
    },
    {
      id: 'qa-4',
      label: 'Business Hours',
      response:
        'Our store is open Saturday through Thursday from 9:00 AM to 7:00 PM. We are closed on Fridays.',
    },
  ],
  updatedAt: new Date().toISOString(),
};

// GET /api/assistant - Get smart assistant configuration
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    let config = await db.collection('assistant_config').findOne({ _id: 'assistant_config' });
    if (!config) config = defaultAssistantConfig;
    res.json({ success: true, data: config });
  } catch (error) {
    console.error('Error fetching assistant config:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch assistant configuration' });
  }
});

// PUT /api/assistant - Update smart assistant configuration
router.put('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const db = getDb();
    const updateData = {
      ...req.body,
      _id: 'assistant_config',
      updatedAt: new Date().toISOString(),
    };
    await db.collection('assistant_config').updateOne(
      { _id: 'assistant_config' },
      { $set: updateData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Assistant configuration updated', data: updateData });
  } catch (error) {
    console.error('Error updating assistant config:', error);
    res.status(500).json({ success: false, message: 'Failed to update assistant configuration' });
  }
});

export default router;
