'use client'
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, MessageSquare } from "lucide-react";
import { queriesApi, type UnansweredQuery, type FeedbackQuestionsResponse } from "@/lib/apiUtils";
import { useToast } from "@/hooks/use-toast";
import {
  HeaderSection,
  QueriesMobileView,
  QueriesTable,
  ConfirmDialog
} from "@/components/queries/components";
import { LoadingSpinner } from "@/components/queries/atoms";

export default function Queries() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('pending');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<UnansweredQuery | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch queries from real API
  const { data: queriesResponse, isLoading, error } = useQuery<FeedbackQuestionsResponse>({
    queryKey: ['/api/unanswered-queries', filter, pageNumber, pageSize],
    queryFn: () => queriesApi.getFeedbackQuestions(pageNumber, pageSize, filter === 'all' ? '' : filter),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mark query as resolved mutation
  const markAsResolvedMutation = useMutation({
    mutationFn: (queryId: string) => queriesApi.markAsResolved(queryId),
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['/api/unanswered-queries'] });
      toast({
        title: "Success",
        description: "Query marked as resolved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark query as resolved. Please try again.",
        variant: "destructive",
      });
      console.error('Error marking query as resolved:', error);
    },
  });

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['/api/unanswered-queries'] });
      toast({
        title: "Refreshed",
        description: "Queries data has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMarkAsResolved = (queryId: string) => {
    const query = queriesResponse?.data.find(q => q.id === queryId);
    if (query) {
      setSelectedQuery(query);
      setShowConfirmDialog(true);
    }
  };

  const confirmMarkAsResolved = () => {
    if (selectedQuery) {
      markAsResolvedMutation.mutate(selectedQuery.id);
      setShowConfirmDialog(false);
      setSelectedQuery(null);
    }
  };

  const cancelMarkAsResolved = () => {
    setShowConfirmDialog(false);
    setSelectedQuery(null);
  };



  const queries = queriesResponse?.data || [];
  const totalCount = queriesResponse?.totalCount || 0;
  const totalPages = queriesResponse?.totalPages || 0;

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-red-600">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span className="text-center">Failed to load unanswered queries. Please try again.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      <HeaderSection
        filter={filter}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          setPageNumber(1);
        }}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        isLoading={isLoading}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChange={setPageNumber}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="text-base md:text-lg">Queries ({totalCount})</span>
            </div>
            {totalPages > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Items per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newPageSize = parseInt(e.target.value);
                    setPageNumber(1);
                    setPageSize(newPageSize);
                  }}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading queries...</span>
            </div>
          ) : queries.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No queries found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'pending'
                  ? "Great! No pending queries at the moment."
                  : filter === 'resolved'
                    ? "No resolved queries to display."
                    : "No queries have been submitted yet."}
              </p>
            </div>
          ) : (
            <>
              <QueriesMobileView
                queries={queries}
                onMarkAsResolved={handleMarkAsResolved}
                isLoading={markAsResolvedMutation.isPending}
              />

              <QueriesTable
                queries={queries}
                onMarkAsResolved={handleMarkAsResolved}
                isLoading={markAsResolvedMutation.isPending}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        query={selectedQuery}
        onConfirm={confirmMarkAsResolved}
        onCancel={cancelMarkAsResolved}
        isLoading={markAsResolvedMutation.isPending}
      />
    </div>
  );
} 