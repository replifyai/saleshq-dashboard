import { Badge } from "../ui/badge";
import { Search, Sparkles, RefreshCcw, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
export default function UseCasesSection() {
  const router = useRouter();
  const items = [
    {
      title: "Answer product questions instantly",
      description: "Ask in plain English and get source‑backed answers with links—no more tab hopping.",
      icon: Search,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      features: ["Natural language queries", "Source-backed answers", "Real-time responses"],
    },
    {
      title: "Build LSM-powered battlecards",
      description: "Pull competitive diffs and LSM-scored talking points while you're on a call.",
      icon: Sparkles,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      features: ["Competitive intelligence", "LSM scoring", "Live call support"],
    },
    {
      title: "Keep specs and pricing current",
      description: "SalesHQ learns continuously from your docs and LSM data so reps never share outdated info.",
      icon: RefreshCcw,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      features: ["Auto-updating content", "Version control", "Data accuracy"],
    },
  ];

  return (
    <section aria-label="Use cases" className="py-12 sm:py-20 lg:py-32 relative overflow-hidden" id="use-cases">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 dark:from-blue-950/10 dark:via-transparent dark:to-indigo-950/10" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-4 sm:mb-6 px-3 py-2 sm:px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg text-xs sm:text-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> 
            Use Cases
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              Where SalesHQ
            </span>{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              excels
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Transform your sales process with AI-powered workflows that deliver instant, accurate answers and boost team confidence on every call.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map(({ title, description, icon: Icon, color, bgColor, borderColor, features }, index) => (
            <div 
              key={title} 
              className={`group relative ${bgColor} rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 ${borderColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Card number */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-full flex items-center justify-center text-white dark:text-gray-900 text-xs sm:text-sm font-bold">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                {description}
              </p>
              
              {/* Features list */}
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              {/* CTA */}
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base">
                Learn more
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Button onClick={() => router.push('/features')} className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer text-sm sm:text-base">
            Explore all features
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}