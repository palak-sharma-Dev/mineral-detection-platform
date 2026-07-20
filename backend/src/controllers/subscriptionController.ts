import { Request, Response } from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import Razorpay from "razorpay";
import User from "../models/user";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID ?? "";
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";
const razorpay = keyId && keySecret
  ? new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  : null;

interface StoredSubscriptionStatus {
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  paymentStatus?: string;
  paymentProvider?: string;
}

interface RazorpayOrderDetails {
  amount?: number;
  notes?: {
    plan?: string;
  };
}

function getPlanAmount(plan: string) {
  if (plan === "annual") {
    return 1999900;
  }

  return 199900;
}

async function getSubscriptionStatus(userId?: string) {
  const user = userId
    ? await User.findOne({ _id: userId })
        .select("subscriptionPlan subscriptionStatus paymentStatus paymentProvider")
        .lean<StoredSubscriptionStatus>()
    : null;

  return {
    plan: user?.subscriptionPlan ?? "trial",
    status: user?.subscriptionStatus ?? "trial",
    paymentStatus: user?.paymentStatus ?? "pending",
    provider: user?.paymentProvider ?? "razorpay",
    configured: Boolean(keyId && keySecret),
  };
}

export async function getSubscriptionStatusController(req: Request, res: Response) {
  return res.status(200).json({
    status: "ok",
    data: await getSubscriptionStatus(req.user?.id),
  });
}

export async function createSubscriptionOrderController(req: Request, res: Response) {
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

export async function verifySubscriptionPaymentController(req: Request, res: Response) {
  const {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  } = req.body;

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

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    await User.findByIdAndUpdate(req.user.id, {
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

  const order = await razorpay.orders.fetch(razorpayOrderId) as RazorpayOrderDetails;
  const subscriptionPlan = order.notes?.plan === "annual" ? "annual" : "monthly";
  const expectedAmount = getPlanAmount(subscriptionPlan);

  if (order.amount !== expectedAmount) {
    await User.findByIdAndUpdate(req.user.id, {
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

  await User.findByIdAndUpdate(req.user.id, {
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
