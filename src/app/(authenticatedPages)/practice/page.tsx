'use client';
import ModuleList from '@/components/modules/ModuleList';
import UserQuizHistory from '@/components/modules/UserQuizHistory';
import Leaderboard from '@/components/modules/Leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, BarChart3, Trophy, ArrowRight, Settings, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PracticeWelcome from '@/components/practice/atoms/PracticeWelcome';
import CompactLeaderboard from '@/components/practice/atoms/CompactLeaderboard';
import CompactQuizHistory from '@/components/practice/atoms/CompactQuizHistory';
import CompactModuleList from '@/components/practice/atoms/CompactModuleList';
import HeaderAdminToggle from '@/components/practice/atoms/HeaderAdminToggle';
import { useAdminAccess } from '@/hooks/useAdminAccess';

export default function PracticePage() {
  const router = useRouter();
  const { isAdmin } = useAdminAccess();

  const handleAdminClick = () => {
    router.push('/modules/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Practice Center</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Sharpen your skills, take quizzes, and climb the leaderboard.
              </p>
            </div>

            {/* Admin Controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <HeaderAdminToggle />
              {isAdmin && (
                <Button
                  onClick={handleAdminClick}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                  <span className="sm:hidden">Admin</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <PracticeWelcome />
            <Card className="h-[520px] flex flex-col">
              <CardHeader className="pb-4 flex-shrink-0">
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
              <CardContent className="pt-0 flex-1 overflow-hidden">
                <CompactModuleList />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="h-auto flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="flex items-center text-base">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1 overflow-hidden">
                <CompactLeaderboard />
              </CardContent>
            </Card>
            <Card className="h-auto flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="flex items-center text-base">
                  <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Recent Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1 overflow-hidden">
                <CompactQuizHistory />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}