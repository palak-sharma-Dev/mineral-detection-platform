"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionStatusController = getSubscriptionStatusController;
exports.createSubscriptionOrderController = createSubscriptionOrderController;
exports.verifySubscriptionPaymentController = verifySubscriptionPaymentController;
const razorpay_1 = __importDefault(require("razorpay"));
const keyId = process.env.RAZORPAY_KEY_ID ?? "";
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";
function getPlanAmount(plan) {
    if (plan === "annual") {
        return 1999900;
    }
    return 199900;
}
function getSubscriptionStatus() {
    return {
        plan: "trial",
        status: "pending",
        paymentStatus: "pending",
        provider: "razorpay",
        configured: Boolean(keyId && keySecret),
    };
}
async function getSubscriptionStatusController(_req, res) {
    return res.status(200).json({
        status: "ok",
        data: getSubscriptionStatus(),
    });
}
async function createSubscriptionOrderController(req, res) {
    const plan = typeof req.body.plan === "string" ? req.body.plan : "monthly";
    if (!keyId || !keySecret) {
        return res.status(200).json({
            status: "ok",
            message: "Razorpay is not configured",
            data: {
                ...getSubscriptionStatus(),
                order: null,
                keyId: "",
            },
        });
    }
    const razorpay = new razorpay_1.default({
        key_id: keyId,
        key_secret: keySecret,
    });
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
async function verifySubscriptionPaymentController(_req, res) {
    return res.status(200).json({
        status: "ok",
        message: "Payment verification is ready for Razorpay credentials",
        data: {
            paymentStatus: "pending",
            subscriptionStatus: getSubscriptionStatus(),
        },
    });
}
