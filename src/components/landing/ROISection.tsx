import { Clock, TrendingUp, DollarSign, HelpCircle } from "lucide-react";
import { Badge } from "../ui/badge";

export default function ROISection() {
  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Calculate Your 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "} ROI with Replify
            </span>     
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See how much time and money your sales team can save with AI-powered document intelligence.
          </p>
        </div> */}
        <div className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 border-0">
            <DollarSign className="w-3 h-3 mr-1" />
            ROI
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              {" "} Calculate Your
            </span>
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ROI with SalesHQ
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how much time and money your sales team can save with AI-powered document intelligence.          </p>
        </div>

        <div className="rounded-2xl shadow-2xl p-8 lg:p-12 bg-white/5 border border-white/10 backdrop-blur">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Average Customer Savings
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center">
                    <Clock className="w-6 h-6 text-emerald-400 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Time Saved Daily</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">3+ Hours</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center">
                    <TrendingUp className="w-6 h-6 text-blue-400 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Response Speed</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-400">3x Faster</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 text-purple-400 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Revenue Increase</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-400">35% Average</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-8 bg-white/5 border border-white/10">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                For a 10-Person Sales Team
              </h4>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-600 dark:text-gray-300">Time saved per month</span>
                  <span className="font-bold text-gray-900 dark:text-white">600+ hours</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-600 dark:text-gray-300">Cost savings (@ $50/hour)</span>
                  <span className="font-bold text-gray-900 dark:text-white">$30,000/month</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-600 dark:text-gray-300">Revenue increase potential</span>
                  <span className="font-bold text-gray-900 dark:text-white">$100,000+/month</span>
                </div>

                <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg p-4 mt-6">
                  <div className="text-center text-white">
                    <p className="text-sm font-medium">Total Monthly ROI</p>
                    <p className="text-3xl font-bold">$130,000+</p>
                    <p className="text-sm opacity-90">vs. $490 SalesHQ cost</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 