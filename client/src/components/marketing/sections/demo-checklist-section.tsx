"use client";

import { ShieldCheck, Smartphone } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DemoChecklistSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Card className="overflow-hidden border-2 border-primary/20 bg-card shadow-md">
          <CardHeader className="bg-muted/50">
            <div className="flex flex-wrap items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Live demo checklist</CardTitle>
            </div>
            <CardDescription className="text-base">
              Section 03 - use the Next.js dashboard in the browser and a real device
              scan when presenting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <ol className="list-decimal space-y-3 pl-5 text-sm sm:text-base">
              <li>
                <strong>Create a campaign</strong> with an initial destination URL.
              </li>
              <li>
                <span className="inline-flex items-center gap-1">
                  <Smartphone className="h-4 w-4 shrink-0" />
                  <strong>Scan the QR</strong> on your phone and confirm the first
                  redirect.
                </span>
              </li>
              <li>
                <strong>Change only the destination URL</strong> in the dashboard and
                save.
              </li>
              <li>
                <strong>Scan the same printed or on-screen QR again</strong> - it must
                open the new destination.
              </li>
            </ol>
            <hr className="border-t border-border" />
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
              <p className="text-sm font-semibold text-destructive">Hard requirement</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The QR{" "}
                <strong className="text-foreground">image must not change</strong> when
                you update the destination. This app encodes the stable{" "}
                <code className="rounded bg-muted px-1 text-xs">redirect_url</code> only;
                the final URL lives in the database. If the bitmap changes after an
                edit, the core mechanic is wrong - stop the demo and fix the flow.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Presenter line:</strong>{" "}
              {`"The QR graphic stays the same because it only stores our redirect endpoint; the backend reads the latest destination from the database on every scan."`}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
