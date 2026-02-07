"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r bg-background">
      <div className="p-5 border-b">
        <div className="text-xl font-semibold tracking-tight">JobTracker</div>
        <div className="text-sm text-muted-foreground mt-1">
          Shared catalog + private applications
        </div>
      </div>

      <div className="p-3">
        <div className="text-xs font-medium text-muted-foreground px-3 py-2">
          NAVIGATION
        </div>

        <nav className="space-y-1">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 text-xs text-muted-foreground">
        Local API: <span className="font-mono">:5056</span>
      </div>
    </aside>
  );
}
