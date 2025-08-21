/**
 * Organization Utilities
 * Helper functions for organization data manipulation and analysis
 */

import type {
  OrganizationNode,
  OrganizationUser,
  OrganizationHierarchy,
  OrganizationStats,
  OrganizationFilters,
  OrganizationSearchResult 
} from '@/types/organization';

// Utility function to create a deep clone
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Build hierarchical structure from flat array of nodes
 */
export function buildHierarchy(flatNodes: OrganizationNode[]): OrganizationNode[] {
  const nodeMap = new Map<string, OrganizationNode>();
  const rootNodes: OrganizationNode[] = [];

  // Create a map of all nodes with empty children arrays
  flatNodes.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  // Build the hierarchy
  flatNodes.forEach(node => {
    const nodeWithChildren = nodeMap.get(node.id)!;
    
    if (node.parentId && nodeMap.has(node.parentId)) {
      const parent = nodeMap.get(node.parentId)!;
      parent.children.push(nodeWithChildren);
    } else {
      rootNodes.push(nodeWithChildren);
    }
  });

  return rootNodes;
}

/**
 * Flatten hierarchical structure to array
 */
export function flattenHierarchy(nodes: OrganizationNode[]): OrganizationNode[] {
  const result: OrganizationNode[] = [];
  
  const traverse = (node: OrganizationNode) => {
    result.push(node);
    node.children.forEach(traverse);
  };
  
  nodes.forEach(traverse);
  return result;
}

/**
 * Find node by ID in hierarchy
 */
export function findNodeById(nodes: OrganizationNode[], nodeId: string): OrganizationNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    const found = findNodeById(node.children, nodeId);
    if (found) return found;
  }
  return null;
}

/**
 * Get ancestors of a node
 */
export function getNodeAncestors(nodes: OrganizationNode[], nodeId: string): OrganizationNode[] {
  const ancestors: OrganizationNode[] = [];
  const node = findNodeById(nodes, nodeId);
  
  if (!node || !node.parentId) return ancestors;
  
  let currentId: string | null = node.parentId;
  while (currentId) {
    const parent = findNodeById(nodes, currentId);
    if (parent) {
      ancestors.unshift(parent);
      currentId = parent.parentId;
    } else {
      break;
    }
  }
  
  return ancestors;
}

/**
 * Get descendants of a node
 */
export function getNodeDescendants(node: OrganizationNode): OrganizationNode[] {
  const descendants: OrganizationNode[] = [];
  
  const traverse = (currentNode: OrganizationNode) => {
    currentNode.children.forEach(child => {
      descendants.push(child);
      traverse(child);
    });
  };
  
  traverse(node);
  return descendants;
}

/**
 * Add node to hierarchy (real-time update)
 */
export function addNodeToHierarchy(
  hierarchy: OrganizationHierarchy, 
  newNode: OrganizationNode
): OrganizationHierarchy {
  const updatedHierarchy = deepClone(hierarchy);
  
  if (newNode.parentId) {
    // Find parent and add as child
    const parent = findNodeById(updatedHierarchy.nodes, newNode.parentId);
    if (parent) {
      parent.children.push(newNode);
    }
  } else {
    // Add as root node
    updatedHierarchy.nodes.push(newNode);
  }
  
  // Update flat nodes and stats
  updatedHierarchy.flatNodes = flattenHierarchy(updatedHierarchy.nodes);
  updatedHierarchy.totalNodes = updatedHierarchy.flatNodes.length;
  updatedHierarchy.totalUsers = getTotalUserCount(updatedHierarchy.flatNodes);
  
  return updatedHierarchy;
}

/**
 * Update node in hierarchy (real-time update)
 */
export function updateNodeInHierarchy(
  hierarchy: OrganizationHierarchy,
  updatedNode: Partial<OrganizationNode> & { id: string }
): OrganizationHierarchy {
  const updatedHierarchy = deepClone(hierarchy);
  
  const updateInNodes = (nodes: OrganizationNode[]): boolean => {
    for (const node of nodes) {
      if (node.id === updatedNode.id) {
        Object.assign(node, updatedNode, { updatedAt: new Date().toISOString() });
        return true;
      }
      if (updateInNodes(node.children)) {
        return true;
      }
    }
    return false;
  };
  
  updateInNodes(updatedHierarchy.nodes);
  
  // Update flat nodes and stats
  updatedHierarchy.flatNodes = flattenHierarchy(updatedHierarchy.nodes);
  updatedHierarchy.lastUpdated = new Date().toISOString();
  
  return updatedHierarchy;
}

