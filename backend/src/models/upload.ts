import mongoose, { Document, Schema } from "mongoose";

export type UploadStatus = "uploaded" | "processing" | "completed" | "failed";
export type PredictionStatus = "pending" | "running" | "completed" | "failed";

export interface IUpload extends Document {
  userId: mongoose.Types.ObjectId;
  originalFileName: string;
  storedFileName: string;
  fileType: string;
  fileSize: number;
  jobId?: string;
  prediction?: unknown;
  predictionError?: string;
  uploadStatus: UploadStatus;
  predictionStatus: PredictionStatus;
  confidenceScore?: number;
  detectedMinerals?: string[];
  predictionTimestamp?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const UploadSchema = new Schema<IUpload>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },
    storedFileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    jobId: {
      type: String,
      trim: true,
      index: true,
    },
    prediction: {
      type: Schema.Types.Mixed,
    },
    predictionError: {
      type: String,
      trim: true,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    detectedMinerals: {
      type: [String],
      default: [],
    },
    predictionTimestamp: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    uploadStatus: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
      required: true,
    },
    predictionStatus: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Upload = mongoose.models.Upload || mongoose.model<IUpload>("Upload", UploadSchema);

export default Upload;
