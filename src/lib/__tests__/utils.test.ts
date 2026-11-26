import { describe, it, expect } from "vitest";
import { formatCurrency, formatRent, formatSqft, cn } from "../utils";

describe("Utility Functions", () => {
  it("formats Indian currency correctly", () => {
    expect(formatCurrency(28000)).toMatch(/₹\s*28,000/);
    expect(formatCurrency(9999)).toMatch(/₹\s*9,999/);
  });

  it("formats rent in compact notation", () => {
    expect(formatRent(25000)).toBe("₹25k");
    expect(formatRent(120000)).toBe("₹1.2L");
    expect(formatRent(800)).toBe("₹800");
  });

  it("formats carpet area correctly", () => {
    expect(formatSqft(950)).toBe("950 sq.ft.");
    expect(formatSqft(1250)).toBe("1,250 sq.ft.");
    expect(formatSqft(undefined)).toBe("N/A");
  });

  it("merges tailwind class names properly", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    expect(cn("p-4", false && "hidden", "text-white")).toBe("p-4 text-white");
  });
});
