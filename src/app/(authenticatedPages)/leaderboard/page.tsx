'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Trophy, Crown, Medal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { moduleApi, type LeaderboardEntry } from '@/lib/moduleApi';
import Leaderboard from '@/components/modules/Leaderboard';

export default function FullLeaderboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [topThree, setTopThree] = useState<LeaderboardEntry[]>([]);
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await moduleApi.getLeaderboard();
        const entries = res.data?.data || [];
        // Sort entries by rank
        const sortedEntries = entries.slice().sort((a, b) => a.rank - b.rank);
        setAllEntries(sortedEntries);
        setTopThree(sortedEntries.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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
            {/* 1st Place */}
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">1st Place</p>
                    {loading ? (
                      <Skeleton className="h-6 w-24 mt-1" />
                    ) : topThree[0] ? (
                      <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">{topThree[0].userName}</p>
                    ) : (
                      <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">No entries yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2nd Place */}
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Medal className="w-8 h-8 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">2nd Place</p>
                    {loading ? (
                      <Skeleton className="h-6 w-24 mt-1" />
                    ) : topThree[1] ? (
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{topThree[1].userName}</p>
                    ) : (
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">No entries yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Medal className="w-8 h-8 text-amber-600" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-800 dark:text-amber-200">3rd Place</p>
                    {loading ? (
                      <Skeleton className="h-6 w-24 mt-1" />
                    ) : topThree[2] ? (
                      <p className="text-lg font-bold text-amber-900 dark:text-amber-100">{topThree[2].userName}</p>
                    ) : (
                      <p className="text-lg font-bold text-amber-900 dark:text-amber-100">No entries yet</p>
                    )}
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
            <Leaderboard entries={allEntries} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}