import { Request, Response } from "express";
import mongoose from "mongoose";
import Upload, { IUpload } from "../models/upload";

export async function getHistoryController(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const uploads = await Upload.find({ userId: user.id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean<IUpload[]>();

  return res.status(200).json({ status: "ok", data: uploads });
}

export async function getUploadDetailsController(req: Request, res: Response) {
  const user = req.user;
  const { id } = req.params;

  if (!user) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ status: "error", message: "Upload not found" });
  }

  const upload = await Upload.findById(id).lean<IUpload>();
  if (!upload) {
    return res.status(404).json({ status: "error", message: "Upload not found" });
  }

  const isOwner = upload.userId.toString() === user.id;
  if (!isOwner && user.role !== "admin") {
    return res.status(403).json({ status: "error", message: "Forbidden" });
  }

  return res.status(200).json({ status: "ok", data: upload });
}