/**
 * Remove node from hierarchy (real-time update)
 */
export function removeNodeFromHierarchy(
  hierarchy: OrganizationHierarchy,
  nodeId: string,
  moveChildrenTo?: string
): OrganizationHierarchy {
  const updatedHierarchy = deepClone(hierarchy);
  
  const removeFromNodes = (nodes: OrganizationNode[], parentNodes?: OrganizationNode[]): boolean => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      if (node.id === nodeId) {
        // Handle children
        if (moveChildrenTo && parentNodes) {
          const newParent = findNodeById(updatedHierarchy.nodes, moveChildrenTo);
          if (newParent) {
            node.children.forEach(child => {
              child.parentId = moveChildrenTo;
              newParent.children.push(child);
            });
          }
        } else if (parentNodes) {
          // Move children to the same level as the deleted node
          node.children.forEach(child => {
            child.parentId = node.parentId;
            parentNodes.push(child);
          });
        }
        
        // Remove the node
        nodes.splice(i, 1);
        return true;
      }
      
      if (removeFromNodes(node.children, nodes)) {
        return true;
      }
    }
    return false;
  };
  
  removeFromNodes(updatedHierarchy.nodes);
  
  // Update flat nodes and stats
  updatedHierarchy.flatNodes = flattenHierarchy(updatedHierarchy.nodes);
  updatedHierarchy.totalNodes = updatedHierarchy.flatNodes.length;
  updatedHierarchy.totalUsers = getTotalUserCount(updatedHierarchy.flatNodes);
  updatedHierarchy.lastUpdated = new Date().toISOString();
  
  return updatedHierarchy;
}

/**
 * Add user to node (real-time update)
 */
export function addUserToNode(
  hierarchy: OrganizationHierarchy,
  nodeId: string,
  user: OrganizationUser
): OrganizationHierarchy {
  const updatedHierarchy = deepClone(hierarchy);
  
  const node = findNodeById(updatedHierarchy.nodes, nodeId);
  if (node) {
    // Add user to node if not already present
    if (!node.users.find(u => u.id === user.id)) {
      const updatedUser = { ...user, nodeIds: [...user.nodeIds, nodeId] };
      node.users.push(updatedUser);
    }
  }
  
  // Update flat nodes and stats
  updatedHierarchy.flatNodes = flattenHierarchy(updatedHierarchy.nodes);
  updatedHierarchy.totalUsers = getTotalUserCount(updatedHierarchy.flatNodes);
  updatedHierarchy.lastUpdated = new Date().toISOString();
  
  return updatedHierarchy;
}

/**
 * Remove user from node (real-time update)
 */
export function removeUserFromNode(
  hierarchy: OrganizationHierarchy,
  nodeId: string,
  userId: string
): OrganizationHierarchy {
  const updatedHierarchy = deepClone(hierarchy);
  
  const node = findNodeById(updatedHierarchy.nodes, nodeId);
  if (node) {
    const userIndex = node.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      const user = node.users[userIndex];
      // Update user's nodeIds
      user.nodeIds = user.nodeIds.filter(id => id !== nodeId);
      // Remove user from node if no longer assigned to any nodes
      if (user.nodeIds.length === 0) {
        node.users.splice(userIndex, 1);
      }
    }
  }
  
  // Update flat nodes and stats
  updatedHierarchy.flatNodes = flattenHierarchy(updatedHierarchy.nodes);
  updatedHierarchy.totalUsers = getTotalUserCount(updatedHierarchy.flatNodes);
  updatedHierarchy.lastUpdated = new Date().toISOString();
  
  return updatedHierarchy;
}

/**
 * Update user in node (real-time update)
 */
export function updateUserInNode(
  hierarchy: OrganizationHierarchy,
  nodeId: string,
  userId: string,
  updates: Partial<OrganizationUser>
): OrganizationHierarchy {
  const updatedHierarchy = deepClone(hierarchy);
  
  const node = findNodeById(updatedHierarchy.nodes, nodeId);
  if (node) {
    const user = node.users.find(u => u.id === userId);
    if (user) {
      Object.assign(user, updates);
    }
  }
  
  // Update flat nodes and stats
  updatedHierarchy.flatNodes = flattenHierarchy(updatedHierarchy.nodes);
  updatedHierarchy.lastUpdated = new Date().toISOString();
  
  return updatedHierarchy;
}

