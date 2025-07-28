import mongoose from "mongoose";
import * as dotenv from "dotenv";

export const corsOptions = { origin: ["http://localhost:4200"] };

export const connect = () => {
  // mongodb initialization
  dotenv.config();
  const { MONGO_DB_URL } = process.env;
  mongoose.connect(MONGO_DB_URL);
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
