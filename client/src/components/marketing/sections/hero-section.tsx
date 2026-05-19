"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Badge
          variant="secondary"
          className="mb-4 border border-border/80 bg-background/80"
        >
          Dynamic QR - one print, many destinations
        </Badge>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Campaign QR codes that never go stale
        </h1>
        <p className="mt-6 text-balance text-lg text-muted-foreground sm:text-xl">
          A product of{" "}
          <span className="font-medium text-foreground">Big Binary Tech</span>. Each
          code encodes a fixed redirect link; you change the final URL in the
          dashboard whenever strategy shifts.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8">
            <Link href="/register">
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
