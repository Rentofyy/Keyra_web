"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { UserProfile } from "@/types/auth";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  User,
  ShieldCheck,
  Wallet,
  Phone,
  Mail,
  Calendar,
  LogOut,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Lock,
  Loader2,
} from "lucide-react";

interface WalletTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

interface WalletData {
  walletBalance: number;
  recentTransactions?: WalletTransaction[];
  termsNotice?: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();

  const { data: profileData, isLoading: isProfileLoading } = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await apiClient.get<any>("/auth/me");
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const { data: walletData, isLoading: isWalletLoading } = useQuery<WalletData>({
    queryKey: ["user-wallet"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<WalletData>("/wallet");
        return res.data;
      } catch {
        return { walletBalance: 0, recentTransactions: [] };
      }
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-[#0F1E36]">
          <Lock className="h-8 w-8 text-[#C5A059]" />
        </div>
        <h2 className="font-heading text-2xl font-extrabold text-[#0F1E36] mt-4">
          Account & Wallet
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Please sign in to view your verified profile, manage cashback rewards, and see transaction history.
        </p>
        <Button
          variant="gold"
          onClick={() => openAuthModal("/profile")}
          className="mt-6 font-bold shadow-gold px-6"
        >
          Sign In
        </Button>
      </div>
    );
  }

  const profile = profileData || user;
  const balance = walletData?.walletBalance ?? 0;
  const transactions = walletData?.recentTransactions || [];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#006A61] bg-[#E6F5F3] px-2.5 py-1 rounded-full">
            Account Management
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F1E36] mt-1.5">
            Profile & Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Unified KEYRA Account: Access both tenant search and landlord listing features.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 self-start sm:self-auto"
        >
          <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0F1E36] text-[#C5A059] font-heading font-extrabold text-3xl shadow-md">
              {profile?.fullName ? profile.fullName[0].toUpperCase() : <User className="h-10 w-10 text-white" />}
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-900 mt-4">
              {profile?.fullName || "KEYRA Member"}
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{profile?.phoneNumber}</p>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#E6F5F3] px-3 py-1 text-xs font-bold text-[#006A61]">
              <ShieldCheck className="h-3.5 w-3.5" /> Unified Platform User
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
            {profile?.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#C5A059] shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#C5A059] shrink-0" />
              <span>{profile?.phoneNumber}</span>
            </div>
            {profile?.createdAt && (
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Joined {formatDate(profile.createdAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Wallet & Rewards Panel */}
        <div className="md:col-span-2 space-y-6">
          {/* Balance Card */}
          <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  KEYRA Wallet & Rewards
                </span>
                <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0F1E36] mt-1">
                  ₹{balance.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Applicable towards rental payments, tenant background checks, and care plan subscriptions.
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C5A059] text-[#0F1E36] shadow-gold">
                <Wallet className="h-7 w-7" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <strong>Earn ₹500 Instant Cashback:</strong> List your apartment on KEYRA, and when you mark it rented to a verified tenant, ₹500 is directly credited to your wallet balance.
              </div>
            </div>
          </div>

          {/* Transactions History */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading text-base font-bold text-slate-900">
                Recent Transactions
              </h4>
              <span className="text-xs text-slate-400">
                {transactions.length} Records
              </span>
            </div>

            {isWalletLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#C5A059]" />
                <p className="mt-2 text-xs text-slate-500">Loading wallet history...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No recent transactions. Your rental rewards and cashback will appear here.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <ArrowDownLeft className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{t.description || "Cashback Reward"}</p>
                        <p className="text-slate-400 text-[11px]">{formatDate(t.createdAt)}</p>
                      </div>
                    </div>
                    <span className="font-heading font-extrabold text-emerald-700 text-sm">
                      +₹{t.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
