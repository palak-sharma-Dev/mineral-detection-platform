"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CurrentUserName } from "@/components/auth/CurrentUserName";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { useAuth } from "@/context/AuthContext";
import { apiRequest, WORKFLOW_UPDATED_EVENT } from "@/lib/api";
import { getSubscriptionStatus, SubscriptionStatus } from "@/lib/payment";

interface DashboardUpload {
  _id: string;
  originalFileName: string;
  uploadStatus: string;
  predictionStatus: string;
  createdAt: string;
}

interface DashboardReport {
  _id: string;
  reportStatus: string;
  generatedAt: string;
}

interface DashboardData {
  profileSummary?: {
    name: string;
    email: string;
    role: string;
    status: string;
  };
  last10Uploads: DashboardUpload[];
  recentReports: DashboardReport[];
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string) {
  if (!value) {
    return "No uploads yet";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-center text-sm text-zinc-400">
      <div className="garud-loading-line mx-auto mb-3 h-1 w-24 rounded-full bg-white/10" />
      {label}
    </div>
  );
}

function EmptyBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.025] p-8 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold text-[color:var(--primary)]">
        G
      </span>
      <h3 className="mt-4 text-sm font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);

  const loadDashboard = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const response = await apiRequest<DashboardData>("/dashboard");
      setDashboardData(response.data ?? { last10Uploads: [], recentReports: [] });
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSubscription = useCallback(async () => {
    try {
      const status = await getSubscriptionStatus();
      setSubscription(status);
      setSubscriptionError(null);
    } catch (loadError) {
      setSubscriptionError(loadError instanceof Error ? loadError.message : "Unable to load subscription");
    } finally {
      setIsSubscriptionLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoadId = window.setTimeout(() => {
      void loadDashboard();
      void loadSubscription();
    }, 0);

    const handleWorkflowUpdate = () => {
      void loadDashboard();
    };

    window.addEventListener(WORKFLOW_UPDATED_EVENT, handleWorkflowUpdate);

    return () => {
      window.clearTimeout(initialLoadId);
      window.removeEventListener(WORKFLOW_UPDATED_EVENT, handleWorkflowUpdate);
    };
  }, [loadDashboard, loadSubscription]);

  const recentUploads = useMemo(() => dashboardData?.last10Uploads ?? [], [dashboardData?.last10Uploads]);
  const recentReports = useMemo(() => dashboardData?.recentReports ?? [], [dashboardData?.recentReports]);
  const totalAnalyses = recentReports.length;
  const lastUpload = recentUploads[0];
  const profile = dashboardData?.profileSummary ?? user;
  const hasActiveUpload = recentUploads.some((upload) => ["pending", "running"].includes(upload.predictionStatus));

  const recentActivity = useMemo(() => {
    const uploads = recentUploads.slice(0, 3).map((upload) => ({
      id: upload._id,
      title: upload.originalFileName,
      meta: `Upload ${titleCase(upload.predictionStatus || upload.uploadStatus)}`,
      date: upload.createdAt,
    }));

    const reports = recentReports.slice(0, 2).map((report) => ({
      id: report._id,
      title: "Mineral Analysis Report",
      meta: `Report ${titleCase(report.reportStatus)}`,
      date: report.generatedAt,
    }));

    return [...uploads, ...reports]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [recentReports, recentUploads]);

  useEffect(() => {
    if (!hasActiveUpload) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadDashboard();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [hasActiveUpload, loadDashboard]);

  return (
    <AuthGuard allowedRoles={["customer", "admin"]}>
      <SidebarLayout>
        <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-50 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumbs items={[{ label: "Dashboard" }]} />

            <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(124,140,255,0.16),rgba(255,255,255,0.045)_38%,rgba(56,215,191,0.08))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--secondary)]">
                    Customer Workspace
                  </p>
                  <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Welcome back, <CurrentUserName />
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                    Monitor mineral analysis activity, uploads and subscription access from one operational command center.
                  </p>
                  {profile?.email ? <p className="mt-3 text-xs text-zinc-500">{profile.email}</p> : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/analysis"
                    className="rounded-full border border-[color:var(--primary)] bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(124,140,255,0.24)] transition hover:-translate-y-0.5 hover:bg-[color:var(--primary)]/90"
                  >
                    New Analysis
                  </Link>
                  <Link
                    href="/reports"
                    className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:-translate-y-0.5 hover:bg-white/[0.09]"
                  >
                    View Reports
                  </Link>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Total Analyses", isLoading ? "..." : String(totalAnalyses), "Generated report records"],
                [
                  "Subscription Status",
                  isSubscriptionLoading ? "..." : subscription ? titleCase(subscription.status) : "Unavailable",
                  subscriptionError ?? (subscription ? `${titleCase(subscription.plan)} plan` : "No status available"),
                ],
                ["Recent Activity", isLoading ? "..." : String(recentActivity.length), "Latest platform events"],
                ["Last Upload Time", isLoading ? "..." : formatDate(lastUpload?.createdAt), lastUpload?.originalFileName ?? "Awaiting first upload"],
              ].map(([label, value, helper]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.06]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
                  <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{helper}</p>
                </div>
              ))}
            </section>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.65fr_1.35fr]">
              <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
                <p className="mt-2 text-sm text-zinc-500">Move directly into the primary analysis workflow.</p>
                <div className="mt-6 grid gap-3">
                  <Link
                    href="/analysis"
                    className="rounded-2xl border border-[color:var(--primary)] bg-[color:var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--primary)]/90"
                  >
                    New Analysis
                  </Link>
                  <Link
                    href="/history"
                    className="rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[color:var(--primary)]/35"
                  >
                    View History
                  </Link>
                  <Link
                    href="/reports"
                    className="rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[color:var(--primary)]/35"
                  >
                    View Reports
                  </Link>
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                <p className="mt-2 text-sm text-zinc-500">Uploads and report events from your account.</p>
                <div className="mt-6 space-y-3">
                  {isLoading ? (
                    <LoadingBlock label="Loading activity." />
                  ) : error ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">{error}</div>
                  ) : recentActivity.length === 0 ? (
                    <EmptyBlock title="No activity yet" description="Your recent uploads and reports will appear here." />
                  ) : (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
                        <p className="truncate text-sm font-semibold text-white">{activity.title}</p>
                        <p className="mt-1 text-xs text-zinc-500">{activity.meta}</p>
                        <p className="mt-3 text-xs text-zinc-600">{formatDate(activity.date)}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </AuthGuard>
  );
}
