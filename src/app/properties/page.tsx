"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/stores/filter-store";
import { apiClient } from "@/lib/api-client";
import { PropertySummary } from "@/types/property";
import { PropertyGrid } from "@/components/property/property-grid";
import { FilterDrawer } from "@/components/property/filter-drawer";
import { CategoryComingSoon } from "@/components/property/category-coming-soon";
import { normalizeProperty, deriveLocality } from "@/lib/property-helper";
import { Button } from "@/components/ui/button";
import {
  PUNE_WEST_LOCALITIES,
  BHK_OPTIONS,
} from "@/lib/constants";
import {
  Filter,
  MapPin,
  Compass,
  ArrowUpDown,
  Search,
  RotateCcw,
} from "lucide-react";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category")?.toUpperCase();
  const isColiving = rawCategory === "COLIVING";
  const isCommercial = rawCategory === "COMMERCIAL";

  const {
    searchQuery,
    setSearchQuery,
    locality,
    setLocality,
    bhk,
    setBhk,
    minRent,
    maxRent,
    furnishingStatus,
    tenantPreference,
    category,
    sortBy,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);

  // Sync URL query parameters on initial page load if provided
  useEffect(() => {
    const urlLocality = searchParams.get("locality");
    const urlBhk = searchParams.get("bhk");
    const urlSearch = searchParams.get("search");

    if (urlLocality && urlLocality !== locality) {
      setLocality(urlLocality);
    }
    if (urlBhk && urlBhk !== bhk) {
      setBhk(urlBhk);
    }
    if (urlSearch && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams, locality, bhk, searchQuery, setLocality, setBhk, setSearchQuery]);

  // If user navigated to Coliving or Commercial, show dedicated Coming Soon UI immediately without querying backend
  if (isColiving || isCommercial) {
    return <CategoryComingSoon category={isColiving ? "COLIVING" : "COMMERCIAL"} />;
  }

  return (
    <ResidentialPropertiesView
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      locality={locality}
      setLocality={setLocality}
      bhk={bhk}
      setBhk={setBhk}
      minRent={minRent}
      maxRent={maxRent}
      furnishingStatus={furnishingStatus}
      tenantPreference={tenantPreference}
      category={category}
      sortBy={sortBy}
      setSortBy={setSortBy}
      resetFilters={resetFilters}
      isFilterDrawerOpen={isFilterDrawerOpen}
      setIsFilterDrawerOpen={setIsFilterDrawerOpen}
      page={page}
      setPage={setPage}
    />
  );
}

