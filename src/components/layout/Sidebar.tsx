"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/companies", label: "Companies" },
  { href: "/job-postings", label: "Job Postings" },
  { href: "/applications", label: "My Applications" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r p-4">
      <div className="font-semibold mb-4">JobTracker</div>

      <nav className="space-y-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded px-3 py-2 text-sm ${
                active ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
