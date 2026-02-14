import { api } from "@/lib/api/axios";

export type JobPostingDto = {
  id: string;
  companyId: string;
  title: string;
  url: string;
  notes?: string | null;
  createdAt: string;
  createdByEmail: string;
};

export type CreateJobPostingRequest = {
  companyId: string;
  title: string;
  url: string;
  notes?: string;
};

export async function getJobPostings(): Promise<JobPostingDto[]> {
  const res = await api.get<JobPostingDto[]>("/api/job-postings");
  return res.data;
}

export async function createJobPosting(payload: CreateJobPostingRequest): Promise<JobPostingDto> {
  const res = await api.post<JobPostingDto>("/api/job-postings", payload);
  return res.data;
}
