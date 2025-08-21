import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import ThemeToggle from "@/components/theme-toggle";

export default function LandingNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };


  return (
    <nav className="sticky top-4 z-50 relative isolate mx-4 sm:mx-6 lg:mx-10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-gray-200 dark:border-white/10 bg-transparent">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Replify
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Self-Learning AI Platform</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors font-medium">How It Works</a>
            <a href="#features" className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors font-medium">Pricing</a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors font-medium">Contact</a>
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
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-500 hover:to-emerald-400 shadow-lg">
                    Start Free Trial
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
                onClick={closeMobileMenu}
              >
                How It Works
              </a>
              <a 
                href="#features" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Pricing
              </a>
              <a 
                href="#contact" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Contact
              </a>
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
                    <Link href="/login">
                      <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg" onClick={closeMobileMenu}>
                        Start Free Trial
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