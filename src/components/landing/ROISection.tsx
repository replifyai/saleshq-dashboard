import { Clock, TrendingUp, DollarSign, Target, Zap, BarChart3, ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function ROISection() {
  return (
    <section className="py-12 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20" id="roi">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-4 sm:mb-6 px-3 py-2 sm:px-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0 text-xs sm:text-sm font-medium">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Proven ROI Results
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Transform Your Sales
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Performance
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
            Join 500+ sales teams who've achieved measurable productivity gains with AI-powered sales intelligence. 
            See the data that proves our platform delivers real results.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Key Metrics Cards */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8">
              Industry-Leading Performance Metrics
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Time Savings Card */}
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700/50 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                </div>
                <div className="pr-16 sm:pr-20">
                  <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">Time Saved Daily</h4>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">3.2+</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Hours per sales rep</p>
                  <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-emerald-600 font-medium">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    +127% efficiency gain
                  </div>
                </div>
              </div>

              {/* Deal Velocity Card */}
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="pr-16 sm:pr-20">
                  <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">Deal Velocity</h4>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">40%</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Faster closing</p>
                  <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-blue-600 font-medium">
                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    +$2.3M avg revenue
                  </div>
                </div>
              </div>

              {/* Accuracy Card */}
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700/50 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
                <div className="pr-16 sm:pr-20">
                  <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">Query Resolution</h4>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">95%</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Accuracy rate</p>
                  <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-purple-600 font-medium">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    -60% support costs
                  </div>
                </div>
              </div>

              {/* ROI Card */}
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700/50 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                </div>
                <div className="pr-16 sm:pr-20">
                  <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">Average ROI</h4>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 mb-2">340%</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Within 6 months</p>
                  <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-orange-600 font-medium">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    $3.4M avg savings
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Impact Calculator */}
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 lg:p-8">
            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 text-center">
              Impact Calculator
            </h4>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">100</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Sales Team Size</div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center py-2 sm:py-3 px-3 sm:px-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Monthly time saved</span>
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">6,400+ hours</span>
                </div>

                <div className="flex justify-between items-center py-2 sm:py-3 px-3 sm:px-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Deals closed faster</span>
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">40% increase</span>
                </div>

                <div className="flex justify-between items-center py-2 sm:py-3 px-3 sm:px-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Query resolution</span>
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">95% accuracy</span>
                </div>

                <div className="flex justify-between items-center py-2 sm:py-3 px-3 sm:px-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Support tickets</span>
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">-60% reduction</span>
                </div>
              </div>

              {/* <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-6 text-white text-center">
                <div className="text-sm font-medium mb-2">Total Productivity Gain</div>
                <div className="text-3xl font-bold mb-2">$2.3M+</div>
                <div className="text-sm opacity-90">Annual value delivered</div>
              </div>

              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                Calculate Your ROI
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button> */}
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        {/* <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">500+</div>
              <div className="text-slate-600 dark:text-slate-300">Companies Trust Us</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">$50M+</div>
              <div className="text-slate-600 dark:text-slate-300">Revenue Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">99.9%</div>
              <div className="text-slate-600 dark:text-slate-300">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">24/7</div>
              <div className="text-slate-600 dark:text-slate-300">Support Available</div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
} 