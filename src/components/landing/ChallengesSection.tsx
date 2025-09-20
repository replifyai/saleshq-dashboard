import { Users, Zap, Settings, BarChart3, ArrowRight, AlertTriangle, Clock, Target, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ChallengesSection = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('challenges-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const challenges = [
    {
      icon: Users,
      title: "Knowledge Gaps & Onboarding",
      description: "New team members struggle to access the right information at the right time, leading to longer ramp-up periods and inconsistent performance across your organization.",
      impact: "40% longer ramp-up time",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20",
      borderColor: "border-red-200 dark:border-red-800/50"
    },
    {
      icon: Zap,
      title: "Fragmented Workflows",
      description: "Teams waste valuable time switching between multiple platforms and tools, breaking their flow and reducing productivity when engaging with customers.",
      impact: "3+ hours lost daily",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800/50"
    },
    {
      icon: Settings,
      title: "Manual Processes",
      description: "Customer-facing teams spend too much time on administrative work instead of focusing on high-value activities that drive business growth.",
      impact: "60% time on admin tasks",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800/50"
    },
    {
      icon: BarChart3,
      title: "Limited Performance Visibility",
      description: "Leaders lack actionable insights into team effectiveness, making it difficult to identify improvement opportunities and measure the impact of enablement efforts.",
      impact: "No data-driven decisions",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800/50"
    }
  ];

  const stats = [
    { label: "Average Ramp-up Time", value: "6-8 months", icon: <Clock className="w-5 h-5" /> },
    { label: "Productivity Loss", value: "40%", icon: <TrendingDown className="w-5 h-5" /> },
    { label: "Admin Time Spent", value: "60%", icon: <Settings className="w-5 h-5" /> },
    { label: "Data-Driven Decisions", value: "15%", icon: <Target className="w-5 h-5" /> }
  ];

  return (
    <section 
      id="challenges-section"
      className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Professional Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(239,68,68,0.02)_50%,transparent_75%)] bg-[length:20px_20px]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950/20 dark:to-orange-950/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-purple-50 to-pink-100 dark:from-purple-950/20 dark:to-pink-950/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Professional Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-full bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-red-200 dark:border-red-800/50">
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
            Common Sales Challenges
          </div>
          
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="text-gray-900 dark:text-white">
              The Hidden Costs of
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Inefficient Sales Operations
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            Most sales teams face these critical challenges that silently drain productivity, 
            reduce revenue, and create unnecessary friction in the sales process.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white">
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {challenges.map((challenge, index) => (
            <Card
              key={index}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${challenge.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <challenge.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {challenge.title}
                      </h3>
                      <Badge 
                        variant="destructive" 
                        className="text-xs font-semibold w-fit"
                      >
                        {challenge.impact}
                      </Badge>
                    </div>
                    
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                      {challenge.description}
                    </p>
                    
                    <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r ${challenge.bgColor} border ${challenge.borderColor}`}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Impact: {challenge.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Professional CTA Section */}
        {/* <div className="text-center">
          <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200 dark:border-red-800">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Solve These Challenges?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                See how our AI-powered platform has helped 500+ teams overcome these exact challenges 
                and transform their sales operations.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => router.push('/case-studies')}
              >
                <BarChart3 className="mr-2 w-5 h-5" />
                View Success Stories
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                onClick={() => router.push('/contact')}
              >
                <ArrowRight className="mr-2 w-5 h-5" />
                Get Started
              </Button>
            </div>
            
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>✓ Free consultation • ✓ Custom solution • ✓ 30-day trial</p>
            </div>
          </Card>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default ChallengesSection;