'use client'
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HelpCircle,
  MessageCircle,
  Search,
  ChevronRight,
  Zap,
  Shield,
  CreditCard,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

const faqCategories: FAQCategory[] = [
  {
    id: "general",
    name: "General",
    icon: <HelpCircle className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    faqs: [
      {
        question: "What is SalesHQ and how does it work?",
        answer: "SalesHQ is an AI-powered sales intelligence platform that transcribes calls in real-time, provides instant AI suggestions, and manages your product knowledge base. It works by capturing audio from any source, converting it to text instantly, and using AI to provide contextual responses based on your uploaded knowledge base."
      },
      {
        question: "How quickly can I get started with SalesHQ?",
        answer: "You can be up and running in under 5 minutes! Simply sign up, upload your documents or connect your data sources, and start asking questions. Our AI immediately processes your content and becomes your team's intelligent assistant."
      },
      {
        question: "What makes SalesHQ different from other sales tools?",
        answer: "SalesHQ's self-learning AI continuously improves from every interaction, creating a closed feedback loop that identifies knowledge gaps and enhances responses automatically. Plus, our real-time transcription and instant suggestions work seamlessly across calls, chats, and in-person meetings."
      }
    ]
  },
  {
    id: "features",
    name: "Features",
    icon: <Zap className="w-5 h-5" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    faqs: [
      {
        question: "What integrations does SalesHQ support?",
        answer: "SalesHQ integrates with Shopify, WhatsApp Business API, Google Drive, Slack, and major CRM systems like Salesforce and HubSpot. We also offer a REST API and webhooks for custom integrations, with new integrations added weekly."
      },
      {
        question: "Can I deploy a chatbot on my website?",
        answer: "Yes! You can embed an intelligent chatbot on any website with just one line of code. The chatbot uses your knowledge base to answer customer questions 24/7, with full customization options for branding and behavior."
      },
      {
        question: "How accurate is the transcription feature?",
        answer: "Our transcription achieves 99.9% accuracy using advanced speech recognition technology. It supports 50+ languages, handles multiple speakers with speaker diarization, and works with any audio source including phone calls, video meetings, and in-person conversations."
      }
    ]
  },
  {
    id: "security",
    name: "Security & Privacy",
    icon: <Shield className="w-5 h-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    faqs: [
      {
        question: "Is my data secure with SalesHQ?",
        answer: "Absolutely. We're SOC 2 Type II certified and GDPR compliant. All data is encrypted in transit and at rest using AES-256 encryption. Your content is never used to train shared models, and you maintain complete control over access permissions."
      },
      {
        question: "Where is my data stored?",
        answer: "Data is stored in secure, redundant data centers with 99.99% uptime SLA. You can choose your data region (US, EU, or APAC) to meet compliance requirements. We also offer on-premise deployment options for enterprise clients."
      },
      {
        question: "Can I control who accesses my knowledge base?",
        answer: "Yes, you have granular control over permissions. Set role-based access controls, create team workspaces, manage document-level permissions, and track all access with detailed audit logs."
      }
    ]
  },
  {
    id: "pricing",
    name: "Pricing & Billing",
    icon: <CreditCard className="w-5 h-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    faqs: [
      {
        question: "Do you offer a free trial?",
        answer: "Yes! All plans include a 14-day free trial with full features and no credit card required. You can explore all capabilities and see real results before making any commitment."
      },
      {
        question: "Can I change plans anytime?",
        answer: "Absolutely. You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and we'll prorate any differences. We also offer a 30-day money-back guarantee if you're not satisfied."
      },
      {
        question: "What happens if I exceed my query limit?",
        answer: "We'll notify you when you're approaching your limit. You can either upgrade your plan or purchase additional query packages. Your service never stops – we just notify you about usage to help you choose the best plan."
      }
    ]
  }
];

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const router = useRouter();

  const filteredFAQs = faqCategories
    .find(cat => cat.id === selectedCategory)
    ?.faqs.filter(faq => 
      searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-4 sm:mb-6 px-3 py-2 sm:px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 text-xs sm:text-sm font-medium">
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            FAQ
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Frequently Asked
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
            Everything you need to know about SalesHQ. Can't find what you're looking for? 
            Our team is here to help you succeed.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8 sm:mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="relative mb-6 sm:mb-8">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 text-slate-400" />
              <Input
                type="text"
                placeholder="Search questions or topics..."
                className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-lg border-2 border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {faqCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg`
                      : `border-2 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800`
                  }`}
                >
                  <div className={`p-1 rounded-md sm:rounded-lg ${selectedCategory === category.id ? 'bg-white/20' : category.bgColor}`}>
                    <div className={selectedCategory === category.id ? 'text-white' : category.color}>
                      {category.icon}
                    </div>
                  </div>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <Card className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl sm:rounded-3xl">
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              {filteredFAQs?.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 hover:shadow-md transition-all duration-300"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md sm:rounded-lg mt-1">
                        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="font-semibold text-sm sm:text-lg text-slate-900 dark:text-white pr-6 sm:pr-8">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed pb-4 sm:pb-6 pl-12 sm:pl-16 text-sm sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFAQs?.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="p-3 sm:p-4 bg-slate-100 dark:bg-slate-700 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg">
                  No questions found. Try a different search term or category.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Contact support */}
        <div className="text-center">
          <Card className="inline-block p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl sm:rounded-3xl shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl">
                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Still have questions?
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 text-sm sm:text-lg">
                  Our team is here to help you get started and succeed with SalesHQ.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    size="lg" 
                    className="gap-2 sm:gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg text-sm sm:text-base"
                    onClick={() => router.push('/contact')}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    Chat with Support
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2 sm:gap-3 border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 text-sm sm:text-base"
                    onClick={() => window.open('https://calendly.com/saleshqai/30min', '_blank')}
                  >
                    Schedule Demo
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}