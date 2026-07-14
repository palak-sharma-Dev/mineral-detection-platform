"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageController = uploadImageController;
const upload_1 = __importDefault(require("../models/upload"));
const aiService_1 = require("../services/aiService");
async function uploadImageController(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    if (!req.file) {
        return res.status(400).json({ status: "error", message: "No file provided" });
    }
    const upload = await upload_1.default.create({
        userId: user.id,
        originalFileName: req.file.originalname,
        storedFileName: req.file.filename,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        uploadStatus: "uploaded",
        predictionStatus: "pending",
    });
    try {
        const jobId = await (0, aiService_1.submitPredictionJob)(req.file.path);
        upload.jobId = jobId;
        upload.uploadStatus = "processing";
        upload.predictionStatus = "running";
        await upload.save();
        void (0, aiService_1.pollPredictionForUpload)(upload._id.toString(), jobId);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "AI service request failed";
        upload.uploadStatus = "processing";
        upload.predictionStatus = "pending";
        upload.predictionError = message;
        await upload.save();
        return res.status(202).json({
            status: "ok",
            message: "Waiting for AI processing",
            data: {
                uploadId: upload._id,
                originalFileName: upload.originalFileName,
                uploadStatus: upload.uploadStatus,
                predictionStatus: upload.predictionStatus,
                createdAt: upload.createdAt,
                aiUnavailable: true,
            },
        });
    }
    return res.status(201).json({
        status: "ok",
        data: {
            uploadId: upload._id,
            originalFileName: upload.originalFileName,
            uploadStatus: upload.uploadStatus,
            predictionStatus: upload.predictionStatus,
            jobId: upload.jobId,
            createdAt: upload.createdAt,
        },
    });
}
