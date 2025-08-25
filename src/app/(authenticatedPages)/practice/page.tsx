import ModuleList from '@/components/modules/ModuleList';
import UserQuizHistory from '@/components/modules/UserQuizHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, BarChart3, Sparkles, Trophy } from 'lucide-react';
import Leaderboard from '@/components/modules/Leaderboard';

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Practice Center
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Choose a quiz to take, or review your previous results.</p>
        </div>

        <Tabs defaultValue="quizzes">
          <div className="flex justify-center mb-4">
            <TabsList className="rounded-full border bg-white/70 dark:bg-gray-900/50 backdrop-blur px-1">
              <TabsTrigger value="quizzes" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <GraduationCap className="h-4 w-4 mr-2" />
                Quizzes
              </TabsTrigger>
              <TabsTrigger value="results" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="h-4 w-4 mr-2" />
                Results
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="quizzes">
            <Card>
              <CardContent className="p-1">
                <ModuleList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="results">
            <Card>
              <CardContent className="p-4 md:p-6">
                <UserQuizHistory />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="leaderboard">
            <Card>
              <CardContent className="p-4 md:p-6">
                <Leaderboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}