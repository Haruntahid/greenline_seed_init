import { connectToMongoDB, disconnectFromMongoDB, getDb } from './db.js';
import {
  heroData,
  aboutData,
  servicesMetaData,
  servicesData,
  statsMetaData,
  statsData,
  portfolioMetaData,
  projectsData,
  productsMetaData,
  productCategoriesData,
  productsData,
  blogsMetaData,
  blogCategoriesData,
  blogsData,
  contactMetaData,
  siteSettingsData,
  sectionsConfigData,
  themeConfigData,
} from './data/initialData.js';

async function seed() {
  console.log('🌱 Starting MongoDB seed process for GreenLine Seed...');
  const startTime = Date.now();

  try {
    await connectToMongoDB();
    const db = getDb();

    console.log(`📦 Connected to database: ${db.databaseName}`);

    // Helper to upsert a singleton collection document (e.g., hero, about, meta)
    async function upsertDocument(collectionName, doc) {
      const collection = db.collection(collectionName);
      await collection.updateOne(
        { _id: doc._id },
        { $set: doc },
        { upsert: true }
      );
      console.log(`  ✓ Seeded document in '${collectionName}'`);
    }

    // Helper to upsert an array of documents by 'id'
    async function upsertManyById(collectionName, items, idField = 'id') {
      const collection = db.collection(collectionName);
      for (const item of items) {
        const query = { [idField]: item[idField] };
        await collection.updateOne(
          query,
          { $set: { ...item, updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
      }
      console.log(`  ✓ Seeded ${items.length} records in '${collectionName}'`);
    }

    // 1. Hero Content
    await upsertDocument('hero_content', heroData);

    // 2. About Content
    await upsertDocument('about_content', aboutData);

    // 3. Services (Meta and Items)
    await upsertDocument('services_meta', servicesMetaData);
    await upsertManyById('services', servicesData, 'id');

    // 4. Stats (Meta and Items)
    await upsertDocument('stats_meta', statsMetaData);
    await upsertManyById('stats', statsData, 'id');

    // 5. Portfolio & Projects
    await upsertDocument('portfolio_meta', portfolioMetaData);
    await upsertManyById('projects', projectsData, 'id');

    // 6. Products & Categories
    await upsertDocument('products_meta', productsMetaData);
    await upsertManyById('product_categories', productCategoriesData, 'id');
    await upsertManyById('products', productsData, 'id');

    // 7. Blogs & Categories
    await upsertDocument('blogs_meta', blogsMetaData);
    await upsertManyById('blog_categories', blogCategoriesData, 'id');
    await upsertManyById('blog_articles', blogsData, 'id');

    // 8. Contact Content
    await upsertDocument('contact_meta', contactMetaData);

    // 9. Site Settings, Sections, & Theme
    await upsertDocument('site_settings', siteSettingsData);
    await upsertDocument('sections_config', sectionsConfigData);
    await upsertDocument('theme_config', themeConfigData);

    const { applyLocalContent } = await import('./data/applyLocalContent.js');
    await applyLocalContent(db);

    const { ensureAdminUsersSeed } = await import('./data/adminUsers.js');
    await ensureAdminUsersSeed(db);

    // Create handy indexes
    await db.collection('admin_users').createIndex({ uuid: 1 }, { unique: true });
    await db.collection('media').createIndex({ key: 1 }, { unique: true, sparse: true });
    await db.collection('services').createIndex({ id: 1 }, { unique: true });
    await db.collection('projects').createIndex({ slug: 1 }, { unique: true, sparse: true });
    await db.collection('products').createIndex({ slug: 1 }, { unique: true, sparse: true });
    await db.collection('blog_articles').createIndex({ slug: 1 }, { unique: true, sparse: true });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 Database seeding completed successfully in ${duration}s!`);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exitCode = 1;
  } finally {
    await disconnectFromMongoDB();
  }
}

seed();
