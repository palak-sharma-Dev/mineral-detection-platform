"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CurrentUserName } from "@/components/auth/CurrentUserName";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { useAuth } from "@/context/AuthContext";
import { apiRequest, WORKFLOW_UPDATED_EVENT } from "@/lib/api";

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    void loadDashboard(true);

    const handleWorkflowUpdate = () => {
      void loadDashboard();
    };

    window.addEventListener(WORKFLOW_UPDATED_EVENT, handleWorkflowUpdate);

    return () => {
      window.removeEventListener(WORKFLOW_UPDATED_EVENT, handleWorkflowUpdate);
    };
  }, [loadDashboard]);

  const recentAnalyses = dashboardData?.recentReports ?? [];
  const recentUploads = dashboardData?.last10Uploads ?? [];
  const generatedReports = recentAnalyses.filter((report) => report.reportStatus === "generated").length;
  const pendingReports = recentAnalyses.length - generatedReports;
  const profile = dashboardData?.profileSummary ?? user;
  const hasActiveUpload = recentUploads.some((upload) => ["pending", "running"].includes(upload.predictionStatus));

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
    <AuthGuard allowedRoles={["customer"]}>
      <SidebarLayout>
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Dashboard" }]} />
        <header className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-[0.625rem] bg-[color:var(--primary)] text-sm font-semibold uppercase tracking-[0.22em] text-white">
                G
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold text-[color:var(--foreground)]">GARUD AI</span>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                  Mineral Intelligence
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-[color:var(--foreground-secondary)]">Welcome</p>
              <p className="text-lg font-semibold text-[color:var(--foreground)]"><CurrentUserName /></p>
              {profile?.email ? (
                <p className="text-xs text-[color:var(--foreground-secondary)]">{profile.email}</p>
              ) : null}
            </div>
            <SignOutButton className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)]" />
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[color:var(--foreground)]">New Analysis</h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-secondary)]">
                  Start a new mineral analysis workflow.
                </p>
              </div>
              <Link
                href="/analysis"
                className="rounded-[0.5rem] border border-[color:var(--primary)] bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--primary)]/90"
              >
                Begin
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/history"
                className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)]"
              >
                View History
              </Link>
              <Link
                href="/reports"
                className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)]"
              >
                View Reports
              </Link>
              <Link
                href="/subscription"
                className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)]"
              >
                Subscription
              </Link>
              <Link
                href="/admin"
                className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)]"
              >
                Admin
              </Link>
            </div>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Recent Analyses</h2>
            <div className="mt-5 space-y-3">
              {isLoading ? (
                <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
                  <LoadingState label="Loading analyses." />
                </div>
              ) : error ? (
                <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--error)]">
                  {error}
                </div>
              ) : recentAnalyses.length === 0 ? (
                <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
                  <EmptyState label="No analyses available yet." />
                </div>
              ) : recentAnalyses.map((analysis) => (
                <div key={analysis._id} className="flex items-center justify-between rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[color:var(--foreground)]">Report</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">{analysis._id}</p>
                  </div>
                  <span className="text-sm text-[color:var(--foreground-secondary)]">{titleCase(analysis.reportStatus)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Last 10 Uploads</h2>
            <div className="mt-5 overflow-x-auto overflow-hidden rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12">
              <table className="min-w-full divide-y divide-[color:var(--foreground-muted)]/12 text-left text-sm">
                <thead className="bg-[color:var(--background)]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Upload</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--foreground-muted)]/12 bg-[color:var(--card)]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-[color:var(--foreground-secondary)]"><LoadingState label="Loading uploads." /></td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-[color:var(--error)]">{error}</td>
                    </tr>
                  ) : recentUploads.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-[color:var(--foreground-secondary)]"><EmptyState label="No uploads available yet." /></td>
                    </tr>
                  ) : recentUploads.map((upload) => (
                    <tr key={upload._id}>
                      <td className="px-4 py-3 text-[color:var(--foreground)]">{upload.originalFileName}</td>
                      <td className="px-4 py-3 text-[color:var(--foreground-secondary)]">{titleCase(upload.predictionStatus || upload.uploadStatus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Reports</h2>
            <div className="mt-5 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
              {isLoading ? "Loading reports." : error ? error : recentAnalyses.length === 0 ? "No reports available yet." : `${generatedReports} generated, ${pendingReports} pending or failed.`}
            </div>
          </section>
          </div>
        </div>
        </div>
      </SidebarLayout>
    </AuthGuard>
  );
}
