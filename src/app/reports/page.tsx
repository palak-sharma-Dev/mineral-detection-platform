import { Container } from "@/components/ui/Container";

const availableReports = [
  { id: "RPT-001", name: "Mineral Analysis Report A", status: "Ready" },
  { id: "RPT-002", name: "Mineral Analysis Report B", status: "Pending" },
  { id: "RPT-003", name: "Mineral Analysis Report C", status: "Ready" },
];

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] px-4 py-8 sm:px-6 lg:px-8">
      <Container>
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">Reports</h1>
            <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-secondary)]">
              Access generated analysis reports.
            </p>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Available Reports</h2>
            <div className="mt-5 overflow-hidden rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12">
              <table className="min-w-full divide-y divide-[color:var(--foreground-muted)]/12 text-left text-sm">
                <thead className="bg-[color:var(--background)]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">ID</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Report</th>
                    <th className="px-4 py-3 font-medium text-[color:var(--foreground-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--foreground-muted)]/12 bg-[color:var(--card)]">
                  {availableReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-4 py-3 text-[color:var(--foreground)]">{report.id}</td>
                      <td className="px-4 py-3 text-[color:var(--foreground)]">{report.name}</td>
                      <td className="px-4 py-3 text-[color:var(--foreground-secondary)]">{report.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Report Status</h2>
            <div className="mt-4 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-6 text-sm text-[color:var(--foreground-secondary)]">
              Placeholder status panel for generated reports.
            </div>
          </section>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Download Report</h2>
            <div className="mt-4 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-6 text-sm text-[color:var(--foreground-secondary)]">
              Placeholder download area for reports.
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
