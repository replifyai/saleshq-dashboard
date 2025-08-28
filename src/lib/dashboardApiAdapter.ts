/**
 * Dashboard API Adapter
 * Adapts the Dashboard API to work with the existing organization page structure
 * This allows us to use the new Dashboard API while maintaining compatibility
 * with the current Redux state management and component structure
 */

import { dashboardApi, DashboardNode, DashboardUser } from './dashboardApi';
import type {
  OrganizationHierarchy,
  OrganizationNode,
  OrganizationUser,
  CreateNodeRequest,
  UpdateNodeRequest,
  AssignUserRequest,
  OrganizationFilters,
  OrganizationStats,
} from '@/types/organization';

// Configuration - should come from environment or user context
const DEFAULT_ORG_ID = 'frido'; // This should be dynamic based on user's organization

// Helper function to convert Firestore timestamp to ISO string
function convertFirestoreTimestamp(timestamp: any): string {
  if (timestamp && typeof timestamp === 'object' && timestamp._seconds) {
    return new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000).toISOString();
  }
  // If no timestamp provided, use current time
  return new Date().toISOString();
}

// Helper functions to convert between Dashboard API types and Organization types
function convertDashboardNodeToOrgNode(dashboardNode: DashboardNode & { createdAt?: any; updatedAt?: any }): OrganizationNode | null {
  // Return null if the input is null or undefined
  if (!dashboardNode || typeof dashboardNode !== 'object') {
    return null;
  }

  // Ensure required properties exist
  if (!dashboardNode.id || !dashboardNode.name) {
    return null;
  }

  // Build the organization node
  const orgNode = {
    id: dashboardNode.id,
    name: dashboardNode.name,
    type: dashboardNode.type || 'Unknown',
    parentId: dashboardNode.parentId,
    order: dashboardNode.order ?? 0,
    level: dashboardNode.level ?? 0,
    path: dashboardNode.path || dashboardNode.name,
    metadata: dashboardNode.metadata || {},
    managerId: dashboardNode.managerId ?? undefined,
    children: [], // Will be populated when building hierarchy
    users: [], // Will be populated separately
    createdAt: convertFirestoreTimestamp((dashboardNode as any).createdAt),
    updatedAt: convertFirestoreTimestamp((dashboardNode as any).updatedAt),
  };

  return orgNode;
}

function convertDashboardUserToOrgUser(dashboardUser: DashboardUser & { createdAt?: any; updatedAt?: any }): OrganizationUser | null {
  // Return null if the input is null or undefined
  if (!dashboardUser || typeof dashboardUser !== 'object') {
    return null;
  }

  // Ensure required properties exist
  if (!dashboardUser.id || !dashboardUser.name || !dashboardUser.email) {
    return null;
  }

  // Ensure status is one of the allowed values
  const validStatus = ['active', 'inactive', 'pending'].includes(dashboardUser.status) 
    ? dashboardUser.status as 'active' | 'inactive' | 'pending'
    : 'active';
    
  return {
    id: dashboardUser.id,
    name: dashboardUser.name,
    email: dashboardUser.email,
    role: dashboardUser.role || 'member',
    title: dashboardUser.title,
    status: validStatus,
    managerId: dashboardUser.managerId ?? undefined,
    nodeIds: dashboardUser.nodeIds || [],
    avatar: undefined, // Dashboard API doesn't provide this
    joinedAt: convertFirestoreTimestamp((dashboardUser as any).createdAt),
  };
}

function convertOrgNodeToCreateRequest(orgNode: CreateNodeRequest): {
  id: string;
  name: string;
  type: string;
  parentId: string | null;
  order: number;
  metadata?: Record<string, any>;
} {
  return {
    id: `node_${Date.now()}`, // Generate ID since CreateNodeRequest doesn't have one
    name: orgNode.name,
    type: orgNode.type,
    parentId: orgNode.parentId,
    order: orgNode.order || 0,
    metadata: orgNode.metadata,
  };
}

