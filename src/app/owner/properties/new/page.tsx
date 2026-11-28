"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api-client";
import { PUNE_WEST_LOCALITIES } from "@/lib/constants";
import { formatBhk } from "@/lib/property-helper";
import { loadRazorpayScript } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
  Sparkles,
  Zap,
  Check,
  X,
  Lock,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
} from "lucide-react";

interface PlanDefinition {
  code: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  badge?: string;
  badgeType?: "care" | "smart" | "free";
  billingPeriod: string;
  maxPhotos: number;
  maxVideos: number;
  maxDocuments: number;
  summary: string;
  benefits: string[];
}

const CANONICAL_PLANS: PlanDefinition[] = [
  {
    code: "OWNER_FREE",
    name: "KEYRA FREE",
    price: 0,
    badgeType: "free",
    billingPeriod: "perpetual",
    maxPhotos: 5,
    maxVideos: 0,
    maxDocuments: 5,
    summary: "5 HD Photos • Free Property Visits • Standard Placement • 0% Brokerage",
    benefits: [
      "100% Verified Tenant Leads — 0% Brokerage",
      "Up to 5 High-Resolution Property Photos",
      "Standard Locality Discovery & Search Ranking",
      "Zero disturbance: KEYRA coordinates all tenant inquiries",
      "Valid indefinitely until rented or deactivated",
    ],
  },
  {
    code: "OWNER_SMART",
    name: "KEYRA SMART",
    price: 99,
    originalPrice: 499,
    discountBadge: "80% OFF",
    badge: "TOP RANKING",
    badgeType: "smart",
    billingPeriod: "one_time",
    maxPhotos: 8,
    maxVideos: 1,
    maxDocuments: 5,
    summary: "Top Locality Search Ranking • 8 HD Photos • 1 Video (30s)",
    benefits: [
      "Top Locality Search Ranking & High-Visibility Boost",
      "Up to 8 HD Photos + 1 Walkthrough Video (30s)",
      "Up to 5 Ownership Verification Documents",
      "High-intent tenant inquiries coordinated by KEYRA",
      "One-time fee • Active indefinitely until rented",
    ],
  },
  {
    code: "OWNER_CARE",
    name: "KEYRA CARE COMPLETE",
    price: 2999,
    originalPrice: 4999,
    discountBadge: "40% OFF",
    badge: "VIP EXCLUSIVE",
    badgeType: "care",
    billingPeriod: "one_time",
    maxPhotos: 16,
    maxVideos: 2,
    maxDocuments: 10,
    summary: "Dedicated Relationship Manager • 16 HD Photos • 2 Videos (30s) • Move-In/Out Inspection",
    benefits: [
      "KEYRA EXCLUSIVE Top Priority Ranking & Trust Badge",
      "100% Ad-Free VIP Experience (No Ads)",
      "Professional Property Videography – Premium HD video shoot",
      "Dedicated Relationship Manager & Sales Support",
      "Physical Move-In & Move-Out Inspection Audit",
      "Up to 16 HD Photos + 2 Walkthrough Videos (30s)",
      "Up to 10 Property & Verification Documents",
      "Tenant Background Check & Profile Pre-Screening",
      "One-time fee • Active indefinitely until rented",
    ],
  },
];