/**
 * Search nodes based on query and filters
 */
export function searchNodes(
  nodes: OrganizationNode[], 
  query: string, 
  filters?: OrganizationFilters
): OrganizationSearchResult[] {
  const results: OrganizationSearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  
  const searchInNode = (node: OrganizationNode) => {
    let score = 0;
    let matchType: OrganizationSearchResult['matchType'] = 'name';
    
    // Check name match
    if (node.name.toLowerCase().includes(lowerQuery)) {
      score += 10;
      matchType = 'name';
    }
    
    // Check type match
    if (node.type.toLowerCase().includes(lowerQuery)) {
      score += 5;
      matchType = 'type';
    }
    
    // Check description match
    if (node.description?.toLowerCase().includes(lowerQuery)) {
      score += 3;
      matchType = 'description';
    }
    
    // Check user matches
    const userMatch = node.users.some(user => 
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
    );
    if (userMatch) {
      score += 2;
      matchType = 'user';
    }
    
    if (score > 0) {
      results.push({ node, matchType, score });
    }
    
    // Search children
    node.children.forEach(searchInNode);
  };
  
  nodes.forEach(searchInNode);
  
  // Apply filters if provided
  let filteredResults = results;
  if (filters) {
    filteredResults = filterSearchResults(results, filters);
  }
  
  // Sort by score (highest first)
  return filteredResults.sort((a, b) => b.score - a.score);
}

/**
 * Filter nodes based on criteria
 */
export function filterNodes(nodes: OrganizationNode[], filters: OrganizationFilters): OrganizationNode[] {
  const filtered: OrganizationNode[] = [];
  
  const filterNode = (node: OrganizationNode): boolean => {
    let matches = true;
    
    // Filter by node types
    if (filters.nodeTypes && filters.nodeTypes.length > 0) {
      matches = matches && filters.nodeTypes.includes(node.type);
    }
    
    // Filter by user roles
    if (filters.userRoles && filters.userRoles.length > 0) {
      const hasMatchingRole = node.users.some(user => 
        filters.userRoles!.includes(user.role)
      );
      matches = matches && hasMatchingRole;
    }
    
    // Filter by location
    if (filters.locations && filters.locations.length > 0) {
      const location = node.metadata?.location;
      matches = matches && Boolean(location && filters.locations.includes(location));
    }
    
    // Filter by level
    if (filters.minLevel !== undefined) {
      matches = matches && node.level >= filters.minLevel;
    }
    if (filters.maxLevel !== undefined) {
      matches = matches && node.level <= filters.maxLevel;
    }
    
    // Filter by has users
    if (filters.hasUsers !== undefined) {
      const hasUsers = node.users.length > 0;
      matches = matches && (filters.hasUsers ? hasUsers : !hasUsers);
    }
    
    return matches;
  };
  
  const traverseAndFilter = (nodeList: OrganizationNode[]) => {
    nodeList.forEach(node => {
      const nodeMatches = filterNode(node);
      const filteredChildren = filterNodes(node.children, filters);
      
      if (nodeMatches || filteredChildren.length > 0) {
        filtered.push({
          ...node,
          children: filteredChildren
        });
      }
    });
  };
  
  traverseAndFilter(nodes);
  return filtered;
}

function filterSearchResults(
  results: OrganizationSearchResult[], 
  filters: OrganizationFilters
): OrganizationSearchResult[] {
  return results.filter(result => {
    const nodes = [result.node];
    const filteredNodes = filterNodes(nodes, filters);
    return filteredNodes.length > 0;
  });
}

/**
 * Calculate organization statistics
 */
export function calculateOrgStats(hierarchy: OrganizationHierarchy): OrganizationStats {
  const flatNodes = hierarchy.flatNodes;
  const allUsers = getAllUsers(flatNodes);
  
  // Calculate node types distribution
  const nodesByType: { [type: string]: number } = {};
  flatNodes.forEach(node => {
    nodesByType[node.type] = (nodesByType[node.type] || 0) + 1;
  });
  
  // Calculate user roles distribution
  const usersByRole: { [role: string]: number } = {};
  allUsers.forEach(user => {
    usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
  });
  
  // Find largest team
  let largestTeam = { nodeId: '', name: '', userCount: 0 };
  flatNodes.forEach(node => {
    if (node.users.length > largestTeam.userCount) {
      largestTeam = {
        nodeId: node.id,
        name: node.name,
        userCount: node.users.length
      };
    }
  });
  
  // Count empty nodes
  const emptyNodes = flatNodes.filter(node => node.users.length === 0).length;
  
  // Calculate max depth
  const maxDepth = Math.max(...flatNodes.map(node => node.level), 0);
  
  return {
    totalNodes: flatNodes.length,
    totalUsers: allUsers.length,
    maxDepth,
    avgUsersPerNode: flatNodes.length > 0 ? allUsers.length / flatNodes.length : 0,
    nodesByType,
    usersByRole,
    emptyNodes,
    largestTeam
  };
}

