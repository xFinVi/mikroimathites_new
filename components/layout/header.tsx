"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Navigation } from "./navigation";
import { MobileMenu } from "./mobile-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out",
        isScrolled
          ? "bg-[#0d1330]/90 shadow-xl backdrop-blur-sm border-b border-white/10"
          : "bg-[#0d1330]/75 shadow-md backdrop-blur-sm border-b border-white/10"
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
              className="h-14 sm:h-18 md:h-20 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation - Center */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
            <Navigation />
          </div>

          {/* Right Side - Search & Mobile Menu */}
          <div className="flex items-center gap-4">
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
