import { AuthGuard } from "@/components/auth/AuthGuard";
import { Topbar } from "@/components/layout/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col w-full">
        <Topbar />
        <main className="flex-1 bg-muted/30 px-6 py-6 w-full">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

