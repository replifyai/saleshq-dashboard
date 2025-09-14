'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FolderOpen, ArrowRight, FileText, HelpCircle, Plus, Settings } from 'lucide-react';
import { moduleApi, type ModuleTreeNode } from '@/lib/moduleApi';
import { useToast } from '@/hooks/use-toast';

interface ModulePreview {
  id: string;
  name: string;
  path: string;
  hasChildren: boolean;
  pdfs: number;
  quizzes: number;
  description?: string;
}

export default function CompactModuleList() {
  const router = useRouter();
  const { toast } = useToast();
  const [modules, setModules] = useState<ModulePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        // Use getRootModulesEntries which already includes files data
        const entries = await moduleApi.getRootModulesEntries();
        
        // Get first 5 root modules and extract data directly
        const previews: ModulePreview[] = entries.slice(0, 5).map((entry) => {
          const files = entry.files || [];
          const pdfs = files.filter((f: any) => f.type === 'pdf').length;
          const quizzes = files.filter((f: any) => f.type === 'quiz').length;
          
          return {
            id: entry.module.id,
            name: entry.module.name,
            path: entry.module.id,
            hasChildren: Array.isArray(entry.subModules) && entry.subModules.length > 0,
            pdfs,
            quizzes,
            description: entry.module.description
          };
        });
        
        setModules(previews);
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

    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
    };

    fetchModules();
    checkAdminStatus();
  }, [toast]);

  const handleModuleClick = (path: string) => {
    const encoded = path
      .split('/')
      .map((seg) => encodeURIComponent(seg))
      .join('/');
    router.push(`/modules/${encoded}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No Modules Available
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {isAdmin 
            ? "Start by creating your first learning module."
            : "Learning modules will appear here when they become available."}
        </p>
        {isAdmin && (
          <Button 
            onClick={() => router.push('/modules/admin')} 
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Module
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Scrollable modules container - shows exactly 5 rows */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {modules.map((module) => (
          <Card 
            key={module.id} 
            className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
            onClick={() => handleModuleClick(module.path)}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                {module.hasChildren ? (
                  <FolderOpen className="w-5 h-5 text-primary" />
                ) : (
                  <BookOpen className="w-5 h-5 text-primary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate pr-2">
                    {module.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
                
                {module.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {module.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2">
                  {module.pdfs > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      {module.pdfs} PDF{module.pdfs !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {module.quizzes > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <HelpCircle className="w-3 h-3 mr-1" />
                      {module.quizzes} Quiz{module.quizzes !== 1 ? 'zes' : ''}
                    </Badge>
                  )}
                  {module.hasChildren && (
                    <Badge variant="outline" className="text-xs">
                      Has Submodules
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="pt-2 border-t flex-shrink-0">
        <Button 
          variant="ghost" 
          className="w-full" 
          onClick={() => router.push('/modules')}
        >
          View All Modules <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}