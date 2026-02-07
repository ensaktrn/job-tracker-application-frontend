"use client";

import { tokenStore } from "@/lib/auth/token-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = () => {
      if (!tokenStore.hasTokens()) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      setReady(true);
    };

    check();

    const onLogout = () => {
      setReady(false);
      router.replace("/login");
    };

    window.addEventListener("jt:auth:logout", onLogout);
    return () => window.removeEventListener("jt:auth:logout", onLogout);
  }, [router, pathname]);

  if (!ready) return null; // istersen loading component koyarız
  return <>{children}</>;
}
