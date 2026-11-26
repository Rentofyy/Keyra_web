"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { PropertySummary } from "@/types/property";
import { PropertyCard } from "@/components/property/property-card";
import { normalizeProperty } from "@/lib/property-helper";
import { Button } from "@/components/ui/button";
import { Heart, Compass, Loader2, Lock } from "lucide-react";

export default function FavouritesPage() {
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const { data: pageData, isLoading } = useQuery<{ content: PropertySummary[] }>({
    queryKey: ["user-favourites"],
    queryFn: async () => {
      const res = await apiClient.get<any>("/users/me/favourites?size=50");
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const favourites: PropertySummary[] = (pageData?.content || []).map(normalizeProperty);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <Heart className="h-8 w-8 fill-red-600" />
        </div>
        <h2 className="font-heading text-2xl font-extrabold text-[#0F1E36] mt-4">
          Saved Properties
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Sign in to view and manage your shortlisted homes in Pune West.
        </p>
        <Button
          variant="gold"
          onClick={() => openAuthModal("/favourites")}
          className="mt-6 font-bold shadow-gold px-6"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#006A61] bg-[#E6F5F3] px-2.5 py-1 rounded-full">
          Shortlisted Homes
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F1E36] mt-1.5">
          Saved Properties
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {favourites.length} properties saved to your shortlist
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#C5A059]" />
          <p className="mt-2 text-xs text-slate-500">Loading saved properties...</p>
        </div>
      ) : favourites.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="font-heading text-lg font-bold text-slate-900 mt-4">
            Your Shortlist is Empty
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the heart icon on any property card to save homes for quick comparison and visit scheduling.
          </p>
          <Link href="/properties">
            <Button variant="gold" className="mt-5 font-bold shadow-gold">
              <Compass className="mr-2 h-4 w-4" /> Explore Properties
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
}
