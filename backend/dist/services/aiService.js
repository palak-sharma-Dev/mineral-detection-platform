"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitPredictionJob = submitPredictionJob;
exports.getAiPredictionStatus = getAiPredictionStatus;
exports.getAiPredictionResult = getAiPredictionResult;
exports.pollPredictionForUpload = pollPredictionForUpload;
const undici_1 = require("undici");
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../config");
const report_1 = __importDefault(require("../models/report"));
const snapshot_1 = __importDefault(require("../models/snapshot"));
const upload_1 = __importDefault(require("../models/upload"));
const defaultHeaders = {
    Authorization: `Bearer ${config_1.config.aiApiKey}`,
};
async function submitPredictionJob(imagePath) {
    const url = `${config_1.config.aiBaseUrl.replace(/\/$/, "")}/predict/image`;
    const formData = new undici_1.FormData();
    formData.set("image", fs_1.default.createReadStream(imagePath));
    const response = await (0, undici_1.fetch)(url, {
        method: "POST",
        headers: {
            ...defaultHeaders,
            "Content-Type": "multipart/form-data",
        },
        body: formData,
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`AI service error: ${response.status} ${body}`);
    }
    const data = (await response.json());
    if (!data.jobId) {
        throw new Error(data.error ?? "AI service did not return a jobId");
    }
    return data.jobId;
}
async function getAiPredictionStatus(jobId) {
    const url = `${config_1.config.aiBaseUrl.replace(/\/$/, "")}/predict/status/${jobId}`;
    const response = await (0, undici_1.fetch)(url, {
        method: "GET",
        headers: defaultHeaders,
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`AI status error: ${response.status} ${body}`);
    }
    return (await response.json());
}
async function getAiPredictionResult(jobId) {
    const url = `${config_1.config.aiBaseUrl.replace(/\/$/, "")}/predict/result/${jobId}`;
    const response = await (0, undici_1.fetch)(url, {
        method: "GET",
        headers: defaultHeaders,
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`AI result error: ${response.status} ${body}`);
    }
    return (await response.json());
}
async function pollPredictionForUpload(uploadId, jobId) {
    const maxAttempts = 12;
    const pollIntervalMs = 10000;
    let attempt = 0;
    while (attempt < maxAttempts) {
        attempt += 1;
        try {
            const statusResponse = await getAiPredictionStatus(jobId);
            const normalizedStatus = statusResponse.status?.toLowerCase() ?? "pending";
            const upload = await upload_1.default.findById(uploadId);
            if (!upload) {
                return;
            }
            if (normalizedStatus === "completed") {
                const resultResponse = await getAiPredictionResult(jobId);
                if (resultResponse.status?.toLowerCase() !== "completed") {
                    upload.uploadStatus = "failed";
                    upload.predictionStatus = "failed";
                    upload.predictionError = resultResponse.error ?? "Prediction completed but result unavailable";
                    await upload.save();
                    return;
                }
                const predictionData = resultResponse.prediction;
                const detectedMinerals = Array.isArray(predictionData?.detectedMinerals)
                    ? predictionData.detectedMinerals
                    : [];
                const confidenceScore = typeof predictionData?.confidenceScore === "number"
                    ? predictionData.confidenceScore
                    : undefined;
                upload.uploadStatus = "completed";
                upload.predictionStatus = "completed";
                upload.prediction = predictionData ?? null;
                upload.predictionError = undefined;
                upload.confidenceScore = confidenceScore;
                upload.detectedMinerals = detectedMinerals;
                upload.predictionTimestamp = new Date();
                upload.metadata = {
                    ...(upload.metadata ?? {}),
                    completedAt: upload.predictionTimestamp,
                    source: "ai-service",
                };
                await upload.save();
                try {
                    await report_1.default.create({
                        uploadId: upload._id,
                        userId: upload.userId,
                        prediction: upload.prediction,
                        generatedAt: new Date(),
                        reportStatus: "generated",
                    });
                }
                catch (reportError) {
                    console.error("Failed to create report:", reportError);
                }
                try {
                    await snapshot_1.default.create({
                        userId: upload.userId,
                        uploadId: upload._id,
                        originalFileName: upload.originalFileName,
                        storedFileName: upload.storedFileName,
                        fileType: upload.fileType,
                        fileSize: upload.fileSize,
                        predictionSummary: typeof predictionData?.summary === "string" ? predictionData.summary : undefined,
                        confidenceScore,
                        detectedMinerals,
                        metadata: {
                            prediction: upload.prediction,
                            completedAt: upload.predictionTimestamp,
                        },
                    });
                }
                catch (snapshotError) {
                    console.error("Failed to create snapshot:", snapshotError);
                }
                return;
            }
            if (normalizedStatus === "failed") {
                upload.uploadStatus = "failed";
                upload.predictionStatus = "failed";
                upload.predictionError = statusResponse.error ?? statusResponse.message ?? "Prediction job failed";
                await upload.save();
                return;
            }
            if (normalizedStatus === "running" || normalizedStatus === "pending") {
                upload.uploadStatus = "processing";
                upload.predictionStatus = "running";
                await upload.save();
            }
        }
        catch (error) {
            const upload = await upload_1.default.findById(uploadId);
            if (!upload) {
                return;
            }
            if (attempt >= maxAttempts) {
                upload.uploadStatus = "failed";
                upload.predictionStatus = "failed";
                upload.predictionError = error instanceof Error ? error.message : "Prediction polling failed";
                await upload.save();
                return;
            }
        }
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
    const upload = await upload_1.default.findById(uploadId);
    if (upload) {
        upload.uploadStatus = "failed";
        upload.predictionStatus = "failed";
        upload.predictionError = "Prediction polling timed out";
        await upload.save();
    }
}
