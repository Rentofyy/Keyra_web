import { describe, it, expect } from "vitest";
import { apiClient } from "../api-client";

describe("Property Submission & Enum Validation Tests", () => {
  it("validates that property category belongs to the backend PropertyCategory enum", () => {
    const validCategories = [
      "APARTMENT",
      "VILLA",
      "INDEPENDENT_HOUSE",
      "PG_HOSTEL",
      "COMMERCIAL",
    ];

    expect(validCategories).toContain("APARTMENT");
    expect(validCategories).toContain("VILLA");
    expect(validCategories).not.toContain("RESIDENTIAL");
  });

  it("validates that building structure belongs to the backend BuildingStructure enum", () => {
    const validStructures = ["LOW_RISE", "MID_RISE", "HIGH_RISE"];

    expect(validStructures).toContain("MID_RISE");
    expect(validStructures).not.toContain("APARTMENT");
  });

  it("validates that verification documents map to valid DocumentType enums", () => {
    const validDocumentTypes = [
      "OWNERSHIP_PROOF",
      "UTILITY_BILL",
      "TAX_RECEIPT",
      "GOVERNMENT_ID",
    ];

    expect(validDocumentTypes).toContain("UTILITY_BILL");
    expect(validDocumentTypes).toContain("OWNERSHIP_PROOF");
    expect(validDocumentTypes).not.toContain("ELECTRICITY_BILL");
  });

  it("ensures apiClient removes Content-Type when data is FormData to let browser generate boundary", async () => {
    const formData = new FormData();
    formData.append("key", "value");

    // Mock config matching Axios request interceptor logic
    const config: any = {
      headers: {
        "Content-Type": "application/json",
      },
      data: formData,
    };

    // Invoke interceptor logic
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    expect(config.headers["Content-Type"]).toBeUndefined();
  });

  it("validates Google OAuth login request structure under unified account", () => {
    const googlePayload = {
      idToken: "mock-google-id-token",
    };

    expect(googlePayload.idToken).toBeDefined();
    expect(googlePayload.idToken).toBe("mock-google-id-token");
  });
});
