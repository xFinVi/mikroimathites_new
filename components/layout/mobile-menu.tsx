"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { X, Menu } from "lucide-react";

const navItems = [
  { href: "/", label: "Αρχική" },
  { href: "/gia-goneis", label: "Για Γονείς" },
  { href: "/drastiriotites", label: "Δραστηριότητες" },
  { href: "/epikoinonia", label: "Επικοινωνία" },
  { href: "/sxetika", label: "Σχετικά" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div
            className={cn(
              "fixed top-20 sm:top-24 left-0 right-0 bg-[#1a1f3a] border-b border-white/10 shadow-lg z-50 md:hidden",
              "animate-slide-in-from-top-2"
            )}
          >
            <nav className="flex flex-col py-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "px-6 py-3 text-base font-medium transition-colors",
                      "hover:bg-white/10",
                      isActive
                        ? "text-accent-yellow border-l-4 border-accent-yellow bg-accent-yellow/10"
                        : "text-white hover:text-accent-yellow"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}

