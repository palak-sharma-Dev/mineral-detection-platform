import { apiRequest } from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface CreateOrderResponse {
  keyId?: string;
  order?: {
    id: string;
    amount: number;
    currency: string;
  } | null;
  configured?: boolean;
}

export interface SubscriptionStatus {
  plan: string;
  status: string;
  paymentStatus: string;
  provider: string;
  configured: boolean;
}

function loadRazorpayCheckout() {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function getSubscriptionStatus() {
  const response = await apiRequest<SubscriptionStatus>("/subscription/status");
  return response.data ?? null;
}

export async function startSubscriptionPayment(plan: "monthly" | "annual") {
  const response = await apiRequest<CreateOrderResponse>("/subscription/create-order", {
    method: "POST",
    body: { plan },
  });
  const payment = response.data;

  if (!payment?.order || !payment.keyId) {
    return { status: "pending" as const, message: response.message ?? "Razorpay is not configured" };
  }

  const checkoutLoaded = await loadRazorpayCheckout();
  if (!checkoutLoaded || !window.Razorpay) {
    return { status: "failed" as const, message: "Unable to load Razorpay checkout" };
  }

  const RazorpayCheckout = window.Razorpay;

  return new Promise<{ status: "success" | "failed"; message: string }>((resolve) => {
    const checkout = new RazorpayCheckout({
      key: payment.keyId ?? "",
      amount: payment.order?.amount ?? 0,
      currency: payment.order?.currency ?? "INR",
      name: "GARUD AI",
      description: `${plan} subscription`,
      order_id: payment.order?.id ?? "",
      handler: async (razorpayResponse) => {
        await apiRequest("/subscription/verify", {
          method: "POST",
          body: { ...razorpayResponse },
        });
        resolve({ status: "success", message: "Payment successful" });
      },
      modal: {
        ondismiss: () => resolve({ status: "failed", message: "Payment cancelled" }),
      },
    });

    checkout.open();
  });
}
