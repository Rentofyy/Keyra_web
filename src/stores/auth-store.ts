import { create } from "zustand";
import { UserProfile } from "@/types/auth";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authRedirectUrl: string | null;
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  openAuthModal: (redirectUrl?: string) => void;
  closeAuthModal: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  authRedirectUrl: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        sessionStorage.setItem("keyra_token", token);
        localStorage.setItem("keyra_token", token);
      } else {
        sessionStorage.removeItem("keyra_token");
        localStorage.removeItem("keyra_token");
      }
    }
    set({ token, isAuthenticated: !!token });
  },

  openAuthModal: (redirectUrl) =>
    set({ isAuthModalOpen: true, authRedirectUrl: redirectUrl || null }),

  closeAuthModal: () => set({ isAuthModalOpen: false, authRedirectUrl: null }),

  logout: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("keyra_token");
      localStorage.removeItem("keyra_token");
      // Call server logout route to clear httpOnly cookie
      try {
        fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      } catch {
        // ignore in test/offline environments
      }
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
