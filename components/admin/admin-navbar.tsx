"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Home, FileText, Settings, Menu, X, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminNavbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/submissions?status=not_answered", label: "Αιτήματα", icon: FileText },
    { href: "/studio", label: "Studio", icon: Layout },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0d1330] shadow-lg border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/logo.png"
              alt="Μικροί Μαθητές"
              width={150}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
            <span className="text-white font-semibold ml-2 hidden lg:inline">
              Admin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side - User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* User Email */}
            {session?.user?.email && (
              <span className="hidden lg:inline text-sm text-white/80">
                {session.user.email}
              </span>
            )}

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Logout</span>
            </Button>

            {/* Back to Site */}
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <Home className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Site</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          
          {/* Menu Panel */}
          <div 
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-gradient-to-b from-[#1a1f3a] via-[#1a1f3a] to-[#0d1330] shadow-2xl border-l border-white/10 z-[9999] lg:hidden animate-slide-in-from-right"
            style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: '100%', maxWidth: '384px' }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Admin Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                  
                  {/* User Email */}
                  <div className="pt-4 mt-4 border-t border-white/10">
                    {session?.user?.email && (
                      <p className="px-4 py-2 text-sm text-white/60">
                        {session.user.email}
                      </p>
                    )}
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors mt-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>

                  {/* Back to Site */}
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Home className="h-5 w-5" />
                    <span>Back to Site</span>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

