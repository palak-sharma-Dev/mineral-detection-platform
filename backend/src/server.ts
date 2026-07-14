import dotenv from "dotenv";
import app from "./app";
import { config } from "./config";
import { connectDatabase } from "./config/database";

dotenv.config();

const port = config.port;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Backend server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend server:", error);
    process.exit(1);
  }
}

startServer();
