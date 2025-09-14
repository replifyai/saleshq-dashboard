'use client'
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  faqs: {
    question: string;
    answer: string;
  }[];
}

const faqCategories: FAQCategory[] = [
  {
    id: "general",
    name: "General",
    icon: <HelpCircle className="w-4 h-4" />,
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
    icon: <MessageCircle className="w-4 h-4" />,
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
    icon: <HelpCircle className="w-4 h-4" />,
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
    icon: <HelpCircle className="w-4 h-4" />,
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

  const filteredFAQs = faqCategories
    .find(cat => cat.id === selectedCategory)
    ?.faqs.filter(faq => 
      searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 border-0">
            <HelpCircle className="w-3 h-3 mr-1" />
            FAQ
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Frequently Asked
            </span>
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about SalesHQ. Can't find what you're looking for? Chat with our team.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search questions..."
                className="pl-10 pr-4 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {faqCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-12">
          <Card className="p-6">
            <Accordion type="single" collapsible className="space-y-2">
              {filteredFAQs?.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-0">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFAQs?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No questions found. Try a different search term or category.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Contact support */}
        <div className="text-center">
          <Card className="inline-block p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-4">
              <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Still have questions?
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Our team is here to help you get started.
                </p>
                <Button size="sm" className="gap-2">
                  Chat with Support
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}