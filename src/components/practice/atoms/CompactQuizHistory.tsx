'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { moduleApi, type UserQuizResponseItem } from '@/lib/moduleApi';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, BarChart3 } from 'lucide-react';

function scoreToColor(score: number): string {
  if (score >= 85) return 'text-green-600 dark:text-green-400';
  if (score >= 70) return 'text-blue-600 dark:text-blue-400';
  if (score >= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function scoreToVariant(score: number): "default" | "secondary" | "destructive" | "outline" {
  if (score >= 85) return 'default';
  if (score >= 70) return 'secondary';
  if (score >= 50) return 'outline';
  return 'destructive';
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

export default function CompactQuizHistory() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<UserQuizResponseItem[]>([]);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        setLoading(true);
        const res = await moduleApi.getUserQuizResponses();
        // Show recent 5 entries for compact view
        setItems((res.data || []).slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch quiz history:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, []);

  const handleViewAll = () => {
    // Navigate to dedicated complete quiz history page
    router.push('/quiz-history');
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No quiz attempts yet</p>
        <p className="text-xs mt-1">Take your first quiz to see results here</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Scrollable quiz history container - shows exactly 5 rows */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {items.map((item, index) => (
          <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm truncate pr-2">{item.title}</h4>
              <Badge variant={scoreToVariant(item.score)} className="text-xs">
                {item.score.toFixed(0)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {timeAgo(item.takenAt)}
              </div>
              <div className="flex gap-2">
                <span className="text-green-600">✓{item.correct}</span>
                <span className="text-red-600">✗{item.wrong}</span>
              </div>
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
          View All Results <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}