'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Users, 
  Lightbulb, 
  Rocket, 
  Shield, 
  Zap, 
  BarChart3, 
  MessageSquare,
  Brain,
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Heart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Quick Response",
      description: "We deliver fast implementation and rapid results to meet your urgent business needs."
    },
    {
      icon: <Target className="w-8 h-8 text-yellow-600" />,
      title: "Flexible Solutions",
      description: "Our approach adapts to your unique requirements, ensuring tailored solutions that work."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Real Value",
      description: "We focus on delivering measurable results that directly impact your sales and LMS success."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Adaptive Approach",
      description: "We continuously evolve our solutions to match your changing business needs and goals."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "SalesHQ Founded",
      description: "Started with a mission to deliver quick, flexible, and adaptive sales solutions."
    },
    {
      year: "2024",
      title: "First Tailored Solutions",
      description: "Successfully delivered customized LMS and sales tools to our first clients."
    },
    {
      year: "2024",
      title: "Value-Focused Platform",
      description: "Built comprehensive platform focused on real value delivery and measurable results."
    },
    {
      year: "2025",
      title: "Future Growth",
      description: "Expanding our adaptive approach to serve more clients with tailored solutions."
    }
  ];

  const teamStats = [
    { number: "Quick", label: "Implementation" },
    { number: "Flexible", label: "Solutions" },
    { number: "Adaptive", label: "Approach" },
    { number: "Real", label: "Value Delivery" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pb-8 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-sm">
              About SalesHQ
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Quick, Flexible & Adaptive
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Sales Solutions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We deliver real value through tailored solutions that increase sales performance and 
              enhance learning management. Quick to adapt, flexible in approach, and focused on your success.
            </p>
          </div>
        </div>
      </section>

      {/* What is SalesHQ Section */}
      <section className="pt-0 py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What is SalesHQ?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                SalesHQ is your agile partner in sales success. We specialize in creating tailored solutions 
                that adapt to your unique business needs. Our quick implementation, flexible approach, and 
                adaptive technology help you increase sales performance while building a robust learning management system.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Quick Implementation</h3>
                    <p className="text-muted-foreground">Get up and running fast with our streamlined setup process and rapid deployment.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Flexible Solutions</h3>
                    <p className="text-muted-foreground">Tailored LMS and sales tools that adapt to your specific business requirements and workflows.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Real Value Delivery</h3>
                    <p className="text-muted-foreground">Measurable results that directly impact your sales performance and team learning outcomes.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Quick Setup</h3>
                <p className="text-sm text-muted-foreground">Fast implementation and deployment</p>
              </Card>
              <Card className="p-6 text-center">
                <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Tailored Solutions</h3>
                <p className="text-sm text-muted-foreground">Customized for your business needs</p>
              </Card>
              <Card className="p-6 text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">LMS Focus</h3>
                <p className="text-sm text-muted-foreground">Comprehensive learning management</p>
              </Card>
              <Card className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Sales Growth</h3>
                <p className="text-sm text-muted-foreground">Proven results and value delivery</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Started Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Did We Start SalesHQ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our journey began with a clear mission: to be quick, flexible, and adaptive in delivering 
              real value through tailored solutions that increase sales and enhance learning management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">The Challenge</h3>
              <p className="text-muted-foreground">
                Businesses needed solutions that could quickly adapt to their unique needs, 
                deliver real value, and provide flexible learning management systems.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Approach</h3>
              <p className="text-muted-foreground">
                We believe in being quick to respond, flexible in our methods, and adaptive 
                to deliver tailored solutions that provide real value to our clients.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">The Result</h3>
              <p className="text-muted-foreground">
                SalesHQ delivers tailored solutions that increase sales performance 
                and provide comprehensive LMS capabilities with measurable results.
              </p>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
            <div className="text-center">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
                To be quick, flexible, and adaptive in delivering real value to our clients through 
                tailored solutions that increase their sales performance and enhance their learning 
                management capabilities. We believe in results that matter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where We're Headed Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          {/* <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Where Are We Headed?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our vision extends far beyond today's capabilities. We're building the future of sales enablement.
            </p>
          </div> */}

          {/* <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-6">Our Roadmap</h3>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-semibold text-blue-600">{milestone.year}</span>
                        <Badge variant="outline">Milestone</Badge>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{milestone.title}</h4>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Future Innovations</h3>
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-start space-x-3">
                    <Globe className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Global Expansion</h4>
                      <p className="text-sm text-muted-foreground">Bringing SalesHQ to sales teams worldwide with multi-language support and regional customization.</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start space-x-3">
                    <Brain className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Advanced AI Capabilities</h4>
                      <p className="text-sm text-muted-foreground">Next-generation AI with predictive analytics, automated coaching, and personalized learning paths.</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Enterprise Integration</h4>
                      <p className="text-sm text-muted-foreground">Seamless integration with enterprise systems, CRM platforms, and business intelligence tools.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div> */}

          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">Our Values</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="p-6 text-center">
                  {value.icon}
                  <h4 className="font-semibold mt-4 mb-2">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Quick, Flexible & Adaptive Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We specialize in delivering tailored solutions that provide real value, 
              helping you increase sales and enhance your learning management capabilities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {teamStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Card className="p-8 md:p-12 max-w-4xl mx-auto">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Ready for Real Value?</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Let us show you how our quick, flexible, and adaptive approach can deliver tailored solutions 
                that increase your sales performance and enhance your learning management capabilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Get in Touch
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="https://calendly.com/saleshqai/30min">
                    Book a Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}