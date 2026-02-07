import { api } from "@/lib/api/axios";
import { AuthTokens, tokenStore } from "@/lib/auth/token-store";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export async function login(payload: LoginRequest): Promise<AuthTokens> {
  const res = await api.post<AuthTokens>("/api/auth/login", payload);
  tokenStore.set(res.data);
  return res.data;
}

export async function register(payload: RegisterRequest): Promise<void> {
  await api.post("/api/auth/register", payload);
}

export async function logout(): Promise<void> {
  const refreshToken = tokenStore.getRefresh();
  try {
    if (refreshToken) {
      await api.post("/api/auth/logout", { refreshToken });
    }
  } finally {
    tokenStore.clear();
    window.dispatchEvent(new Event("jt:auth:logout"));
  }
}
