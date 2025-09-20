'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  MessageSquare, 
  BarChart3, 
  BookOpen, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Eye,
  FileText,
  Headphones,
  DollarSign,
  Calendar,
  Lightbulb,
  Database,
  Settings,
  Smartphone,
  Monitor,
  Laptop
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  status: 'available' | 'coming-soon';
  benefits: string[];
  metrics?: {
    value: string;
    label: string;
  };
}

const existingFeatures: Feature[] = [
  {
    id: "ai-intelligence",
    title: "AI-Powered Intelligence",
    description: "Advanced natural language processing that understands context and provides accurate, source-backed responses to complex sales questions.",
    icon: <Brain className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
    category: "Core AI",
    status: "available",
    metrics: {
      value: "95%",
      label: "Accuracy Rate",
    },
    benefits: [
      "Context-aware responses",
      "Source citations",
      "Multi-language support",
      "Continuous learning"
    ]
  },
  {
    id: "real-time-chat",
    title: "Real-Time Communication",
    description: "Instant AI responses during calls, meetings, and customer interactions with seamless integration across all channels.",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "from-emerald-500 to-emerald-600",
    category: "Communication",
    status: "available",
    metrics: {
      value: "0.8s",
      label: "Response Time",
    },
    benefits: [
      "Live transcription",
      "Instant suggestions",
      "Multi-channel support",
      "Team collaboration"
    ]
  },
  {
    id: "analytics-dashboard",
    title: "Advanced Analytics",
    description: "Comprehensive insights into team performance, query patterns, and knowledge gaps with actionable recommendations.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "from-purple-500 to-purple-600",
    category: "Analytics",
    status: "available",
    metrics: {
      value: "40%",
      label: "Faster Deals",
    },
    benefits: [
      "Performance tracking",
      "Gap analysis",
      "ROI measurement",
      "Custom reports"
    ]
  },
  {
    id: "knowledge-management",
    title: "Knowledge Management",
    description: "Centralized repository for all sales materials, product information, and best practices with intelligent search and recommendations.",
    icon: <BookOpen className="w-6 h-6" />,
    color: "from-orange-500 to-orange-600",
    category: "Content",
    status: "available",
    metrics: {
      value: "10K+",
      label: "Documents",
    },
    benefits: [
      "Centralized content",
      "Smart search",
      "Version control",
      "Access control"
    ]
  },
  // {
  //   id: "team-collaboration",
  //   title: "Team Collaboration",
  //   description: "Seamless collaboration tools that enable knowledge sharing, peer learning, and collective intelligence across your sales team.",
  //   icon: <Users className="w-6 h-6" />,
  //   color: "from-indigo-500 to-indigo-600",
  //   category: "Collaboration",
  //   status: "available",
  //   metrics: {
  //     value: "85%",
  //     label: "Team Adoption",
  //     trend: "+15% this quarter"
  //   },
  //   benefits: [
  //     "Shared workspaces",
  //     "Peer reviews",
  //     "Knowledge sharing",
  //     "Team insights"
  //   ]
  // },
  // {
  //   id: "automation",
  //   title: "Workflow Automation",
  //   description: "Intelligent automation that handles routine tasks, data entry, and follow-ups, freeing your team to focus on high-value activities.",
  //   icon: <Zap className="w-6 h-6" />,
  //   color: "from-yellow-500 to-yellow-600",
  //   category: "Automation",
  //   status: "available",
  //   metrics: {
  //     value: "23h",
  //     label: "Time Saved/Week",
  //     trend: "+5h this month"
  //   },
  //   benefits: [
  //     "Automated follow-ups",
  //     "Smart routing",
  //     "Data synchronization",
  //     "Task automation"
  //   ]
  // },
  // {
  //   id: "security-compliance",
  //   title: "Security & Compliance",
  //   description: "Enterprise-grade security with SOC 2 compliance, data encryption, and granular access controls to protect your sensitive information.",
  //   icon: <Shield className="w-6 h-6" />,
  //   color: "from-red-500 to-red-600",
  //   category: "Security",
  //   status: "available",
  //   metrics: {
  //     value: "99.9%",
  //     label: "Uptime",
  //     trend: "SOC 2 Certified"
  //   },
  //   benefits: [
  //     "Data encryption",
  //     "Access controls",
  //     "Audit trails",
  //     "Compliance reporting"
  //   ]
  // },
  {
    id: "integrations",
    title: "Seamless Integrations",
    description: "Connect with your existing tools including CRM, marketing automation, and communication platforms for a unified workflow.",
    icon: <Globe className="w-6 h-6" />,
    color: "from-cyan-500 to-cyan-600",
    category: "Integration",
    status: "available",
    metrics: {
      value: "50+",
      label: "Integrations",
    },
    benefits: [
      "CRM sync",
      "API access",
      "Webhook support",
      "Custom connectors"
    ]
  },
  {
    id: "shopify-integration",
    title: "Online Store Integration",
    description: "Deep Shopify integration for comprehensive order management, cart management, and real-time e-commerce data synchronization.",
    icon: <Database className="w-6 h-6" />,
    color: "from-green-500 to-green-600",
    category: "Integration",
    status: "available",
    metrics: {
      value: "99.9%",
      label: "Sync Accuracy",
    },
    benefits: [
      "Order management",
      "Cart management",
      "Product synchronization",
      "Inventory tracking",
      "Customer data sync",
      "Real-time updates"
    ]
  }
];

