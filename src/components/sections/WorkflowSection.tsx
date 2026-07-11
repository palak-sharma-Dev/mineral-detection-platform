import { Container } from "@/components/ui/Container";

const workflowSteps = [
  {
    title: "Image Acquisition",
    description: "Capture and standardize mineral imagery for downstream analysis.",
  },
  {
    title: "Feature Preparation",
    description: "Prepare visual characteristics suitable for classification support.",
  },
  {
    title: "Model Evaluation",
    description: "Generate candidate predictions with confidence awareness.",
  },
  {
    title: "Expert Review",
    description: "Enable domain specialists to validate outcomes before decisions are finalized.",
  },
];

export function WorkflowSection() {
  return (
    <section className="bg-[color:var(--background)] px-0 py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 sm:mb-12 lg:mb-14">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[color:var(--foreground)] sm:text-4xl lg:text-[2.55rem]">
              System Workflow
            </h2>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6">
              <div className="grid grid-cols-4 gap-0">
                {workflowSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`px-5 py-4 ${index < workflowSteps.length - 1 ? "border-r border-[color:var(--foreground-muted)]/12" : ""}`}
                  >
                    <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[0.97rem] leading-7 text-[color:var(--foreground-secondary)]">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:hidden">
            {workflowSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-5"
              >
                <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.97rem] leading-7 text-[color:var(--foreground-secondary)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
