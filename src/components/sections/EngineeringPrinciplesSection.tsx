import { Container } from "@/components/ui/Container";

const principles = [
  "Human oversight remains essential.",
  "Interpretability improves adoption.",
  "Operational workflows guide design choices.",
  "Consistency matters as much as speed.",
];

export function EngineeringPrinciplesSection() {
  return (
    <section className="bg-[color:var(--background)] px-0 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 sm:mb-12 lg:mb-14">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[color:var(--foreground)] sm:text-4xl lg:text-[2.55rem]">
              Engineering Principles
            </h2>
          </div>

          <div className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)]">
            <div className="divide-y divide-[color:var(--foreground-muted)]/12">
              {principles.map((principle) => (
                <div key={principle} className="px-6 py-5 sm:px-8 sm:py-6">
                  <p className="text-[1rem] leading-8 text-[color:var(--foreground-secondary)] sm:text-[1.03rem]">
                    {principle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
