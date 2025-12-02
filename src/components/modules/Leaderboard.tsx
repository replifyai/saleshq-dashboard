'use client'

import { useEffect, useMemo, useState } from 'react';
import { moduleApi, type LeaderboardEntry } from '@/lib/moduleApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Search } from 'lucide-react';

function initials(name: string): string {
  const parts = name.split(' ');
  const first = parts[0]?.[0] || '';
  const last = parts[1]?.[0] || '';
  return (first + last).toUpperCase();
}

// Format learning path for display
// e.g. "learning/Frido Experience Store/Module 1 : Company Overview" -> "Module 1 : Company Overview"
// e.g. "learning/Frido Experience Store" -> "Frido Experience Store"
function formatLearningPath(path: string): string {
  // Remove "learning/" prefix if present
  const withoutPrefix = path.replace(/^learning\//, '');
  // Get the last segment (after last /)
  const segments = withoutPrefix.split('/');
  return segments[segments.length - 1] || withoutPrefix;
}

// Get indentation level for nested display
function getPathDepth(path: string): number {
  const withoutPrefix = path.replace(/^learning\//, '');
  return withoutPrefix.split('/').length - 1;
}

interface LearningPathOption {
  value: string; // Full path to send to API
  label: string; // Formatted label for display
  depth: number; // Indentation level
}

interface LeaderboardProps {
  // Optional pre-fetched entries to avoid duplicate API calls
  entries?: LeaderboardEntry[];
}

export default function Leaderboard({ entries: propEntries }: LeaderboardProps) {
  const [loading, setLoading] = useState(!propEntries);
  const [entries, setEntries] = useState<LeaderboardEntry[]>(propEntries || []);
  const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined);
  const [q, setQ] = useState('');
  const [learningPaths, setLearningPaths] = useState<LearningPathOption[]>([]);
  const [pathsLoading, setPathsLoading] = useState(true);

  // Fetch learning paths on mount
  useEffect(() => {
    (async () => {
      try {
        setPathsLoading(true);
        const res = await moduleApi.getAllLearningPaths();
        const paths = res.data || [];
        const options: LearningPathOption[] = paths.map(path => ({
          value: path,
          label: formatLearningPath(path),
          depth: getPathDepth(path),
        }));
        setLearningPaths(options);
      } catch (error) {
        console.error('Failed to fetch learning paths:', error);
      } finally {
        setPathsLoading(false);
      }
    })();
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    // Only fetch data if entries weren't passed as props or if a specific path is selected
    if (propEntries && !selectedPath) {
      setEntries(propEntries);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await moduleApi.getLeaderboard(selectedPath);
        setEntries(res.data?.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedPath, propEntries]);

  const filtered = useMemo(() => {
    const list = q.trim()
      ? entries.filter(e => e.userName.toLowerCase().includes(q.toLowerCase()))
      : entries;
    return list.slice().sort((a, b) => a.rank - b.rank);
  }, [entries, q]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Leaderboard</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">See top performers overall or for a specific module.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input className="pl-8" placeholder="Search by name" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select 
            value={selectedPath ?? 'overall'} 
            onValueChange={(v) => setSelectedPath(v === 'overall' ? undefined : v)}
            disabled={pathsLoading}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder={pathsLoading ? "Loading..." : "Overall"} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="overall">Overall</SelectItem>
              {learningPaths.map(path => (
                <SelectItem 
                  key={path.value} 
                  value={path.value}
                  className="cursor-pointer"
                >
                  <span style={{ paddingLeft: `${path.depth * 12}px` }} className="flex items-center">
                    {path.depth > 0 && <span className="text-muted-foreground mr-1">└</span>}
                    {path.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <CardTitle className="mb-2">No entries yet</CardTitle>
          <CardDescription>Leaderboard will appear once participants complete quizzes.</CardDescription>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((e) => (
            <Card key={e.userId} className="overflow-hidden">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 text-center font-semibold">
                  {e.rank <= 3 ? (
                    <span className={
                      e.rank === 1 ? 'text-yellow-500' : e.rank === 2 ? 'text-gray-400' : 'text-amber-700'
                    }>
                      <Crown className="inline h-5 w-5" />
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">#{e.rank}</span>
                  )}
                </div>
                <Avatar>
                  <AvatarFallback>{initials(e.userName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{e.userName}</span>
                    <span className="text-xs text-gray-500">{e.quizCount} quiz{e.quizCount === 1 ? '' : 'zes'}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded mt-2">
                    <div className="h-2 rounded bg-primary" style={{ width: `${e.averageScore}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{e.averageScore.toFixed(2)}%</div>
                  <div className="text-xs text-gray-500">{e.totalCorrect}/{e.totalQuestions} correct</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

