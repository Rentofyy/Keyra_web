import React from "react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { PropertyCard } from "../property-card";
import { PropertyGrid } from "../property-grid";
import { PropertySummary } from "@/types/property";

// Mock next/image for Vitest jsdom
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, priority, ...props }: any) => {
    return <img {...props} alt={props.alt || "mocked image"} />;
  },
}));

// Mock next/link for Vitest jsdom
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

describe("PropertyCard Component & Safe Null Handling", () => {
  const completeProperty: PropertySummary = {
    id: "prop-123",
    title: "Spacious 3 BHK in Baner",
    societyName: "Pancard Greens",
    address: "Baner Road, Pune, Maharashtra 411045",
    locality: "Baner",
    rentAmount: 35000,
    monthlyRent: 35000,
    depositAmount: 70000,
    securityDeposit: 70000,
    bhkType: "3BHK",
    bhk: "3BHK",
    furnishingStatus: "FULLY_FURNISHED",
    carpetAreaSqft: 1250,
    photos: ["https://example.com/photo1.jpg"],
    isVerified: true,
  };

  it("renders complete property data accurately", () => {
    render(<PropertyCard property={completeProperty} />);

    expect(screen.getByText("₹35k")).toBeInTheDocument();
    expect(screen.getByText(/3 BHK in Pancard Greens/i)).toBeInTheDocument();
    expect(screen.getByText(/Baner, Pune West/i)).toBeInTheDocument();
    expect(screen.getByText("3 BHK")).toBeInTheDocument();
    expect(screen.getByText("Fully Furnished")).toBeInTheDocument();
    expect(screen.getByText("1,250 sq.ft.")).toBeInTheDocument();
    expect(screen.getByText(/Deposit: ₹70,000/i)).toBeInTheDocument();
  });

  it("handles missing/null BHK safely without crashing (uses fallback 'BHK')", () => {
    const missingBhkProperty: any = {
      ...completeProperty,
      bhk: null,
      bhkType: null,
    };

    expect(() => render(<PropertyCard property={missingBhkProperty} />)).not.toThrow();
    expect(screen.getByText("BHK")).toBeInTheDocument();
  });

  it("handles undefined BHK safely without crashing", () => {
    const undefinedBhkProperty: any = {
      ...completeProperty,
      bhk: undefined,
      bhkType: undefined,
    };

    expect(() => render(<PropertyCard property={undefinedBhkProperty} />)).not.toThrow();
    expect(screen.getByText("BHK")).toBeInTheDocument();
  });

  it("handles null furnishing status cleanly without crashing", () => {
    const nullFurnishingProperty: any = {
      ...completeProperty,
      furnishingStatus: null,
    };

    expect(() => render(<PropertyCard property={nullFurnishingProperty} />)).not.toThrow();
    // Furnishing tag should simply not be rendered or empty, without throwing
    expect(screen.queryByText("Fully Furnished")).not.toBeInTheDocument();
  });

  it("handles missing images/photos safely with fallback placeholder images", () => {
    const missingPhotosProperty: any = {
      ...completeProperty,
      photos: null,
      primaryPhotoUrl: null,
    };

    expect(() => render(<PropertyCard property={missingPhotosProperty} />)).not.toThrow();
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBeTruthy();
    expect(img.getAttribute("src")).toMatch(/^https?:\/\//);
  });

  it("handles missing optional fields (carpetArea, societyName, address) safely", () => {
    const sparseProperty: any = {
      id: "sparse-1",
      rentAmount: 20000,
      depositAmount: 40000,
      bhk: "2_BHK",
    };

    expect(() => render(<PropertyCard property={sparseProperty} />)).not.toThrow();
    expect(screen.getByText("2 BHK")).toBeInTheDocument();
    expect(screen.getByText("₹20k")).toBeInTheDocument();
  });
});

describe("PropertyGrid Component", () => {
  it("renders empty state gracefully when properties array is empty", () => {
    render(<PropertyGrid properties={[]} />);

    expect(screen.getByText(/No Verified Properties Found/i)).toBeInTheDocument();
  });

  it("renders empty state gracefully when properties is null or undefined", () => {
    render(<PropertyGrid properties={null as any} />);

    expect(screen.getByText(/No Verified Properties Found/i)).toBeInTheDocument();
  });

  it("renders loading skeletons when isLoading is true", () => {
    const { container } = render(<PropertyGrid properties={[]} isLoading={true} />);

    const skeletons = container.querySelectorAll(".animate-shimmer");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders a list of properties containing null or partial entries without crashing", () => {
    const mixedProperties: any[] = [
      {
        id: "p1",
        title: "Home 1",
        rentAmount: 18000,
        bhk: "1BHK",
      },
      {
        id: "p2",
        // Missing BHK, missing photos, missing furnishing
        rentAmount: 25000,
      },
      null, // Corrupted item in list
    ];

    expect(() => render(<PropertyGrid properties={mixedProperties} />)).not.toThrow();
    expect(screen.getByText("1 BHK")).toBeInTheDocument();
    expect(screen.getAllByText("BHK").length).toBeGreaterThanOrEqual(1);
  });
});
