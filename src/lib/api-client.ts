import axios from "axios";

// Base API URL: Next.js API route proxy or direct Spring Boot Cloud Run backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://keyra-backend-803170070973.asia-south1.run.app/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000,
  withCredentials: true,
});

// Request interceptor to attach JWT from client session if available
apiClient.interceptors.request.use(
  (config) => {
    // If request data is FormData, remove Content-Type so the browser/Axios computes the correct boundary
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    // If running in browser and a token is in sessionStorage or localStorage
    if (typeof window !== "undefined") {
      const token =
        sessionStorage.getItem("keyra_token") ||
        localStorage.getItem("keyra_token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized redirects gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("keyra_token");
        localStorage.removeItem("keyra_token");
        // Dispatch custom event for auth modal to prompt login
        window.dispatchEvent(new CustomEvent("keyra:unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);
