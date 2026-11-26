import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../auth-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("initializes with unauthenticated state", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthModalOpen).toBe(false);
  });

  it("opens and closes auth modal with redirect url", () => {
    const store = useAuthStore.getState();
    store.openAuthModal("/properties/123/visit");

    let current = useAuthStore.getState();
    expect(current.isAuthModalOpen).toBe(true);
    expect(current.authRedirectUrl).toBe("/properties/123/visit");

    store.closeAuthModal();
    current = useAuthStore.getState();
    expect(current.isAuthModalOpen).toBe(false);
    expect(current.authRedirectUrl).toBeNull();
  });

  it("sets user and token on successful login", () => {
    const store = useAuthStore.getState();
    store.setToken("mock-jwt-token");
    store.setUser({
      id: "usr-123",
      phoneNumber: "+919876543210",
      fullName: "Atharva Joshi",
      roles: ["ROLE_TENANT", "ROLE_OWNER"],
    });

    const current = useAuthStore.getState();
    expect(current.isAuthenticated).toBe(true);
    expect(current.user?.fullName).toBe("Atharva Joshi");
    expect(current.token).toBe("mock-jwt-token");
  });
});
