"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api-client";
import { KeyraLogo } from "@/components/common/keyra-logo";
import { Button } from "@/components/ui/button";
import { AuthResponse, UserProfile } from "@/types/auth";
import {
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (notification?: any) => void;
          revoke: (hint: string, callback?: () => void) => void;
        };
      };
    };
  }
}

export function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    closeAuthModal,
    setUser,
    setToken,
    authRedirectUrl,
  } = useAuthStore();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(30);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const googleButtonContainerRef = useRef<HTMLDivElement | null>(null);

  // Helper to establish session cookie & hydrate store
  const handleAuthSuccess = useCallback(
    async (authData: AuthResponse) => {
      const accessToken = authData.accessToken || authData.token;
      if (!accessToken) {
        throw new Error("No access token received from authentication service.");
      }

      setToken(accessToken);

      if (typeof window !== "undefined") {
        localStorage.setItem("keyra_token", accessToken);
        sessionStorage.setItem("keyra_token", accessToken);
      }

      if (authData.user) {
        const u = authData.user;
        setUser({
          id: u.id,
          phoneNumber: u.phoneNumber || "",
          fullName: u.fullName || "",
          email: u.email || "",
          role: u.role,
          roles: u.roles || (u.role ? [u.role] : ["TENANT"]),
          isKycVerified: u.verified,
          createdAt: u.createdAt,
        });
      } else {
        try {
          const profileRes = await apiClient.get<UserProfile>("/auth/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setUser(profileRes.data);
        } catch {
          setUser({
            id: authData.userId || "user",
            phoneNumber: phoneNumber ? `+91${phoneNumber.replace(/\D/g, "")}` : "",
            roles: ["TENANT"],
          });
        }
      }

      // Establish server session cookie via route handler
      try {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: accessToken }),
        });
      } catch {
        // Continue even if session cookie route handler fails in static/mock mode
      }

      closeAuthModal();

      // Redirect if destination URL was stored
      if (authRedirectUrl) {
        router.push(authRedirectUrl);
      }
    },
    [setToken, setUser, closeAuthModal, phoneNumber, authRedirectUrl, router]
  );

  // Google credential callback
  const handleGoogleCredentialResponse = useCallback(
    async (response: any) => {
      const idToken = response?.credential;
      if (!idToken) {
        setErrorMessage("Google Sign-In failed: No credential received.");
        return;
      }

      setIsGoogleLoading(true);
      setErrorMessage("");

      try {
        // Unified authentication: role is determined server-side from existing account or defaults to TENANT
        const res = await apiClient.post<AuthResponse>("/auth/oauth/google", {
          idToken,
        });

        await handleAuthSuccess(res.data);
      } catch (err: any) {
        console.error("Google authentication error:", err);
        const status = err.response?.status;
        const msg = err.response?.data?.message || err.response?.data?.error;
        if (status === 403 || msg?.toLowerCase().includes("deactivated")) {
          setErrorMessage("This account has been deactivated. Please contact KEYRA support.");
        } else if (msg) {
          setErrorMessage(msg);
        } else if (err.code === "ERR_NETWORK") {
          setErrorMessage("Network error connecting to KEYRA server. Please check your connection.");
        } else {
          setErrorMessage(
            "Google Sign-In failed on backend. Please retry or sign in with phone OTP."
          );
        }
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  // Fallback trigger if official button has not rendered yet
  const handleManualGoogleClick = () => {
    setErrorMessage("");
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.warn("GSI prompt not displayed:", notification.getNotDisplayedReason());
            setErrorMessage(
              "Google Sign-In prompt could not be displayed. If using local development, ensure http://localhost:3000 is added to Authorized JavaScript origins in Google Cloud Console."
            );
          } else if (notification.isSkippedMoment()) {
            console.warn("GSI prompt skipped:", notification.getSkippedReason());
          }
        });
      } catch (err: any) {
        console.warn("Google prompt error:", err);
        setErrorMessage("Google Sign-In prompt failed. Please use phone OTP.");
      }
    } else {
      setErrorMessage("Google Identity Services is initializing. Please wait a moment or use phone OTP.");
    }
  };

  // Initialize Google Identity Services
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "803170070973-b8mc27tpbqim5dn2qacf2g8s9tv76gik.apps.googleusercontent.com";

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleButtonContainerRef.current) {
            googleButtonContainerRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(
              googleButtonContainerRef.current,
              {
                type: "standard",
                theme: "outline",
                size: "large",
                text: "continue_with",
                shape: "pill",
                width: 320,
                logo_alignment: "left",
              }
            );
            setIsGsiLoaded(true);
          }
        } catch (e) {
          console.warn("Failed to initialize Google Identity Services:", e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      // Dynamically load Google Identity Services SDK
      const scriptId = "google-gsi-client";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initGsi();
        };
        script.onerror = () => {
          console.warn("Failed to load Google Identity Services script");
        };
        document.body.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(checkInterval);
            initGsi();
          }
        }, 100);
        return () => clearInterval(checkInterval);
      }
    }
  }, [isAuthModalOpen, handleGoogleCredentialResponse]);

  // Reset state on modal open/close
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep("phone");
      setPhoneNumber("");
      setOtp(["", "", "", "", "", ""]);
      setErrorMessage("");
      setIsLoading(false);
      setIsGoogleLoading(false);
    }
  }, [isAuthModalOpen]);

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  // 1. Send OTP Request
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/auth/otp/request", {
        phoneNumber: `+91${cleaned}`,
      });
      setStep("otp");
      setTimer(30);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to send verification code. Please retry."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto advance to next box
    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code");
      return;
    }

    setIsLoading(true);
    try {
      const cleaned = phoneNumber.replace(/\D/g, "");
      // Unified account authentication: no role parameter required
      const res = await apiClient.post<AuthResponse>("/auth/otp/verify", {
        phoneNumber: `+91${cleaned}`,
        code: fullOtp,
      });

      await handleAuthSuccess(res.data);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Invalid or expired verification code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-elevated border border-slate-100">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <KeyraLogo height={44} href={null} className="h-11 w-auto" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#0F1E36]">
            {step === "phone" ? "Sign In to KEYRA" : "Enter Verification Code"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {step === "phone"
              ? "Zero Brokerage. Verified Homes. Direct Owner Connect."
              : `Code sent via SMS to +91 ${phoneNumber}`}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Phone Input & Google Sign-In */}
        {step === "phone" ? (
          <div className="space-y-4">
            {/* Google Sign-In Button Container */}
            <div className="flex flex-col items-center justify-center">
              <div
                ref={googleButtonContainerRef}
                id="google-signin-btn-container"
                className="w-full flex justify-center min-h-[44px]"
              />
              {!isGsiLoaded && (
                <button
                  type="button"
                  onClick={handleManualGoogleClick}
                  className="w-full max-w-[320px] flex items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              )}
              {isGoogleLoading && (
                <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-[#C5A059]" />
                  Authenticating with Google...
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2.5 text-slate-400 font-semibold tracking-wider text-[10px]">
                  Or verify with phone OTP
                </span>
              </div>
            </div>

            {/* Phone Form */}
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="flex rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-[#C5A059] focus-within:border-transparent overflow-hidden">
                  <span className="inline-flex items-center bg-slate-50 px-3 text-sm font-semibold text-slate-600 border-r border-slate-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                className="w-full justify-center h-11 text-sm font-semibold"
                disabled={isLoading || phoneNumber.length !== 10}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                    Code...
                  </>
                ) : (
                  <>
                    Get Verification Code{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-[11px] text-center text-slate-400 mt-2">
                By continuing, you agree to KEYRA&apos;s{" "}
                <Link
                  href="/legal/terms"
                  className="underline hover:text-slate-600"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/legal/privacy"
                  className="underline hover:text-slate-600"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>
        ) : (
          /* Step 2: OTP Entry */
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="flex justify-between gap-2 my-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputsRef.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="h-12 w-11 rounded-lg border border-slate-300 text-center text-lg font-bold text-slate-900 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full justify-center h-11 text-sm font-semibold"
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Verify & Sign In <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="hover:text-slate-800 underline"
              >
                Change Number
              </button>

              {timer > 0 ? (
                <span>Resend code in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-[#C5A059] font-semibold hover:underline"
                >
                  Resend Code
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
