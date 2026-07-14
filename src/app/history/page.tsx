"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { apiRequest } from "@/lib/api";

interface UploadHistoryItem {
  _id: string;
  originalFileName: string;
  uploadStatus: string;
  predictionStatus: string;
  createdAt: string;
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
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

export default function HistoryPage() {
  const [history, setHistory] = useState<UploadHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        const response = await apiRequest<UploadHistoryItem[]>("/history");
        if (isMounted) {
          setHistory(response.data ?? []);
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

  return (
    <AuthGuard allowedRoles={["customer"]}>
      <main className="min-h-screen bg-[color:var(--background)] px-4 py-8 sm:px-6 lg:px-8">
      <Container>
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/dashboard", label: "Dashboard" }, { label: "History" }]} />
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">History</h1>
            <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-secondary)]">
              Review previous analyses and uploaded files.
            </p>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Previous Analyses</h2>
            <div className="mt-5 overflow-x-auto overflow-hidden rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12">
              <table className="min-w-full divide-y divide-[color:var(--foreground-muted)]/12 text-left text-sm">
                <thead className="bg-[color:var(--background)]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">ID</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Analysis</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Status</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Uploaded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--foreground-muted)]/12 bg-[color:var(--card)]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[color:var(--foreground-secondary)]"><LoadingState label="Loading analyses." /></td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[color:var(--error)]">{error}</td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[color:var(--foreground-secondary)]"><EmptyState label="No analyses available yet." /></td>
                    </tr>
                  ) : history.map((analysis) => (
                    <tr key={analysis._id}>
                      <td className="px-4 py-3 text-[color:var(--foreground)]">{analysis._id}</td>
                      <td className="px-4 py-3 text-[color:var(--foreground)]">{analysis.originalFileName}</td>
                      <td className="px-4 py-3 text-[color:var(--foreground-secondary)]">{titleCase(analysis.predictionStatus || analysis.uploadStatus)}</td>
                      <td className="px-4 py-3 text-[color:var(--foreground-secondary)]">{formatDate(analysis.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Last 10 Uploads</h2>
            <div className="mt-5 space-y-3">
              {isLoading ? (
                <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
                  <LoadingState label="Loading uploads." />
                </div>
              ) : error ? (
                <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--error)]">
                  {error}
                </div>
              ) : history.length === 0 ? (
                <div className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
                  <EmptyState label="No uploads available yet." />
                </div>
              ) : history.map((upload) => (
                <div
                  key={upload._id}
                  className="flex items-center justify-between rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[color:var(--foreground)]">{upload.originalFileName}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                      {upload._id}
                    </p>
                  </div>
                  <span className="text-sm text-[color:var(--foreground-secondary)]">{titleCase(upload.uploadStatus)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Download Reports</h2>
            <div className="mt-4 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-6 text-sm text-[color:var(--foreground-secondary)]">
              {isLoading ? "Loading report history." : error ? error : history.length === 0 ? "No report history available yet." : "Reports are available from the Reports page."}
            </div>
          </section>
        </div>
      </Container>
      </main>
    </AuthGuard>
  );
}
