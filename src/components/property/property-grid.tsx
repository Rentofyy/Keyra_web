import { PropertySummary } from "@/types/property";
import { PropertyCard } from "./property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeProperty } from "@/lib/property-helper";

interface PropertyGridProps {
  properties: PropertySummary[];
  isLoading?: boolean;
  onResetFilters?: () => void;
}

export function PropertyGrid({
  properties,
  isLoading,
  onResetFilters,
}: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-card"
          >
            <Skeleton className="aspect-[16/10] w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-card my-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-[#C5A059] mb-4">
          <SearchX className="h-8 w-8" />
        </div>
        <h3 className="font-heading text-xl font-bold text-[#0F1E36]">
          No Verified Properties Found
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          We couldn&apos;t find any homes matching your selected locality or filters. Try adjusting your budget or clearing filters.
        </p>
        {onResetFilters && (
          <Button
            variant="gold"
            size="sm"
            onClick={onResetFilters}
            className="mt-6 font-semibold"
          >
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, idx) => (
        <PropertyCard
          key={property?.id || idx}
          property={normalizeProperty(property)}
        />
      ))}
    </div>
  );
}
