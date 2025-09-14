'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp, Award, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { moduleApi } from '@/lib/moduleApi';
import UserQuizHistory from '@/components/modules/UserQuizHistory';

interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  totalCorrect: number;
  totalQuestions: number;
}

export default function CompleteQuizHistoryPage() {
  const router = useRouter();
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    totalCorrect: 0,
    totalQuestions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await moduleApi.getUserQuizResponses();
        const quizzes = res.data || [];
        
        if (quizzes.length > 0) {
          const totalQuizzes = quizzes.length;
          const averageScore = quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes;
          const bestScore = Math.max(...quizzes.map(quiz => quiz.score));
          const totalCorrect = quizzes.reduce((sum, quiz) => sum + quiz.correct, 0);
          const totalQuestions = quizzes.reduce((sum, quiz) => sum + (quiz.correct + quiz.wrong + quiz.notAttempted), 0);
          
          setStats({
            totalQuizzes,
            averageScore: Math.round(averageScore),
            bestScore: Math.round(bestScore),
            totalCorrect,
            totalQuestions
          });
        }
      } catch (error) {
        console.error('Failed to fetch quiz stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Complete Quiz History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed view of all your quiz attempts and performance analytics
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalQuizzes}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Quizzes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.averageScore}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Average Score
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.bestScore}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Best Score
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalCorrect}/{stats.totalQuestions}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Correct Answers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Complete Quiz History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              All Quiz Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserQuizHistory />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}