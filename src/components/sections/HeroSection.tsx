"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const stats = [
  { label: "98% Detection Accuracy", tone: "bg-[color:var(--primary)]/10" },
  { label: "Satellite Intelligence", tone: "bg-[color:var(--secondary)]/10" },
  { label: "AI Powered Analytics", tone: "bg-[color:var(--accent)]/10" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--background)] py-24 sm:py-28">
      <Container>
        <div className="rounded-[2rem] border border-[color:var(--foreground-muted)]/10 bg-[color:var(--card)] shadow-[var(--shadow-elevated)]">
          <div className="grid gap-12 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--foreground-secondary)]">
                Next Generation AI Platform
              </p>
              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[color:var(--foreground-muted)]/15 bg-[color:var(--background)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground-secondary)] shadow-[var(--shadow-card)]">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" />
                AI Powered Mineral Intelligence
              </div>

              <h1 className="mt-10 text-5xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-6xl">
                Transform Satellite Data into
                <span className="block text-[color:var(--primary)]">Mineral Intelligence</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[color:var(--foreground-secondary)]">
                Convert geological satellite imagery into precise mineral analytics, survey-grade mapping, and field-ready intelligence for exploration teams.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button className="min-w-[160px]">Get Started →</Button>
                <Button variant="secondary" className="min-w-[160px]">
                  Watch Demo ▶
                </Button>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`flex items-center gap-3 rounded-[1.75rem] border border-[color:var(--foreground-muted)]/10 ${stat.tone} px-4 py-4 shadow-[var(--shadow-card)]`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" />
                    </div>
                    <p className="text-sm font-medium text-[color:var(--foreground)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto max-w-[560px]">
              <div className="absolute inset-0 rounded-[2rem] bg-[color:var(--background)]/80" />
              <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--foreground-muted)]/10 bg-[color:var(--background)] p-6 shadow-[var(--shadow-card)] sm:p-8">
                <div className="absolute inset-x-6 top-6 h-px bg-[color:var(--foreground-muted)]/10" />
                <div className="relative grid gap-5">
                  <div className="rounded-[1.75rem] border border-[color:var(--foreground-muted)]/10 bg-[color:var(--card)] p-5 shadow-[var(--shadow-card)]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--foreground-secondary)]">
                          Survey Area
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">West Basin</p>
                      </div>
                      <div className="rounded-full border border-[color:var(--foreground-muted)]/15 bg-[color:var(--background)] px-3 py-1 text-xs font-semibold text-[color:var(--foreground-secondary)]">
                        Live
                      </div>
                    </div>
                    <div className="mt-6 rounded-[1.5rem] bg-[color:var(--background)] p-3 shadow-inner shadow-[color:rgba(15,26,43,0.03)]">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-[color:var(--foreground-muted)]/10 bg-[color:var(--secondary)]/5">
                        <div className="absolute inset-0 bg-[image:linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
                        <div className="absolute left-6 top-12 h-4 w-4 rounded-full bg-[color:var(--primary)] shadow-[0_0_0_5px_rgba(28,74,122,0.05)] pulse-dot" />
                        <div className="absolute left-20 top-20 h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                        <div className="absolute right-10 bottom-12 h-3 w-3 rounded-full bg-[color:var(--secondary)]" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.75rem] border border-[color:var(--foreground-muted)]/10 bg-[color:var(--card)] p-4 shadow-[var(--shadow-card)]">
                      <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--foreground-secondary)]">Mineral Density</p>
                      <p className="mt-3 text-3xl font-semibold text-[color:var(--foreground)]">72%</p>
                      <p className="mt-2 text-sm text-[color:var(--foreground-secondary)]">Consistent with satellite analysis.</p>
                    </div>
                    <div className="rounded-[1.75rem] border border-[color:var(--foreground-muted)]/10 bg-[color:var(--card)] p-4 shadow-[var(--shadow-card)]">
                      <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--foreground-secondary)]">Scan Confidence</p>
                      <p className="mt-3 text-3xl font-semibold text-[color:var(--foreground)]">98%</p>
                      <p className="mt-2 text-sm text-[color:var(--foreground-secondary)]">Field-ready detection score.</p>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-[color:var(--foreground-muted)]/10 bg-[color:var(--card)] p-5 shadow-[var(--shadow-card)]">
                    <div className="flex items-center justify-between gap-4 text-sm text-[color:var(--foreground-secondary)]">
                      <span>Survey Depth</span>
                      <span>3.2 km</span>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-[color:var(--background)]">
                      <div className="h-full rounded-full bg-[color:var(--primary)]" style={{ width: "64%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .pulse-dot {
          animation: pulse 3.4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.18);
            opacity: 0.5;
          }
        }
      `}</style>
    </section>
  );
}
