'use client'
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  MessageCircle, 
  Globe,
  FileText,
  Cloud,
  Mail,
  Phone,
  Database,
  Link2,
  Sparkles,
  CheckCircle,
  ArrowUpRight,
  Zap,
  Shield,
  Clock,
  Users,
  BarChart3,
  Code2,
  Play,
  ExternalLink,
  ChevronRight,
  Star,
  Plus
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  category: string;
  popular?: boolean;
  status?: 'live' | 'coming-soon' | 'beta';
  rating?: number;
  users?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

const categories: Category[] = [
  { id: "all", name: "All", icon: <Zap className="w-4 h-4" />, count: 0 },
  { id: "ecommerce", name: "E-commerce", icon: <ShoppingBag className="w-4 h-4" />, count: 0 },
  { id: "communication", name: "Communication", icon: <MessageCircle className="w-4 h-4" />, count: 0 },
  { id: "productivity", name: "Productivity", icon: <BarChart3 className="w-4 h-4" />, count: 0 },
  { id: "sales", name: "Sales", icon: <Users className="w-4 h-4" />, count: 0 }
];

const integrations: Integration[] = [
  {
    id: "shopify",
    name: "Shopify",
    description: "Sync product catalogs, inventory, and order data in real-time with advanced AI insights.",
    icon: <ShoppingBag className="w-6 h-6" />,
    color: "from-green-500 to-green-600",
    features: ["Real-time sync", "Inventory tracking", "Order management", "Customer insights"],
    category: "E-commerce",
    popular: true,
    status: "live",
    rating: 4.9,
    users: "10k+"
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Automate customer conversations with AI-powered responses and media sharing.",
    icon: <MessageCircle className="w-6 h-6" />,
    color: "from-green-400 to-green-500",
    features: ["AI auto-reply", "Media sharing", "Group messaging", "Broadcasting"],
    category: "Communication",
    popular: true,
    status: "live",
    rating: 4.8,
    users: "5k+"
  },
  {
    id: "website",
    name: "Website Chatbot",
    description: "Deploy intelligent chatbots on any website with one line of code.",
    icon: <Globe className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
    features: ["24/7 availability", "Lead capture", "Custom branding", "Analytics"],
    category: "Communication",
    status: "live",
    rating: 4.7,
    users: "15k+"
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get alerts and share insights directly in your team channels with workflow automation.",
    icon: <MessageCircle className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    features: ["Smart notifications", "Query bot", "Team updates", "Workflow automation"],
    category: "Productivity",
    status: "live",
    rating: 4.5,
    users: "12k+"
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect with Salesforce CRM for unified customer data and sales insights.",
    icon: <Database className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-600",
    features: ["Contact sync", "Deal tracking", "Activity logging", "Custom fields"],
    category: "Sales",
    status: "coming-soon",
    rating: 0,
    users: "0"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Advanced CRM integration with marketing automation and lead scoring.",
    icon: <Users className="w-6 h-6" />,
    color: "from-orange-400 to-orange-600",
    features: ["Lead scoring", "Marketing automation", "Contact management", "Deal tracking"],
    category: "Sales",
    status: "coming-soon",
    rating: 0,
    users: "0"
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect 5000+ apps and automate workflows without coding.",
    icon: <Zap className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    features: ["5000+ apps", "No-code automation", "Custom triggers", "Multi-step workflows"],
    category: "Productivity",
    status: "coming-soon",
    rating: 0,
    users: "0"
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync your knowledge base and documents for intelligent search and insights.",
    icon: <FileText className="w-6 h-6" />,
    color: "from-gray-600 to-gray-800",
    features: ["Knowledge sync", "Smart search", "Team collaboration", "Version history"],
    category: "Sales",
    status: "coming-soon",
    rating: 0,
    users: "0"
  }
];

// Filter out coming soon integrations for display
const liveIntegrations = integrations.filter(integration => integration.status === "live");

// Update category counts based on live integrations
const updatedCategories = categories.map(category => {
  if (category.id === "all") {
    return { ...category, count: liveIntegrations.length };
  }
  const categoryMap: { [key: string]: string } = {
    "ecommerce": "E-commerce",
    "communication": "Communication", 
    "productivity": "Productivity",
    "sales": "Sales"
  };
  const targetCategory = categoryMap[category.id];
  const count = liveIntegrations.filter(i => i.category === targetCategory).length;
  return { ...category, count };
});

