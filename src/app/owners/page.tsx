import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Award,
  Clock,
  PlusCircle,
  Users,
  Building,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function OwnersLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F1E36] to-[#1A2F50] text-white py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 px-4 py-1.5 text-xs font-bold text-[#C5A059]">
            <Sparkles className="h-4 w-4" /> Zero Commission • ₹500 Cashback on Rent Out
          </span>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Rent Your Flat in Pune West in Under 72 Hours.{" "}
            <span className="text-[#C5A059]">Zero Brokerage.</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop giving away 1 month of hard-earned rent to local brokers. KEYRA connects you directly with verified IT professionals in Hinjewadi, Baner, Wakad, and Balewadi.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/owner/properties/new">
              <Button
                variant="gold"
                size="lg"
                className="w-full sm:w-auto font-heading font-extrabold text-base shadow-gold px-8 h-13"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Post Property for Free
              </Button>
            </Link>
            <Link href="/owner/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-slate-200 bg-white text-[#0F1E36] hover:bg-slate-100 hover:text-[#0F1E36] hover:border-slate-300 font-semibold shadow-sm h-13 transition-colors duration-200"
              >
                Open Owner Dashboard
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#C5A059]" /> 100% Free Listing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#C5A059]" /> Verified KYC Tenants
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#C5A059]" /> ₹500 Direct Reward
            </span>
          </div>
        </div>
      </section>

      {/* 4 Pillars of KEYRA for Landlords */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006A61] bg-[#E6F5F3] px-3 py-1 rounded-full">
              Why Homeowners Choose KEYRA
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#0F1E36]">
              A Superior Rental Experience for Landlords
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              We eliminate broker spam, coordinate tenant visits, and guarantee verified professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-[#C5A059]">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">
                ₹500 Direct Account Cashback
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Unlike brokerage firms that demand a month&apos;s rent, KEYRA rewards you! When your home is rented out through KEYRA, click &quot;Mark as Rented&quot; and receive an instant ₹500 credit.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F5F3] text-[#006A61]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Field Inspection & Verified Badge
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our local field officers physically inspect your property, verify your amenities, take wide-angle photos, and assign the KEYRA Verified Badge so your listing attracts genuine inquiries.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Only Verified Corporate Tenants
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every tenant inquiry is screened with government ID and corporate email verification from Pune IT companies (Infosys, TCS, Wipro, Cognizant, Barclays).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Broker vs KEYRA */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F1E36]">
              Traditional Brokers vs. KEYRA
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              See how much you save when you eliminate middleman fees
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0F1E36] text-white text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4 sm:p-5">Feature</th>
                  <th className="p-4 sm:p-5 text-slate-400">Traditional Broker</th>
                  <th className="p-4 sm:p-5 text-[#C5A059] bg-[#1A2F50]">KEYRA Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Brokerage Fee</td>
                  <td className="p-4 sm:p-5 text-red-600 font-semibold">1 to 2 Months Rent</td>
                  <td className="p-4 sm:p-5 text-[#006A61] font-bold bg-[#E6F5F3]/30">₹0 (Completely Free)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Owner Reward</td>
                  <td className="p-4 sm:p-5 text-slate-400">₹0</td>
                  <td className="p-4 sm:p-5 text-[#C5A059] font-bold bg-[#E6F5F3]/30">₹500 Direct Cashback</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Listing Visibility</td>
                  <td className="p-4 sm:p-5 text-slate-400">Shared with random WhatsApp groups</td>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900 bg-[#E6F5F3]/30">Dedicated Verified Web & Mobile App</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Tenant Background</td>
                  <td className="p-4 sm:p-5 text-slate-400">Unverified callers</td>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900 bg-[#E6F5F3]/30">Verified IT & Corporate Working Professionals</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Privacy Protection</td>
                  <td className="p-4 sm:p-5 text-red-600">Phone leaked to multiple agents</td>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900 bg-[#E6F5F3]/30">Zero Spam & Protected Contact Gate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0F1E36]">
            Ready to Find Your Ideal Tenant?
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            It takes under 3 minutes to post your listing. Join hundreds of satisfied landlords across Baner, Wakad, Hinjewadi, and Balewadi.
          </p>
          <Link href="/owner/properties/new">
            <Button variant="gold" size="lg" className="font-bold shadow-gold px-8 h-12">
              <PlusCircle className="mr-2 h-5 w-5" /> Post Your Property Now (Free)
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
