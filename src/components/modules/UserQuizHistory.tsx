'use client'

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { moduleApi, type UserQuizResponseItem } from '@/lib/moduleApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpDown, Calendar, Search, TrendingUp } from 'lucide-react';

function scoreToGradient(score: number): string {
  if (score >= 85) return 'from-green-600 to-green-700';
  if (score >= 70) return 'from-blue-600 to-blue-700';
  if (score >= 50) return 'from-amber-500 to-amber-600';
  return 'from-red-600 to-red-700';
}

function timeAgo(ts?: number): string {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours}h ago`;
  const minutes = Math.floor(diff / 60000);
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export default function UserQuizHistory() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<UserQuizResponseItem[]>([]);
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'title'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await moduleApi.getUserQuizResponses();
        setItems(res.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const byQuery = q.trim().length
      ? items.filter(i => i.title.toLowerCase().includes(q.toLowerCase()))
      : items.slice();

    const sorted = byQuery.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') {
        cmp = (a.takenAt || 0) - (b.takenAt || 0);
      } else if (sortBy === 'score') {
        cmp = a.score - b.score;
      } else {
        cmp = a.title.localeCompare(b.title);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }, [items, q, sortBy, sortDir]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Quiz History</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Review your past attempts and track your progress over time.</p>
      </div>
      <div className="flex items-center gap-2">
          <div className="relative w-72">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search quizzes by title"
              className="pl-8"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <CardTitle className="mb-2">No quiz attempts yet</CardTitle>
          <CardDescription>Attempts will appear here once you complete tests.</CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item, idx) => {
            const gradient = scoreToGradient(item.score);
            const handleClick = () => {
              if (item.quizId) {
                router.push(`/quiz-history/${item.quizId}`);
              }
            };
            
            return (
              <Card 
                key={idx} 
                onClick={handleClick}
                className={`hover:shadow-md transition-shadow ${item.quizId ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <CardHeader>
                  <CardTitle className="truncate text-base">{item.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    {timeAgo(item.takenAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
                        {item.score.toFixed(2)}%
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        <span className="mr-3">Correct: {item.correct}</span>
                        <span className="mr-3">Wrong: {item.wrong}</span>
                        <span>NA: {item.notAttempted}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="h-6 flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {item.score >= 85 ? 'Excellent' : item.score >= 70 ? 'Good' : item.score >= 50 ? 'Fair' : 'Needs work'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

