import { useEffect, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { gsap } from "gsap";

type Testimonial = {
  quote: string;
  initials: string;
  name: string;
  title: string;
  gradientFrom: string;
  gradientTo: string;
  accent: string;
};

export default function TestimonialsSection() {
  const testimonials = useMemo<Testimonial[]>(
    () => [
      {
        quote:
          "SalesHQ cut our response time from hours to seconds. Our sales team can now focus on selling instead of searching for information. Game changer!",
        initials: "SJ",
        name: "Sarah Johnson",
        title: "VP of Sales, TechCorp",
        gradientFrom: "from-blue-500",
        gradientTo: "to-purple-600",
        accent: "text-blue-600",
      },
      {
        quote:
          "The closed feedback loop is brilliant. Our AI gets smarter every day, and we never miss important customer questions anymore.",
        initials: "MR",
        name: "Mike Rodriguez",
        title: "Sales Director, GrowthCo",
        gradientFrom: "from-green-500",
        gradientTo: "to-emerald-600",
        accent: "text-green-600",
      },
      {
        quote:
          "Integration with WhatsApp and our website chatbot means we're supporting customers 24/7. Revenue is up 35% since implementation.",
        initials: "LC",
        name: "Lisa Chen",
        title: "Head of Customer Success, ScaleUp",
        gradientFrom: "from-purple-500",
        gradientTo: "to-pink-600",
        accent: "text-purple-600",
      },
    ],
    []
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    const trackEl = trackRef.current;
    if (!containerEl || !trackEl) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setup = () => {
      // Kill any existing animation
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      // Measure half of the track width (since we duplicate content once)
      const halfWidth = trackEl.scrollWidth / 2;

      if (prefersReducedMotion || halfWidth === 0) return;

      // Continuous leftward move, seamless due to duplicated items
      const durationPerPixel = 0.02; // lower = faster
      const duration = Math.max(10, halfWidth * durationPerPixel);

      // Start from 0 and translate to -halfWidth, then jump back to 0 on repeat
      timelineRef.current = gsap.fromTo(
        trackEl,
        { x: 0 },
        {
          x: -halfWidth,
          ease: "none",
          duration,
          repeat: -1,
          onRepeat: () => {
            gsap.set(trackEl, { x: 0 });
          },
        }
      );
    };

    // Initial setup
    setup();

    // Recompute on resize
    const resizeObserver = new ResizeObserver(() => {
      setup();
    });
    resizeObserver.observe(trackEl);
    resizeObserver.observe(containerEl);

    // Pause/resume on hover
    const handleEnter = () => timelineRef.current?.pause();
    const handleLeave = () => timelineRef.current?.resume();
    containerEl.addEventListener("mouseenter", handleEnter);
    containerEl.addEventListener("mouseleave", handleLeave);

    return () => {
      containerEl.removeEventListener("mouseenter", handleEnter);
      containerEl.removeEventListener("mouseleave", handleLeave);
      resizeObserver.disconnect();
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, []);

  // Duplicate testimonials once for a seamless loop
  const loopItems = useMemo(() => [...testimonials, ...testimonials], [testimonials]);

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Sales Teams Are Saying
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real results from real sales professionals using SalesHQ every day.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg p-4"
          aria-label="Testimonials carousel"
        >
          {/* Gradient edge masks for a smooth fade-in/out while moving */}
          {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-blue-50 dark:from-blue-900/20 to-transparent z-10" /> */}

          <div ref={trackRef} className="flex gap-6 md:gap-8 will-change-transform">
            {loopItems.map((t, idx) => (
              <Card
                key={`${t.initials}-${idx}`}
                className="p-6 md:p-8 border border-white/10 shadow-xl bg-white/5 backdrop-blur min-w-[280px] sm:min-w-[320px] md:min-w-[360px] lg:min-w-[420px]"
              >
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <Quote className={`w-8 h-8 ${t.accent} mb-4`} />
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  “{t.quote}”
                </p>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${t.gradientFrom} ${t.gradientTo} rounded-full flex items-center justify-center mr-4`}
                  >
                    <span className="text-white dark:text-white font-bold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{t.title}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}