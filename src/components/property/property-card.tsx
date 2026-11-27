"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { PropertySummary } from "@/types/property";
import { formatCurrency, formatRent, formatSqft } from "@/lib/utils";
import {
  formatBhk,
  formatFurnishing,
  deriveLocality,
  getPropertyPhotos,
  normalizeProperty,
} from "@/lib/property-helper";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api-client";
import {
  Heart,
  MapPin,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PropertyCardProps {
  property: PropertySummary;
}

export function PropertyCard({ property: rawProperty }: PropertyCardProps) {
  const property = normalizeProperty(rawProperty);
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [isFav, setIsFav] = useState(property.isFavourite || false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Photos guaranteed to be non-empty array of valid URLs
  const photos = getPropertyPhotos(property);

  const bhkLabel = formatBhk(property.bhkType || property.bhk);
  const furnishingLabel = formatFurnishing(property.furnishingStatus);
  const localityLabel = deriveLocality(property.address, property.locality);
  const rent = property.monthlyRent || property.rentAmount || 0;
  const deposit =
    property.securityDeposit ??
    property.depositAmount ??
    (rent > 0 ? rent * 2 : 0);
  const carpetArea = property.carpetAreaSqFt ?? property.carpetAreaSqft;

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const nextState = !isFav;
    setIsFav(nextState);

    try {
      if (nextState) {
        await apiClient.post(`/properties/${property.id}/favourite`);
      } else {
        await apiClient.delete(`/properties/${property.id}/favourite`);
      }
    } catch {
      // Revert on failure
      setIsFav(!nextState);
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (photos.length > 1) {
      setActivePhotoIdx((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (photos.length > 1) {
      setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      openAuthModal(`/properties/${property.id}`);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-card transition-all duration-300 hover:shadow-elevated hover:border-[#C5A059]/40">
      {/* Media Gallery / Image Carousel */}
      <Link
        href={`/properties/${property.id}`}
        onClick={handleDetailsClick}
        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 block cursor-pointer"
      >
        <Image
          src={photos[activePhotoIdx] || photos[0]}
          alt={property.title || "Property Photo"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges: Zero Brokerage & Verified */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0F1E36]/90 px-2.5 py-1 text-[11px] font-bold text-[#C5A059] shadow-sm backdrop-blur-md">
            0% Brokerage
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F5F3]/95 px-2 py-1 text-[10px] font-bold text-[#006A61] shadow-sm backdrop-blur-md border border-[#006A61]/30">
            <ShieldCheck className="h-3 w-3" /> Inspected
          </span>
        </div>

        {/* Top Right: Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
          aria-label="Save Property"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFav ? "fill-red-500 text-red-500" : "text-slate-600"
            }`}
          />
        </button>

        {/* Photo arrows if multiple photos */}
        {photos.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80"
              aria-label="Next photo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Photo dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {photos.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    activePhotoIdx === i ? "w-4 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </Link>

      {/* Property Details Body */}
      <Link
        href={`/properties/${property.id}`}
        onClick={handleDetailsClick}
        className="flex flex-1 flex-col p-4 sm:p-5"
      >
        {/* Price & Deposit Header */}
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F1E36]">
              {formatRent(rent)}
            </span>
            <span className="text-xs font-medium text-slate-500 ml-1">/ month</span>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Deposit: {formatCurrency(deposit)}
          </span>
        </div>

        {/* Title & Society */}
        <h3 className="font-heading text-base font-bold text-slate-900 line-clamp-1 group-hover:text-[#C5A059] transition-colors">
          {property.societyName
            ? `${bhkLabel} in ${property.societyName}`
            : property.title || `${bhkLabel} Flat for Rent`}
        </h3>

        {/* Locality */}
        <p className="mt-1 flex items-center text-xs font-medium text-slate-500 line-clamp-1">
          <MapPin className="mr-1 h-3.5 w-3.5 shrink-0 text-[#C5A059]" />
          {localityLabel}, Pune West
        </p>

        {/* Key Feature Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
            {bhkLabel}
          </span>
          {furnishingLabel && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
              {furnishingLabel}
            </span>
          )}
          {carpetArea && carpetArea > 0 && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
              {formatSqft(carpetArea)}
            </span>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#006A61] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#006A61] animate-pulse" />
            Verified Listing
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F1E36] group-hover:text-[#C5A059] transition-colors">
            View Details <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </div>
  );
}
