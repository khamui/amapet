import mongoose from 'mongoose';
import config from '../migrate-mongo-config.js';

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  const uri = `${config.mongodb.url}/${config.mongodb.databaseName}`; 
  console.log('uri', uri);
  await mongoose.connect(uri);

  await mongoose.connection.syncIndexes();

  await mongoose.disconnect();
};

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const down = async (db, client) => {
  const collections = await db.listCollections().toArray();
  for (const coll of collections) {
    if (coll.name !== 'changelog') {
      await db.collection(coll.name).drop();
    }
  }
};
