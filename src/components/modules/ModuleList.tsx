'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, GraduationCap, FolderOpen, Plus, Settings } from 'lucide-react';
import { moduleApi, type SubModule, type RootModuleEntry } from '@/lib/moduleApi';
import { useToast } from '@/hooks/use-toast';
import AdminToggle from './AdminToggle';

export default function ModuleList() {
  const router = useRouter();
  const { toast } = useToast();
  const [modules, setModules] = useState<RootModuleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchModules();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    // Check if user is admin from localStorage or auth context
    // For now, we'll check a simple flag
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  };

  const fetchModules = async () => {
    try {
      setLoading(true);
      const entries = await moduleApi.getRootModulesEntries();
      setModules(entries || []);
    } catch (error) {
      toast({
        title: "Error fetching modules",
        description: error instanceof Error ? error.message : "Failed to load modules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (moduleId: string) => {
    router.push(`/modules/${moduleId}`);
  };

  const handleAdminClick = () => {
    router.push('/modules/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-8">
      <AdminToggle />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Learning Modules
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose a module to start learning or take a test
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={handleAdminClick}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Settings className="h-4 w-4" />
              Admin Panel
            </Button>
          )}
        </div>

        {modules.length === 0 ? (
          <Card className="p-12 text-center">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Modules Available</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isAdmin 
                ? "Start by creating your first learning module."
                : "No learning modules are available at the moment."}
            </p>
            {isAdmin && (
              <Button onClick={handleAdminClick} className="mx-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Module
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((entry) => (
              <Card
                key={entry.module.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleModuleClick(entry.module.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.subModules?.length || 0} submodule{(entry.subModules?.length || 0) === 1 ? '' : 's'}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{entry.module.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {entry.module.description || 'Learn and test your knowledge in this module'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {(entry.files?.filter(f => f.type === 'pdf').length || 0)} PDF{((entry.files?.filter(f => f.type === 'pdf').length || 0) === 1) ? '' : 's'}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {(entry.files?.filter(f => f.type === 'quiz').length || 0)} {((entry.files?.filter(f => f.type === 'quiz').length || 0) === 1) ? 'quiz' : 'quizzes'}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Enter →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}