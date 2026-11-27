import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import TenantVisitsPage from "@/app/tenant/visits/page";
import { useAuthStore } from "@/stores/auth-store";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useParams: () => ({ id: "prop-123" }),
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

// Mock react-query
const mockUseQuery = vi.fn();
vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: any) => mockUseQuery(options),
}));

// Mock api-client
vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("TenantVisitsPage - Visit Request State & Staff Assignment UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: "u-1", name: "Test User", role: "TENANT", phone: "9876543210" },
    });
  });

  it("displays 'Requested (Awaiting Staff Assignment)' and staff assignment message for newly requested visits", () => {
    mockUseQuery.mockImplementation(({ queryKey }: { queryKey: string[] }) => {
      if (queryKey[0] === "tenant-visits") {
        return {
          data: {
            content: [
              {
                id: "visit-1",
                propertyId: "prop-101",
                propertyTitle: "2BHK Luxury Apartment",
                propertyAddress: "Baner, Pune",
                visitDate: "2026-11-28",
                timeSlot: "10:00 AM - 12:00 PM",
                status: "REQUESTED",
                createdAt: "2026-11-27T10:00:00Z",
              },
            ],
            totalElements: 1,
          },
          isLoading: false,
          refetch: vi.fn(),
        };
      }
      return {
        data: {
          freeVisitsRemaining: 2,
          totalFreeVisits: 3,
          usedFreeVisits: 1,
          quotaExhausted: false,
        },
        isLoading: false,
      };
    });

    render(<TenantVisitsPage />);

    // Verify Requested badge is shown
    expect(
      screen.getByText(/Requested \(Awaiting Staff Assignment\)/i)
    ).toBeInTheDocument();

    // Verify "Schedule is requested" callout is visible
    expect(screen.getByText(/Schedule is requested/i)).toBeInTheDocument();
    expect(
      screen.getByText(/We will assign you staff as soon as possible/i)
    ).toBeInTheDocument();

    // Ensure it does NOT claim "Executive Assigned"
    expect(screen.queryByText(/^Executive Assigned$/i)).not.toBeInTheDocument();
  });

  it("displays 'Confirmed' and field executive details when a visit is confirmed with assigned staff", () => {
    mockUseQuery.mockImplementation(({ queryKey }: { queryKey: string[] }) => {
      if (queryKey[0] === "tenant-visits") {
        return {
          data: {
            content: [
              {
                id: "visit-2",
                propertyId: "prop-102",
                propertyTitle: "3BHK Villa in Wakad",
                propertyAddress: "Wakad, Pune",
                visitDate: "2026-11-29",
                timeSlot: "02:00 PM - 04:00 PM",
                status: "CONFIRMED",
                executiveName: "Rohan Sharma",
                executivePhone: "+91 9898989898",
                createdAt: "2026-11-26T10:00:00Z",
              },
            ],
            totalElements: 1,
          },
          isLoading: false,
          refetch: vi.fn(),
        };
      }
      return {
        data: {
          freeVisitsRemaining: 1,
          totalFreeVisits: 3,
          usedFreeVisits: 2,
          quotaExhausted: false,
        },
        isLoading: false,
      };
    });

    render(<TenantVisitsPage />);

    // Verify Confirmed badge with executive name
    expect(
      screen.getByText(/Confirmed • Executive: Rohan Sharma/i)
    ).toBeInTheDocument();

    // Verify executive assignment notification card
    expect(screen.getByText(/Field Executive Assigned/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Rohan Sharma/i).length).toBeGreaterThanOrEqual(1);
  });
});
