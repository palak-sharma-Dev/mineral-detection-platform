import { apiRequest } from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on?: (event: "payment.failed", handler: (response: RazorpayFailureResponse) => void) => void;
    };
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
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
    reason?: string;
  };
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

let razorpayCheckoutPromise: Promise<boolean> | null = null;

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

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function ensureRazorpayCheckout() {
  razorpayCheckoutPromise ??= loadRazorpayCheckout();
  return razorpayCheckoutPromise;
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

  const checkoutLoaded = await ensureRazorpayCheckout();
  if (!checkoutLoaded || !window.Razorpay) {
    return { status: "failed" as const, message: "Unable to load Razorpay checkout" };
  }

  const RazorpayCheckout = window.Razorpay;

  return new Promise<{ status: "success" | "failed"; message: string }>((resolve) => {
    let isResolved = false;
    const resolveOnce = (result: { status: "success" | "failed"; message: string }) => {
      if (isResolved) {
        return;
      }

      isResolved = true;
      resolve(result);
    };

    const checkout = new RazorpayCheckout({
      key: payment.keyId ?? "",
      amount: payment.order?.amount ?? 0,
      currency: payment.order?.currency ?? "INR",
      name: "GARUD AI",
      description: `${plan} subscription`,
      order_id: payment.order?.id ?? "",
      handler: async (razorpayResponse) => {
        try {
          await apiRequest("/subscription/verify", {
            method: "POST",
            body: {
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            },
          });
          resolveOnce({ status: "success", message: "Payment successful" });
        } catch (verificationError) {
          resolveOnce({
            status: "failed",
            message: verificationError instanceof Error ? verificationError.message : "Payment verification failed",
          });
        }
      },
      modal: {
        ondismiss: () => resolveOnce({ status: "failed", message: "Payment cancelled" }),
      },
      theme: {
        color: "#7c8cff",
      },
    });

    checkout.on?.("payment.failed", (failure) => {
      resolveOnce({
        status: "failed",
        message: failure.error?.description ?? failure.error?.reason ?? "Payment failed",
      });
    });

    checkout.open();
  });
}
