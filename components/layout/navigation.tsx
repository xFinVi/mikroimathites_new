"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Αρχική" },
  { href: "/gia-goneis", label: "Για Γονείς" },
  { href: "/drastiriotites", label: "Δραστηριότητες" },
  { href: "/epikoinonia", label: "Επικοινωνία" },
  { href: "/sxetika", label: "Σχετικά" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative text-base font-medium transition-colors duration-200",
              "text-white hover:text-accent-yellow",
              isActive && "text-accent-yellow"
            )}
          >
            {item.label}
            {isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-yellow rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

