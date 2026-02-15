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

export type PagedResult<T> = {
  items: T[];
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
};

function isPagedResult<T>(data: any): data is PagedResult<T> {
  return data && typeof data === "object" && Array.isArray(data.items);
}

export async function getMyApplications(): Promise<JobApplicationDto[]> {
  const res = await api.get("/api/applications");

  // Backend bazen direkt array döner, bazen { items: [] } döner.
  if (isPagedResult<JobApplicationDto>(res.data)) {
    return res.data.items;
  }

  return res.data as JobApplicationDto[];
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
