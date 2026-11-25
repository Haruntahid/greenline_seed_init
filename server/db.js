import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const dbName = process.env.DB_NAME || 'greenline_seed';

let client = null;
let isConnected = false;

function getMongoClient() {
  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  return client;
}

export async function connectToMongoDB() {
  try {
    const currentClient = getMongoClient();
    if (!isConnected) {
      await currentClient.connect();
      isConnected = true;
      console.log('You successfully connected to MongoDB!');
    }
    return currentClient;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}

export function getDb() {
  return getMongoClient().db(dbName);
}

export function getClient() {
  return getMongoClient();
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  if (client && isConnected) {
    await client.close();
    isConnected = false;
    client = null;
    console.log('MongoDB connection closed.');
  }
}
