"use client";

import Link from "next/link";
import { QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <QrCode className="h-5 w-5" aria-hidden />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">BBT QR Manager</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Big Binary Tech
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Get started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
