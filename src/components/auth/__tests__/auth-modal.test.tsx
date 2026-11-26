import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthModal } from "../auth-modal";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api-client";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock apiClient
vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("AuthModal Component & Unified Authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      isAuthModalOpen: true,
      user: null,
      token: null,
      isAuthenticated: false,
      authRedirectUrl: null,
    });
  });

  it("renders modal with KEYRA logo, title, and subtitle", () => {
    render(<AuthModal />);

    expect(screen.getByAltText("KEYRA - New Era of Finding Homes")).toBeInTheDocument();
    expect(screen.getByText("Sign In to KEYRA")).toBeInTheDocument();
    expect(
      screen.getByText("Zero Brokerage. Verified Homes. Direct Owner Connect.")
    ).toBeInTheDocument();
  });

  it("does NOT render any account-type selector (Tenant / Flatmate or Property Owner)", () => {
    render(<AuthModal />);

    // Assert that the role selector buttons are completely absent from the UI
    expect(screen.queryByText(/Tenant \/ Flatmate/i)).toBeNull();
    expect(screen.queryByText(/Property Owner/i)).toBeNull();
    expect(screen.queryByRole("button", { name: /Tenant \/ Flatmate/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /Property Owner/i })).toBeNull();
  });

  it("renders Google Sign-In and Phone OTP login options", () => {
    render(<AuthModal />);

    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(screen.getByText("Or verify with phone OTP")).toBeInTheDocument();
    expect(screen.getByText("Mobile Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter mobile number")).toBeInTheDocument();
    expect(screen.getByText(/Get Verification Code/i)).toBeInTheDocument();
    expect(screen.getByText("Terms")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("submits OTP request without role parameter", async () => {
    (apiClient.post as any).mockResolvedValueOnce({
      data: { message: "OTP sent successfully" },
    });

    render(<AuthModal />);

    const phoneInput = screen.getByPlaceholderText("Enter mobile number");
    fireEvent.change(phoneInput, { target: { value: "9876543210" } });

    const submitBtn = screen.getByRole("button", { name: /Get Verification Code/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/auth/otp/request", {
        phoneNumber: "+919876543210",
      });
    });
  });

  it("verifies OTP without role parameter under unified account architecture", async () => {
    (apiClient.post as any)
      .mockResolvedValueOnce({
        data: { message: "OTP sent" },
      })
      .mockResolvedValueOnce({
        data: {
          accessToken: "jwt-token-123",
          user: {
            id: "user-uuid-1",
            phoneNumber: "+919876543210",
            role: "TENANT",
            verified: true,
          },
        },
      });

    render(<AuthModal />);

    // Step 1: Send OTP
    const phoneInput = screen.getByPlaceholderText("Enter mobile number");
    fireEvent.change(phoneInput, { target: { value: "9876543210" } });
    fireEvent.click(screen.getByRole("button", { name: /Get Verification Code/i }));

    // Step 2: Enter OTP digits
    await waitFor(() => {
      expect(screen.getByText("Enter Verification Code")).toBeInTheDocument();
    });

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: `${index + 1}` } });
    });

    // Step 3: Click Verify
    const verifyBtn = screen.getByRole("button", { name: /Verify & Sign In/i });
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/auth/otp/verify", {
        phoneNumber: "+919876543210",
        code: "123456",
      });
    });
  });

  it("closes modal when close button is clicked", () => {
    render(<AuthModal />);

    const closeBtn = screen.getByLabelText("Close");
    fireEvent.click(closeBtn);

    expect(useAuthStore.getState().isAuthModalOpen).toBe(false);
  });
});
