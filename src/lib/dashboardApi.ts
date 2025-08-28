/**
 * Dashboard API Layer
 * Implements the exact Organization API specification from README.md
 * Base path: /dashboardApi
 * Auth: Bearer Firebase ID Token in Authorization header
 */

import { authService } from './auth';
import { getApiUrl } from './api';

// Base API configuration as per README.md specification
// Note: API_BASE is now handled directly in the endpoint URLs
const API_BASE = '/dashboardApi';

// Types for Dashboard API requests and responses
export interface DashboardNode {
  id: string;
  name: string;
  type: string;
  parentId: string | null;
  order: number;
  metadata?: Record<string, any>;
  managerId?: string | null;
  path?: string;
  level?: number;
  children?: DashboardNode[]; // For nested tree responses
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: string;
  title?: string;
  status: string;
  managerId?: string | null;
  nodeIds: string[];
}

export interface CreateNodeRequest {
  id: string;
  name: string;
  type: string;
  parentId: string | null;
  order: number;
  metadata?: Record<string, any>;
}

export interface UpdateNodeRequest {
  name?: string;
  order?: number;
  metadata?: Record<string, any>;
  managerId?: string | null;
  type?: string;
}

export interface MoveNodeRequest {
  newParentId: string | null;
  newOrder?: number;
}

export interface CreateUserRequest {
  id: string;
  name: string;
  email: string;
  role: string;
  title?: string;
  status: string;
  managerId?: string | null;
  nodeIds: string[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
  title?: string;
  status?: string;
  managerId?: string | null;
  nodeIds?: string[];
}

export interface ImportRequest {
  users: Partial<DashboardUser>[];
  tree: TreeNode[];
}

export interface TreeNode {
  id: string;
  name: string;
  type: string;
  order: number;
  children?: TreeNode[];
  users?: string[];
}

export interface ManagementReport {
  userId: string;
  directReports: DashboardUser[];
  reportingTree: any; // The structure will depend on the actual API response
}

// Custom error class for Dashboard API operations
export class DashboardApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'DashboardApiError';
  }
}

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(`${endpoint}`);
  
  try {
    const response = await authService.authenticatedFetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Request failed: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new DashboardApiError(
        errorMessage,
        'API_ERROR',
        response.status
      );
    }

    // Handle empty responses (like DELETE operations)
    const responseText = await response.text();
    if (!responseText) return {} as T;
    
    return JSON.parse(responseText);
  } catch (error) {
    if (error instanceof DashboardApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.message.includes('Authentication failed')) {
      throw new DashboardApiError('Session expired. Please log in again.', 'AUTH_ERROR');
    }
    
    throw new DashboardApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'NETWORK_ERROR'
    );
  }
}

/**
 * Nodes API Operations
 * Implements all node-related endpoints from README.md
 */
