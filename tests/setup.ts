
// tests/setup.ts
// Fix: Import Jest's global functions to resolve TypeScript errors.
import { beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Runs once before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGO_URI = mongoUri; // Set env var for db util
  await mongoose.connect(mongoUri);
});

// Runs once after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Runs before each test
beforeEach(async () => {
  // Clear all data from all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});