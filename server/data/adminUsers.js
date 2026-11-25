import { hashPassword } from '../auth/jwt.js';

const DEFAULT_ADMIN_USERS = [
  {
    uuid: 'admin',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin#321',
    role: 'admin',
    displayName: 'Administrator',
  },
  {
    uuid: 'Editor',
    password: process.env.DEFAULT_EDITOR_PASSWORD || 'Editor#123',
    role: 'editor',
    displayName: 'Content Editor',
  },
];

export async function ensureAdminUsersSeed(db) {
  const collection = db.collection('admin_users');
  let createdCount = 0;

  for (const account of DEFAULT_ADMIN_USERS) {
    const existing = await collection.findOne({ uuid: account.uuid });
    if (!existing) {
      const now = new Date().toISOString();
      await collection.insertOne({
        uuid: account.uuid,
        role: account.role,
        displayName: account.displayName,
        passwordHash: hashPassword(account.password),
        active: true,
        createdAt: now,
        updatedAt: now,
      });
      createdCount += 1;
    }
  }

  if (createdCount > 0) {
    console.log(`  ✓ Seeded ${createdCount} admin user(s) in 'admin_users'`);
  }
}
