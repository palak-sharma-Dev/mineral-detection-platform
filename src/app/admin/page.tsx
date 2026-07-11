import Link from "next/link";
import { Container } from "@/components/ui/Container";

const users = [
  { id: 1, name: "Asha Rao", status: "Active" },
  { id: 2, name: "Nikhil Menon", status: "Inactive" },
  { id: 3, name: "Ravi Sharma", status: "Active" },
];

const payments = [
  { id: "PAY-001", user: "Asha Rao", status: "Paid" },
  { id: "PAY-002", user: "Nikhil Menon", status: "Pending" },
  { id: "PAY-003", user: "Ravi Sharma", status: "Paid" },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] px-4 py-8 sm:px-6 lg:px-8">
      <Container>
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">Admin Dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-secondary)]">
              Placeholder administrative overview for user and payment management.
            </p>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Active Users</h2>
              <div className="mt-5 space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[color:var(--foreground)]">{user.name}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                        User #{user.id}
                      </p>
                    </div>
                    <span className="text-sm text-[color:var(--foreground-secondary)]">{user.status}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Payment Status</h2>
              <div className="mt-5 space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[color:var(--foreground)]">{payment.user}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                        {payment.id}
                      </p>
                    </div>
                    <span className="text-sm text-[color:var(--foreground-secondary)]">{payment.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">User Management</h2>
            <div className="mt-5 space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-3 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--background)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-[color:var(--foreground)]">{user.name}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                      Status: {user.status}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/admin"
                      className="rounded-[0.5rem] border border-[color:var(--primary)] bg-[color:var(--primary)] px-3 py-2 text-sm font-semibold text-white"
                    >
                      Activate User
                    </Link>
                    <Link
                      href="/admin"
                      className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground)]"
                    >
                      Deactivate User
                    </Link>
                    <Link
                      href="/admin"
                      className="rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground)]"
                    >
                      Remove User
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
