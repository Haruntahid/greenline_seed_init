import express from 'express';
import { getDb } from '../db.js';
import { servicesData, servicesMetaData } from '../data/initialData.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/services/meta/content - Get services section metadata
router.get('/meta/content', async (req, res) => {
  try {
    const db = getDb();
    let meta = await db.collection('services_meta').findOne({ _id: 'services_meta' });
    if (!meta) meta = servicesMetaData;
    res.json({ success: true, data: meta });
  } catch (error) {
    console.error('Error fetching services meta:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services metadata' });
  }
});

// PUT /api/services/meta/content - Update services section metadata
router.put('/meta/content', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { _id, ...body } = req.body;
    const updateData = {
      ...body,
      _id: 'services_meta',
      updatedAt: new Date().toISOString(),
    };
    await db.collection('services_meta').updateOne(
      { _id: 'services_meta' },
      { $set: updateData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Services metadata updated', data: updateData });
  } catch (error) {
    console.error('Error updating services meta:', error);
    res.status(500).json({ success: false, message: 'Failed to update services metadata' });
  }
});

// PUT /api/services/content - Replace services metadata and items
router.put('/content', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const services = Array.isArray(req.body.services) ? req.body.services : [];
    const meta = {
      _id: 'services_meta',
      eyebrow: req.body.eyebrow,
      title: req.body.title,
      description: req.body.description,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('services_meta').replaceOne({ _id: 'services_meta' }, meta, { upsert: true });
    await db.collection('services').deleteMany({});
    if (services.length > 0) {
      await db.collection('services').insertMany(
        services.map(({ _id, ...service }, index) => ({
          ...service,
          order: service.order ?? index + 1,
          updatedAt: new Date().toISOString(),
        }))
      );
    }

    res.json({ success: true, message: 'Services content updated', data: req.body });
  } catch (error) {
    console.error('Error replacing services content:', error);
    res.status(500).json({ success: false, message: 'Failed to update services content' });
  }
});

// GET /api/services - List all services
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const filter = {};
    if (req.query.enabled === 'true') {
      filter.enabled = true;
    }

    const services = await db.collection('services').find(filter).sort({ order: 1 }).toArray();
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
});

// GET /api/services/:id - Get single service
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const service = await db.collection('services').findOne({ id: req.params.id });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch service' });
  }
});

// POST /api/services - Create new service
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const newService = {
      ...req.body,
      id: req.body.id || `service-${Date.now()}`,
      order: req.body.order ?? (await db.collection('services').countDocuments()) + 1,
      enabled: req.body.enabled !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('services').insertOne(newService);
    res.status(201).json({ success: true, message: 'Service created successfully', data: newService });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, message: 'Failed to create service' });
  }
});

// PUT /api/services/:id - Update existing service
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { _id, ...cleanUpdate } = req.body;
    cleanUpdate.updatedAt = new Date().toISOString();

    const result = await db.collection('services').findOneAndUpdate(
      { id: req.params.id },
      { $set: cleanUpdate },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, message: 'Service updated successfully', data: result });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ success: false, message: 'Failed to update service' });
  }
});

// DELETE /api/services/:id - Delete a service
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('services').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
});

// POST /api/services/reset - Reset services to default
router.post('/reset', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    await db.collection('services').deleteMany({});
    await db.collection('services').insertMany(servicesData.map(s => ({ ...s })));
    await db.collection('services_meta').updateOne(
      { _id: 'services_meta' },
      { $set: servicesMetaData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Services reset to default data' });
  } catch (error) {
    console.error('Error resetting services:', error);
    res.status(500).json({ success: false, message: 'Failed to reset services' });
  }
});

export default router;
