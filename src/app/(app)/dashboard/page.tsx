"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tokenStore } from "@/lib/auth/token-store";

function readDisplayNameFromToken() {
  const token = tokenStore.getAccess();
  if (!token) return "User";

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return "User";

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as Record<string, unknown>;

    const raw =
      payload.username ??
      payload.name ??
      payload.given_name ??
      payload.email ??
      payload.sub;

    if (!raw || typeof raw !== "string") return "User";

    const beforeAt = raw.includes("@") ? raw.split("@")[0] : raw;
    return beforeAt.trim() || "User";
  } catch {
    return "User";
  }
}

export default function DashboardPage() {
  const [displayName] = useState(readDisplayNameFromToken);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/[0.08] via-background to-cyan-100/40">
        <CardHeader>
          <CardTitle className="text-xl">Welcome, {displayName}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This app uses a <span className="font-semibold text-foreground">shared catalog</span> for Companies and Job Postings,
          and <span className="font-semibold text-foreground">private</span> Job Applications per user.
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="border-border/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Companies</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Browse companies added by all users. <Badge className="ml-2 rounded-full" variant="secondary">Shared</Badge>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Job Postings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Browse postings and apply with one click. <Badge className="ml-2 rounded-full" variant="secondary">Shared</Badge>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">My Applications</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Track your own pipeline and status. <Badge className="ml-2 rounded-full" variant="secondary">Private</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
