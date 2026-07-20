"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Container } from "@/components/ui/Container";
import { apiRequest } from "@/lib/api";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
}

interface AdminDashboardData {
  totals: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  };
  subscriptionSummary: Record<string, number>;
  paymentStatusSummary: Record<string, number>;
  lastRegisteredUsers?: AdminUser[];
}

interface AdminAnalytics {
  totalPredictions: number;
  successRate: number;
  failedPredictions: number;
  totalReports: number;
  uploadStatistics: {
    total: number;
    completed: number;
    failed: number;
  };
}

function titleCase(value?: string) {
  if (!value) {
    return "Unavailable";
  }

  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string) {
  if (!value) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-center text-sm text-zinc-400">
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

function SummaryList({ title, values }: { title: string; values?: Record<string, number> }) {
  const entries = Object.entries(values ?? {});

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {entries.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-zinc-500">Ready for future integration.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {entries.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="text-sm text-zinc-500">{titleCase(label)}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-zinc-200">
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAdminData = useCallback(async () => {
    const [dashboardResult, usersResult, analyticsResult] = await Promise.allSettled([
      apiRequest<AdminDashboardData>("/admin/dashboard"),
      apiRequest<AdminUser[]>("/admin/users?limit=10"),
      apiRequest<AdminAnalytics>("/admin/analytics"),
    ]);

    if (dashboardResult.status === "fulfilled") {
      setDashboard(dashboardResult.value.data ?? null);
      setDashboardError(null);
    } else {
      setDashboard(null);
      setDashboardError(dashboardResult.reason instanceof Error ? dashboardResult.reason.message : "Unable to load admin overview");
    }

    if (usersResult.status === "fulfilled") {
      setUsers(usersResult.value.data ?? []);
      setUsersError(null);
    } else {
      setUsers([]);
      setUsersError(usersResult.reason instanceof Error ? usersResult.reason.message : "Unable to load users");
    }

    if (analyticsResult.status === "fulfilled") {
      setAnalytics(analyticsResult.value.data ?? null);
      setAnalyticsError(null);
    } else {
      setAnalytics(null);
      setAnalyticsError(analyticsResult.reason instanceof Error ? analyticsResult.reason.message : "Unable to load analytics");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        await loadAdminData();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [loadAdminData]);

  const recentActivity = useMemo(() => dashboard?.lastRegisteredUsers ?? users.slice(0, 5), [dashboard?.lastRegisteredUsers, users]);

  const handleUserAction = async (userId: string, action: "activate" | "deactivate" | "delete") => {
    setActionError(null);
    setActiveActionId(`${action}-${userId}`);

    try {
      await apiRequest(`/admin/users/${userId}${action === "delete" ? "" : `/${action}`}`, {
        method: action === "delete" ? "DELETE" : "PATCH",
      });
      await loadAdminData();
    } catch (userActionError) {
      setActionError(userActionError instanceof Error ? userActionError.message : "Unable to update user");
    } finally {
      setActiveActionId(null);
    }
  };

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <SidebarLayout>
        <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-50 sm:px-6 lg:px-8">
          <Container>
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Admin" }]} />

            <div className="mx-auto mt-6 max-w-7xl">
              <section className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(124,140,255,0.16),rgba(255,255,255,0.045)_38%,rgba(56,215,191,0.08))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--secondary)]">
                  Enterprise Administration
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Admin Dashboard
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                  Monitor users, subscriptions, payment status and recent platform activity from one operational workspace.
                </p>
              </section>

              <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Total Users", dashboard?.totals.totalUsers, dashboardError ?? "Registered platform accounts"],
                  ["Active Users", dashboard?.totals.activeUsers, dashboardError ?? `${dashboard?.totals.inactiveUsers ?? 0} inactive users`],
                  ["Predictions", analytics?.totalPredictions, analyticsError ?? "Upload records tracked"],
                  ["Reports", analytics?.totalReports, analyticsError ?? `${analytics?.successRate ?? 0}% success rate`],
                ].map(([label, value, helper]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
                    <p className="mt-4 text-3xl font-semibold text-white">{isLoading ? "..." : value ?? "--"}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{String(helper)}</p>
                  </div>
                ))}
              </section>

              <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                  <h2 className="text-xl font-semibold text-white">Status Overview</h2>
                  <p className="mt-2 text-sm text-zinc-500">Subscription and payment summaries from existing admin data.</p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                    {isLoading ? (
                      <LoadingBlock label="Loading status overview." />
                    ) : (
                      <>
                        <SummaryList title="Subscription Status Overview" values={dashboard?.subscriptionSummary} />
                        <SummaryList title="Payment Status Overview" values={dashboard?.paymentStatusSummary} />
                      </>
                    )}
                  </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                  <h2 className="text-xl font-semibold text-white">Recent User Activity</h2>
                  <p className="mt-2 text-sm text-zinc-500">Latest registered users and account states.</p>
                  <div className="mt-6 space-y-3">
                    {isLoading ? (
                      <LoadingBlock label="Loading recent activity." />
                    ) : usersError && recentActivity.length === 0 ? (
                      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">{usersError}</div>
                    ) : recentActivity.length === 0 ? (
                      <EmptyBlock title="No recent activity" description="Recent account activity will appear here when user data is available." />
                    ) : (
                      recentActivity.map((user) => (
                        <div key={user._id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                            <p className="mt-1 truncate text-xs text-zinc-500">{user.email}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-300">
                              {titleCase(user.role)}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-300">
                              {titleCase(user.status)}
                            </span>
                            <span className="text-xs text-zinc-600">{formatDate(user.createdAt)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">User Management</h2>
                    <p className="mt-2 text-sm text-zinc-500">Activate, deactivate or delete users using existing backend controls.</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
                    {users.length} loaded
                  </span>
                </div>

                {actionError ? <p className="mt-4 text-sm font-medium text-[color:var(--error)]">{actionError}</p> : null}

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                  {isLoading ? (
                    <LoadingBlock label="Loading user management." />
                  ) : usersError ? (
                    <div className="bg-zinc-950/70 p-6 text-sm text-red-200">{usersError}</div>
                  ) : users.length === 0 ? (
                    <div className="bg-zinc-950/70 p-6">
                      <EmptyBlock title="No users available" description="User management controls will appear when admin user data is available." />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                        <thead className="bg-zinc-950/80">
                          <tr>
                            <th className="px-4 py-3 font-medium text-zinc-500">Name</th>
                            <th className="px-4 py-3 font-medium text-zinc-500">Email</th>
                            <th className="px-4 py-3 font-medium text-zinc-500">Role</th>
                            <th className="px-4 py-3 font-medium text-zinc-500">Status</th>
                            <th className="px-4 py-3 font-medium text-zinc-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 bg-zinc-950/55">
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td className="px-4 py-4 text-white">{user.name}</td>
                              <td className="px-4 py-4 text-zinc-400">{user.email}</td>
                              <td className="px-4 py-4 text-zinc-400">{titleCase(user.role)}</td>
                              <td className="px-4 py-4 text-zinc-400">{titleCase(user.status)}</td>
                              <td className="px-4 py-4">
                                <div className="flex min-w-[24rem] flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => void handleUserAction(user._id, "activate")}
                                    disabled={activeActionId !== null || user.status === "active"}
                                    className="rounded-[0.5rem] border border-[color:var(--primary)] bg-[color:var(--primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[color:var(--primary)]/90 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {activeActionId === `activate-${user._id}` ? "Activating" : "Activate User"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void handleUserAction(user._id, "deactivate")}
                                    disabled={activeActionId !== null || user.status === "inactive"}
                                    className="rounded-[0.5rem] border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {activeActionId === `deactivate-${user._id}` ? "Deactivating" : "Deactivate User"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void handleUserAction(user._id, "delete")}
                                    disabled={activeActionId !== null}
                                    className="rounded-[0.5rem] border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {activeActionId === `delete-${user._id}` ? "Deleting" : "Delete User"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </Container>
        </div>
      </SidebarLayout>
    </AuthGuard>
  );
}
