import { Request, Response } from "express";
import mongoose from "mongoose";
import Report from "../models/report";
import Snapshot from "../models/snapshot";
import Upload from "../models/upload";
import User from "../models/user";

export function getMeController(req: Request, res: Response) {
  const user = req.user as {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };

  return res.status(200).json({
    status: "ok",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
}

function getSubscriptionMeta(status: string, createdAt: Date) {
  const ageInDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  if (status !== "active") {
    return {
      subscriptionStatus: "expired",
      paymentStatus: "pending",
      paymentProvider: "razorpay",
    };
  }

  if (ageInDays < 14) {
    return {
      subscriptionStatus: "trial",
      paymentStatus: "pending",
      paymentProvider: "razorpay",
    };
  }

  return {
    subscriptionStatus: "active",
    paymentStatus: "paid",
    paymentProvider: "razorpay",
  };
}

export async function adminDashboardController(_req: Request, res: Response) {
  const [totalUsers, activeUsers, inactiveUsers, customerUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: "active" }),
    User.countDocuments({ status: "inactive" }),
    User.find({ role: "customer" })
      .select("createdAt status")
      .lean(),
  ]);

  const subscriptionSummary = {
    trial: 0,
    active: 0,
    expired: 0,
  };

  const paymentStatusSummary = {
    paid: 0,
    pending: 0,
    failed: 0,
  };

  customerUsers.forEach((user) => {
    const meta = getSubscriptionMeta(user.status, user.createdAt as Date);
    subscriptionSummary[meta.subscriptionStatus as keyof typeof subscriptionSummary] += 1;
    paymentStatusSummary[meta.paymentStatus as keyof typeof paymentStatusSummary] += 1;
  });

  const lastRegisteredUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email role status createdAt")
    .lean();

  return res.status(200).json({
    status: "ok",
    data: {
      totals: {
        totalUsers,
        activeUsers,
        inactiveUsers,
      },
      subscriptionSummary,
      paymentStatusSummary,
      lastRegisteredUsers,
    },
  });
}

export async function getUsersController(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 10)));
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const statusFilter = typeof req.query.status === "string" ? req.query.status : undefined;
  const roleFilter = typeof req.query.role === "string" ? req.query.role : undefined;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
    ];
  }

  if (statusFilter && ["active", "inactive"].includes(statusFilter)) {
    filter.status = statusFilter;
  }

  if (roleFilter && ["customer", "admin"].includes(roleFilter)) {
    filter.role = roleFilter;
  }

  const [users, totalUsers] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return res.status(200).json({
    status: "ok",
    data: users,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
      totalItems: totalUsers,
    },
  });
}

export async function activateUserController(req: Request, res: Response) {
  const { id } = req.params;
  const currentUser = req.user;

  if (!currentUser) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  if (currentUser.id === id) {
    return res.status(403).json({ status: "error", message: "You cannot change your own account" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  user.status = "active";
  await user.save();

  return res.status(200).json({
    status: "ok",
    message: "User activated",
    data: {
      id: user._id,
      status: user.status,
    },
  });
}

export async function deactivateUserController(req: Request, res: Response) {
  const { id } = req.params;
  const currentUser = req.user;

  if (!currentUser) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  if (currentUser.id === id) {
    return res.status(403).json({ status: "error", message: "You cannot change your own account" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  user.status = "inactive";
  await user.save();

  return res.status(200).json({
    status: "ok",
    message: "User deactivated",
    data: {
      id: user._id,
      status: user.status,
    },
  });
}

export async function deleteUserController(req: Request, res: Response) {
  const { id } = req.params;
  const currentUser = req.user;

  if (!currentUser) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  if (currentUser.id === id) {
    return res.status(403).json({ status: "error", message: "You cannot delete your own account" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  await user.deleteOne();

  return res.status(200).json({
    status: "ok",
    message: "User deleted",
    data: {
      id: user._id,
    },
  });
}

export async function getSubscriptionsController(_req: Request, res: Response) {
  const customers = await User.find({ role: "customer" })
    .select("name email status createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const subscriptions = customers.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    ...getSubscriptionMeta(user.status, user.createdAt as Date),
  }));

  const summary = {
    trial: subscriptions.filter((sub) => sub.subscriptionStatus === "trial").length,
    active: subscriptions.filter((sub) => sub.subscriptionStatus === "active").length,
    expired: subscriptions.filter((sub) => sub.subscriptionStatus === "expired").length,
  };

  const paymentStatusSummary = {
    paid: subscriptions.filter((sub) => sub.paymentStatus === "paid").length,
    pending: subscriptions.filter((sub) => sub.paymentStatus === "pending").length,
    failed: subscriptions.filter((sub) => sub.paymentStatus === "failed").length,
  };

  return res.status(200).json({
    status: "ok",
    data: {
      summary,
      paymentStatusSummary,
      subscriptions,
    },
  });
}

export async function getSnapshotController(req: Request, res: Response) {
  const currentUser = req.user;
  if (!currentUser) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const snapshots = await Snapshot.find({ userId: currentUser.id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return res.status(200).json({
    status: "ok",
    data: snapshots,
  });
}

export async function deleteSnapshotController(req: Request, res: Response) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ status: "error", message: "Snapshot not found" });
  }

  const snapshot = await Snapshot.findById(id);
  if (!snapshot) {
    return res.status(404).json({ status: "error", message: "Snapshot not found" });
  }

  await snapshot.deleteOne();

  return res.status(200).json({
    status: "ok",
    message: "Snapshot deleted",
  });
}

export async function adminAnalyticsController(_req: Request, res: Response) {
  const [totalPredictions, completedUploads, failedUploads, totalReports, uploadsByMonth] = await Promise.all([
    Upload.countDocuments(),
    Upload.countDocuments({ uploadStatus: "completed" }),
    Upload.countDocuments({ uploadStatus: "failed" }),
    Report.countDocuments(),
    Upload.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 6 },
    ]),
  ]);

  const successRate = totalPredictions > 0 ? (completedUploads / totalPredictions) * 100 : 0;

  return res.status(200).json({
    status: "ok",
    data: {
      totalPredictions,
      successRate: Number(successRate.toFixed(2)),
      failedPredictions: failedUploads,
      totalReports,
      uploadStatistics: {
        total: totalPredictions,
        completed: completedUploads,
        failed: failedUploads,
      },
      monthlyStatistics: uploadsByMonth,
    },
  });
}

export async function customerDashboardController(req: Request, res: Response) {
  const currentUser = req.user;
  if (!currentUser) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const [profile, uploads, reports] = await Promise.all([
    User.findById(currentUser.id).select("name email role status createdAt").lean(),
    Upload.find({ userId: currentUser.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("originalFileName uploadStatus predictionStatus createdAt")
      .lean(),
    Report.find({ userId: currentUser.id })
      .sort({ generatedAt: -1 })
      .limit(5)
      .select("prediction reportStatus generatedAt")
      .lean(),
  ]);

  return res.status(200).json({
    status: "ok",
    data: {
      profileSummary: profile,
      last10Uploads: uploads,
      snapshotList: uploads.slice(0, 5),
      recentReports: reports,
    },
  });
}
