import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, "../../../.env");
dotenv.config({ path: rootEnv });

const MONGO_URI = process.env.MONGO_URI;

/**
 * Connect to MongoDB database
 * Exits process if connection fails or URI is missing
 */
export const connectDB = async () => {
  if (!MONGO_URI) {
    console.error("Mongo URI not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
