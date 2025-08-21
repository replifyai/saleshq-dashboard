/**
 * Utility functions and constants for the organization chart
 */

import type { OrganizationNode } from '@/types/organization';
import { getNodeUserCount } from '@/lib/organizationUtils';

// Types for react-d3-tree
export interface TreeNodeData {
  name: string;
  attributes?: {
    type: string;
    userCount: number;
    description?: string;
    location?: string;
    budget?: number;
    level: number;
    nodeId: string;
  };
  children?: TreeNodeData[];
}

/**
 * Get node color based on level
 */
export const getNodeColor = (level: number): string => {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#84CC16', // Lime
  ];
  return colors[level % colors.length];
};

/**
 * Convert organization nodes to react-d3-tree format
 */
export const convertToTreeData = (orgNodes: OrganizationNode[]): TreeNodeData[] => {
  return orgNodes.map(node => ({
    name: node.name,
    attributes: {
      type: node.type,
      userCount: getNodeUserCount(node),
      description: node.description,
      location: node.metadata?.location,
      budget: node.metadata?.budget,
      level: node.level,
      nodeId: node.id,
    },
    children: node.children.length > 0 ? convertToTreeData(node.children) : undefined,
  }));
};

/**
 * Chart CSS animations
 */
export const chartAnimationStyles = `
  @keyframes chartPulse {
    0% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
    100% { opacity: 0.6; transform: scale(1); }
  }
  
  @keyframes chartFadeIn {
    0% { opacity: 0; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  .organization-chart svg circle[style*="animation"] {
    animation-timing-function: ease-in-out;
  }
  
  .organization-chart svg g:hover circle {
    filter: brightness(1.1) !important;
    transition: filter 0.2s ease;
  }
`;