function ResidentialPropertiesView({
  searchQuery,
  setSearchQuery,
  locality,
  setLocality,
  bhk,
  setBhk,
  minRent,
  maxRent,
  furnishingStatus,
  tenantPreference,
  category,
  sortBy,
  setSortBy,
  resetFilters,
  isFilterDrawerOpen,
  setIsFilterDrawerOpen,
  page,
  setPage,
}: any) {
  // Reset pagination to first page whenever any filter changes
  useEffect(() => {
    setPage(0);
  }, [locality, bhk, minRent, maxRent, furnishingStatus, tenantPreference, sortBy, setPage]);

  // Fetch properties matching current filter parameters
  const { data, isLoading } = useQuery<{
    content: PropertySummary[];
    totalPages: number;
    totalElements: number;
  }>({
    queryKey: [
      "properties-search",
      locality,
      bhk,
      minRent,
      maxRent,
      furnishingStatus,
      tenantPreference,
      category,
      sortBy,
      page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", "30");
      params.set("sort", sortBy);

      // Search & Locality: pass to both 'search' and 'locality'
      const searchTerms = [locality, searchQuery].filter(Boolean).join(" ").trim();
      if (searchTerms) {
        params.set("search", searchTerms);
        if (locality) params.set("locality", locality);
      }

      // BHK: normalize e.g. "2_BHK" -> "2 BHK", "4_PLUS_BHK" -> "4+ BHK"
      if (bhk) {
        const formattedBhk =
          bhk === "4_PLUS_BHK"
            ? "4+ BHK"
            : bhk.replace("_PLUS_", "+").replace(/_/g, " ");
        params.set("bhkType", formattedBhk);
        params.set("bhk", formattedBhk);
      }

      // Rent Range: pass minPrice/minRent and maxPrice/maxRent
      if (minRent && minRent > 5000) {
        params.set("minPrice", String(minRent));
        params.set("minRent", String(minRent));
      }
      if (maxRent && maxRent < 150000) {
        params.set("maxPrice", String(maxRent));
        params.set("maxRent", String(maxRent));
      }

      // Furnishing: send both FURNISHED and FULLY_FURNISHED compatible
      if (furnishingStatus) {
        const mappedFurnishing =
          furnishingStatus === "FULLY_FURNISHED" ? "FURNISHED" : furnishingStatus;
        params.set("furnishingStatus", mappedFurnishing);
      }

      if (category) {
        params.set("category", category);
      }

      try {
        const res = await apiClient.get<{
          content: PropertySummary[];
          totalPages: number;
          totalElements: number;
        }>(`/properties?${params.toString()}`);

        let list = (res.data?.content || [])
          .map(normalizeProperty)
          .filter(
            (p: any) =>
              p.status !== "RENTED" &&
              p.approvalStatus !== "RENTED" &&
              p.verificationStatus !== "RENTED"
          );

        // Client-side filtering guarantee
        if (locality) {
          const locLower = locality.toLowerCase();
          list = list.filter((p: any) => {
            const derived = deriveLocality(p.address, p.locality).toLowerCase();
            const addr = (p.address || "").toLowerCase();
            const title = (p.title || "").toLowerCase();
            return (
              derived.includes(locLower) ||
              addr.includes(locLower) ||
              title.includes(locLower)
            );
          });
        }

        if (bhk) {
          const targetBhk =
            bhk === "4_PLUS_BHK"
              ? "4"
              : bhk.replace(/_/g, " ").toUpperCase();
          list = list.filter((p: any) => {
            const pBhk = (p.bhkType || p.bhk || "").toUpperCase();
            if (bhk === "4_PLUS_BHK") {
              return (
                pBhk.includes("4") ||
                pBhk.includes("5") ||
                pBhk.includes("6") ||
                pBhk.includes("4+")
              );
            }
            if (bhk === "1_RK") {
              return (
                pBhk.includes("1 RK") ||
                pBhk.includes("1RK") ||
                pBhk.includes("RK")
              );
            }
            const num = targetBhk.replace(/\D/g, "");
            return (
              pBhk.includes(targetBhk) ||
              pBhk.replace(/\s+/g, "").includes(targetBhk.replace(/\s+/g, "")) ||
              (num && pBhk.includes(num))
            );
          });
        }

        if (minRent && minRent > 5000) {
          list = list.filter((p: any) => {
            const rent = p.monthlyRent || p.rentAmount || 0;
            return rent >= minRent;
          });
        }

        if (maxRent && maxRent < 150000) {
          list = list.filter((p: any) => {
            const rent = p.monthlyRent || p.rentAmount || 0;
            return rent <= maxRent;
          });
        }

        if (furnishingStatus) {
          list = list.filter((p: any) => {
            const f = (p.furnishingStatus || "").toUpperCase();
            if (
              furnishingStatus === "FULLY_FURNISHED" ||
              furnishingStatus === "FURNISHED"
            ) {
              return f === "FULLY_FURNISHED" || f === "FURNISHED";
            }
            return f === furnishingStatus.toUpperCase();
          });
        }

        if (tenantPreference && tenantPreference !== "ANY") {
          const pref = tenantPreference.toUpperCase();
          list = list.filter((p: any) => {
            const tp = (p.tenantPreference || "").toUpperCase();
            const rules = (p.rules || "").toUpperCase();
            const desc = (p.description || "").toUpperCase();
            if (tp && tp !== "ANY") return tp.includes(pref);
            if (rules.includes(pref) || desc.includes(pref)) return true;
            return true;
          });
        }

        return {
          content: list,
          totalPages: res.data?.totalPages || 1,
          totalElements: list.length > 0 ? list.length : (res.data?.totalElements || 0),
        };
      } catch {
        return { content: [], totalPages: 0, totalElements: 0 };
      }
    },
  });

  const properties = data?.content || [];
  const totalCount = data?.totalElements || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* 1. Top Bar: Locality Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#060C18]">
            Properties for Rent in Pune West
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-[#060C18]">{totalCount}</span> verified homes with 0% brokerage
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Filter Drawer Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold"
          >
            <Filter className="h-4 w-4 text-[#C5A059]" />
            <span>Filters</span>
            {(locality || bhk || furnishingStatus) && (
              <span className="h-2 w-2 rounded-full bg-[#C5A059]" />
            )}
          </Button>

          {/* Sort By Dropdown */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 mr-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="createdAt,desc">Newest First</option>
              <option value="rentAmount,asc">Rent: Low to High</option>
              <option value="rentAmount,desc">Rent: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Locality Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        <button
          onClick={() => setLocality("")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            !locality
              ? "bg-[#060C18] text-white"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          All Pune West
        </button>
        {PUNE_WEST_LOCALITIES.map((loc) => (
          <button
            key={loc}
            onClick={() => setLocality(loc)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              locality === loc
                ? "bg-[#060C18] text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* 3. Property Grid */}
      <PropertyGrid
        properties={properties}
        isLoading={isLoading}
        onResetFilters={resetFilters}
      />

      {/* 4. Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p: number) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="text-xs font-semibold text-slate-600 px-3">
            Page {page + 1} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p: number) => Math.min(data.totalPages - 1, p + 1))}
            disabled={page >= data.totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-500">
          Loading properties...
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}
