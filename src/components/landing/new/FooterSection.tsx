'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Bot,
  Mail,
  Twitter,
  Linkedin,
  Youtube,
  Github,
  MapPin,
  Phone,
  Globe,
  ArrowRight,
  Shield,
  Award
} from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Integrations", href: "#integrations" },
    { label: "Pricing", href: "#pricing" },
    { label: "API Docs", href: "/docs/api" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" }
  ],
  solutions: [
    { label: "For Sales Teams", href: "/solutions/sales" },
    { label: "For Support", href: "/solutions/support" },
    { label: "For E-commerce", href: "/solutions/ecommerce" },
    { label: "For SaaS", href: "/solutions/saas" },
    { label: "Enterprise", href: "/enterprise" }
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers", badge: "We're hiring!" },
    { label: "Blog", href: "/blog" },
    { label: "Press Kit", href: "/press" },
    { label: "Partners", href: "/partners" },
    { label: "Contact", href: "#contact" }
  ],
  resources: [
    { label: "Help Center", href: "/help" },
    { label: "Community", href: "/community" },
    { label: "Webinars", href: "/webinars" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Templates", href: "/templates" },
    { label: "Status", href: "/status" }
  ]
};

const socialLinks = [
  { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/SalesHQ", label: "Twitter" },
  { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com/company/SalesHQ", label: "LinkedIn" },
  { icon: <Youtube className="w-5 h-5" />, href: "https://youtube.com/@SalesHQ", label: "YouTube" },
  { icon: <Github className="w-5 h-5" />, href: "https://github.com/SalesHQ", label: "GitHub" }
];

export default function FooterSection() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      {/* Newsletter section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay ahead with SalesHQ insights
              </h3>
              <p className="text-gray-400">
                Get the latest AI sales tips, product updates, and exclusive offers delivered weekly.
              </p>
            </div>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">SalesHQ</span>
              </div>
              <p className="text-gray-400 mb-6">
                AI-powered sales intelligence platform that helps teams close deals 3x faster with real-time transcription and smart suggestions.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm">SOC 2 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">G2 Leader 2024</span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-gray-800 mb-8" />

        {/* Contact info and bottom section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>Chhattisgarh, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>+91 9617874449</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <a href="mailto:hello@SalesHQ.ai" className="hover:text-white transition-colors">
                hello@SalesHQ.ai
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm md:justify-end">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-white transition-colors">
              Security
            </Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} SalesHQ, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Globe className="w-4 h-4 text-gray-500" />
            <select className="bg-transparent text-sm text-gray-400 border-none focus:outline-none cursor-pointer">
              <option>English (US)</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
              <option>日本語</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}