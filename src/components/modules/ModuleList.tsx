'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, GraduationCap, FolderOpen, Plus, Settings } from 'lucide-react';
import { moduleApi, type SubModule, type RootModuleEntry } from '@/lib/moduleApi';
import { useToast } from '@/hooks/use-toast';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import AdminToggle from './AdminToggle';
import ModuleTree from './ModuleTree';

export default function ModuleList({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAdmin } = useAdminAccess();
  const [modules, setModules] = useState<RootModuleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

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
      <div className={embedded ? '' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-2'}>
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
    <div className='min-h-full'>
      {!embedded && <AdminToggle />}
      {!embedded && isAdmin && (
        <div className="sticky top-1 z-10 flex justify-end">
          <Button
            onClick={handleAdminClick}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Settings className="h-4 w-4" />
            Admin Panel
          </Button>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          {/* Admin button moved to sticky header above */}
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
            {!embedded && isAdmin && (
              <Button onClick={handleAdminClick} className="mx-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Module
              </Button>
            )}
          </Card>
        ) : (
          <ModuleTree />
        )}
        </div>
      </div>
  );
}