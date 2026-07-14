import mongoose from "mongoose";
import { config } from "./index";

export async function connectDatabase() {
  try {
    await mongoose.connect(config.mongoUri, {
      autoIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
}