export default function NewPropertyWizardPage() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal, user } = useAuthStore();

  // Fetch owner wallet balance for eligible discounts
  const { data: walletData } = useQuery<{
    walletBalance?: number;
    balance?: number;
  }>({
    queryKey: ["owner-wallet"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<any>("/wallet");
        return res.data;
      } catch {
        return { walletBalance: 0, balance: 0 };
      }
    },
    enabled: isAuthenticated,
  });

  const walletCashBalance =
    walletData?.walletBalance ?? walletData?.balance ?? 0;

  // Wizard Navigation: Step 0 is Choose Listing Plan (matching mobile app)
  const [step, setStep] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<PlanDefinition>(CANONICAL_PLANS[2]); // Default to KEYRA CARE COMPLETE
  const [expandedPlanCodes, setExpandedPlanCodes] = useState<string[]>([]);

  // Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [tempModalPlan, setTempModalPlan] = useState<PlanDefinition>(CANONICAL_PLANS[2]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<string>("");
  const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(null);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<string | null>(null);
  const [activePaidPlan, setActivePaidPlan] = useState<PlanDefinition | null>(null);
  const [dismissedPaymentWarning, setDismissedPaymentWarning] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [locality, setLocality] = useState<string>(PUNE_WEST_LOCALITIES[0]);
  const [address, setAddress] = useState("");
  const [societyName, setSocietyName] = useState("");
  const [latitude, setLatitude] = useState(18.559);
  const [longitude, setLongitude] = useState(73.7868);

  const [propertyCategory, setPropertyCategory] = useState("APARTMENT");
  const [bhkType, setBhkType] = useState("2_BHK");
  const [furnishingStatus, setFurnishingStatus] = useState("SEMI_FURNISHED");
  const [buildingStructure, setBuildingStructure] = useState("MID_RISE");
  const [documentType, setDocumentType] = useState("UTILITY_BILL");
  const [carpetAreaSqft, setCarpetAreaSqft] = useState<number | "">(950);
  const [floorNumber, setFloorNumber] = useState<number | "">(4);
  const [totalFloors, setTotalFloors] = useState<number | "">(12);
  const [rentAmount, setRentAmount] = useState<number | "">(28000);
  const [depositAmount, setDepositAmount] = useState<number | "">(60000);

  const [hasInverter, setHasInverter] = useState(true);
  const [amenities, setAmenities] = useState<string[]>([
    "Power Backup",
    "Gated Security",
    "Reserved Parking",
    "Lift",
  ]);
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("Family or working professionals preferred.");

  // Media
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<File | null>(null);

  const toggleAmenity = (name: string) => {
    setAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const toggleExpandPlan = (code: string) => {
    setExpandedPlanCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedPhotos((prev) => {
        const combined = [...prev, ...files];
        if (combined.length > selectedPlan.maxPhotos) {
          return combined.slice(0, selectedPlan.maxPhotos);
        }
        return combined;
      });
    }
  };

  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedDoc(e.target.files[0]);
    }
  };

  // Open modal at final review
  const handleReviewAndPost = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setTempModalPlan(selectedPlan);
    setIsConfirmModalOpen(true);
  };

  // Execute property creation and optional Razorpay payment
  const handleFinalPostProperty = async (planToConfirm: PlanDefinition) => {
    if (!isAuthenticated) {
      setIsConfirmModalOpen(false);
      openAuthModal();
      return;
    }

    setSelectedPlan(planToConfirm);
    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      // 1. Create property listing
      setSubmissionProgress("Creating property listing...");
      const formattedBhk = formatBhk(bhkType);
      const payload = {
        title: title || `${formattedBhk} Flat in ${societyName || locality || "Pune West"}`,
        description:
          description ||
          `Verified spacious home in ${locality}, Pune West. Zero brokerage.`,
        rentAmount: Number(rentAmount),
        depositAmount: Number(depositAmount),
        bhkType,
        address: `${address ? `${address}, ` : ""}${societyName ? `${societyName}, ` : ""}${locality}, Pune`,
        latitude,
        longitude,
        propertyCategory,
        furnishingStatus,
        buildingStructure,
        carpetAreaSqft: Number(carpetAreaSqft) || undefined,
        floorNumber: Number(floorNumber) || undefined,
        totalFloors: Number(totalFloors) || undefined,
        hasInverter,
        rules,
        societyAmenities: amenities.join(", "),
      };

      const res = await apiClient.post<any>("/owner/properties", payload);
      const newId = res.data?.id;
      setCreatedPropertyId(newId);

      // 2. Upload photos (respecting plan maxPhotos)
      if (newId && selectedPhotos.length > 0) {
        setSubmissionProgress("Uploading verified property photos...");
        const photosToUpload = selectedPhotos.slice(0, planToConfirm.maxPhotos);
        for (let i = 0; i < photosToUpload.length; i++) {
          const photoData = new FormData();
          photoData.append("file", photosToUpload[i]);
          photoData.append("isPrimary", i === 0 ? "true" : "false");
          try {
            await apiClient.post(`/owner/properties/${newId}/photos`, photoData);
          } catch (photoErr: any) {
            console.warn(
              `Photo upload failed for index ${i}:`,
              photoErr?.response?.data || photoErr.message
            );
          }
        }
      }

      // 3. Upload verification document if any
      if (newId && selectedDoc) {
        setSubmissionProgress("Uploading verification document...");
        const docData = new FormData();
        docData.append("file", selectedDoc);
        docData.append("documentType", documentType);
        try {
          await apiClient.post(`/owner/properties/${newId}/documents`, docData);
        } catch (docErr: any) {
          console.warn("Document upload failed:", docErr?.response?.data || docErr.message);
        }
      }

      // 4. Handle Plan Payment
      if (planToConfirm.price === 0) {
        // FREE plan: No payment needed
        setIsConfirmModalOpen(false);
        setActivePaidPlan(planToConfirm);
        setStep(5);
        setIsSubmitting(false);
      } else {
        // PAID plan: ₹99 (SMART) or ₹2,999 (CARE)
        setSubmissionProgress("Preparing secure Razorpay checkout...");
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          setIsConfirmModalOpen(false);
          setDismissedPaymentWarning(
            `Payment gateway could not be loaded. Your property is saved on KEYRA FREE. You can upgrade to ${planToConfirm.name} from your Owner Dashboard.`
          );
          setActivePaidPlan(CANONICAL_PLANS[0]);
          setStep(5);
          setIsSubmitting(false);
          return;
        }

        // Initiate checkout from backend with wallet discount if applicable
        let checkoutData: any = null;
        try {
          const checkoutRes = await apiClient.post<any>(
            `/owner/properties/${newId}/subscriptions/checkout`,
            { planCode: planToConfirm.code, useWallet: true }
          );
          checkoutData = checkoutRes.data;
        } catch (checkoutErr: any) {
          console.warn(
            "Property checkout API warning, falling back to standalone checkout:",
            checkoutErr
          );
          try {
            const fallbackRes = await apiClient.post<any>(
              "/owner/subscriptions/checkout",
              { planCode: planToConfirm.code, useWallet: true }
            );
            checkoutData = fallbackRes.data;
          } catch (fbErr) {
            console.warn("Fallback checkout API warning:", fbErr);
          }
        }

        const envKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const razorpayKey =
          checkoutData?.keyId ||
          (envKey && !envKey.includes("placeholder")
            ? envKey
            : "rzp_test_TuuEAa58npPSlK");

        const options: any = {
          key: razorpayKey,
          amount: checkoutData?.amountInPaise || planToConfirm.price * 100,
          currency: "INR",
          name: "KEYRA",
          description: `${planToConfirm.name} Listing Upgrade - ${societyName || locality || "Pune West"}`,
          order_id: checkoutData?.orderId,
          image:
            typeof window !== "undefined"
              ? `${window.location.origin}/images/keyra-logo.png`
              : undefined,
          prefill: {
            name: user?.fullName || "Property Owner",
            contact: user?.phoneNumber || "",
            email: user?.email || "owner@keyra.in",
          },
          theme: {
            color: planToConfirm.code === "OWNER_CARE" ? "#C5A059" : "#0284C7",
          },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id?: string;
            razorpay_signature?: string;
          }) => {
            setIsSubmitting(true);
            setSubmissionProgress(
              "Verifying payment and activating listing plan..."
            );
            try {
              await apiClient.post(
                `/owner/properties/${newId}/subscriptions/verify`,
                {
                  orderId: response.razorpay_order_id || checkoutData?.orderId,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature || "verified",
                }
              );
            } catch (verErr) {
              console.warn("Verification API warning:", verErr);
            } finally {
              setConfirmedPaymentId(response.razorpay_payment_id);
              setActivePaidPlan(planToConfirm);
              setIsConfirmModalOpen(false);
              setStep(5);
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsConfirmModalOpen(false);
              const remainingWallet = walletCashBalance > 0 ? walletCashBalance : 500;
              setDismissedPaymentWarning(
                `Payment was not completed. Your property has been saved under KEYRA FREE. Your ₹${remainingWallet} KEYRA Wallet Cash remains safe in your account. You can upgrade to ${planToConfirm.name} anytime from your Owner Dashboard.`
              );
              setActivePaidPlan(CANONICAL_PLANS[0]);
              setStep(5);
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", (failResp: any) => {
          setIsConfirmModalOpen(false);
          setDismissedPaymentWarning(
            `Payment failed (${failResp.error?.description || "Transaction declined"}). Your property has been saved under KEYRA FREE. You can retry upgrading anytime.`
          );
          setActivePaidPlan(CANONICAL_PLANS[0]);
          setStep(5);
          setIsSubmitting(false);
        });

        rzp.open();
      }
    } catch (err: any) {
      console.error("Property creation error:", err);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create property. Please verify all required fields.";
      setSubmissionError(backendMessage);
      setIsConfirmModalOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      {/* Wizard Header */}
      <div className="mb-6">
        <Link
          href="/owner/dashboard"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Owner Dashboard
        </Link>

        {/* Global Submission Error Banner */}
        {submissionError && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl bg-red-50 p-4 border border-red-200 text-red-800 text-sm">
            <div className="rounded-full bg-red-100 p-1 text-red-600 mt-0.5">
              <span className="font-bold text-xs block px-1">!</span>
            </div>
            <div className="flex-1">
              <strong className="font-bold block">Submission Error</strong>
              <p className="mt-0.5 text-xs text-red-700">{submissionError}</p>
            </div>
            <button
              onClick={() => setSubmissionError(null)}
              className="text-xs text-red-600 font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Step 0: Plan Selection Header */}
        {step === 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#060C18]">
                Step 1: Choose Listing Plan
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-[#C5A059] border border-[#C5A059]/30">
                <Sparkles className="h-3.5 w-3.5" /> ₹500 Cashback on Rent Out
              </span>
            </div>

            {/* Light Amber Notice Banner */}
            <div className="flex items-start gap-3 rounded-2xl bg-[#FFFBEB] p-3.5 border border-[#FDE68A] text-xs text-[#92400E] mb-3">
              <Info className="h-4 w-4 text-[#B45309] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Please select a listing plan before filling out property details. You can start with our 100% Free plan or boost visibility with verified plans.
              </p>
            </div>

            {/* Zero Brokerage Trust Banner */}
            <div className="flex items-center gap-2.5 rounded-xl bg-amber-50/60 p-3 border border-amber-200/80 text-xs font-bold text-amber-900 mb-6">
              <ShieldCheck className="h-4 w-4 text-[#C5A059] shrink-0" />
              <span>100% Zero Brokerage Assured • Direct Inquiries via KEYRA</span>
            </div>
          </div>
        )}

        {/* Steps 1-4 Header & Stepper */}
        {step >= 1 && step <= 4 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#060C18]">
                  List Your Property
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Connect with verified tenants in Pune West. Zero Brokerage.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Active Plan Tag with Change Plan Button */}
                <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 border border-slate-200">
                  <span className="text-slate-500 font-normal">Plan:</span>
                  <span
                    className={
                      selectedPlan.code === "OWNER_CARE"
                        ? "text-[#C5A059]"
                        : selectedPlan.code === "OWNER_SMART"
                        ? "text-sky-600"
                        : "text-emerald-600"
                    }
                  >
                    {selectedPlan.name} (
                    {selectedPlan.price === 0
                      ? "Free"
                      : `₹${selectedPlan.price.toLocaleString("en-IN")}`}
                    )
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTempModalPlan(selectedPlan);
                      setIsConfirmModalOpen(true);
                    }}
                    className="ml-1 text-[11px] font-extrabold text-[#C5A059] hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { num: 1, label: "Location" },
                { num: 2, label: "Config & Rent" },
                { num: 3, label: "Amenities" },
                { num: 4, label: "Photos & Docs" },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`rounded-xl border p-2.5 text-center transition-all ${
                    step === s.num
                      ? "border-[#060C18] bg-[#060C18] text-white shadow-sm"
                      : step > s.num
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider">
                    Step {s.num}
                  </div>
                  <div className="text-xs font-extrabold mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* STEP 0: CHOOSE LISTING PLAN (Matching Mobile App Step 1) */}
      {/* ========================================================================= */}
      {step === 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#060C18]">
              Select Listing Package
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upgrade your listing visibility, media allowance, and receive assisted physical field visits in Pune.
            </p>
          </div>

          <div className="space-y-3.5">
            {CANONICAL_PLANS.map((plan) => {
              const isSelected = selectedPlan.code === plan.code;
              const isExpanded = expandedPlanCodes.includes(plan.code);
              const isCare = plan.code === "OWNER_CARE";
              const isSmart = plan.code === "OWNER_SMART";
              const isFree = plan.price === 0;

              return (
                <div
                  key={plan.code}
                  onClick={() => setSelectedPlan(plan)}
                  className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all ${
                    isSelected
                      ? isCare
                        ? "border-2 border-[#C5A059] bg-[#FDFBF7] shadow-md shadow-[#C5A059]/10"
                        : isSmart
                        ? "border-2 border-sky-500 bg-[#F0F9FF] shadow-md shadow-sky-500/10"
                        : "border-2 border-emerald-500 bg-[#F0FDF4] shadow-md shadow-emerald-500/10"
                      : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Radio Selector */}
                      <div className="mt-0.5">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                            isSelected
                              ? isCare
                                ? "border-[#C5A059] bg-[#C5A059] text-white"
                                : isSmart
                                ? "border-sky-600 bg-sky-600 text-white"
                                : "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div>
                        {/* Title & Badge */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-base text-[#060C18]">
                            {plan.name}
                          </h3>
                          {plan.badge && (
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold tracking-wide ${
                                isCare
                                  ? "bg-[#FEF3C7] text-[#92400E]"
                                  : "bg-[#E0F2FE] text-[#0369A1]"
                              }`}
                            >
                              {plan.badge}
                            </span>
                          )}
                        </div>

                        {/* Pricing */}
                        <div className="mt-1 flex flex-wrap items-baseline gap-2">
                          {plan.originalPrice && (
                            <span className="text-xs font-semibold text-slate-400 line-through">
                              ₹{plan.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                          <span
                            className={`text-base sm:text-lg font-black ${
                              isCare
                                ? "text-[#C5A059]"
                                : isSmart
                                ? "text-sky-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {plan.price === 0
                              ? "Free"
                              : isCare && walletCashBalance > 0
                              ? `₹${(plan.price - Math.min(walletCashBalance, 500)).toLocaleString("en-IN")}`
                              : `₹${plan.price.toLocaleString("en-IN")}`}
                          </span>
                          <span className="text-xs text-slate-500">
                            / {plan.billingPeriod}
                          </span>
                          {isCare && walletCashBalance > 0 ? (
                            <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                              ₹{Math.min(walletCashBalance, 500)} WALLET CASH APPLIED
                            </span>
                          ) : plan.discountBadge ? (
                            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              {plan.discountBadge}
                            </span>
                          ) : null}
                        </div>

                        {/* Summary Bullets */}
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {plan.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expand / Collapse Button */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandPlan(plan.code);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900"
                    >
                      <span>
                        {isExpanded
                          ? "Hide plan benefits & quotas"
                          : "Tap to view plan benefits & quotas"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Up to {plan.maxPhotos} HD Photos
                    </span>
                  </div>

                  {/* Expanded Features List */}
                  {isExpanded && (
                    <div className="mt-3 pt-2 border-t border-slate-100 space-y-1.5">
                      {plan.benefits.map((benefit, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-700"
                        >
                          <span className="text-[#C5A059] font-bold">•</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-lg space-y-2">
            <Button
              type="button"
              variant="gold"
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full h-12 text-sm sm:text-base font-extrabold shadow-gold flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              <span>
                Continue to Fill Details (
                {selectedPlan.code === "OWNER_CARE" && walletCashBalance > 0
                  ? `₹${(selectedPlan.price - Math.min(walletCashBalance, 500)).toLocaleString("en-IN")}`
                  : selectedPlan.price === 0
                  ? "Free"
                  : `₹${selectedPlan.price.toLocaleString("en-IN")}`}
                )
              </span>
            </Button>
            <p className="text-center text-[11px] text-slate-500">
              No payment now • Collected after details are filled
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORM STEPS 1 to 4 */}
      {/* ========================================================================= */}
      {step >= 1 && step <= 4 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-heading text-lg font-bold text-[#060C18]">
                Step 1: Property Location & Locality
              </h2>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Pune West Locality *
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                >
                  {PUNE_WEST_LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Society or Building Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasturi The Balmoral Riverside"
                  value={societyName}
                  onChange={(e) => setSocietyName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Detailed Address / Landmark *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Flat 402, Tower B, Near Orchid School, Balewadi High Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Accurate Geotagging:</strong>
                  <p className="mt-0.5 text-slate-500">
                    Location coordinates are automatically pinned for {locality} (
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}) to display on the interactive map.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setStep(0)}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Plan Selection
                </Button>
                <Button
                  variant="gold"
                  onClick={() => {
                    if (!societyName || !address) {
                      alert("Please provide the society name and address.");
                      return;
                    }
                    setStep(2);
                  }}
                  className="font-bold shadow-gold px-6"
                >
                  Next: Configuration & Pricing <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Configuration & Pricing */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-heading text-lg font-bold text-[#060C18]">
                Step 2: Configuration & Pricing
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Property Category *
                  </label>
                  <select
                    value={propertyCategory}
                    onChange={(e) => setPropertyCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                  >
                    <option value="APARTMENT">Apartment / Flat</option>
                    <option value="VILLA">Independent Villa</option>
                    <option value="INDEPENDENT_HOUSE">Independent / Row House</option>
                    <option value="PG_HOSTEL">PG / Co-living</option>
                    <option value="COMMERCIAL">Commercial Office / Space</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Building Rise / Structure *
                  </label>
                  <select
                    value={buildingStructure}
                    onChange={(e) => setBuildingStructure(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                  >
                    <option value="LOW_RISE">Low-Rise (1 - 4 Floors)</option>
                    <option value="MID_RISE">Mid-Rise (5 - 15 Floors)</option>
                    <option value="HIGH_RISE">High-Rise (16+ Floors)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    BHK Type *
                  </label>
                  <select
                    value={bhkType}
                    onChange={(e) => setBhkType(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                  >
                    <option value="1_RK">1 RK</option>
                    <option value="1_BHK">1 BHK</option>
                    <option value="2_BHK">2 BHK</option>
                    <option value="3_BHK">3 BHK</option>
                    <option value="4_BHK">4+ BHK / Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Furnishing Status *
                  </label>
                  <select
                    value={furnishingStatus}
                    onChange={(e) => setFurnishingStatus(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                  >
                    <option value="UNFURNISHED">Unfurnished</option>
                    <option value="SEMI_FURNISHED">Semi-Furnished</option>
                    <option value="FURNISHED">Fully Furnished</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Carpet (sqft)
                  </label>
                  <input
                    type="number"
                    placeholder="950"
                    value={carpetAreaSqft}
                    onChange={(e) =>
                      setCarpetAreaSqft(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Floor No.
                  </label>
                  <input
                    type="number"
                    placeholder="4"
                    value={floorNumber}
                    onChange={(e) =>
                      setFloorNumber(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    placeholder="12"
                    value={totalFloors}
                    onChange={(e) =>
                      setTotalFloors(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Monthly Rent (₹) *
                  </label>
                  <div className="relative mt-1.5">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="25000"
                      value={rentAmount}
                      onChange={(e) =>
                        setRentAmount(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 pl-8 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Security Deposit (₹) *
                  </label>
                  <div className="relative mt-1.5">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="50000"
                      value={depositAmount}
                      onChange={(e) =>
                        setDepositAmount(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 pl-8 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button
                  variant="gold"
                  onClick={() => {
                    if (!rentAmount || !depositAmount) {
                      alert("Please enter monthly rent and deposit amount.");
                      return;
                    }
                    setStep(3);
                  }}
                  className="font-bold shadow-gold px-6"
                >
                  Next: Amenities <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Amenities & Preferences */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-heading text-lg font-bold text-[#060C18]">
                Step 3: Amenities & Society Features
              </h2>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Available Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    "Power Backup",
                    "Gated Security",
                    "Reserved Parking",
                    "Lift",
                    "Clubhouse / Gym",
                    "Swimming Pool",
                    "Piped Gas Pipeline",
                    "Children Play Area",
                    "Water Purifier",
                    "Solar Water Heater",
                    "CCTV Surveillance",
                    "EV Charging Station",
                  ].map((amenity) => {
                    const active = amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold text-left transition-all ${
                          active
                            ? "border-[#006A61] bg-[#E6F5F3] text-[#006A61]"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 ${
                            active ? "text-[#006A61]" : "text-slate-300"
                          }`}
                        />
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Tenant Rules / Preferences
                </label>
                <input
                  type="text"
                  placeholder="e.g. Family or working professionals preferred. Vegetarians preferred."
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button
                  variant="gold"
                  onClick={() => setStep(4)}
                  className="font-bold shadow-gold px-6"
                >
                  Next: Photos & Verification <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Photos & Verification */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-[#060C18]">
                  Step 4: Upload Photos & Verification Document
                </h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  Plan Quota: {selectedPlan.maxPhotos} Photos
                </span>
              </div>

              {/* Photos Dropzone */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Property Photographs (Up to {selectedPlan.maxPhotos} photos for {selectedPlan.name})
                </label>
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-[#C5A059] transition-colors bg-slate-50">
                  <Upload className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-2 text-xs font-bold text-slate-700">
                    Drag and drop property photos, or browse files
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    PNG, JPG up to 10MB each. Maximum {selectedPlan.maxPhotos} photos allowed for {selectedPlan.name}.
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="mt-4 text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-[#060C18] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#0A1528]"
                  />
                </div>

                {selectedPhotos.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                    {selectedPhotos.map((f, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        {f.name} {i === 0 && "(Primary)"}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Verification Document */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Ownership Verification Document
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 focus:border-[#C5A059] focus:outline-none"
                  >
                    <option value="UTILITY_BILL">Electricity / Water Bill</option>
                    <option value="OWNERSHIP_PROOF">Index II / Sale Deed</option>
                    <option value="TAX_RECEIPT">Property Tax Receipt</option>
                    <option value="GOVERNMENT_ID">Owner Government ID</option>
                  </select>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-[#006A61]" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {selectedDoc ? selectedDoc.name : "Select Document (PDF, JPG, PNG up to 15MB)"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Kept strictly confidential. Used solely for KEYRA physical verification and badge approval.
                      </p>
                    </div>
                  </div>
                  <label className="cursor-pointer rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100">
                    Browse
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleDocSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Zero Brokerage & Cashback Box */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 space-y-1">
                <strong className="font-extrabold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#C5A059]" /> ₹500 Direct Account Cashback Guarantee
                </strong>
                <p className="text-slate-600 text-[11px]">
                  When a tenant closes this lease through KEYRA, we directly credit ₹500 to your bank account or wallet. Zero commissions, zero hidden platform charges.
                </p>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button
                  variant="gold"
                  disabled={isSubmitting}
                  onClick={handleReviewAndPost}
                  className="font-bold shadow-gold px-8 h-11"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Listing...
                    </>
                  ) : (
                    `Post Property (${
                      selectedPlan.price === 0
                        ? "Free"
                        : `₹${selectedPlan.price.toLocaleString("en-IN")}`
                    })`
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRM YOUR LISTING PLAN MODAL (Matching Mobile App Screenshots 2, 3, 4) */}
      {/* ========================================================================= */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-xl w-full max-h-[92vh] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[#B45309]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-extrabold text-[#060C18]">
                    Confirm Your Listing Plan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Confirm your plan or choose another before payment
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body - Plans List */}
            <div className="overflow-y-auto px-6 py-4 space-y-3.5 flex-1">
              <div className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                SELECT / CONFIRM PLAN
              </div>

              {CANONICAL_PLANS.map((plan) => {
                const isSelected = tempModalPlan.code === plan.code;
                const isCare = plan.code === "OWNER_CARE";
                const isSmart = plan.code === "OWNER_SMART";
                const isFree = plan.price === 0;

                return (
                  <div
                    key={plan.code}
                    onClick={() => setTempModalPlan(plan)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all border ${
                      isSelected
                        ? isCare
                          ? "border-2 border-[#C5A059] bg-[#FDFBF7] shadow-sm"
                          : isSmart
                          ? "border-2 border-sky-500 bg-[#F0F9FF] shadow-sm"
                          : "border-2 border-emerald-500 bg-[#F0FDF4] shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {/* Header Row: Radio + Title + Badge + Price */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                            isSelected
                              ? isCare
                                ? "border-[#C5A059] bg-[#C5A059] text-white"
                                : isSmart
                                ? "border-sky-600 bg-sky-600 text-white"
                                : "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                        <span className="font-extrabold text-sm text-[#060C18]">
                          {plan.name}
                        </span>
                        {plan.badge && (
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold ${
                              isCare
                                ? "bg-[#FEF3C7] text-[#92400E]"
                                : "bg-[#E0F2FE] text-[#0369A1]"
                            }`}
                          >
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      {/* Price in modal */}
                      <div className="flex items-baseline gap-1.5 shrink-0">
                        {plan.originalPrice && (
                          <span className="text-[11px] font-semibold text-slate-400 line-through">
                            ₹{plan.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                        <span
                          className={`text-sm sm:text-base font-black ${
                            isCare
                              ? "text-[#C5A059]"
                              : isSmart
                              ? "text-sky-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {plan.price === 0
                            ? "₹0 Free"
                            : `₹${plan.price.toLocaleString("en-IN")}`}
                        </span>
                      </div>
                    </div>

                    {/* Features list in modal */}
                    <div className="mt-3 pl-6 space-y-1">
                      {plan.benefits.map((benefit, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex items-start gap-1.5 text-[11px] text-slate-600 leading-snug"
                        >
                          <span className="text-slate-400">•</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Wallet Discount Breakdown for Care Plan */}
            {tempModalPlan.code === "OWNER_CARE" && walletCashBalance > 0 && (
              <div className="mx-6 mb-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3.5 text-xs space-y-1.5 text-slate-800">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Regular Listing Price</span>
                  <span className="line-through">₹2,999</span>
                </div>
                <div className="flex justify-between items-center font-bold text-[#B45309]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
                    KEYRA Wallet Cash Discount
                  </span>
                  <span>-₹{Math.min(walletCashBalance, 500)}</span>
                </div>
                <div className="border-t border-amber-200 pt-1.5 flex justify-between items-center font-extrabold text-[#060C18]">
                  <span>Amount to Pay</span>
                  <span className="text-sm font-black text-[#C5A059]">₹{(2999 - Math.min(walletCashBalance, 500)).toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}

            {/* Modal Footer with Action Buttons */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleFinalPostProperty(tempModalPlan)}
                className={`w-full h-12 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                  tempModalPlan.price === 0
                    ? "bg-[#16A34A] hover:bg-[#15803D] shadow-emerald-500/20"
                    : tempModalPlan.code === "OWNER_SMART"
                    ? "bg-[#0284C7] hover:bg-[#0369A1] shadow-sky-500/20"
                    : "bg-[#060C18] hover:bg-[#0A1528] shadow-slate-900/20"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{submissionProgress || "Processing Listing..."}</span>
                  </>
                ) : tempModalPlan.price === 0 ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirm & Post for Free</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>
                      Pay ₹{(tempModalPlan.code === "OWNER_CARE" && walletCashBalance > 0
                        ? tempModalPlan.price - Math.min(walletCashBalance, 500)
                        : tempModalPlan.price
                      ).toLocaleString("en-IN")} with Razorpay
                      {tempModalPlan.code === "OWNER_CARE" && walletCashBalance > 0 ? " (₹500 Wallet Cash Applied)" : ""}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
              >
                Back to Edit Property Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: SUCCESS CONFIRMATION */}
      {/* ========================================================================= */}
      {step === 5 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 text-center shadow-card space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>
            <h2 className="font-heading text-2xl font-extrabold text-[#060C18]">
              Property Listed Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Your property has been received with status <strong>Pending Verification</strong>.
              A KEYRA Field Executive will conduct a rapid physical audit within 24 hours to attach your <strong>Verified Badge</strong>.
            </p>
          </div>

          {/* Active Plan Badge Display */}
          {activePaidPlan && (
            <div className="inline-flex flex-col items-center gap-1 rounded-2xl bg-slate-50 border border-slate-200 px-6 py-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Active Listing Package
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-base font-extrabold ${
                    activePaidPlan.code === "OWNER_CARE"
                      ? "text-[#C5A059]"
                      : activePaidPlan.code === "OWNER_SMART"
                      ? "text-sky-600"
                      : "text-emerald-600"
                  }`}
                >
                  {activePaidPlan.name}
                </span>
                {activePaidPlan.badge && (
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-extrabold ${
                      activePaidPlan.code === "OWNER_CARE"
                        ? "bg-[#FEF3C7] text-[#92400E]"
                        : "bg-[#E0F2FE] text-[#0369A1]"
                    }`}
                  >
                    {activePaidPlan.badge}
                  </span>
                )}
              </div>
              {confirmedPaymentId && (
                <span className="text-[11px] text-slate-500">
                  Razorpay Payment ID:{" "}
                  <code className="font-mono font-bold text-slate-700">
                    {confirmedPaymentId}
                  </code>
                </span>
              )}
            </div>
          )}

          {/* Advisory banner if payment was dismissed */}
          {dismissedPaymentWarning && (
            <div className="max-w-md mx-auto rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 text-left flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{dismissedPaymentWarning}</span>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/owner/dashboard">
              <Button variant="gold" className="font-bold w-full sm:w-auto px-6">
                Go to Owner Dashboard
              </Button>
            </Link>
            {createdPropertyId && (
              <Link href={`/properties/${createdPropertyId}`}>
                <Button variant="outline" className="w-full sm:w-auto px-6">
                  Preview Public Listing
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
