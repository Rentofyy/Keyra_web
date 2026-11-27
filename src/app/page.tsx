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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#060C18] via-[#0A1528] to-[#060C18] text-white py-10 sm:py-16 lg:py-20">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Headline */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            <span className="text-white block">You Find the Home.</span>
            <span className="text-[#C5A059] block mt-1.5 sm:mt-2.5">We Handle the Rest.</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Owner-verified properties. Personally guided home tours. Complete rental assistance from your first visit to move-in.
          </p>

          {/* 3 Compact Feature Highlights */}
          <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto text-center">
            {/* Feature 1 */}
            <div className="group rounded-xl border border-white/10 bg-white/5 py-2 px-1 sm:p-2.5 backdrop-blur-xs transition-all duration-200 hover:border-[#C5A059]/40 hover:bg-white/10 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[#C5A059]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <h3 className="font-heading text-xs sm:text-sm font-bold text-white truncate">Verified Owners</h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 leading-tight truncate">Proof before listing.</p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-xl border border-white/10 bg-white/5 py-2 px-1 sm:p-2.5 backdrop-blur-xs transition-all duration-200 hover:border-[#C5A059]/40 hover:bg-white/10 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[#C5A059]">
                <Users className="h-3.5 w-3.5 shrink-0" />
                <h3 className="font-heading text-xs sm:text-sm font-bold text-white truncate">Guided Tours</h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 leading-tight truncate">KEYRA executives.</p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-xl border border-white/10 bg-white/5 py-2 px-1 sm:p-2.5 backdrop-blur-xs transition-all duration-200 hover:border-[#C5A059]/40 hover:bg-white/10 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[#C5A059]">
                <Key className="h-3.5 w-3.5 shrink-0" />
                <h3 className="font-heading text-xs sm:text-sm font-bold text-white truncate">End-to-End</h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 leading-tight truncate">Rental assistance.</p>
            </div>
          </div>

          {/* Hero CTA & Supporting Text */}
          <div className="mt-5 sm:mt-6 flex flex-col items-center justify-center gap-1.5">
            <Link href="/properties">
              <Button
                variant="gold"
                size="lg"
                className="font-extrabold text-sm sm:text-base px-7 py-3 rounded-full shadow-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Find Your Next Home</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-[10px] sm:text-xs font-bold tracking-widest text-[#C5A059]/90 uppercase mt-0.5">
              A BETTER RENTAL JOURNEY STARTS HERE
            </p>
          </div>

          {/* Tabbed Search Container */}
          <div className="mt-6 sm:mt-8 mx-auto max-w-4xl rounded-3xl bg-white p-3 sm:p-4 shadow-elevated text-slate-900 border border-slate-100">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3 mb-3">
              {PROPERTY_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    selectedCategory === cat.value
                      ? "bg-[#060C18] text-white shadow-sm"
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
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#060C18]">
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
                ₹39
              </span>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Guided Home Tours
              </p>
            </div>
            <div className="p-3 border-l border-slate-200">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#060C18]">
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
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#060C18] mt-1">
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

      {/* 4. Rental Assistance Section (New) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#060C18] via-[#0A1528] to-[#060C18] text-white py-16 sm:py-20 border-t border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>A NEW ERA OF RENTING</span>
          </div>

          {/* Heading */}
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            You Choose the Home. <br className="hidden sm:inline" />
            <span className="text-[#C5A059]">We Handle the Rest.</span>
          </h2>

          {/* Additional Heading */}
          <p className="font-heading text-xl sm:text-2xl font-bold text-slate-100 mt-3">
            No One-Month Brokerage.
          </p>

          {/* Description */}
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Owner-verified properties. Personally guided home tours. Complete rental assistance.
          </p>

          {/* 3 Benefits Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
            {/* Benefit 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:border-[#C5A059]/50 hover:bg-white/10 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C5A059]/20 text-[#C5A059] mb-4">
                <span className="font-heading text-xl font-extrabold">₹0</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                No One-Month Brokerage.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Zero arbitrary broker cuts. Lock your ideal home with flat, transparent pricing and zero percentage commission.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:border-[#C5A059]/50 hover:bg-white/10 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C5A059]/20 text-[#C5A059] mb-4">
                <Users className="h-6 w-6 text-[#C5A059]" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                Personally Guided Tours.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                A dedicated KEYRA executive coordinates appointments, opens doors, and answers your society questions on-site.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:border-[#C5A059]/50 hover:bg-white/10 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C5A059]/20 text-[#C5A059] mb-4">
                <ShieldCheck className="h-6 w-6 text-[#C5A059]" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                Complete Rental Assistance.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                From owner rent negotiation to move-in checklist validation and post-move issue resolution, you never rent alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Twelve-Month Support Section (New) */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FDFBF7] to-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#C5A059]/30 bg-white p-8 sm:p-12 md:p-16 shadow-xl relative overflow-hidden">
            {/* Decorative Top Accent Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-80" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Prominent 12 Months Highlight */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#060C18] text-[#C5A059] px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4 border border-[#C5A059]/40 shadow-xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Tenancy Assurance</span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#060C18] tracking-tight leading-tight">
                  <span className="text-[#C5A059] text-5xl sm:text-6xl md:text-7xl font-black block tracking-normal">
                    12 Months.
                  </span>
                  We&apos;re With You.
                </h2>

                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
                  From move-in to unexpected rental challenges and re-rental assistance, KEYRA stays by your side.
                </p>

                <div className="mt-6 flex items-start gap-2.5 text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-w-md text-left">
                  <ShieldCheck className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>
                    Assistance provided under active KEYRA Tenancy terms and standard service scope.
                  </span>
                </div>
              </div>

              {/* Right Column: 3 Pillars */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 hover:border-[#C5A059]/50 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#060C18] text-[#C5A059] mb-3">
                    <Key className="h-5 w-5" />
                  </div>
                  <h4 className="font-heading text-sm font-bold text-[#060C18] mb-1">
                    Move-In Handover
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Physical key exchange, baseline utility meter records, and move-in inspection verification.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 hover:border-[#C5A059]/50 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#060C18] text-[#C5A059] mb-3">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h4 className="font-heading text-sm font-bold text-[#060C18] mb-1">
                    Rental Challenges
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Single-point coordination for unresolved plumbing, electrical, and structural upkeep with the owner.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 hover:border-[#C5A059]/50 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#060C18] text-[#C5A059] mb-3">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <h4 className="font-heading text-sm font-bold text-[#060C18] mb-1">
                    Re-Rental Support
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Fast-track matching and priority transition support whenever you decide to relocate across Pune.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Owner Callout Section */}
      <section className="bg-gradient-to-r from-[#060C18] to-[#0D182E] text-white py-16">
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
                    className="border-slate-200 bg-white text-[#060C18] hover:bg-slate-100 hover:text-[#060C18] hover:border-slate-300 font-semibold shadow-sm transition-colors duration-200"
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

      {/* 7. Brand Statement Section (New - Before Footer) */}
      <section className="bg-gradient-to-b from-[#0A1528] to-[#060C18] text-white py-16 sm:py-24 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>THE KEYRA STANDARD</span>
          </div>

          <blockquote className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight">
            <span className="text-slate-200 block">Other Platforms Share Contacts.</span>
            <span className="text-[#C5A059] block mt-2 sm:mt-3">KEYRA Takes Responsibility.</span>
          </blockquote>

          <div className="mt-8 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent rounded-full" />
        </div>
      </section>
    </div>
  );
}
