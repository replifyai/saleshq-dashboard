import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  answeredCount: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  answeredCount,
  className = ''
}) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>Answered: {answeredCount}</span>
        <span>Remaining: {total - answeredCount}</span>
      </div>
      <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
    </div>
  );
};

export default ProgressIndicator;