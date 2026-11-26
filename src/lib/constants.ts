export const PUNE_WEST_LOCALITIES = [
  "Baner",
  "Balewadi",
  "Wakad",
  "Hinjewadi",
  "Aundh",
  "Bavdhan",
  "Pimple Saudagar",
  "Pashan",
  "Mahalunge",
  "Tathawade",
  "Ravet",
] as const;

export type Locality = (typeof PUNE_WEST_LOCALITIES)[number];

export const BHK_OPTIONS = [
  { label: "1 RK", value: "1_RK" },
  { label: "1 BHK", value: "1_BHK" },
  { label: "2 BHK", value: "2_BHK" },
  { label: "3 BHK", value: "3_BHK" },
  { label: "4+ BHK", value: "4_PLUS_BHK" },
] as const;

export const FURNISHING_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Furnished", value: "FULLY_FURNISHED" },
  { label: "Semi-Furnished", value: "SEMI_FURNISHED" },
  { label: "Unfurnished", value: "UNFURNISHED" },
] as const;

export const TENANT_PREFERENCES = [
  { label: "Anyone", value: "ANY" },
  { label: "Family", value: "FAMILY" },
  { label: "Bachelors", value: "BACHELORS" },
  { label: "Company Lease", value: "COMPANY" },
] as const;

export const PROPERTY_CATEGORIES = [
  { label: "Family Flats", value: "RESIDENTIAL", desc: "Apartments & Gated Societies" },
  { label: "Coliving & Flatmates", value: "COLIVING", desc: "Shared Flats in Hinjewadi & Baner" },
  { label: "PG Accommodations", value: "PG", desc: "Meals Included & Zero Brokerage" },
  { label: "Commercial", value: "COMMERCIAL", desc: "Offices & Retail Shops" },
] as const;

export const PUNE_COORDINATES = {
  lat: 18.5714,
  lng: 73.7667,
  zoom: 13,
};
