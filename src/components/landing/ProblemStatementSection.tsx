import { Card } from "@/components/ui/card";
import { Clock, AlertCircle, Users, HelpCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../ui/badge";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function ProblemStatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide title/description
      gsap.set([titleRef.current, descriptionRef.current], { opacity: 0, y: 50 });

      // Title animation
      gsap.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 60,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            end: "top 25%",
            // toggleActions: "play reverse play reverse"
          }
        }
      );

      // Description animation
      gsap.fromTo(descriptionRef.current,
        {
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play reverse play reverse"
          }
        }
      );

      // Smooth, batched card animation
      const cardElements = gsap.utils.toArray<HTMLElement>(
        cardsRef.current?.querySelectorAll('[data-problem-card]') || []
      );

      if (cardElements.length) {
        gsap.set(cardElements, {
          opacity: 0,
          y: 40,
          willChange: "transform, opacity",
          force3D: true,
        });

        ScrollTrigger.batch(cardElements, {
          start: "top 85%",
          end: "bottom top",
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: { each: 0.12, from: "start" },
              overwrite: "auto",
            }),
          onLeaveBack: (batch) =>
            gsap.to(batch, {
              opacity: 0,
              y: 40,
              duration: 0.4,
              ease: "power1.out",
              overwrite: "auto",
            }),
        });
      }

      // Section parallax effect
      gsap.to(sectionRef.current, {
        y: -1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  // Rely on gsap.context cleanup for triggers created here

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div ref={headerRef} className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 border-0">
            <HelpCircle className="w-4 h-4 mr-1" />
            The Problem
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" ref={titleRef}>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Sales teams waste
            </span>{" "}
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              3+ hours daily
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" ref={descriptionRef}>
            Searching through scattered documents, outdated specs, and inconsistent messaging. 
            <span className="font-semibold text-red-600 dark:text-red-400">Massive productivity losses</span> across sales teams worldwide.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            data-problem-card
            className="p-8 rounded-2xl shadow-xl bg-white/5 border border-white/10 backdrop-blur text-center transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-blue-500/20">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3+ Hours Daily Lost</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Constant context switching between PDFs, Notion, Slack and email to find basic answers. 
              <span className="font-semibold text-red-600 dark:text-red-400">Significant productivity losses</span> per rep annually.
            </p>
            <div className="text-sm font-medium text-blue-400">Massive time waste across teams</div>
          </Card>

          <Card
            data-problem-card
            className="p-8 rounded-2xl shadow-xl bg-white/5 border border-white/10 backdrop-blur text-center transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-indigo-500/20">
              <AlertCircle className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">40% Longer Sales Cycles</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Waiting on specs and pricing breaks momentum and delays follow‑ups when interest is highest. 
              <span className="font-semibold text-red-600 dark:text-red-400">Significant deal loss</span> due to delayed responses.
            </p>
            <div className="text-sm font-medium text-indigo-400">Lost opportunities due to delays</div>
          </Card>

          <Card
            data-problem-card
            className="p-8 rounded-2xl shadow-xl bg-white/5 border border-white/10 backdrop-blur text-center transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-purple-500/20">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">67% Inconsistent Messaging</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Specs drift, messaging varies by rep, and confidence drops on calls when sources disagree. 
              <span className="font-semibold text-red-600 dark:text-red-400">High buyer confusion</span> leads to lost deals.
            </p>
            <div className="text-sm font-medium text-purple-400">Lost opportunities due to inconsistency</div>
          </Card>
        </div>
      </div>
    </section>
  );
} 