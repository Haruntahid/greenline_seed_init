import { CONTENT_SEED_VERSION } from './localContent.js';
import {
  aboutData,
  aboutPageData,
  galleryData,
  heroCarouselData,
  heroData,
  portfolioMetaData,
  productCategoriesData,
  productsData,
  productsMetaData,
  projectsData,
  statsData,
  statsMetaData,
  youtubeData,
  contactMetaData,
  siteSettingsData,
} from './contentDefaults.js';

function withoutMongoId(doc) {
  const { _id, ...rest } = doc;
  return rest;
}

async function replaceSingleton(db, collectionName, doc) {
  await db.collection(collectionName).replaceOne({ _id: doc._id }, doc, { upsert: true });
}

async function replaceMany(db, collectionName, docs) {
  const collection = db.collection(collectionName);
  await collection.deleteMany({});
  if (docs.length > 0) {
    await collection.insertMany(docs.map(withoutMongoId));
  }
}

export async function applyLocalContent(db) {
  await replaceSingleton(db, 'hero_content', { ...heroData, updatedAt: new Date().toISOString() });
  await replaceSingleton(db, 'hero_carousel', { ...heroCarouselData, updatedAt: new Date().toISOString() });
  await replaceSingleton(db, 'about_content', { ...aboutData, updatedAt: new Date().toISOString() });
  await replaceSingleton(db, 'about_page_content', { ...aboutPageData, updatedAt: new Date().toISOString() });
  await replaceSingleton(db, 'stats_meta', { ...statsMetaData, updatedAt: new Date().toISOString() });
  await replaceMany(db, 'stats', statsData);
  await replaceSingleton(db, 'portfolio_meta', { ...portfolioMetaData, updatedAt: new Date().toISOString() });
  await replaceMany(db, 'projects', projectsData);
  await replaceSingleton(db, 'products_meta', { ...productsMetaData, updatedAt: new Date().toISOString() });
  await replaceMany(db, 'product_categories', productCategoriesData);
  await replaceMany(db, 'products', productsData);
  await replaceSingleton(db, 'gallery_content', { ...galleryData, updatedAt: new Date().toISOString() });
  await replaceSingleton(db, 'youtube_content', { ...youtubeData, updatedAt: new Date().toISOString() });
  await replaceSingleton(db, 'contact_meta', { ...contactMetaData, updatedAt: new Date().toISOString() });
  await replaceSingleton(db, 'site_settings', { ...siteSettingsData, updatedAt: new Date().toISOString() });

  await db.collection('app_meta').updateOne(
    { _id: 'content_seed' },
    {
      $set: {
        version: CONTENT_SEED_VERSION,
        appliedAt: new Date().toISOString(),
      },
    },
    { upsert: true },
  );

  console.log(`  ✓ Applied local-storage content seed (${CONTENT_SEED_VERSION})`);
}

export async function ensureLocalContentSeed(db) {
  const meta = await db.collection('app_meta').findOne({ _id: 'content_seed' });
  if (meta?.version === CONTENT_SEED_VERSION) {
    return false;
  }

  await applyLocalContent(db);
  return true;
}
