'use client'
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ArrowUpRight
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
}

const integrations: Integration[] = [
  {
    id: "shopify",
    name: "Shopify",
    description: "Sync product catalogs, inventory, and order data in real-time.",
    icon: <ShoppingBag className="w-8 h-8" />,
    color: "from-green-500 to-green-600",
    features: ["Product sync", "Inventory tracking", "Order management", "Customer data"],
    category: "E-commerce",
    popular: true
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Automate customer conversations with AI-powered responses.",
    icon: <MessageCircle className="w-8 h-8" />,
    color: "from-green-400 to-green-500",
    features: ["Auto-reply", "Media sharing", "Group messaging", "Broadcasting"],
    category: "Communication",
    popular: true
  },
  {
    id: "website",
    name: "Website Chatbot",
    description: "Deploy intelligent chatbots on any website with one line of code.",
    icon: <Globe className="w-8 h-8" />,
    color: "from-blue-500 to-blue-600",
    features: ["24/7 availability", "Lead capture", "Custom branding", "Analytics"],
    category: "Customer Support"
  },
  {
    id: "gdrive",
    name: "Google Drive",
    description: "Import documents, spreadsheets, and presentations automatically.",
    icon: <Cloud className="w-8 h-8" />,
    color: "from-yellow-500 to-orange-500",
    features: ["Auto-sync", "Version control", "Team folders", "OCR support"],
    category: "Storage"
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get alerts and share insights directly in your team channels.",
    icon: <MessageCircle className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
    features: ["Notifications", "Query bot", "Team updates", "Workflow automation"],
    category: "Collaboration"
  },
  {
    id: "crm",
    name: "CRM Systems",
    description: "Connect with Salesforce, HubSpot, Pipedrive, and more.",
    icon: <Database className="w-8 h-8" />,
    color: "from-indigo-500 to-purple-600",
    features: ["Contact sync", "Deal tracking", "Activity logging", "Custom fields"],
    category: "Sales"
  }
];

export default function IntegrationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll('.integrate-animate');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-950/30 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 dark:bg-purple-950/30 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 integrate-animate opacity-0 translate-y-4 transition-all duration-700">
          <Badge className="mb-4 px-3 py-1 bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300 border-0">
            <Link2 className="w-3 h-3 mr-1" />
            Integrations
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Connect Your Entire
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sales Stack
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Seamlessly integrate with your favorite tools. No complex setup, no coding required.
          </p>
        </div>

        {/* Integration grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {integrations.map((integration, index) => (
            <Card
              key={integration.id}
              className="integrate-animate opacity-0 translate-y-4 transition-all duration-700 hover:shadow-2xl hover:scale-105 group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {integration.popular && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 z-10">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}

              <div className="p-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${integration.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {integration.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {integration.name}
                </h3>
                <Badge variant="secondary" className="mb-3 text-xs">
                  {integration.category}
                </Badge>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {integration.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {integration.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="group/btn w-full justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span>Learn more</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
              </div>

              {/* Hover effect gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${integration.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
            </Card>
          ))}
        </div>

        {/* API section */}
        <div className="integrate-animate opacity-0 translate-y-4 transition-all duration-700 delay-500">
          <Card className="bg-gradient-to-r from-gray-900 to-gray-950 dark:from-gray-800 dark:to-gray-900 text-white p-8 border-0">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 bg-white/20 text-white border-0">
                  <Database className="w-3 h-3 mr-1" />
                  Developer API
                </Badge>
                <h3 className="text-2xl font-bold mb-4">
                  Build Custom Integrations
                </h3>
                <p className="text-gray-300 mb-6">
                  Use our RESTful API and webhooks to create custom integrations with any platform. 
                  Complete documentation, SDKs, and sandbox environment included.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    REST API
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    Webhooks
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    OAuth 2.0
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    Rate limiting
                  </Badge>
                </div>
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  View API Docs
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Code snippet */}
              <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-gray-500 mb-2"># Quick Start</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-blue-400">curl</span>
                    <span className="text-gray-300"> -X POST </span>
                    <span className="text-green-400">https://api.SalesHQ.ai/v1/query</span>
                  </div>
                  <div className="text-gray-300">
                    <span className="ml-4">-H </span>
                    <span className="text-yellow-400">"Authorization: Bearer YOUR_API_KEY"</span>
                  </div>
                  <div className="text-gray-300">
                    <span className="ml-4">-H </span>
                    <span className="text-yellow-400">"Content-Type: application/json"</span>
                  </div>
                  <div className="text-gray-300">
                    <span className="ml-4">-d </span>
                    <span className="text-yellow-400">'`${JSON.stringify({"query": "What are the product specs?"})}`'</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 integrate-animate opacity-0 translate-y-4 transition-all duration-700 delay-600">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Don't see your tool? We're adding new integrations every week.
          </p>
          <Button variant="outline" size="lg">
            Request Integration
            <Mail className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}