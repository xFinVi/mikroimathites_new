"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, Activity, Mail, Info, Heart } from "lucide-react";

const navItems = [
  { href: "/", label: "Αρχική", icon: Home },
  { href: "/gia-goneis", label: "Για Γονείς", icon: Users },
  { href: "/drastiriotites", label: "Δραστηριότητες", icon: Activity },
  { href: "/epikoinonia", label: "Επικοινωνία", icon: Mail },
  { href: "/sxetika", label: "Σχετικά", icon: Info },
  { href: "/support", label: "Στήριξη", icon: Heart },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const pathname = usePathname();

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      // Wait for exit animation before closing
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const closeMenu = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <>
      {/* Animated Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden relative p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <div className="w-6 h-5 relative">
          {/* Top line */}
          <span
            className={cn(
              "absolute top-0 left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-center",
              isOpen
                ? "top-1/2 -translate-y-1/2 rotate-45"
                : "top-0 rotate-0"
            )}
          />
          {/* Middle line */}
          <span
            className={cn(
              "absolute top-1/2 left-0 w-full h-0.5 bg-white rounded-full transition-all duration-200 -translate-y-1/2",
              isOpen ? "opacity-0" : "opacity-100"
            )}
          />
          {/* Bottom line */}
          <span
            className={cn(
              "absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-center",
              isOpen
                ? "bottom-1/2 translate-y-1/2 -rotate-45"
                : "bottom-0 rotate-0"
            )}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            isAnimating ? "animate-backdrop-fade-in" : "animate-slide-out-to-right"
          )}
          onClick={closeMenu}
        >
          {/* Backdrop with blur */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-[#0d1330]/95 via-[#1a1f3a]/95 to-[#0d1330]/95",
              "backdrop-blur-md transition-opacity",
              prefersReducedMotion ? "duration-0" : "duration-300"
            )}
          />

          {/* Menu Panel - Slides in from right */}
          <div
            className={cn(
              "absolute top-0 right-0 h-full w-full max-w-sm bg-gradient-to-b from-[#1a1f3a] via-[#1a1f3a] to-[#0d1330]",
              "shadow-2xl border-l border-white/10",
              "flex flex-col",
              !prefersReducedMotion && (isAnimating ? "animate-slide-in-from-right" : "animate-slide-out-to-right")
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Μενού</h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Items with staggered animation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4">
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "group flex items-center gap-4 px-4 py-4 rounded-xl",
                        "text-base font-medium transition-all duration-200",
                        "relative overflow-hidden",
                        isActive
                          ? "bg-accent-yellow/20 text-accent-yellow border-2 border-accent-yellow/50 shadow-lg shadow-accent-yellow/20"
                          : "text-white/90 hover:text-white hover:bg-white/10 border-2 border-transparent"
                      )}
                      style={{
                        animationDelay: isAnimating && !prefersReducedMotion ? `${index * 50}ms` : "0ms",
                        animation: isAnimating && !prefersReducedMotion ? "menu-item-slide 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "none",
                      }}
                    >
                      {/* Icon with subtle animation */}
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-accent-yellow/20 text-accent-yellow"
                            : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white group-hover:scale-110"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Label */}
                      <span className="flex-1">{item.label}</span>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-yellow animate-pulse" />
                      )}

                      {/* Hover effect gradient */}
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-r from-accent-yellow/0 via-accent-yellow/5 to-accent-yellow/0",
                          "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                          "-translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                        )}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Decorative bottom section */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="px-4">
                  <p className="text-sm text-white/60 text-center">
                    Μικροί Μαθητές
                  </p>
                  <p className="text-xs text-white/40 text-center mt-1">
                    Υποστήριξη για γονείς
                  </p>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
