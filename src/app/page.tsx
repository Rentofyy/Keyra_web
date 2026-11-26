"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { PropertySummary } from "@/types/property";
import { PropertyGrid } from "@/components/property/property-grid";
import { normalizeProperty } from "@/lib/property-helper";
import { Button } from "@/components/ui/button";
import {
  PUNE_WEST_LOCALITIES,
  PROPERTY_CATEGORIES,
} from "@/lib/constants";
import {
  Search,
  MapPin,
  ShieldCheck,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle,
  Building,
  Key,
  Users,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [selectedLocality, setSelectedLocality] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("RESIDENTIAL");
  const [searchBhk, setSearchBhk] = useState("");

  // Fetch featured / live properties from backend
  const { data: properties, isLoading } = useQuery<PropertySummary[]>({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ content: PropertySummary[] }>(
          "/properties?page=0&size=6&sort=createdAt,desc"
        );
        const list = res.data?.content || [];
        return list
          .map(normalizeProperty)
          .filter((p: any) => p.status !== "RENTED" && p.approvalStatus !== "RENTED" && p.verificationStatus !== "RENTED");
      } catch {
        return [];
      }
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedLocality) params.set("locality", selectedLocality);
    if (selectedCategory) params.set("category", selectedCategory);
    if (searchBhk) params.set("bhk", searchBhk);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F1E36] via-[#142644] to-[#0F1E36] text-white py-16 sm:py-24">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-white/5 px-4 py-1.5 text-xs font-semibold text-[#C5A059] backdrop-blur-md mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Zero Brokerage • Pune West Micro-Markets</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Verified Homes. Direct Owners.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#E5A93C]">
              Zero Brokerage.
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover physically inspected rental flats, coliving beds, and PG spaces across Baner, Wakad, Hinjewadi, and Balewadi.
          </p>

          {/* Tabbed Search Container */}
          <div className="mt-10 mx-auto max-w-4xl rounded-3xl bg-white p-3 sm:p-4 shadow-elevated text-slate-900 border border-slate-100">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3 mb-3">
              {PROPERTY_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    selectedCategory === cat.value
                      ? "bg-[#0F1E36] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Form Fields Grid */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Locality */}
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-left">
                <MapPin className="h-4 w-4 text-[#C5A059] shrink-0" />
                <div className="w-full">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Locality
                  </label>
                  <select
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">All Pune West</option>
                    {PUNE_WEST_LOCALITIES.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BHK */}
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-left">
                <Building className="h-4 w-4 text-[#C5A059] shrink-0" />
                <div className="w-full">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    BHK
                  </label>
                  <select
                    value={searchBhk}
                    onChange={(e) => setSearchBhk(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">Any BHK</option>
                    <option value="1_RK">1 RK</option>
                    <option value="1_BHK">1 BHK</option>
                    <option value="2_BHK">2 BHK</option>
                    <option value="3_BHK">3 BHK</option>
                    <option value="4_PLUS_BHK">4+ BHK</option>
                  </select>
                </div>
              </div>

              {/* City Lock */}
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-left">
                <div className="w-full">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    City
                  </label>
                  <p className="text-sm font-bold text-slate-800">Pune, MH</p>
                </div>
              </div>

              {/* Search Submit CTA */}
              <Button
                type="submit"
                variant="gold"
                className="h-full min-h-[52px] rounded-xl flex items-center justify-center gap-2 text-sm font-extrabold shadow-gold"
              >
                <Search className="h-4 w-4" />
                <span>Search Homes</span>
              </Button>
            </form>
          </div>

          {/* Micro-market quick tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Popular:</span>
            {["Baner", "Wakad", "Hinjewadi Phase 1", "Balewadi High Street"].map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setSelectedLocality(loc.split(" ")[0]);
                  router.push(`/properties?locality=${loc.split(" ")[0]}`);
                }}
                className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20 hover:text-white transition-colors"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Value Props Strip */}
      <section className="border-y border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F1E36]">
                ₹0
              </span>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Zero Brokerage
              </p>
            </div>
            <div className="p-3 border-l border-slate-200">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#006A61]">
                100%
              </span>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Inspected Properties
              </p>
            </div>
            <div className="p-3 border-l border-slate-200">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#C5A059]">
                3 Free
              </span>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Physical Visits Included
              </p>
            </div>
            <div className="p-3 border-l border-slate-200">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F1E36]">
                15 Days
              </span>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Avg. Rental Closure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Properties Feed */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Handpicked Listings</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0F1E36] mt-1">
              Verified Properties in Pune West
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Direct owner homes with audited electricity bills and physical video walkthroughs.
            </p>
          </div>

          <Link href="/properties">
            <Button variant="outline" size="sm" className="font-semibold text-xs flex items-center gap-1.5">
              <span>View All Properties</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Property Grid */}
        <PropertyGrid properties={properties || []} isLoading={isLoading} />
      </section>

      {/* 4. Owner Callout Section */}
      <section className="bg-gradient-to-r from-[#0F1E36] to-[#1A2F50] text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C5A059]/20 px-3.5 py-1 text-xs font-bold text-[#C5A059]">
                <Key className="h-3.5 w-3.5" /> Landlord & Owner Benefits
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mt-4 leading-tight">
                Rent Your Flat in 15 Days Without Paying 1 Month Brokerage.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                List your property for free on KEYRA. Get verified tenants, assisted property showings, move-in digital condition reports, and ₹500 direct cashback when your home gets rented.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle className="h-4 w-4 text-[#C5A059]" />
                  <span>Free standard listing with up to 5 photos</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle className="h-4 w-4 text-[#C5A059]" />
                  <span>Optional Care Complete plan with dedicated relationship manager</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle className="h-4 w-4 text-[#C5A059]" />
                  <span>Automatic ₹500 wallet cashback credited when marked as rented</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/owner/properties/new">
                  <Button variant="gold" size="lg" className="font-bold">
                    Post Free Property Listing
                  </Button>
                </Link>
                <Link href="/owners">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-200 bg-white text-[#0F1E36] hover:bg-slate-100 hover:text-[#0F1E36] hover:border-slate-300 font-semibold shadow-sm transition-colors duration-200"
                  >
                    Explore Owner Plans
                  </Button>
                </Link>
              </div>
            </div>

            {/* Comparison Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md">
              <h3 className="font-heading text-lg font-bold text-white mb-4">
                Traditional Broker vs. KEYRA Managed Care
              </h3>
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-300">Brokerage Fee</span>
                  <div className="text-right">
                    <span className="text-red-400 line-through mr-2">1 Month Rent (₹25k+)</span>
                    <span className="font-bold text-[#C5A059]">₹0 (Free Plan)</span>
                  </div>
                </div>
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-300">Property Inspection</span>
                  <div className="text-right">
                    <span className="text-red-400 mr-2">None / Unverified</span>
                    <span className="font-bold text-[#0D9488]">Physical Verification</span>
                  </div>
                </div>
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-300">Tenant Screening</span>
                  <div className="text-right">
                    <span className="text-red-400 mr-2">Unfiltered Calls</span>
                    <span className="font-bold text-white">Pre-screened Appointments</span>
                  </div>
                </div>
                <div className="flex items-start justify-between pt-1">
                  <span className="text-slate-300">Cashback Reward</span>
                  <div className="text-right">
                    <span className="font-bold text-[#C5A059]">₹500 Direct Cashback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
