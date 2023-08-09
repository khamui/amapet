import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  username: Number,
  email: String
});

export const User = mongoose.model("User", userSchema);
