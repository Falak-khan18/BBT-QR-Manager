import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { RequireAuth } from "@/components/require-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-muted/40">
        <AppHeader />
        <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
          <div className="text-xs text-muted-foreground">
            <Link href="/" className="hover:underline">
              ← Home
            </Link>
          </div>
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
