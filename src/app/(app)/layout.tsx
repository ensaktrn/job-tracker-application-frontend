import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-6 bg-muted/30 min-h-[calc(100vh-64px)]"><div className="max-w-6xl mx-auto">{children}</div></main>
        </div>
      </div>
    </AuthGuard>
  );
}
