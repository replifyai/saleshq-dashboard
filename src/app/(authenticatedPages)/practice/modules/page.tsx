'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, GraduationCap, FileText, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ModuleTree from '@/components/modules/ModuleTree';
import { useEffect, useState } from 'react';
import { moduleApi } from '@/lib/moduleApi';

interface ModuleStats {
  totalModules: number;
  totalPdfs: number;
  totalQuizzes: number;
}

export default function ModulesPage() {
  const router = useRouter();
  const [stats, setStats] = useState<ModuleStats>({ totalModules: 0, totalPdfs: 0, totalQuizzes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Use getRootModulesEntries which already includes all the data we need
        const entries = await moduleApi.getRootModulesEntries();
        
        // Calculate stats from the entries
        let totalModules = 0;
        let totalPdfs = 0;
        let totalQuizzes = 0;

        const countResources = (nodes: any[]) => {
          for (const node of nodes) {
            totalModules++;
            
            // Count files directly from the entry data
            const files = node.files || [];
            totalPdfs += files.filter((f: any) => f.type === 'pdf').length;
            totalQuizzes += files.filter((f: any) => f.type === 'quiz').length;

            // Recursively count submodules
            if (node.subModules && node.subModules.length > 0) {
              countResources(node.subModules);
            }
          }
        };

        countResources(entries);
        setStats({ totalModules, totalPdfs, totalQuizzes });
      } catch (error) {
        console.error('Failed to fetch module stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/practice')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Learning Modules
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore all available courses, materials, and assessments
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          {/* {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalModules}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Modules
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalPdfs}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        PDF Resources
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalQuizzes}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quiz Assessments
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )} */}
        </div>

        {/* Module Tree */}
        <Card>
          <ModuleTree />
        </Card>
      </div>
    </div>
  );
}