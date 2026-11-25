import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToMongoDB, disconnectFromMongoDB, getDb } from './db.js';

import authRouter from './routes/auth.js';
import heroRouter from './routes/hero.js';
import aboutRouter from './routes/about.js';
import servicesRouter from './routes/services.js';
import statsRouter from './routes/stats.js';
import projectsRouter from './routes/projects.js';
import productsRouter from './routes/products.js';
import blogsRouter from './routes/blogs.js';
import contactRouter from './routes/contact.js';
import settingsRouter from './routes/settings.js';
import mediaRouter from './routes/media.js';
import assistantRouter from './routes/assistant.js';
import { createDocumentRouter } from './routes/document.js';
import { ensureLocalContentSeed } from './data/applyLocalContent.js';
import { ensureAdminUsersSeed } from './data/adminUsers.js';
import {
  aboutPageData,
  galleryData,
  heroCarouselData,
  youtubeData,
} from './data/contentDefaults.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Comprehensive CORS & Preflight Handling (works seamlessly across Vercel & custom domains)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie, Set-Cookie',
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }),
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const db = getDb();
    await db.command({ ping: 1 });
    const collections = await db.listCollections().toArray();
    res.json({
      status: 'healthy',
      database: db.databaseName,
      connected: true,
      collectionsCount: collections.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Auto-connect to MongoDB and ensure seed for incoming requests (especially on Vercel serverless)
let seedDone = false;
app.use(async (req, res, next) => {
  try {
    await connectToMongoDB();
    if (!seedDone) {
      const db = getDb();
      await ensureLocalContentSeed(db);
      await ensureAdminUsersSeed(db);
      seedDone = true;
    }
  } catch (err) {
    console.error('MongoDB auto-connect/seed error:', err);
  }
  next();
});

// Create API Router supporting both /api/* and /* (for flexible reverse-proxy / Vercel rewrites)
const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/hero', heroRouter);
apiRouter.use(
  '/hero-carousel',
  createDocumentRouter({
    collectionName: 'hero_carousel',
    id: 'hero_carousel',
    getDefault: () => heroCarouselData,
  }),
);
apiRouter.use('/about', aboutRouter);
apiRouter.use(
  '/about-page',
  createDocumentRouter({
    collectionName: 'about_page_content',
    id: 'about_page',
    getDefault: () => aboutPageData,
  }),
);
apiRouter.use('/services', servicesRouter);
apiRouter.use('/stats', statsRouter);
apiRouter.use('/projects', projectsRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use(
  '/gallery',
  createDocumentRouter({
    collectionName: 'gallery_content',
    id: 'gallery',
    getDefault: () => galleryData,
  }),
);
apiRouter.use(
  '/youtube-videos',
  createDocumentRouter({
    collectionName: 'youtube_content',
    id: 'youtube',
    getDefault: () => youtubeData,
  }),
);
apiRouter.use('/blogs', blogsRouter);
apiRouter.use('/contact', contactRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/media', mediaRouter);
apiRouter.use('/assistant', assistantRouter);

// Mount router on both /api and root
app.use('/api', apiRouter);
app.use(apiRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

// In production, serve the built frontend assets
if (process.env.NODE_ENV === 'production' || process.env.SERVE_STATIC === 'true') {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 Handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Start Server and Connect to MongoDB
async function startServer() {
  try {
    await connectToMongoDB();
    const db = getDb();
    await ensureLocalContentSeed(db);
    await ensureAdminUsersSeed(db);
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 GreenLine Seed API Server is running on http://localhost:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health\n`);
    });

    // Graceful shutdown
    const handleShutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectFromMongoDB();
        console.log('Server and database connections closed cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
  startServer();
}

export default app;
