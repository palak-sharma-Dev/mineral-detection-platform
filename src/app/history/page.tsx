"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Container } from "@/components/ui/Container";
import { apiRequest } from "@/lib/api";

interface UploadHistoryItem {
  _id: string;
  originalFileName: string;
  uploadStatus: string;
  predictionStatus: string;
  prediction?: unknown;
  predictionError?: string;
  confidenceScore?: number;
  detectedMinerals?: string[];
  createdAt: string;
  updatedAt?: string;
}

function titleCase(value?: string) {
  if (!value) {
    return "Pending AI Analysis";
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

function getAnalysisStatus(upload: UploadHistoryItem) {
  if (upload.predictionStatus === "completed") {
    return "AI Analysis Completed";
  }

  if (upload.predictionStatus === "failed") {
    return "AI Analysis Failed";
  }

  return "Pending AI Analysis";
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

export default function HistoryPage() {
  const [history, setHistory] = useState<UploadHistoryItem[]>([]);
  const [selectedUpload, setSelectedUpload] = useState<UploadHistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDetailsId, setActiveDetailsId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        const response = await apiRequest<UploadHistoryItem[]>("/history");
        if (isMounted) {
          setHistory((response.data ?? []).slice(0, 10));
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load history");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return history.filter((upload) => {
      const matchesSearch = !query || upload.originalFileName.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || upload.predictionStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [history, searchQuery, statusFilter]);

  const handleViewDetails = async (upload: UploadHistoryItem) => {
    setDetailsError(null);
    setActiveDetailsId(upload._id);

    try {
      const response = await apiRequest<UploadHistoryItem>(`/history/${upload._id}`);
      setSelectedUpload(response.data ?? upload);
    } catch (detailsLoadError) {
      setSelectedUpload(upload);
      setDetailsError(detailsLoadError instanceof Error ? detailsLoadError.message : "Unable to load upload details");
    } finally {
      setActiveDetailsId(null);
    }
  };

  return (
    <AuthGuard allowedRoles={["customer"]}>
      <SidebarLayout>
        <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-50 sm:px-6 lg:px-8">
          <Container>
            <Breadcrumbs items={[{ href: "/dashboard", label: "Dashboard" }, { label: "History" }]} />

            <div className="mx-auto mt-6 max-w-7xl">
              <section className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(124,140,255,0.14),rgba(255,255,255,0.04)_42%,rgba(56,215,191,0.08))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--secondary)]">
                  Analysis History
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Latest Uploaded Analyses
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                  Review the latest 10 uploaded mineral images, processing state and AI analysis readiness.
                </p>
              </section>

              <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">Analysis History</h2>
                      <p className="mt-2 text-sm text-zinc-500">Search and filter the latest analysis records.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,16rem)_12rem]">
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search file name"
                        className="rounded-[0.5rem] border border-white/10 bg-zinc-950/70 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[color:var(--primary)]"
                      />
                      <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="rounded-[0.5rem] border border-white/10 bg-zinc-950/70 px-4 py-2.5 text-sm text-white outline-none transition focus:border-[color:var(--primary)]"
                      >
                        <option value="all">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="running">Running</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    {isLoading ? (
                      <LoadingBlock label="Loading analysis history." />
                    ) : error ? (
                      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">{error}</div>
                    ) : filteredHistory.length === 0 ? (
                      <EmptyBlock title="No analyses found" description="Adjust search or filters to review matching analysis records." />
                    ) : (
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70">
                        <div className="grid grid-cols-[1.4fr_0.75fr_0.75fr_0.6fr] gap-4 border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                          <span>File</span>
                          <span>Uploaded</span>
                          <span>Status</span>
                          <span className="text-right">Details</span>
                        </div>
                        {filteredHistory.map((upload) => (
                          <div
                            key={upload._id}
                            className="grid grid-cols-1 gap-3 border-b border-white/5 px-4 py-4 last:border-b-0 md:grid-cols-[1.4fr_0.75fr_0.75fr_0.6fr] md:items-center"
                          >
                            <div>
                              <p className="break-words text-sm font-semibold text-white">{upload.originalFileName}</p>
                              <p className="mt-1 text-xs text-zinc-500">{titleCase(upload.uploadStatus)}</p>
                            </div>
                            <p className="text-sm text-zinc-400">{formatDate(upload.createdAt)}</p>
                            <span className="w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-200">
                              {getAnalysisStatus(upload)}
                            </span>
                            <button
                              type="button"
                              onClick={() => void handleViewDetails(upload)}
                              disabled={activeDetailsId !== null}
                              className="rounded-[0.5rem] border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-[color:var(--primary)]/45 hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-60 md:justify-self-end"
                            >
                              {activeDetailsId === upload._id ? "Loading" : "View"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                  <h2 className="text-xl font-semibold text-white">Details</h2>
                  <p className="mt-2 text-sm text-zinc-500">Select an upload to inspect its current processing state.</p>

                  {detailsError ? (
                    <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">{detailsError}</div>
                  ) : null}

                  {selectedUpload ? (
                    <div className="mt-5 space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">File Name</p>
                        <p className="mt-2 break-words text-sm font-semibold text-white">{selectedUpload.originalFileName}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Uploaded</p>
                          <p className="mt-2 text-sm text-zinc-200">{formatDate(selectedUpload.createdAt)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Current Status</p>
                          <p className="mt-2 text-sm text-zinc-200">{getAnalysisStatus(selectedUpload)}</p>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Prediction Data</p>
                        {selectedUpload.predictionStatus === "completed" && selectedUpload.prediction ? (
                          <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-black/30 p-3 text-xs leading-6 text-zinc-300">
                            {JSON.stringify(selectedUpload.prediction, null, 2)}
                          </pre>
                        ) : (
                          <p className="mt-3 text-sm leading-6 text-amber-100">Pending AI Analysis</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <EmptyBlock title="No upload selected" description="Use View Details on any history item to see status and prediction availability." />
                  )}
                </section>
            </div>
          </Container>
        </div>
      </SidebarLayout>
    </AuthGuard>
  );
}
