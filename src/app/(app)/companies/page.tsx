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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Shared catalog</div>
          <div className="text-2xl font-semibold tracking-tight">Companies</div>
        </div>

        <div className="flex gap-2 md:items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search companies..."
            className="md:w-80"
          />
          <AddCompanyDialog />
        </div>
      </div>

      {/* Body */}
      {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
      {isError && <div className="text-sm text-red-600">Failed to load companies.</div>}

      {!isLoading && !isError && filtered.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No results</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No companies found. Try a different search or add a new company.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
       <div
            className="grid gap-6 w-full"
            style={{
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            }}
            >

          {filtered.map((c: CompanyDto) => {
            const host = safeHost(c.website);

            return (
              <Card
                key={c.id}
                className="group hover:shadow-sm transition-shadow border-l-4 border-l-primary/30 hover:border-l-primary"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{c.name}</CardTitle>
                    <Badge variant="secondary">Shared</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-sm">
                    {c.website ? (
                      host ? (
                        <Link
                          className="text-primary underline underline-offset-4"
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
                    Added by <span className="text-foreground">{c.createdByEmail}</span>
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
