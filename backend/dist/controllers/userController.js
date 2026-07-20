"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeController = getMeController;
exports.adminDashboardController = adminDashboardController;
exports.getUsersController = getUsersController;
exports.activateUserController = activateUserController;
exports.deactivateUserController = deactivateUserController;
exports.deleteUserController = deleteUserController;
exports.getSubscriptionsController = getSubscriptionsController;
exports.getSnapshotController = getSnapshotController;
exports.deleteSnapshotController = deleteSnapshotController;
exports.adminAnalyticsController = adminAnalyticsController;
exports.customerDashboardController = customerDashboardController;
const mongoose_1 = __importDefault(require("mongoose"));
const report_1 = __importDefault(require("../models/report"));
const snapshot_1 = __importDefault(require("../models/snapshot"));
const upload_1 = __importDefault(require("../models/upload"));
const user_1 = __importDefault(require("../models/user"));
function getMeController(req, res) {
    const user = req.user;
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
function getSubscriptionMeta(user) {
    if (user.subscriptionStatus || user.paymentStatus) {
        return {
            subscriptionStatus: user.subscriptionStatus ?? "trial",
            paymentStatus: user.paymentStatus ?? "pending",
            paymentProvider: user.paymentProvider ?? "razorpay",
        };
    }
    const { status, createdAt } = user;
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
async function adminDashboardController(_req, res) {
    const [totalUsers, activeUsers, inactiveUsers, customerUsers] = await Promise.all([
        user_1.default.countDocuments(),
        user_1.default.countDocuments({ status: "active" }),
        user_1.default.countDocuments({ status: "inactive" }),
        user_1.default.find({ role: "customer" })
            .select("createdAt status subscriptionStatus paymentStatus paymentProvider")
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
        const meta = getSubscriptionMeta({
            status: user.status,
            createdAt: user.createdAt,
            subscriptionStatus: user.subscriptionStatus,
            paymentStatus: user.paymentStatus,
            paymentProvider: user.paymentProvider,
        });
        subscriptionSummary[meta.subscriptionStatus] += 1;
        paymentStatusSummary[meta.paymentStatus] += 1;
    });
    const lastRegisteredUsers = await user_1.default.find()
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
async function getUsersController(req, res) {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 10)));
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const statusFilter = typeof req.query.status === "string" ? req.query.status : undefined;
    const roleFilter = typeof req.query.role === "string" ? req.query.role : undefined;
    const filter = {};
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
        user_1.default.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        user_1.default.countDocuments(filter),
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
async function activateUserController(req, res) {
    const { id } = req.params;
    const currentUser = req.user;
    if (!currentUser) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    if (currentUser.id === id) {
        return res.status(403).json({ status: "error", message: "You cannot change your own account" });
    }
    const user = await user_1.default.findById(id);
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
async function deactivateUserController(req, res) {
    const { id } = req.params;
    const currentUser = req.user;
    if (!currentUser) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    if (currentUser.id === id) {
        return res.status(403).json({ status: "error", message: "You cannot change your own account" });
    }
    const user = await user_1.default.findById(id);
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
async function deleteUserController(req, res) {
    const { id } = req.params;
    const currentUser = req.user;
    if (!currentUser) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    if (currentUser.id === id) {
        return res.status(403).json({ status: "error", message: "You cannot delete your own account" });
    }
    const user = await user_1.default.findById(id);
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
async function getSubscriptionsController(_req, res) {
    const customers = await user_1.default.find({ role: "customer" })
        .select("name email status createdAt subscriptionStatus paymentStatus paymentProvider")
        .sort({ createdAt: -1 })
        .lean();
    const subscriptions = customers.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        ...getSubscriptionMeta({
            status: user.status,
            createdAt: user.createdAt,
            subscriptionStatus: user.subscriptionStatus,
            paymentStatus: user.paymentStatus,
            paymentProvider: user.paymentProvider,
        }),
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
async function getSnapshotController(req, res) {
    const currentUser = req.user;
    if (!currentUser) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    const snapshots = await snapshot_1.default.find({ userId: currentUser.id })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    return res.status(200).json({
        status: "ok",
        data: snapshots,
    });
}
async function deleteSnapshotController(req, res) {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ status: "error", message: "Snapshot not found" });
    }
    const snapshot = await snapshot_1.default.findById(id);
    if (!snapshot) {
        return res.status(404).json({ status: "error", message: "Snapshot not found" });
    }
    await snapshot.deleteOne();
    return res.status(200).json({
        status: "ok",
        message: "Snapshot deleted",
    });
}
async function adminAnalyticsController(_req, res) {
    const [totalPredictions, completedUploads, failedUploads, totalReports, uploadsByMonth] = await Promise.all([
        upload_1.default.countDocuments(),
        upload_1.default.countDocuments({ uploadStatus: "completed" }),
        upload_1.default.countDocuments({ uploadStatus: "failed" }),
        report_1.default.countDocuments(),
        upload_1.default.aggregate([
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
async function customerDashboardController(req, res) {
    const currentUser = req.user;
    if (!currentUser) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    const [profile, uploads, reports] = await Promise.all([
        user_1.default.findById(currentUser.id).select("name email role status createdAt").lean(),
        upload_1.default.find({ userId: currentUser.id })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("originalFileName uploadStatus predictionStatus createdAt")
            .lean(),
        report_1.default.find({ userId: currentUser.id })
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
