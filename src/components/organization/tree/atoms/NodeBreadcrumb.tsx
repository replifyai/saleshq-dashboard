import React from 'react';
import { Building2, ChevronRight } from 'lucide-react';

import type { OrganizationNode } from '@/types/organization';

interface NodeBreadcrumbProps {
  node: OrganizationNode;
}

export const NodeBreadcrumb: React.FC<NodeBreadcrumbProps> = ({ node }) => {
  if (node.level === 0 || !node.path) {
    return null;
  }

  return (
    <div className="absolute top-2 left-2 z-20">
      <div 
        className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-xs text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer max-w-full"
        title={`Path: ${node.path}`}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Full path:', node.path);
        }}
      >
        <Building2 className="w-3 h-3 flex-shrink-0" />
        <div className="flex items-center gap-1 overflow-hidden">
          {(() => {
            const pathSegments = node.path.split('/');
            const parentSegments = pathSegments.slice(0, -1);
            
            // Show only last 2 parent segments if there are many
            const displaySegments = parentSegments.length > 2 
              ? ['...', ...parentSegments.slice(-2)]
              : parentSegments;
            
            return displaySegments.map((segment, index) => (
              <React.Fragment key={index}>
                <span className="text-xs font-medium">
                  {segment}
                </span>
                <ChevronRight className="w-2.5 h-2.5 flex-shrink-0" />
              </React.Fragment>
            ));
          })()}
          <span className="font-semibold">
            {node.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NodeBreadcrumb;