import { Container } from "@/components/ui/Container";

const principles = [
  "Human oversight remains essential.",
  "Interpretability improves adoption.",
  "Operational workflows guide design choices.",
  "Consistency matters as much as speed.",
];

export function EngineeringPrinciplesSection() {
  return (
    <section className="px-0 py-18 sm:py-22 lg:py-28">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl sm:mb-12 lg:mb-14">
            <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--secondary)]">
              Governance
            </p>
            <h2 className="text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl lg:text-[2.65rem]">
              Engineering Principles
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((principle, index) => (
              <div
                key={principle}
                className="rounded-[1rem] border border-white/10 bg-white/[0.045] p-6 shadow-[var(--shadow-card)]"
              >
                <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-semibold text-[color:var(--secondary)]">
                  0{index + 1}
                </div>
                  <p className="text-[1rem] leading-8 text-[color:var(--foreground-secondary)] sm:text-[1.03rem]">
                    {principle}
                  </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
