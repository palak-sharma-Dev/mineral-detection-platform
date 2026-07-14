"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPredictionStatusController = getPredictionStatusController;
exports.getPredictionResultController = getPredictionResultController;
const upload_1 = __importDefault(require("../models/upload"));
async function getPredictionStatusController(req, res) {
    const user = req.user;
    const { jobId } = req.params;
    if (!user) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    const upload = await upload_1.default.findOne({ jobId });
    if (!upload) {
        return res.status(404).json({ status: "error", message: "Job not found" });
    }
    if (user.role !== "admin" && upload.userId.toString() !== user.id) {
        return res.status(403).json({ status: "error", message: "Forbidden" });
    }
    return res.status(200).json({
        status: "ok",
        data: {
            uploadStatus: upload.uploadStatus,
            predictionStatus: upload.predictionStatus,
            jobId: upload.jobId,
            predictionError: upload.predictionError,
        },
    });
}
async function getPredictionResultController(req, res) {
    const user = req.user;
    const { jobId } = req.params;
    if (!user) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    const upload = await upload_1.default.findOne({ jobId });
    if (!upload) {
        return res.status(404).json({ status: "error", message: "Job not found" });
    }
    if (user.role !== "admin" && upload.userId.toString() !== user.id) {
        return res.status(403).json({ status: "error", message: "Forbidden" });
    }
    if (upload.predictionStatus !== "completed") {
        return res.status(202).json({ status: "ok", data: { predictionStatus: upload.predictionStatus } });
    }
    return res.status(200).json({
        status: "ok",
        data: {
            prediction: upload.prediction,
            uploadStatus: upload.uploadStatus,
            predictionStatus: upload.predictionStatus,
            reportGenerated: !!upload.prediction,
        },
    });
}
