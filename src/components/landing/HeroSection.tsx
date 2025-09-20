'use client'
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { 
  ArrowRight, 
  Play, 
  Calendar,
  Sparkles,
  Zap,
  TrendingUp,
  Shield,
  Users,
  Star,
  CheckCircle,
  BarChart3,
  Brain,
  MessageSquare,
  Clock
} from "lucide-react";
import Link from "next/link";
import { LandingNavigation } from "@/components/landing";
import { gsap } from "gsap";

export default function HeroSection() {
  const [stats, setStats] = useState({
    users: 2847,
    accuracy: 95,
    timeSaved: 3.2
  });
  
  // Rotating headline phrases to convey the product use case
  const rotatingPhrases: string[] = [
    "AI Powered Intelligence",
    "Source Backed Answers",
    "LMS and training management",
    "Knowledge base and wiki",
    "Sales enablement and training",
    "Pricing & Packaging Details"
  ];
  const phraseIndexRef = useRef(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const rotationPausedRef = useRef(false);
  
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const headlineSpanRef = useRef<HTMLSpanElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Animate stats on mount
  useEffect(() => {
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          users: Math.floor(2847 * progress),
          accuracy: Math.floor(95 * progress),
          timeSaved: Math.floor(3.2 * progress * 10) / 10
        });
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setStats({ users: 2847, accuracy: 95, timeSaved: 3.2 });
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateStats, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observer for animations
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

    const elements = heroRef.current?.querySelectorAll('.hero-animate');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Rotate the headline span to communicate full product proposition
  useEffect(() => {
    const element = headlineSpanRef.current;
    const headlineEl = headlineRef.current;
    if (!element) return;

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMouseEnter = () => { rotationPausedRef.current = true; };
    const onMouseLeave = () => { rotationPausedRef.current = false; };
    headlineEl?.addEventListener('mouseenter', onMouseEnter);
    headlineEl?.addEventListener('mouseleave', onMouseLeave);

    const onVisibility = () => { rotationPausedRef.current = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    const intervalId = window.setInterval(() => {
      if (rotationPausedRef.current || prefersReduced) return;
      const next = (phraseIndexRef.current + 1) % rotatingPhrases.length;
      gsap.to(element, {
        y: 12,
        opacity: 0,
        filter: "blur(6px)",
        scale: 0.98,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => {
          phraseIndexRef.current = next;
          setPhraseIndex(next);
          gsap.fromTo(element, { y: -12, opacity: 0, filter: "blur(6px)", scale: 0.98 }, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
          });
        }
      });
    }, 2500);

    return () => {
      window.clearInterval(intervalId);
      headlineEl?.removeEventListener('mouseenter', onMouseEnter);
      headlineEl?.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <>
      <LandingNavigation />
      <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:4rem_4rem]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 right-1/3 w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Trust Badge */}
            <div className="hero-animate opacity-0 translate-y-4 transition-all duration-700 mb-8">
              <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">AI-Powered Sales Intelligence</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 
              ref={headlineRef}
              className="hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-100 text-4xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight mb-8 h-50"
            >
              <span className="text-gray-900 dark:text-white">
                Transform Your Sales Team with
              </span>
              <br />
              <span 
                ref={headlineSpanRef}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x will-change-transform"
              >
                {rotatingPhrases[phraseIndex]}
              </span>
            </h1>

            {/* Subheadline */}
            <div 
              ref={subheadlineRef}
              className="hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-200 mb-12"
            >
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Give your sales reps <span className="font-semibold text-blue-600 dark:text-blue-400">instant access</span> to product knowledge, 
                competitive intelligence, and AI-powered responses that close deals faster.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-300 mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Instant Answers</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Real-time AI responses</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">40% Faster</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Deal closure rate</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">95% Accuracy</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Source-backed responses</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div 
              ref={ctaRef}
              className="hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-400 mb-12"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    className="group px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-xl"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                {/* <Button 
                  size="lg" 
                  variant="outline" 
                  className="group px-8 py-6 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 rounded-xl"
                  onClick={() => window.open('https://calendly.com/saleshqai/30min', '_blank')}
                >
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Book Demo
                </Button> */}
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Dashboard */}
          <div className="hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-300 lg:delay-500">
            <Card className="relative p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-2xl overflow-hidden">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center">
                    {/* <Brain className="w-5 h-5 text-white" /> */}
                    <Image src="/initials.png" alt="SalesHQ" width={50} height={50} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Dashboard</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Live Analytics</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
                </div>
              </div>

              {/* Real-time Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border border-blue-200 dark:border-blue-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Queries Today</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">2,847</div>
                  <div className="text-xs text-green-600 dark:text-green-400">+12% from yesterday</div>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 border border-emerald-200 dark:border-emerald-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{stats.accuracy}%</div>
                  <div className="text-xs text-green-600 dark:text-green-400">+2% this week</div>
                </div>
              </div>

              {/* Live Chat Preview */}
              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm p-3 rounded-2xl rounded-br-md max-w-[80%]">
                    What's the warranty on Product X?
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 text-sm p-3 rounded-2xl rounded-bl-md max-w-[85%]">
                    <p className="text-gray-800 dark:text-gray-200 mb-2">Product X comes with a 2-year comprehensive warranty covering all manufacturing defects.</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 rounded-lg p-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Source: Product Manual p.15</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 text-sm p-3 rounded-2xl rounded-bl-md max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Active conversations</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">47</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-700">
        <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
    </>
  );
}