import { create } from "zustand";

interface FilterState {
  searchQuery: string;
  locality: string;
  bhk: string;
  minRent: number;
  maxRent: number;
  furnishingStatus: string;
  tenantPreference: string;
  category: string;
  sortBy: string;
  viewMode: "grid" | "map";

  setSearchQuery: (query: string) => void;
  setLocality: (locality: string) => void;
  setBhk: (bhk: string) => void;
  setRentRange: (min: number, max: number) => void;
  setFurnishingStatus: (status: string) => void;
  setTenantPreference: (pref: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sort: string) => void;
  setViewMode: (mode: "grid" | "map") => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: "",
  locality: "",
  bhk: "",
  minRent: 5000,
  maxRent: 150000,
  furnishingStatus: "",
  tenantPreference: "",
  category: "RESIDENTIAL",
  sortBy: "createdAt,desc",
  viewMode: "grid",

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setLocality: (locality) => set({ locality }),
  setBhk: (bhk) => set({ bhk }),
  setRentRange: (minRent, maxRent) => set({ minRent, maxRent }),
  setFurnishingStatus: (furnishingStatus) => set({ furnishingStatus }),
  setTenantPreference: (tenantPreference) => set({ tenantPreference }),
  setCategory: (category) => set({ category }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),

  resetFilters: () =>
    set({
      searchQuery: "",
      locality: "",
      bhk: "",
      minRent: 5000,
      maxRent: 150000,
      furnishingStatus: "",
      tenantPreference: "",
      category: "RESIDENTIAL",
      sortBy: "createdAt,desc",
    }),
}));
