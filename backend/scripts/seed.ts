import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { runSeeds } from '../db/seeds/index.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function main(): Promise<void> {
  if (!MONGO_URI) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(1);
  }

  const includeDev = process.argv.includes('--dev');

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  try {
    await runSeeds(includeDev);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main().catch((error) => {
  console.error('Seed script failed:', error);
  process.exit(1);
});
