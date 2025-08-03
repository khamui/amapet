import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
});

export const User = model("User", userSchema);
