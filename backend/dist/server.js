"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const database_1 = require("./config/database");
dotenv_1.default.config();
const port = config_1.config.port;
async function startServer() {
    try {
        await (0, database_1.connectDatabase)();
        app_1.default.listen(port, () => {
            console.log(`Backend server running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("Failed to start backend server:", error);
        process.exit(1);
    }
}
startServer();
