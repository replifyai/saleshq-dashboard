/**
 * Organization Redux Hooks
 * Replacement hooks that use Redux instead of local state
 */

import { useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useAppDispatch, useAppSelector } from '@/appstore/hooks';
import {
  loadOrganizationHierarchy,
  loadAvailableUsers,
  createOrganizationNode,
  updateOrganizationNode,
  deleteOrganizationNode,
  moveOrganizationNode,
  assignUserToNode,
  removeUserFromNode,
  updateUserRole,
  setSelectedNode,
  toggleNodeExpansion,
  expandNode,
  collapseNode,
  expandAll,
  collapseAll,
  setFilters,
  setSearchTerm,
  clearSearch,
  clearErrors,
  setChatNodeContext,
  addMentionedNode,
  removeMentionedNode,
} from '@/appstore/slices/organizationSlice';
import {
  flattenHierarchy,
  findNodeById,
  searchNodes,
  filterNodes,
} from '@/lib/organizationUtils';
import type {
  OrganizationFilters,
  OrganizationNode,
  OrganizationUser,
  CreateNodeRequest,
  UpdateNodeRequest,
  AssignUserRequest,
  OrganizationPermission,
  OrganizationSearchResult,
} from '@/types/organization';

// Main organization data hook (replaces useOrganization)
export function useOrganizationRedux() {
  const dispatch = useAppDispatch();
  const {
    hierarchy,
    availableUsers,
    selectedNode,
    loading,
    operationLoading,
    usersLoading,
    error,
    operationError,
    usersError,
    expandedNodes,
    filters,
    searchTerm,
    stats,
    lastUpdated,
    chatContext,
  } = useAppSelector((state) => state.organization);

  // Load organization hierarchy
  const loadHierarchy = useCallback((filters?: OrganizationFilters) => {
    dispatch(loadOrganizationHierarchy(filters));
  }, [dispatch]);

  // Refresh data
  const refresh = useCallback(() => {
    dispatch(loadOrganizationHierarchy());
    dispatch(loadAvailableUsers());
  }, [dispatch]);

  // Initial load
  useEffect(() => {
    if (!hierarchy) {
      loadHierarchy();
    }
    if (availableUsers.length === 0) {
      dispatch(loadAvailableUsers());
    }
  }, [loadHierarchy, dispatch, hierarchy, availableUsers.length]);

  // Computed values
  const flatNodes = useMemo(() => {
    return hierarchy ? flattenHierarchy(hierarchy.nodes) : [];
  }, [hierarchy]);

  const allUsers = useMemo(() => {
    return flatNodes.reduce((users: OrganizationUser[], node) => {
      return [...users, ...node.users];
    }, [] as OrganizationUser[]);
  }, [flatNodes]);

  // Clear errors
  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return {
    // Data
    hierarchy,
    flatNodes,
    allUsers,
    availableUsers,
    selectedNode,
    stats,
    
    // Loading states
    loading,
    operationLoading,
    usersLoading,
    
    // Error states
    error,
    operationError,
    usersError,
    
    // UI state
    expandedNodes,
    filters,
    searchTerm,
    
    // Chat integration
    chatContext,
    
    // Metadata
    lastUpdated,
    
    // Actions
    refresh,
    loadHierarchy,
    clearAllErrors,
  };
}

