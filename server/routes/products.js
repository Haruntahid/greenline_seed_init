import express from 'express';
import { getDb } from '../db.js';
import { productCategoriesData, productsData, productsMetaData } from '../data/contentDefaults.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products/meta/content - Products meta
router.get('/meta/content', async (req, res) => {
  try {
    const db = getDb();
    let meta = await db.collection('products_meta').findOne({ _id: 'products_meta' });
    if (!meta) meta = productsMetaData;
    res.json({ success: true, data: meta });
  } catch (error) {
    console.error('Error fetching products meta:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products meta' });
  }
});

// PUT /api/products/meta/content - Update products meta
router.put('/meta/content', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const updateData = {
      ...req.body,
      _id: 'products_meta',
      updatedAt: new Date().toISOString(),
    };
    await db.collection('products_meta').updateOne(
      { _id: 'products_meta' },
      { $set: updateData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Products meta updated', data: updateData });
  } catch (error) {
    console.error('Error updating products meta:', error);
    res.status(500).json({ success: false, message: 'Failed to update products meta' });
  }
});

function stripMongoId(doc) {
  const { _id, ...rest } = doc;
  return rest;
}

// PUT /api/products/content - Replace products meta, categories, and products
router.put('/content', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const categories = Array.isArray(req.body.categories) ? req.body.categories : [];
    const products = Array.isArray(req.body.products) ? req.body.products : [];
    const meta = {
      _id: 'products_meta',
      eyebrow: req.body.eyebrow,
      title: req.body.title,
      description: req.body.description,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('products_meta').replaceOne({ _id: 'products_meta' }, meta, { upsert: true });
    await db.collection('product_categories').deleteMany({});
    if (categories.length > 0) {
      await db.collection('product_categories').insertMany(categories.map(stripMongoId));
    }
    await db.collection('products').deleteMany({});
    if (products.length > 0) {
      await db.collection('products').insertMany(products.map(stripMongoId));
    }

    res.json({ success: true, message: 'Products content updated', data: req.body });
  } catch (error) {
    console.error('Error replacing products content:', error);
    res.status(500).json({ success: false, message: 'Failed to update products content' });
  }
});

// GET /api/products/categories - List product categories
router.get('/categories', async (req, res) => {
  try {
    const db = getDb();
    const categories = await db.collection('product_categories').find({}).sort({ order: 1 }).toArray();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product categories' });
  }
});

// GET /api/products/categories/:id - Get single category
router.get('/categories/:id', async (req, res) => {
  try {
    const db = getDb();
    const category = await db.collection('product_categories').findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
});

// POST /api/products/categories - Create category
router.post('/categories', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const newCategory = {
      ...req.body,
      id: req.body.id || `category-${Date.now()}`,
      order: req.body.order ?? (await db.collection('product_categories').countDocuments()) + 1,
      enabled: req.body.enabled !== false,
      createdAt: new Date().toISOString(),
    };
    await db.collection('product_categories').insertOne(newCategory);
    res.status(201).json({ success: true, message: 'Category created', data: newCategory });
  } catch (error) {
    console.error('Error creating product category:', error);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// PUT /api/products/categories/:id - Update category
router.put('/categories/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { _id, ...cleanUpdate } = req.body;
    cleanUpdate.updatedAt = new Date().toISOString();

    const result = await db.collection('product_categories').findOneAndUpdate(
      { id: req.params.id },
      { $set: { ...cleanUpdate, id: req.params.id } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category updated successfully', data: result });
  } catch (error) {
    console.error('Error updating product category:', error);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

// DELETE /api/products/categories/:id - Delete category
router.delete('/categories/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('product_categories').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

// GET /api/products - List products with backend filtering, sorting & pagination
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const filter = {};

    if (req.query.categoryId && req.query.categoryId !== 'all') {
      filter.categoryId = req.query.categoryId;
    }
    if (req.query.featured === 'true') {
      filter.featured = true;
    } else if (req.query.featured === 'false') {
      filter.featured = false;
    }
    if (req.query.enabled === 'true') {
      filter.enabled = true;
    } else if (req.query.enabled === 'false') {
      filter.enabled = false;
    }
    if (req.query.stockStatus && req.query.stockStatus !== 'all') {
      filter.stockStatus = req.query.stockStatus;
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { sku: searchRegex },
      ];
    }

    // Sort mapping
    let sortOptions = { order: 1, createdAt: -1 };
    const sortBy = req.query.sortBy || req.query.sort;
    if (sortBy === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'name-asc') {
      sortOptions = { name: 1 };
    } else if (sortBy === 'newest') {
      sortOptions = { createdAt: -1, order: 1 };
    }

    const total = await db.collection('products').countDocuments(filter);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(0, parseInt(req.query.limit, 10) || 0);

    let cursor = db.collection('products').find(filter).sort(sortOptions);
    if (limit > 0) {
      cursor = cursor.skip((page - 1) * limit).limit(limit);
    }

    const products = await cursor.toArray();
    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit: limit > 0 ? limit : total,
        totalPages: limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// GET /api/products/:idOrSlug - Get single product
router.get('/:idOrSlug', async (req, res) => {
  try {
    const db = getDb();
    const param = req.params.idOrSlug;
    const product = await db.collection('products').findOne({
      $or: [{ id: param }, { slug: param }],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

// POST /api/products - Create product
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct = {
      ...req.body,
      id: req.body.id || `product-${Date.now()}`,
      slug,
      order: req.body.order ?? (await db.collection('products').countDocuments()) + 1,
      enabled: req.body.enabled !== false,
      featured: req.body.featured || false,
      stockStatus: req.body.stockStatus || 'in_stock',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('products').insertOne(newProduct);
    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const { _id, ...cleanUpdate } = req.body;
    cleanUpdate.updatedAt = new Date().toISOString();

    const result = await db.collection('products').findOneAndUpdate(
      { id: req.params.id },
      { $set: { ...cleanUpdate, id: req.params.id } },
      { upsert: true, returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated successfully', data: result });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('products').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

// POST /api/products/reset - Reset products to default
router.post('/reset', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    await db.collection('products').deleteMany({});
    await db.collection('products').insertMany(productsData.map(p => ({ ...p })));
    await db.collection('product_categories').deleteMany({});
    await db.collection('product_categories').insertMany(productCategoriesData.map(c => ({ ...c })));
    await db.collection('products_meta').updateOne(
      { _id: 'products_meta' },
      { $set: productsMetaData },
      { upsert: true }
    );
    res.json({ success: true, message: 'Products reset to default' });
  } catch (error) {
    console.error('Error resetting products:', error);
    res.status(500).json({ success: false, message: 'Failed to reset products' });
  }
});

export default router;
