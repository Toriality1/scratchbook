import mongoose from "mongoose";
import logger from "./logger.js";
import env from "../config/env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.ATLAS_URI);
    logger.info("MongoDB connected successfully");
  } catch (err) {
    logger.error({ err }, "MongoDB connection error");
    process.exit(1);
  }
}
