"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Users, Target, ArrowRight, Calendar, Clock, ExternalLink, Star, Award, Zap } from "lucide-react";
import { CaseStudyContent } from "@/components/case-studies/CaseStudyContent";
import { caseStudyData } from "@/components/case-studies/caseStudyData";

export function CaseStudiesSection() {
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
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <Button
                variant="ghost"
                onClick={() => setSelectedCaseStudy(null)}
                className="mb-3 sm:mb-4 lg:mb-6 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm lg:text-base"
              >
                ← Back to Case Studies
              </Button>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
                <div className="p-1.5 sm:p-2 lg:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md sm:rounded-lg lg:rounded-xl">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 dark:text-white">
                    {study.title}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
                    {study.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 lg:mb-8">
                {study.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <CaseStudyContent content={study.content} />
          </div>
        </section>
      );
    }
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {/* <div className="text-center mb-16">
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 text-sm font-medium">
            <BookOpen className="w-4 h-4 mr-2" />
            Success Stories
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Real Results from
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Real Companies
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Discover how leading organizations are transforming their sales operations with AI-powered enablement solutions. 
            See the measurable impact and learn from their success stories.
          </p>
        </div> */}

        {/* Case Studies Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {caseStudyData.map((study, index) => (
            <Card 
              key={study.id} 
              className="group relative overflow-hidden bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
              onClick={() => handleCaseStudySelect(study.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Case Study #{index + 1}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {study.title}
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {study.subtitle}
                    </p>
                  </div>
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="h-6 w-6 text-blue-600 dark:text-blue-400 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative pt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {study.keyMetrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="group/metric relative p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-300">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                          {metric.value}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                          {metric.label}
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover/metric:opacity-100 transition-opacity">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {study.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors">
                        {tag}
                      </Badge>
                    ))}
                    {study.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs px-3 py-1">
                        +{study.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadFullCaseStudy(study.id);
                      }}
                      className="w-full group/btn border-blue-200 text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300"
                    >
                      Read Full Case Study
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Enhanced Stats Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 lg:p-8 xl:p-12">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <div className="flex justify-center mb-3 sm:mb-4 lg:mb-6">
              <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg sm:rounded-xl lg:rounded-2xl">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 lg:mb-4">
              Industry-Leading Results
            </h3>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto px-4">
              Our clients consistently achieve remarkable improvements across all key performance indicators
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
            <div className="group text-center p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700/50 hover:shadow-lg transition-all duration-300">
              <div className="p-2 sm:p-3 lg:p-4 bg-emerald-500/10 rounded-full w-fit mx-auto mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-emerald-600 mb-1 sm:mb-2">83%</div>
              <div className="text-xs sm:text-sm lg:text-base xl:text-lg font-semibold text-slate-900 dark:text-white mb-1">Higher Revenue Growth</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Average increase in sales revenue</div>
            </div>
            
            <div className="group text-center p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300">
              <div className="p-2 sm:p-3 lg:p-4 bg-blue-500/10 rounded-full w-fit mx-auto mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">25%</div>
              <div className="text-xs sm:text-sm lg:text-base xl:text-lg font-semibold text-slate-900 dark:text-white mb-1">Productivity Increase</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Team efficiency improvement</div>
            </div>
            
            <div className="group text-center p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300">
              <div className="p-2 sm:p-3 lg:p-4 bg-purple-500/10 rounded-full w-fit mx-auto mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-600" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-purple-600 mb-1 sm:mb-2">30%</div>
              <div className="text-xs sm:text-sm lg:text-base xl:text-lg font-semibold text-slate-900 dark:text-white mb-1">Deal Closure Improvement</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Faster deal completion rate</div>
            </div>
            
            <div className="group text-center p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700/50 hover:shadow-lg transition-all duration-300">
              <div className="p-2 sm:p-3 lg:p-4 bg-orange-500/10 rounded-full w-fit mx-auto mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-orange-600" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-orange-600 mb-1 sm:mb-2">40%</div>
              <div className="text-xs sm:text-sm lg:text-base xl:text-lg font-semibold text-slate-900 dark:text-white mb-1">Faster Ramp-up Time</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">New rep onboarding speed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}