// Hook for organization node operations (replaces useOrganizationNodes)
export function useOrganizationNodesRedux() {
  const dispatch = useAppDispatch();
  const { hierarchy, operationLoading, operationError } = useAppSelector((state) => state.organization);

  // Create new node
  const createNode = useCallback(async (data: CreateNodeRequest) => {
    const result = await dispatch(createOrganizationNode(data));
    return result.meta.requestStatus === 'fulfilled' ? result.payload : null;
  }, [dispatch]);

  // Update existing node
  const updateNode = useCallback(async (data: UpdateNodeRequest) => {
    const result = await dispatch(updateOrganizationNode(data));
    return result.meta.requestStatus === 'fulfilled' ? result.payload : null;
  }, [dispatch]);

  // Delete node
  const deleteNode = useCallback(async (nodeId: string, moveChildrenTo?: string) => {
    const result = await dispatch(deleteOrganizationNode({ nodeId, moveChildrenTo }));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  // Move node
  const moveNode = useCallback(async (nodeId: string, newParentId: string | null, newOrder?: number) => {
    const result = await dispatch(moveOrganizationNode({ nodeId, newParentId, newOrder }));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  // Get node by ID
  const getNode = useCallback((nodeId: string): OrganizationNode | null => {
    return hierarchy ? findNodeById(hierarchy.nodes, nodeId) : null;
  }, [hierarchy]);

  // Set selected node
  const selectNode = useCallback((node: OrganizationNode | null) => {
    dispatch(setSelectedNode(node));
  }, [dispatch]);

  return {
    createNode,
    updateNode,
    deleteNode,
    moveNode,
    getNode,
    selectNode,
    operationLoading,
    operationError,
  };
}

// Hook for user management operations (replaces useOrganizationUsers)
export function useOrganizationUsersRedux() {
  const dispatch = useAppDispatch();
  const { availableUsers, usersLoading, usersError, operationLoading } = useAppSelector((state) => state.organization);

  // Load available users
  const loadUsers = useCallback(() => {
    dispatch(loadAvailableUsers());
  }, [dispatch]);

  // Assign user to node
  const assignUser = useCallback(async (data: AssignUserRequest) => {
    const result = await dispatch(assignUserToNode(data));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  // Remove user from node
  const removeUser = useCallback(async (userId: string, nodeId: string) => {
    const result = await dispatch(removeUserFromNode({ userId, nodeId }));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  // Update user role
  const updateRole = useCallback(async (userId: string, nodeId: string, role: string, title?: string) => {
    const result = await dispatch(updateUserRole({ userId, nodeId, role, title }));
    return result.meta.requestStatus === 'fulfilled';
  }, [dispatch]);

  return {
    availableUsers,
    usersLoading,
    usersError,
    operationLoading,
    assignUser,
    removeUser,
    updateRole,
    loadUsers,
  };
}

// Hook for search and filtering (replaces useOrganizationSearch)
export function useOrganizationSearchRedux() {
  const dispatch = useAppDispatch();
  const { hierarchy, filters, searchTerm } = useAppSelector((state) => state.organization);

  const [searchResults, setSearchResults] = useState<OrganizationSearchResult[]>([]);

  // Perform search
  const search = useCallback((query: string, searchFilters?: OrganizationFilters) => {
    if (!hierarchy) return;

    const results = searchNodes(hierarchy.nodes, query, searchFilters);
    setSearchResults(results);
    dispatch(setSearchTerm(query));
    if (searchFilters) dispatch(setFilters(searchFilters));
  }, [hierarchy, dispatch]);

  // Clear search
  const clearSearchState = useCallback(() => {
    dispatch(clearSearch());
    setSearchResults([]);
  }, [dispatch]);

  // Apply filters
  const applyFilters = useCallback((newFilters: OrganizationFilters) => {
    dispatch(setFilters(newFilters));
    if (searchTerm) {
      search(searchTerm, newFilters);
    }
  }, [dispatch, searchTerm, search]);

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
    clearSearch: clearSearchState,
    applyFilters,
  };
}

// Hook for expansion state management (replaces useOrganizationExpansion)
export function useOrganizationExpansionRedux() {
  const dispatch = useAppDispatch();
  const { expandedNodes } = useAppSelector((state) => state.organization);

  const toggleNode = useCallback((nodeId: string) => {
    dispatch(toggleNodeExpansion(nodeId));
  }, [dispatch]);

  const expandSingleNode = useCallback((nodeId: string) => {
    dispatch(expandNode(nodeId));
  }, [dispatch]);

  const collapseSingleNode = useCallback((nodeId: string) => {
    dispatch(collapseNode(nodeId));
  }, [dispatch]);

  const expandAllNodes = useCallback(() => {
    dispatch(expandAll());
  }, [dispatch]);

  const collapseAllNodes = useCallback(() => {
    dispatch(collapseAll());
  }, [dispatch]);

  const isExpanded = useCallback((nodeId: string): boolean => {
    return expandedNodes.includes(nodeId);
  }, [expandedNodes]);

  return {
    expandedNodes,
    toggleNode,
    expandNode: expandSingleNode,
    collapseNode: collapseSingleNode,
    expandAll: expandAllNodes,
    collapseAll: collapseAllNodes,
    isExpanded,
  };
}

// Hook for permissions and access control (replaces useOrganizationPermissions)
export function useOrganizationPermissionsRedux() {
  const { user } = useAuth();

  const hasPermission = useCallback((permission: OrganizationPermission, _nodeId?: string): boolean => {
    if (!user) return false;

    // Super admin has all permissions
    if (user.role === 'super_admin') return true;

    // Admin has most permissions
    if (user.role === 'admin') {
      return true; // All permissions for admin
    }

    // Manager permissions
    if (user.role === 'manager') {
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
  }, [user]);

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

// Hook for chat integration
export function useOrganizationChatIntegration() {
  const dispatch = useAppDispatch();
  const { chatContext } = useAppSelector((state) => state.organization);

  const setNodeContext = useCallback((nodeId: string | null) => {
    dispatch(setChatNodeContext(nodeId));
  }, [dispatch]);

  const addNodeMention = useCallback((nodeId: string) => {
    dispatch(addMentionedNode(nodeId));
  }, [dispatch]);

  const removeNodeMention = useCallback((nodeId: string) => {
    dispatch(removeMentionedNode(nodeId));
  }, [dispatch]);

  return {
    chatContext,
    setNodeContext,
    addNodeMention,
    removeNodeMention,
  };
}

// Import fix for missing useState
import { useState } from 'react';