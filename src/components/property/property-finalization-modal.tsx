"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api-client";
import {
  PropertyDetail,
  PropertyFinalizationData,
  FinalizationCheckoutData,
  FinalizationInitiatePayload,
  FinalizationVerifyPayload,
} from "@/types/property";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BadgeCheck,
  ArrowRight,
  PhoneCall,
  Wallet,
  RefreshCw,
} from "lucide-react";

interface PropertyFinalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyDetail;
  onSuccess?: (data: PropertyFinalizationData) => void;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function PropertyFinalizationModal({
  isOpen,
  onClose,
  property,
  onSuccess,
}: PropertyFinalizationModalProps) {
  const { user } = useAuthStore();
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isInitiating, setIsInitiating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [useWallet, setUseWallet] = useState(true);
  const [isLegacyMode, setIsLegacyMode] = useState(false);

  const [finalizationData, setFinalizationData] = useState<PropertyFinalizationData | null>(null);
  const [checkoutData, setCheckoutData] = useState<FinalizationCheckoutData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingVerificationPayload, setPendingVerificationPayload] = useState<FinalizationVerifyPayload | null>(null);

  const rent = property.monthlyRent || property.rentAmount || 0;
  const deposit = property.securityDeposit || property.depositAmount || 0;

  const storageKey = `keyra_pending_finalization_${property.id}`;

  // Initiate or refresh server-calculated checkout order & wallet breakdown
  const fetchCheckoutCalculation = useCallback(
    async (walletPreference: boolean) => {
      setIsInitiating(true);
      setErrorMessage(null);
      try {
        const payload: FinalizationInitiatePayload = {
          useWallet: walletPreference,
          walletOnly: false,
        };
        const res = await apiClient.post<FinalizationCheckoutData>(
          `/tenant/properties/${property.id}/finalize/initiate`,
          payload
        );
        setCheckoutData(res.data);
        setIsLegacyMode(false);
      } catch (err: any) {
        console.error("Failed to initiate property finalization checkout:", err);
        if (err.response?.status === 404) {
          // Backend is running legacy single-phase API (e.g. deployed Cloud Run container)
          // Gracefully initialize standard ₹9,999 checkout state for backwards-compatibility
          const envKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
          const validKey = envKey && !envKey.includes("placeholder") ? envKey : "rzp_test_TuuEAa58npPSlK";
          setCheckoutData({
            orderId: `ORD-KEYRA-${property.id.substring(0, 8)}`,
            amountInPaise: 999900,
            amountInRupees: 9999,
            currency: "INR",
            keyId: validKey,
            planCode: "KEYRA_SERVICE_FEE",
            planName: "KEYRA Service & Deal Closure Fee (₹9,999)",
            originalFee: 9999,
            walletDiscount: 0,
            gatewayPayable: 9999,
            remainingWalletBalance: 0,
            propertyId: property.id,
            propertyTitle: property.title,
            isWalletOnly: false,
          });
          setIsLegacyMode(true);
        } else {
          setErrorMessage(
            err.response?.data?.message || "Failed to calculate deal closure fee. Please refresh and try again."
          );
        }
      } finally {
        setIsInitiating(false);
      }
    },
    [property.id, property.title]
  );

  // Check existing finalization status on open
  useEffect(() => {
    if (!isOpen || !property.id) return;

    let isMounted = true;
    setIsLoadingStatus(true);
    setErrorMessage(null);

    // Check for any unverified payment payload saved in sessionStorage (e.g. from lost network)
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
          setPendingVerificationPayload(JSON.parse(saved));
        }
      } catch (e) {
        // Ignore session storage parse error
      }
    }

    apiClient
      .get<PropertyFinalizationData>(`/tenant/properties/${property.id}/finalization-status`)
      .then((res) => {
        if (!isMounted) return;
        if (res.data && res.data.status === "COMPLETED") {
          setFinalizationData(res.data);
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(storageKey);
          }
        } else {
          setFinalizationData(null);
          // If not completed, initiate checkout to fetch authoritative fee breakdown
          fetchCheckoutCalculation(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFinalizationData(null);
          fetchCheckoutCalculation(true);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingStatus(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, property.id, fetchCheckoutCalculation, storageKey]);

  const handleToggleWallet = (enabled: boolean) => {
    setUseWallet(enabled);
    fetchCheckoutCalculation(enabled);
  };

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Perform authoritative backend verification
  const executeBackendVerification = async (verifyPayload: FinalizationVerifyPayload) => {
    setIsProcessingPayment(true);
    setErrorMessage(null);

    // Save pending payload to sessionStorage for lost-response recovery
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(verifyPayload));
      } catch (e) {
        // Ignore storage write error
      }
    }

    try {
      const res = await apiClient.post<PropertyFinalizationData>(
        `/tenant/properties/${property.id}/finalize/verify`,
        verifyPayload
      );

      if (res.data && res.data.status === "COMPLETED") {
        setFinalizationData(res.data);
        setPendingVerificationPayload(null);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(storageKey);
        }
        if (onSuccess) onSuccess(res.data);
      } else {
        throw new Error("Finalization status could not be confirmed. Please click 'Retry Verification'.");
      }
    } catch (err: any) {
      console.error("Backend finalization payment verification failed:", err);
      const detail = err.response?.data?.message || err.message || "Payment verification failed. Please retry.";
      setErrorMessage(detail);
      setPendingVerificationPayload(verifyPayload);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!checkoutData || isProcessingPayment || isInitiating) return;

    setErrorMessage(null);

    // Case 1: Authoritative Wallet-Only Settlement (0.00 gateway payable)
    if (checkoutData.isWalletOnly) {
      await executeBackendVerification({
        orderId: checkoutData.orderId,
        walletOnly: true,
      });
      return;
    }

    // Case 2: Gateway Payment (Razorpay checkout)
    setIsProcessingPayment(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection and retry.");
      }

      const envKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const razorpayKey =
        checkoutData.keyId && !checkoutData.keyId.includes("placeholder")
          ? checkoutData.keyId
          : envKey && !envKey.includes("placeholder")
          ? envKey
          : "rzp_test_TuuEAa58npPSlK";

      const logoUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/images/keyra-logo.png`
          : undefined;

      const options: any = {
        key: razorpayKey,
        amount: checkoutData.amountInPaise,
        currency: checkoutData.currency || "INR",
        name: "KEYRA",
        description: "KEYRA Service & Deal Closure Fee",
        image: logoUrl,
        prefill: {
          name: user?.fullName || "Valued Customer",
          email: user?.email || "customer@keyra.in",
          contact: user?.phoneNumber || "",
        },
        theme: {
          color: "#0F1E36",
        },
        handler: async (response: {
          razorpay_order_id?: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          if (isLegacyMode) {
            // Direct finalization against legacy Cloud Run backend
            try {
              const res = await apiClient.post<PropertyFinalizationData>(
                `/tenant/properties/${property.id}/finalize`
              );
              setFinalizationData(res.data);
              if (onSuccess) onSuccess(res.data);
            } catch (err: any) {
              setErrorMessage(err.response?.data?.message || "Payment verification failed.");
            } finally {
              setIsProcessingPayment(false);
            }
          } else {
            // Authoritative cryptographic verification with Spring Boot
            await executeBackendVerification({
              orderId: response.razorpay_order_id || checkoutData.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              walletOnly: false,
            });
          }
        },
        modal: {
          ondismiss: () => {
            // User closed Razorpay dialog without paying
            setIsProcessingPayment(false);
          },
        },
      };

      if (checkoutData.orderId && checkoutData.orderId.startsWith("order_")) {
        options.order_id = checkoutData.orderId;
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setErrorMessage(resp.error?.description || "Payment failed at bank. You can retry with another method.");
        setIsProcessingPayment(false);
      });
      rzp.open();
    } catch (err: any) {
      if (isLegacyMode) {
        // Direct test finalization in legacy dev mode when test gateway key is used
        try {
          const res = await apiClient.post<PropertyFinalizationData>(
            `/tenant/properties/${property.id}/finalize`
          );
          setFinalizationData(res.data);
          if (onSuccess) onSuccess(res.data);
        } catch (apiErr: any) {
          setErrorMessage(apiErr.response?.data?.message || "Finalization failed.");
        } finally {
          setIsProcessingPayment(false);
        }
      } else {
        // Insecure fallback completely removed for two-phase flow
        setErrorMessage(err.message || "Failed to initialize payment gateway. Please click retry.");
        setIsProcessingPayment(false);
      }
    }
  };

  const handleRetryVerification = async () => {
    if (!pendingVerificationPayload) return;
    await executeBackendVerification(pendingVerificationPayload);
  };

  const handleCancelPendingCheckout = async () => {
    if (!checkoutData?.orderId || isLegacyMode) return;
    try {
      await apiClient.post(
        `/tenant/properties/${property.id}/finalize/cancel?orderId=${checkoutData.orderId}`
      );
    } catch (e) {
      console.warn("Failed to cancel pending checkout:", e);
    }
  };

  const handleClose = () => {
    // If pending payment was initiated but not completed, release wallet funds
    if (checkoutData?.orderId && !finalizationData) {
      handleCancelPendingCheckout();
    }
    onClose();
  };

  if (!isOpen) return null;

  const isAlreadyCompleted = finalizationData?.status === "COMPLETED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in-50">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-elevated border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {isLoadingStatus ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-10 w-10 text-[#C5A059] animate-spin" />
            <p className="text-sm font-medium text-slate-600">Verifying property finalization status...</p>
          </div>
        ) : isAlreadyCompleted ? (
          /* Success / Active Pass View */
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#006A61] bg-[#E6F5F3] px-3 py-1 rounded-full">
                Deal Closure Pass Active
              </span>
              <h3 className="font-heading text-2xl font-extrabold text-[#0F1E36] mt-2">
                Property Finalization Confirmed
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                You have successfully secured this home with KEYRA Assisted Deal Closure. This property is now reserved for you and removed from the live inventory.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Property</span>
                <span className="font-bold text-slate-800 text-right">{property.title}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Inventory Status</span>
                <span className="font-bold text-[#006A61] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Finalized & Reserved
                </span>
              </div>
              {finalizationData?.dealId && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Deal ID</span>
                  <span className="font-mono font-semibold text-slate-800">{finalizationData.dealId}</span>
                </div>
              )}
              {finalizationData?.orderId && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Order Reference</span>
                  <span className="font-mono font-semibold text-slate-800">{finalizationData.orderId}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-extrabold text-base text-[#006A61]">₹9,999</span>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="rounded-2xl border border-[#006A61]/30 bg-[#E6F5F3]/50 p-4 space-y-2">
              <h4 className="font-heading text-sm font-bold text-[#006A61] flex items-center gap-2">
                <PhoneCall className="h-4 w-4" /> Next Steps: Dedicated Executive Contact
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                A dedicated KEYRA field executive has been assigned to your deal. They will contact you at{" "}
                <span className="font-semibold text-slate-900">{user?.phoneNumber || "your registered number"}</span> within 2 hours to coordinate rent negotiation and physical key handover inspection.
              </p>
            </div>

            <Button
              variant="gold"
              onClick={handleClose}
              className="w-full justify-center h-12 text-sm font-bold shadow-gold"
            >
              Done & Return to Property
            </Button>
          </div>
        ) : (
          /* Purchase Finalization Flow */
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F1E36] to-[#1A2F50] text-[#C5A059] shadow-md">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-2xl font-extrabold text-[#0F1E36]">
                Finalize Property
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Lock this home with KEYRA Assisted Deal Closure. Zero brokerage guaranteed.
              </p>
            </div>

            {/* Error Message & Retry */}
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            {/* Lost Response / Pending Verification Banner */}
            {pendingVerificationPayload && (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-amber-600 shrink-0 animate-spin" />
                  <span>Unconfirmed payment detected. Click to re-verify without re-paying.</span>
                </div>
                <button
                  onClick={handleRetryVerification}
                  disabled={isProcessingPayment}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shrink-0 transition-colors"
                >
                  Verify Now
                </button>
              </div>
            )}

            {/* Property Overview Strip */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-heading text-sm font-bold text-[#0F1E36] line-clamp-1">
                {property.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{property.address || property.locality || "Pune West"}</p>
              <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-200/80">
                <div>
                  <span className="text-slate-400">Monthly Rent: </span>
                  <span className="font-bold text-slate-800">{formatCurrency(rent)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Security Deposit: </span>
                  <span className="font-bold text-slate-800">{formatCurrency(deposit)}</span>
                </div>
              </div>
            </div>

            {/* Authoritative Pricing Comparison & Wallet Breakdown */}
            <div className="rounded-2xl border border-[#C5A059]/40 bg-gradient-to-br from-[#F4EBD9]/40 to-white p-5 space-y-3.5">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Traditional Brokerage (1 Month)</span>
                <span className="line-through font-semibold text-slate-400">{formatCurrency(rent)}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#C5A059]/20">
                <div>
                  <span className="font-heading text-sm font-bold text-[#0F1E36]">
                    KEYRA Service & Deal Closure Fee
                  </span>
                  <p className="text-[11px] text-[#006A61] font-medium">Flat zero-brokerage closure pass</p>
                </div>
                <div className="text-right">
                  <span className="font-heading text-lg font-bold text-slate-800">
                    ₹{checkoutData && checkoutData.originalFee != null ? checkoutData.originalFee.toLocaleString("en-IN") : "9,999"}
                  </span>
                </div>
              </div>

              {/* Authoritative Server-Side Wallet Discount Breakdown */}
              {checkoutData && ((checkoutData.walletDiscount ?? 0) > 0 || (checkoutData.remainingWalletBalance ?? 0) > 0) && (
                <div className="flex justify-between items-center bg-white/80 p-3 rounded-xl border border-[#C5A059]/30">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#C5A059]/10 text-[#C5A059]">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">KEYRA Wallet Cash</span>
                      <p className="text-[10px] text-slate-500">
                        {(checkoutData.walletDiscount ?? 0) > 0
                          ? `₹${(checkoutData.walletDiscount ?? 0).toLocaleString("en-IN")} applied to this deal`
                          : `Available balance: ₹${(checkoutData.remainingWalletBalance ?? 0).toLocaleString("en-IN")}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    {(checkoutData.walletDiscount ?? 0) > 0 && (
                      <span className="font-heading text-sm font-extrabold text-emerald-600">
                        - ₹{(checkoutData.walletDiscount ?? 0).toLocaleString("en-IN")}
                      </span>
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={(e) => handleToggleWallet(e.target.checked)}
                        disabled={isInitiating || isProcessingPayment}
                        aria-label="Use KEYRA Wallet Cash"
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006A61]"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Final Amount Payable */}
              <div className="flex justify-between items-center pt-1">
                <div>
                  <span className="font-heading text-base font-extrabold text-[#0F1E36]">
                    Total Payable Now
                  </span>
                  {checkoutData?.isWalletOnly ? (
                    <p className="text-[11px] text-[#006A61] font-semibold">100% Settled via KEYRA Wallet</p>
                  ) : checkoutData && (checkoutData.walletDiscount ?? 0) > 0 && checkoutData.gatewayPayable === 1 ? (
                    <p className="text-[11px] text-amber-700 font-medium">₹1.00 gateway token payment required</p>
                  ) : (
                    <p className="text-[11px] text-slate-500">Secure checkout via Razorpay</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-heading text-2xl font-extrabold text-[#006A61]">
                    ₹{checkoutData && checkoutData.gatewayPayable != null ? checkoutData.gatewayPayable.toLocaleString("en-IN") : "9,999"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#C5A059]/20 text-[11px] font-bold text-emerald-700">
                ✨ You save ~{formatCurrency(Math.max(0, rent - (checkoutData?.gatewayPayable ?? 9999)))} compared to broker fees
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="space-y-2.5">
              <h5 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">
                What&apos;s Included With Your Pass
              </h5>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <BadgeCheck className="h-4 w-4 text-[#006A61] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Professional Rent Negotiation:</strong> KEYRA negotiates directly with the owner on your behalf for optimal rental terms.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <BadgeCheck className="h-4 w-4 text-[#006A61] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Direct Key Handover & Move-In Inspection:</strong> Dedicated KEYRA executive handles physical key exchange and documents move-in condition checks.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <BadgeCheck className="h-4 w-4 text-[#006A61] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Single-Point Issue Resolution:</strong> Dedicated post move-in support for plumbing, electrical, and structural issues with executive dispatch.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <BadgeCheck className="h-4 w-4 text-[#006A61] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">100% Verified Owners:</strong> Guaranteed background-checked and document-verified property owners.
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantee and Legal Disclaimers */}
            <div className="space-y-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 leading-relaxed border border-slate-200">
              <p className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck className="h-3.5 w-3.5 text-[#006A61]" /> Guaranteed dedicated executive support throughout tenancy duration.
              </p>
              <p>
                <strong>Legal Agreement Notice:</strong> KEYRA offers guidance on standard lease procedures, but does not directly draft or issue legal rental agreements or e-stamp papers.
              </p>
            </div>

            {/* Action CTA */}
            {pendingVerificationPayload ? (
              <Button
                variant="gold"
                onClick={handleRetryVerification}
                disabled={isProcessingPayment}
                className="w-full justify-center h-12 text-sm font-bold shadow-gold bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying Payment...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" /> Retry Payment Verification
                  </>
                )}
              </Button>
            ) : checkoutData?.isWalletOnly ? (
              <Button
                variant="gold"
                onClick={handleProceedToPayment}
                disabled={isProcessingPayment || isInitiating}
                className="w-full justify-center h-12 text-sm font-bold shadow-gold"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming Wallet Settlement...
                  </>
                ) : (
                  <>
                    Finalize with Wallet Cash (₹0 Payable) <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="gold"
                onClick={handleProceedToPayment}
                disabled={isProcessingPayment || isInitiating || !checkoutData}
                className="w-full justify-center h-12 text-sm font-bold shadow-gold"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    Proceed to Pay ₹{checkoutData && checkoutData.gatewayPayable != null ? checkoutData.gatewayPayable.toLocaleString("en-IN") : "9,999"} <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}

            <p className="text-[10px] text-center text-slate-400">
              Secured by Razorpay. 100% Satisfaction & Deal Closure Commitment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
