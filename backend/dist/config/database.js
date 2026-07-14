"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./index");
async function connectDatabase() {
    try {
        await mongoose_1.default.connect(index_1.config.mongoUri, {
            autoIndex: true,
        });
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
    }
    mongoose_1.default.connection.on("error", (error) => {
        console.error("MongoDB connection error:", error);
    });
}
