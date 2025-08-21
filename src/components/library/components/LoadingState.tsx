import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  layout: 'grid' | 'list';
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ layout, count = 6 }) => {
  return (
    <div className={layout === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className={layout === 'grid' ? "h-48 w-full" : "h-24 w-full"} />
      ))}
    </div>
  );
};

export default LoadingState;