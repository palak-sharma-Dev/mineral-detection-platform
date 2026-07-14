import { Request, Response } from "express";
import Upload from "../models/upload";
import { submitPredictionJob, pollPredictionForUpload } from "../services/aiService";

export async function uploadImageController(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  if (!req.file) {
    return res.status(400).json({ status: "error", message: "No file provided" });
  }

  const upload = await Upload.create({
    userId: user.id,
    originalFileName: req.file.originalname,
    storedFileName: req.file.filename,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    uploadStatus: "uploaded",
    predictionStatus: "pending",
  });

  try {
    const jobId = await submitPredictionJob(req.file.path);
    upload.jobId = jobId;
    upload.uploadStatus = "processing";
    upload.predictionStatus = "running";
    await upload.save();

    void pollPredictionForUpload(upload._id.toString(), jobId);
  } catch (error) {
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
