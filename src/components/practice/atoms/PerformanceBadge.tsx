import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PerformanceBadgeProps {
  level: string;
  color: string;
  className?: string;
}

export const PerformanceBadge: React.FC<PerformanceBadgeProps> = ({
  level,
  color,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className={`text-lg md:text-xl font-bold ${color}`}>
        {level}
      </div>
      <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Performance</div>
    </div>
  );
};

export default PerformanceBadge;