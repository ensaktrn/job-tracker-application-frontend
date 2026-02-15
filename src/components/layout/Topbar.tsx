"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/companies", label: "Companies" },
  { href: "/job-postings", label: "Job Postings" },
  { href: "/applications", label: "My Applications" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border/70 bg-background/85 px-4 backdrop-blur-md md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">
          JobTracker
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "rounded-full px-3.5 py-1.5 text-sm transition",
                  active
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Button variant="outline" size="sm" className="rounded-full border-border/70 bg-background/80" onClick={() => logout()}>
        Logout
      </Button>
    </header>
  );
}
