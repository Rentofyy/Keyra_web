import { describe, it, expect } from "vitest";
import { formatBhk, deriveLocality, normalizeProperty, getPropertyPhotos } from "../property-helper";
import { formatDate, formatCurrency, formatRent } from "../utils";

describe("Functional Audit & Privacy Verification", () => {
  it("never exposes owner phone numbers in public property objects", () => {
    const rawPublicProperty = {
      id: "prop-123",
      title: "2 BHK Luxury Flat in Baner",
      rentAmount: 32000,
      depositAmount: 70000,
      bhkType: "2_BHK",
      address: "Balewadi High Street, Baner, Pune",
      locality: "Baner",
      owner: {
        id: "owner-999",
        name: "Landlord",
        phone: "+919822012345", // private backend field
      },
    };

    const normalized = normalizeProperty(rawPublicProperty);
    // Ensure public normalized property has no owner contact details
    expect((normalized as any).ownerPhone).toBeUndefined();
    expect((normalized as any).unlockedPhoneNumber).toBeUndefined();
  });

  it("formats dates properly with formatDate utility", () => {
    expect(formatDate("2026-11-23T10:00:00Z")).toContain("2026");
    expect(formatDate("")).toBe("");
    expect(formatDate(undefined)).toBe("");
  });

  it("correctly normalizes property data with missing fields", () => {
    const incompleteProperty = {
      id: "incomplete-1",
      title: "Simple Flat",
    };

    const normalized = normalizeProperty(incompleteProperty);
    expect(normalized.id).toBe("incomplete-1");
    expect(normalized.bhk).toBe("BHK");
    expect(normalized.monthlyRent).toBe(0);
    expect(normalized.securityDeposit).toBe(0);
    expect(getPropertyPhotos(normalized).length).toBeGreaterThan(0);
  });
});
