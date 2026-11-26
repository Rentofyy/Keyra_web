"use client";

import { useFilterStore } from "@/stores/filter-store";
import {
  PUNE_WEST_LOCALITIES,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  TENANT_PREFERENCES,
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Filter, X, RotateCcw } from "lucide-react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const {
    locality,
    setLocality,
    bhk,
    setBhk,
    minRent,
    maxRent,
    setRentRange,
    furnishingStatus,
    setFurnishingStatus,
    tenantPreference,
    setTenantPreference,
    resetFilters,
  } = useFilterStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-in fade-in-50">
      <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#C5A059]" />
              <h3 className="font-heading text-lg font-bold text-[#0F1E36]">
                Filters
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Locality */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Locality (Pune West)
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-medium text-slate-900 focus:border-[#C5A059] focus:outline-none"
              >
                <option value="">All Pune West Localities</option>
                {PUNE_WEST_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* BHK Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                BHK Type
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setBhk("")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    !bhk
                      ? "bg-[#0F1E36] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Any
                </button>
                {BHK_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setBhk(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      bhk === opt.value
                        ? "bg-[#0F1E36] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rent Range */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Monthly Rent Range
                </label>
                <span className="text-xs font-extrabold text-[#0F1E36]">
                  {formatCurrency(minRent)} – {formatCurrency(maxRent)}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={150000}
                step={5000}
                value={maxRent}
                onChange={(e) => setRentRange(minRent, Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹5,000</span>
                <span>₹1,50,000+</span>
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Furnishing
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FURNISHING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFurnishingStatus(opt.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-center transition-colors ${
                      furnishingStatus === opt.value
                        ? "bg-[#0F1E36] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tenant Preference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Tenant Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TENANT_PREFERENCES.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTenantPreference(opt.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-center transition-colors ${
                      tenantPreference === opt.value
                        ? "bg-[#0F1E36] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 pt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="flex-1 text-xs font-semibold"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
          <Button
            variant="gold"
            onClick={onClose}
            className="flex-1 text-xs font-semibold"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
