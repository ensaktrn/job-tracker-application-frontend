"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getCompanies, CompanyDto } from "@/lib/api/companies";
import { AddCompanyDialog } from "@/components/companies/AddCompanyDialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function safeHost(url?: string | null) {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

function usernameFromEmail(email: string) {
  return email.split("@")[0] || email;
}

export default function CompaniesPage() {
  const [q, setQ] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    const query = normalize(q);
    if (!query) return list;

    return list.filter(
      (c) =>
        normalize(c.name).includes(query) ||
        normalize(c.createdByEmail).includes(query) ||
        normalize(c.website ?? "").includes(query)
    );
  }, [data, q]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-gradient-to-r from-primary/[0.07] via-background to-cyan-100/30 p-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-medium text-primary">Shared catalog</div>
          <div className="text-2xl font-semibold tracking-tight md:text-3xl">Companies</div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row md:items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search companies..."
            className="sm:w-80 bg-background/90"
          />
          <AddCompanyDialog />
        </div>
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
      {isError && <div className="text-sm text-red-600">Failed to load companies.</div>}

      {!isLoading && !isError && filtered.length === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">No results</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No companies found. Try a different search or add a new company.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">

          {filtered.map((c: CompanyDto) => {
            const host = safeHost(c.website);

            return (
              <Card
                key={c.id}
                className="group border-border/80 bg-card/95 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{c.name}</CardTitle>
                    <Badge variant="secondary" className="rounded-full">Shared</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-sm">
                    {c.website ? (
                      host ? (
                        <Link
                          className="font-medium text-primary underline underline-offset-4"
                          href={c.website}
                          target="_blank"
                        >
                          {host}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">{c.website}</span>
                      )
                    ) : (
                      <span className="text-muted-foreground">No website</span>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Added by <span className="text-foreground">{usernameFromEmail(c.createdByEmail)}</span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
