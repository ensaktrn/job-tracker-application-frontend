import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This app uses a <span className="font-medium text-foreground">shared catalog</span> for Companies & Job Postings,
          and <span className="font-medium text-foreground"> private</span> Job Applications per user.
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Companies</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Browse companies added by all users. <Badge className="ml-2" variant="secondary">Shared</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Job Postings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Browse postings and apply with one click. <Badge className="ml-2" variant="secondary">Shared</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">My Applications</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Track your own pipeline and status. <Badge className="ml-2" variant="secondary">Private</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
