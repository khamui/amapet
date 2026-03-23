import mongoose, { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { MONGO_URI } from './server.js';
import { runInitialSetup } from './db/setup/index.js';

export const corsOptions = {
  origin: ['http://localhost:4200', 'https://helpa.ws', 'https://www.helpa.ws'],
};

async function connectWithRetry(mongodb_url: string): Promise<void> {
  const maxRetries = 10;
  const retryInterval = 3000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      await mongoose.connect(mongodb_url);
      console.log('Connected to MongoDB');
      await runInitialSetup();
      return;
    } catch {
      console.log(`MongoDB connection attempt ${i + 1} failed, retrying in ${retryInterval}ms...`);
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }

  throw new Error('Could not connect to MongoDB after max retries');
}

export const connect = (): void => {
  // mongodb initialization
  if (MONGO_URI) {
    connectWithRetry(MONGO_URI);
  } else {
    console.error('MONGO_URI is not defined');
  }
};

// db operating functions
export const retrieveModel = async <T extends Document>(
  model: Model<T>,
  expr?: FilterQuery<T>
): Promise<T[]> => {
  const results = expr ? await model.find(expr) : await model.find({});
  return results;
};

export const retrieveModelLimited = async <T extends Document>(
  model: Model<T>,
  limit: number,
  expr?: FilterQuery<T>
): Promise<T[]> => {
  const results = expr
    ? await model.find(expr).sort('-created_at').limit(limit)
    : await model.find({}).limit(limit);
  return results;
};

export const retrieveModelById = async <T extends Document>(
  model: Model<T>,
  id: string
): Promise<T | null> => {
  const result = await model.findById(id);
  return result;
};

export const retrieveOneModelByQuery = async <T extends Document>(
  model: Model<T>,
  query: FilterQuery<T>
): Promise<T | null> => {
  const result = await model.findOne(query).exec();
  return result;
};

export const generateModel = async <T extends Document>(
  model: Model<T>,
  payload: Partial<T>
): Promise<T> => {
  const result = await model.create(payload);
  return result;
};

export const updateModel = async <T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T>,
  expression: UpdateQuery<T>
): Promise<T | null> => {
  const result = await model.findOneAndUpdate(filter, expression, {
    new: true,
  });
  return result;
};

export const removeModel = async <T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T>
): Promise<T | null> => {
  const result = await model.findOneAndDelete(filter);
  return result;
};

export const deleteModel = async <T extends Document>(
  model: Model<T>,
  parentId: string,
  childField: keyof T,
  childId: string
): Promise<void> => {
  const parent = await model.findById(parentId);
  if (!parent) return;

  const children = parent[childField] as unknown as { _id: { toString(): string } }[];
  const childIndex = children.findIndex((c) => c._id.toString() === childId);
  if (childIndex !== -1) {
    children.splice(childIndex, 1);
    await parent.save();
  }
};
