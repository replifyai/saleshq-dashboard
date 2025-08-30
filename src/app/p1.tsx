'use client'
import { useEffect } from "react";

// Import all new landing page components
import NavigationHeader from "@/components/landing/new/NavigationHeader";
import HeroSection from "@/components/landing/new/HeroSection";
import ProductShowcase from "@/components/landing/new/ProductShowcase";
// import IntegrationsSection from "@/components/landing/new/IntegrationsSection";
import MetricsSection from "@/components/landing/new/MetricsSection";
import HowItWorksSection from "@/components/landing/new/HowItWorksSection";
import TestimonialsSection from "@/components/landing/new/TestimonialsSection";
import PricingSection from "@/components/landing/new/PricingSection";
import FAQSection from "@/components/landing/new/FAQSection";
import CTASection from "@/components/landing/new/CTASection";
import FooterSection from "@/components/landing/new/FooterSection";

export default function LandingPage() {
  useEffect(() => {
    // Add smooth scrolling behavior to the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Intersection observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Fixed navigation header */}
      <NavigationHeader />
      
      {/* Main content with proper spacing for fixed header */}
      <main className="relative">
        <HeroSection />
        <ProductShowcase />
        {/* <IntegrationsSection /> */}
        <MetricsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>

      {/* Footer */}
      <FooterSection />
      
      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-animate,
        .showcase-animate,
        .integrate-animate,
        .metrics-animate,
        .process-animate,
        .cta-animate {
          opacity: 0;
          transform: translateY(20px);
        }

        .animate-in {
          animation: animate-in 0.6s ease-out forwards;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 4s ease infinite;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          @apply dark:bg-gray-900;
        }

        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 6px;
          @apply dark:bg-gray-700;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
          @apply dark:bg-gray-600;
        }
      `}</style>
    </div>
  );
}
