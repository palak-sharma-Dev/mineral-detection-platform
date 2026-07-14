import { Request, Response } from "express";
import mongoose from "mongoose";
import Report, { IReport } from "../models/report";

export async function getReportsController(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 10)));
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const filter = user.role === "admin" ? {} : { userId: user.id };

  if (search) {
    Object.assign(filter, {
      $or: [{ reportStatus: new RegExp(search, "i") }],
    });
  }

  if (status && ["generated", "failed"].includes(status)) {
    Object.assign(filter, { reportStatus: status });
  }

  const [reports, totalReports] = await Promise.all([
    Report.find(filter)
      .sort({ generatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IReport[]>(),
    Report.countDocuments(filter),
  ]);

  return res.status(200).json({
    status: "ok",
    data: reports,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalReports / limit),
      totalItems: totalReports,
    },
  });
}

export async function getReportByIdController(req: Request, res: Response) {
  const user = req.user;
  const { id } = req.params;

  if (!user) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ status: "error", message: "Report not found" });
  }

  const report = await Report.findById(id).lean<IReport>();
  if (!report) {
    return res.status(404).json({ status: "error", message: "Report not found" });
  }

  if (user.role !== "admin" && report.userId.toString() !== user.id) {
    return res.status(403).json({ status: "error", message: "Forbidden" });
  }

  return res.status(200).json({ status: "ok", data: report });
}

export async function downloadReportController(req: Request, res: Response) {
  const user = req.user;
  const { id } = req.params;

  if (!user) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ status: "error", message: "Report not found" });
  }

  const report = await Report.findById(id).lean<IReport>();
  if (!report) {
    return res.status(404).json({ status: "error", message: "Report not found" });
  }

  if (user.role !== "admin" && report.userId.toString() !== user.id) {
    return res.status(403).json({ status: "error", message: "Forbidden" });
  }

  const payload = JSON.stringify(
    {
      reportId: report._id,
      generatedAt: report.generatedAt,
      reportStatus: report.reportStatus,
      prediction: report.prediction,
    },
    null,
    2
  );

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename="report-${report._id}.json"`);
  return res.status(200).send(payload);
}
