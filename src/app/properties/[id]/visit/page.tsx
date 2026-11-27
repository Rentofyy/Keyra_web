"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { PropertyDetail } from "@/types/property";
import { normalizeProperty, formatBhk, deriveLocality, getPropertyPhotos } from "@/lib/property-helper";
import { formatRent, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  Loader2,
} from "lucide-react";

export default function PropertyVisitPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [visitTimeSlot, setVisitTimeSlot] = useState("10:00 AM - 12:00 PM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch property
  const { data: rawProperty, isLoading } = useQuery<PropertyDetail>({
    queryKey: ["property-visit", propertyId],
    queryFn: async () => {
      const res = await apiClient.get<PropertyDetail>(`/properties/${propertyId}`);
      return res.data;
    },
    enabled: !!propertyId,
  });

  const property = rawProperty ? (normalizeProperty(rawProperty) as PropertyDetail) : null;

  const handleBookVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/tenant/visits", {
        propertyId,
        visitDate,
        timeSlot: visitTimeSlot,
      });
      setIsSuccess(true);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Could not schedule visit. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#C5A059]" />
        <p className="mt-3 text-sm text-slate-500">Loading visit details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-base font-bold text-slate-800">Property listing not found</p>
        <Link href="/properties">
          <Button variant="outline" className="mt-4">
            Browse Properties
          </Button>
        </Link>
      </div>
    );
  }

  const photos = getPropertyPhotos(property);
  const bhk = formatBhk(property.bhkType || property.bhk);
  const locality = deriveLocality(property.address, property.locality);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <Link
        href={`/properties/${propertyId}`}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Property Details
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="font-heading text-2xl font-extrabold text-[#060C18]">
              Visit Requested
            </h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your visit request for &quot;<strong className="text-slate-900">{property.societyName || property.title}</strong>&quot; has been submitted.
            </p>

            {/* Visit summary card matching mobile app */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="h-4 w-4 text-[#C5A059]" />
                <span className="font-semibold">{visitDate}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="h-4 w-4 text-[#C5A059]" />
                <span className="font-semibold">{visitTimeSlot}</span>
              </div>
              <div className="pt-1">
                <span className="inline-block rounded-md bg-amber-100 border border-amber-200/80 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                  Status: REQUESTED (Awaiting Staff Assignment)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We will assign you staff as soon as possible. You can track this request in your visit schedule.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Link href="/tenant/visits" className="w-full sm:w-auto flex-1">
                <Button variant="gold" className="w-full font-bold shadow-gold">
                  View All Visits
                </Button>
              </Link>
              <Link href={`/properties/${propertyId}`} className="w-full sm:w-auto flex-1">
                <Button variant="outline" className="w-full">
                  Back to Property
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookVisit} className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#006A61] bg-[#E6F5F3] px-2.5 py-1 rounded-full">
                Zero Brokerage Visit
              </span>
              <h1 className="font-heading text-2xl font-extrabold text-[#060C18] mt-2">
                Schedule Physical Property Visit
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Inspect before signing. Accompanied by a dedicated KEYRA field executive.
              </p>
            </div>

            {/* Property Snippet Card */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
              <div className="relative h-16 w-20 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                <img
                  src={photos[0]}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm font-bold text-slate-900 truncate">
                  {property.societyName ? `${bhk} in ${property.societyName}` : property.title}
                </p>
                <p className="text-xs text-slate-500 flex items-center mt-0.5">
                  <MapPin className="h-3 w-3 text-[#C5A059] mr-1 shrink-0" />
                  {locality}, Pune West
                </p>
                <p className="font-heading text-xs font-bold text-[#060C18] mt-1">
                  {formatRent(property.monthlyRent || property.rentAmount || 0)}/mo
                </p>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Preferred Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Preferred Time Slot
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2.5">
                {[
                  "10:00 AM - 12:00 PM",
                  "12:00 PM - 02:00 PM",
                  "02:00 PM - 04:00 PM",
                  "04:00 PM - 06:00 PM",
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setVisitTimeSlot(slot)}
                    className={`rounded-xl border p-3 text-xs font-bold transition-all text-center ${
                      visitTimeSlot === slot
                        ? "border-[#060C18] bg-[#060C18] text-white shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5 inline mr-1 opacity-70" />
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Nominal Visit Fee & Guided Tour Explanation */}
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 text-xs space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#060C18] text-[#C5A059]">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Nominal Visit Fee: ₹39</p>
                    <p className="text-[11px] text-amber-800 font-medium">Zero Brokerage • In-Person Guided Home Tour</p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-100 text-amber-900 px-2.5 py-0.5 text-xs font-extrabold">
                  ₹39 / visit
                </span>
              </div>
              <div className="space-y-1.5 text-slate-600 text-[11.5px] leading-relaxed">
                <p className="font-bold text-slate-800">Why a ₹39 visit fee?</p>
                <p>
                  This nominal fee directly covers your <strong>dedicated KEYRA Field Executive</strong> who personally meets you at the property and gives you a complete, unhurried home tour.
                </p>
                <p className="text-slate-500 text-[11px]">
                  It also filters out casual enquiries so the property owner reserves exclusive time for your scheduled walkthrough.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              disabled={isSubmitting}
              className="w-full justify-center h-12 text-sm font-bold shadow-gold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Request...
                </>
              ) : (
                "Submit Visit Request (₹39)"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
