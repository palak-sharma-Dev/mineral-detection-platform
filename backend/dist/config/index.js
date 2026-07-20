"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
dotenv_1.default.config();
const getEnv = (key, fallback) => {
    const value = process.env[key] ?? fallback;
    if (!value) {
        throw new Error(`Environment variable ${key} is required.`);
    }
    return value;
};
exports.config = {
    port: Number(getEnv("PORT", "4000")),
    corsOrigin: getEnv("CORS_ORIGIN", "*"),
    nodeEnv: getEnv("NODE_ENV", "development"),
    mongoUri: getEnv("MONGODB_URI"),
    jwtSecret: getEnv("JWT_SECRET"),
    aiBaseUrl: getEnv("AI_BASE_URL"),
    aiApiKey: getEnv("AI_API_KEY"),
};
