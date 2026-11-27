import React from "react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

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

// Mock @tanstack/react-query
vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({
    data: [],
    isLoading: false,
  }),
}));

// Mock PropertyGrid
vi.mock("@/components/property/property-grid", () => ({
  PropertyGrid: () => <div data-testid="property-grid-mock" />,
}));

describe("Homepage CTA Button Text Visibility", () => {
  it("renders Explore Owner Plans button with high contrast text on default state", () => {
    render(<HomePage />);

    const exploreButton = screen.getByRole("button", {
      name: /Explore Owner Plans/i,
    });

    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton).toBeVisible();

    // Verify button has dark navy text color token for high contrast against white background
    expect(exploreButton.className).toContain("text-[#060C18]");
    expect(exploreButton.className).toContain("bg-white");
    expect(exploreButton.className).toContain("border-slate-200");

    // Verify it does NOT have invisible white-on-white text styling
    expect(exploreButton.className).not.toMatch(/\btext-white\b/);
  });

  it("renders Post Free Property Listing primary button alongside Explore Owner Plans", () => {
    render(<HomePage />);

    const postListingButton = screen.getByRole("button", {
      name: /Post Free Property Listing/i,
    });

    expect(postListingButton).toBeInTheDocument();
    expect(postListingButton).toBeVisible();
  });
});
