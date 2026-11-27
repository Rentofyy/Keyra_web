"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  Sparkles,
  ShieldCheck,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Bell,
  Home,
  Check,
  Compass,
} from "lucide-react";

interface CategoryComingSoonProps {
  category: "COLIVING" | "COMMERCIAL";
}

export function CategoryComingSoon({ category }: CategoryComingSoonProps) {
  const [contactInput, setContactInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isColiving = category === "COLIVING";

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) return;

    setIsSubmitting(true);
    // Simulate brief client-side submission & persist in local storage
    setTimeout(() => {
      try {
        const key = `keyra_waitlist_${category.toLowerCase()}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.push({
          contact: contactInput.trim(),
          category,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem(key, JSON.stringify(existing));
      } catch (err) {
        // Ignore localStorage error
      }
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Category Navigation Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
        <Link
          href="/properties"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:border-[#060C18] hover:text-[#060C18] transition-all shadow-sm"
        >
          <Home className="h-4 w-4 text-slate-400" />
          <span>Residential Flats</span>
        </Link>
        <Link
          href="/properties?category=COLIVING"
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all shadow-sm ${
            isColiving
              ? "bg-[#060C18] text-white border-[#060C18] shadow-md"
              : "border-slate-200 bg-white text-slate-700 hover:border-[#060C18]"
          }`}
        >
          <Users className={`h-4 w-4 ${isColiving ? "text-[#C5A059]" : "text-slate-400"}`} />
          <span>Coliving & Shared Spaces</span>
        </Link>
        <Link
          href="/properties?category=COMMERCIAL"
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all shadow-sm ${
            !isColiving
              ? "bg-[#060C18] text-white border-[#060C18] shadow-md"
              : "border-slate-200 bg-white text-slate-700 hover:border-[#060C18]"
          }`}
        >
          <Building2 className={`h-4 w-4 ${!isColiving ? "text-[#C5A059]" : "text-slate-400"}`} />
          <span>Commercial & Offices</span>
        </Link>
      </div>

      {/* Main Coming Soon Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#C5A059]/30 bg-gradient-to-b from-white via-[#FDFBF7] to-[#F4EBD9]/30 p-8 sm:p-12 md:p-16 shadow-xl text-center">
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-80" />

        {/* Brand Icon Header */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#060C18] to-[#0A1528] text-[#C5A059] shadow-lg shadow-[#060C18]/15 ring-4 ring-[#F4EBD9]">
          {isColiving ? <Users className="h-10 w-10" /> : <Building2 className="h-10 w-10" />}
        </div>

        {/* Coming Soon Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#060C18] text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-4 border border-[#C5A059]/40 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
          <span>Coming Soon to Pune West</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#060C18] tracking-tight max-w-2xl mx-auto">
          {isColiving ? (
            <>
              Zero-Brokerage <span className="text-[#C5A059]">Coliving</span> Is On The Way
            </>
          ) : (
            <>
              Managed <span className="text-[#C5A059]">Commercial Spaces</span> Are On The Way
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          {isColiving
            ? "We're curating 100% verified shared apartments, executive PGs, and student-friendly coliving spaces in Hinjewadi, Baner, Wakad, and Balewadi with zero brokerage and verified flatmates."
            : "Premium managed office spaces, tech park workspaces, and retail showrooms across Hinjewadi Phase 1-3, Balewadi High Street, and Baner are launching soon with 0% brokerage."}
        </p>

        {/* Micro-markets covered badge */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 bg-white/80 py-2 px-4 rounded-2xl border border-slate-200/80">
          <MapPin className="h-3.5 w-3.5 text-[#C5A059] shrink-0" />
          <span className="font-semibold text-slate-700">Initial Launch Corridors:</span>
          <span>Hinjewadi IT Park</span>
          <span>•</span>
          <span>Baner</span>
          <span>•</span>
          <span>Balewadi High Street</span>
          <span>•</span>
          <span>Wakad</span>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-10 text-left">
          {isColiving ? (
            <>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2 hover:border-[#C5A059]/60 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F5F3] text-[#006A61]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-sm font-bold text-[#060C18]">100% Verified Flatmates</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Background-checked professionals and verified students for safe, community-driven shared living.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2 hover:border-[#C5A059]/60 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EBD9] text-[#C5A059]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-sm font-bold text-[#060C18]">Zero Brokerage Guaranteed</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No 1-month brokerage or hidden broker fees. Direct transparent leases with genuine space owners.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2 hover:border-[#C5A059]/60 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#060C18]/5 text-[#060C18]">
                  <Home className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-sm font-bold text-[#060C18]">Move-In Ready Setups</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  High-speed WiFi, regular housekeeping, fully equipped kitchens, and power backup included.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2 hover:border-[#C5A059]/60 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EBD9] text-[#C5A059]">
                  <Building2 className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-sm font-bold text-[#060C18]">Tech Parks & Prime High Streets</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bare shells, warm shells, and fully plug-and-play offices in certified Pune West commercial towers.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2 hover:border-[#C5A059]/60 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F5F3] text-[#006A61]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-sm font-bold text-[#060C18]">Direct Owner Terms</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Zero commission on commercial leases. Transparent lock-in periods and verified landlord titles.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2 hover:border-[#C5A059]/60 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#060C18]/5 text-[#060C18]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-sm font-bold text-[#060C18]">Assisted Commercial Closure</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  KEYRA assisted physical walkthroughs, floor plan audits, fit-out negotiation, and legal registration.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Priority Early Access Card */}
        <div className="mt-10 rounded-2xl bg-[#060C18] p-6 sm:p-8 text-white max-w-xl mx-auto shadow-md">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2 text-center animate-in fade-in-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="font-heading text-lg font-bold text-white">
                You&apos;re on the Priority Waitlist!
              </h4>
              <p className="text-xs text-slate-300 max-w-sm">
                Thank you! We will notify you directly when verified {isColiving ? "Coliving & Shared" : "Commercial & Office"} spaces launch in Pune West.
              </p>
            </div>
          ) : (
            <form onSubmit={handleNotifySubmit} className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-wider text-[#C5A059] uppercase">
                <Bell className="h-4 w-4" />
                <span>Get Notified on Launch</span>
              </div>
              <h4 className="font-heading text-lg font-bold text-white">
                Be the first to access verified {isColiving ? "Coliving" : "Commercial"} spaces
              </h4>
              <p className="text-xs text-slate-300">
                Enter your phone or email to receive priority access and an exclusive launch offer.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-2">
                <input
                  type="text"
                  placeholder="Enter phone number or email"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  required
                  className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 border border-white/20 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
                <Button
                  type="submit"
                  variant="gold"
                  disabled={isSubmitting}
                  className="px-6 py-3 font-bold text-sm shrink-0 shadow-gold"
                >
                  {isSubmitting ? "Submitting..." : "Notify Me"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom CTA to browse active residential properties */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/properties">
            <Button
              variant="outline"
              size="lg"
              className="text-sm font-bold border-slate-300 hover:border-[#060C18] hover:bg-slate-50 text-[#060C18]"
            >
              <Compass className="mr-2 h-4 w-4 text-[#C5A059]" />
              Browse 90+ Live Residential Homes
            </Button>
          </Link>
          <Link href="/properties/map">
            <Button
              variant="ghost"
              size="lg"
              className="text-sm font-semibold text-slate-600 hover:text-[#060C18]"
            >
              <MapPin className="mr-2 h-4 w-4 text-slate-400" />
              View Map of Pune West
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
