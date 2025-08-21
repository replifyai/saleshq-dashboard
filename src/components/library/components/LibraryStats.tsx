import React from 'react';
import { StatsCard } from '../atoms/StatsCard';
import { getTotalFiles, getContributorsCount } from '../utils/libraryUtils';
import type { Product } from '@/lib/apiUtils';

interface LibraryStatsProps {
  products?: Product[];
  totalProducts?: number;
}

export const LibraryStats: React.FC<LibraryStatsProps> = ({ 
  products = [], 
  totalProducts 
}) => {
  const isFiltered = totalProducts !== undefined && totalProducts !== products.length;
  
  return (
    <div className="p-6 pt-0 pb-4 mb-4 border-b border-gray-200 dark:border-white/10">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard
          value={products.length}
          label={isFiltered ? `Filtered Products (${totalProducts} total)` : "Total Products"}
          variant="primary"
        />
        <StatsCard
          value={getTotalFiles(products)}
          label="Total Files"
          variant="primary"
        />
        <StatsCard
          value={getContributorsCount(products)}
          label="Contributors"
          variant="accent"
        />
      </div>
    </div>
  );
};

export default LibraryStats;