const comingSoonFeatures: Feature[] = [
  {
    id: "product-insights",
    title: "Real-Time Product Insights",
    description: "Connect with your online store to get real-time product reviews, customer sentiments, and market intelligence to inform your sales strategy.",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-pink-500 to-pink-600",
    category: "Analytics",
    status: "coming-soon",
    benefits: [
      "Live review monitoring",
      "Sentiment analysis",
      "Competitive intelligence",
      "Market trends"
    ]
  },
  {
    id: "query-insights",
    title: "Query Intelligence",
    description: "Get deep insights on user queries asked by agents on the platform, helping you understand knowledge gaps and training opportunities.",
    icon: <Target className="w-6 h-6" />,
    color: "from-violet-500 to-violet-600",
    category: "Intelligence",
    status: "coming-soon",
    benefits: [
      "Query pattern analysis",
      "Knowledge gap identification",
      "Training recommendations",
      "Performance insights"
    ]
  },
  {
    id: "deal-briefing",
    title: "Deal Briefing & Handover",
    description: "Generate comprehensive briefs of ongoing deals and customer calls for seamless handovers between agents and effective knowledge transfer.",
    icon: <FileText className="w-6 h-6" />,
    color: "from-teal-500 to-teal-600",
    category: "Collaboration",
    status: "coming-soon",
    benefits: [
      "Automated deal summaries",
      "Context preservation",
      "Handover templates",
      "Knowledge transfer"
    ]
  },
  {
    id: "sales-simulation",
    title: "Sales Scenario Simulation",
    description: "Practice realistic sales scenarios with AI-powered simulations that help teams master winning techniques and improve performance.",
    icon: <Headphones className="w-6 h-6" />,
    color: "from-amber-500 to-amber-600",
    category: "Training",
    status: "coming-soon",
    benefits: [
      "Realistic scenarios",
      "AI-powered coaching",
      "Performance feedback",
      "Skill development"
    ]
  },
  {
    id: "revenue-prediction",
    title: "Revenue Prediction",
    description: "Predict future revenue based on customer conversations and current sales data using advanced AI algorithms and machine learning.",
    icon: <DollarSign className="w-6 h-6" />,
    color: "from-green-500 to-green-600",
    category: "Analytics",
    status: "coming-soon",
    benefits: [
      "Conversation analysis",
      "Revenue forecasting",
      "Risk assessment",
      "Strategic planning"
    ]
  }
];

const categories = [
  { id: "all", name: "All Features", icon: <Star className="w-4 h-4" /> },
  { id: "Core AI", name: "Core AI", icon: <Brain className="w-4 h-4" /> },
  { id: "Analytics", name: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "Communication", name: "Communication", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "Content", name: "Content", icon: <BookOpen className="w-4 h-4" /> },
  { id: "Collaboration", name: "Collaboration", icon: <Users className="w-4 h-4" /> },
  // { id: "Automation", name: "Automation", icon: <Zap className="w-4 h-4" /> },
  // { id: "Security", name: "Security", icon: <Shield className="w-4 h-4" /> },
  { id: "Integration", name: "Integration", icon: <Globe className="w-4 h-4" /> },
  { id: "Intelligence", name: "Intelligence", icon: <Target className="w-4 h-4" /> },
  { id: "Training", name: "Training", icon: <Headphones className="w-4 h-4" /> }
];

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();
  // Combine all features and filter by category
  const allFeatures = [...existingFeatures, ...comingSoonFeatures];
  const filteredFeatures = selectedCategory === "all" 
    ? allFeatures 
    : allFeatures.filter(feature => feature.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden pt-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-6">
              Everything You Need to
              <span className="block">Accelerate Sales</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Discover our comprehensive suite of AI-powered tools designed to transform your sales process, 
              boost team performance, and drive measurable results.
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-600">
                <Eye className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>

          {/* All Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature) => (
              <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm relative overflow-hidden">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {feature.status === 'available' ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700">
                      <Clock className="w-3 h-3 mr-1" />
                      Coming Soon
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {feature.status === 'available' ? 'Key Benefits:' : 'Expected Benefits:'}
                    </h4>
                    <ul className="space-y-1">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                          {feature.status === 'available' ? (
                            <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                          ) : (
                            <Lightbulb className="w-3 h-3 mr-2 text-amber-500 flex-shrink-0" />
                          )}
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Sales Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of sales teams already using our AI-powered platform to accelerate growth and achieve better results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => router.push('/contact')}>
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10" onClick={() => {
              window.open('https://calendly.com/saleshqai/30min', '_blank');
            }}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}