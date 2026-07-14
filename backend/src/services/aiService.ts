import { fetch, FormData } from "undici";
import fs from "fs";
import { config } from "../config";
import Report from "../models/report";
import Snapshot from "../models/snapshot";
import Upload from "../models/upload";

interface AiStatusResponse {
  status: string;
  message?: string;
  error?: string;
}

interface AiResultResponse {
  status: string;
  prediction?: unknown;
  error?: string;
}

const defaultHeaders = {
  Authorization: `Bearer ${config.aiApiKey}`,
};

export async function submitPredictionJob(imagePath: string): Promise<string> {
  const url = `${config.aiBaseUrl.replace(/\/$/, "")}/predict/image`;
  const formData = new FormData();
  formData.set("image", fs.createReadStream(imagePath) as unknown as Blob);

  const response = await fetch(url, {
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

  const data = (await response.json()) as { jobId?: string; error?: string };
  if (!data.jobId) {
    throw new Error(data.error ?? "AI service did not return a jobId");
  }

  return data.jobId;
}

export async function getAiPredictionStatus(jobId: string): Promise<AiStatusResponse> {
  const url = `${config.aiBaseUrl.replace(/\/$/, "")}/predict/status/${jobId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI status error: ${response.status} ${body}`);
  }

  return (await response.json()) as AiStatusResponse;
}

export async function getAiPredictionResult(jobId: string): Promise<AiResultResponse> {
  const url = `${config.aiBaseUrl.replace(/\/$/, "")}/predict/result/${jobId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI result error: ${response.status} ${body}`);
  }

  return (await response.json()) as AiResultResponse;
}

export async function pollPredictionForUpload(uploadId: string, jobId: string) {
  const maxAttempts = 12;
  const pollIntervalMs = 10000;
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      const statusResponse = await getAiPredictionStatus(jobId);
      const normalizedStatus = statusResponse.status?.toLowerCase() ?? "pending";

      const upload = await Upload.findById(uploadId);
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

        const predictionData = resultResponse.prediction as Record<string, unknown> | undefined;
        const detectedMinerals = Array.isArray(predictionData?.detectedMinerals)
          ? (predictionData.detectedMinerals as string[])
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
          await Report.create({
            uploadId: upload._id,
            userId: upload.userId,
            prediction: upload.prediction,
            generatedAt: new Date(),
            reportStatus: "generated",
          });
        } catch (reportError) {
          console.error("Failed to create report:", reportError);
        }

        try {
          await Snapshot.create({
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
        } catch (snapshotError) {
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
    } catch (error) {
      const upload = await Upload.findById(uploadId);
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

  const upload = await Upload.findById(uploadId);
  if (upload) {
    upload.uploadStatus = "failed";
    upload.predictionStatus = "failed";
    upload.predictionError = "Prediction polling timed out";
    await upload.save();
  }
}
