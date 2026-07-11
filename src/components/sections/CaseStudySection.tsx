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
    <section className="bg-[color:var(--background)] px-0 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 sm:mb-12 lg:mb-14">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[color:var(--foreground)] sm:text-4xl lg:text-[2.55rem]">
              Case Study
            </h2>
          </div>

          <div className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)]">
            <div className="divide-y divide-[color:var(--foreground-muted)]/12">
              {caseStudySections.map((section) => (
                <div key={section.title} className="px-6 py-6 sm:px-8 sm:py-7">
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
