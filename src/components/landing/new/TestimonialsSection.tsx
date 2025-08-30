'use client'
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Quote,
  ChevronLeft,
  ChevronRight,
  Building,
  Users,
  TrendingUp,
  Award
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companySize: string;
  industry: string;
  image: string;
  content: string;
  metrics: {
    label: string;
    value: string;
  }[];
  rating: number;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "VP of Sales",
    company: "TechCorp Industries",
    companySize: "500+ employees",
    industry: "Software",
    image: "/testimonials/sarah.jpg",
    content: "SalesHQ has completely transformed our sales process. The real-time transcription and AI suggestions have reduced our average call time by 40% while increasing our close rate by 45%. It's like having a senior sales coach on every call.",
    metrics: [
      { label: "Close Rate", value: "+45%" },
      { label: "Response Time", value: "-73%" },
      { label: "Deal Size", value: "+28%" }
    ],
    rating: 5,
    featured: true
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    role: "Sales Director",
    company: "Global Retail Co",
    companySize: "1000+ employees",
    industry: "E-commerce",
    image: "/testimonials/michael.jpg",
    content: "The Shopify integration alone has saved us countless hours. Our team can now access real-time inventory and product information during calls. Customer satisfaction scores have increased by 35% since implementing SalesHQ.",
    metrics: [
      { label: "CSAT Score", value: "+35%" },
      { label: "First Call Resolution", value: "+52%" },
      { label: "Sales Velocity", value: "2.3x" }
    ],
    rating: 5
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "Head of Customer Success",
    company: "FinanceHub",
    companySize: "200+ employees",
    industry: "Financial Services",
    image: "/testimonials/emily.jpg",
    content: "The self-learning capability is incredible. Every interaction makes our knowledge base smarter. We've reduced training time for new reps by 60% and they're productive from day one.",
    metrics: [
      { label: "Training Time", value: "-60%" },
      { label: "Ramp Time", value: "-45%" },
      { label: "Team Productivity", value: "+67%" }
    ],
    rating: 5
  },
  {
    id: "4",
    name: "David Park",
    role: "CEO & Founder",
    company: "StartupFlow",
    companySize: "50+ employees",
    industry: "SaaS",
    image: "/testimonials/david.jpg",
    content: "As a growing startup, we needed something that could scale with us. SalesHQ's API and integrations have been seamless. ROI was achieved in just 4 months, and we're now closing deals 3x faster.",
    metrics: [
      { label: "Deal Velocity", value: "3x" },
      { label: "Win Rate", value: "+38%" },
      { label: "ROI Timeline", value: "4 months" }
    ],
    rating: 5
  }
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 6000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300 border-0">
            <Award className="w-3 h-3 mr-1" />
            Customer Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Trusted by
            </span>
            {" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how top-performing sales teams are achieving breakthrough results with SalesHQ.
          </p>
        </div>

        {/* Featured testimonial carousel */}
        <div className="mb-16">
          <Card className="overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="grid lg:grid-cols-3">
              {/* Testimonial content */}
              <div className="lg:col-span-2 p-8 lg:p-12">
                <Quote className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-6" />
                
                <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-200 leading-relaxed mb-8">
                  "{activeTestimonial.content}"
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {activeTestimonial.metrics.map((metric, i) => (
                    <div key={i} className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {metric.value}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Author info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {activeTestimonial.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {activeTestimonial.role} at {activeTestimonial.company}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Building className="w-3 h-3 mr-1" />
                          {activeTestimonial.industry}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {activeTestimonial.companySize}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < activeTestimonial.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Company showcase */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                      <Building className="w-10 h-10 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {activeTestimonial.company}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activeTestimonial.industry} • {activeTestimonial.companySize}
                    </p>
                  </div>

                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur">
                    <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Key Achievement
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {activeTestimonial.metrics[0].label}: {activeTestimonial.metrics[0].value}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handlePrevious}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleNext}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Dots indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveIndex(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                        : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-xs"
              >
                {isAutoPlaying ? 'Pause' : 'Play'} Auto-scroll
              </Button>
            </div>
          </Card>
        </div>

        {/* Company logos */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            TRUSTED BY SALES TEAMS AT
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
            {['Microsoft', 'Google', 'Amazon', 'Salesforce', 'HubSpot', 'Shopify'].map((company) => (
              <div key={company} className="text-2xl font-bold text-gray-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}