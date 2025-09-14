'use client';

import { useEffect, useState } from 'react';
import { moduleApi, type LeaderboardEntry } from '@/lib/moduleApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Trophy, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

function initials(name: string): string {
  const parts = name.split(' ');
  const first = parts[0]?.[0] || '';
  const last = parts[1]?.[0] || '';
  return (first + last).toUpperCase();
}

export default function CompactLeaderboard() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await moduleApi.getLeaderboard();
        // Show top 5 entries for compact view
        setEntries((res.data?.data || []).slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleViewAll = () => {
    // Navigate to dedicated full leaderboard page
    router.push('/leaderboard');
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No leaderboard data yet</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Scrollable leaderboard container - shows exactly 5 rows */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {entries.map((entry, index) => (
          <div key={entry.userId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-6 text-center">
              {entry.rank <= 3 ? (
                <Crown className={`w-5 h-5 ${
                  entry.rank === 1 ? 'text-yellow-500' : 
                  entry.rank === 2 ? 'text-gray-400' : 
                  'text-amber-700'
                }`} />
              ) : (
                <span className="text-xs font-medium text-gray-500">#{entry.rank}</span>
              )}
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">{initials(entry.userName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{entry.userName}</p>
              <p className="text-xs text-gray-500">{entry.quizCount} quiz{entry.quizCount === 1 ? '' : 'zes'}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">{entry.averageScore.toFixed(0)}%</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2 border-t flex-shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full" 
          onClick={handleViewAll}
        >
          View Full Leaderboard <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}