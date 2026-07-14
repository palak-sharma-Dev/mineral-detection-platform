"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const config_1 = require("../config");
async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ status: "error", message: "Authorization token missing" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        if (!decoded.userId) {
            return res.status(401).json({ status: "error", message: "Invalid token" });
        }
        const user = await user_1.default.findById(decoded.userId).select("name email role status");
        if (!user) {
            return res.status(401).json({ status: "error", message: "Invalid token" });
        }
        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ status: "error", message: "Invalid or expired token" });
    }
}
