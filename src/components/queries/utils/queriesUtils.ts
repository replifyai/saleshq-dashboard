/**
 * Utility functions for the unanswered queries page
 */

import type { UnansweredQuery } from '@/lib/apiUtils';

/**
 * Format timestamp to different display formats
 */
export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    full: date.toLocaleString(),
    short: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

/**
 * Get priority color classes based on priority level
 */
export const getPriorityColor = (priority?: string): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

/**
 * Get status label text
 */
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'resolved':
      return 'Resolved';
    case 'delete':
      return 'Deleted';
    default:
      return status;
  }
};

/**
 * Generate pagination numbers with ellipsis
 */
export const generatePaginationNumbers = (pageNumber: number, totalPages: number) => {
  const delta = 2; // Number of pages to show on each side of current page
  const range = [];
  const rangeWithDots = [];

  for (let i = Math.max(2, pageNumber - delta); i <= Math.min(totalPages - 1, pageNumber + delta); i++) {
    range.push(i);
  }

  if (pageNumber - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (pageNumber + delta < totalPages - 1) {
    rangeWithDots.push('...', totalPages);
  } else if (totalPages > 1) {
    rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
};

/**
 * Calculate pagination display info
 */
export const getPaginationInfo = (pageNumber: number, pageSize: number, totalCount: number) => {
  const startItem = (pageNumber - 1) * pageSize + 1;
  const endItem = Math.min(pageNumber * pageSize, totalCount);
  
  return { startItem, endItem };
};