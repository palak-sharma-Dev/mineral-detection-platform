"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionStatusController = getSubscriptionStatusController;
exports.createSubscriptionOrderController = createSubscriptionOrderController;
exports.verifySubscriptionPaymentController = verifySubscriptionPaymentController;
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const razorpay_1 = __importDefault(require("razorpay"));
const user_1 = __importDefault(require("../models/user"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
dotenv_1.default.config();
const keyId = process.env.RAZORPAY_KEY_ID ?? "";
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";
const razorpay = keyId && keySecret
    ? new razorpay_1.default({
        key_id: keyId,
        key_secret: keySecret,
    })
    : null;
function getPlanAmount(plan) {
    if (plan === "annual") {
        return 1999900;
    }
    return 199900;
}
async function getSubscriptionStatus(userId) {
    const user = userId
        ? await user_1.default.findOne({ _id: userId })
            .select("subscriptionPlan subscriptionStatus paymentStatus paymentProvider")
            .lean()
        : null;
    return {
        plan: user?.subscriptionPlan ?? "trial",
        status: user?.subscriptionStatus ?? "trial",
        paymentStatus: user?.paymentStatus ?? "pending",
        provider: user?.paymentProvider ?? "razorpay",
        configured: Boolean(keyId && keySecret),
    };
}
async function getSubscriptionStatusController(req, res) {
    return res.status(200).json({
        status: "ok",
        data: await getSubscriptionStatus(req.user?.id),
    });
}
async function createSubscriptionOrderController(req, res) {
    const plan = typeof req.body.plan === "string" ? req.body.plan : "monthly";
    if (!keyId || !keySecret) {
        const subscriptionStatus = await getSubscriptionStatus(req.user?.id);
        return res.status(200).json({
            status: "ok",
            message: "Razorpay is not configured",
            data: {
                ...subscriptionStatus,
                order: null,
                keyId: "",
            },
        });
    }
    if (!razorpay) {
        return res.status(500).json({
            status: "error",
            message: "Razorpay client is unavailable",
        });
    }
    const order = await razorpay.orders.create({
        amount: getPlanAmount(plan),
        currency: "INR",
        receipt: `sub_${Date.now()}`,
        notes: { plan },
    });
    return res.status(200).json({
        status: "ok",
        data: {
            order,
            keyId,
            plan,
        },
    });
}
async function verifySubscriptionPaymentController(req, res) {
    const { razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId, razorpay_signature: razorpaySignature, } = req.body;
    if (!keyId || !keySecret) {
        return res.status(400).json({
            status: "error",
            message: "Razorpay is not configured",
        });
    }
    if (!razorpay) {
        return res.status(500).json({
            status: "error",
            message: "Razorpay client is unavailable",
        });
    }
    if (!req.user?.id || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
            status: "error",
            message: "Payment verification details are incomplete",
        });
    }
    const expectedSignature = crypto_1.default
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");
    if (expectedSignature !== razorpaySignature) {
        await user_1.default.findByIdAndUpdate(req.user.id, {
            paymentStatus: "failed",
            paymentProvider: "razorpay",
            razorpayOrderId,
            razorpayPaymentId,
        });
        return res.status(400).json({
            status: "error",
            message: "Payment verification failed",
        });
    }
    const order = await razorpay.orders.fetch(razorpayOrderId);
    const subscriptionPlan = order.notes?.plan === "annual" ? "annual" : "monthly";
    const expectedAmount = getPlanAmount(subscriptionPlan);
    if (order.amount !== expectedAmount) {
        await user_1.default.findByIdAndUpdate(req.user.id, {
            paymentStatus: "failed",
            paymentProvider: "razorpay",
            razorpayOrderId,
            razorpayPaymentId,
        });
        return res.status(400).json({
            status: "error",
            message: "Payment amount verification failed",
        });
    }
    await user_1.default.findByIdAndUpdate(req.user.id, {
        subscriptionPlan,
        subscriptionStatus: "active",
        paymentStatus: "paid",
        paymentProvider: "razorpay",
        razorpayOrderId,
        razorpayPaymentId,
        subscriptionActivatedAt: new Date(),
    });
    return res.status(200).json({
        status: "ok",
        message: "Payment verified and subscription updated",
        data: {
            paymentStatus: "paid",
            subscriptionStatus: await getSubscriptionStatus(req.user.id),
        },
    });
}
