"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";
import { usePathname } from "next/navigation";

function titleFromPath(path: string) {
  if (path.startsWith("/companies")) return "Companies";
  if (path.startsWith("/job-postings")) return "Job Postings";
  if (path.startsWith("/applications")) return "My Applications";
  return "Dashboard";
}

export function Topbar() {
  const pathname = usePathname();
  const title = titleFromPath(pathname);

  return (
    <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
      <div>
        <div className="text-sm text-muted-foreground">JobTracker</div>
        <div className="text-lg font-semibold leading-tight text-primary">{title}</div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    </header>
  );
}
