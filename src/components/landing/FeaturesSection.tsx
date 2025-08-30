import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  BarChart3, 
  Upload, 
  Globe, 
  Bot 
} from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Working header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            end: "top 15%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Optimized cards animation using ScrollTrigger.batch
      const cardElements = gsap.utils.toArray<HTMLElement>(
        cardsRef.current?.querySelectorAll('[data-feature-card]') || []
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

      // Section parallax
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

  // Rely on gsap.context cleanup to remove animations and triggers created in this component
  return (
    <section ref={sectionRef} id="features" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything Your Sales Team Needs in One Platform
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From AI-powered chat to multi-channel integrations, SalesHQ delivers a complete sales intelligence solution.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Core Features */}
          <Card
            data-feature-card
            className="p-6 border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl bg-white dark:bg-white/5 backdrop-blur rounded-2xl transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <CardHeader className="p-0 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Intelligent Q&A System
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Ask questions in natural language and get instant, accurate answers with source citations. No more document hunting.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  Natural Language
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  Source Citations
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card
            data-feature-card
            className="p-6 border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl bg-white dark:bg-white/5 backdrop-blur rounded-2xl transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <CardHeader className="p-0 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Self-Learning AI Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Revolutionary closed feedback loop that identifies gaps and trains your AI in real-time for continuous improvement.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">
                  Real-time Training
                </Badge>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">
                  Gap Detection
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card
            data-feature-card
            className="p-6 border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl bg-white dark:bg-white/5 backdrop-blur rounded-2xl transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <CardHeader className="p-0 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Smart Document Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Upload any document format with batch processing and Google Drive integration. AI extracts and organizes key information.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  Multiple Formats
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  Batch Upload
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Integration Features */}
          <Card
            data-feature-card
            className="p-6 border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl bg-white dark:bg-white/5 backdrop-blur rounded-2xl transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <CardHeader className="p-0 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-lime-600 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                WhatsApp Business Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect directly to WhatsApp Business API for instant customer support with automated, intelligent responses.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  Business API
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  Auto Responses
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card
            data-feature-card
            className="p-6 border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl bg-white dark:bg-white/5 backdrop-blur rounded-2xl transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <CardHeader className="p-0 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Shopify Store Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Seamless integration with Shopify for real-time product information, inventory, and order management support.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                  Product Sync
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                  Order Support
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card
            data-feature-card
            className="p-6 border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl bg-white dark:bg-white/5 backdrop-blur rounded-2xl transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <CardHeader className="p-0 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                24/7 Website Chatbots
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Deploy intelligent chatbots on your website that handle customer queries around the clock using your knowledge base.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100">
                  24/7 Support
                </Badge>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100">
                  Easy Integration
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 