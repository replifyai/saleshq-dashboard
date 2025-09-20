'use client'
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Brain, 
  MessageSquare,
  Sparkles,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  FileUp,
  TrendingUp,
  Rocket,
  Zap,
  Target,
  BarChart3,
  Clock,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import React from "react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  details: string[];
  color: string;
  image?: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Upload Your Knowledge",
    description: "Seamlessly import documents, product catalogs, and connect your data sources in seconds.",
    icon: <FileUp className="w-6 h-6" />,
    duration: "2 minutes",
    details: [
      "Drag & drop files (PDF, DOC, XLS, PPT)",
      "Connect Google Drive, Dropbox, OneDrive",
      "Sync Shopify, WooCommerce, BigCommerce",
      "Import FAQs, guides, and training materials"
    ],
    color: "from-blue-500 to-indigo-600",
    image: "/upload-demo.png"
  },
  {
    id: 2,
    title: "AI Processes & Learns",
    description: "Advanced AI analyzes, categorizes, and creates an intelligent knowledge graph with LSM integration.",
    icon: <Brain className="w-6 h-6" />,
    duration: "Instant",
    details: [
      "Advanced natural language processing",
      "LSM-powered intelligent categorization",
      "Smart entity extraction & relationships",
      "Automated lead scoring integration"
    ],
    color: "from-purple-500 to-pink-600",
    image: "/ai-process.png"
  },
  {
    id: 3,
    title: "Get Instant Answers",
    description: "Your team asks questions and receives LSM-scored, accurate, cited responses in real-time.",
    icon: <MessageSquare className="w-6 h-6" />,
    duration: "Real-time",
    details: [
      "Natural language conversation interface",
      "LSM-powered source citations & confidence",
      "Intelligent follow-up suggestions",
      "Multi-language support & voice input"
    ],
    color: "from-emerald-500 to-teal-600",
    image: "/instant-answers.png"
  },
  {
    id: 4,
    title: "Continuous Improvement",
    description: "Smart feedback loops identify gaps and continuously enhance response accuracy and relevance.",
    icon: <TrendingUp className="w-6 h-6" />,
    duration: "Continuous",
    details: [
      "Track unanswered questions & gaps",
      "Team feedback integration & scoring",
      "Automatic model retraining",
      "Advanced performance analytics"
    ],
    color: "from-orange-500 to-red-500",
    image: "/improvement.png"
  }
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.process-animate');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Auto-advance steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-12 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-900 relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent dark:via-blue-800/30" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200/50 to-transparent dark:via-purple-800/30" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Enhanced section header */}
        <div className="text-center mb-12 sm:mb-16 process-animate opacity-0 translate-y-4 transition-all duration-700">
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 py-2 sm:px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-full border border-blue-200/50 dark:border-blue-800/50">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">How It Works</span>
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              Transform Your Sales
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              in 4 Simple Steps
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            From knowledge upload to AI-powered sales success in under 5 minutes. 
            <span className="font-semibold text-gray-800 dark:text-gray-200"> No technical expertise required.</span>
          </p>
        </div>

        {/* Modern step navigation */}
        <div className="mb-12 sm:mb-16">
          {/* Step indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center w-full">
                <button
                  onClick={() => setActiveStep(index)}
                  className={`group relative flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 w-full ${
                    index === activeStep
                      ? `bg-gradient-to-r ${step.color} text-white shadow-xl scale-105`
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:scale-102'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 ${
                    index === activeStep
                      ? 'bg-white/20 backdrop-blur-sm'
                      : `bg-gradient-to-r ${step.color} text-white`
                  }`}>
                    {index === activeStep ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-semibold">{step.title}</div>
                    <div className="text-xs opacity-80">{step.duration}</div>
                  </div>
                  {index === activeStep && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse" />
                  )}
                </button>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden sm:block w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced step content */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center hidden md:block">
          {/* Step details */}
          <div className="process-animate opacity-0 translate-x-[-20px] transition-all duration-700 order-2 lg:order-1">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-r ${steps[activeStep].color} flex items-center justify-center shadow-lg`}>
                  {steps[activeStep].icon}
                </div>
                <div>
                  <Badge className={`bg-gradient-to-r ${steps[activeStep].color} text-white border-0 mb-2 text-xs`}>
                    Step {steps[activeStep].id}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    {steps[activeStep].duration}
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white leading-tight">
                {steps[activeStep].title}
              </h3>
              
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                {steps[activeStep].description}
              </p>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {steps[activeStep].details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3 sm:gap-4 group">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md group-hover:scale-110 transition-transform duration-200`}>
                      <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">{detail}</span>
                  </div>
                ))}
              </div>

              {/* Enhanced navigation */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)}
                  disabled={activeStep === 0}
                  className="w-full sm:w-auto group border-2 hover:border-gray-300 dark:hover:border-gray-600 text-sm"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Previous
                </Button>
                <Button
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className={`group w-full sm:w-auto bg-gradient-to-r ${steps[activeStep].color} hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-200 text-sm`}
                >
                  {activeStep === steps.length - 1 ? 'Start Over' : 'Next Step'}
                  <ChevronRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
       
      </div>
    </section>
  );
}