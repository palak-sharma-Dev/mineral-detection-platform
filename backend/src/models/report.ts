import mongoose, { Document, Schema } from "mongoose";

export type ReportStatus = "generated" | "failed";

export interface IReport extends Document {
  uploadId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  prediction: unknown;
  generatedAt: Date;
  reportStatus: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    uploadId: {
      type: Schema.Types.ObjectId,
      ref: "Upload",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prediction: {
      type: Schema.Types.Mixed,
      required: true,
    },
    generatedAt: {
      type: Date,
      required: true,
    },
    reportStatus: {
      type: String,
      enum: ["generated", "failed"],
      required: true,
      default: "generated",
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);

export default Report;
