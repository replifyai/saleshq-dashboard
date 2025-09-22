import React from 'react';

interface SearchResultsInfoProps {
  loading: boolean;
  searchTerm: string;
  statusFilter: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  onClearFilters: () => void;
}

export function SearchResultsInfo({
  loading,
  searchTerm,
  statusFilter,
  totalCount,
  totalPages,
  currentPage,
  onClearFilters
}: SearchResultsInfoProps) {
  if (loading || (!searchTerm && statusFilter === 'all')) {
    return null;
  }

  return (
    <div className="flex items-center justify-center py-4">
      <p className="text-sm text-muted-foreground">
        {totalCount > 0 ? (
          <>
            Found {totalCount} result{totalCount !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
            {statusFilter !== 'all' && ` (${statusFilter} users)`}
            {totalPages > 1 && (
              <span> (showing page {currentPage} of {totalPages})</span>
            )}
          </>
        ) : (
          <>
            No results found
            {searchTerm && ` for "${searchTerm}"`}
            {statusFilter !== 'all' && ` (${statusFilter} users)`}
          </>
        )}
        <span className="ml-2">
          <button 
            onClick={onClearFilters}
            className="text-primary hover:underline"
          >
            Clear filters
          </button>
        </span>
      </p>
    </div>
  );
}