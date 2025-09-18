"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, TrendingUp, Users, Target, Calendar, Clock } from "lucide-react";
import { CaseStudyContent } from "./CaseStudyContent";
import { CaseStudy } from "./caseStudyData";

interface CaseStudyDetailProps {
  caseStudy: CaseStudy;
}

export function CaseStudyDetail({ caseStudy }: CaseStudyDetailProps) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Case Studies
          </Button>
        </div>

        {/* Case Study Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Case Study
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {caseStudy.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {caseStudy.subtitle}
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {caseStudy.keyMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {caseStudy.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Case Study Content */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <CaseStudyContent content={caseStudy.content} />
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your Sales Enablement?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Discover how AI-powered sales enablement can drive similar results for your organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Started Today
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  onClick={() => window.open('https://calendly.com/saleshqai/30min', '_blank')}
                >
                  Schedule a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}