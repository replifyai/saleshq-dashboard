'use client'
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  Sparkles,
  Rocket,
  CheckCircle,
  Users,
  Calendar,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll('.cta-animate');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 opacity-90" />
      
      {/* Animated mesh pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="cta-animate opacity-0 translate-y-4 transition-all duration-700">
            <Badge className="mb-6 px-4 py-2 bg-white/20 backdrop-blur text-white border-white/30 text-sm">
              <Rocket className="w-4 h-4 mr-2" />
              Limited Time Offer: 20% Off Annual Plans
            </Badge>
          </div>

          {/* Main heading */}
          <div className="cta-animate opacity-0 translate-y-4 transition-all duration-700 delay-100">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Ready to Transform Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Sales Performance?
              </span>
            </h2>
          </div>

          {/* Subheading */}
          <div className="cta-animate opacity-0 translate-y-4 transition-all duration-700 delay-200">
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Join thousands of sales teams closing deals faster with AI-powered intelligence. 
              Start your free trial today and see results in minutes.
            </p>
          </div>

          {/* Benefits grid */}
          <div className="cta-animate opacity-0 translate-y-4 transition-all duration-700 delay-300">
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
              <div className="flex items-center justify-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="cta-animate opacity-0 translate-y-4 transition-all duration-700 delay-400">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="group px-10 py-7 text-lg font-bold bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="group px-10 py-7 text-lg font-bold bg-transparent text-white border-2 border-white/50 hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                <Calendar className="mr-2 w-5 h-5" />
                Schedule Demo
              </Button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="cta-animate opacity-0 translate-y-4 transition-all duration-700 delay-500">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">2,847+ teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="font-medium">5-minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <span className="font-medium">4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Urgency message */}
          <div className="cta-animate opacity-0 translate-y-4 transition-all duration-700 delay-600 mt-12">
            <Card className="inline-block p-1 bg-white/10 backdrop-blur border-white/20">
              <div className="px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
                <p className="text-white font-medium">
                  <Sparkles className="inline w-4 h-4 mr-2" />
                  Special offer ends in 48 hours • 127 teams joined today
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}