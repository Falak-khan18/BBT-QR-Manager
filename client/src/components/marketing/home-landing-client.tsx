"use client";

import { DemoChecklistSection } from "@/components/marketing/sections/demo-checklist-section";
import { HeroSection } from "@/components/marketing/sections/hero-section";
import { HowItWorksSection } from "@/components/marketing/sections/how-it-works-section";
import { SiteFooter } from "@/components/marketing/sections/site-footer";
import { SiteHeader } from "@/components/marketing/sections/site-header";

export function HomeLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-background to-muted dark:from-slate-950 dark:via-background dark:to-slate-900">
      <SiteHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <DemoChecklistSection />
      </main>
      <SiteFooter />
    </div>
  );
}
