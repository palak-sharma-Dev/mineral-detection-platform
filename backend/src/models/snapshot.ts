import mongoose, { Document, Schema } from "mongoose";

export interface ISnapshot extends Document {
  userId: mongoose.Types.ObjectId;
  uploadId: mongoose.Types.ObjectId;
  originalFileName: string;
  storedFileName: string;
  fileType: string;
  fileSize: number;
  predictionSummary?: string;
  confidenceScore?: number;
  detectedMinerals: string[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const SnapshotSchema = new Schema<ISnapshot>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uploadId: {
      type: Schema.Types.ObjectId,
      ref: "Upload",
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
    predictionSummary: {
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
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Snapshot = mongoose.models.Snapshot || mongoose.model<ISnapshot>("Snapshot", SnapshotSchema);

export default Snapshot;
