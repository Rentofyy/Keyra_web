"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Home, Search, PlusCircle, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/properties", icon: Search },
    {
      label: "Post (+)",
      href: "/owner/properties/new",
      icon: PlusCircle,
      isSpecial: true,
    },
    {
      label: "Visits",
      href: isAuthenticated ? "/tenant/visits" : "#",
      icon: Calendar,
      requiresAuth: true,
    },
    {
      label: isAuthenticated ? "Profile" : "Sign In",
      href: isAuthenticated ? "/profile" : "#",
      icon: User,
      requiresAuth: !isAuthenticated,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md px-2 py-1 shadow-elevated">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center -mt-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#C5A059] to-[#E5A93C] text-[#060C18] shadow-gold transition-transform active:scale-95">
                  <Icon className="h-6 w-6 stroke-[2.5]" />
                </div>
                <span className="mt-1 text-[10px] font-bold text-[#060C18]">
                  Post
                </span>
              </Link>
            );
          }

          const handleClick = (e: React.MouseEvent) => {
            if (item.requiresAuth && !isAuthenticated) {
              e.preventDefault();
              openAuthModal(item.href !== "#" ? item.href : undefined);
            }
          };

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleClick}
              className={cn(
                "flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[#060C18] font-bold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 mb-0.5",
                  isActive ? "text-[#C5A059]" : "text-slate-400"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
