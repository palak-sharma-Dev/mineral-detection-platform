import { Container } from "@/components/ui/Container";

const capabilities = [
  {
    title: "Image Acquisition",
    description: "Capture and standardize mineral imagery for downstream analysis.",
  },
  {
    title: "Feature Preparation",
    description: "Prepare visual characteristics suitable for classification support.",
  },
  {
    title: "AI-Assisted Model Evaluation",
    description: "Generate candidate predictions with confidence awareness.",
  },
  {
    title: "Expert Review",
    description: "Enable domain specialists to validate outcomes before decisions are finalized.",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-[color:var(--background)] px-0 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-3xl sm:mb-12 lg:mb-14">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--foreground-secondary)]">
              Platform Capabilities
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-[color:var(--foreground)] sm:text-4xl lg:text-[2.55rem]">
              A structured workflow for mineral intelligence
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {capabilities.map((capability, index) => (
              <article
                key={capability.title}
                className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--foreground-secondary)]">
                      Capability {index + 1}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-[color:var(--foreground)]">
                      {capability.title}
                    </h3>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-[0.5rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--surface-muted)] text-sm font-semibold text-[color:var(--foreground-secondary)]">
                    0{index + 1}
                  </div>
                </div>

                <p className="mt-5 text-[1rem] leading-8 text-[color:var(--foreground-secondary)]">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
