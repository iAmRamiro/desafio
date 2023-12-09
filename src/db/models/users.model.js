import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },

  last_name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  age: {
    type: Number,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  isGitHub: {
    type: Boolean,
    default: false,
  },

  isGoogle: {
    type: Boolean,
    default: false,
  },

  cart: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Carts",
  },

  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER",
  },
});

export const usersModel = mongoose.model("users", userSchema);
