import { describe, it, expect } from "vitest";
import {
  formatBhk,
  formatFurnishing,
  deriveLocality,
  getPropertyPhotos,
  normalizeProperty,
} from "../property-helper";

describe("Property Helper & Defensive Null Safety", () => {
  describe("formatBhk", () => {
    it("handles undefined, null, and empty string without crashing", () => {
      expect(formatBhk(undefined)).toBe("BHK");
      expect(formatBhk(null)).toBe("BHK");
      expect(formatBhk("")).toBe("BHK");
      expect(formatBhk("   ")).toBe("BHK");
    });

    it("formats 2BHK to 2 BHK", () => {
      expect(formatBhk("2BHK")).toBe("2 BHK");
      expect(formatBhk("1RK")).toBe("1 RK");
      expect(formatBhk("3BHK")).toBe("3 BHK");
    });

    it("formats 2_BHK to 2 BHK", () => {
      expect(formatBhk("2_BHK")).toBe("2 BHK");
      expect(formatBhk("4_PLUS_BHK")).toBe("4 PLUS BHK");
    });

    it("preserves Villa and Penthouse names", () => {
      expect(formatBhk("Villa")).toBe("Villa");
      expect(formatBhk("Penthouse")).toBe("Penthouse");
    });
  });

  describe("formatFurnishing", () => {
    it("handles undefined, null, and empty string without crashing", () => {
      expect(formatFurnishing(undefined)).toBe("");
      expect(formatFurnishing(null)).toBe("");
      expect(formatFurnishing("")).toBe("");
    });

    it("formats FULLY_FURNISHED to Fully Furnished", () => {
      expect(formatFurnishing("FULLY_FURNISHED")).toBe("Fully Furnished");
      expect(formatFurnishing("SEMI_FURNISHED")).toBe("Semi Furnished");
      expect(formatFurnishing("UNFURNISHED")).toBe("Unfurnished");
      expect(formatFurnishing("FURNISHED")).toBe("Furnished");
    });
  });

  describe("deriveLocality", () => {
    it("returns explicit locality if present", () => {
      expect(deriveLocality("Some address", "Wakad")).toBe("Wakad");
      expect(deriveLocality("", "Baner")).toBe("Baner");
    });

    it("extracts locality from address when locality is null or empty", () => {
      expect(
        deriveLocality(
          "T13, Blue Ridge Approach Road, Hinjawadi, Maharashtra 411057",
          null
        )
      ).toBe("Hinjewadi");

      expect(
        deriveLocality("5/1, Swati Park, Lalit Estate, Baner, Pune", null)
      ).toBe("Baner");

      expect(
        deriveLocality("Datta Mandir, Wakad, Pune", "")
      ).toBe("Wakad");

      expect(
        deriveLocality("163/19, Wireless Colony, Aundh, Pune", null)
      ).toBe("Aundh");
    });

    it("falls back to Pune West when address has no matched locality", () => {
      expect(deriveLocality("Random Street, Maharashtra", null)).toBe("Pune West");
      expect(deriveLocality(null, null)).toBe("Pune West");
    });
  });

  describe("getPropertyPhotos", () => {
    it("returns valid photos when provided as string URLs", () => {
      const photos = getPropertyPhotos({
        id: "prop-1",
        photos: ["https://example.com/p1.jpg", "https://example.com/p2.jpg"],
      });
      expect(photos).toHaveLength(2);
      expect(photos[0]).toBe("https://example.com/p1.jpg");
    });

    it("prepends host to relative backend photo URLs", () => {
      const photos = getPropertyPhotos({
        id: "prop-2",
        photos: ["/api/v1/properties/123/photos/456/file"],
      });
      expect(photos[0]).toContain("/api/v1/properties/123/photos/456/file");
      expect(photos[0]).toMatch(/^https?:\/\//);
    });

    it("returns deterministic fallback photos when photos is empty or null", () => {
      const photos1 = getPropertyPhotos({ id: "prop-empty-1", photos: [] });
      const photos2 = getPropertyPhotos({ id: "prop-empty-1", photos: null });

      expect(photos1.length).toBeGreaterThanOrEqual(3);
      expect(photos1[0]).toMatch(/^https:\/\/images\.unsplash\.com/);
      // Same ID produces same deterministic photos
      expect(photos1).toEqual(photos2);
    });
  });

  describe("normalizeProperty", () => {
    it("safely normalizes backend property with bhkType, rentAmount, depositAmount", () => {
      const rawBackend = {
        id: "a6a6ae8c-6715-448f-8ed9-52ae027e8a9d",
        title: "2BHK in Blue Ridge",
        bhkType: "2BHK",
        rentAmount: 30000,
        depositAmount: 60000,
        address: "Hinjawadi Phase 1",
        locality: null,
        furnishingStatus: "FURNISHED",
        photos: ["/api/v1/properties/abc/photos/def/file"],
      };

      const normalized = normalizeProperty(rawBackend);
      expect(normalized.id).toBe("a6a6ae8c-6715-448f-8ed9-52ae027e8a9d");
      expect(normalized.bhk).toBe("2 BHK");
      expect(normalized.monthlyRent).toBe(30000);
      expect(normalized.securityDeposit).toBe(60000);
      expect(normalized.locality).toBe("Hinjewadi");
      expect(normalized.furnishingStatus).toBe("Furnished");
    });

    it("safely handles completely empty or missing optional fields without throwing", () => {
      const minimal = {
        id: "sparse-1",
      };

      const normalized = normalizeProperty(minimal);
      expect(normalized.id).toBe("sparse-1");
      expect(normalized.bhk).toBe("BHK");
      expect(normalized.monthlyRent).toBe(0);
      expect(normalized.securityDeposit).toBe(0);
      expect(normalized.furnishingStatus).toBe("");
      expect(normalized.locality).toBe("Pune West");
    });

    it("safely handles null or undefined input object", () => {
      const normalizedNull = normalizeProperty(null);
      expect(normalizedNull.id).toBe("unknown");
      expect(normalizedNull.bhk).toBe("BHK");

      const normalizedUndefined = normalizeProperty(undefined);
      expect(normalizedUndefined.id).toBe("unknown");
    });
  });
});
