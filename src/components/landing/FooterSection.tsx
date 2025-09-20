"use client";
import Image from "next/image";
import Link from "next/link";
export default function FooterSection() {
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
  };
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div>
                <Image src="/logo.png" alt="SalesHQ" width={150} height={150} />
                <p className="text-sm text-gray-600 dark:text-gray-300">Self-Learning AI Platform</p>
              </div>
            </div>
            <p className="mb-6 max-w-md text-gray-600 dark:text-gray-300">
              Transform your sales team with AI-powered document intelligence. Get instant answers, 
              train your AI in real-time, and close more deals faster.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg text-gray-900 dark:text-white">Product</h4>
            <ul className="space-y-3">
              <li><a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, 'how-it-works')} className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">How It Works</a></li>
              <li><a href="#roi" onClick={(e) => handleSmoothScroll(e, 'roi')} className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Projected ROI</a></li>
              {/* <li><a href="#pricing" onClick={(e) => handleSmoothScroll(e, 'pricing')} className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pricing</a></li> */}
              <li><a href="#integrations" onClick={(e) => handleSmoothScroll(e, 'integrations')} className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg text-gray-900 dark:text-white">Solutions</h4>
            <ul className="space-y-3">
              <li><Link href="/solutions" className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">All Solutions</Link></li>
              <li><Link href="/solutions/sales" className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Sales Teams</Link></li>
              <li><Link href="/solutions/customer-support" className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Customer Support</Link></li>
              <li><Link href="/solutions/revops" className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">RevOps Teams</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg text-gray-900 dark:text-white">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About Us</Link></li>
              <li><Link href="/features" className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Features</Link></li>
              <li><Link href="/case-studies" className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Case Studies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg text-gray-900 dark:text-white">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/contact" className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Security / Compliance Badges (early stage) */}
        {/* <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-3">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span className="text-sm" style={{color: '#2C2C2C'}}>HTTPS & data encryption</span>
          </div>
          <div className="flex items-center space-x-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-3">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span className="text-sm" style={{color: '#2C2C2C'}}>SOC 2 in planning</span>
          </div>
          <div className="flex items-center space-x-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            <span className="text-sm" style={{color: '#2C2C2C'}}>GDPR friendly</span>
          </div>
          <div className="flex items-center space-x-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-3">
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
            <span className="text-sm" style={{color: '#2C2C2C'}}>Privacy-first by design</span>
          </div>
        </div> */}
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0 text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} SalesHQ. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/terms-of-service" className="transition-colors text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Terms of Service</Link>
              <Link href="/privacy-policy" className="transition-colors text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 