import { Button } from "@/components/ui/button";
import { Award, Clock, TrendingUp, Zap, ArrowRight, Play } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LandingNavigation from "./LandingNavigation";
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
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

      // Mouse movement animation setup
      const floatingElements = backgroundRef.current?.querySelectorAll('.floating-element');
      
      const handleMouseMove = (e: MouseEvent) => {
        if (!sectionRef.current) return;
        
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Calculate mouse position as percentage
        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;
        
        // Animate floating elements with different speeds for parallax effect
        floatingElements?.forEach((element, index) => {
          const speed = (index + 1) * 0.5;
          const rotation = (index + 1) * 5;
          
          gsap.to(element, {
            x: xPercent * 30 * speed,
            y: yPercent * 20 * speed,
            rotation: xPercent * rotation,
            duration: 1.5,
            ease: "power2.out"
          });
        });
        
        // Animate main content with subtle parallax
        gsap.to(headlineRef.current, {
          x: xPercent * 10,
          y: yPercent * 5,
          duration: 1,
          ease: "power2.out"
        });
        
        gsap.to(subheadlineRef.current, {
          x: xPercent * 5,
          y: yPercent * 3,
          duration: 1.2,
          ease: "power2.out"
        });
      };
      
      // Add mouse move listener
      window.addEventListener('mousemove', handleMouseMove);
      
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

      // Cleanup function for mouse event
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
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
    <section ref={sectionRef} className="relative isolate overflow-hidden py-28 lg:py-40">
      {/* Animated Background */}
      <div ref={backgroundRef} className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        {/* Gradient Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(45rem_30rem_at_top_right,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(40rem_28rem_at_bottom_left,rgba(34,197,94,0.12),transparent_60%)]" />
        
        {/* Floating Elements */}
        <div className="floating-element absolute z-20 top-20 left-10 w-32 h-32 rounded-full opacity-20 blur-md ring-1 ring-primary/20 [will-change:transform] bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_60%)]" />
        <div className="floating-element absolute z-20 top-40 right-20 w-24 h-24 rounded-full opacity-25 blur-md ring-1 ring-accent/20 [will-change:transform] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_60%)]" />
        <div className="floating-element absolute z-20 bottom-40 left-20 w-40 h-40 rounded-full opacity-25 blur-lg ring-1 ring-accent/20 [will-change:transform] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_65%)]" />
        <div className="floating-element absolute z-20 bottom-20 right-10 w-28 h-28 rounded-full opacity-25 blur-md ring-1 ring-primary/20 [will-change:transform] bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_60%)]" />
        <div className="floating-element absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full opacity-25 blur-lg ring-1 ring-accent/20 [will-change:transform] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_65%)]" /> 
        
        {/* Geometric Shapes */}
        <div className="floating-element absolute z-20 top-32 right-1/4 w-4 h-4 bg-primary rotate-45 opacity-80 [will-change:transform]" />
        <div className="floating-element absolute z-20 bottom-32 left-1/4 w-6 h-6 bg-accent rotate-12 opacity-80 [will-change:transform]" />
        <div className="floating-element absolute z-20 top-1/3 left-1/6 w-3 h-3 bg-primary rounded-full opacity-80 [will-change:transform]" />
        <div className="floating-element absolute z-20 bottom-1/3 right-1/6 w-5 h-5 bg-accent rounded-full opacity-80 [will-change:transform]" />

        {/* Additional Geometric Shapes */}
        <div className="floating-element absolute z-20 top-10 right-1/3 w-3 h-3 border-2 border-primary/80 rotate-45 rounded-[2px] opacity-80 [will-change:transform]" />
        <div className="floating-element absolute z-20 top-1/4 left-1/3 w-2 h-2 bg-accent rounded-sm opacity-80 [will-change:transform]" />
        <div className="floating-element absolute z-20 top-[45%] left-[20%] w-6 h-6 rounded-full ring-2 ring-primary/70 bg-transparent opacity-90 [will-change:transform]" />
        <div className="floating-element absolute z-20 bottom-12 left-1/2 w-4 h-4 rounded-full border-2 border-accent/80 opacity-80 [will-change:transform]" />
        <div className="floating-element absolute z-20 top-24 left-[45%] w-px h-12 bg-primary/40 rounded-full rotate-12 opacity-80 [will-change:transform]" />
        <div className="floating-element absolute z-20 bottom-28 right-[40%] w-px h-10 bg-accent/40 rounded-full -rotate-12 opacity-80 [will-change:transform]" />
        <div className="floating-element absolute z-20 top-[60%] left-[70%] w-2 h-2 bg-primary rounded-full opacity-90 [will-change:transform]" />
        <div className="floating-element absolute z-20 top-[20%] right-[15%] w-3 h-3 border-2 border-accent/80 rotate-12 rounded-[2px] opacity-80 [will-change:transform]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 z-10 opacity-[0.02] bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:3.5rem_3.5rem] [background-position:0_0,0_0]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Trust Indicator */}
          <div 
            ref={trustIndicatorRef}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 text-primary text-sm font-medium mb-8 border border-white/10 backdrop-blur-md"
          >
            <Award className="w-4 h-4 mr-2" />
            Trusted by 1,000+ Sales Teams Worldwide
          </div>

          {/* Main Headline */}
          <h1 
            ref={headlineRef}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight"
          >
            Stop Searching Through Documents.{' '}
            <span 
              ref={headlineSpanRef}
              className="bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-300 bg-clip-text text-transparent block mt-2 leading-tight"
            >
              Start Getting Instant Answers.
            </span>
          </h1>

          {/* Problem Statement & Solution */}
          <div ref={subheadlineRef} className="max-w-4xl mx-auto mb-12">
            <p className="text-xl md:text-2xl dark:text-gray-300 text-gray-600 mb-6 leading-relaxed">
              Sales teams waste <span className="font-bold text-destructive">3+ hours daily</span> searching for product information. 
              Replify's self-learning AI delivers instant answers and trains itself in real-time.
            </p>
            
            {/* Key Benefits Row */}
            <div ref={benefitsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center rounded-lg p-4 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md">
                <Clock className="w-6 h-6 text-blue-400 mr-3" />
                <span className="font-semibold text-gray-900 dark:text-white">3x Faster Responses</span>
              </div>
              <div className="flex items-center justify-center rounded-lg p-4 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md">
                <TrendingUp className="w-6 h-6 text-emerald-400 mr-3" />
                <span className="font-semibold text-gray-900 dark:text-white">95% Query Resolution</span>
              </div>
              <div className="flex items-center justify-center rounded-lg p-4 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md">
                <Zap className="w-6 h-6 text-blue-300 mr-3" />
                <span className="font-semibold text-gray-900 dark:text-white">Real-time Learning</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300">
              Start Free 14-Day Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold transition-all duration-300 bg-white border-gray-200 text-gray-900 hover:bg-gray-50 dark:bg-white/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
              <Play className="mr-2 w-5 h-5" />
              Watch 2-Min Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <p ref={trustTextRef} className="text-sm text-gray-400 mb-4">
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