import React from 'react';
import { Building2, Users } from 'lucide-react';

import type { OrganizationNode } from '@/types/organization';

interface NodeIconProps {
  node: OrganizationNode;
}

export const NodeIcon: React.FC<NodeIconProps> = ({ node }) => {
  const iconClasses = "w-5 h-5 text-gray-600 dark:text-gray-300";
  const containerClasses = `
    p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 border shadow-sm
    group-hover:shadow-md transition-all duration-200 backdrop-blur-sm
  `;
  
  if (node.level === 0) {
    return (
      <div className={containerClasses}>
        <Building2 className={iconClasses} />
      </div>
    );
  }
  if (node.level === 1) {
    return (
      <div className={containerClasses}>
        <Building2 className={iconClasses} />
      </div>
    );
  }
  return (
    <div className={containerClasses}>
      <Users className={iconClasses} />
    </div>
  );
};

export default NodeIcon;