export const dashboardNodesApi = {
  // POST /orgs/:orgId/nodes — Create a node
  create: async (orgId: string, data: CreateNodeRequest): Promise<DashboardNode> => {
    return apiRequest<DashboardNode>(`/orgs/${orgId}/nodes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /orgs/:orgId/nodes/:nodeId — Get node by id
  getById: async (orgId: string, nodeId: string): Promise<DashboardNode> => {
    return apiRequest<DashboardNode>(`/orgs/${orgId}/nodes/${nodeId}`);
  },

  // GET /orgs/:orgId/nodes?parentId=... — List children ordered by order
  getChildren: async (orgId: string, parentId: string | null): Promise<DashboardNode[]> => {
    const queryParam = parentId === null ? 'parentId=null' : `parentId=${parentId}`;
    return apiRequest<DashboardNode[]>(`/orgs/${orgId}/nodes?${queryParam}`);
  },

  // PATCH /orgs/:orgId/nodes/:nodeId — Update node (rename, order, metadata, managerId, type)
  update: async (orgId: string, nodeId: string, data: UpdateNodeRequest): Promise<DashboardNode> => {
    return apiRequest<DashboardNode>(`/orgs/${orgId}/nodes/${nodeId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // POST /orgs/:orgId/nodes/:nodeId/move — Move/Reparent node
  move: async (orgId: string, nodeId: string, data: MoveNodeRequest): Promise<DashboardNode> => {
    return apiRequest<DashboardNode>(`/orgs/${orgId}/nodes/${nodeId}/move`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // DELETE /orgs/:orgId/nodes/:nodeId — Delete node (fails if it has children or users)
  delete: async (orgId: string, nodeId: string): Promise<void> => {
    return apiRequest<void>(`/orgs/${orgId}/nodes/${nodeId}`, {
      method: 'DELETE',
    });
  },

  // GET /orgs/:orgId/tree — Full nested tree (sorted by order)
  getTree: async (orgId: string): Promise<DashboardNode[]> => {
    return apiRequest<DashboardNode[]>(`/orgs/${orgId}/tree`);
  },
};

/**
 * Users API Operations
 * Implements all user-related endpoints from README.md
 */
export const dashboardUsersApi = {
  // POST /orgs/:orgId/users — Create user
  create: async (orgId: string, data: CreateUserRequest): Promise<DashboardUser> => {
    return apiRequest<DashboardUser>(`/orgs/${orgId}/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /orgs/:orgId/users/:userId — Get user
  getById: async (orgId: string, userId: string): Promise<DashboardUser> => {
    return apiRequest<DashboardUser>(`/orgs/${orgId}/users/${userId}`);
  },

  // GET /orgs/:orgId/users[?nodeId=...] — List users (all or by node)
  getAll: async (orgId: string, nodeId?: string): Promise<DashboardUser[]> => {
    const queryParam = nodeId ? `?nodeId=${nodeId}` : '';
    return apiRequest<DashboardUser[]>(`/orgs/${orgId}/users${queryParam}`);
  },

  // PATCH /orgs/:orgId/users/:userId — Update user (name, email, role, title, status, managerId, nodeIds)
  update: async (orgId: string, userId: string, data: UpdateUserRequest): Promise<DashboardUser> => {
    return apiRequest<DashboardUser>(`/orgs/${orgId}/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // DELETE /orgs/:orgId/users/:userId — Delete user
  delete: async (orgId: string, userId: string): Promise<void> => {
    return apiRequest<void>(`/orgs/${orgId}/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // POST /orgs/:orgId/users/:userId/nodes/:nodeId — Add membership
  addMembership: async (orgId: string, userId: string, nodeId: string): Promise<void> => {
    return apiRequest<void>(`/orgs/${orgId}/users/${userId}/nodes/${nodeId}`, {
      method: 'POST',
    });
  },

  // DELETE /orgs/:orgId/users/:userId/nodes/:nodeId — Remove membership
  removeMembership: async (orgId: string, userId: string, nodeId: string): Promise<void> => {
    return apiRequest<void>(`/orgs/${orgId}/users/${userId}/nodes/${nodeId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Import and Reporting API Operations
 * Implements import and reporting endpoints from README.md
 */
export const dashboardImportApi = {
  // POST /orgs/:orgId/import — Bulk upsert users and tree
  import: async (orgId: string, data: ImportRequest): Promise<any> => {
    return apiRequest<any>(`/orgs/${orgId}/import`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /orgs/:orgId/managers/:userId/reports[?depth=3] — Management reporting tree
  getManagementReports: async (orgId: string, userId: string, depth?: number): Promise<ManagementReport> => {
    const queryParam = depth ? `?depth=${depth}` : '';
    return apiRequest<ManagementReport>(`/orgs/${orgId}/managers/${userId}/reports${queryParam}`);
  },
};

/**
 * Combined Dashboard API object for easy imports
 */
export const dashboardApi = {
  nodes: dashboardNodesApi,
  users: dashboardUsersApi,
  import: dashboardImportApi,
};

export default dashboardApi;