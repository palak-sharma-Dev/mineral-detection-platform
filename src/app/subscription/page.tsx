"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  getSubscriptionStatus,
  startSubscriptionPayment,
  SubscriptionStatus,
} from "@/lib/payment";

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="space-y-3 text-center">
      <div className="garud-loading-line mx-auto h-1 w-24 rounded-full bg-[color:var(--foreground-muted)]/14" />
      <p>{label}</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center">
      <span className="garud-empty-mark">G</span>
      <p>{label}</p>
    </div>
  );
}

export default function SubscriptionPage() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<"monthly" | "annual" | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      try {
        const subscriptionStatus = await getSubscriptionStatus();
        if (isMounted) {
          setStatus(subscriptionStatus);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load subscription status");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePayment = async (plan: "monthly" | "annual") => {
    setActivePlan(plan);
    setMessage(null);
    setError(null);

    try {
      const result = await startSubscriptionPayment(plan);
      if (result.status === "failed") {
        setError(result.message);
      } else {
        setMessage(result.message);
      }
      const refreshedStatus = await getSubscriptionStatus();
      setStatus(refreshedStatus);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Payment failed");
    } finally {
      setActivePlan(null);
    }
  };

  return (
    <AuthGuard allowedRoles={["customer"]}>
      <main className="min-h-screen bg-[color:var(--background)] px-4 py-8 sm:px-6 lg:px-8">
        <Container>
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/dashboard", label: "Dashboard" }, { label: "Subscription" }]} />
          <div className="mx-auto max-w-4xl space-y-6">
            <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
              <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">Subscription</h1>
              <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-secondary)]">
                Manage access to GARUD AI mineral analysis.
              </p>
            </section>

            <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Current Status</h2>
              <div className="mt-5 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-5 text-sm text-[color:var(--foreground-secondary)]">
                {isLoading ? (
                  <LoadingState label="Loading subscription status." />
                ) : error ? (
                  error
                ) : status ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <span>Plan: {titleCase(status.plan)}</span>
                    <span>Status: {titleCase(status.status)}</span>
                    <span>Payment: {titleCase(status.paymentStatus)}</span>
                    <span>Provider: {titleCase(status.provider)}</span>
                  </div>
                ) : (
                  <EmptyState label="No subscription status available." />
                )}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              {(["monthly", "annual"] as const).map((plan) => (
                <div key={plan} className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6">
                  <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{titleCase(plan)}</h2>
                  <p className="mt-2 text-sm text-[color:var(--foreground-secondary)]">
                    {plan === "monthly" ? "INR 1,999 per month" : "INR 19,999 per year"}
                  </p>
                  <Button
                    type="button"
                    onClick={() => void handlePayment(plan)}
                    disabled={activePlan !== null}
                    className="mt-5"
                  >
                    {activePlan === plan ? "Processing" : "Choose Plan"}
                  </Button>
                </div>
              ))}
            </section>

            {message ? (
              <p className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--card)] px-4 py-3 text-sm text-[color:var(--foreground-secondary)]">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--card)] px-4 py-3 text-sm text-[color:var(--error)]">
                {error}
              </p>
            ) : null}
          </div>
        </Container>
      </main>
    </AuthGuard>
  );
}
