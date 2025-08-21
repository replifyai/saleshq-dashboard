import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { generatePaginationNumbers, getPaginationInfo } from '../utils/queriesUtils';

interface PaginationControlsProps {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  isLoading = false,
  className = ""
}) => {
  if (totalPages <= 1) return null;

  const { startItem, endItem } = getPaginationInfo(pageNumber, pageSize, totalCount);
  const paginationNumbers = generatePaginationNumbers(pageNumber, totalPages);

  return (
    <div className={`flex items-center justify-between gap-2 ${className}`}>
      {/* Results Info */}
      <div className="text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
        <span className="font-medium">{startItem}-{endItem}</span> of <span className="font-medium">{totalCount}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
          disabled={pageNumber === 1 || isLoading}
          className="px-2 py-1 text-xs h-7"
        >
          <ChevronLeft className="w-3 h-3" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {paginationNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <Button
                  key={`ellipsis-${index}`}
                  variant="ghost"
                  size="sm"
                  disabled
                  className="w-7 h-7 p-0"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              );
            }

            const pageNum = typeof page === 'number' ? page : parseInt(page);
            const isCurrentPage = pageNum === pageNumber;

            return (
              <Button
                key={page}
                variant={isCurrentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                className={`w-7 h-7 p-0 text-xs ${
                  isCurrentPage
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, pageNumber + 1))}
          disabled={pageNumber === totalPages || isLoading}
          className="px-2 py-1 text-xs h-7"
        >
          <ChevronRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;