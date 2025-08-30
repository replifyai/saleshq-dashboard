'use client'
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Check, 
  X, 
  Sparkles,
  Zap,
  Shield,
  Crown,
  ArrowRight,
  Info,
  TrendingUp
} from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: {
    text: string;
    included: boolean;
    tooltip?: string;
  }[];
  highlights: string[];
  cta: string;
  popular?: boolean;
  enterprise?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small teams getting started",
    monthlyPrice: 49,
    yearlyPrice: 39,
    currency: "USD",
    features: [
      { text: "Up to 5 team members", included: true },
      { text: "1,000 AI queries/month", included: true },
      { text: "Basic integrations", included: true },
      { text: "Email support", included: true },
      { text: "Knowledge base (up to 100 docs)", included: true },
      { text: "Basic analytics", included: true },
      { text: "WhatsApp Business API", included: false },
      { text: "Custom integrations", included: false },
      { text: "Priority support", included: false },
      { text: "Advanced analytics", included: false }
    ],
    highlights: ["14-day free trial", "No setup fees"],
    cta: "Start Free Trial"
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing teams that need more power",
    monthlyPrice: 149,
    yearlyPrice: 119,
    currency: "USD",
    features: [
      { text: "Up to 25 team members", included: true },
      { text: "10,000 AI queries/month", included: true },
      { text: "All integrations", included: true },
      { text: "Priority email & chat support", included: true },
      { text: "Unlimited knowledge base", included: true },
      { text: "Advanced analytics & reporting", included: true },
      { text: "WhatsApp Business API", included: true },
      { text: "API access", included: true },
      { text: "Custom branding", included: true },
      { text: "Team training session", included: false }
    ],
    highlights: ["Most popular", "Best value"],
    cta: "Start Free Trial",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Tailored solutions for large organizations",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "Custom",
    features: [
      { text: "Unlimited team members", included: true },
      { text: "Unlimited AI queries", included: true },
      { text: "Custom integrations", included: true },
      { text: "Dedicated success manager", included: true },
      { text: "Unlimited knowledge base", included: true },
      { text: "Custom analytics dashboards", included: true },
      { text: "WhatsApp Business API", included: true },
      { text: "Advanced API access", included: true },
      { text: "White-label options", included: true },
      { text: "SLA guarantee", included: true }
    ],
    highlights: ["Custom pricing", "Dedicated support"],
    cta: "Contact Sales",
    enterprise: true
  }
];

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const calculateSavings = (monthly: number, yearly: number) => {
    const yearlySavings = (monthly * 12) - (yearly * 12);
    const percentSavings = Math.round((yearlySavings / (monthly * 12)) * 100);
    return { amount: yearlySavings, percent: percentSavings };
  };

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-purple-100 dark:bg-purple-950/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-950/20 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300 border-0">
            <TrendingUp className="w-3 h-3 mr-1" />
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Simple, Transparent
            </span>
            {" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your team. All plans include a 14-day free trial.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const isHovered = hoveredPlan === plan.id;
            const savings = plan.monthlyPrice > 0 
              ? calculateSavings(plan.monthlyPrice, plan.yearlyPrice)
              : null;

            return (
              <Card
                key={plan.id}
                className={`relative p-8 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-2 border-blue-500 dark:border-blue-400 shadow-2xl scale-105 md:scale-110' 
                    : 'hover:shadow-xl'
                } ${isHovered ? 'transform hover:scale-105' : ''}`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    {plan.enterprise ? (
                      <Crown className="w-6 h-6 text-yellow-500" />
                    ) : plan.popular ? (
                      <Zap className="w-6 h-6 text-blue-500" />
                    ) : (
                      <Shield className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  {plan.enterprise ? (
                    <div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        Custom Pricing
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Tailored to your needs
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          /month
                        </span>
                      </div>
                      {billingPeriod === 'yearly' && savings && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Save ${savings.amount}/year ({savings.percent}% off)
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {plan.highlights.map((highlight, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary"
                      className="text-xs bg-gray-100 dark:bg-gray-800"
                    >
                      {highlight}
                    </Badge>
                  ))}
                </div>

                {/* CTA button */}
                <Button 
                  className={`w-full mb-6 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                      : plan.enterprise 
                      ? 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900'
                      : ''
                  }`}
                  size="lg"
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                {/* Features list */}
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mt-0.5" />
                      )}
                      <span className={`text-sm ${
                        feature.included 
                          ? 'text-gray-700 dark:text-gray-200' 
                          : 'text-gray-400 dark:text-gray-500 line-through'
                      }`}>
                        {feature.text}
                      </span>
                      {feature.tooltip && (
                        <Info className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* FAQ or additional info */}
        <div className="text-center">
          <Card className="inline-block p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-6">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white">
                  30-Day Money Back Guarantee
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Not satisfied? Get a full refund, no questions asked.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}