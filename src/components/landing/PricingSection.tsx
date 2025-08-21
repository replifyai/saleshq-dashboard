import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 relative">
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Starter
                </CardTitle>
                <Badge variant="outline" className="border-gray-300 dark:border-gray-600">
                  Free
                </Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                $0
                <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Perfect for trying out Replify</p>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Up to 10 documents</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Basic AI chat interface</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">100 queries per month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Email support</span>
                </li>
              </ul>
              <Link href="/login">
                <Button className="w-full" variant="outline">
                  Start Free Trial
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Professional
                </CardTitle>
                <Badge variant="outline" className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400">
                  Popular
                </Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                $49
                <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">For growing sales teams</p>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Up to 500 documents</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Advanced AI chat with learning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Unlimited queries</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Closed feedback loop training</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">WhatsApp integration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Website chatbot</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Priority support</span>
                </li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 relative">
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Enterprise
                </CardTitle>
                <Badge variant="outline" className="border-gray-300 dark:border-gray-600">
                  Custom
                </Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                Custom
                <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">For large sales organizations</p>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Unlimited documents</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Advanced feedback loops</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Multi-channel integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Shopify & CRM integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">White-label options</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Dedicated support & SLA</span>
                </li>
              </ul>
              <a href="#contact">
                <Button className="w-full" variant="outline">
                  Contact Sales Team
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Pricing FAQ */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Is there a setup fee?</h4>
              <p className="text-gray-600 dark:text-gray-300">No setup fees, no hidden costs. Pay only for what you use.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600 dark:text-gray-300">Yes, cancel anytime with no penalties or long-term contracts.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Do you offer discounts for annual plans?</h4>
              <p className="text-gray-600 dark:text-gray-300">Yes, save 20% when you pay annually. Contact us for details.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What's included in the free trial?</h4>
              <p className="text-gray-600 dark:text-gray-300">Full access to Professional features for 14 days, no credit card required.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 