"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";

const stats = [
  { value: "98%", label: "Detection Support" },
  { value: "Satellite", label: "Intelligence" },
  { value: "Human", label: "Validated" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden px-0 pb-20 pt-18 sm:pb-24 sm:pt-24 lg:pb-32 lg:pt-28">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),transparent_28%,transparent_70%,rgba(255,255,255,0.025))]" />
      <div className="absolute left-1/2 top-0 -z-10 h-px w-[82rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="max-w-[650px]">
            <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--secondary)] shadow-[0_0_24px_rgba(56,215,191,0.7)]" />
              Satellite Intelligence | AI Assisted Mineral Detection
            </p>

            <h1 className="mt-8 text-[2.85rem] font-semibold leading-[0.98] text-[color:var(--foreground)] sm:text-[4.1rem] lg:text-[5.05rem]">
              Accelerate Mineral Exploration
              <span className="mt-4 block bg-gradient-to-r from-[color:var(--foreground-secondary)] via-white to-[color:var(--secondary)] bg-clip-text text-transparent">
                with Intelligent Geospatial Analysis
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-[1.04rem] leading-8 text-[color:var(--foreground-secondary)] sm:text-[1.12rem]">
              Garud AI combines satellite imagery, computer vision and structured expert review to support faster, more consistent mineral identification workflows.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/analysis"
                className="inline-flex h-12 min-w-[176px] items-center justify-center rounded-full border border-[color:var(--primary)] bg-[color:var(--primary)] px-6 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(124,140,255,0.28)] transition hover:-translate-y-0.5 hover:bg-[color:var(--primary)]/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
              >
                Start Analysis
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 min-w-[176px] items-center justify-center rounded-full border border-white/12 bg-white/[0.055] px-6 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/[0.085] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
              >
                Open Dashboard
              </Link>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex h-full min-h-[116px] flex-col justify-center rounded-[0.875rem] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                >
                  <p className="text-[1.45rem] font-semibold leading-none text-[color:var(--foreground)]">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[color:var(--foreground-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[620px] lg:ml-auto">
            <div className="relative overflow-hidden rounded-[1.35rem] border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.095),rgba(255,255,255,0.035))] p-4 shadow-[var(--shadow-elevated)] backdrop-blur sm:p-5 lg:p-6">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-muted)]">
                      Mineral Detection Analysis
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">Operational Review</p>
                  </div>
                  <div className="rounded-full border border-[color:var(--secondary)]/25 bg-[color:var(--secondary)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--secondary)]">
                    Stable
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1rem] border border-white/10 bg-[color:var(--surface-strong)]/88 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-muted)]">
                        Prediction Confidence
                      </p>
                      <p className="mt-2 text-4xl font-semibold text-[color:var(--foreground)]">94.8%</p>
                    </div>
                    <div className="rounded-full bg-[color:var(--primary)]/16 px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
                      Verified
                    </div>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-white/8">
                    <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--secondary)]" />
                  </div>

                  <div className="mt-5 rounded-[0.875rem] border border-white/10 bg-white/[0.04] p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[0.7rem] border border-white/10 bg-[color:var(--background)]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_28%,rgba(124,140,255,0.36),transparent_18%),radial-gradient(circle_at_76%_70%,rgba(56,215,191,0.28),transparent_16%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_46%)]" />
                      <div className="absolute inset-0 bg-[image:linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:18px_18px]" />
                      <div className="absolute left-5 top-7 h-3 w-3 rounded-full bg-[color:var(--primary)] shadow-[0_0_22px_rgba(124,140,255,0.8)]" />
                      <div className="absolute left-16 top-16 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_22px_rgba(244,184,106,0.72)]" />
                      <div className="absolute bottom-8 right-7 h-3 w-3 rounded-full bg-[color:var(--secondary)] shadow-[0_0_22px_rgba(56,215,191,0.72)]" />
                      <div className="absolute bottom-6 left-10 h-16 w-24 rounded-full border border-white/18 bg-white/8 backdrop-blur-sm" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-[1rem] border border-white/10 bg-[color:var(--surface-strong)]/72 p-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-muted)]">
                      Detected Minerals
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-[color:var(--foreground)]">
                      <li className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span>Pyrite</span>
                        <span className="text-[color:var(--secondary)]">High</span>
                      </li>
                      <li className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span>Chalcopyrite</span>
                        <span className="text-[color:var(--foreground-secondary)]">Medium</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Quartz</span>
                        <span className="text-[color:var(--foreground-secondary)]">Low</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-[1rem] border border-white/10 bg-[color:var(--surface-strong)]/72 p-4">
                    <div className="flex items-center justify-between text-sm text-[color:var(--foreground-secondary)]">
                      <span>Review Progress</span>
                      <span>72%</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/8">
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--secondary)]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["Spectral Match", "91.2"],
                  ["Coverage", "84 km2"],
                  ["Experts In Loop", "3"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[0.875rem] border border-white/10 bg-white/[0.045] p-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
