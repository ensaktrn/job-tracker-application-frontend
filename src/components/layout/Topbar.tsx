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
    <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="text-lg font-semibold tracking-tight text-primary">
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
                  "rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Button variant="outline" size="sm" onClick={() => logout()}>
        Logout
      </Button>
    </header>
  );
}
