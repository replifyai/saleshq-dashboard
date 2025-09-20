'use client'
import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Brain, 
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  Target,
  FileText,
  Database,
  Globe,
  Calendar,
  Star,
  Award,
  Activity,
  Layers
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  metrics: {
    value: string;
    label: string;
  };
  benefits: string[];
  category: string;
}

const features: Feature[] = [
  {
    id: "ai-intelligence",
    title: "AI-Powered Intelligence",
    description: "Advanced natural language processing that understands context and provides accurate, source-backed responses to complex sales questions.",
    icon: <Brain className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
    category: "Core AI",
    metrics: {
      value: "95%",
      label: "Accuracy Rate",
    },
    benefits: [
      "Context-aware responses",
      "Source citations",
      "Multi-language support",
      "Continuous learning"
    ]
  },
  {
    id: "real-time-chat",
    title: "Real-Time Communication",
    description: "Instant AI responses during calls, meetings, and customer interactions with seamless integration across all channels.",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "from-emerald-500 to-emerald-600",
    category: "Communication",
    metrics: {
      value: "0.8s",
      label: "Response Time",
    },
    benefits: [
      "Live transcription",
      "Instant suggestions",
      "Multi-channel support",
      "Team collaboration"
    ]
  },
  {
    id: "analytics-dashboard",
    title: "Advanced Analytics",
    description: "Comprehensive insights into team performance, query patterns, and knowledge gaps with actionable recommendations.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "from-purple-500 to-purple-600",
    category: "Analytics",
    metrics: {
      value: "40%",
      label: "Faster Deals",
    },
    benefits: [
      "Performance tracking",
      "Gap analysis",
      "ROI measurement",
      "Custom reports"
    ]
  },
  {
    id: "knowledge-management",
    title: "Smart Knowledge Base",
    description: "Automatically organize and categorize your product information, FAQs, and training materials for instant access.",
    icon: <Database className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    category: "Knowledge",
    metrics: {
      value: "10K+",
      label: "Documents Processed",
    },
    benefits: [
      "Auto-categorization",
      "Version control",
      "Search optimization",
      "Content updates"
    ]
  }
];

const stats = [
  { label: "Enterprise Clients", value: "500+", icon: <Award className="w-5 h-5" /> },
  { label: "Response Accuracy", value: "95%", icon: <Target className="w-5 h-5" /> },
  { label: "Time Saved Daily", value: "3.2h", icon: <Clock className="w-5 h-5" /> },
  { label: "Customer Satisfaction", value: "4.9/5", icon: <Star className="w-5 h-5" /> }
];

export default function ProductOverviewSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('product-overview');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="product-overview"
      className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.02)_50%,transparent_75%)] bg-[length:20px_20px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-50 to-pink-100 dark:from-purple-950/20 dark:to-pink-950/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Professional Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-blue-200 dark:border-blue-800/50">
            <Layers className="w-3 h-3 sm:w-4 sm:h-4" />
            Enterprise-Grade Solutions
          </div>
          
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="text-gray-900 dark:text-white">
              Comprehensive AI Platform for
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Modern Sales Teams
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            Transform your sales process with our integrated suite of AI-powered tools designed for enterprise-scale performance, 
            security, and reliability.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:gap-16 items-start mb-12 sm:mb-16 lg:mb-20">
          {/* Features List */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">

            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`group cursor-pointer transition-all duration-300 h-full ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`h-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col ${
                  activeFeature === index 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 flex-1">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0`}>
                      {feature.icon}
                    </div>
                    
                    <div className="flex-1 w-full flex flex-col">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          {feature.title}
                        </h4>
                        <Badge variant="secondary" className="text-xs w-fit">
                          {feature.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 leading-relaxed flex-1">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                            {feature.metrics.value}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {feature.metrics.label}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-auto">
                        {feature.benefits.map((benefit, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional CTA Section */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Ready to Transform Your Sales Process?
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                Join 500+ enterprise teams who have already transformed their sales operations with our AI-powered platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
              onClick={() => window.open('https://calendly.com/saleshqai/30min', '_blank')}
                size="lg" 
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Schedule Demo
              </Button>
              <Button 
                onClick={() => router.push('/contact')}
                size="lg" 
                variant="outline" 
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <Calendar className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Contact Sales
              </Button>
            </div>
            
            <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <p>✓ No setup fees • ✓ 30-day free trial • ✓ Enterprise support</p>
            </div>
          </Card>
        </div>
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
}