import { Bot, Building, Mail, Globe, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function FooterSection() {
  return (
    <footer className="py-16" style={{backgroundImage: 'url(/1.png)', backgroundSize: 'cover', backgroundPosition: 'center', color: '#2C2C2C'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div>
                <Image src="/logo.png" alt="SalesHQ" width={150} height={150} />
                <p className="text-sm" style={{color: '#2C2C2C'}}>Self-Learning AI Platform</p>
              </div>
            </div>
            <p className="mb-6 max-w-md" style={{color: '#2C2C2C'}}>
              Transform your sales team with AI-powered document intelligence. Get instant answers, 
              train your AI in real-time, and close more deals faster.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg" style={{color: '#2C2C2C'}}>Product</h4>
            <ul className="space-y-3">
              <li><a href="#how-it-works" className="transition-colors" style={{color: '#2c2c2c'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F5F5F5'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#2c2c2c'}>How It Works</a></li>
              <li><a href="#features" className="transition-colors" style={{color: '#2c2c2c'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F5F5F5'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#2c2c2c'}>Features</a></li>
              <li><a href="#pricing" className="transition-colors" style={{color: '#2c2c2c'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F5F5F5'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#2c2c2c'}>Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg" style={{color: '#2C2C2C'}}>Support</h4>
            <ul className="space-y-3">
              <li><Link href="/contact" className="transition-colors" style={{color: '#2c2c2c'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F5F5F5'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#2c2c2c'}>Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="transition-colors" style={{color: '#2c2c2c'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F5F5F5'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#2c2c2c'}>Privacy Policy</Link></li>
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
        
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0" style={{color: '#666666'}}>
              &copy; {new Date().getFullYear()} SalesHQ. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/terms-of-service" className="transition-colors text-sm" style={{color: '#6A5ACD'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F5F5F5'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6A5ACD'}>Terms of Service</Link>
              <Link href="/privacy-policy" className="transition-colors text-sm" style={{color: '#6A5ACD'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F5F5F5'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6A5ACD'}>Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 