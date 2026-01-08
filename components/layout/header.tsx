"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import { Navigation } from "./navigation";
import { MobileMenu } from "./mobile-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  // useSession must be wrapped in SessionProvider - handled by Providers in root layout
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  // Pages with light backgrounds that need dark navbar
  const needsDarkNavbar = pathname === "/support";

  useEffect(() => {
    const handleScroll = () => {
      // Smooth transition when scrolling past 30px
      setIsScrolled(window.scrollY > 30);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Always show dark navbar on support page, or when scrolled on other pages
  const shouldShowDarkNavbar = needsDarkNavbar || isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out",
        shouldShowDarkNavbar
          ? "bg-[#0d1330]/90 shadow-xl backdrop-blur-sm border-b border-white/10"
          : "bg-[#0d1330]/20 backdrop-blur-sm border-b border-white/5"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 sm:h-24 items-center justify-between">
          {/* Logo - Left */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity z-10"
          >
            <Image
              src="/images/logo.png"
              alt="Μικροί Μαθητές"
              width={200}
              height={70}
              className="h-14 sm:h-18 md:h-20 lg:h-24 xl:h-28 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation - Center */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
            <Navigation />
          </div>

          {/* Right Side - Search, Dashboard (Admin), & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Dashboard Link - Admin Only */}
            {isAdmin && (
              <Link
                href="/admin/submissions?status=not_answered"
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors group"
                aria-label="Admin Dashboard"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="h-5 w-5 text-white group-hover:text-primary-pink transition-colors" />
              </Link>
            )}

            {/* Search Icon - Desktop */}
            <button
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-white" />
            </button>

            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
