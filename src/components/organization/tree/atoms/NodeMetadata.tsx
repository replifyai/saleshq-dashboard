import React from 'react';
import { MapPin, DollarSign, Users } from 'lucide-react';

import type { OrganizationNode } from '@/types/organization';

interface NodeMetadataProps {
  node: OrganizationNode;
}

export const NodeMetadata: React.FC<NodeMetadataProps> = ({ node }) => {
  if (!node.metadata) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {node.metadata.location && (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-md border">
          <MapPin className="w-3 h-3 text-gray-500" />
          <span className="font-medium">{node.metadata.location}</span>
        </div>
      )}
      {node.metadata.budget && (
        <div className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2 py-1 rounded-md border border-green-200 dark:border-green-800">
          <DollarSign className="w-3 h-3" />
          <span className="font-medium">${node.metadata.budget.toLocaleString()}</span>
        </div>
      )}
      {node.metadata.headcount && (
        <div className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800">
          <Users className="w-3 h-3" />
          <span className="font-medium">{node.metadata.headcount} planned</span>
        </div>
      )}
    </div>
  );
};

export default NodeMetadata;