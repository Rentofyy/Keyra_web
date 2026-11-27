"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { PropertyDetail } from "@/types/property";
import { formatCurrency, formatRent, formatSqft, loadRazorpayScript } from "@/lib/utils";
import {
  formatBhk,
  formatFurnishing,
  deriveLocality,
  getPropertyPhotos,
  normalizeProperty,
} from "@/lib/property-helper";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyFinalizationModal } from "@/components/property/property-finalization-modal";
import {
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Building,
  Check,
  Award,
  Sparkles,
  CheckCircle2,
  X,
  Loader2,
  Lock,
} from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const { isAuthenticated, openAuthModal, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [isFinalizedByMe, setIsFinalizedByMe] = useState(false);
  const [isFav, setIsFav] = useState(false);

  // Visit Scheduling Modal State
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [visitTimeSlot, setVisitTimeSlot] = useState("10:00 AM - 12:00 PM");
  const [isSchedulingVisit, setIsSchedulingVisit] = useState(false);
  const [visitBookedSuccess, setVisitBookedSuccess] = useState(false);

  // Fetch full property details
  const { data: rawProperty, isLoading } = useQuery<PropertyDetail>({
    queryKey: ["property-detail", propertyId],
    queryFn: async () => {
      const res = await apiClient.get<PropertyDetail>(`/properties/${propertyId}`);
      return res.data;
    },
    enabled: !!propertyId && isAuthenticated,
  });

  const property = rawProperty ? (normalizeProperty(rawProperty) as PropertyDetail) : null;

  // Prompt sign in if unauthenticated on direct visit
  useEffect(() => {
    if (!isAuthenticated && propertyId) {
      openAuthModal(`/properties/${propertyId}`);
    }
  }, [isAuthenticated, propertyId, openAuthModal]);

  // On mount or auth change, check favourite status
  useEffect(() => {
    if (isAuthenticated && propertyId) {
      apiClient
        .get<{ isFavourite: boolean }>(`/properties/${propertyId}/favourite`)
        .then((res) => {
          if (res.data?.isFavourite !== undefined) {
            setIsFav(res.data.isFavourite);
          }
        })
        .catch(() => {});

      apiClient
        .get<{ status: string }>(`/tenant/properties/${propertyId}/finalization-status`)
        .then((res) => {
          if (res.data?.status === "COMPLETED") {
            setIsFinalizedByMe(true);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, propertyId]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const nextState = !isFav;
    setIsFav(nextState);
    try {
      if (nextState) {
        await apiClient.post(`/properties/${propertyId}/favourite`);
      } else {
        await apiClient.delete(`/properties/${propertyId}/favourite`);
      }
    } catch {
      setIsFav(!nextState);
    }
  };

  const handleScheduleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setIsSchedulingVisit(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Unable to load Razorpay payment gateway. Please check your internet connection.");
        setIsSchedulingVisit(false);
        return;
      }

      const envKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const razorpayKey =
        envKey && !envKey.includes("placeholder")
          ? envKey
          : "rzp_test_TuuEAa58npPSlK";

      const logoUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/images/keyra-logo.png`
          : undefined;

      const options: any = {
        key: razorpayKey,
        amount: 3900, // ₹39 in paise
        currency: "INR",
        name: "KEYRA",
        description: `Guided Tour Visit Fee (₹39) - ${property?.societyName || property?.title || "Property"}`,
        image: logoUrl,
        prefill: {
          name: user?.fullName || "Valued Customer",
          contact: user?.phoneNumber || "",
          email: user?.email || "customer@keyra.in",
        },
        theme: {
          color: "#060C18",
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) => {
          setIsSchedulingVisit(true);
          try {
            await apiClient.post("/tenant/visits", {
              propertyId,
              visitDate,
              timeSlot: visitTimeSlot,
              paymentId: response.razorpay_payment_id,
            });
            setVisitBookedSuccess(true);
          } catch (err: any) {
            alert(
              err.response?.data?.message ||
                "Payment was successful, but visit submission failed. Please contact support."
            );
          } finally {
            setIsSchedulingVisit(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSchedulingVisit(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        alert(`Payment failed: ${response.error?.description || "Transaction declined"}`);
        setIsSchedulingVisit(false);
      });
      rzp.open();
    } catch (err: any) {
      alert("Failed to initiate payment for visit. Please try again.");
      setIsSchedulingVisit(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-slate-50/50">
        <div className="mx-auto max-w-md w-full rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#060C18] text-[#C5A059] shadow-sm">
            <Lock className="h-8 w-8 text-[#C5A059]" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-[#060C18] mt-5">
            Sign In to View Property Details
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Please sign in with your mobile number to view complete owner-verified property details, high-resolution photos, society amenities, and schedule guided home tours.
          </p>
          <Button
            variant="gold"
            onClick={() => openAuthModal(`/properties/${propertyId}`)}
            className="w-full mt-6 h-12 font-bold shadow-gold text-sm"
          >
            Sign In with Mobile
          </Button>
          <div className="mt-4">
            <Link
              href="/properties"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Back to Browse Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="aspect-[16/9] w-full max-h-[500px] rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="font-heading text-2xl font-bold text-[#0F1E36]">
          Property Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          The property listing you requested may have been rented or delisted.
        </p>
        <Link href="/properties">
          <Button variant="gold" className="mt-6">
            Browse All Properties
          </Button>
        </Link>
      </div>
    );
  }

  const photos = getPropertyPhotos(property);
  const bhkLabel = formatBhk(property.bhkType || property.bhk);
  const furnishingLabel = formatFurnishing(property.furnishingStatus);
  const localityLabel = deriveLocality(property.address, property.locality);
  const rent = property.monthlyRent || property.rentAmount || 0;
  const deposit =
    property.securityDeposit ??
    property.depositAmount ??
    (rent > 0 ? rent * 2 : 0);
  const carpetArea = property.carpetAreaSqFt ?? property.carpetAreaSqft;
  const isCarePlan =
    property.subscriptionTier === "CARE" ||
    (property as any).planCode === "OWNER_CARE" ||
    (property as any).planCode === "CARE" ||
    Boolean((property as any).isExclusive);

  // Parse amenities if string or array
  const amenitiesList: string[] = Array.isArray(property.amenities)
    ? property.amenities
    : Array.isArray(property.societyAmenities)
    ? property.societyAmenities
    : typeof property.societyAmenities === "string"
    ? property.societyAmenities.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* 1. Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-slate-800">Pune West</Link>
            <span>/</span>
            <span className="text-[#0F1E36] font-bold">{localityLabel}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F1E36]">
            {property.title || `${bhkLabel} Apartment in ${localityLabel}`}
          </h1>

          <p className="mt-1 flex items-center text-xs sm:text-sm font-medium text-slate-500">
            <MapPin className="mr-1.5 h-4 w-4 text-[#C5A059] shrink-0" />
            {property.address || `${localityLabel}, Pune West, Maharashtra`}
          </p>
        </div>

        {/* Header Actions: Verification Pill & Favourite Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFavorite}
            aria-label="Save to favourites"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
              isFav
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-slate-200 bg-white text-slate-500 hover:text-red-500"
            }`}
          >
            <Heart className={`h-5 w-5 ${isFav ? "fill-red-600" : ""}`} />
          </button>
          {isCarePlan && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#B8860B] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#060C18] border border-[#F4EBD9] shadow-sm">
              <Sparkles className="h-4 w-4 fill-[#060C18] text-[#060C18]" />
              KEYRA Exclusive
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F5F3] px-3.5 py-1.5 text-xs font-bold text-[#006A61] border border-[#006A61]/30 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            KEYRA Inspected • 0% Brokerage
          </span>
        </div>
      </div>

      {/* 2. Photo Gallery Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-10">
        {/* Main Hero Photo */}
        <div className="lg:col-span-3 relative aspect-[16/10] sm:aspect-[16/9] max-h-[500px] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-card">
          <Image
            src={photos[selectedPhotoIdx] || photos[0]}
            alt={property.title || "Property Photo"}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover"
          />

          {/* Photo Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedPhotoIdx((prev) => (prev - 1 + photos.length) % photos.length)
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  setSelectedPhotoIdx((prev) => (prev + 1) % photos.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {selectedPhotoIdx + 1} / {photos.length} Photos
          </div>
        </div>

        {/* Thumbnail Column (Desktop) */}
        <div className="hidden lg:flex flex-col gap-3 overflow-y-auto max-h-[500px]">
          {photos.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhotoIdx(idx)}
              className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden border-2 transition-all ${
                selectedPhotoIdx === idx
                  ? "border-[#C5A059] shadow-md scale-95"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={p} alt={`Thumbnail ${idx}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Details, Specifications, Amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Configuration
              </span>
              <p className="font-heading text-lg font-extrabold text-[#0F1E36] mt-0.5">
                {bhkLabel}
              </p>
            </div>
            <div className="border-l border-slate-100 pl-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Carpet Area
              </span>
              <p className="font-heading text-lg font-extrabold text-[#0F1E36] mt-0.5">
                {carpetArea && carpetArea > 0 ? formatSqft(carpetArea) : "Spacious"}
              </p>
            </div>
            <div className="border-l border-slate-100 pl-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Furnishing
              </span>
              <p className="font-heading text-lg font-extrabold text-[#0F1E36] mt-0.5">
                {furnishingLabel || "Unfurnished"}
              </p>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="font-heading text-lg font-bold text-[#0F1E36] mb-3">
                About this Home
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {(property.description || "")
                  .replace(/<!--KEYRA_METADATA:[\s\S]*?-->/g, "")
                  .trim() ||
                  "Verified premium property in Pune West with zero brokerage."}
              </p>
            </div>
          )}

          {/* Amenities Grid */}
          {amenitiesList.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="font-heading text-lg font-bold text-[#0F1E36] mb-4">
                Society Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenitiesList.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                  >
                    <Check className="h-4 w-4 text-[#006A61] shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust & Guarantee Box */}
          <div className="rounded-2xl border border-[#006A61]/20 bg-[#E6F5F3]/50 p-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#006A61] text-white">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-heading text-base font-bold text-[#006A61]">
                KEYRA Physical Condition Guarantee
              </h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                This property has been physically inspected by our field executives. Rental agreement, police verification, and move-in condition audit are guaranteed under our zero-brokerage model.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking & Action Card */}
        <div>
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-elevated space-y-6">
            {/* Price Strip */}
            <div>
              <span className="text-xs font-semibold text-slate-400">Monthly Rent</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-heading text-3xl font-extrabold text-[#0F1E36]">
                  {formatCurrency(rent)}
                </span>
                <span className="text-sm font-medium text-slate-500">/ mo</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Security Deposit:{" "}
                <span className="font-bold text-slate-700">
                  {formatCurrency(deposit)}
                </span>
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              {/* Primary CTA: Schedule Visit */}
              <Button
                variant="gold"
                size="lg"
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal();
                    return;
                  }
                  setIsVisitModalOpen(true);
                }}
                className="w-full justify-center text-sm font-bold shadow-gold"
              >
                <Calendar className="mr-2 h-4 w-4" /> Schedule Physical Visit (₹39)
              </Button>
              <p className="text-[11px] text-center text-slate-500 font-medium">
                Nominal ₹39 commitment fee • In-person guided home tour by KEYRA executive
              </p>

              {/* Secondary CTA: Finalize Property */}
              {isFinalizedByMe ? (
                <div className="w-full text-center py-3 px-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-[#006A61]" /> Property Finalized by You
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    if (!isAuthenticated) {
                      openAuthModal(`/properties/${propertyId}`);
                      return;
                    }
                    setIsFinalizeModalOpen(true);
                  }}
                  className="w-full justify-center text-sm font-bold border-[#C5A059] text-[#0F1E36] hover:bg-[#F4EBD9]/40 bg-gradient-to-r from-[#F4EBD9]/20 to-white shadow-sm"
                >
                  <Sparkles className="mr-2 h-4 w-4 text-[#C5A059]" /> Finalize Property
                </Button>
              )}
            </div>

            {/* Inclusions summary */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#006A61]" />
                <span>Zero Brokerage fee on lease agreement</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#006A61]" />
                <span>Assisted key handover & condition report</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Scheduling Modal */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-elevated border border-slate-100">
            <button
              onClick={() => {
                setIsVisitModalOpen(false);
                setVisitBookedSuccess(false);
              }}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {visitBookedSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-extrabold text-[#060C18]">
                  Visit Requested
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your visit request for &quot;<strong className="text-slate-900">{property.societyName || property.title}</strong>&quot; has been submitted.
                </p>

                {/* Visit summary card matching mobile app */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-left text-xs space-y-2">
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

                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We will assign you staff as soon as possible. You can track this request in your visit schedule.
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <Link href="/tenant/visits">
                    <Button variant="gold" className="w-full font-bold shadow-gold">
                      View All Visits
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsVisitModalOpen(false);
                      setVisitBookedSuccess(false);
                    }}
                    className="w-full"
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleScheduleVisitSubmit} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#060C18] text-[#C5A059]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-[#060C18]">
                      Schedule In-Person Visit
                    </h3>
                    <p className="text-xs text-slate-500">
                      Guided inspection by a verified KEYRA Field Executive
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Visit Date
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

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Preferred Time Slot
                  </label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
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
                        className={`rounded-xl border p-2.5 text-xs font-bold transition-all text-center ${
                          visitTimeSlot === slot
                            ? "border-[#060C18] bg-[#060C18] text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nominal Visit Fee & Guided Tour Explanation */}
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5 text-xs text-slate-700 space-y-2">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#C5A059]" /> Nominal Visit Fee
                    </span>
                    <span className="font-extrabold text-[#060C18] bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                      ₹39 / visit
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed">
                    This nominal fee covers your <strong>dedicated KEYRA Field Executive</strong> who personally meets you at the home to provide a guided in-person tour, while filtering out casual enquiries for owners.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  disabled={isSchedulingVisit}
                  className="w-full justify-center h-11 text-sm font-bold shadow-gold mt-2"
                >
                  {isSchedulingVisit ? (
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
      )}

      {/* Property Finalization Modal */}
      {property && (
        <PropertyFinalizationModal
          isOpen={isFinalizeModalOpen}
          onClose={() => setIsFinalizeModalOpen(false)}
          property={property}
          onSuccess={() => {
            setIsFinalizedByMe(true);
            queryClient.invalidateQueries({ queryKey: ["properties"] });
            queryClient.invalidateQueries({ queryKey: ["featured-properties"] });
            queryClient.invalidateQueries({ queryKey: ["map-properties"] });
          }}
        />
      )}
    </div>
  );
}
