"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Award,
  Wrench,
  FileCheck,
  HeartHandshake,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface PlanItem {
  code: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: string;
  maxPhotos: number;
  maxVideos: number;
  isDefault: boolean;
}

export default function CarePlanPage() {
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const { data: plans, isLoading } = useQuery<PlanItem[]>({
    queryKey: ["care-plans"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<PlanItem[]>("/subscriptions/plans");
        return res.data;
      } catch {
        return [];
      }
    },
  });

  const handleSelectPlan = (code: string) => {
    if (!isAuthenticated) {
      openAuthModal(`/care-plan?selected=${code}`);
      return;
    }
    alert(`Thank you for selecting the ${code} Plan! Our concierge manager will connect to activate your coverage.`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#060C18] to-[#0A1528] text-white py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#006A61_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#006A61]/40 bg-[#006A61]/20 px-4 py-1.5 text-xs font-bold text-teal-300">
            <ShieldCheck className="h-4 w-4" /> Comprehensive Rental Peace of Mind
          </span>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            KEYRA Care Plan: Complete Protection for Tenants & Owners
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From verified move-in deep cleaning to 24/7 emergency maintenance and deposit dispute resolution, KEYRA Care ensures your rental stay in Pune West is smooth and protected.
          </p>
        </div>
      </section>

      {/* 4 Pillars of Coverage */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006A61] bg-[#E6F5F3] px-3 py-1 rounded-full">
              Full Spectrum Protection
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#060C18]">
              What&apos;s Included in KEYRA Care?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Everything required to live comfortably and prevent landlord-tenant friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F5F3] text-[#006A61]">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                24/7 Home Maintenance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Emergency plumbing, electrical faults, and AC water leakage attended within 4 hours by certified technicians.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[#C5A059]">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Deep Sanitization & Cleaning
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complimentary 5-star professional deep cleaning of kitchen, bathrooms, and balcony before your move-in.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#006A61]">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Digital Agreement & Biometrics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Legally binding registered e-lease agreement with doorstep biometric verification & stamp duty assistance.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Deposit Dispute Mediation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Objective condition report at move-in and move-out ensures 100% fair security deposit refunds with zero unfair deductions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#060C18]">
              Choose Your Protection Tier
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Transparent, subscription-backed protection with zero hidden costs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Free Starter */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Standard Access
                </span>
                <h3 className="font-heading text-2xl font-extrabold text-slate-900 mt-1">
                  Free Starter
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500">/ forever</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Ideal for casual home search in Pune West.
                </p>

                <ul className="mt-6 space-y-3 text-xs font-medium text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#006A61] shrink-0" />
                    Personally Guided Property Visits (₹39)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#006A61] shrink-0" />
                    Zero Brokerage on All Listings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#006A61] shrink-0" />
                    Verified Inspection Badges
                  </li>
                </ul>
              </div>

              <Link href="/properties">
                <Button variant="outline" className="w-full font-bold">
                  Explore Free Listings
                </Button>
              </Link>
            </div>

            {/* Tier 2: KEYRA Care (Popular) */}
            <div className="relative rounded-3xl border-2 border-[#C5A059] bg-white p-8 flex flex-col justify-between space-y-6 shadow-elevated">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#C5A059] px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#060C18]">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  Total Coverage
                </span>
                <h3 className="font-heading text-2xl font-extrabold text-[#060C18] mt-1">
                  KEYRA Care Plan
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-extrabold text-[#060C18]">₹499</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Full concierge assistance, maintenance, and dispute protection.
                </p>

                <ul className="mt-6 space-y-3 text-xs font-semibold text-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C5A059] shrink-0" />
                    Unlimited Accompanied Physical Visits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C5A059] shrink-0" />
                    Complimentary Move-in Deep Cleaning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C5A059] shrink-0" />
                    24/7 Emergency Home Repairs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C5A059] shrink-0" />
                    100% Guaranteed Deposit Mediation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C5A059] shrink-0" />
                    Biometric Registered Agreement Assistance
                  </li>
                </ul>
              </div>

              <Button
                variant="gold"
                onClick={() => handleSelectPlan("CARE_PLAN")}
                className="w-full font-bold shadow-gold h-11"
              >
                Activate KEYRA Care
              </Button>
            </div>

            {/* Tier 3: Owner Pro */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#006A61]">
                  Landlord Acceleration
                </span>
                <h3 className="font-heading text-2xl font-extrabold text-slate-900 mt-1">
                  Owner Premium
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-extrabold text-slate-900">₹999</span>
                  <span className="text-xs text-slate-500">/ one-time</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Accelerated 48-hour tenant placement for landlords.
                </p>

                <ul className="mt-6 space-y-3 text-xs font-medium text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#006A61] shrink-0" />
                    Featured Top-of-Search Placement
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#006A61] shrink-0" />
                    Professional HD Photography & Video Tour
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#006A61] shrink-0" />
                    Field Executive Accompanied Tenant Tours
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#006A61] shrink-0" />
                    ₹500 Instant Cashback on Rent Out
                  </li>
                </ul>
              </div>

              <Link href="/owner/properties/new">
                <Button variant="navy" className="w-full font-bold">
                  List as Premium Owner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
