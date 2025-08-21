import { Upload, MessageCircle, BarChart3, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelsWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Desktop / tablet: pinned horizontal scroll
      mm.add("(min-width: 768px)", () => {
        const panels: HTMLElement[] = gsap.utils.toArray(".hiw-panel");

        // Ensure the wrapper takes full viewport height
        if (panelsWrapperRef.current) {
          gsap.set(panelsWrapperRef.current, { height: "100vh" });
        }

        const totalPanels = panels.length + 1;
        const horizontalTween = gsap.to(panelsWrapperRef.current, {
          xPercent: -100 * (totalPanels - 1),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            end: () => "+=" + Math.max(0, window.innerWidth * (totalPanels - 1)),
            snap: {
              snapTo: totalPanels > 1 ? 1 / (totalPanels - 1) : 1,
              duration: { min: 0.2, max: 0.6 },
              ease: "power1.inOut",
            },
          },
        });

        // Per-panel entrance animations tied to the horizontal container animation
        panels.forEach((panel) => {
          const content = panel.querySelector(".hiw-content");
          const badge = panel.querySelector(".hiw-badge");
          const slowEls: HTMLElement[] = gsap.utils.toArray(panel.querySelectorAll(".parallax-slow"));
          const fastEls: HTMLElement[] = gsap.utils.toArray(panel.querySelectorAll(".parallax-fast"));
          const rotateEls: HTMLElement[] = gsap.utils.toArray(panel.querySelectorAll(".parallax-rotate"));

          if (content) {
            gsap.fromTo(
              content,
              { autoAlpha: 0, y: 60, rotateX: 15, transformPerspective: 800 },
              {
                autoAlpha: 1,
                y: 0,
                rotateX: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                  containerAnimation: horizontalTween,
                  trigger: panel,
                  start: "left center",
                  end: "right center",
                  toggleActions: "play reverse play reverse",
                },
              }
            );
          }

          if (badge) {
            gsap.fromTo(
              badge,
              { scale: 0, rotate: -35, autoAlpha: 0 },
              {
                scale: 1,
                rotate: 0,
                autoAlpha: 1,
                duration: 0.6,
                ease: "back.out(1.7)",
                scrollTrigger: {
                  containerAnimation: horizontalTween,
                  trigger: panel,
                  start: "left center",
                },
              }
            );
          }

          // Subtle parallax for decorative/illustration elements
          slowEls.forEach((el) => {
            gsap.fromTo(
              el,
              { y: 30 },
              {
                y: -30,
                ease: "none",
                scrollTrigger: {
                  containerAnimation: horizontalTween,
                  trigger: panel,
                  start: "left center",
                  end: "right center",
                  scrub: true,
                },
              }
            );
          });

          fastEls.forEach((el) => {
            gsap.fromTo(
              el,
              { y: 60 },
              {
                y: -60,
                ease: "none",
                scrollTrigger: {
                  containerAnimation: horizontalTween,
                  trigger: panel,
                  start: "left center",
                  end: "right center",
                  scrub: true,
                },
              }
            );
          });

          rotateEls.forEach((el) => {
            gsap.fromTo(
              el,
              { rotate: -8 },
              {
                rotate: 8,
                ease: "none",
                scrollTrigger: {
                  containerAnimation: horizontalTween,
                  trigger: panel,
                  start: "left center",
                  end: "right center",
                  scrub: true,
                },
              }
            );
          });
        });

        return () => {
          horizontalTween.scrollTrigger?.kill();
          horizontalTween.kill();
        };
      });

      // Mobile: simple vertical reveal
      mm.add("(max-width: 767px)", () => {
        const items: HTMLElement[] = gsap.utils.toArray(".hiw-content");
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "bottom 20%",
            },
          }
        );

        const slowEls: HTMLElement[] = gsap.utils.toArray(".parallax-slow");
        const fastEls: HTMLElement[] = gsap.utils.toArray(".parallax-fast");
        const rotateEls: HTMLElement[] = gsap.utils.toArray(".parallax-rotate");

        slowEls.forEach((el) => {
          gsap.fromTo(
            el,
            { y: 20 },
            {
              y: -20,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });

        fastEls.forEach((el) => {
          gsap.fromTo(
            el,
            { y: 40 },
            {
              y: -40,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });

        rotateEls.forEach((el) => {
          gsap.fromTo(
            el,
            { rotate: -6 },
            {
              rotate: 6,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-transparent overflow-hidden"
    >
      {/* Always-visible heading overlay */}
      <div className="sticky top-0 md:absolute md:inset-x-0 md:top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 text-center mt-14">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
            How Replify Transforms Your Sales Process
          </h2>
          <p className="mt-2 text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From document chaos to instant answers in 3 simple steps. No technical expertise required.
          </p>
        </div>
      </div>
      {/* Panels wrapper (horizontal on ≥ md) */}
      <div ref={panelsWrapperRef} className="flex md:flex-row flex-col w-full md:h-screen mb-10">
        {/* Panel 1 */}
        <div className="panel w-full md:w-screen flex-none h-[100vh] md:h-[100vh] flex items-center justify-center">
          <div className="hiw-content moving-border max-w-5xl w-[90%] md:w-[70%] text-center mt-24 md:mt-32 p-6 md:p-8 bg-white/5 backdrop-blur-xl rounded-3xl border">
            {/* Decorative elements */}
            <div className="parallax-slow pointer-events-none absolute -top-8 -left-8 hidden md:block">
              <div className="w-24 h-24 rounded-full bg-blue-500/20 blur-2xl" />
            </div>
            <div className="parallax-fast pointer-events-none absolute -bottom-10 -right-10 hidden md:block">
              <div className="w-28 h-28 rounded-full bg-purple-500/20 blur-2xl" />
            </div>
            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6" />
            <div className="hiw-badge inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold mb-6 shadow-lg">
              1
            </div>
            <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <p className="uppercase tracking-wider text-xs md:text-sm text-blue-600 dark:text-blue-300 font-semibold mb-2">
              Centralize your sales knowledge
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
              Upload & Organize
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Drag-and-drop your sales docs, product catalogs, pricing sheets and more. Our AI processes and
              organizes everything automatically.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200 text-sm ring-1 ring-blue-200/50 dark:ring-blue-800/40">
                <Sparkles className="w-4 h-4" /> 10× faster onboarding
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-200 text-sm ring-1 ring-indigo-200/50 dark:ring-indigo-800/40">
                Auto-tagging
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-200 text-sm ring-1 ring-purple-200/50 dark:ring-purple-800/40">
                Semantic search ready
              </div>
            </div>
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200/70 to-transparent dark:via-white/10" />
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-3xl mx-auto">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                <CheckCircle className="w-5 h-5 text-blue-600" /> PDFs & Docs
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                <CheckCircle className="w-5 h-5 text-blue-600" /> Batch Upload
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                <CheckCircle className="w-5 h-5 text-blue-600" /> Google Drive
              </li>
            </ul>
            <button className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow hover:opacity-90 transition">
              Learn more
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="panel hiw-panel w-full md:w-screen flex-none h-[100vh] md:h-[100vh] flex items-center justify-center">
          <div className="hiw-content moving-border max-w-5xl w-[90%] md:w-[70%] text-center mt-24 md:mt-32 p-6 md:p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
            {/* Decorative elements */}
            <div className="parallax-slow pointer-events-none absolute -top-8 -left-8 hidden md:block">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 blur-2xl" />
            </div>
            <div className="parallax-fast pointer-events-none absolute -bottom-10 -right-10 hidden md:block">
              <div className="w-28 h-28 rounded-full bg-teal-500/20 blur-2xl" />
            </div>
            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full mx-auto mb-6" />
            {/* <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full mx-auto mb-6" /> */}
            <div className="hiw-badge inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white font-bold mb-6 shadow-lg">
              2
            </div>
            <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-2xl">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <p className="uppercase tracking-wider text-xs md:text-sm text-emerald-600 dark:text-emerald-300 font-semibold mb-2">
              Search your knowledgebase
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
              Ask & Get Answers
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Ask in natural language. Replify returns instant, accurate answers with source citations so you never
              hunt through docs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-200 text-sm ring-1 ring-emerald-200/50 dark:ring-emerald-800/40">
                <Sparkles className="w-4 h-4" /> Query anything
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-200 text-sm ring-1 ring-teal-200/50 dark:ring-teal-800/40">
                Context aware
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-200 text-sm ring-1 ring-green-200/50 dark:ring-green-800/40">
                Sources included
              </div>
            </div>
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200/70 to-transparent dark:via-white/10" />
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-3xl mx-auto">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Natural Language
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Instant Answers
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Cited Sources
              </li>
            </ul>
            <button className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow hover:opacity-90 transition">
              Try it now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Panel 3 */}
        <div className="panel hiw-panel w-full md:w-screen flex-none h-[100vh] md:h-[100vh] flex items-center justify-center">
          <div className="hiw-content moving-border max-w-5xl w-[90%] md:w-[70%] text-center mt-24 md:mt-32 p-6 md:p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl border border-gray-600 dark:border-white/10">
            {/* Decorative elements */}
            <div className="parallax-slow pointer-events-none absolute -top-8 -left-8 hidden md:block">
              <div className="w-24 h-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
            </div>
            <div className="parallax-fast pointer-events-none absolute -bottom-10 -right-10 hidden md:block">
              <div className="w-28 h-28 rounded-full bg-pink-500/20 blur-2xl" />
            </div>
            <div className="h-1.5 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6" />
            {/* <div className="h-1.5 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6" /> */}
            <div className="hiw-badge inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold mb-6 shadow-lg">
              3
            </div>
            <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-2xl">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <p className="uppercase tracking-wider text-xs md:text-sm text-purple-600 dark:text-purple-300 font-semibold mb-2">
              Close the loop
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
              Learn & Improve
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Close the loop with real-time feedback. Identify gaps and teach the AI continuously for smarter results
              every day.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-200 text-sm ring-1 ring-fuchsia-200/50 dark:ring-fuchsia-800/40">
                <Sparkles className="w-4 h-4" /> Feedback loop
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-200 text-sm ring-1 ring-violet-200/50 dark:ring-violet-800/40">
                Auto-learning
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-200 text-sm ring-1 ring-pink-200/50 dark:ring-pink-800/40">
                Team insights
              </div>
            </div>
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200/70 to-transparent dark:via-white/10" />
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                <CheckCircle className="w-5 h-5 text-purple-600" /> Real-time Training
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                <CheckCircle className="w-5 h-5 text-purple-600" /> Gap Identification
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <CheckCircle className="w-5 h-5 text-purple-600" /> Continuous Improvement
              </li>
            </ul>
            <button className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow hover:opacity-90 transition">
              See how it works
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}