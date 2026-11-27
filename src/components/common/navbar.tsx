"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useFilterStore } from "@/stores/filter-store";
import { Button } from "@/components/ui/button";
import { KeyraLogo } from "@/components/common/keyra-logo";
import { PUNE_WEST_LOCALITIES } from "@/lib/constants";
import {
  Search,
  MapPin,
  Heart,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Users,
  Compass,
} from "lucide-react";

function NavbarNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category")?.toUpperCase();

  const isExplore = pathname === "/properties" && (!categoryParam || categoryParam === "RESIDENTIAL");
  const isColiving = pathname === "/properties" && categoryParam === "COLIVING";
  const isCommercial = pathname === "/properties" && categoryParam === "COMMERCIAL";
  const isMap = pathname === "/properties/map";

  return (
    <nav className="hidden md:flex items-center gap-1 lg:gap-2">
      <Link
        href="/properties"
        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
          isExplore
            ? "bg-[#F4EBD9]/70 text-[#060C18] font-bold border border-[#C5A059]/40 shadow-xs"
            : "font-medium text-slate-700 hover:text-[#060C18] hover:bg-slate-50"
        }`}
      >
        <Compass className={`h-4 w-4 ${isExplore ? "text-[#C5A059]" : "text-slate-400"}`} />
        <span>Explore</span>
      </Link>
      <Link
        href="/properties?category=COLIVING"
        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
          isColiving
            ? "bg-[#F4EBD9]/70 text-[#060C18] font-bold border border-[#C5A059]/40 shadow-xs"
            : "font-medium text-slate-700 hover:text-[#060C18] hover:bg-slate-50"
        }`}
      >
        <Users className={`h-4 w-4 ${isColiving ? "text-[#C5A059]" : "text-slate-400"}`} />
        <span>Coliving</span>
      </Link>
      <Link
        href="/properties?category=COMMERCIAL"
        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
          isCommercial
            ? "bg-[#F4EBD9]/70 text-[#060C18] font-bold border border-[#C5A059]/40 shadow-xs"
            : "font-medium text-slate-700 hover:text-[#060C18] hover:bg-slate-50"
        }`}
      >
        <Building2 className={`h-4 w-4 ${isCommercial ? "text-[#C5A059]" : "text-slate-400"}`} />
        <span>Commercial</span>
      </Link>
      <Link
        href="/properties/map"
        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
          isMap
            ? "bg-[#F4EBD9]/70 text-[#060C18] font-bold border border-[#C5A059]/40 shadow-xs"
            : "font-medium text-slate-700 hover:text-[#060C18] hover:bg-slate-50"
        }`}
      >
        <MapPin className={`h-4 w-4 ${isMap ? "text-[#C5A059]" : "text-slate-400"}`} />
        <span>Map View</span>
      </Link>
    </nav>
  );
}

function MobileMenuNavLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category")?.toUpperCase();

  const isExplore = pathname === "/properties" && (!categoryParam || categoryParam === "RESIDENTIAL");
  const isColiving = pathname === "/properties" && categoryParam === "COLIVING";
  const isCommercial = pathname === "/properties" && categoryParam === "COMMERCIAL";
  const isMap = pathname === "/properties/map";

  return (
    <div className="grid grid-cols-2 gap-2 pt-2">
      <Link
        href="/properties"
        onClick={onNavigate}
        className={`flex items-center gap-2 p-2 text-sm rounded-lg transition-colors ${
          isExplore
            ? "bg-[#F4EBD9]/80 text-[#060C18] font-bold border border-[#C5A059]/40"
            : "font-medium text-slate-700 hover:bg-slate-50"
        }`}
      >
        <Compass className={`h-4 w-4 ${isExplore ? "text-[#C5A059]" : "text-slate-400"}`} />
        <span>Explore</span>
      </Link>
      <Link
        href="/properties/map"
        onClick={onNavigate}
        className={`flex items-center gap-2 p-2 text-sm rounded-lg transition-colors ${
          isMap
            ? "bg-[#F4EBD9]/80 text-[#060C18] font-bold border border-[#C5A059]/40"
            : "font-medium text-slate-700 hover:bg-slate-50"
        }`}
      >
        <MapPin className={`h-4 w-4 ${isMap ? "text-[#C5A059]" : "text-slate-400"}`} />
        <span>Map View</span>
      </Link>
      <Link
        href="/properties?category=COLIVING"
        onClick={onNavigate}
        className={`flex items-center gap-2 p-2 text-sm rounded-lg transition-colors ${
          isColiving
            ? "bg-[#F4EBD9]/80 text-[#060C18] font-bold border border-[#C5A059]/40"
            : "font-medium text-slate-700 hover:bg-slate-50"
        }`}
      >
        <Users className={`h-4 w-4 ${isColiving ? "text-[#C5A059]" : "text-slate-400"}`} />
        <span>Coliving</span>
      </Link>
      <Link
        href="/properties?category=COMMERCIAL"
        onClick={onNavigate}
        className={`flex items-center gap-2 p-2 text-sm rounded-lg transition-colors ${
          isCommercial
            ? "bg-[#F4EBD9]/80 text-[#060C18] font-bold border border-[#C5A059]/40"
            : "font-medium text-slate-700 hover:bg-slate-50"
        }`}
      >
        <Building2 className={`h-4 w-4 ${isCommercial ? "text-[#C5A059]" : "text-slate-400"}`} />
        <span>Commercial</span>
      </Link>
    </div>
  );
}

