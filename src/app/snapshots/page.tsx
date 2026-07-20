"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Container } from "@/components/ui/Container";
import { apiRequest } from "@/lib/api";

interface SnapshotItem {
  _id: string;
  originalFileName: string;
  uploadStatus: string;
  predictionStatus: string;
  detectedMinerals?: string[];
  confidenceScore?: number;
  createdAt: string;
}

function titleCase(value?: string) {
  if (!value) {
    return "Pending";
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

function LoadingBlock() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-center text-sm text-zinc-400">
      <div className="garud-loading-line mx-auto mb-3 h-1 w-24 rounded-full bg-white/10" />
      Loading snapshots.
    </div>
  );
}

function EmptyBlock() {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.025] p-8 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold text-[color:var(--primary)]">
        G
      </span>
      <h3 className="mt-4 text-sm font-semibold text-zinc-100">No snapshots yet</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500">
        Uploaded mineral image snapshots will appear here after analysis requests.
      </p>
    </div>
  );
}

export default function SnapshotsPage() {
  const [snapshots, setSnapshots] = useState<SnapshotItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSnapshots() {
      try {
        const response = await apiRequest<SnapshotItem[]>("/history");
        if (isMounted) {
          setSnapshots((response.data ?? []).slice(0, 10));
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load snapshots");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSnapshots();

    return () => {
      isMounted = false;
    };
  }, []);

  const latestSnapshots = useMemo(() => snapshots.slice(0, 10), [snapshots]);

  return (
    <AuthGuard allowedRoles={["customer"]}>
      <SidebarLayout>
        <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-50 sm:px-6 lg:px-8">
          <Container>
            <Breadcrumbs items={[{ href: "/dashboard", label: "Dashboard" }, { label: "Snapshots" }]} />

            <div className="mx-auto mt-6 max-w-7xl">
              <section className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(124,140,255,0.14),rgba(255,255,255,0.04)_42%,rgba(56,215,191,0.08))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--secondary)]">
                  Snapshot Gallery
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Mineral Image Snapshots
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                  Browse the latest uploaded mineral image records separately from analysis history.
                </p>
              </section>

              <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Latest Snapshots</h2>
                    <p className="mt-2 text-sm text-zinc-500">Existing upload snapshot data, limited to the latest 10 records.</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
                    {latestSnapshots.length} items
                  </span>
                </div>

                <div className="mt-6">
                  {isLoading ? (
                    <LoadingBlock />
                  ) : error ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">{error}</div>
                  ) : latestSnapshots.length === 0 ? (
                    <EmptyBlock />
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                      {latestSnapshots.map((snapshot) => (
                        <article
                          key={snapshot._id}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 transition hover:-translate-y-0.5 hover:border-[color:var(--primary)]/35"
                        >
                          <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(124,140,255,0.22),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))]">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-300">
                              Snapshot
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="truncate text-sm font-semibold text-white" title={snapshot.originalFileName}>
                              {snapshot.originalFileName}
                            </h3>
                            <p className="mt-2 text-xs text-zinc-500">{formatDate(snapshot.createdAt)}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-300">
                                {titleCase(snapshot.uploadStatus)}
                              </span>
                              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-200">
                                {titleCase(snapshot.predictionStatus)}
                              </span>
                            </div>
                            {snapshot.detectedMinerals?.length ? (
                              <p className="mt-4 text-xs leading-5 text-zinc-500">
                                {snapshot.detectedMinerals.slice(0, 3).join(", ")}
                              </p>
                            ) : null}
                          </div>
                        </article>
                      ))}
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
