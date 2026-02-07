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
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
