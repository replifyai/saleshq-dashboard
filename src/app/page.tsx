'use client'
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  HeroSection,
  ProblemStatementSection,
  ChallengesSection,
  UseCasesSection,
  TeamSection,
  ResourcesSection,
  EarlyAccessSection,
  RoadmapSection,
  CaseStudiesSection,
  // HowItWorksSection,
  // TestimonialsSection,
  // FeaturesSection,
  ROISection,
  // FAQSection,
  //PricingSection,
  // ContactSection,
  FooterSection
} from "@/components/landing";
// import TestimonialsSection from "@/components/landing/new/TestimonialsSection";
import HowItWorksSection from "@/components/landing/new/HowItWorksSection";
import FAQSection from "@/components/landing/new/FAQSection";
import ContactSection from "@/components/landing/new/CTASection";
import FeaturesSection from "@/components/landing/new/IntegrationsSection";
// import FooterSection from "@/components/landing/new/FooterSection";

export default function LandingPage() {
  const neonContainerRef = useRef<HTMLDivElement | null>(null);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    let isCancelled = false;
    let cleanupCanvas: (() => void) | null = null;

    const init = async () => {
      try {
        if (isCancelled || !neonContainerRef.current) return;

        // Clean up any existing canvas first
        if (cleanupCanvas) {
          cleanupCanvas();
          cleanupCanvas = null;
        }

        // Only initialize neonCursor in dark mode
        const isDarkMode = resolvedTheme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');
        
        if (!isDarkMode) {
          // Clean up and hide cursor in light mode
          const container = neonContainerRef.current;
          if (container) {
            const canvases = container.getElementsByTagName("canvas");
            Array.from(canvases).forEach((c) => c.remove());
          }
          return;
        }

        const startNeon = () => {
          if (!neonContainerRef.current || typeof window.neonCursor !== "function") return;
          const neon = window.neonCursor({
            el: neonContainerRef.current,
            shaderPoints: 18,
            curvePoints: 70,
            curveLerp: 0.5,
            radius1: 4,
            radius2: 48,
            velocityTreshold: 1,
            sleepRadiusX: 100,
            sleepRadiusY: 100,
            sleepTimeCoefX: 0.0025,
            sleepTimeCoefY: 0.0025,
          });

          // Nudge canvas styles for better visibility
          const container = neonContainerRef.current;
          if (container) {
            const canvas = container.querySelector("canvas");
            if (canvas) {
              (canvas as HTMLCanvasElement).style.mixBlendMode = "screen";
              (canvas as HTMLCanvasElement).style.opacity = "0.20";
              canvas.classList.add("neon-animate-hue");
            }
          }

          cleanupCanvas = () => {
            const container = neonContainerRef.current;
            if (!container) return;
            const canvases = container.getElementsByTagName("canvas");
            Array.from(canvases).forEach((c) => c.remove());
            try {
              if (neon && typeof neon.destroy === "function") {
                neon.destroy();
              }
            } catch { }
          };
        };

        if (window.neonCursor) {
          startNeon();
        } else {
          const handler = () => {
            startNeon();
            window.removeEventListener("neonCursorReady", handler);
          };
          window.addEventListener("neonCursorReady", handler);
        }
      } catch (err) {
        // Silently ignore to avoid breaking the page if CDN fails
        console.error("Failed to load neon cursor:", err);
      }
    };

    init();

    return () => {
      isCancelled = true;
      if (cleanupCanvas) cleanupCanvas();
    };
  }, [theme, resolvedTheme]); // Re-run when theme changes

  return (
    <div ref={neonContainerRef} className="min-h-screen relative overflow-hidden neon-cursor-area">
      {/* Subtle grid + radial glow background inspired by Cluely */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="absolute inset-0 opacity-[0.1] bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:3.5rem_3.5rem]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full blur-[120px] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12),transparent_60%)]" />
        <div className="absolute -bottom-40 right-1/3 w-[50rem] h-[50rem] rounded-full blur-[120px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_60%)]" />
      </div>

      <div className="relative z-10">
        {/* <LandingNavigation /> */}
        <HeroSection />
        <ProblemStatementSection />
        <ChallengesSection />
        <HowItWorksSection />
        <UseCasesSection />
        {/* <TeamSection /> */}
        {/* <TestimonialsSection /> */}
        <FeaturesSection />
        <ROISection />
        <CaseStudiesSection />
        <FAQSection />
        {/* <ResourcesSection /> */}
        {/* <RoadmapSection /> */}
        {/* <EarlyAccessSection /> */}
        {/* <PricingSection /> */}
        {/* <ContactSection /> */}
        <FooterSection />
      </div>

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

        .process-animate {
          opacity: 0;
          transform: translateY(20px);
        }

        .animate-in {
          animation: animate-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
