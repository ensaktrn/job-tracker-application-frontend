import { api } from "@/lib/api/axios";

export type CompanyDto = {
  id: string;
  name: string;
  website?: string | null;
  createdAt: string;
  createdByEmail: string;
};

export type CreateCompanyRequest = {
  name: string;
  website?: string;
};

export async function getCompanies(): Promise<CompanyDto[]> {
  const res = await api.get<CompanyDto[]>("/api/companies");
  return res.data;
}

export async function createCompany(payload: CreateCompanyRequest): Promise<CompanyDto> {
  const res = await api.post<CompanyDto>("/api/companies", payload);
  return res.data;
}
