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
  Rocket
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
    description: "Import documents, product catalogs, and connect your data sources.",
    icon: <FileUp className="w-6 h-6" />,
    duration: "2 minutes",
    details: [
      "Drag & drop files (PDF, DOC, XLS)",
      "Connect Google Drive or Dropbox",
      "Sync Shopify products",
      "Import FAQs and guides"
    ],
    color: "from-blue-500 to-blue-600",
    image: "/upload-demo.png"
  },
  {
    id: 2,
    title: "AI Processes & Learns",
    description: "Our AI analyzes, categorizes, and creates a searchable knowledge graph with LSM integration.",
    icon: <Brain className="w-6 h-6" />,
    duration: "Instant",
    details: [
      "Natural language processing",
      "LSM-powered categorization",
      "Entity extraction",
      "Lead scoring integration"
    ],
    color: "from-purple-500 to-purple-600",
    image: "/ai-process.png"
  },
  {
    id: 3,
    title: "Team Gets Instant Answers",
    description: "Sales reps ask questions and receive LSM-scored, accurate, cited responses immediately.",
    icon: <MessageSquare className="w-6 h-6" />,
    duration: "Real-time",
    details: [
      "Natural language queries",
      "LSM-powered source citations",
      "Scored follow-up suggestions",
      "Multi-language support"
    ],
    color: "from-green-500 to-green-600",
    image: "/instant-answers.png"
  },
  {
    id: 4,
    title: "System Improves Daily",
    description: "Feedback loop identifies gaps and continuously enhances responses.",
    icon: <TrendingUp className="w-6 h-6" />,
    duration: "Continuous",
    details: [
      "Track unanswered questions",
      "Team feedback integration",
      "Automatic retraining",
      "Performance analytics"
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
    <section ref={sectionRef} id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 process-animate opacity-0 translate-y-4 transition-all duration-700">
          <Badge className="mb-4 px-3 py-1 bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300 border-0">
            <Rocket className="w-4 h-4 mr-1" />
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Get Started in
            </span>
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Under 5 Minutes
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Four simple steps to transform your sales team into AI-powered closers.
          </p>
        </div>

        {/* Interactive timeline */}
        <div className="mb-10 md:mb-16">
          {/* Progress bar */}
          <div className="relative mb-8 md:mb-12 px-4">
            <div className="absolute inset-0 flex items-center px-4">
              <div className="w-full h-1.5 md:h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="relative flex justify-between px-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index <= activeStep 
                      ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white scale-110 shadow-lg' 
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500 hover:scale-105'
                  }`}
                >
                  {index <= activeStep ? (
                    <CheckCircle className="w-4 h-4 md:w-6 md:h-6" />
                  ) : (
                    <span className="text-xs md:text-sm font-bold">{step.id}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start lg:items-center">
            {/* Details */}
            <div className="process-animate opacity-0 translate-x-[-20px] transition-all duration-700 order-2 lg:order-1 px-4 lg:px-0">
              <Badge className="mb-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                Step {steps[activeStep].id} • {steps[activeStep].duration}
              </Badge>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {steps[activeStep].title}
              </h3>
              
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6">
                {steps[activeStep].description}
              </p>

              <div className="space-y-3 mb-6 md:mb-8">
                {steps[activeStep].details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                    </div>
                    <span className="text-sm md:text-base text-gray-700 dark:text-gray-200 leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>

              {/* Step navigation */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)}
                  disabled={activeStep === 0}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className="group w-full sm:w-auto"
                >
                  {activeStep === steps.length - 1 ? 'Start Over' : 'Next Step'}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Visual representation */}
            <div className="process-animate opacity-0 translate-x-[20px] transition-all duration-700 order-1 lg:order-2 mb-6 lg:mb-0 px-4 lg:px-0">
              <Card className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-0 shadow-2xl">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-inner">
                  {/* Step-specific illustrations */}
                  {activeStep === 0 && (
                    <div className="absolute inset-0 p-6 md:p-8">
                      {/* Upload Interface */}
                      <div className="h-full flex flex-col justify-center">
                        {/* Upload area */}
                        <div className="flex-1 border-2 border-dashed border-blue-200 dark:border-blue-700/50 rounded-xl flex flex-col items-center justify-center bg-gradient-to-br from-blue-50/70 via-white/50 to-indigo-50/70 dark:from-blue-950/30 dark:via-gray-900/50 dark:to-indigo-950/30 relative backdrop-blur-sm transition-all duration-700 hover:border-blue-300 dark:hover:border-blue-600/70">
                          <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
                            <FileUp className="relative w-10 h-10 md:w-14 md:h-14 text-blue-500 dark:text-blue-400 mb-3 animate-float" />
                          </div>
                          <p className="text-sm md:text-base text-blue-700 dark:text-blue-300 font-medium mb-1">Drop files here</p>
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">or click to browse</p>
                          
                          {/* Elegant floating file icons */}
                          <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-lg shadow-lg flex items-center justify-center text-white text-xs font-medium animate-float-delayed-1 backdrop-blur-sm">
                            PDF
                          </div>
                          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg shadow-lg flex items-center justify-center text-white text-xs font-medium animate-float-delayed-2 backdrop-blur-sm">
                            DOC
                          </div>
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg shadow-lg flex items-center justify-center text-white text-xs font-medium animate-float-delayed-3 backdrop-blur-sm">
                            XLS
                          </div>
                        </div>
                        
                        {/* Connected services */}
                        <div className="mt-4 flex justify-center gap-3">
                          <div className="px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg text-xs font-medium border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
                            Shopify
                          </div>
                          <div className="px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg text-xs font-medium border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse"></div>
                            Drive
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="absolute inset-0 p-6 md:p-8">
                      {/* AI Processing */}
                      <div className="h-full flex items-center justify-center relative">
                        {/* Central brain with elegant glow */}
                        <div className="relative">
                          {/* Outer glow ring */}
                          <div className="absolute -inset-8 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 rounded-full blur-2xl animate-pulse"></div>
                          
                          {/* Main brain container */}
                          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
                            <div className="absolute inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                            <Brain className="relative w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-lg" />
                          </div>
                          
                          {/* Elegant orbiting data points */}
                          <div className="absolute inset-0 animate-spin-slow">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-lg animate-pulse"></div>
                            <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg animate-pulse delay-75"></div>
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full shadow-lg animate-pulse delay-150"></div>
                            <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full shadow-lg animate-pulse delay-225"></div>
                          </div>
                          
                          {/* Secondary orbit ring */}
                          <div className="absolute inset-0 animate-spin-reverse" style={{ animationDuration: '12s' }}>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full opacity-60"></div>
                            <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-violet-400 to-violet-500 rounded-full opacity-60"></div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-60"></div>
                            <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full opacity-60"></div>
                          </div>
                          
                          {/* Processing indicator */}
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 shadow-lg border border-purple-200 dark:border-purple-700/50">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                              Processing
                            </div>
                          </div>
                        </div>
                        
                        {/* Elegant data flow visualization */}
                        <div className="absolute inset-0 pointer-events-none">
                          {/* Flowing particles */}
                          <div className="absolute top-8 left-8 w-12 h-0.5 bg-gradient-to-r from-purple-400/60 via-purple-500 to-transparent rounded-full animate-flow-right"></div>
                          <div className="absolute bottom-8 right-8 w-12 h-0.5 bg-gradient-to-l from-indigo-400/60 via-indigo-500 to-transparent rounded-full animate-flow-left"></div>
                          <div className="absolute top-1/2 right-8 h-12 w-0.5 bg-gradient-to-b from-pink-400/60 via-pink-500 to-transparent rounded-full animate-flow-down"></div>
                          <div className="absolute top-1/2 left-8 h-12 w-0.5 bg-gradient-to-t from-violet-400/60 via-violet-500 to-transparent rounded-full animate-flow-up"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="absolute inset-0 p-6 md:p-8">
                      {/* Chat Interface */}
                      <div className="h-full flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
                        {/* Chat header */}
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b border-gray-200/50 dark:border-gray-700/50">
                          <div className="relative">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                              <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white dark:border-gray-900"></div>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">Sales Assistant</span>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">Online</div>
                          </div>
                        </div>
                        
                        {/* Messages */}
                        <div className="flex-1 p-4 space-y-4 overflow-hidden bg-gradient-to-b from-gray-50/30 to-white/30 dark:from-gray-800/30 dark:to-gray-900/30">
                          {/* User message */}
                          <div className="flex justify-end animate-fade-in">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm p-3 rounded-2xl rounded-br-md max-w-[75%] shadow-lg">
                              What's the warranty on Product X?
                            </div>
                          </div>
                          
                          {/* AI response */}
                          <div className="flex justify-start animate-fade-in-delayed">
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-sm p-3 rounded-2xl rounded-bl-md max-w-[85%] shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                              <p className="text-gray-800 dark:text-gray-200 mb-2">Product X comes with a comprehensive 2-year warranty covering all manufacturing defects and normal wear.</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                                <span className="font-medium">Source:</span>
                                <span>Product Manual p.15</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Typing indicator */}
                          <div className="flex justify-start">
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl rounded-bl-md p-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Input area */}
                        <div className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-t border-gray-200/50 dark:border-gray-700/50">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center px-4 shadow-sm">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Ask about pricing, features, or support...</span>
                            </div>
                            <button className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105">
                              <ArrowRight className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="absolute inset-0 p-6 md:p-8">
                      {/* Analytics Dashboard */}
                      <div className="h-full grid grid-cols-2 gap-4">
                        {/* Accuracy Metric */}
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                              <TrendingUp className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Accuracy</span>
                          </div>
                          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">94%</div>
                          <div className="flex items-center gap-1 text-xs">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-600 dark:text-green-400 font-medium">+5% this week</span>
                          </div>
                        </div>
                        
                        {/* Queries Metric */}
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                              <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Queries</span>
                          </div>
                          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">2,847</div>
                          <div className="flex items-center gap-1 text-xs">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">+12% today</span>
                          </div>
                        </div>
                        
                        {/* Chart Area */}
                        <div className="col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Response Time Trends</span>
                          </div>
                          
                          <div className="h-16 flex items-end gap-2 mb-3">
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-4 bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg shadow-sm animate-grow-bar" style={{ height: '60%' }}></div>
                              <span className="text-xs text-gray-400">Mon</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-4 bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg shadow-sm animate-grow-bar delay-75" style={{ height: '80%' }}></div>
                              <span className="text-xs text-gray-400">Tue</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-4 bg-gradient-to-t from-green-600 to-emerald-600 rounded-t-lg shadow-sm animate-grow-bar delay-150" style={{ height: '100%' }}></div>
                              <span className="text-xs text-gray-400">Wed</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-4 bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg shadow-sm animate-grow-bar delay-225" style={{ height: '70%' }}></div>
                              <span className="text-xs text-gray-400">Thu</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-4 bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg shadow-sm animate-grow-bar delay-300" style={{ height: '90%' }}></div>
                              <span className="text-xs text-gray-400">Fri</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-4 bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg shadow-sm animate-grow-bar delay-375 animate-pulse" style={{ height: '85%' }}></div>
                              <span className="text-xs text-gray-400">Sat</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Average: 0.8s</span>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                              <span className="text-green-600 dark:text-green-400 font-medium">Improving</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step indicator badge */}
                  <div className="absolute top-2 left-2 md:top-3 lg:top-4 md:left-3 lg:left-4">
                    <Badge className={`bg-gradient-to-r ${steps[activeStep].color} text-white border-0 text-xs`}>
                      <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                      Step {activeStep + 1}
                    </Badge>
                  </div>
                </div>

                {/* Step indicators */}
                <div className="mt-4 md:mt-6 flex justify-center gap-1.5 md:gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`h-1.5 md:h-2 rounded-full transition-all ${
                        index === activeStep 
                          ? 'w-6 md:w-8 bg-gradient-to-r from-blue-500 to-green-500' 
                          : 'w-1.5 md:w-2 bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center process-animate opacity-0 translate-y-4 transition-all duration-700 delay-500 px-4">
          <Card className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800 w-full sm:w-auto max-w-sm sm:max-w-none">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                Ready to get started?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Join 2,847+ teams already using SalesHQ
              </p>
            </div>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => router.push('/contact')}>
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}