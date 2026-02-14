import { api } from "@/lib/api/axios";

export type ApplicationStatus =
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected";

export type JobApplicationDto = {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  lastUpdatedAt: string;
  jobPostingId: string;
  jobTitle: string;
  jobUrl: string;
  companyId: string;
  companyName: string;
};

export async function getMyApplications(): Promise<JobApplicationDto[]> {
  const res = await api.get<JobApplicationDto[]>("/api/applications");
  return res.data;
}

export async function applyToJob(jobPostingId: string): Promise<void> {
  await api.post("/api/applications", { jobPostingId });
}

export async function changeApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<void> {
  await api.put(`/api/applications/${id}/status`, { status });
}
