import { PageLayout } from "@/components/layout/PageLayout";
import { PublicAuthRoute } from "@/components/auth/PublicAuthRoute";
import { CaseStudySection } from "@/components/sections/CaseStudySection";
import { EngineeringPrinciplesSection } from "@/components/sections/EngineeringPrinciplesSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { WorkflowSection } from "@/components/sections/WorkflowSection";

export default function Home() {
  return (
    <PublicAuthRoute>
      <PageLayout>
        <HeroSection />
        <WorkflowSection />
        <EngineeringPrinciplesSection />
        <CaseStudySection />
      </PageLayout>
    </PublicAuthRoute>
  );
}