/**
 * Get all users from hierarchy
 */
export function getAllUsers(nodes: OrganizationNode[]): OrganizationUser[] {
  const users: OrganizationUser[] = [];
  const userMap = new Map<string, OrganizationUser>();
  
  nodes.forEach(node => {
    node.users.forEach(user => {
      if (!userMap.has(user.id)) {
        userMap.set(user.id, user);
        users.push(user);
      }
    });
  });
  
  return users;
}

/**
 * Get total user count (avoiding duplicates)
 */
export function getTotalUserCount(nodes: OrganizationNode[]): number {
  return getAllUsers(nodes).length;
}

/**
 * Get total user count for a single node and its descendants
 */
export function getNodeUserCount(node: OrganizationNode): number {
  const allDescendants = [node, ...getNodeDescendants(node)];
  return getTotalUserCount(allDescendants);
}

/**
 * Find all nodes where a user is assigned
 */
export function findUserNodes(nodes: OrganizationNode[], userId: string): OrganizationNode[] {
  const userNodes: OrganizationNode[] = [];
  
  const searchInNode = (node: OrganizationNode) => {
    if (node.users.some(user => user.id === userId)) {
      userNodes.push(node);
    }
    node.children.forEach(searchInNode);
  };
  
  nodes.forEach(searchInNode);
  return userNodes;
}

/**
 * Get user's reporting chain
 */
export function getUserReportingChain(nodes: OrganizationNode[], userId: string): OrganizationUser[] {
  const allUsers = getAllUsers(nodes);
  const user = allUsers.find(u => u.id === userId);
  
  if (!user) return [];
  
  const chain: OrganizationUser[] = [];
  let currentManagerId: string | undefined = user.managerId;
  
  while (currentManagerId) {
    const currentManager = findUserInHierarchy(nodes, currentManagerId);
    if (currentManager) {
      chain.push(currentManager);
      currentManagerId = currentManager.managerId;
    } else {
      break;
    }
  }
  
  return chain;
}

/**
 * Find user in hierarchy by ID
 */
export function findUserInHierarchy(nodes: OrganizationNode[], userId: string): OrganizationUser | null {
  for (const node of nodes) {
    const user = node.users.find(u => u.id === userId);
    if (user) return user;
    
    const found = findUserInHierarchy(node.children, userId);
    if (found) return found;
  }
  return null;
}

/**
 * Calculate path string for a node
 */
export function calculateNodePath(nodes: OrganizationNode[], nodeId: string): string {
  const ancestors = getNodeAncestors(nodes, nodeId);
  const node = findNodeById(nodes, nodeId);
  
  if (!node) return '';
  
  const pathParts = ancestors.map(ancestor => ancestor.name);
  pathParts.push(node.name);
  
  return pathParts.join('/');
}

/**
 * Update node paths and levels in hierarchy
 */
export function updateNodePaths(nodes: OrganizationNode[], parentPath = '', parentLevel = -1): OrganizationNode[] {
  return nodes.map(node => {
    const level = parentLevel + 1;
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;
    
    return {
      ...node,
      level,
      path,
      children: updateNodePaths(node.children, path, level)
    };
  });
}

export default {
  buildHierarchy,
  flattenHierarchy,
  findNodeById,
  getNodeAncestors,
  getNodeDescendants,
  addNodeToHierarchy,
  updateNodeInHierarchy,
  removeNodeFromHierarchy,
  addUserToNode,
  removeUserFromNode,
  updateUserInNode,
  searchNodes,
  filterNodes,
  calculateOrgStats,
  getAllUsers,
  getTotalUserCount,
  findUserNodes,
  getUserReportingChain,
  findUserInHierarchy,
  calculateNodePath,
  updateNodePaths,
  deepClone,
};