function buildHierarchyFromNestedNodes(
  nestedNodes: DashboardNode[],
  allUsers: DashboardUser[]
): OrganizationNode[] {
  
  // Create a map for quick user lookup by nodeId
  const usersByNodeId = new Map<string, DashboardUser[]>();
  allUsers.forEach(user => {
    user.nodeIds.forEach(nodeId => {
      if (!usersByNodeId.has(nodeId)) {
        usersByNodeId.set(nodeId, []);
      }
      usersByNodeId.get(nodeId)!.push(user);
    });
  });

  // Recursively convert nested nodes
  const convertNestedNode = (dashboardNode: DashboardNode & { children?: DashboardNode[] }): OrganizationNode | null => {
    // Return null if the input is null or undefined
    if (!dashboardNode) {
      return null;
    }

    // Convert the node itself
    const orgNode = convertDashboardNodeToOrgNode(dashboardNode);
    if (!orgNode) {
      return null;
    }
    
    // Assign users to this node
    const nodeUsers = usersByNodeId.get(dashboardNode.id) || [];
    orgNode.users = nodeUsers
      .map(user => convertDashboardUserToOrgUser(user))
      .filter((user): user is OrganizationUser => user !== null); // Filter out null users
    
    // Recursively convert children
    if (dashboardNode.children && Array.isArray(dashboardNode.children) && dashboardNode.children.length > 0) {
      orgNode.children = dashboardNode.children
        .map(child => convertNestedNode(child))
        .filter((child): child is OrganizationNode => child !== null) // Filter out null children
        .sort((a, b) => a.order - b.order); // Sort by order
    }
    
    return orgNode;
  };

  const hierarchy = nestedNodes
    .filter(node => node !== null && node !== undefined) // Filter out null nodes
    .map(node => convertNestedNode(node))
    .filter((node): node is OrganizationNode => node !== null); // Filter out null results
  
  return hierarchy;
}

function calculateOrgStatsFromNodes(nodes: OrganizationNode[]): OrganizationStats {
  let totalNodes = 0;
  let totalUsers = 0;
  let nodeTypes = new Set<string>();
  let userRoles = new Set<string>();
  let maxDepth = 0;
  let emptyNodes = 0;
  let largestTeam = { nodeId: '', name: '', userCount: 0 };

  const traverse = (nodeList: OrganizationNode[], depth: number = 0) => {
    nodeList.forEach(node => {
      totalNodes++;
      totalUsers += node.users.length;
      nodeTypes.add(node.type);
      maxDepth = Math.max(maxDepth, depth);
      
      if (node.users.length === 0) {
        emptyNodes++;
      }
      
      if (node.users.length > largestTeam.userCount) {
        largestTeam = {
          nodeId: node.id,
          name: node.name,
          userCount: node.users.length
        };
      }
      
      node.users.forEach(user => {
        userRoles.add(user.role);
      });
      
      traverse(node.children, depth + 1);
    });
  };

  traverse(nodes);

  // Create nodesByType and usersByRole objects
  const nodesByType: { [type: string]: number } = {};
  const usersByRole: { [role: string]: number } = {};
  
  nodeTypes.forEach(type => {
    nodesByType[type] = 0;
  });
  
  userRoles.forEach(role => {
    usersByRole[role] = 0;
  });

  // Count nodes by type and users by role
  const countTraverse = (nodeList: OrganizationNode[]) => {
    nodeList.forEach(node => {
      nodesByType[node.type]++;
      node.users.forEach(user => {
        usersByRole[user.role]++;
      });
      countTraverse(node.children);
    });
  };
  
  countTraverse(nodes);

  return {
    totalNodes,
    totalUsers,
    maxDepth,
    avgUsersPerNode: totalNodes > 0 ? totalUsers / totalNodes : 0,
    nodesByType,
    usersByRole,
    emptyNodes,
    largestTeam,
  };
}

/**
 * Dashboard API Adapter Service
 * Provides the same interface as organizationApi but uses Dashboard API internally
 */
