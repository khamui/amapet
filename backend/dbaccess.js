import mongoose from "mongoose";
import * as dotenv from "dotenv";

export const corsOptions = { origin: ["http://localhost:8181"] };

export const connect = () => {
  // mongodb initialization
  dotenv.config();
  const { ATLAS_URI } = process.env;
  mongoose.connect(ATLAS_URI);
}

// db operating functions
export const retrieveModel = async (model) => {
  const results = await model.find({});
  return results;
};

export const retrieveModelById = async (model, id) => {
  const result = await model.findById(id);
  return result;
};

export const retrieveOneModelByQuery = async (model, query) => {
  const result = await model.findOne(query).exec();
  return result
}

export const generateModel = async (model, payload) => {
  const generated = await model.create(payload);
  const result = await generated.save();
  return result;
};

