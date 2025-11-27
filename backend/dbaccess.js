import mongoose from "mongoose";
import { MONGO_URI } from "./server.js";

export const corsOptions = { origin: ["http://localhost:4200", "https://helpa.ws", "https://www.helpa.ws"] };

async function connectWithRetry(mongodb_url) {
  const maxRetries = 10;
  const retryInterval = 3000;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      await mongoose.connect(mongodb_url);
      console.log('Connected to MongoDB');
      return;
    } catch (err) {
      console.log(`MongoDB connection attempt ${i + 1} failed, retrying in ${retryInterval}ms...`);
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
  
  throw new Error('Could not connect to MongoDB after max retries');
}

export const connect = () => {
  // mongodb initialization
  connectWithRetry(MONGO_URI);
  //mongoose.createConnection(ATLAS_URI);
};

// db operating functions
export const retrieveModel = async (model, expr) => {
  const results = expr 
    ? await model.find(expr) 
    : await model.find({});
  return results;
};

export const retrieveModelLimited = async (model, limit, expr) => {
  const results = expr
    ? await model.find(expr).sort('-created_at').limit(limit)
    : await model.find({}).limit(limit);
  return results;
}

export const retrieveModelById = async (model, id) => {
  const result = await model.findById(id);
  return result;
};

export const retrieveOneModelByQuery = async (model, query) => {
  const result = await model.findOne(query).exec();
  return result;
};

export const generateModel = async (model, payload) => {
  const result = await model.create(payload);
  return result;
};

export const updateModel = async (model, filter, expression) => {
  const result = await model.findOneAndUpdate(filter, expression, {
    new: true,
  });
  return result;
};

export const removeModel = async (model, filter, expression) => {
  const result = await model.findOneAndRemove(filter, expression);
  return result;
};

export const deleteModel = async (model, parentId, childField, childId) => {
  const parent = await model.findById(parentId);
  const childIndex = parent[childField].findIndex(
    (c) => c._id.toString() === childId,
  );
  parent[childField].splice(childIndex, 1);
  await parent.save();
};
