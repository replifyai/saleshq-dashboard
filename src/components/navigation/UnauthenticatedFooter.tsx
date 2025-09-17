"use client";

import Link from "next/link";
import { Bot, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";
export default function UnauthenticatedFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative isolate mx-auto max-w-6xl rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-gray-200 dark:border-white/10 bg-transparent mb-4" style={{backgroundImage: 'url(/1.png)', backgroundSize: 'cover', backgroundPosition: 'center', color: '#1a1a1a'}}>
      {/* Liquid glass background */}
      <div className="absolute inset-0 -z-10 pointer-events-none rounded-2xl">
        <div className="absolute inset-0 rounded-2xl backdrop-blur-2xl bg-white-500/10 dark:bg-white/5" />
        {/* glossy lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/20" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/15" />
        {/* liquid blobs */}
        <div className="absolute -top-12 right-8 h-28 w-28 rounded-full blur-2xl bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_60%)]" />
        <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full blur-2xl bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.20),transparent_60%)]" />
      </div>

      <div className="px-6 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div>
                <Image src="/logo.png" alt="SalesHQ" width={150} height={150} />
                <p className="text-sm text-gray-700 dark:text-gray-300">Self-Learning AI Platform</p>
              </div>
            </Link>
            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-4">
              Empowering sales teams with intelligent AI-driven insights and automated workflows. 
              Transform your customer interactions with our advanced learning platform.
            </p>
            <div className="flex space-x-4">
              <a 
                href="mailto:support@saleshq.ai" 
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Email us"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="tel:+919617874449" 
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Call us"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/#features" 
                  className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/#pricing" 
                  className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Legal & Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/terms-of-service" 
                  className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@saleshq.ai" 
                  className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors text-sm"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-700 dark:text-gray-300">
              <p>&copy; {currentYear} Copico Tech Solutions. All rights reserved.</p>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Raipur, Chhattisgarh, India</span>
              </div>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span>GST: 22CGLPA7663L1Z6</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}