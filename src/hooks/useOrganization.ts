/**
 * Organization Management Hooks
 * Custom hooks for managing organization data, state, and operations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { organizationApi } from '@/lib/organizationApi';
import { 
  mockAvailableUsers, 
  getMockHierarchy 
} from '@/lib/mockOrganizationData';
import {
  flattenHierarchy,
  findNodeById,
  searchNodes,
  filterNodes,
  calculateOrgStats,
} from '@/lib/organizationUtils';

import type {
  OrganizationHierarchy,
  OrganizationNode,
  OrganizationUser,
  OrganizationFilters,
  CreateNodeRequest,
  UpdateNodeRequest,
  AssignUserRequest,
  OrganizationSearchResult,
  OrganizationPermission,
} from '@/types/organization';

// Main organization data hook
export function useOrganization() {
  const { user: _user } = useAuth();
  const [hierarchy, setHierarchy] = useState<OrganizationHierarchy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load organization hierarchy
  const loadHierarchy = useCallback(async (filters?: OrganizationFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data in development or when API is not available
      const useMockData = process.env.DEV || process.env.VITE_USE_MOCK_DATA;
      
      let data;
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        data = getMockHierarchy(filters);
      } else {
        data = await organizationApi.hierarchy.getHierarchy(filters);
      }
      
      setHierarchy(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organization');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    loadHierarchy();
  }, [loadHierarchy]);

  // Initial load
  useEffect(() => {
    loadHierarchy();
  }, [loadHierarchy]);

  // Computed values
  const stats = useMemo(() => {
    return hierarchy ? calculateOrgStats(hierarchy) : null;
  }, [hierarchy]);

  const flatNodes = useMemo(() => {
    return hierarchy ? flattenHierarchy(hierarchy.nodes) : [];
  }, [hierarchy]);

  const allUsers = useMemo(() => {
    return flatNodes.reduce((users: OrganizationUser[], node) => {
      return [...users, ...node.users];
    }, []);
  }, [flatNodes]);

  return {
    hierarchy,
    flatNodes,
    allUsers,
    stats,
    loading,
    error,
    lastUpdated,
    refresh,
    loadHierarchy,
  };
}

// Hook for organization node operations
export function useOrganizationNodes() {
  const { hierarchy, refresh } = useOrganization();
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  // Create new node
  const createNode = useCallback(async (data: CreateNodeRequest): Promise<OrganizationNode | null> => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      
      // Use mock data in development or when API is not available
      const useMockData = process.env.DEV || process.env.VITE_USE_MOCK_DATA;
      
      let newNode;
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Mock: Creating organization node:', data);
        // In a real implementation, this would be handled by the backend
        newNode = { 
          id: `node_${Date.now()}`, 
          ...data, 
          children: [], 
          users: [], 
          level: 0, 
          path: data.name,
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as OrganizationNode;
      } else {
        newNode = await organizationApi.nodes.create(data);
      }
      
      await refresh(); // Refresh hierarchy after creation
      return newNode;
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Failed to create node');
      return null;
    } finally {
      setOperationLoading(false);
    }
  }, [refresh]);

  // Update existing node
  const updateNode = useCallback(async (data: UpdateNodeRequest): Promise<OrganizationNode | null> => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      const updatedNode = await organizationApi.nodes.update(data);
      await refresh(); // Refresh hierarchy after update
      return updatedNode;
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Failed to update node');
      return null;
    } finally {
      setOperationLoading(false);
    }
  }, [refresh]);

  // Delete node
  const deleteNode = useCallback(async (nodeId: string, moveChildrenTo?: string): Promise<boolean> => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      await organizationApi.nodes.delete(nodeId, { moveChildrenTo });
      await refresh(); // Refresh hierarchy after deletion
      return true;
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Failed to delete node');
      return false;
    } finally {
      setOperationLoading(false);
    }
  }, [refresh]);

  // Move node
  const moveNode = useCallback(async (nodeId: string, newParentId: string | null, newOrder?: number): Promise<boolean> => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      await organizationApi.nodes.move({ nodeId, newParentId, newOrder });
      await refresh(); // Refresh hierarchy after move
      return true;
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Failed to move node');
      return false;
    } finally {
      setOperationLoading(false);
    }
  }, [refresh]);

  // Get node by ID
  const getNode = useCallback((nodeId: string): OrganizationNode | null => {
    return hierarchy ? findNodeById(hierarchy.nodes, nodeId) : null;
  }, [hierarchy]);

  return {
    createNode,
    updateNode,
    deleteNode,
    moveNode,
    getNode,
    operationLoading,
    operationError,
  };
}

// Hook for user management operations
export function useOrganizationUsers() {
  const { refresh } = useOrganization();
  const [availableUsers, setAvailableUsers] = useState<OrganizationUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Load available users
  const loadAvailableUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      
      // Use mock data in development or when API is not available
      const useMockData = process.env.DEV || process.env.VITE_USE_MOCK_DATA;
      
      let users;
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        users = mockAvailableUsers;
      } else {
        users = await organizationApi.users.getAvailable();
      }
      
      setAvailableUsers(users);
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Assign user to node
  const assignUser = useCallback(async (data: AssignUserRequest): Promise<boolean> => {
    try {
      setOperationLoading(true);
      
      // Use mock data in development or when API is not available
      const useMockData = process.env.DEV || process.env.VITE_USE_MOCK_DATA;
      
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Mock: Assigning user to node:', data);
      } else {
        await organizationApi.users.assign(data);
      }
      
      await Promise.all([refresh(), loadAvailableUsers()]); // Refresh both hierarchy and available users
      return true;
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Failed to assign user');
      return false;
    } finally {
      setOperationLoading(false);
    }
  }, [refresh, loadAvailableUsers]);

  // Remove user from node
  const removeUser = useCallback(async (userId: string, nodeId: string): Promise<boolean> => {
    try {
      setOperationLoading(true);
      await organizationApi.users.remove(userId, nodeId);
      await Promise.all([refresh(), loadAvailableUsers()]);
      return true;
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Failed to remove user');
      return false;
    } finally {
      setOperationLoading(false);
    }
  }, [refresh, loadAvailableUsers]);

  // Update user role
  const updateUserRole = useCallback(async (userId: string, nodeId: string, role: string, title?: string): Promise<boolean> => {
    try {
      setOperationLoading(true);
      await organizationApi.users.updateRole(userId, nodeId, role, title);
      await refresh();
      return true;
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Failed to update user role');
      return false;
    } finally {
      setOperationLoading(false);
    }
  }, [refresh]);

  // Transfer user between nodes
  const transferUser = useCallback(async (userId: string, fromNodeId: string, toNodeId: string): Promise<boolean> => {
    try {
      setOperationLoading(true);
      await organizationApi.users.transfer(userId, fromNodeId, toNodeId);
      await refresh();
      return true;
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Failed to transfer user');
      return false;
    } finally {
      setOperationLoading(false);
    }
  }, [refresh]);

  // Load available users on mount
  useEffect(() => {
    loadAvailableUsers();
  }, [loadAvailableUsers]);

  return {
    availableUsers,
    usersLoading,
    usersError,
    operationLoading,
    assignUser,
    removeUser,
    updateUserRole,
    transferUser,
    loadAvailableUsers,
  };
}

// Hook for search and filtering
export function useOrganizationSearch() {
  const { hierarchy } = useOrganization();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<OrganizationFilters>({});
  const [searchResults, setSearchResults] = useState<OrganizationSearchResult[]>([]);

  // Perform search
  const search = useCallback((query: string, searchFilters?: OrganizationFilters) => {
    if (!hierarchy) return;

    const results = searchNodes(hierarchy.nodes, query, searchFilters);
    setSearchResults(results);
    setSearchTerm(query);
    if (searchFilters) setFilters(searchFilters);
  }, [hierarchy]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setFilters({});
    setSearchResults([]);
  }, []);

  // Filter nodes without search
  const applyFilters = useCallback((newFilters: OrganizationFilters) => {
    setFilters(newFilters);
    if (searchTerm) {
      search(searchTerm, newFilters);
    }
  }, [searchTerm, search]);

  // Get filtered nodes
  const filteredNodes = useMemo(() => {
    if (!hierarchy) return [];
    
    if (Object.keys(filters).length === 0 && !searchTerm) {
      return hierarchy.nodes;
    }
    
    if (searchTerm) {
      return searchResults.map(result => result.node);
    }
    
    return filterNodes(hierarchy.nodes, filters);
  }, [hierarchy, filters, searchTerm, searchResults]);

  return {
    searchTerm,
    filters,
    searchResults,
    filteredNodes,
    search,
    clearSearch,
    applyFilters,
  };
}

// Hook for permissions and access control
export function useOrganizationPermissions() {
  const { user: _user } = useAuth();

  const hasPermission = useCallback((permission: OrganizationPermission, _nodeId?: string): boolean => {
    if (!_user) return false;

    // Super admin has all permissions
    if (_user.role === 'admin') return true;

    // Admin has most permissions
    if (_user.role === 'agent') {
      return true; // All permissions for admin
    }

    // Manager permissions
    if (_user.role === 'manager') {
      const managerPermissions: OrganizationPermission[] = [
        'view_org',
        'create_nodes',
        'edit_nodes',
        'assign_users',
        'view_all_users',
      ];
      return managerPermissions.includes(permission);
    }

    // Default user permissions
    const userPermissions: OrganizationPermission[] = ['view_org'];
    return userPermissions.includes(permission);
  }, [_user]);

  const canEditNode = useCallback((nodeId: string): boolean => {
    return hasPermission('edit_nodes', nodeId);
  }, [hasPermission]);

  const canDeleteNode = useCallback((nodeId: string): boolean => {
    return hasPermission('delete_nodes', nodeId);
  }, [hasPermission]);

  const canAssignUsers = useCallback((nodeId: string): boolean => {
    return hasPermission('assign_users', nodeId);
  }, [hasPermission]);

  const canCreateNodes = useCallback((): boolean => {
    return hasPermission('create_nodes');
  }, [hasPermission]);

  return {
    hasPermission,
    canEditNode,
    canDeleteNode,
    canAssignUsers,
    canCreateNodes,
  };
}

// Hook for organization analytics
export function useOrganizationAnalytics() {
  const { stats } = useOrganization();
  const [healthMetrics, setHealthMetrics] = useState<any>(null);
  const [growthTrends, setGrowthTrends] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const loadHealthMetrics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      
      // Use mock data in development or when API is not available
      const useMockData = process.env.DEV || process.env.VITE_USE_MOCK_DATA;
      
      let metrics;
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        // Mock health metrics
        metrics = {
          totalNodes: 8,
          totalUsers: 10,
          nodeUtilization: 0.75,
          avgManagerSpan: 3.2,
          managerSpan: 3.2,
          emptyNodes: 2,
          bottlenecks: []
        };
      } else {
        metrics = await organizationApi.analytics.getHealthMetrics();
      }
      
      setHealthMetrics(metrics);
    } catch (err) {
      console.error('Failed to load health metrics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  const loadGrowthTrends = useCallback(async (period: 'week' | 'month' | 'quarter' | 'year') => {
    try {
      setAnalyticsLoading(true);
      
      // Use mock data in development or when API is not available
      const useMockData = process.env.DEV || process.env.VITE_USE_MOCK_DATA;
      
      let trends;
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        // Mock growth trends
        trends = {
          nodeGrowth: [
            { date: '2024-01', count: 5 },
            { date: '2024-02', count: 6 },
            { date: '2024-03', count: 8 },
          ],
          userGrowth: [
            { date: '2024-01', count: 8 },
            { date: '2024-02', count: 9 },
            { date: '2024-03', count: 10 },
          ]
        };
      } else {
        trends = await organizationApi.analytics.getGrowthTrends(period);
      }
      
      setGrowthTrends(trends);
    } catch (err) {
      console.error('Failed to load growth trends:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  return {
    stats,
    healthMetrics,
    growthTrends,
    analyticsLoading,
    loadHealthMetrics,
    loadGrowthTrends,
  };
}

// Hook for expanded/collapsed state management
export function useOrganizationExpansion(defaultExpansionLevel: number = 1) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [autoExpandLevel, setAutoExpandLevel] = useState(defaultExpansionLevel);

  const toggleNode = useCallback((nodeId: string) => {
    console.log('🔄 Toggling node:', nodeId);
    
    setExpandedNodes(prev => {
      const newExpandedSet = new Set(prev);
      const isCurrentlyExpanded = newExpandedSet.has(nodeId);
      
      if (isCurrentlyExpanded) {
        newExpandedSet.delete(nodeId);
      } else {
        newExpandedSet.add(nodeId);
      }
      
      return newExpandedSet;
    });
    
    setCollapsedNodes(prev => {
      const newCollapsedSet = new Set(prev);
      const isCurrentlyCollapsed = newCollapsedSet.has(nodeId);
      
      if (isCurrentlyCollapsed) {
        newCollapsedSet.delete(nodeId);
      } else {
        newCollapsedSet.add(nodeId);
      }
      
      return newCollapsedSet;
    });
  }, []);

  const expandNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => new Set(prev).add(nodeId));
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
  }, []);

  const collapseNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
    setCollapsedNodes(prev => new Set(prev).add(nodeId));
  }, []);

  const expandAll = useCallback((nodes: OrganizationNode[]) => {
    const allNodeIds = flattenHierarchy(nodes).map(node => node.id);
    setExpandedNodes(new Set(allNodeIds));
    setCollapsedNodes(new Set());
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
    const allNodeIds = Array.from(expandedNodes);
    setCollapsedNodes(new Set(allNodeIds));
  }, [expandedNodes]);

  const expandToLevel = useCallback((nodes: OrganizationNode[], level: number) => {
    const allNodes = flattenHierarchy(nodes);
    const nodesToExpand = allNodes
      .filter(node => node.level < level)
      .map(node => node.id);
    const nodesToCollapse = allNodes
      .filter(node => node.level >= level)
      .map(node => node.id);
    
    setExpandedNodes(new Set(nodesToExpand));
    setCollapsedNodes(new Set(nodesToCollapse));
  }, []);

  const isExpanded = useCallback((nodeId: string, nodeLevel: number): boolean => {
    const isExplicitlyExpanded = expandedNodes.has(nodeId);
    const isExplicitlyCollapsed = collapsedNodes.has(nodeId);
    const shouldAutoExpand = nodeLevel < autoExpandLevel;
    
    if (isExplicitlyExpanded) {
      return true;
    } else if (isExplicitlyCollapsed) {
      return false;
    } else {
      return shouldAutoExpand;
    }
  }, [expandedNodes, collapsedNodes, autoExpandLevel]);

  return {
    expandedNodes: Array.from(expandedNodes),
    toggleNode,
    expandNode,
    collapseNode,
    expandAll,
    collapseAll,
    expandToLevel,
    isExpanded,
    autoExpandLevel,
    setAutoExpandLevel,
  };
}

// Hook for drag and drop operations
export function useOrganizationDragDrop() {
  const { moveNode } = useOrganizationNodes();
  const [draggedNode, setDraggedNode] = useState<OrganizationNode | null>(null);
  const [dropTarget, setDropTarget] = useState<OrganizationNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = useCallback((node: OrganizationNode) => {
    setDraggedNode(node);
    setIsDragging(true);
  }, []);

  const endDrag = useCallback(() => {
    setDraggedNode(null);
    setDropTarget(null);
    setIsDragging(false);
  }, []);

  const setDragTarget = useCallback((node: OrganizationNode | null) => {
    setDropTarget(node);
  }, []);

  const performDrop = useCallback(async (): Promise<boolean> => {
    if (!draggedNode || !dropTarget) return false;

    const success = await moveNode(draggedNode.id, dropTarget.id);
    endDrag();
    return success;
  }, [draggedNode, dropTarget, moveNode, endDrag]);

  const canDrop = useCallback((sourceNode: OrganizationNode, targetNode: OrganizationNode): boolean => {
    // Prevent dropping on self
    if (sourceNode.id === targetNode.id) return false;
    
    // Prevent dropping parent on its descendant
    if (targetNode.path.startsWith(sourceNode.path)) return false;
    
    return true;
  }, []);

  return {
    draggedNode,
    dropTarget,
    isDragging,
    startDrag,
    endDrag,
    setDragTarget,
    performDrop,
    canDrop,
  };
}