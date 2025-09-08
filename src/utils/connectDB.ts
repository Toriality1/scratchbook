import mongoose from "mongoose";
import logger from "./logger";
import env from "../config/env";

export async function connectDB() {
  try {
    await mongoose.connect(env.ATLAS_URI);
    logger.info("MongoDB connected successfully");
  } catch (err) {
    logger.error({ err }, "MongoDB connection error");
    process.exit(1);
  }
}
