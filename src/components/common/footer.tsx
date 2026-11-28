import Link from "next/link";
import { PUNE_WEST_LOCALITIES } from "@/lib/constants";
import { KeyraLogo } from "@/components/common/keyra-logo";
import { ShieldCheck, MapPin, Phone, Mail, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#060C18] text-white">
      {/* Upper Footer: Value Props */}
      <div className="border-b border-slate-800/80 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#C5A059]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-heading text-base font-semibold text-white">
                  Zero Brokerage Guarantee
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Direct connection with genuine landlords. 100% verified listings with no hidden brokerage fees.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#006A61]">
                <Award className="h-6 w-6 text-[#0D9488]" />
              </div>
              <div>
                <h4 className="font-heading text-base font-semibold text-white">
                  Physical Property Inspection
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Every home is inspected by KEYRA field executives with verified electricity bills and carpet audits.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#C5A059]">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-heading text-base font-semibold text-white">
                  West Pune Specialization
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Deep micro-market dominance across Baner, Wakad, Hinjewadi IT Park, and Balewadi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <KeyraLogo height={42} mode="dark" className="h-10 w-auto" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              KEYRA is Pune&apos;s premier managed real estate rental marketplace. We replace broker harassment with verified homes, scheduled physical visits, and digital rental agreements.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#C5A059]" /> support@keyra.in
              </p>
            </div>
          </div>

          {/* Micro-markets */}
          <div>
            <h5 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#C5A059]">
              Popular Localities
            </h5>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {PUNE_WEST_LOCALITIES.slice(0, 6).map((loc) => (
                <li key={loc}>
                  <Link href={`/properties?locality=${loc}`} className="hover:text-white transition-colors">
                    Flats in {loc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#C5A059]">
              Platform
            </h5>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/properties" className="hover:text-white transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/properties/map" className="hover:text-white transition-colors">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link href="/properties?category=COLIVING" className="hover:text-white transition-colors">
                  Coliving & PGs
                </Link>
              </li>
              <li>
                <Link href="/owner/properties/new" className="hover:text-white transition-colors">
                  Post Free Listing
                </Link>
              </li>
              <li>
                <Link href="/care-plan" className="hover:text-white transition-colors">
                  KEYRA Care Plan
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policy */}
          <div>
            <h5 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#C5A059]">
              Legal & Support
            </h5>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/legal/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/refund" className="hover:text-white transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/legal/delivery" className="hover:text-white transition-colors">
                  Service Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/fair-use" className="hover:text-white transition-colors">
                  Zero Brokerage Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Regulatory Trust Bar (Razorpay Merchant Compliance) */}
        <div className="mt-10 border-t border-slate-800/80 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-300">Accepted Payment Methods:</span>
              <span className="rounded bg-slate-800/90 px-2 py-0.5 text-[11px] text-slate-300">UPI (GPay / PhonePe / Paytm)</span>
              <span className="rounded bg-slate-800/90 px-2 py-0.5 text-[11px] text-slate-300">Visa / MasterCard / RuPay</span>
              <span className="rounded bg-slate-800/90 px-2 py-0.5 text-[11px] text-slate-300">Net Banking (50+ Banks)</span>
              <span className="rounded bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-[11px] text-emerald-400 font-semibold">🔒 Secured by Razorpay</span>
            </div>
            <p className="text-[11px] text-slate-400 text-center md:text-right max-w-md leading-relaxed">
              KEYRA (Merchant: Johnson Abraham) collects nominal platform SaaS software and on-site field verification service fees only. We do not process property rent, security deposits, or brokerage.
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KEYRA. All rights reserved. (Operated by Johnson Abraham, Individual Merchant)</p>
          <p className="mt-2 sm:mt-0">Pune, Maharashtra, India</p>
        </div>
      </div>
    </footer>
  );
}
