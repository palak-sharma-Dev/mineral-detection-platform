"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const config_1 = require("../config");
function buildAuthToken(user) {
    return jsonwebtoken_1.default.sign({ userId: user._id.toString(), role: user.role, email: user.email }, config_1.config.jwtSecret, { expiresIn: "7d" });
}
function buildAuthUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
async function registerController(req, res) {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await user_1.default.findOne({ email: normalizedEmail });
    if (existingUser) {
        return res.status(409).json({ status: "error", message: "Email already in use" });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    const user = await user_1.default.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "customer",
        status: "active",
    });
    const token = buildAuthToken(user);
    return res.status(201).json({
        status: "ok",
        data: {
            token,
            user: buildAuthUser(user),
        },
    });
}
async function loginController(req, res) {
    const { email, password } = req.body;
    const user = await user_1.default.findOne({ email: email.trim().toLowerCase() });
    if (!user || user.status !== "active") {
        return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
    const passwordMatches = await bcryptjs_1.default.compare(password, user.password);
    if (!passwordMatches) {
        return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
    const token = buildAuthToken(user);
    return res.status(200).json({
        status: "ok",
        data: {
            token,
            user: buildAuthUser(user),
        },
    });
}
