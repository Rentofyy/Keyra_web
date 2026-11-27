"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { normalizeProperty, formatBhk, deriveLocality, getPropertyPhotos } from "@/lib/property-helper";
import { formatRent, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PropertySummary } from "@/types/property";
import {
  Building2,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Wallet,
  Loader2,
  Lock,
} from "lucide-react";

export default function OwnerDashboardPage() {
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [rentedModalProperty, setRentedModalProperty] = useState<PropertySummary | null>(null);
  const [isMarkingRented, setIsMarkingRented] = useState(false);
  const [rentedSuccess, setRentedSuccess] = useState(false);

  // Fetch owner's properties
  const {
    data: propertyPage,
    isLoading,
    refetch,
  } = useQuery<{ content: PropertySummary[]; totalElements: number }>({
    queryKey: ["owner-properties"],
    queryFn: async () => {
      const res = await apiClient.get<any>("/owner/properties?size=50");
      return res.data;
    },
    enabled: isAuthenticated,
  });

  // Fetch wallet for owner rewards
  const { data: walletData } = useQuery<{ balance: number; referralEarnings?: number }>({
    queryKey: ["owner-wallet"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<any>("/wallet");
        return res.data;
      } catch {
        return { balance: 0 };
      }
    },
    enabled: isAuthenticated,
  });

  const properties: PropertySummary[] = (propertyPage?.content || []).map((p) =>
    normalizeProperty(p)
  );

  const handleMarkAsRented = async () => {
    if (!rentedModalProperty) return;
    setIsMarkingRented(true);
    try {
      await apiClient.patch(`/owner/properties/${rentedModalProperty.id}/rented`);
      setRentedSuccess(true);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to mark property as rented.");
    } finally {
      setIsMarkingRented(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-[#060C18]">
          <Lock className="h-8 w-8 text-[#C5A059]" />
        </div>
        <h2 className="font-heading text-2xl font-extrabold text-[#060C18] mt-4">
          Owner Portal Access
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Please sign in to access your properties, manage listings, and claim your ₹500 rental cashback rewards.
        </p>
        <Button
          variant="gold"
          onClick={() => openAuthModal("/owner/dashboard")}
          className="mt-6 font-bold shadow-gold px-6"
        >
          Sign In to KEYRA
        </Button>
      </div>
    );
  }

  const activeCount = properties.filter(
    (p) =>
      (p.status || (p as any).approvalStatus) === "ACTIVE" ||
      (p.status || (p as any).approvalStatus) === "APPROVED"
  ).length;
  const pendingCount = properties.filter(
    (p) =>
      (p.status || (p as any).approvalStatus) === "PENDING_VERIFICATION" ||
      (p.status || (p as any).approvalStatus) === "PENDING"
  ).length;
  const rentedCount = properties.filter(
    (p) => (p.status || (p as any).approvalStatus) === "RENTED"
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#006A61] bg-[#E6F5F3] px-2.5 py-1 rounded-full">
            Landlord & Owner Central
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#060C18] mt-1.5">
            Owner Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Welcome back, <strong className="text-slate-800">{user?.fullName || user?.phoneNumber}</strong>. Manage your Pune West rental listings.
          </p>
        </div>

        <Link href="/owner/properties/new">
          <Button variant="gold" className="font-bold shadow-gold flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Post New Property</span>
            <span className="text-[10px] bg-[#060C18]/15 px-1.5 py-0.5 rounded font-extrabold">
              FREE
            </span>
          </Button>
        </Link>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Properties
          </span>
          <p className="font-heading text-2xl font-extrabold text-[#060C18] mt-1">
            {properties.length}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Active / Live
          </span>
          <p className="font-heading text-2xl font-extrabold text-emerald-950 mt-1">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-card">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Pending Inspection
          </span>
          <p className="font-heading text-2xl font-extrabold text-amber-950 mt-1">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-card">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Rented Out
          </span>
          <p className="font-heading text-2xl font-extrabold text-slate-800 mt-1">
            {rentedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Cashback Balance
            </span>
            <p className="font-heading text-2xl font-extrabold text-purple-950 mt-1">
              ₹{walletData?.balance || 0}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Cashback Promotion Card */}
      <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#C5A059] text-[#060C18] font-bold">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-heading text-base font-bold text-slate-900">
              ₹500 Direct Account Cashback on Every Deal
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              Once a tenant is placed in your home through KEYRA, simply click &quot;Mark as Rented&quot;. We immediately credit ₹500 to your bank account with zero deductions.
            </p>
          </div>
        </div>
        <Link href="/owners" className="text-xs font-bold text-[#C5A059] hover:underline shrink-0">
          Learn How It Works →
        </Link>
      </div>

      {/* Listings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-[#060C18]">
            My Property Listings
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {properties.length} Listings found
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#C5A059]" />
            <p className="mt-2 text-xs text-slate-500">Loading your properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="font-heading text-lg font-bold text-slate-900 mt-4">
              No Properties Listed Yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t posted any properties on KEYRA yet. List your home in under 3 minutes with zero brokerage.
            </p>
            <Link href="/owner/properties/new">
              <Button variant="gold" className="mt-5 font-bold shadow-gold">
                <PlusCircle className="mr-2 h-4 w-4" /> Post Free Property Listing
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => {
              const bhk = formatBhk(prop.bhkType || prop.bhk);
              const locality = deriveLocality(prop.address, prop.locality);
              const rent = prop.monthlyRent || prop.rentAmount || 0;
              const photos = getPropertyPhotos(prop);
              const status = (
                prop.status ||
                (prop as any).approvalStatus ||
                "ACTIVE"
              ).toUpperCase();

              return (
                <div
                  key={prop.id}
                  className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-card flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Status Badge */}
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      <img
                        src={photos[0]}
                        alt={prop.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        {status === "ACTIVE" || status === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                            <ShieldCheck className="h-3 w-3" /> Live on KEYRA
                          </span>
                        ) : status === "RENTED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Rented Out
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                            <Clock className="h-3 w-3" /> Pending Verification
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="font-heading text-xl font-extrabold text-[#060C18]">
                          {formatRent(rent)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          Deposit: {formatCurrency(prop.depositAmount || prop.securityDeposit || 0)}
                        </span>
                      </div>

                      <h4 className="font-heading text-base font-bold text-slate-900 line-clamp-1">
                        {prop.title || `${bhk} in ${locality}`}
                      </h4>

                      <p className="mt-1 flex items-center text-xs text-slate-500 line-clamp-1">
                        <MapPin className="mr-1 h-3.5 w-3.5 text-[#C5A059] shrink-0" />
                        {prop.address || `${locality}, Pune West`}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between gap-2">
                    <Link href={`/properties/${prop.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs font-bold">
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> View Public
                      </Button>
                    </Link>

                    {status !== "RENTED" && (
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => {
                          setRentedModalProperty(prop);
                          setRentedSuccess(false);
                        }}
                        className="flex-1 text-xs font-bold"
                      >
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Mark Rented
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mark As Rented / Claim Cashback Modal */}
      {rentedModalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-elevated border border-slate-100 text-center">
            {rentedSuccess ? (
              <div className="py-4 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-[#060C18]">
                  Congratulations!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  <strong>{rentedModalProperty.title}</strong> has been marked as <strong>RENTED</strong>.
                  Your ₹500 cashback reward is queued for credit to your registered wallet/bank account!
                </p>
                <Button
                  variant="gold"
                  onClick={() => setRentedModalProperty(null)}
                  className="w-full font-bold mt-4"
                >
                  Awesome, Close
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-[#C5A059]">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-extrabold text-[#060C18]">
                  Mark as Rented & Claim ₹500
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Has <strong>{rentedModalProperty.title}</strong> found its tenant? Marking this property as rented will delist it from public search and trigger your <strong>₹500 owner reward</strong>.
                </p>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 font-semibold text-left">
                  ✓ Instant listing delisting to prevent further tenant calls<br />
                  ✓ ₹500 direct credit to your wallet balance
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setRentedModalProperty(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gold"
                    disabled={isMarkingRented}
                    onClick={handleMarkAsRented}
                    className="flex-1 font-bold shadow-gold"
                  >
                    {isMarkingRented ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Yes, Claim ₹500"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
