import { redirect } from "next/navigation";
import { getCurrentProfile, isActiveMember } from "@/lib/profile";
import { HeroSection } from "@/components/marketing/hero-section";
import { TaglineReveal } from "@/components/marketing/tagline-reveal";
import { StickyStackSection } from "@/components/marketing/sticky-stack-section";
import { StatsSection } from "@/components/marketing/stats-section";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CTASection } from "@/components/marketing/cta-section";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = {
  title: "SCOS - Ghana Accra Student Committee",
  description:
    "Plan meetings, log community service hours, run outreach, and keep Accra SC continuity in one system.",
};

export default async function RootPage() {
  const profile = await getCurrentProfile();

  if (profile && isActiveMember(profile)) {
    redirect("/dashboard");
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-paper">
        <MarketingHeader />
        <main className="flex-1">
          <HeroSection />
          <TaglineReveal />
          <StickyStackSection />
          <StatsSection />
          <HowItWorks />
          <FeatureGrid />
          <CTASection />
        </main>
        <MarketingFooter />
      </div>
    </TooltipProvider>
  );
}
