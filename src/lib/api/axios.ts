import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "@/lib/auth/token-store";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function enqueueRefresh(cb: (token: string | null) => void) {
  refreshQueue.push(cb);
}
function flushQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

async function refreshTokens() {
  const accessToken = tokenStore.getAccess();
  const refreshToken = tokenStore.getRefresh();
  if (!accessToken || !refreshToken) throw new Error("Missing tokens");

  const res = await axios.post(`${baseURL}/api/auth/refresh`, {
    accessToken,
    refreshToken,
  });

  const newTokens = res.data as { accessToken: string; refreshToken: string };
  tokenStore.set(newTokens);
  return newTokens.accessToken;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (!error.response) return Promise.reject(error);
    if (error.response.status !== 401) return Promise.reject(error);

    if (original?.url?.includes("/api/auth/refresh")) {
      tokenStore.clear();
      window.dispatchEvent(new Event("jt:auth:logout"));
      return Promise.reject(error);
    }

    if (original?._retry) return Promise.reject(error);
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        enqueueRefresh((token) => {
          if (!token) return reject(error);
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const newAccess = await refreshTokens();
      flushQueue(newAccess);
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (e) {
      flushQueue(null);
      tokenStore.clear();
      window.dispatchEvent(new Event("jt:auth:logout"));
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);
