"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 50; // Account for sticky nav height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    closeMobileMenu(); // Close mobile menu if open
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();
  return (
    <nav className="sticky top-4 z-50 relative isolate mx-4 sm:mx-auto max-w-6xl rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-gray-200 dark:border-white/10 bg-transparent mt-4 sm:mt-0">
      {/* Liquid glass background */}
      <div className="absolute inset-0 -z-10 pointer-events-none rounded-2xl">
        <div className="absolute inset-0 rounded-2xl backdrop-blur-2xl bg-white-500/10 dark:bg-white/5" />
        {/* glossy lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/20" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/15" />
        {/* liquid blobs */}
        <div className="absolute -top-12 left-8 h-28 w-28 rounded-full blur-2xl bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_60%)]" />
        <div className="absolute -bottom-10 right-10 h-32 w-32 rounded-full blur-2xl bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.20),transparent_60%)]" />
      </div>
      <div className="px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 bg-transparent dark:bg-white p-2 rounded-xl">
              <Image src="/logo.png" alt="SalesHQ" width={isScrolled ? 100 : 110} height={isScrolled ? 100 : 150} className="transition-all duration-300" onClick={() => router.push("/")} />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, 'how-it-works')} className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors font-medium">How It Works</a>
            <a href="#integrations" onClick={(e) => handleSmoothScroll(e, 'integrations')} className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors font-medium">Integrations</a>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors font-medium">Contact</Link>
            {!isLoading && (
              isAuthenticated ? (
                <Link href="/chat">
                  <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-500 hover:to-blue-500 shadow-lg">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-emerald-400 shadow-lg">
                    Join Early Access
                  </Button>
                </Link>
              )
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 dark:border-white/10 bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/10 rounded-b-2xl overflow-hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="px-3 pb-2 flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
                <ThemeToggle />
              </div>
              <a
                href="#how-it-works"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
              >
                How It Works
              </a>
              <a
                href="#integrations"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                onClick={(e) => handleSmoothScroll(e, 'integrations')}
              >
                Integrations
              </a>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              <div className="pt-2">
                {!isLoading && (
                  isAuthenticated ? (
                    <Link href="/chat">
                      <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg" onClick={closeMobileMenu}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/contact">
                      <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg" onClick={closeMobileMenu}>
                        Join Early Access
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 