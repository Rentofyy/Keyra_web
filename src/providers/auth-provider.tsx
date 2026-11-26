"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api-client";
import { UserProfile } from "@/types/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setToken, openAuthModal } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check storage first
      let token =
        sessionStorage.getItem("keyra_token") ||
        localStorage.getItem("keyra_token");

      // 2. If not in local storage, check server session cookie
      if (!token) {
        try {
          const sessionRes = await fetch("/api/auth/session");
          const sessionData = await sessionRes.json();
          if (sessionData?.token) {
            token = sessionData.token;
          }
        } catch {
          // ignore network failure
        }
      }

      if (token) {
        setToken(token);
        try {
          const res = await apiClient.get<any>("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data) {
            setUser({
              id: res.data.id,
              phoneNumber: res.data.phoneNumber,
              fullName: res.data.fullName,
              email: res.data.email,
              role: res.data.role,
              roles: res.data.roles || (res.data.role ? [res.data.role] : ["TENANT"]),
              isKycVerified: res.data.verified,
              createdAt: res.data.createdAt,
            });
          }
        } catch {
          // If token expired or invalid, reset
          setToken(null);
          setUser(null);
        }
      }
    };

    initAuth();

    // Listen for unauthorized event dispatched by apiClient
    const handleUnauthorized = () => {
      openAuthModal();
    };

    window.addEventListener("keyra:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("keyra:unauthorized", handleUnauthorized);
    };
  }, [setUser, setToken, openAuthModal]);

  return <>{children}</>;
}
