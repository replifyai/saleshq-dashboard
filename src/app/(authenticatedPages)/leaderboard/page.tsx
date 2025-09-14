'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Crown, Medal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Leaderboard from '@/components/modules/Leaderboard';

export default function FullLeaderboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
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
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Full Leaderboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Complete ranking of all participants based on quiz performance
              </p>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">1st Place</p>
                    <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">Gold Champion</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Medal className="w-8 h-8 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">2nd Place</p>
                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">Silver Medal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Medal className="w-8 h-8 text-amber-600" />
                  <div>
                    <p className="text-sm text-amber-800 dark:text-amber-200">3rd Place</p>
                    <p className="text-lg font-bold text-amber-900 dark:text-amber-100">Bronze Medal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Complete Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Leaderboard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}