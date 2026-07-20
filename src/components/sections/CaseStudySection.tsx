import { Container } from "@/components/ui/Container";

const caseStudySections = [
  {
    title: "The Challenge",
    content:
      "Mineral identification requires careful interpretation of complex geospatial information, with a need for consistency, confidence, and expert judgment across repeated workflows.",
  },
  {
    title: "Our Approach",
    content:
      "The platform combines satellite imagery, computer vision, and structured expert review to support mineral analysis through image acquisition, feature preparation, evaluation, and validation.",
  },
  {
    title: "Observed Outcomes",
    content:
      "The workflow supports faster, more consistent mineral identification by providing candidate predictions, confidence awareness, and a clear path for expert review before decisions are finalized.",
  },
  {
    title: "Reflection",
    content:
      "Human oversight remains essential, interpretability improves adoption, operational workflows guide design choices, and consistency matters as much as speed.",
  },
];

export function CaseStudySection() {
  return (
    <section className="px-0 py-18 sm:py-22 lg:py-28">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl sm:mb-12 lg:mb-14">
            <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--secondary)]">
              Applied Intelligence
            </p>
            <h2 className="text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl lg:text-[2.65rem]">
              Case Study
            </h2>
          </div>

          <div className="overflow-hidden rounded-[1.1rem] border border-white/10 bg-white/[0.045] shadow-[var(--shadow-card)]">
            <div className="grid divide-y divide-white/10 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              {caseStudySections.map((section, index) => (
                <div key={section.title} className="px-6 py-7 sm:px-8 sm:py-8">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground-muted)]">
                    0{index + 1}
                  </p>
                  <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                    {section.title}
                  </h3>
                  <p className="mt-3 text-[1rem] leading-8 text-[color:var(--foreground-secondary)] sm:text-[1.03rem]">
                    {section.content}
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
