"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const stats = [
  { value: "98%", label: "Detection Support" },
  { value: "Satellite", label: "Intelligence" },
  { value: "Human", label: "Validated" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--background)] px-0 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="max-w-[560px]">
            <p className="inline-flex items-center gap-2 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/18 bg-[color:var(--card)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--foreground-secondary)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--primary)]" />
              Satellite Intelligence • AI Assisted Mineral Detection
            </p>

            <h1 className="mt-8 text-[2.55rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[color:var(--foreground)] sm:text-[3.2rem] lg:text-[3.8rem]">
              Accelerate Mineral Exploration
              <span className="mt-3 block text-[color:var(--foreground-secondary)]">
                with Intelligent Geospatial Analysis
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-[1rem] leading-8 text-[color:var(--foreground-secondary)] sm:text-[1.03rem]">
              Garud AI combines satellite imagery, computer vision and structured expert review to support faster, more consistent mineral identification workflows.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/analysis"
                className="inline-flex h-11 min-w-[168px] items-center justify-center rounded-[0.5rem] border border-[color:var(--primary)] bg-[color:var(--primary)] px-5 text-sm font-semibold text-white transition hover:bg-[color:var(--primary)]/90"
              >
                Start Analysis
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-11 min-w-[168px] items-center justify-center rounded-[0.5rem] border border-[color:var(--foreground-muted)]/20 bg-[color:var(--card)] px-5 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)]"
              >
                Open Dashboard
              </Link>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex h-full min-h-[108px] flex-col justify-center rounded-[0.625rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-4"
                >
                  <p className="text-[1.35rem] font-semibold leading-none text-[color:var(--foreground)]">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[color:var(--foreground-secondary)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[620px] lg:ml-auto">
            <div className="overflow-hidden rounded-[0.875rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-4 sm:p-5 lg:p-6">
              <div className="border-b border-[color:var(--foreground-muted)]/12 pb-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--foreground-secondary)]">
                      Mineral Detection Analysis
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">Operational Review</p>
                  </div>
                  <div className="rounded-[0.5rem] border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Stable
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[0.625rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--foreground-secondary)]">
                        Prediction Confidence
                      </p>
                      <p className="mt-2 text-4xl font-semibold text-[color:var(--foreground)]">94.8%</p>
                    </div>
                    <div className="rounded-[0.5rem] bg-[color:var(--primary)] px-3 py-1 text-xs font-semibold text-white">
                      Verified
                    </div>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-white">
                    <div className="h-full w-[94%] rounded-full bg-[color:var(--primary)]" />
                  </div>

                  <div className="mt-5 rounded-[0.625rem] border border-[color:var(--foreground-muted)]/12 bg-white p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--surface-muted)]">
                      <div className="absolute inset-0 bg-[image:linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:16px_16px]" />
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:16px_16px]" />
                      <div className="absolute left-5 top-7 h-3 w-3 rounded-full bg-[color:var(--primary)]" />
                      <div className="absolute left-16 top-16 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" />
                      <div className="absolute bottom-8 right-7 h-3 w-3 rounded-full bg-[color:var(--secondary)]" />
                      <div className="absolute bottom-6 left-10 h-16 w-24 rounded-full border border-[color:var(--foreground-muted)]/18 bg-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-[0.625rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--surface-muted)] p-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--foreground-secondary)]">
                      Detected Minerals
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-[color:var(--foreground)]">
                      <li className="flex items-center justify-between border-b border-[color:var(--foreground-muted)]/12 pb-2">
                        <span>Pyrite</span>
                        <span className="text-[color:var(--foreground-secondary)]">High</span>
                      </li>
                      <li className="flex items-center justify-between border-b border-[color:var(--foreground-muted)]/12 pb-2">
                        <span>Chalcopyrite</span>
                        <span className="text-[color:var(--foreground-secondary)]">Medium</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Quartz</span>
                        <span className="text-[color:var(--foreground-secondary)]">Low</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-[0.625rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--surface-muted)] p-4">
                    <div className="flex items-center justify-between text-sm text-[color:var(--foreground-secondary)]">
                      <span>Review Progress</span>
                      <span>72%</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white">
                      <div className="h-full w-[72%] rounded-full bg-[color:var(--primary)]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[0.625rem] border border-[color:var(--foreground-muted)]/12 bg-white p-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                    Spectral Match
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">91.2</p>
                </div>
                <div className="rounded-[0.625rem] border border-[color:var(--foreground-muted)]/12 bg-white p-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                    Coverage
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">84 km²</p>
                </div>
                <div className="rounded-[0.625rem] border border-[color:var(--foreground-muted)]/12 bg-white p-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                    Experts In Loop
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
