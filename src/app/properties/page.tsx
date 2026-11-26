"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/stores/filter-store";
import { apiClient } from "@/lib/api-client";
import { PropertySummary } from "@/types/property";
import { PropertyGrid } from "@/components/property/property-grid";
import { FilterDrawer } from "@/components/property/filter-drawer";
import { CategoryComingSoon } from "@/components/property/category-coming-soon";
import { normalizeProperty } from "@/lib/property-helper";
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
      params.set("size", "12");
      params.set("sort", sortBy);
      if (locality) params.set("locality", locality);
      if (bhk) params.set("bhk", bhk);
      if (category) params.set("category", category);
      if (furnishingStatus) params.set("furnishingStatus", furnishingStatus);
      if (tenantPreference) params.set("tenantPreference", tenantPreference);

      try {
        const res = await apiClient.get<{
          content: PropertySummary[];
          totalPages: number;
          totalElements: number;
        }>(`/properties?${params.toString()}`);
        return {
          content: (res.data?.content || [])
            .map(normalizeProperty)
            .filter((p: any) => p.status !== "RENTED" && p.approvalStatus !== "RENTED" && p.verificationStatus !== "RENTED"),
          totalPages: res.data?.totalPages || 0,
          totalElements: res.data?.totalElements || 0,
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
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F1E36]">
            Properties for Rent in Pune West
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-[#0F1E36]">{totalCount}</span> verified homes with 0% brokerage
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
              ? "bg-[#0F1E36] text-white"
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
                ? "bg-[#0F1E36] text-white"
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
