"use client";

import Link from "next/link";
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
  Camera,
  Video,
  Calendar,
  Wallet,
  Check,
  HelpCircle,
  FileText,
  Users,
  Search,
} from "lucide-react";

export default function CarePlanPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#060C18] to-[#0A1528] text-white py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:28px_28px] opacity-10" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 px-4 py-1.5 text-xs font-bold text-[#C5A059]">
            <ShieldCheck className="h-4 w-4" /> 100% Zero Brokerage • Direct Owner Plans
          </span>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Transparent Rental Packages. <br className="hidden sm:inline" />
            <span className="text-[#C5A059]">Zero Brokerage Guaranteed.</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From 100% Free basic listings to full-service rental concierge with dedicated relationship managers, professional videography, and inspection audits in Pune.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-slate-200 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" /> ₹500 Direct Account Cashback on Rent Out
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-slate-200 backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Physical Field Verification by KEYRA
            </span>
          </div>

          <div className="pt-2">
            <Link href="/owner/properties/new">
              <Button
                variant="gold"
                className="font-bold shadow-gold px-8 h-12 text-sm sm:text-base"
              >
                Post Your Property Now <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <p className="text-xs text-slate-400 mt-2">
              No payment now • You choose a plan, fill details, and pay securely at final submission
            </p>
          </div>
        </div>
      </section>

      {/* Main 3 Owner Listing Packages (Matching App Screenshots 2, 3, 4) */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C5A059] bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full">
              Owner Listing Packages
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-black text-[#060C18]">
              Select Your Listing Package
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Upgrade your listing visibility, media allowance, and receive assisted physical field visits in Pune.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* 1. KEYRA FREE */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Active Tier
                  </span>
                  <span className="text-xs font-bold text-slate-400">Lifetime Standard</span>
                </div>

                <div>
                  <h3 className="font-heading text-2xl font-black text-[#060C18]">
                    KEYRA FREE
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="font-heading text-4xl font-black text-emerald-600">₹0</span>
                    <span className="text-xs font-bold text-slate-500">/ Free • perpetual</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    5 HD Photos • Free Property Visits • Standard Placement • 0% Brokerage
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Plan Benefits & Quotas:
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>100% Verified Tenant Leads — 0% Brokerage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Up to 5 High-Resolution Property Photos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Standard Locality Discovery & Search Ranking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Free Property Visits & KEYRA Field Executive Coordination</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Biometric Verified Listing Badge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Zero disturbance: KEYRA coordinates all tenant inquiries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Valid indefinitely until rented or deactivated</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link href="/owner/properties/new">
                  <Button variant="outline" className="w-full font-bold h-11 border-slate-300 hover:bg-slate-50">
                    List for Free
                  </Button>
                </Link>
              </div>
            </div>

            {/* 2. KEYRA SMART */}
            <div className="rounded-3xl border border-sky-300 bg-white p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-md">
                    TOP RANKING
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    80% OFF
                  </span>
                </div>

                <div>
                  <h3 className="font-heading text-2xl font-black text-[#060C18]">
                    KEYRA SMART
                  </h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-slate-400 line-through">₹499</span>
                    <span className="font-heading text-4xl font-black text-sky-600">₹99</span>
                    <span className="text-xs font-bold text-slate-500">/ one_time</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    Top Locality Search Ranking • 8 HD Photos • 1 Video (30s) • Rapid Placement
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Plan Benefits & Quotas:
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>Top Locality Search Ranking & High-Visibility Boost</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>Up to 8 HD Photos + 1 Walkthrough Video Tour (30s)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>Up to 5 Ownership Verification Documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>Assisted Property Visits: KEYRA field team accompanies prospective tenants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>High-intent tenant inquiries coordinated by KEYRA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>Golden &ldquo;Verified Direct Owner&rdquo; trust badge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>One-time fee • Active indefinitely until rented</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>100% Zero Brokerage assured</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link href="/owner/properties/new">
                  <Button className="w-full font-bold h-11 bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-500/20">
                    Choose KEYRA SMART (₹99)
                  </Button>
                </Link>
              </div>
            </div>

            {/* 3. KEYRA CARE COMPLETE (FLAGSHIP) */}
            <div className="relative rounded-3xl border-2 border-[#C5A059] bg-gradient-to-b from-[#FFFDF9] via-white to-white p-7 sm:p-8 flex flex-col justify-between shadow-xl shadow-[#C5A059]/15">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#060C18] border border-[#C5A059] px-4 py-1 text-[11px] font-black uppercase tracking-wider text-[#C5A059] shadow-md">
                ★ FLAGSHIP VIP EXCLUSIVE
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#92400E] bg-[#FEF3C7] px-2.5 py-0.5 rounded-md">
                    Full Concierge
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    40% OFF
                  </span>
                </div>

                <div>
                  <h3 className="font-heading text-2xl font-black text-[#060C18]">
                    KEYRA CARE COMPLETE
                  </h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-slate-400 line-through">₹4,999</span>
                    <span className="font-heading text-4xl font-black text-[#C5A059]">₹2,999</span>
                    <span className="text-xs font-bold text-slate-500">/ one_time</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-700 leading-relaxed">
                    Dedicated Sales Team Support • Move-In/Out Inspection • 16 HD Photos • 2 Videos (30s)
                  </p>
                  <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                    Full-service rental concierge for owners and NRIs. Receive a dedicated relationship manager, physical move-in inspection audit, and KEYRA EXCLUSIVE top ranking until your home is rented.
                  </p>
                </div>

                {/* Media & Service Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
                  <div className="flex items-center gap-1.5 rounded-lg bg-amber-50/70 p-2 border border-amber-200/50">
                    <Camera className="h-3.5 w-3.5 text-[#C5A059]" /> Up to 16 HD Photos
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-amber-50/70 p-2 border border-amber-200/50">
                    <Video className="h-3.5 w-3.5 text-[#C5A059]" /> 2 Videos (30s each)
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-amber-50/70 p-2 border border-amber-200/50">
                    <Calendar className="h-3.5 w-3.5 text-[#C5A059]" /> Free Property Visits
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-amber-50/70 p-2 border border-amber-200/50">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" /> 0% Brokerage
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] mb-3">
                    Plan Benefits & What You Get:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#C5A059] stroke-[3] shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-800">KEYRA EXCLUSIVE top priority search placement across Pune</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#C5A059] stroke-[3] shrink-0 mt-0.5" />
                      <span>100% Ad-Free VIP Property Showcase — Never see external ads</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#C5A059] stroke-[3] shrink-0 mt-0.5" />
                      <span>Professional Property Videography — Premium HD video shoot</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#C5A059] stroke-[3] shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-800">Dedicated Relationship Manager & priority leasing concierge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#C5A059] stroke-[3] shrink-0 mt-0.5" />
                      <span>Comprehensive physical Move-In & Move-Out inspection audit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#C5A059] stroke-[3] shrink-0 mt-0.5" />
                      <span>Assisted property visits: KEYRA field team accompanies prospective tenants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#C5A059] stroke-[3] shrink-0 mt-0.5" />
                      <span>Golden &ldquo;Verified Direct Owner&rdquo; trust badge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#C5A059] stroke-[3] shrink-0 mt-0.5" />
                      <span>Tenant background checks & identity pre-screening</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#C5A059] stroke-[3] shrink-0 mt-0.5" />
                      <span>Up to 10 Property & Legal Verification Documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#C5A059] stroke-[3] shrink-0 mt-0.5" />
                      <span>One-time fee per property • Active indefinitely until rented</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#C5A059] stroke-[3] shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-800">100% Zero Brokerage assured — Zero commission ever</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link href="/owner/properties/new">
                  <Button variant="gold" className="w-full font-black h-12 text-sm shadow-gold">
                    Choose KEYRA CARE COMPLETE (₹2,999)
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assisted Deal Closure Concierge Section (Matching App Screenshot 1) */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                On Demand Concierge
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#060C18] mt-2">
                ASSISTED DEAL CLOSURE CONCIERGE
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Full-spectrum legal finalization, lease drafting, biometric registration, and move-in audit.
              </p>
            </div>

            {/* Wallet Cash Benefit Pill */}
            <div className="flex items-center gap-3 rounded-2xl bg-[#060C18] p-4 text-white border border-[#C5A059]/40 shadow-lg shrink-0">
              <div className="p-2.5 rounded-xl bg-[#C5A059]/20 text-[#C5A059]">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  KEYRA WALLET CASH
                </div>
                <div className="text-xl font-black text-[#C5A059]">₹500 Credit</div>
                <div className="text-[11px] text-slate-300">
                  Usable toward Deal Closure (₹9,999 - ₹500 = ₹9,499)
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-slate-200 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Fixed Transparent Concierge Pricing
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-heading text-3xl sm:text-4xl font-black text-[#060C18]">
                    ₹9,999
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    / Per Property Finalization
                  </span>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    ₹500 Wallet Cash Usable
                  </span>
                </div>
              </div>

              <Link href="/properties">
                <Button variant="navy" className="font-bold text-xs h-10 px-5">
                  Explore Verified Homes to Finalize
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6">
              <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-[#060C18]">
                  Expert Rent Negotiation
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Saving up to 1 month rent backed by certified market pricing analytics in Pune West.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#006A61]">
                  <FileCheck className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-[#060C18]">
                  Legal Agreement & Biometrics
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Government-registered e-lease agreement drafting with doorstep biometric verification.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#C5A059]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-[#060C18]">
                  Physical Move-In Inspection
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Detailed room-by-room condition inspection with checklist guarantee protecting your security deposit.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <Wrench className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-[#060C18]">
                  Maintenance Resolution Support
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Single-point dedicated desk for plumbing, electrical, and society move-in resolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#060C18]">
              Side-by-Side Package Comparison
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear quotas, verified benefits, and 0% brokerage on every single tier.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-slate-600">Feature</th>
                    <th className="p-4 sm:p-5 font-extrabold text-slate-900">KEYRA FREE</th>
                    <th className="p-4 sm:p-5 font-extrabold text-sky-600">KEYRA SMART (₹99)</th>
                    <th className="p-4 sm:p-5 font-black text-[#C5A059] bg-amber-50/40">
                      CARE COMPLETE (₹2,999)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">One-Time Fee</td>
                    <td className="p-4 sm:p-5 font-extrabold text-emerald-600">₹0 Free</td>
                    <td className="p-4 sm:p-5 font-extrabold text-sky-600">₹99</td>
                    <td className="p-4 sm:p-5 font-black text-[#C5A059] bg-amber-50/20">₹2,999</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">Validity</td>
                    <td className="p-4 sm:p-5 text-slate-600">Until Rented</td>
                    <td className="p-4 sm:p-5 text-slate-600">Until Rented</td>
                    <td className="p-4 sm:p-5 font-bold text-slate-900 bg-amber-50/20">Active Until Rented</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">HD Photographs</td>
                    <td className="p-4 sm:p-5 text-slate-600">Up to 5 Photos</td>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800">Up to 8 Photos</td>
                    <td className="p-4 sm:p-5 font-black text-[#C5A059] bg-amber-50/20">Up to 16 HD Photos</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">Walkthrough Videos</td>
                    <td className="p-4 sm:p-5 text-slate-400">—</td>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800">1 Video (30s)</td>
                    <td className="p-4 sm:p-5 font-black text-[#C5A059] bg-amber-50/20">2 Videos (30s each)</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">Locality Search Placement</td>
                    <td className="p-4 sm:p-5 text-slate-600">Standard Placement</td>
                    <td className="p-4 sm:p-5 font-bold text-sky-700">Top Locality Ranking</td>
                    <td className="p-4 sm:p-5 font-black text-[#C5A059] bg-amber-50/20">KEYRA EXCLUSIVE Priority</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">Dedicated Relationship Manager</td>
                    <td className="p-4 sm:p-5 text-slate-400">—</td>
                    <td className="p-4 sm:p-5 text-slate-400">—</td>
                    <td className="p-4 sm:p-5 font-black text-emerald-600 bg-amber-50/20">✓ Full Concierge Support</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">Professional HD Videography Shoot</td>
                    <td className="p-4 sm:p-5 text-slate-400">—</td>
                    <td className="p-4 sm:p-5 text-slate-400">—</td>
                    <td className="p-4 sm:p-5 font-black text-emerald-600 bg-amber-50/20">✓ Included On-Site</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">Move-In & Move-Out Inspection Audit</td>
                    <td className="p-4 sm:p-5 text-slate-400">—</td>
                    <td className="p-4 sm:p-5 text-slate-400">—</td>
                    <td className="p-4 sm:p-5 font-black text-emerald-600 bg-amber-50/20">✓ Checklist Guarantee</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">Assisted Field Visits for Tenants</td>
                    <td className="p-4 sm:p-5 font-semibold text-slate-700">✓ Accompanied</td>
                    <td className="p-4 sm:p-5 font-semibold text-slate-700">✓ Accompanied</td>
                    <td className="p-4 sm:p-5 font-black text-[#C5A059] bg-amber-50/20">✓ Priority Accompanied</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">Zero Brokerage Guarantee</td>
                    <td className="p-4 sm:p-5 font-extrabold text-emerald-600">✓ 0% Brokerage</td>
                    <td className="p-4 sm:p-5 font-extrabold text-emerald-600">✓ 0% Brokerage</td>
                    <td className="p-4 sm:p-5 font-extrabold text-emerald-600 bg-amber-50/20">✓ 0% Brokerage</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods & Fee Transparency Disclosure (Razorpay Merchant Compliance) */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#006A61] bg-[#E6F5F3] px-3 py-1 rounded-full">
              Payment &amp; Fee Transparency
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#060C18]">
              Why We Charge &amp; Accepted Payment Methods
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear breakdown of platform service charges. Zero rent collection or brokerage transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: What We Charge For */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-7 space-y-4">
              <h3 className="font-heading text-base font-bold text-[#060C18] flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#C5A059]" /> Nominal Platform Service Fees
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                KEYRA Technologies Pvt. Ltd. provides digital workflow software and on-site property concierge services in Pune. Our fees cover legitimate field operations and verified digital listing hosting:
              </p>
              <ul className="text-xs text-slate-700 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#060C18] shrink-0">• ₹39 Visit Coordination:</span>
                  <span>Covers our field executive accompanying a prospective tenant for a guided walkthrough and filtering casual inquiries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#060C18] shrink-0">• ₹99 / ₹2,999 Listing Packages:</span>
                  <span>One-time SaaS listing enhancements, HD videography, carpet area audits, and dedicated relationship manager support.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#060C18] shrink-0">• ₹9,999 Deal Concierge:</span>
                  <span>Legal rental agreement drafting on stamp paper and physical move-in condition audits.</span>
                </li>
              </ul>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-[11.5px] text-emerald-800 font-medium">
                <strong>Zero Rent &amp; Zero Brokerage:</strong> KEYRA never collects property rent, security deposits, or brokerage fees through Razorpay. All rental payments occur directly between landlords and tenants.
              </div>
            </div>

            {/* Right: Accepted Payment Methods */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-heading text-base font-bold text-[#060C18] flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-600" /> Secure Payment Methods
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All transactions are processed through Razorpay Payment Gateway with end-to-end 256-bit SSL encryption. We accept:
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-white p-3 border border-slate-200 space-y-1">
                    <span className="font-bold text-[#060C18] block">UPI Payments</span>
                    <span className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM &amp; Cred</span>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200 space-y-1">
                    <span className="font-bold text-[#060C18] block">Cards</span>
                    <span className="text-[11px] text-slate-500">Visa, MasterCard, RuPay &amp; Diners Club</span>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200 space-y-1">
                    <span className="font-bold text-[#060C18] block">Net Banking</span>
                    <span className="text-[11px] text-slate-500">50+ Indian banks including HDFC, ICICI, SBI</span>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200 space-y-1">
                    <span className="font-bold text-[#060C18] block">Instant Invoicing</span>
                    <span className="text-[11px] text-slate-500">GST compliant tax invoices for all purchases</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200/80 flex items-center justify-between">
                <span>Certified PCI-DSS Level 1 Compliant</span>
                <Link href="/legal/delivery" className="font-bold text-[#C5A059] hover:underline">
                  View Service Delivery Policy →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#060C18]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to know about KEYRA owner plans and rental assistance.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-1.5">
              <h3 className="font-bold text-sm text-[#060C18] flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#C5A059]" /> When do I pay for my listing plan?
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                There is no payment required upfront. You select your plan, fill in your property configuration, locality, and photos first. Payment is collected securely via Razorpay only at the final submission step once you confirm your listing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-1.5">
              <h3 className="font-bold text-sm text-[#060C18] flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#C5A059]" /> Is brokerage really 0% on all plans?
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                Yes, 100% Zero Brokerage is guaranteed on all KEYRA plans. Neither owners nor tenants pay traditional brokerage fees of 1 month rent.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-1.5">
              <h3 className="font-bold text-sm text-[#060C18] flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#C5A059]" /> What is the ₹500 Cashback on Rent Out?
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                When a verified tenant finalizes their lease for your property through KEYRA, we directly credit ₹500 to your bank account or KEYRA wallet as a thank-you reward for listing with us.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-1.5">
              <h3 className="font-bold text-sm text-[#060C18] flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#C5A059]" /> How long does KEYRA CARE COMPLETE stay active?
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                The ₹2,999 fee is a one-time charge per property listing. It remains active indefinitely with top priority placement, dedicated relationship management, and videography until your home is rented out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-gradient-to-r from-[#060C18] via-[#0A1528] to-[#060C18] py-12 text-white border-t border-[#C5A059]/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="font-heading text-2xl sm:text-3xl font-black">
            Ready to list your home with Pune&apos;s verified rental platform?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join hundreds of satisfied owners across Baner, Wakad, Balewadi, Hinjewadi, and Pune West.
          </p>
          <div className="pt-2">
            <Link href="/owner/properties/new">
              <Button variant="gold" className="font-black shadow-gold px-8 h-12 text-sm">
                Get Started with Your Listing <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
