import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://tahidtaha997_db_user:greenline-seed2026@cluster0.fkko2hi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = process.env.DB_NAME || 'greenline_seed';

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
