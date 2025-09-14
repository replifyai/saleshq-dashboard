'use client';
import ModuleList from '@/components/modules/ModuleList';
import UserQuizHistory from '@/components/modules/UserQuizHistory';
import Leaderboard from '@/components/modules/Leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, BarChart3, Trophy, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PracticeWelcome from '@/components/practice/atoms/PracticeWelcome';
import CompactLeaderboard from '@/components/practice/atoms/CompactLeaderboard';
import CompactQuizHistory from '@/components/practice/atoms/CompactQuizHistory';
import CompactModuleList from '@/components/practice/atoms/CompactModuleList';

export default function PracticePage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Practice Center
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Sharpen your skills, take quizzes, and climb the leaderboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <PracticeWelcome />
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span>Available Modules</span>
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/modules')}
                    className="flex items-center gap-2"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CompactModuleList />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CompactLeaderboard />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Recent Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CompactQuizHistory />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Components Section */}
        <div className="mt-12 space-y-8">
          <Card data-leaderboard-full>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                <span>Full Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Leaderboard />
            </CardContent>
          </Card>
          
          <Card data-quiz-history-full>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                <span>Complete Quiz History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserQuizHistory />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}