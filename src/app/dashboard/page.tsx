import Link from "next/link";

const recentAnalyses = [
  { id: "RA-102", name: "Sample A", status: "Pending Review" },
  { id: "RA-101", name: "Sample B", status: "Completed" },
];

const recentUploads = [
  { id: "UP-010", name: "Image-10.tif", status: "Uploaded" },
  { id: "UP-009", name: "Image-09.tif", status: "Uploaded" },
  { id: "UP-008", name: "Image-08.tif", status: "Uploaded" },
  { id: "UP-007", name: "Image-07.tif", status: "Uploaded" },
  { id: "UP-006", name: "Image-06.tif", status: "Uploaded" },
  { id: "UP-005", name: "Image-05.tif", status: "Uploaded" },
  { id: "UP-004", name: "Image-04.tif", status: "Uploaded" },
  { id: "UP-003", name: "Image-03.tif", status: "Uploaded" },
  { id: "UP-002", name: "Image-02.tif", status: "Uploaded" },
  { id: "UP-001", name: "Image-01.tif", status: "Uploaded" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
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
              <p className="text-lg font-semibold text-[color:var(--foreground)]">User</p>
            </div>
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
              {recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[color:var(--foreground)]">{analysis.name}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">{analysis.id}</p>
                  </div>
                  <span className="text-sm text-[color:var(--foreground-secondary)]">{analysis.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Last 10 Uploads</h2>
            <div className="mt-5 overflow-hidden rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12">
              <table className="min-w-full divide-y divide-[color:var(--foreground-muted)]/12 text-left text-sm">
                <thead className="bg-[color:var(--background)]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Upload</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--foreground-muted)]/12 bg-[color:var(--card)]">
                  {recentUploads.map((upload) => (
                    <tr key={upload.id}>
                      <td className="px-4 py-3 text-[color:var(--foreground)]">{upload.name}</td>
                      <td className="px-4 py-3 text-[color:var(--foreground-secondary)]">{upload.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Reports</h2>
            <div className="mt-5 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-8 text-center text-sm text-[color:var(--foreground-secondary)]">
              No reports available yet.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
