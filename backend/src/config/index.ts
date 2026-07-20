import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Environment variable ${key} is required.`);
  }
  return value;
};

export const config = {
  port: Number(getEnv("PORT", "4000")),
  corsOrigin: getEnv("CORS_ORIGIN", "*"),
  nodeEnv: getEnv("NODE_ENV", "development"),
  mongoUri: getEnv("MONGODB_URI"),
  jwtSecret: getEnv("JWT_SECRET"),
  aiBaseUrl: getEnv("AI_BASE_URL"),
  aiApiKey: getEnv("AI_API_KEY"),
};