export function Navbar() {
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
  const { locality, setLocality } = useFilterStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Locality Dropdown */}
        <div className="flex items-center gap-6">
          <KeyraLogo height={42} priority className="h-10 sm:h-11 w-auto" />

          {/* Micro-market selector */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-[#C5A059]" />
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">Pune West (All)</option>
              {PUNE_WEST_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Desktop Navigation Links with Active Highlighting */}
        <Suspense
          fallback={
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <span className="text-sm font-medium text-slate-700 px-3 py-2">Explore</span>
              <span className="text-sm font-medium text-slate-700 px-3 py-2">Coliving</span>
              <span className="text-sm font-medium text-slate-700 px-3 py-2">Commercial</span>
              <span className="text-sm font-medium text-slate-700 px-3 py-2">Map View</span>
            </nav>
          }
        >
          <NavbarNavLinks />
        </Suspense>

        {/* Right: Actions, Post Property & User Profile */}
        <div className="flex items-center gap-3">
          {/* Post Property (+) Button */}
          <Link href="/owner/properties/new" className="hidden sm:inline-flex">
            <Button
              variant="gold"
              size="sm"
              className="flex items-center gap-1.5 shadow-gold font-semibold"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post Property</span>
              <span className="ml-1 text-[11px] rounded bg-[#060C18]/10 px-1.5 py-0.2 font-bold">
                FREE
              </span>
            </Button>
          </Link>

          {/* User Profile / Auth State */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 p-1.5 hover:border-slate-300 focus:outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#060C18] text-white text-xs font-bold">
                  {user?.fullName ? user.fullName[0].toUpperCase() : <User className="h-4 w-4" />}
                </div>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-elevated z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-sm font-bold text-slate-900">
                      {user?.fullName || "KEYRA User"}
                    </p>
                    <p className="text-xs text-slate-500">{user?.phoneNumber}</p>
                    <span className="mt-1 inline-flex items-center gap-1 rounded bg-[#E6F5F3] px-1.5 py-0.5 text-[10px] font-semibold text-[#006A61]">
                      <ShieldCheck className="h-3 w-3" /> Unified Account
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/tenant/visits"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      My Scheduled Visits
                    </Link>
                    <Link
                      href="/favourites"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      Saved Properties
                    </Link>
                    <Link
                      href="/owner/dashboard"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      Owner Dashboard
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => openAuthModal()}
              className="text-xs font-semibold"
            >
              Sign In
            </Button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white p-4 space-y-4 md:hidden animate-in slide-in-from-top-2">
          {/* Micro-market selector for mobile */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <MapPin className="h-4 w-4 text-[#C5A059]" />
            <select
              value={locality}
              onChange={(e) => {
                setLocality(e.target.value);
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
            >
              <option value="">Pune West (All Localities)</option>
              {PUNE_WEST_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <Suspense fallback={<div className="grid grid-cols-2 gap-2 pt-2" />}>
            <MobileMenuNavLinks onNavigate={() => setIsMobileMenuOpen(false)} />
          </Suspense>

          <div className="pt-2">
            <Link
              href="/owner/properties/new"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full"
            >
              <Button variant="gold" className="w-full justify-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Post Free Property Listing
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
