"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getJobPostings, JobPostingDto } from "@/lib/api/jobPostings";
import { getCompanies } from "@/lib/api/companies";
import { applyToJob } from "@/lib/api/applications";

import { AddJobPostingDialog } from "@/components/job-postings/AddJobPostingDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export default function JobPostingsPage() {
  const [q, setQ] = useState("");
  const qc = useQueryClient();

  const companiesQuery = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const postingsQuery = useQuery({
    queryKey: ["job-postings"],
    queryFn: getJobPostings,
  });

  const companyNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of companiesQuery.data ?? []) map.set(c.id, c.name);
    return map;
  }, [companiesQuery.data]);

  const filtered = useMemo(() => {
    const list = postingsQuery.data ?? [];
    const query = normalize(q);
    if (!query) return list;

    return list.filter((p) => {
      const companyName = companyNameById.get(p.companyId) ?? "";
      return (
        normalize(p.title).includes(query) ||
        normalize(companyName).includes(query) ||
        normalize(p.createdByEmail).includes(query)
      );
    });
  }, [postingsQuery.data, q, companyNameById]);

  const applyMutation = useMutation({
    mutationFn: (jobPostingId: string) => applyToJob(jobPostingId),
    onSuccess: () => {
      toast.success("Application created");
      qc.invalidateQueries({ queryKey: ["my-applications"] }); // ileride kullanacağız
    },
    onError: () => toast.error("Failed to apply"),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Shared catalog</div>
          <div className="text-2xl font-semibold tracking-tight">Job Postings</div>
        </div>

        <div className="flex gap-2 md:items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, company, creator..."
            className="md:w-80"
          />
          <AddJobPostingDialog />
        </div>
      </div>

      {postingsQuery.isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
      {postingsQuery.isError && <div className="text-sm text-red-600">Failed to load job postings.</div>}

      {!postingsQuery.isLoading && !postingsQuery.isError && filtered.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No results</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No job postings found. Add one or try a different search.
          </CardContent>
        </Card>
      )}

      {!postingsQuery.isLoading && !postingsQuery.isError && filtered.length > 0 && (
        <div
          className="grid gap-6 w-full"
          style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
        >
          {filtered.map((p: JobPostingDto) => {
            const companyName = companyNameById.get(p.companyId) ?? p.companyId;
            const host = safeHost(p.url);

            return (
              <Card key={p.id} className="w-full hover:shadow-sm transition">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-base leading-tight truncate">
                        {p.title}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {companyName}
                      </div>
                    </div>
                    <Badge variant="secondary">Shared</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <Link
                      className="text-primary underline underline-offset-4"
                      href={p.url}
                      target="_blank"
                    >
                      {host ?? p.url}
                    </Link>
                  </div>

                  {p.notes ? (
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {p.notes}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">—</div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Added by <span className="text-foreground">{p.createdByEmail}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => applyMutation.mutate(p.id)}
                      disabled={applyMutation.isPending}
                    >
                      {applyMutation.isPending ? "Applying..." : "Apply"}
                    </Button>
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
