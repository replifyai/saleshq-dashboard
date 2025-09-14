import { Bot, Building, Mail, Globe, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="bg-transparent text-gray-900 dark:text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">SalesHQ</span>
                <p className="text-gray-400 text-sm">Self-Learning AI Platform</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              Transform your sales team with AI-powered document intelligence. Get instant answers, 
              train your AI in real-time, and close more deals faster.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Building className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg">Product</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li><a href="#how-it-works" className="hover:text-gray-900 dark:hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg">Support</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">System Status</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Security / Compliance Badges (early stage) */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 rounded-lg border border-gray-200 dark:border-white/10 p-3">
            <Lock className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">HTTPS & data encryption</span>
          </div>
          <div className="flex items-center space-x-3 rounded-lg border border-gray-200 dark:border-white/10 p-3">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">SOC 2 in planning</span>
          </div>
          <div className="flex items-center space-x-3 rounded-lg border border-gray-200 dark:border-white/10 p-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">GDPR friendly</span>
          </div>
          <div className="flex items-center space-x-3 rounded-lg border border-gray-200 dark:border-white/10 p-3">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Privacy-first by design</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SalesHQ. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 