import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CollapsibleTrigger } from '@/components/ui/collapsible';

interface ExpandToggleProps {
  hasChildren: boolean;
  totalUsers: number;
  isExpanded: boolean;
}

export const ExpandToggle: React.FC<ExpandToggleProps> = ({ 
  hasChildren, 
  totalUsers, 
  isExpanded 
}) => {
  return (
    <CollapsibleTrigger asChild>
      <Button 
        variant="ghost" 
        size="sm" 
        className={`
          p-2 h-9 w-9 shrink-0 rounded-lg z-10 relative
          ${(hasChildren || totalUsers > 0)
            ? 'hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-md' 
            : 'opacity-30 cursor-default'
          }
          transition-all duration-200
        `}
        onClick={(e) => {
          e.stopPropagation();
        }}
        disabled={!hasChildren && totalUsers === 0}
      >
        {(hasChildren || totalUsers > 0) ? (
          isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          )
        ) : (
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
        )}
      </Button>
    </CollapsibleTrigger>
  );
};

export default ExpandToggle;