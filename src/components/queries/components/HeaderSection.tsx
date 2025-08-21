import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw } from 'lucide-react';
import UpdateAIKnowledge from './update-ai-knowledge';
import { FilterButtons } from './FilterButtons';
import { PaginationControls } from './PaginationControls';
import { useToast } from '@/hooks/use-toast';

interface HeaderSectionProps {
  filter: 'all' | 'pending' | 'resolved';
  onFilterChange: (filter: 'all' | 'pending' | 'resolved') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isLoading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  filter,
  onFilterChange,
  onRefresh,
  isRefreshing,
  isLoading,
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  onPageChange
}) => {
  const { toast } = useToast();

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pb-4 mb-2 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="mb-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                Feedback Questions
              </h1>
              <p className="text-xs md:text-base text-gray-600 dark:text-gray-400 mt-1">
                Manage customer queries and enhance AI knowledge with new documentation
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Update AI Knowledge Button */}
              <UpdateAIKnowledge
                trigger={
                  <Button
                    variant="default"
                    size="sm" 
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                    style={{
                      '--mb-color-1': '#d946ef',
                      '--mb-color-2': '#8b5cf6',
                      '--mb-duration': '2.5s',
                      '--mb-opacity': '0.9',
                      '--mb-shadow-duration': '5s'
                    } as React.CSSProperties}
                  >
                    <Brain className="w-4 h-4" />
                    <span className="hidden sm:inline">Update AI Knowledge</span>
                    <span className="sm:hidden">Update AI</span>
                  </Button>
                }
                onSuccess={() => {
                  toast({
                    title: "Knowledge Base Updated",
                    description: "The AI can now provide better answers to similar queries.",
                  });
                }}
              />
              
              {/* Reload Button */}
              <Button
                onClick={onRefresh}
                disabled={isRefreshing || isLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:text-blue-600"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Reload</span>
              </Button>
            </div>
          </div>

          {/* Enhanced Info Banner */}
          <div 
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3"
            style={{
              '--mb-color-1': '#3b82f6',
              '--mb-color-2': '#a855f7',
              '--mb-duration': '4s',
              '--mb-opacity': '0.6',
              '--mb-glow-opacity': '0.3',
              '--mb-shadow-duration': '10s'
            } as React.CSSProperties}
          >
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Continuous AI Improvement
                </h3>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  When you see unanswered questions, use "Update AI Knowledge" to upload relevant documentation. 
                  This enhances the AI's ability to answer similar queries in the future.
                </p>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <FilterButtons currentFilter={filter} onFilterChange={onFilterChange} />
        </div>
      </div>

      {/* Top Pagination */}
      <PaginationControls
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default HeaderSection;