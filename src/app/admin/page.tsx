"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { apiRequest } from "@/lib/api";

interface AdminDashboardData {
  totals: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  };
  subscriptionSummary: Record<string, number>;
  paymentStatusSummary: Record<string, number>;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
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

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadAdminData() {
    setError(null);

    const [dashboardResponse, usersResponse, analyticsResponse] = await Promise.all([
      apiRequest<AdminDashboardData>("/admin/dashboard"),
      apiRequest<AdminUser[]>("/admin/users?limit=10"),
      apiRequest<AdminAnalytics>("/admin/analytics"),
    ]);

    setDashboard(dashboardResponse.data ?? null);
    setUsers(usersResponse.data ?? []);
    setAnalytics(analyticsResponse.data ?? null);
  }

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        await loadAdminData();
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load admin dashboard");
        }
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
  }, []);

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
      <main className="min-h-screen bg-[color:var(--background)] px-4 py-8 sm:px-6 lg:px-8">
      <Container>
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/dashboard", label: "Dashboard" }, { label: "Admin" }]} />
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">Admin Dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-secondary)]">
              {isLoading ? "Loading administrative overview." : error ? error : `Managing ${dashboard?.totals.totalUsers ?? 0} users across the platform.`}
            </p>
            <SignOutButton className="mt-4 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)]" />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Active Users</h2>
              <div className="mt-5 space-y-3">
                {isLoading ? (
                  <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
                    <LoadingState label="Loading users." />
                  </div>
                ) : error ? (
                  <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--error)]">
                    {error}
                  </div>
                ) : users.length === 0 ? (
                  <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
                    <EmptyState label="No users available yet." />
                  </div>
                ) : users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[color:var(--foreground)]">{user.name}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                        {user.email}
                      </p>
                    </div>
                    <span className="text-sm text-[color:var(--foreground-secondary)]">{titleCase(user.status)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Analytics</h2>
              <div className="mt-5 space-y-3">
                {isLoading ? (
                  <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
                    <LoadingState label="Loading analytics." />
                  </div>
                ) : error ? (
                  <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--error)]">
                    {error}
                  </div>
                ) : !analytics ? (
                  <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
                    <EmptyState label="No analytics available yet." />
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground-secondary)]">
                      Predictions: {analytics.totalPredictions}
                    </div>
                    <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground-secondary)]">
                      Success rate: {analytics.successRate}%
                    </div>
                    <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground-secondary)]">
                      Failed predictions: {analytics.failedPredictions}
                    </div>
                    <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground-secondary)]">
                      Reports: {analytics.totalReports}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">User Management</h2>
            {actionError ? <p className="mt-3 text-sm font-medium text-[color:var(--error)]">{actionError}</p> : null}
            <div className="mt-5 overflow-x-auto overflow-hidden rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12">
              {isLoading ? (
                <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
                  <LoadingState label="Loading user management." />
                </div>
              ) : error ? (
                <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--error)]">
                  {error}
                </div>
              ) : users.length === 0 ? (
                <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
                  <EmptyState label="No users available to manage." />
                </div>
              ) : (
                <table className="min-w-full divide-y divide-[color:var(--foreground-muted)]/12 text-left text-sm">
                  <thead className="bg-[color:var(--background)]">
                    <tr>
                      <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Name</th>
                      <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Email</th>
                      <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Role</th>
                      <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Status</th>
                      <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--foreground-muted)]/12 bg-[color:var(--card)]">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-4 py-3 text-[color:var(--foreground)]">{user.name}</td>
                        <td className="px-4 py-3 text-[color:var(--foreground-secondary)]">{user.email}</td>
                        <td className="px-4 py-3 text-[color:var(--foreground-secondary)]">{titleCase(user.role)}</td>
                        <td className="px-4 py-3 text-[color:var(--foreground-secondary)]">{titleCase(user.status)}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => void handleUserAction(user._id, "activate")}
                              disabled={activeActionId !== null}
                              className="rounded-[0.5rem] border border-[color:var(--primary)] bg-[color:var(--primary)] px-3 py-2 text-sm font-semibold text-white"
                            >
                              {activeActionId === `activate-${user._id}` ? "Activating" : "Activate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleUserAction(user._id, "deactivate")}
                              disabled={activeActionId !== null}
                              className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground)]"
                            >
                              {activeActionId === `deactivate-${user._id}` ? "Deactivating" : "Deactivate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleUserAction(user._id, "delete")}
                              disabled={activeActionId !== null}
                              className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground)]"
                            >
                              {activeActionId === `delete-${user._id}` ? "Removing" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </Container>
      </main>
    </AuthGuard>
  );
}
