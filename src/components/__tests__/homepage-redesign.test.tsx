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

describe("Homepage Hero Redesign & New Service Sections", () => {
  it("renders the redesigned Hero section with two-tone heading, description, and verifies eyebrow is removed", () => {
    render(<HomePage />);

    // Eyebrow removed as requested
    expect(screen.queryByText(/THE SMARTER WAY TO RENT IN PUNE/i)).not.toBeInTheDocument();

    // Two-tone heading
    expect(screen.getByText(/You Find the Home\./i)).toBeInTheDocument();
    expect(screen.getAllByText(/We Handle the Rest\./i).length).toBeGreaterThanOrEqual(2);

    // Subtitle
    expect(
      screen.getByText(
        /Owner-verified properties\. Personally guided home tours\. Complete rental assistance from your first visit to move-in\./i
      )
    ).toBeInTheDocument();
  });

  it("renders the three Hero feature cards with descriptions in compact format", () => {
    render(<HomePage />);

    expect(screen.getByText("Verified Owners")).toBeInTheDocument();
    expect(screen.getByText("Proof before listing.")).toBeInTheDocument();

    expect(screen.getByText("Guided Tours")).toBeInTheDocument();
    expect(screen.getByText("KEYRA executives.")).toBeInTheDocument();

    expect(screen.getByText("End-to-End")).toBeInTheDocument();
    expect(screen.getByText("Rental assistance.")).toBeInTheDocument();
  });

  it("renders the Find Your Next Home CTA and supporting journey text", () => {
    render(<HomePage />);

    const ctaButton = screen.getByRole("button", { name: /Find Your Next Home/i });
    expect(ctaButton).toBeInTheDocument();

    expect(screen.getByText(/A BETTER RENTAL JOURNEY STARTS HERE/i)).toBeInTheDocument();
  });

  it("preserves the property search component with category tabs, locality, BHK, and Search Homes CTA", () => {
    render(<HomePage />);

    // Category tabs
    expect(screen.getByRole("button", { name: /Family Flats/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Coliving & Flatmates/i })).toBeInTheDocument();

    // Form fields
    expect(screen.getByText(/^Locality$/i)).toBeInTheDocument();
    expect(screen.getByText(/^BHK$/i)).toBeInTheDocument();
    expect(screen.getByText(/^City$/i)).toBeInTheDocument();
    expect(screen.getByText("Pune, MH")).toBeInTheDocument();

    // Search submit button
    const searchButton = screen.getByRole("button", { name: /Search Homes/i });
    expect(searchButton).toBeInTheDocument();
  });

  it("renders the Rental Assistance Section with 3 highlighted benefits", () => {
    render(<HomePage />);

    expect(screen.getByText(/A NEW ERA OF RENTING/i)).toBeInTheDocument();
    expect(screen.getAllByText(/You Choose the Home\./i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/No One-Month Brokerage\./i).length).toBeGreaterThan(0);
    expect(screen.getByText("Personally Guided Tours.")).toBeInTheDocument();
    expect(screen.getByText("Complete Rental Assistance.")).toBeInTheDocument();
  });

  it("renders the Twelve-Month Support Section with prominent 12 Months and condition disclaimer", () => {
    render(<HomePage />);

    expect(screen.getByText(/12 Months\./i)).toBeInTheDocument();
    expect(screen.getByText(/We're With You\./i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /From move-in to unexpected rental challenges and re-rental assistance, KEYRA stays by your side\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Assistance provided under active KEYRA Tenancy terms and standard service scope\./i)
    ).toBeInTheDocument();
  });

  it("renders the full-width Brand Statement Section before footer", () => {
    render(<HomePage />);

    expect(screen.getByText(/Other Platforms Share Contacts\./i)).toBeInTheDocument();
    expect(screen.getByText(/KEYRA Takes Responsibility\./i)).toBeInTheDocument();
  });
});
