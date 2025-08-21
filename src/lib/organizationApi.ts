/**
 * Organization API Layer
 * Handles all organization-related API calls with full CRUD operations
 */

import { authService } from './auth';
import { getApiUrl } from './api';
import type {
  OrganizationHierarchy,
  OrganizationNode,
  OrganizationUser,
  CreateNodeRequest,
  UpdateNodeRequest,
  MoveNodeRequest,
  AssignUserRequest,
  BulkUserAssignRequest,
  OrganizationFilters,
  OrganizationStats,
  OrganizationSearchResult,
  OrganizationError
} from '@/types/organization';

// Base API configuration
const API_BASE = '/organization';

// Custom error class for organization operations
export class OrganizationApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public field?: string,
    public nodeId?: string
  ) {
    super(message);
    this.name = 'OrganizationApiError';
  }
}

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(`${API_BASE}${endpoint}`);
  
  try {
    const response = await authService.authenticatedFetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new OrganizationApiError(
        errorData?.message || `Request failed: ${response.statusText}`,
        errorData?.code || 'API_ERROR',
        errorData?.field,
        errorData?.nodeId
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof OrganizationApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.message.includes('Authentication failed')) {
      throw new OrganizationApiError('Session expired. Please log in again.', 'AUTH_ERROR');
    }
    
    throw new OrganizationApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'NETWORK_ERROR'
    );
  }
}

/**
 * Organization Hierarchy Operations
 */
