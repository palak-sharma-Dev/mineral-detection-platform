"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Container } from "@/components/ui/Container";
import { apiRequest, downloadApiFile, WORKFLOW_UPDATED_EVENT } from "@/lib/api";

interface ReportItem {
  _id: string;
  reportStatus: string;
  generatedAt: string;
  prediction?: unknown;
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

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadReports = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const response = await apiRequest<ReportItem[]>("/reports?limit=10");
      setReports(response.data ?? []);
      setSelectedReport(response.data?.[0] ?? null);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load reports");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports(true);

    const handleWorkflowUpdate = () => {
      void loadReports();
    };

    window.addEventListener(WORKFLOW_UPDATED_EVENT, handleWorkflowUpdate);

    return () => {
      window.removeEventListener(WORKFLOW_UPDATED_EVENT, handleWorkflowUpdate);
    };
  }, [loadReports]);

  const handleDownload = async (reportId: string) => {
    setDownloadError(null);
    setIsDownloading(reportId);

    try {
      await downloadApiFile(`/reports/${reportId}/download`, `report-${reportId}.json`);
    } catch (downloadFailure) {
      setDownloadError(downloadFailure instanceof Error ? downloadFailure.message : "Unable to download report");
    } finally {
      setIsDownloading(null);
    }
  };

  const handleSelectReport = async (reportId: string) => {
    setDetailError(null);
    setIsDetailLoading(true);

    try {
      const response = await apiRequest<ReportItem>(`/reports/${reportId}`);
      setSelectedReport(response.data ?? null);
    } catch (reportError) {
      setDetailError(reportError instanceof Error ? reportError.message : "Unable to load report details");
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={["customer"]}>
      <SidebarLayout>
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <Container>
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/dashboard", label: "Dashboard" }, { label: "Reports" }]} />
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">Reports</h1>
            <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-secondary)]">
              Access generated analysis reports.
            </p>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Available Reports</h2>
            <div className="mt-5 overflow-x-auto overflow-hidden rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12">
              <table className="min-w-full divide-y divide-[color:var(--foreground-muted)]/12 text-left text-sm">
                <thead className="bg-[color:var(--background)]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">ID</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Report</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Status</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--foreground-muted)]/12 bg-[color:var(--card)]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[color:var(--foreground-secondary)]"><LoadingState label="Loading reports." /></td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[color:var(--error)]">{error}</td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[color:var(--foreground-secondary)]"><EmptyState label="No reports available yet." /></td>
                    </tr>
                  ) : reports.map((report) => (
                    <tr key={report._id}>
                      <td className="px-4 py-3 text-[color:var(--foreground)]">{report._id}</td>
                      <td className="px-4 py-3 text-[color:var(--foreground)]">Mineral Analysis Report</td>
                      <td className="px-4 py-3 text-[color:var(--foreground-secondary)]">{titleCase(report.reportStatus)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => void handleSelectReport(report._id)}
                          className="text-sm font-semibold text-[color:var(--primary)]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Report Details</h2>
            <div className="mt-4 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-6 text-sm text-[color:var(--foreground-secondary)]">
              {isDetailLoading ? (
                <LoadingState label="Loading report details." />
              ) : detailError ? (
                detailError
              ) : selectedReport ? (
                <div className="space-y-3">
                  <p className="text-[color:var(--foreground)]">{selectedReport._id}</p>
                  <p>Status: {titleCase(selectedReport.reportStatus)}</p>
                  <p>Generated: {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(selectedReport.generatedAt))}</p>
                  {selectedReport.prediction ? (
                    <pre className="overflow-x-auto rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--card)] px-4 py-4 text-xs text-[color:var(--foreground)]">
                      {JSON.stringify(selectedReport.prediction, null, 2)}
                    </pre>
                  ) : null}
                </div>
              ) : isLoading ? (
                "Loading report details."
              ) : (
                <EmptyState label="No report selected." />
              )}
            </div>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Download Report</h2>
            <div className="mt-4 space-y-3 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-6 text-sm text-[color:var(--foreground-secondary)]">
              {isLoading ? (
                "Loading downloads."
              ) : error ? (
                error
              ) : reports.length === 0 ? (
                "No reports available to download yet."
              ) : (
                reports.map((report) => (
                  <div key={report._id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[color:var(--foreground)]">{report._id}</span>
                    <button
                      type="button"
                      onClick={() => void handleDownload(report._id)}
                      disabled={isDownloading === report._id}
                      className="rounded-[0.5rem] border border-[color:var(--primary)] bg-[color:var(--primary)] px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isDownloading === report._id ? "Downloading" : "Download"}
                    </button>
                  </div>
                ))
              )}
              {downloadError ? <p className="text-[color:var(--error)]">{downloadError}</p> : null}
            </div>
          </section>
        </div>
          </Container>
        </div>
      </SidebarLayout>
    </AuthGuard>
  );
}
