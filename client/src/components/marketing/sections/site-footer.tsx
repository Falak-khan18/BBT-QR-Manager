"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
        <div>
          <p className="text-sm font-semibold">BBT QR Manager</p>
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} Big Binary Tech - assessment demo product.
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            Log in
          </Link>
          <Link href="/register" className="text-muted-foreground hover:text-foreground">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
}
