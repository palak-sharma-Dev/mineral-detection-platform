"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryController = getHistoryController;
exports.getUploadDetailsController = getUploadDetailsController;
const mongoose_1 = __importDefault(require("mongoose"));
const upload_1 = __importDefault(require("../models/upload"));
async function getHistoryController(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    const uploads = await upload_1.default.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    return res.status(200).json({ status: "ok", data: uploads });
}
async function getUploadDetailsController(req, res) {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ status: "error", message: "Upload not found" });
    }
    const upload = await upload_1.default.findById(id).lean();
    if (!upload) {
        return res.status(404).json({ status: "error", message: "Upload not found" });
    }
    const isOwner = upload.userId.toString() === user.id;
    if (!isOwner && user.role !== "admin") {
        return res.status(403).json({ status: "error", message: "Forbidden" });
    }
    return res.status(200).json({ status: "ok", data: upload });
}
