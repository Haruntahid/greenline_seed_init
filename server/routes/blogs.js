import express from 'express';
import { getDb } from '../db.js';
import { blogCategoriesData, blogsData, blogsMetaData } from '../data/initialData.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/blogs/meta/content - Blogs meta
router.get('/meta/content', async (req, res) => {
  try {
    const db = getDb();
    let meta = await db.collection('blogs_meta').findOne({ _id: 'blogs_meta' });
    if (!meta) meta = blogsMetaData;
    res.json({ success: true, data: meta });
  } catch (error) {
    console.error('Error fetching blogs meta:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs meta' });
  }
});

// PUT /api/blogs/meta/content - Update blogs meta
router.put('/meta/content', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const updateData = {
      ...req.body,
      _id: 'blogs_meta',
      updatedAt: new Date().toISOString(),
    };
    await db.collection('blogs_meta').updateOne(
      { _id: 'blogs_meta' },
      { $set: updateData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Blogs meta updated', data: updateData });
  } catch (error) {
    console.error('Error updating blogs meta:', error);
    res.status(500).json({ success: false, message: 'Failed to update blogs meta' });
  }
});

// GET /api/blogs/categories - List blog categories
router.get('/categories', async (req, res) => {
  try {
    const db = getDb();
    const categories = await db.collection('blog_categories').find({}).sort({ order: 1 }).toArray();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blog categories' });
  }
});

// POST /api/blogs/categories - Create category
router.post('/categories', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const newCategory = {
      ...req.body,
      id: req.body.id || `category-${Date.now()}`,
      order: req.body.order ?? (await db.collection('blog_categories').countDocuments()) + 1,
      enabled: req.body.enabled !== false,
      createdAt: new Date().toISOString(),
    };
    await db.collection('blog_categories').insertOne(newCategory);
    res.status(201).json({ success: true, message: 'Category created', data: newCategory });
  } catch (error) {
    console.error('Error creating blog category:', error);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// GET /api/blogs - List all blog articles
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const filter = {};
    if (req.query.categoryId && req.query.categoryId !== 'all') {
      filter.categoryId = req.query.categoryId;
    }
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    if (req.query.enabled === 'true') {
      filter.enabled = true;
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
        { author: searchRegex },
      ];
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const total = await db.collection('blog_articles').countDocuments(filter);
    const articles = await db
      .collection('blog_articles')
      .find(filter)
      .sort({ order: 1, publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      success: true,
      data: articles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
});

// GET /api/blogs/:idOrSlug - Get single blog article
router.get('/:idOrSlug', async (req, res) => {
  try {
    const db = getDb();
    const param = req.params.idOrSlug;
    const article = await db.collection('blog_articles').findOne({
      $or: [{ id: param }, { slug: param }],
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }
    res.json({ success: true, data: article });
  } catch (error) {
    console.error('Error fetching blog article:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blog article' });
  }
});

// POST /api/blogs - Create blog article
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const slug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newArticle = {
      ...req.body,
      id: req.body.id || `blog-${Date.now()}`,
      slug,
      order: req.body.order ?? (await db.collection('blog_articles').countDocuments()) + 1,
      enabled: req.body.enabled !== false,
      featured: req.body.featured || false,
      publishedAt: req.body.publishedAt || new Date().toISOString().split('T')[0],
      readTime: req.body.readTime || '4 min read',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('blog_articles').insertOne(newArticle);
    res.status(201).json({ success: true, message: 'Blog article created', data: newArticle });
  } catch (error) {
    console.error('Error creating blog article:', error);
    res.status(500).json({ success: false, message: 'Failed to create blog article' });
  }
});

// PUT /api/blogs/:id - Update blog article
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { _id, ...cleanUpdate } = req.body;
    cleanUpdate.updatedAt = new Date().toISOString();

    const result = await db.collection('blog_articles').findOneAndUpdate(
      { id: req.params.id },
      { $set: cleanUpdate },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    res.json({ success: true, message: 'Blog article updated', data: result });
  } catch (error) {
    console.error('Error updating blog article:', error);
    res.status(500).json({ success: false, message: 'Failed to update blog article' });
  }
});

// DELETE /api/blogs/:id - Delete blog article
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('blog_articles').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }
    res.json({ success: true, message: 'Blog article deleted' });
  } catch (error) {
    console.error('Error deleting blog article:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog article' });
  }
});

// POST /api/blogs/reset - Reset blogs to default
router.post('/reset', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    await db.collection('blog_articles').deleteMany({});
    await db.collection('blog_articles').insertMany(blogsData.map(b => ({ ...b })));
    await db.collection('blog_categories').deleteMany({});
    await db.collection('blog_categories').insertMany(blogCategoriesData.map(c => ({ ...c })));
    await db.collection('blogs_meta').updateOne(
      { _id: 'blogs_meta' },
      { $set: blogsMetaData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Blogs reset to default' });
  } catch (error) {
    console.error('Error resetting blogs:', error);
    res.status(500).json({ success: false, message: 'Failed to reset blogs' });
  }
});

export default router;
