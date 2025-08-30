'use client'
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Brain, 
  MessageSquare,
  Sparkles,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  FileUp,
  Bot,
  Users,
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
    description: "Our AI analyzes, categorizes, and creates a searchable knowledge graph.",
    icon: <Brain className="w-6 h-6" />,
    duration: "Instant",
    details: [
      "Natural language processing",
      "Auto-categorization",
      "Entity extraction",
      "Relationship mapping"
    ],
    color: "from-purple-500 to-purple-600",
    image: "/ai-process.png"
  },
  {
    id: 3,
    title: "Team Gets Instant Answers",
    description: "Sales reps ask questions and receive accurate, cited responses immediately.",
    icon: <MessageSquare className="w-6 h-6" />,
    duration: "Real-time",
    details: [
      "Natural language queries",
      "Source citations",
      "Suggested follow-ups",
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
  const timelineRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} id="how-it-works" className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 process-animate opacity-0 translate-y-4 transition-all duration-700">
          <Badge className="mb-4 px-3 py-1 bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300 border-0">
            <Rocket className="w-3 h-3 mr-1" />
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Get Started in
            </span>
            {" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Under 5 Minutes
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Four simple steps to transform your sales team into AI-powered closers.
          </p>
        </div>

        {/* Interactive timeline */}
        <div className="mb-16">
          {/* Progress bar */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index <= activeStep 
                      ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white scale-110 shadow-lg' 
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500 hover:scale-105'
                  }`}
                >
                  {index <= activeStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-bold">{step.id}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Details */}
            <div className="process-animate opacity-0 translate-x-[-20px] transition-all duration-700">
              <Badge className="mb-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                Step {steps[activeStep].id} • {steps[activeStep].duration}
              </Badge>
              
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {steps[activeStep].title}
              </h3>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {steps[activeStep].description}
              </p>

              <div className="space-y-3 mb-8">
                {steps[activeStep].details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">{detail}</span>
                  </div>
                ))}
              </div>

              {/* Step navigation */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)}
                  disabled={activeStep === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className="group"
                >
                  {activeStep === steps.length - 1 ? 'Start Over' : 'Next Step'}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Visual representation */}
            <div className="process-animate opacity-0 translate-x-[20px] transition-all duration-700">
              <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-0 shadow-2xl">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                  {/* Animated placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center animate-pulse`}>
                      <div className="w-12 h-12 text-white">
                        {steps[activeStep].icon}
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/10 backdrop-blur text-white border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Live Demo
                    </Badge>
                  </div>

                  <Button 
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-4 right-4 bg-white/10 backdrop-blur hover:bg-white/20"
                  >
                    <PlayCircle className="w-6 h-6 text-white" />
                  </Button>
                </div>

                {/* Step indicators */}
                <div className="mt-6 flex justify-center gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeStep 
                          ? 'w-8 bg-gradient-to-r from-blue-500 to-green-500' 
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center process-animate opacity-0 translate-y-4 transition-all duration-700 delay-500">
          <Card className="inline-flex items-center gap-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                Ready to get started?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Join 2,847+ teams already using SalesHQ
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}