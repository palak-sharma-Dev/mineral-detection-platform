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
    <section className="px-0 py-18 sm:py-22 lg:py-28">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl sm:mb-12 lg:mb-14">
            <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--secondary)]">
              Operating Model
            </p>
            <h2 className="text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl lg:text-[2.65rem]">
              System Workflow
            </h2>
          </div>

          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-[1rem] border border-white/10 bg-white/[0.045] p-2 shadow-[var(--shadow-card)]">
              <div className="grid grid-cols-4 gap-0">
                {workflowSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`relative px-6 py-6 ${index < workflowSteps.length - 1 ? "border-r border-white/10" : ""}`}
                  >
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground-muted)]">
                      0{index + 1}
                    </p>
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
            {workflowSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[1rem] border border-white/10 bg-white/[0.045] p-5 shadow-[var(--shadow-card)]"
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground-muted)]">
                  0{index + 1}
                </p>
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
