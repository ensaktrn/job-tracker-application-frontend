"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";

export function Topbar() {
  return (
    <header className="h-14 border-b flex items-center justify-end px-4 gap-3">
      <Button variant="outline" onClick={() => logout()}>
        Logout
      </Button>
    </header>
  );
}
