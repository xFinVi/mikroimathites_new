"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Youtube, Instagram, Facebook, Music } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CookieSettingsModal } from "@/components/cookies/cookie-settings-modal";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState(false);

  // Listen for custom event to open cookie settings
  useEffect(() => {
    const handleOpenSettings = () => {
      setIsCookieSettingsOpen(true);
    };

    window.addEventListener("openCookieSettings", handleOpenSettings);
    return () => {
      window.removeEventListener("openCookieSettings", handleOpenSettings);
    };
  }, []);

  const navItems = [
    { href: "/", label: "Αρχική" },
    { href: "/sxetika", label: "Σχετικά" },
    { href: "/drastiriotites", label: "Δραστηριότητες" },
    { href: "/epikoinonia", label: "Επικοινωνία" },
    { href: "/gia-goneis", label: "Για Γονείς" },
    { href: "/support", label: "Στήριξη" },
  ];

  const socialLinks = [
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://www.youtube.com/@MikroiMathites",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/mikroimathites/",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/profile.php?id=61553477665097",
    },
    {
      name: "TikTok",
      icon: Music,
      href: "https://www.tiktok.com/@mikroimathites",
    },
  ];

  return (
    <footer className="bg-[#1a1f3a] text-white">
      <Container>
        <div className="py-12 md:py-16">
          {/* Top Navigation */}
          <nav className="flex flex-wrap justify-center gap-6 mb-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-bold text-white hover:text-accent-yellow transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Newsletter Section */}
          <div className="text-center mb-12">
            <p className="text-sm text-white mb-4">Νέα από τη γωνία...</p>
            <Button
              onClick={() => {
                // Scroll to newsletter section on homepage
                if (window.location.pathname === '/') {
                  document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Navigate to homepage and scroll to newsletter
                  window.location.href = '/#newsletter';
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-3 rounded-lg"
              size="lg"
            >
              Εγγραφή στο Newsletter
            </Button>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-6 mb-12">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-accent-yellow transition-colors"
                  aria-label={social.name}
                >
                  <Icon className="h-6 w-6" />
                </a>
              );
            })}
          </div>

          {/* Branding */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-[350px] h-48">
              <Image
                src="/images/logo.png"
                alt="Μικροί Μαθητές"
                fill
            //    className="object-contain"
              />
            </div>
            <span className="text-lg font-bold text-white">ΜΙΚΡΟΙ ΜΑΘΗΤΕΣ</span>
            <p className="text-sm text-white/80">
              © Μικροί Μαθητές {currentYear}
            </p>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white mb-4">
            <Link href="/epikoinonia" className="hover:text-accent-yellow transition-colors">
              Επικοινωνία
            </Link>
            <Link href="/privacy" className="hover:text-accent-yellow transition-colors">
              Απόρρητο
            </Link>
            <Link href="/terms" className="hover:text-accent-yellow transition-colors">
              Όροι & Προϋποθέσεις
            </Link>
          </div>

          {/* Cookie Settings */}
          <div className="text-left">
            <button
              onClick={() => setIsCookieSettingsOpen(true)}
              className="text-sm font-bold text-white uppercase hover:text-accent-yellow transition-colors"
            >
              ΡΥΘΜΙΣΕΙΣ COOKIES
            </button>
          </div>
        </div>
      </Container>

      {/* Cookie Settings Modal */}
      <CookieSettingsModal
        isOpen={isCookieSettingsOpen}
        onClose={() => setIsCookieSettingsOpen(false)}
      />
    </footer>
  );
}

