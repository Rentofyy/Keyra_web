import { PropertySummary } from "@/types/property";

// High-resolution curated apartment and villa photos (matching Flutter's PropertyMediaHelper)
const APARTMENT_PHOTOS = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502005229762-ee1b2b93e083?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
];

const VILLA_PHOTOS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
];

/**
 * Safely formats any BHK input (e.g. "2BHK", "2_BHK", "Villa", null, undefined)
 * into a human-readable string like "2 BHK" or fallback "BHK".
 */
export function formatBhk(bhk?: string | null): string {
  if (!bhk || typeof bhk !== "string" || !bhk.trim()) {
    return "BHK";
  }

  const trimmed = bhk.trim();

  // If already like "2 BHK" or "Villa", return cleaned
  if (/^\d+\s+BHK$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  // Handle "2BHK" -> "2 BHK", "1RK" -> "1 RK"
  const match = trimmed.match(/^(\d+)\s*([a-zA-Z]+)$/);
  if (match) {
    return `${match[1]} ${match[2].toUpperCase()}`;
  }

  // Handle "2_BHK" or "1_RK"
  if (trimmed.includes("_")) {
    return trimmed.replace(/_/g, " ").toUpperCase();
  }

  return trimmed;
}

/**
 * Safely formats furnishing status (e.g. "FULLY_FURNISHED" -> "Fully Furnished")
 */
export function formatFurnishing(furnishing?: string | null): string {
  if (!furnishing || typeof furnishing !== "string" || !furnishing.trim()) {
    return "";
  }

  const cleaned = furnishing.trim().replace(/_/g, " ").toLowerCase();
  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Derives the micro-market locality from the property address or explicit locality field.
 */
export function deriveLocality(address?: string | null, locality?: string | null): string {
  if (locality && typeof locality === "string" && locality.trim()) {
    return locality.trim();
  }

  if (!address || typeof address !== "string") {
    return "Pune West";
  }

  const addrLower = address.toLowerCase();
  const localities = [
    { key: "baner", label: "Baner" },
    { key: "balewadi", label: "Balewadi" },
    { key: "wakad", label: "Wakad" },
    { key: "hinjawadi", label: "Hinjewadi" },
    { key: "hinjewadi", label: "Hinjewadi" },
    { key: "aundh", label: "Aundh" },
    { key: "bavdhan", label: "Bavdhan" },
    { key: "pimple saudagar", label: "Pimple Saudagar" },
    { key: "pashan", label: "Pashan" },
    { key: "mahalunge", label: "Mahalunge" },
    { key: "tathawade", label: "Tathawade" },
    { key: "ravet", label: "Ravet" },
    { key: "kothrud", label: "Kothrud" },
  ];

  for (const loc of localities) {
    if (addrLower.includes(loc.key)) {
      return loc.label;
    }
  }

  return "Pune West";
}

/**
 * Simple string hash code for deterministic fallback photo selection.
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Extracts and resolves valid photo URLs from any property object.
 * If backend photos are cold, empty, or relative paths, provides deterministic
 * high-resolution Unsplash photos based on the property ID.
 */
export function getPropertyPhotos(property: Partial<PropertySummary>): string[] {
  const result: string[] = [];

  // Check photos array
  if (Array.isArray(property.photos) && property.photos.length > 0) {
    for (const p of property.photos) {
      if (!p) continue;
      const url = typeof p === "string" ? p.trim() : p.url?.trim();
      if (url) {
        // If relative URL (like /api/v1/properties/...), prepend backend host
        if (url.startsWith("/")) {
          const apiHost =
            process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
            "https://keyra-backend-803170070973.asia-south1.run.app";
          result.push(`${apiHost}${url}`);
        } else {
          result.push(url);
        }
      }
    }
  }

  // Check primaryPhotoUrl
  if (result.length === 0 && property.primaryPhotoUrl && typeof property.primaryPhotoUrl === "string") {
    const url = property.primaryPhotoUrl.trim();
    if (url.startsWith("/")) {
      const apiHost =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
        "https://keyra-backend-803170070973.asia-south1.run.app";
      result.push(`${apiHost}${url}`);
    } else {
      result.push(url);
    }
  }

  // If no photos or backend photos are empty, return 3 deterministic high-res photos
  if (result.length === 0) {
    const id = property.id || "keyra-default";
    const hash = hashCode(id);
    const isVilla =
      property.propertyCategory?.toUpperCase() === "VILLA" ||
      property.category?.toUpperCase() === "VILLA" ||
      (property.bhkType?.toUpperCase().includes("VILLA") ?? false);

    const pool = isVilla ? VILLA_PHOTOS : APARTMENT_PHOTOS;
    result.push(pool[hash % pool.length]);
    result.push(pool[(hash + 1) % pool.length]);
    result.push(pool[(hash + 2) % pool.length]);
  }

  return result;
}

/**
 * Normalizes any raw property object from backend API or mock into a clean,
 * fully null-safe PropertySummary with both backend & frontend fields populated.
 */
export function normalizeProperty(raw: any): PropertySummary {
  if (!raw || typeof raw !== "object") {
    return {
      id: "unknown",
      title: "Verified Home",
      address: "Pune West",
      rentAmount: 0,
      monthlyRent: 0,
      depositAmount: 0,
      securityDeposit: 0,
      bhk: "BHK",
      bhkType: "BHK",
      locality: "Pune West",
    };
  }

  const id = String(raw.id || "");
  const title = String(raw.title || "Verified Home in Pune West");
  const address = String(raw.address || "Pune West, Maharashtra");
  const rawLocality = raw.locality ? String(raw.locality) : null;
  const locality = deriveLocality(address, rawLocality);

  const rent = Number(raw.rentAmount ?? raw.monthlyRent ?? 0);
  const deposit = Number(raw.depositAmount ?? raw.securityDeposit ?? rent * 2);

  const rawBhk = raw.bhkType ?? raw.bhk ?? "";
  const bhk = formatBhk(rawBhk);

  const rawFurnishing = raw.furnishingStatus ?? null;
  const furnishingStatus = formatFurnishing(rawFurnishing);

  const carpetArea = Number(raw.carpetAreaSqft ?? raw.carpetAreaSqFt ?? 0) || null;

  const propertyCategory = String(raw.propertyCategory || raw.category || "APARTMENT");

  return {
    ...raw,
    id,
    title,
    address,
    locality,
    rentAmount: rent,
    monthlyRent: rent,
    depositAmount: deposit,
    securityDeposit: deposit,
    bhkType: bhk,
    bhk,
    furnishingStatus,
    carpetAreaSqft: carpetArea,
    carpetAreaSqFt: carpetArea,
    propertyCategory,
    category: propertyCategory,
    status: raw.status || raw.verificationStatus || "ACTIVE",
    isVerified: raw.verificationStatus === "APPROVED" || raw.isVerified !== false,
  };
}