export const dashboardApiAdapter = {
  hierarchy: {
    // Get complete organization hierarchy
    getHierarchy: async (filters?: OrganizationFilters): Promise<OrganizationHierarchy> => {
      try {
        // Get tree structure (this gives us the hierarchical nodes)
        const treeResponse = await dashboardApi.nodes.getTree(DEFAULT_ORG_ID);
        
        // Handle null/empty responses
        if (!treeResponse) {
          return {
            nodes: [],
            flatNodes: [],
            totalUsers: 0,
            totalNodes: 0,
            maxDepth: 0,
            nodeTypes: [],
            lastUpdated: new Date().toISOString(),
          };
        }
        
        // Ensure treeNodes is always an array and filter out null values
        const treeNodes = (Array.isArray(treeResponse) ? treeResponse : [treeResponse])
          .filter(node => node !== null && node !== undefined);
        
        // If no valid nodes, return empty hierarchy
        if (treeNodes.length === 0) {
          return {
            nodes: [],
            flatNodes: [],
            totalUsers: 0,
            totalNodes: 0,
            maxDepth: 0,
            nodeTypes: [],
            lastUpdated: new Date().toISOString(),
          };
        }
        
        // Get all users for the organization
        const allUsers = await dashboardApi.users.getAll(DEFAULT_ORG_ID);
        
        // Build hierarchy from nested nodes (ensure allUsers is an array)
        const safeAllUsers = Array.isArray(allUsers) ? allUsers : [];
        const hierarchyNodes = buildHierarchyFromNestedNodes(treeNodes, safeAllUsers);
        
        // Calculate stats
        const stats = calculateOrgStatsFromNodes(hierarchyNodes);
        
        // Calculate additional properties for OrganizationHierarchy
        const flatNodes = hierarchyNodes.reduce((acc: OrganizationNode[], node) => {
          const flatten = (n: OrganizationNode): OrganizationNode[] => {
            return [n, ...n.children.flatMap(flatten)];
          };
          return acc.concat(flatten(node));
        }, []);
        
        const nodeTypes = Array.from(new Set(flatNodes.map(n => n.type)));
        
        const hierarchy: OrganizationHierarchy = {
          nodes: hierarchyNodes,
          flatNodes,
          totalUsers: stats.totalUsers,
          totalNodes: stats.totalNodes,
          maxDepth: stats.maxDepth,
          nodeTypes,
          lastUpdated: new Date().toISOString(),
        };
        
        return hierarchy;
      } catch (error) {
        throw error;
      }
    },

    // Get organization statistics
    getStats: async (): Promise<OrganizationStats> => {
      const hierarchy = await dashboardApiAdapter.hierarchy.getHierarchy();
      return calculateOrgStatsFromNodes(hierarchy.nodes);
    },

    // Search functionality (basic implementation)
    search: async (query: string, filters?: OrganizationFilters): Promise<any[]> => {
      const hierarchy = await dashboardApiAdapter.hierarchy.getHierarchy();
      // Basic search implementation - could be enhanced
      const results: any[] = [];
      
      const searchInNodes = (nodes: OrganizationNode[]) => {
        nodes.forEach(node => {
          if (node.name.toLowerCase().includes(query.toLowerCase()) ||
              node.type.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              node,
              score: 1,
              matchedFields: ['name', 'type'],
            });
          }
          searchInNodes(node.children);
        });
      };
      
      searchInNodes(hierarchy.nodes);
      return results;
    },
  },

  nodes: {
    // Create new organization node
    create: async (data: CreateNodeRequest): Promise<OrganizationNode> => {
      try {
        const createRequest = convertOrgNodeToCreateRequest(data);
        
        const dashboardResponse = await dashboardApi.nodes.create(DEFAULT_ORG_ID, createRequest);
        
        // Handle case where API only returns ID
        let fullNodeData;
        if (dashboardResponse && dashboardResponse.id && !dashboardResponse.name) {
          // Reconstruct the full node data from original request + returned ID
          fullNodeData = {
            id: dashboardResponse.id,
            name: createRequest.name,
            type: createRequest.type,
            parentId: createRequest.parentId,
            order: createRequest.order,
            metadata: createRequest.metadata || {},
            level: 0, // Will be calculated properly in hierarchy
            path: createRequest.name, // Will be calculated properly in hierarchy
          };
        } else {
          fullNodeData = dashboardResponse;
        }
        
        const orgNode = convertDashboardNodeToOrgNode(fullNodeData);
        if (!orgNode) {
          throw new Error('Failed to create node: Invalid response from API');
        }
        
        return orgNode;
      } catch (error) {
        throw error;
      }
    },

    // Get specific node by ID
    getById: async (nodeId: string): Promise<OrganizationNode> => {
      const dashboardNode = await dashboardApi.nodes.getById(DEFAULT_ORG_ID, nodeId);
      const orgNode = convertDashboardNodeToOrgNode(dashboardNode);
      if (!orgNode) {
        throw new Error(`Failed to get node ${nodeId}: Invalid response from API`);
      }
      return orgNode;
    },

    // Update existing node
    update: async (data: UpdateNodeRequest): Promise<OrganizationNode> => {
      const { id, ...updateData } = data;
      const dashboardNode = await dashboardApi.nodes.update(DEFAULT_ORG_ID, id, updateData);
      const orgNode = convertDashboardNodeToOrgNode(dashboardNode);
      if (!orgNode) {
        throw new Error(`Failed to update node ${id}: Invalid response from API`);
      }
      return orgNode;
    },

    // Delete node
    delete: async (nodeId: string, options?: { moveChildrenTo?: string }): Promise<void> => {
      await dashboardApi.nodes.delete(DEFAULT_ORG_ID, nodeId);
    },

    // Move node to different parent
    move: async (data: { nodeId: string; newParentId: string | null; newOrder?: number }): Promise<OrganizationNode> => {
      const { nodeId, newParentId, newOrder } = data;
      const dashboardNode = await dashboardApi.nodes.move(DEFAULT_ORG_ID, nodeId, {
        newParentId,
        newOrder,
      });
      const orgNode = convertDashboardNodeToOrgNode(dashboardNode);
      if (!orgNode) {
        throw new Error(`Failed to move node ${nodeId}: Invalid response from API`);
      }
      return orgNode;
    },

    // Get node children
    getChildren: async (nodeId: string): Promise<OrganizationNode[]> => {
      const children = await dashboardApi.nodes.getChildren(DEFAULT_ORG_ID, nodeId);
      return children
        .map(convertDashboardNodeToOrgNode)
        .filter((node): node is OrganizationNode => node !== null);
    },
  },

  users: {
    // Get all available users for assignment
    getAvailable: async (): Promise<OrganizationUser[]> => {
      const allUsers = await dashboardApi.users.getAll(DEFAULT_ORG_ID);
      return (allUsers || [])
        .map(convertDashboardUserToOrgUser)
        .filter((user): user is OrganizationUser => user !== null);
    },

    // Get users in specific node
    getByNode: async (nodeId: string): Promise<OrganizationUser[]> => {
      const users = await dashboardApi.users.getAll(DEFAULT_ORG_ID, nodeId);
      return (users || [])
        .map(convertDashboardUserToOrgUser)
        .filter((user): user is OrganizationUser => user !== null);
    },

    // Assign single user to node
    assign: async (data: AssignUserRequest): Promise<void> => {
      await dashboardApi.users.addMembership(DEFAULT_ORG_ID, data.userId, data.nodeId);
    },

    // Remove user from node
    remove: async (userId: string, nodeId: string): Promise<void> => {
      await dashboardApi.users.removeMembership(DEFAULT_ORG_ID, userId, nodeId);
    },

    // Update user role/title in node (Dashboard API uses PATCH on user)
    updateRole: async (userId: string, nodeId: string, role: string, title?: string): Promise<void> => {
      // Get current user data first
      const currentUser = await dashboardApi.users.getById(DEFAULT_ORG_ID, userId);
      
      // Update user with new role/title
      await dashboardApi.users.update(DEFAULT_ORG_ID, userId, {
        role,
        title,
      });
    },

    // Create user (new functionality from Dashboard API)
    create: async (data: {
      id: string;
      name: string;
      email: string;
      role: string;
      title?: string;
      status: string;
      managerId?: string | null;
      nodeIds: string[];
    }): Promise<OrganizationUser> => {
      const dashboardUser = await dashboardApi.users.create(DEFAULT_ORG_ID, data);
      const orgUser = convertDashboardUserToOrgUser(dashboardUser);
      if (!orgUser) {
        throw new Error('Failed to create user: Invalid response from API');
      }
      return orgUser;
    },

    // Update user (new functionality from Dashboard API)
    update: async (userId: string, data: {
      name?: string;
      email?: string;
      role?: string;
      title?: string;
      status?: string;
      managerId?: string | null;
      nodeIds?: string[];
    }): Promise<OrganizationUser> => {
      const dashboardUser = await dashboardApi.users.update(DEFAULT_ORG_ID, userId, data);
      const orgUser = convertDashboardUserToOrgUser(dashboardUser);
      if (!orgUser) {
        throw new Error(`Failed to update user ${userId}: Invalid response from API`);
      }
      return orgUser;
    },

    // Delete user (new functionality from Dashboard API)
    delete: async (userId: string): Promise<void> => {
      await dashboardApi.users.delete(DEFAULT_ORG_ID, userId);
    },
  },

  // Import and reporting functionality
  import: {
    // Bulk import users and tree structure
    import: async (data: {
      users: Partial<DashboardUser>[];
      tree: any[];
    }): Promise<any> => {
      return await dashboardApi.import.import(DEFAULT_ORG_ID, data);
    },

    // Get management reporting tree
    getManagementReports: async (userId: string, depth?: number): Promise<any> => {
      return await dashboardApi.import.getManagementReports(DEFAULT_ORG_ID, userId, depth);
    },
  },
};

export default dashboardApiAdapter;