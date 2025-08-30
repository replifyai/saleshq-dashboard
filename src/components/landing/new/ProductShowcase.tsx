'use client'
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, 
  MessageSquare, 
  Brain,
  FileText,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Users,
  Sparkles,
  ChevronRight,
  Play,
  Volume2
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  demo: string;
  benefits: string[];
}

const features: Feature[] = [
  {
    id: "transcription",
    title: "Live Call Transcription",
    description: "Real-time voice-to-text with speaker detection and automatic punctuation.",
    icon: <Mic className="w-6 h-6" />,
    demo: "/demos/transcription.mp4",
    benefits: [
      "99.9% accuracy rate",
      "50+ languages supported", 
      "Speaker diarization",
      "Automatic timestamps"
    ]
  },
  {
    id: "ai-suggestions",
    title: "Instant AI Suggestions",
    description: "Get contextual responses and talking points powered by your knowledge base.",
    icon: <Brain className="w-6 h-6" />,
    demo: "/demos/suggestions.mp4",
    benefits: [
      "Context-aware responses",
      "Product recommendations",
      "Objection handling",
      "Next-best-action prompts"
    ]
  },
  {
    id: "knowledge",
    title: "Smart Knowledge Base",
    description: "Centralized repository that learns and improves from every interaction.",
    icon: <FileText className="w-6 h-6" />,
    demo: "/demos/knowledge.mp4",
    benefits: [
      "Auto-categorization",
      "Version control",
      "Team collaboration",
      "Real-time updates"
    ]
  },
  {
    id: "analytics",
    title: "Performance Analytics",
    description: "Track conversation metrics, win rates, and team performance in real-time.",
    icon: <BarChart3 className="w-6 h-6" />,
    demo: "/demos/analytics.mp4",
    benefits: [
      "Conversation insights",
      "Win/loss analysis",
      "Team leaderboards",
      "Custom reports"
    ]
  }
];

export default function ProductShowcase() {
  const [activeFeature, setActiveFeature] = useState(features[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll('.showcase-animate');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handlePlayDemo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 showcase-animate opacity-0 translate-y-4 transition-all duration-700">
          <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Product Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              See SalesHQ in Action
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience how our AI transforms every sales conversation into a winning opportunity.
          </p>
        </div>

        {/* Interactive showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Feature selector */}
          <div className="showcase-animate opacity-0 translate-x-[-20px] transition-all duration-700 delay-200">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card
                  key={feature.id}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    activeFeature.id === feature.id 
                      ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30' 
                      : 'hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setActiveFeature(feature)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      activeFeature.id === feature.id
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {feature.benefits.slice(0, 2).map((benefit, i) => (
                          <Badge 
                            key={i} 
                            variant="secondary"
                            className="text-xs bg-gray-100 dark:bg-gray-800"
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${
                      activeFeature.id === feature.id ? 'rotate-90 text-blue-500' : 'text-gray-400'
                    }`} />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Demo viewer */}
          <div className="showcase-animate opacity-0 translate-x-[20px] transition-all duration-700 delay-300">
            <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
              {/* Mock browser header */}
              <div className="flex items-center gap-2 p-4 bg-gray-900/50 border-b border-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-gray-800 rounded px-4 py-1 text-xs text-gray-400">
                    app.SalesHQ.ai
                  </div>
                </div>
              </div>

              {/* Demo content */}
              <div className="relative aspect-video bg-gray-950">
                {/* Placeholder for video/animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-6 relative">
                      <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                        {activeFeature.icon}
                      </div>
                      <Button
                        onClick={handlePlayDemo}
                        className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform"
                      >
                        <Play className="w-5 h-5 text-gray-900 dark:text-white ml-0.5" />
                      </Button>
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {activeFeature.title}
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {activeFeature.benefits.map((benefit, i) => (
                        <span key={i} className="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500/20 backdrop-blur rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-red-400">LIVE DEMO</span>
                </div>

                {/* Volume indicator */}
                <div className="absolute bottom-4 right-4">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="bg-gray-900/80 backdrop-blur hover:bg-gray-800"
                  >
                    <Volume2 className="w-4 h-4 text-gray-300" />
                  </Button>
                </div>
              </div>

              {/* Feature benefits */}
              <div className="p-6 bg-gray-900/30 border-t border-gray-800">
                <div className="grid grid-cols-2 gap-4">
                  {activeFeature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Additional info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-200">Enterprise-grade security</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    All data is encrypted end-to-end. SOC 2 Type II certified. GDPR compliant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}