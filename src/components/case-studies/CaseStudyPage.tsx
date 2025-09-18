"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Users, Target, ArrowRight, Calendar, Clock } from "lucide-react";
import { CaseStudyContent } from "./CaseStudyContent";
import { caseStudyData } from "./caseStudyData";

export function CaseStudyPage() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(null);
  const router = useRouter();

  const handleCaseStudySelect = (id: string) => {
    setSelectedCaseStudy(selectedCaseStudy === id ? null : id);
  };

  const handleReadFullCaseStudy = (id: string) => {
    router.push(`/case-studies/${id}`);
  };

  if (selectedCaseStudy) {
    const study = caseStudyData.find(s => s.id === selectedCaseStudy);
    if (study) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setSelectedCaseStudy(null)}
                className="mb-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← Back to Case Studies
              </Button>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {study.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {study.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {study.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <CaseStudyContent content={study.content} />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Powered Sales Enablement Case Studies
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover how organizations are transforming their sales operations with AI-powered enablement solutions. 
            Learn from real-world implementations and measurable results.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudyData.map((study) => (
            <Card 
              key={study.id} 
              className="hover:shadow-lg transition-shadow duration-300 cursor-pointer border-0 shadow-md"
              onClick={() => handleCaseStudySelect(study.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {study.title}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {study.subtitle}
                    </p>
                  </div>
                  <div className="ml-4">
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    {study.keyMetrics.map((metric, index) => (
                      <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {metric.value}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {study.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {study.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{study.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Read More Button */}
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleReadFullCaseStudy(study.id)}
                      className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                    >
                      Read Full Case Study
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Industry Impact at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">83%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Higher Revenue Growth</div>
            </div>
            <div className="text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">25%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Productivity Increase</div>
            </div>
            <div className="text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-3">
                <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">30%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Deal Closure Improvement</div>
            </div>
            <div className="text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full w-fit mx-auto mb-3">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">40%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Faster Ramp-up Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}