export default function IntegrationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filteredIntegrations = selectedCategory === "all" 
    ? liveIntegrations 
    : liveIntegrations.filter(integration => {
        if (selectedCategory === "ecommerce") return integration.category === "E-commerce";
        if (selectedCategory === "communication") return integration.category === "Communication";
        if (selectedCategory === "productivity") return integration.category === "Productivity";
        if (selectedCategory === "sales") return integration.category === "Sales";
        return false;
      });


  // Removed animation logic for now to fix rendering issue
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           entry.target.classList.add('animate-in');
  //         }
  //       });
  //     },
  //     { threshold: 0.1 }
  //   );

  //   const elements = sectionRef.current?.querySelectorAll('.integrate-animate');
  //   elements?.forEach((el) => observer.observe(el));

  //   return () => observer.disconnect();
  // }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0"><CheckCircle className="w-3 h-3 mr-1" />Live</Badge>;
      case 'beta':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-0"><Zap className="w-3 h-3 mr-1" />Beta</Badge>;
      case 'coming-soon':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0"><Clock className="w-3 h-3 mr-1" />Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden" id="integrations">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/30 dark:to-purple-950/30 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced section header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-4 sm:mb-6 px-3 py-2 sm:px-4 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-900 dark:from-purple-900/30 dark:to-blue-900/30 dark:text-purple-300 border-0 text-xs sm:text-sm font-medium">
            <Link2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Powerful Integrations
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              Connect Your Entire
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Sales Ecosystem
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            Seamlessly integrate with 50+ tools. No complex setup, no coding required. 
            <span className="font-semibold text-gray-900 dark:text-white"> Get started in minutes.</span>
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {updatedCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 sm:px-4 h-auto transition-all duration-200 text-xs sm:text-sm ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                  : "hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                {category.icon}
                <span className="font-medium">{category.name}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-1.5 py-0.5 ${
                    selectedCategory === category.id
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {category.count}
                </Badge>
              </div>
            </Button>
          ))}
        </div>


        {/* Enhanced integration grid */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {filteredIntegrations.length > 0 ? (
            filteredIntegrations.map((integration, index) => (
            <Card
              key={integration.id}
              className="hover:shadow-2xl hover:scale-105 group relative overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full transition-all duration-300"
              onMouseEnter={() => setHoveredCard(integration.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Popular badge */}
              {integration.popular && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 z-10 shadow-lg">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}

              {/* Status badge */}
              {/* {integration.status && (
                <div className="absolute top-4 left-4 z-10">
                  {getStatusBadge(integration.status)}
                </div>
              )} */}

              <div className="p-4 sm:p-5 flex flex-col h-full">
                {/* Icon with enhanced styling */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center text-white mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  {integration.icon}
                </div>

                {/* Content */}
                <div className="flex-1 mb-3 sm:mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {integration.name}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="mb-2 sm:mb-3 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {integration.category}
                  </Badge>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                    {integration.description}
                  </p>

                  {/* Stats */}
                  {integration.rating && integration.rating > 0 && (
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold text-gray-900 dark:text-white">{integration.rating}</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {integration.users} users
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="space-y-1 sm:space-y-1.5">
                    {integration.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                        <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500 flex-shrink-0" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="group/btn w-full justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 mt-auto text-xs sm:text-sm"
                >
                  <span className="font-medium">
                    {integration.status === 'coming-soon' ? 'Notify me' : 'Learn more'}
                  </span>
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
              </div>

              {/* Enhanced hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${integration.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
            </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
                <p>No integrations available for the selected category.</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced API section */}
        <div>
          <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white p-4 sm:p-6 md:p-8 lg:p-12 border-0 shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
              <div className="space-y-4 sm:space-y-6">
                <Badge className="bg-white/20 text-white border-0 px-3 py-2 sm:px-4 text-xs sm:text-sm">
                  <Code2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Developer API
                </Badge>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                  Build Custom Integrations
                </h3>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                  Use our RESTful API and webhooks to create custom integrations with any platform. 
                  Complete documentation, SDKs, and sandbox environment included.
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-2 py-1 sm:px-3 text-xs">
                    REST API
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-2 py-1 sm:px-3 text-xs">
                    Webhooks
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-2 py-1 sm:px-3 text-xs">
                    OAuth 2.0
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-2 py-1 sm:px-3 text-xs">
                    Rate limiting
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-2 py-1 sm:px-3 text-xs">
                    SDKs
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm">
                    <ExternalLink className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                    View API Docs
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm">
                    <Play className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                    Try Sandbox
                  </Button>
                </div>
              </div>

              {/* Enhanced code snippet */}
              <div className="bg-gray-950 rounded-lg sm:rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-x-auto border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 ml-2">api-example.js</span>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500">{/* Quick Start Example */}</div>
                  <div>
                    <span className="text-blue-400">const</span>
                    <span className="text-white"> response = </span>
                    <span className="text-blue-400">await</span>
                    <span className="text-white"> fetch(</span>
                    <span className="text-green-400">'https://api.saleshq.ai/v1/query'</span>
                    <span className="text-white">, {`{`}</span>
                  </div>
                  <div className="text-white ml-4">
                    <span className="text-blue-400">method</span>
                    <span className="text-white">: </span>
                    <span className="text-green-400">'POST'</span>
                    <span className="text-white">,</span>
                  </div>
                  <div className="text-white ml-4">
                    <span className="text-blue-400">headers</span>
                    <span className="text-white">: {`{`}</span>
                  </div>
                  <div className="text-white ml-8">
                    <span className="text-green-400">'Authorization'</span>
                    <span className="text-white">: </span>
                    <span className="text-green-400">'Bearer YOUR_API_KEY'</span>
                    <span className="text-white">,</span>
                  </div>
                  <div className="text-white ml-8">
                    <span className="text-green-400">'Content-Type'</span>
                    <span className="text-white">: </span>
                    <span className="text-green-400">'application/json'</span>
                  </div>
                  <div className="text-white ml-4">{`}`},</div>
                  <div className="text-white ml-4">
                    <span className="text-blue-400">body</span>
                    <span className="text-white">: </span>
                    <span className="text-blue-400">JSON</span>
                    <span className="text-white">.stringify({`{`}</span>
                  </div>
                  <div className="text-white ml-8">
                    <span className="text-green-400">query</span>
                    <span className="text-white">: </span>
                    <span className="text-green-400">"What are the product specs?"</span>
                  </div>
                  <div className="text-white ml-4">{`}`})</div>
                  <div className="text-white">{`}`});</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced bottom CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
              Don't see your tool?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
              We're adding new integrations every week. Request your favorite tool and we'll prioritize it for development.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base"
                onClick={() => router.push('/contact')}
              >
                <Plus className="mr-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                Request Integration
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base"
                onClick={() => router.push('/contact')}
              >
                <Mail className="mr-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}