import { Request, Response } from "express";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID ?? "";
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";

function getPlanAmount(plan: string) {
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

export async function getSubscriptionStatusController(_req: Request, res: Response) {
  return res.status(200).json({
    status: "ok",
    data: getSubscriptionStatus(),
  });
}

export async function createSubscriptionOrderController(req: Request, res: Response) {
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

  const razorpay = new Razorpay({
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

export async function verifySubscriptionPaymentController(_req: Request, res: Response) {
  return res.status(200).json({
    status: "ok",
    message: "Payment verification is ready for Razorpay credentials",
    data: {
      paymentStatus: "pending",
      subscriptionStatus: getSubscriptionStatus(),
    },
  });
}
