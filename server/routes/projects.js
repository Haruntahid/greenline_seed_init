import express from 'express';
import { getDb } from '../db.js';
import { portfolioMetaData, projectsData } from '../data/contentDefaults.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects/meta/content - Portfolio meta
router.get('/meta/content', async (req, res) => {
  try {
    const db = getDb();
    let meta = await db.collection('portfolio_meta').findOne({ _id: 'portfolio_meta' });
    if (!meta) meta = portfolioMetaData;
    res.json({ success: true, data: meta });
  } catch (error) {
    console.error('Error fetching portfolio meta:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch portfolio meta' });
  }
});

// PUT /api/projects/meta/content - Update portfolio meta
router.put('/meta/content', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { _id, ...body } = req.body;
    const updateData = {
      ...body,
      _id: 'portfolio_meta',
      updatedAt: new Date().toISOString(),
    };
    await db.collection('portfolio_meta').updateOne(
      { _id: 'portfolio_meta' },
      { $set: updateData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Portfolio meta updated', data: updateData });
  } catch (error) {
    console.error('Error updating portfolio meta:', error);
    res.status(500).json({ success: false, message: 'Failed to update portfolio meta' });
  }
});

// PUT /api/projects/content - Replace portfolio meta and projects atomically
router.put('/content', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const projects = Array.isArray(req.body.projects) ? req.body.projects : [];
    const meta = {
      _id: 'portfolio_meta',
      eyebrow: req.body.eyebrow,
      title: req.body.title,
      description: req.body.description,
      features: Array.isArray(req.body.features) ? req.body.features : [],
      closingCTA: req.body.closingCTA,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('portfolio_meta').replaceOne({ _id: 'portfolio_meta' }, meta, { upsert: true });
    await db.collection('projects').deleteMany({});
    if (projects.length > 0) {
      await db.collection('projects').insertMany(
        projects.map(({ _id, ...project }) => ({
          ...project,
          updatedAt: new Date().toISOString(),
        }))
      );
    }

    res.json({ success: true, message: 'Portfolio content updated', data: req.body });
  } catch (error) {
    console.error('Error replacing portfolio content:', error);
    res.status(500).json({ success: false, message: 'Failed to update portfolio content' });
  }
});

// GET /api/projects - List all projects
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const filter = {};
    if (req.query.category && req.query.category !== 'All Projects') {
      filter.category = req.query.category;
    }
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    if (req.query.enabled === 'true') {
      filter.enabled = true;
    }

    const projects = await db.collection('projects').find(filter).sort({ order: 1 }).toArray();
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:idOrSlug - Get single project
router.get('/:idOrSlug', async (req, res) => {
  try {
    const db = getDb();
    const param = req.params.idOrSlug;
    const project = await db.collection('projects').findOne({
      $or: [{ id: param }, { slug: param }],
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

// POST /api/projects - Create project
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const slug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProject = {
      ...req.body,
      id: req.body.id || `project-${Date.now()}`,
      slug,
      order: req.body.order ?? (await db.collection('projects').countDocuments()) + 1,
      enabled: req.body.enabled !== false,
      featured: req.body.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('projects').insertOne(newProject);
    res.status(201).json({ success: true, message: 'Project created successfully', data: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { _id, ...cleanUpdate } = req.body;
    cleanUpdate.updatedAt = new Date().toISOString();

    const result = await db.collection('projects').findOneAndUpdate(
      { id: req.params.id },
      { $set: { ...cleanUpdate, id: req.params.id } },
      { upsert: true, returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, message: 'Project updated successfully', data: result });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('projects').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

// POST /api/projects/reset - Reset projects to default
router.post('/reset', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    await db.collection('projects').deleteMany({});
    await db.collection('projects').insertMany(projectsData.map(p => ({ ...p })));
    await db.collection('portfolio_meta').updateOne(
      { _id: 'portfolio_meta' },
      { $set: portfolioMetaData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Projects reset to default' });
  } catch (error) {
    console.error('Error resetting projects:', error);
    res.status(500).json({ success: false, message: 'Failed to reset projects' });
  }
});

export default router;
