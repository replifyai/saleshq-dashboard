'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, User } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { moduleApi } from '@/lib/moduleApi';

interface UserStats {
  modulesCompleted: number;
  averageScore: number;
  totalQuizzes: number;
}

export default function PracticeWelcome() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setStatsLoading(true);
        const quizHistory = await moduleApi.getUserQuizResponses();
        const quizzes = quizHistory.data || [];
        
        const totalQuizzes = quizzes.length;
        const averageScore = totalQuizzes > 0 
          ? quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes 
          : 0;
        
        // Count unique modules (simplified - could be improved with actual module completion data)
        const uniqueModules = new Set(quizzes.map(quiz => quiz.title)).size;
        
        setStats({
          modulesCompleted: uniqueModules,
          averageScore: Math.round(averageScore),
          totalQuizzes
        });
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
        setStats({
          modulesCompleted: 0,
          averageScore: 0,
          totalQuizzes: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchUserStats();
    }
  }, [user, authLoading]);

  if (authLoading || statsLoading) {
    return (
      <Card className="bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-white/20" />
          <Skeleton className="h-4 w-64 bg-white/10" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <Skeleton className="h-8 w-12 bg-white/20 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 bg-white/10" />
            </div>
            <div className="text-center">
              <Skeleton className="h-8 w-16 bg-white/20 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 bg-white/10" />
            </div>
          </div>
          <Skeleton className="h-10 w-full bg-white/20" />
        </CardContent>
      </Card>
    );
  }

  const userName = user?.name || 'User';
  const { modulesCompleted = 0, averageScore = 0, totalQuizzes = 0 } = stats || {};

  return (
    <Card className="bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Welcome back, {userName}!
        </CardTitle>
        <CardDescription className="text-purple-100">
          {totalQuizzes > 0 
            ? `You've completed ${totalQuizzes} quiz${totalQuizzes === 1 ? '' : 'zes'}. Keep up the great work!`
            : "Ready to start your learning journey?"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{modulesCompleted}</p>
            <p className="text-xs text-purple-200">Modules</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{averageScore}%</p>
            <p className="text-xs text-purple-200">Avg Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{totalQuizzes}</p>
            <p className="text-xs text-purple-200">Quizzes</p>
          </div>
        </div>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => router.push('/practice/modules')}
        >
          {totalQuizzes > 0 ? 'Continue Learning' : 'Start Learning'} 
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}