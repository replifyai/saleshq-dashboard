import { Button } from "@/components/ui/button";
import { Award, Clock, TrendingUp, Zap, ArrowRight, Play } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LandingNavigation from "./LandingNavigation";
// import NavigationHeader from "./new/NavigationHeader";
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trustIndicatorRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const headlineSpanRef = useRef<HTMLSpanElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide all elements
      gsap.set([trustIndicatorRef.current, headlineRef.current, headlineSpanRef.current, subheadlineRef.current, benefitsRef.current?.children, ctaRef.current, trustTextRef.current], {
        opacity: 0,
        y: 30
      });

      // Create entrance animation timeline for immediate page load
      const entranceTl = gsap.timeline({
        delay: 0.3
      });

      // Animate all elements in sequence on page load
      entranceTl.to(trustIndicatorRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      })
      .to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3")
      .to(headlineSpanRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6")
      .to(subheadlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .to(benefitsRef.current?.children || [], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1
      }, "-=0.3")
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.2")
      .to(trustTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.1");

      // Button hover animations
      const ctaButtons = ctaRef.current?.querySelectorAll('button');
      ctaButtons?.forEach((button) => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.02,
            y: -2,
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            y: 0,
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Cleanup ScrollTrigger instances
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-16 sm:h-20 z-50">
        <LandingNavigation />
      </div>
      <section ref={sectionRef} className="relative isolate overflow-hidden py-24 lg:py-32 bg-white dark:bg-gray-950">
        {/* Clean, minimal background */}
        <div className="absolute inset-0 -z-10">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900" />
          
          {/* Single accent element */}
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-full blur-3xl opacity-60" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:4rem_4rem]" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Trust Indicator */}
            <div 
              ref={trustIndicatorRef}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-12 border border-blue-200 dark:border-blue-800/50"
            >
              <Award className="w-4 h-4 mr-2" />
              Trusted by 1,000+ Sales Teams Worldwide
            </div>

            {/* Main Headline */}
            <h1 
              ref={headlineRef}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-[1.1] tracking-tight max-w-5xl mx-auto"
            >
              Stop Searching Through{' '}
              <span 
                ref={headlineSpanRef}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                Documents.
              </span>
            </h1>

            {/* Subheadline */}
            <div ref={subheadlineRef} className="max-w-3xl mx-auto mb-16">
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                Sales teams waste <span className="font-semibold text-red-600 dark:text-red-400">3+ hours daily</span> searching for product information. 
                SalesHQ's AI delivers instant answers and learns continuously.
              </p>
            </div>
            
            {/* Key Benefits */}
            <div ref={benefitsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">3x Faster Responses</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get answers instantly instead of searching through documents</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">95% Query Resolution</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive answers with source citations</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Continuous Learning</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI improves with every interaction</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 rounded-xl"
              >
                Start Free 14-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg font-semibold transition-all duration-300 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <p ref={trustTextRef} className="text-sm text-gray-500 dark:text-gray-400">
              No credit card required • Setup in 5 minutes • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

const Index = () => {
  return <HeroSection />;
};

export default Index;