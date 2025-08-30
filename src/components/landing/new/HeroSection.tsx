'use client'
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Mic,
  Brain,
  MessageSquare,
  Zap,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import LandingNavigation from "../LandingNavigation";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax effect for floating elements
    const handleMouseMove = (e: MouseEvent) => {
      if (!floatingRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      floatingRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Animate hero elements on load
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

  return (
    <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden">
       <div className="fixed top-0 left-0 w-full h-16 sm:h-20 z-50">
        <LandingNavigation />
      </div>
      {/* Advanced gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.1),transparent_50%)]" />
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div 
            className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent,black)]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(148,163,184,0.1)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
            }}
          />
        </div>

        {/* Floating orbs */}
        <div ref={floatingRef} className="absolute inset-0 transition-transform duration-700 ease-out">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8">
          {/* Trust badges */}
          {/* <div className="hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-100">
            <div className="inline-flex items-center gap-8 flex-wrap justify-center">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300 border-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                SOC 2 Compliant
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300 border-0">
                <Zap className="w-3 h-3 mr-1" />
                5-Min Setup
              </Badge>
            </div>
          </div> */}

          {/* Main headline */}
          <div className="hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-200">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                Your AI Sales
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Co-Pilot in Action
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <div className="hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-300">
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Real-time call transcription, instant AI suggestions, and seamless knowledge base integration. 
              <span className="font-semibold text-gray-900 dark:text-white"> Close deals 3x faster</span> with AI that learns from every conversation.
            </p>
          </div>

          {/* Feature pills */}
          <div className="hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-400">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                <Mic className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-200">Live Transcription</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-700 dark:text-gray-200">Self-Learning AI</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-gray-700 dark:text-gray-200">WhatsApp & Shopify</span>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-500">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="group px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="group px-8 py-6 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo (2 min)
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No credit card required • 14-day free trial • Setup in 5 minutes
            </p>
          </div>

          {/* Social proof */}
          <div className="hero-animate opacity-0 translate-y-4 transition-all duration-700 delay-600 pt-8">
            <div className="flex flex-col items-center gap-4">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white dark:border-gray-800" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-bold text-gray-900 dark:text-white">2,847+ sales teams</span> already using SalesHQ
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-300">4.9/5 (487 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated gradient lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
    </section>
  );
}