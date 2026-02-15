"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getMyApplications,
  changeApplicationStatus,
  ApplicationStatus,
} from "@/lib/api/applications";
import { statusVariant } from "@/lib/utils/status";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ApplicationsPage() {
  const qc = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const query = useQuery({
    queryKey: ["my-applications"],
    queryFn: getMyApplications,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      changeApplicationStatus(id, status),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["my-applications"] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  if (query.isLoading)
    return <div className="text-sm text-muted-foreground">Loading...</div>;

  if (query.isError)
    return <div className="text-sm text-red-600">Failed to load applications.</div>;

  const applications =
    filterStatus === "all"
      ? query.data ?? []
      : (query.data ?? []).filter((a) => a.status === filterStatus);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Private</div>
          <div className="text-2xl font-semibold tracking-tight">
            My Applications
          </div>
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Offer">Offer</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {applications.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No applications yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Apply to a job posting to see it here.
          </CardContent>
        </Card>
      )}

      {applications.length > 0 && (
        <div
          className="grid gap-6 w-full"
          style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
        >
          {applications.map((a) => (
            <Card key={a.id} className="w-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {a.jobTitle}
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  {a.companyName}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <Badge variant={statusVariant(a.status)}>
                  {a.status}
                </Badge>

                <div className="text-xs text-muted-foreground">
                  Applied: {new Date(a.appliedAt).toLocaleDateString()}
                </div>

                <Select
                  value={a.status}
                  onValueChange={(val) =>
                    mutation.mutate({
                      id: a.id,
                      status: val as ApplicationStatus,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