export const hierarchyApi = {
  // Get complete organization hierarchy
  getHierarchy: async (filters?: OrganizationFilters): Promise<OrganizationHierarchy> => {
    const queryParams = filters ? `?${new URLSearchParams(filters as any).toString()}` : '';
    return apiRequest<OrganizationHierarchy>(`/hierarchy${queryParams}`);
  },

  // Get organization statistics
  getStats: async (): Promise<OrganizationStats> => {
    return apiRequest<OrganizationStats>('/stats');
  },

  // Search organization nodes
  search: async (query: string, filters?: OrganizationFilters): Promise<OrganizationSearchResult[]> => {
    return apiRequest<OrganizationSearchResult[]>('/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  },
};

/**
 * Node CRUD Operations
 */
export const nodeApi = {
  // Create new organization node
  create: async (data: CreateNodeRequest): Promise<OrganizationNode> => {
    return apiRequest<OrganizationNode>('/nodes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get specific node by ID
  getById: async (nodeId: string): Promise<OrganizationNode> => {
    return apiRequest<OrganizationNode>(`/nodes/${nodeId}`);
  },

  // Update existing node
  update: async (data: UpdateNodeRequest): Promise<OrganizationNode> => {
    const { id, ...updateData } = data;
    return apiRequest<OrganizationNode>(`/nodes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete node (and handle children based on backend logic)
  delete: async (nodeId: string, options?: { moveChildrenTo?: string }): Promise<void> => {
    const queryParams = options ? `?${new URLSearchParams(options).toString()}` : '';
    return apiRequest<void>(`/nodes/${nodeId}${queryParams}`, {
      method: 'DELETE',
    });
  },

  // Move node to different parent
  move: async (data: MoveNodeRequest): Promise<OrganizationNode> => {
    const { nodeId, ...moveData } = data;
    return apiRequest<OrganizationNode>(`/nodes/${nodeId}/move`, {
      method: 'PUT',
      body: JSON.stringify(moveData),
    });
  },

  // Get node children
  getChildren: async (nodeId: string): Promise<OrganizationNode[]> => {
    return apiRequest<OrganizationNode[]>(`/nodes/${nodeId}/children`);
  },

  // Get node ancestors (path to root)
  getAncestors: async (nodeId: string): Promise<OrganizationNode[]> => {
    return apiRequest<OrganizationNode[]>(`/nodes/${nodeId}/ancestors`);
  },

  // Get node descendants (all children recursively)
  getDescendants: async (nodeId: string, maxDepth?: number): Promise<OrganizationNode[]> => {
    const queryParams = maxDepth ? `?maxDepth=${maxDepth}` : '';
    return apiRequest<OrganizationNode[]>(`/nodes/${nodeId}/descendants${queryParams}`);
  },

  // Duplicate node (with or without children)
  duplicate: async (nodeId: string, options?: { includeChildren?: boolean; newParentId?: string }): Promise<OrganizationNode> => {
    return apiRequest<OrganizationNode>(`/nodes/${nodeId}/duplicate`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
    });
  },
};

/**
 * User Management Operations
 */
export const userApi = {
  // Get all available users for assignment
  getAvailable: async (): Promise<OrganizationUser[]> => {
    return apiRequest<OrganizationUser[]>('/users/available');
  },

  // Get users in specific node
  getByNode: async (nodeId: string): Promise<OrganizationUser[]> => {
    return apiRequest<OrganizationUser[]>(`/users/by-node/${nodeId}`);
  },

  // Assign single user to node
  assign: async (data: AssignUserRequest): Promise<void> => {
    return apiRequest<void>('/users/assign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Assign multiple users to node
  assignBulk: async (data: BulkUserAssignRequest): Promise<void> => {
    return apiRequest<void>('/users/assign-bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Remove user from node
  remove: async (userId: string, nodeId: string): Promise<void> => {
    return apiRequest<void>('/users/remove', {
      method: 'POST',
      body: JSON.stringify({ userId, nodeId }),
    });
  },

  // Update user role/title in node
  updateRole: async (userId: string, nodeId: string, role: string, title?: string): Promise<void> => {
    return apiRequest<void>('/users/update-role', {
      method: 'PUT',
      body: JSON.stringify({ userId, nodeId, role, title }),
    });
  },

  // Transfer user to different node
  transfer: async (userId: string, fromNodeId: string, toNodeId: string): Promise<void> => {
    return apiRequest<void>('/users/transfer', {
      method: 'POST',
      body: JSON.stringify({ userId, fromNodeId, toNodeId }),
    });
  },

  // Get user's organization context (all nodes they belong to)
  getUserContext: async (userId: string): Promise<{ user: OrganizationUser; nodes: OrganizationNode[] }> => {
    return apiRequest<{ user: OrganizationUser; nodes: OrganizationNode[] }>(`/users/${userId}/context`);
  },
};

/**
 * Batch Operations
 */
export const batchApi = {
  // Import organization structure from CSV/JSON
  import: async (data: any, format: 'csv' | 'json'): Promise<{ created: number; updated: number; errors: OrganizationError[] }> => {
    return apiRequest<{ created: number; updated: number; errors: OrganizationError[] }>('/batch/import', {
      method: 'POST',
      body: JSON.stringify({ data, format }),
    });
  },

  // Export organization structure
  export: async (format: 'csv' | 'json' | 'xlsx', nodeIds?: string[]): Promise<Blob> => {
    const response = await authService.authenticatedFetch(getApiUrl(`${API_BASE}/batch/export`), {
      method: 'POST',
      body: JSON.stringify({ format, nodeIds }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new OrganizationApiError('Export failed', 'EXPORT_ERROR');
    }

    return response.blob();
  },

  // Bulk update multiple nodes
  updateNodes: async (updates: UpdateNodeRequest[]): Promise<{ updated: number; errors: OrganizationError[] }> => {
    return apiRequest<{ updated: number; errors: OrganizationError[] }>('/batch/update-nodes', {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
  },

  // Bulk delete multiple nodes
  deleteNodes: async (nodeIds: string[]): Promise<{ deleted: number; errors: OrganizationError[] }> => {
    return apiRequest<{ deleted: number; errors: OrganizationError[] }>('/batch/delete-nodes', {
      method: 'DELETE',
      body: JSON.stringify({ nodeIds }),
    });
  },
};

/**
 * Analytics and Reporting
 */
export const analyticsApi = {
  // Get organization health metrics
  getHealthMetrics: async (): Promise<{
    totalNodes: number;
    totalUsers: number;
    avgTeamSize: number;
    nodeUtilization: number;
    managerSpan: number;
    emptyNodes: number;
  }> => {
    return apiRequest('/analytics/health');
  },

  // Get reporting hierarchy for specific user
  getReportingChain: async (userId: string): Promise<{
    directReports: OrganizationUser[];
    manager: OrganizationUser | null;
    peers: OrganizationUser[];
    chain: OrganizationUser[];
  }> => {
    return apiRequest(`/analytics/reporting-chain/${userId}`);
  },

  // Get organization growth trends
  getGrowthTrends: async (period: 'week' | 'month' | 'quarter' | 'year'): Promise<{
    nodeGrowth: { date: string; count: number }[];
    userGrowth: { date: string; count: number }[];
  }> => {
    return apiRequest(`/analytics/growth-trends?period=${period}`);
  },
};

/**
 * Combined API object for easy imports
 */
export const organizationApi = {
  hierarchy: hierarchyApi,
  nodes: nodeApi,
  users: userApi,
  batch: batchApi,
  analytics: analyticsApi,
};

export default organizationApi;