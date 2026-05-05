import axios from "axios";
import ApiError from "./ApiError";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

const TOKEN_KEY = "authToken";

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const handleUnauthorized = () => {
  setAuthToken(null);
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth/")) {
    window.location.assign("/auth/login");
  }
};

axiosInstance.interceptors.response.use(
  (response) => {
    const envelope = response.data;
    if (envelope && envelope.success === false) {
      if (envelope.statusCode === 401) handleUnauthorized();
      throw new ApiError({
        status: envelope.statusCode ?? response.status,
        message: envelope.message,
        errors: envelope.errors,
        raw: envelope,
      });
    }
    return {
      data: envelope?.data,
      meta: envelope?.meta,
      message: envelope?.message,
    };
  },
  (error) => {
    if (error instanceof ApiError) throw error;
    const status = error.response?.status ?? 0;
    const envelope = error.response?.data;
    if (status === 401) handleUnauthorized();
    throw new ApiError({
      status,
      message: envelope?.message ?? error.message ?? "Network error",
      errors: envelope?.errors,
      raw: envelope,
    });
  }
);

const apiClient = {
  get: (endpoint, options) => axiosInstance.get(endpoint, options),
  post: (endpoint, body, options) =>
    axiosInstance.post(endpoint, body, options),
  patch: (endpoint, body, options) =>
    axiosInstance.patch(endpoint, body, options),
  delete: (endpoint, options) => axiosInstance.delete(endpoint, options),
};

export default apiClient;
