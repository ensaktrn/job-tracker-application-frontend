import type { ApplicationStatus } from "@/lib/api/applications";

export function statusVariant(status: ApplicationStatus) {
  switch (status) {
    case "Applied":
      return "secondary";
    case "Interview":
      return "default";
    case "Offer":
      return "default";
    case "Rejected":
      return "destructive";
    default:
      return "secondary";
  }
}
