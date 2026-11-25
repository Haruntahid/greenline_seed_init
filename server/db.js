import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'greenline_seed';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;

export async function connectToMongoDB() {
  try {
    if (!isConnected) {
      await client.connect();
      isConnected = true;
      console.log('You successfully connected to MongoDB!');
    }
    return client;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}

export function getDb() {
  return client.db(dbName);
}

export function getClient() {
  return client;
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  if (isConnected) {
    await client.close();
    isConnected = false;
    console.log('MongoDB connection closed.');
  }
}
