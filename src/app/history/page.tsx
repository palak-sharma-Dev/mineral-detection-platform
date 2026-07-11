import { Container } from "@/components/ui/Container";

const previousAnalyses = [
  { id: "AN-001", name: "Sample A", status: "Completed" },
  { id: "AN-002", name: "Sample B", status: "Pending Review" },
  { id: "AN-003", name: "Sample C", status: "Completed" },
];

const recentUploads = [
  { id: "UP-001", name: "Image-01.tif", status: "Uploaded" },
  { id: "UP-002", name: "Image-02.tif", status: "Uploaded" },
  { id: "UP-003", name: "Image-03.tif", status: "Uploaded" },
  { id: "UP-004", name: "Image-04.tif", status: "Uploaded" },
  { id: "UP-005", name: "Image-05.tif", status: "Uploaded" },
  { id: "UP-006", name: "Image-06.tif", status: "Uploaded" },
  { id: "UP-007", name: "Image-07.tif", status: "Uploaded" },
  { id: "UP-008", name: "Image-08.tif", status: "Uploaded" },
  { id: "UP-009", name: "Image-09.tif", status: "Uploaded" },
  { id: "UP-010", name: "Image-10.tif", status: "Uploaded" },
];

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] px-4 py-8 sm:px-6 lg:px-8">
      <Container>
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">History</h1>
            <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-secondary)]">
              Review previous analyses and uploaded files.
            </p>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Previous Analyses</h2>
            <div className="mt-5 overflow-hidden rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12">
              <table className="min-w-full divide-y divide-[color:var(--foreground-muted)]/12 text-left text-sm">
                <thead className="bg-[color:var(--background)]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">ID</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Analysis</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--foreground-muted)]/12 bg-[color:var(--card)]">
                  {previousAnalyses.map((analysis) => (
                    <tr key={analysis.id}>
                      <td className="px-4 py-3 text-[color:var(--foreground)]">{analysis.id}</td>
                      <td className="px-4 py-3 text-[color:var(--foreground)]">{analysis.name}</td>
                      <td className="px-4 py-3 text-[color:var(--foreground-secondary)]">{analysis.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Last 10 Uploads</h2>
            <div className="mt-5 space-y-3">
              {recentUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[color:var(--foreground)]">{upload.name}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                      {upload.id}
                    </p>
                  </div>
                  <span className="text-sm text-[color:var(--foreground-secondary)]">{upload.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Download Reports</h2>
            <div className="mt-4 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-6 text-sm text-[color:var(--foreground-secondary)]">
              Placeholder report download section.
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
