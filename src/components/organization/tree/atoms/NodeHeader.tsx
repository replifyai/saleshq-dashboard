import React from 'react';
import { Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import type { OrganizationNode } from '@/types/organization';

interface NodeHeaderProps {
  node: OrganizationNode;
  totalUsers: number;
  highlightMatch: (text: string) => React.ReactNode;
}

export const NodeHeader: React.FC<NodeHeaderProps> = ({ 
  node, 
  totalUsers, 
  highlightMatch 
}) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base lg:text-lg text-gray-900 dark:text-white truncate leading-tight">
          {highlightMatch(node.name)}
        </h3>
        {node.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {highlightMatch(node.description)}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <Badge 
          variant="secondary" 
          className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          {highlightMatch(node.type)}
        </Badge>
        
        <Badge 
          variant="outline" 
          className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        >
          L{node.level}
        </Badge>
        
        <Badge 
          className={`
            text-xs font-medium transition-all duration-200
            ${totalUsers > 0 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }
          `}
        >
          <Users className="w-3 h-3 mr-1.5" />
          {totalUsers}
        </Badge>
      </div>
    </div>
  );
};

export default NodeHeader;