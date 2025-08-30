'use client'
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock,
  Zap,
  Trophy,
  Target,
  DollarSign
} from "lucide-react";

interface Metric {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    label: string;
  };
}

const metrics: Metric[] = [
  {
    id: "conversion",
    value: 43,
    suffix: "%",
    label: "Higher Conversion Rate",
    description: "Average improvement in close rates",
    icon: <Target className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
    trend: {
      value: 12,
      label: "vs. industry avg"
    }
  },
  {
    id: "response",
    value: 3,
    suffix: "x",
    label: "Faster Response Time",
    description: "Instant AI-powered suggestions",
    icon: <Zap className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
    trend: {
      value: 67,
      label: "time saved"
    }
  },
  {
    id: "accuracy",
    value: 99.9,
    suffix: "%",
    label: "Transcription Accuracy",
    description: "Industry-leading voice recognition",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "from-green-500 to-green-600"
  },
  {
    id: "roi",
    value: 287,
    suffix: "%",
    label: "Average ROI",
    description: "Return on investment in 6 months",
    icon: <DollarSign className="w-6 h-6" />,
    color: "from-purple-500 to-purple-600",
    trend: {
      value: 4.2,
      label: "months to ROI"
    }
  }
];

// Counter animation hook
function useCountUp(end: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (!startCounting) return;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(end * easeOutQuart * 100) / 100;
      
      setCount(currentCount);
      countRef.current = currentCount;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, startCounting]);

  return count;
}

export default function MetricsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 metrics-animate opacity-0 translate-y-4 transition-all duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Proven Results That
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Drive Growth
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of sales teams achieving record-breaking performance with SalesHQ.
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <Card
              key={metric.id}
              className="p-6 hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center text-white mb-4`}>
                  {metric.icon}
                </div>

                {/* Counter */}
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    <CountUpAnimation value={metric.value} startCounting={isVisible} />
                    {metric.suffix}
                  </span>
                </div>

                {/* Label */}
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  {metric.label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.description}
                </p>

                {/* Trend indicator */}
                {metric.trend && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          +{metric.trend.value}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {metric.trend.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Customer success stories */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 border-0">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Trophy className="w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                Customer Success Story
              </h3>
              <blockquote className="text-lg mb-4 text-white/90">
                "SalesHQ transformed our sales process. Our team's response time dropped by 73%, 
                and we've seen a 45% increase in conversion rates. The AI learns from every call, 
                making our reps more confident and effective with each interaction."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur" />
                <div>
                  <p className="font-semibold">Sarah Chen</p>
                  <p className="text-sm text-white/70">VP of Sales, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <Users className="w-6 h-6 mb-2" />
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-white/80">Team members using SalesHQ</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <Clock className="w-6 h-6 mb-2" />
                <p className="text-3xl font-bold">2M+</p>
                <p className="text-sm text-white/80">Hours of calls analyzed</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

// Separate component for count animation
function CountUpAnimation({ value, startCounting }: { value: number; startCounting: boolean }) {
  const count = useCountUp(value, 2000, startCounting);
  return <>{count}</>;
}