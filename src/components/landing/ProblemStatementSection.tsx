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
    <section ref={sectionRef} className="relative isolate overflow-hidden py-20">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 border-0">
            <HelpCircle className="w-3 h-3 mr-1" />
            Sales Challenges
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" ref={titleRef}>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Stop Wasting Time
            </span>
            {" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Searching for Info
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" ref={descriptionRef}>
            Sales teams lose 3+ hours daily hunting through scattered documents. Every minute searching is a minute not selling.
          </p>
        </div>


        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            data-problem-card
            className="p-8 rounded-2xl shadow-xl bg-white/5 border border-white/10 backdrop-blur text-center transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-500/20">
              <Clock className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Productivity Loss</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              3+ hours daily wasted searching through scattered documents instead of selling.
            </p>
            <div className="text-2xl font-bold text-red-400">3+ Hours Daily Lost</div>
          </Card>

          <Card
            data-problem-card
            className="p-8 rounded-2xl shadow-xl bg-white/5 border border-white/10 backdrop-blur text-center transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-orange-500/20">
              <AlertCircle className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Revenue Impact</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Slow responses lead to missed deals and lost revenue opportunities.
            </p>
            <div className="text-2xl font-bold text-orange-400">40% Revenue Loss</div>
          </Card>

          <Card
            data-problem-card
            className="p-8 rounded-2xl shadow-xl bg-white/5 border border-white/10 backdrop-blur text-center transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-yellow-500/20">
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Team Morale</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Frustration with outdated info and inconsistent answers across teams.
            </p>
            <div className="text-2xl font-bold text-yellow-400">High Turnover Risk</div>
          </Card>
        </div>
      </div>
    </section>
  );
} 