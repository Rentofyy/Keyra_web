"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { formatRent, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Compass,
  Lock,
  ShieldCheck,
} from "lucide-react";

interface VisitItem {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  visitDate: string;
  timeSlot: string;
  status: "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  executiveName?: string;
  executivePhone?: string;
  createdAt?: string;
}

interface VisitQuota {
  freeVisitsRemaining: number;
  totalFreeVisits: number;
  usedFreeVisits: number;
  quotaExhausted: boolean;
}

export default function TenantVisitsPage() {
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch tenant visits
  const {
    data: visitPage,
    isLoading,
    refetch,
  } = useQuery<{ content: VisitItem[]; totalElements: number }>({
    queryKey: ["tenant-visits"],
    queryFn: async () => {
      const res = await apiClient.get<any>("/tenant/visits?size=50");
      return res.data;
    },
    enabled: isAuthenticated,
  });

  // Fetch visit quota
  const { data: quota } = useQuery<VisitQuota>({
    queryKey: ["tenant-visit-quota"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<VisitQuota>("/tenant/visits/quota");
        return res.data;
      } catch {
        return {
          freeVisitsRemaining: 3,
          totalFreeVisits: 3,
          usedFreeVisits: 0,
          quotaExhausted: false,
        };
      }
    },
    enabled: isAuthenticated,
  });

  const visits: VisitItem[] = visitPage?.content || [];

  const handleCancelVisit = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this scheduled visit?")) return;
    setCancellingId(id);
    try {
      await apiClient.patch(`/tenant/visits/${id}/cancel`);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel visit.");
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-[#060C18]">
          <Lock className="h-8 w-8 text-[#C5A059]" />
        </div>
        <h2 className="font-heading text-2xl font-extrabold text-[#060C18] mt-4">
          Sign In to View Visits
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Track your scheduled property inspections and meet with verified KEYRA field executives.
        </p>
        <Button
          variant="gold"
          onClick={() => openAuthModal("/tenant/visits")}
          className="mt-6 font-bold shadow-gold px-6"
        >
          Sign In with Mobile
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
            <XCircle className="h-3.5 w-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            <Clock className="h-3.5 w-3.5" /> Executive Assigned
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header & Quota Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#006A61] bg-[#E6F5F3] px-2.5 py-1 rounded-full">
            Tenant Visits
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#060C18] mt-1.5">
            My Scheduled Visits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Physical property walkthroughs with your dedicated KEYRA field executive.
          </p>
        </div>

        {/* Quota Indicator */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6F5F3] text-[#006A61]">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Free Visit Quota
            </span>
            <p className="text-sm font-extrabold text-slate-900">
              {quota?.freeVisitsRemaining ?? 3} of {quota?.totalFreeVisits ?? 3} Remaining
            </p>
          </div>
        </div>
      </div>

      {/* Visits List */}
      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#C5A059]" />
          <p className="mt-2 text-xs text-slate-500">Loading scheduled visits...</p>
        </div>
      ) : visits.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="font-heading text-lg font-bold text-slate-900 mt-4">
            No Visits Scheduled Yet
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven&apos;t booked any physical property visits. Browse verified homes in Pune West and schedule a free inspection.
          </p>
          <Link href="/properties">
            <Button variant="gold" className="mt-5 font-bold shadow-gold">
              <Compass className="mr-2 h-4 w-4" /> Explore Properties in Pune West
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((v) => (
            <div
              key={v.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusBadge(v.status)}
                  <span className="text-xs text-slate-400">
                    Booked {formatDate(v.createdAt || new Date().toISOString())}
                  </span>
                </div>

                <Link href={`/properties/${v.propertyId}`}>
                  <h4 className="font-heading text-base sm:text-lg font-bold text-slate-900 hover:text-[#C5A059] transition-colors">
                    {v.propertyTitle || "Property Walkthrough"}
                  </h4>
                </Link>

                <p className="text-xs text-slate-500 flex items-center">
                  <MapPin className="h-3.5 w-3.5 text-[#C5A059] mr-1.5 shrink-0" />
                  {v.propertyAddress}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
                  <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1">
                    <Calendar className="h-3.5 w-3.5 text-[#060C18]" />
                    Date: {v.visitDate}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1">
                    <Clock className="h-3.5 w-3.5 text-[#060C18]" />
                    Slot: {v.timeSlot}
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                <Link href={`/properties/${v.propertyId}`}>
                  <Button variant="outline" size="sm" className="text-xs font-bold">
                    View Property
                  </Button>
                </Link>

                {v.status !== "CANCELLED" && v.status !== "COMPLETED" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={cancellingId === v.id}
                    onClick={() => handleCancelVisit(v.id)}
                    className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    {cancellingId === v.id ? "Cancelling..." : "Cancel Visit"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
