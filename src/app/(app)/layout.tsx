import { AuthGuard } from "@/components/auth/AuthGuard";
import { Topbar } from "@/components/layout/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col w-full">
        <Topbar />
        <main className="relative flex-1 px-4 py-6 md:px-8 md:py-8 w-full">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-primary/[0.08] to-transparent" />
          <div className="mx-auto w-full max-w-[1400px] rounded-3xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur-sm md:p-6">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
