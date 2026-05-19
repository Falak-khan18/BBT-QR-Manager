"use client";

import { Layers, Link2, QrCode } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HowItWorksSection() {
  return (
    <section className="border-t border-border/60 bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <p className="mt-2 text-muted-foreground">
            Built for marketers and ops teams who need printed collateral to stay
            relevant after launch day.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card className="border-border/80 bg-background/80 shadow-sm">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <QrCode className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Stable scan target</CardTitle>
              <CardDescription>
                The QR bitmap encodes only your redirect URL, e.g.{" "}
                <code className="rounded bg-muted px-1 text-xs">
                  {`.../r/{code}`}
                </code>{" "}
                - never the raw campaign landing page.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/80 bg-background/80 shadow-sm">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Link2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Server-side lookup</CardTitle>
              <CardDescription>
                Each scan hits your FastAPI redirect endpoint, looks up the current
                destination in PostgreSQL, and returns an HTTP redirect.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/80 bg-background/80 shadow-sm">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Swap destinations anytime</CardTitle>
              <CardDescription>
                Update the URL in the dashboard. Posters, packaging, and booth sheets
                keep working - no new QR artwork required.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
