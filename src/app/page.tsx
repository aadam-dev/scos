import { redirect } from "next/navigation";
import { getCurrentProfile, isActiveMember } from "@/lib/profile";
import { HeroSection } from "@/components/marketing/hero-section";
import { StatsSection } from "@/components/marketing/stats-section";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { TestimonialSection } from "@/components/marketing/testimonial-section";
import { CTASection } from "@/components/marketing/cta-section";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = {
  title: "SCOS - Student Committee Operating System",
  description:
    "Governance excellence for IOU Student Committees. Streamline meetings, track activities, and generate reports.",
};

export default async function RootPage() {
  const profile = await getCurrentProfile();

  // If user is logged in and active, redirect to dashboard
  if (profile && isActiveMember(profile)) {
    redirect("/dashboard");
  }

  // For unauthenticated users, show the marketing landing page
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        <MarketingHeader />
        <main className="flex-1">
          <HeroSection />
          <StatsSection />
          <FeatureGrid />
          <HowItWorks />
          <TestimonialSection />
          <CTASection />
        </main>
        <MarketingFooter />
      </div>
    </TooltipProvider>
  );
}
