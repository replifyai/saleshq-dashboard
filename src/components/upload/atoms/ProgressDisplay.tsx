import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressDisplayProps {
  progress: number;
  showPercentage?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ 
  progress, 
  showPercentage = true,
  className = '',
  size = 'md'
}) => {
  const getProgressHeight = () => {
    switch (size) {
      case 'sm': return 'h-1';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };

  const getContainerWidth = () => {
    switch (size) {
      case 'sm': return 'w-16';
      case 'lg': return 'w-32';
      default: return 'w-20';
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={getContainerWidth()}>
        <Progress 
          value={progress} 
          className={getProgressHeight()} 
        />
      </div>
      {showPercentage && (
        <span className="text-xs text-gray-600 font-medium min-w-[3rem] text-right">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

export default ProgressDisplay;