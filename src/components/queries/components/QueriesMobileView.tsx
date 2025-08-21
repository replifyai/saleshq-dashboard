import React from 'react';
import { QueryCard } from './QueryCard';
import type { UnansweredQuery } from '@/lib/apiUtils';

interface QueriesMobileViewProps {
  queries: UnansweredQuery[];
  onMarkAsResolved: (queryId: string) => void;
  isLoading?: boolean;
}

export const QueriesMobileView: React.FC<QueriesMobileViewProps> = ({
  queries,
  onMarkAsResolved,
  isLoading = false
}) => {
  return (
    <div className="block md:hidden space-y-4">
      {queries.map((query) => (
        <QueryCard
          key={query.id}
          query={query}
          onMarkAsResolved={onMarkAsResolved}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default QueriesMobileView;