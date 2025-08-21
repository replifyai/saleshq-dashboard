/**
 * Organization Redux Slice
 * Manages organization hierarchy, nodes, users, and operations
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  OrganizationHierarchy,
  OrganizationNode,
  OrganizationUser,
  CreateNodeRequest,
  UpdateNodeRequest,
  AssignUserRequest,
  OrganizationFilters,
  OrganizationStats,
  MoveNodeRequest,
} from '@/types/organization';
import { organizationApi } from '@/lib/organizationApi';
import {
  mockAvailableUsers,
  getMockHierarchy,
} from '@/lib/mockOrganizationData';
import {
  calculateOrgStats,
  flattenHierarchy,
  findNodeById,
  addNodeToHierarchy,
  updateNodeInHierarchy,
  removeNodeFromHierarchy,
  addUserToNode,
  removeUserFromNode as removeUserFromNodeUtil,
  updateUserInNode,
} from '@/lib/organizationUtils';

// State interface
interface OrganizationState {
  // Core data
  hierarchy: OrganizationHierarchy | null;
  availableUsers: OrganizationUser[];
  selectedNode: OrganizationNode | null;
  
  // Loading states
  loading: boolean;
  operationLoading: boolean;
  usersLoading: boolean;
  
  // Real-time operation tracking
  realtimeOperations: {
    creating: string[]; // IDs of nodes being created
    updating: string[]; // IDs of nodes being updated
    deleting: string[]; // IDs of nodes being deleted
    assigningUsers: Array<{ nodeId: string; userId: string }>;
  };
  
  // Error states
  error: string | null;
  operationError: string | null;
  usersError: string | null;
  
  // UI state
  expandedNodes: string[];
  filters: OrganizationFilters;
  searchTerm: string;
  
  // Analytics
  stats: OrganizationStats | null;
  lastUpdated: string | null;
  
  // Chat integration
  chatContext: {
    mentionedNodes: string[];
    activeNodeContext: string | null;
    pendingOperations: Array<{
      id: string;
      type: 'create' | 'update' | 'delete' | 'assign' | 'move';
      status: 'pending' | 'confirmed' | 'rejected';
      data: any;
    }>;
  };
}

// Initial state
const initialState: OrganizationState = {
  hierarchy: null,
  availableUsers: [],
  selectedNode: null,
  loading: false,
  operationLoading: false,
  usersLoading: false,
  error: null,
  operationError: null,
  usersError: null,
  expandedNodes: [],
  filters: {},
  searchTerm: '',
  stats: null,
  lastUpdated: null,
  chatContext: {
    mentionedNodes: [],
    activeNodeContext: null,
    pendingOperations: [],
  },
  realtimeOperations: {
    creating: [],
    updating: [],
    deleting: [],
    assigningUsers: [],
  },
};

// Helper function to check if we should use mock data
const shouldUseMockData = () => {
  return true;
};

// Async thunks for API operations
export const loadOrganizationHierarchy = createAsyncThunk(
  'organization/loadHierarchy',
  async (filters: OrganizationFilters | undefined, { rejectWithValue }) => {
    try {
      if (shouldUseMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return getMockHierarchy(filters);
      } else {
        return await organizationApi.hierarchy.getHierarchy(filters);
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load organization');
    }
  }
);

export const loadAvailableUsers = createAsyncThunk(
  'organization/loadAvailableUsers',
  async (_, { rejectWithValue }) => {
    try {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockAvailableUsers;
      } else {
        return await organizationApi.users.getAvailable();
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load users');
    }
  }
);

export const createOrganizationNode = createAsyncThunk(
  'organization/createNode',
  async (data: CreateNodeRequest, { rejectWithValue, getState }) => {
    try {
      // Calculate level and path for the new node
      const state = getState() as { organization: OrganizationState };
      const { hierarchy } = state.organization;
      
      let level = 0;
      let path = data.name;
      
      if (data.parentId && hierarchy) {
        const parent = findNodeById(hierarchy.nodes, data.parentId);
        if (parent) {
          level = parent.level + 1;
          path = `${parent.path}/${data.name}`;
        }
      }
      
      const newNode: OrganizationNode = {
        id: `node_${Date.now()}`,
        ...data,
        children: [],
        users: [],
        level,
        path,
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Mock: Creating organization node:', data);
      } else {
        await organizationApi.nodes.create(data);
      }
      
      return newNode;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create node');
    }
  }
);

export const updateOrganizationNode = createAsyncThunk(
  'organization/updateNode',
  async (data: UpdateNodeRequest, { rejectWithValue }) => {
    try {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Mock: Updating organization node:', data);
      } else {
        await organizationApi.nodes.update(data);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update node');
    }
  }
);

export const deleteOrganizationNode = createAsyncThunk(
  'organization/deleteNode',
  async ({ nodeId, moveChildrenTo }: { nodeId: string; moveChildrenTo?: string }, { rejectWithValue }) => {
    try {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Mock: Deleting organization node:', nodeId);
      } else {
        await organizationApi.nodes.delete(nodeId, { moveChildrenTo });
      }
      
      return { nodeId, moveChildrenTo };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete node');
    }
  }
);

export const moveOrganizationNode = createAsyncThunk(
  'organization/moveNode',
  async (data: MoveNodeRequest, { rejectWithValue }) => {
    try {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Mock: Moving organization node:', data);
      } else {
        await organizationApi.nodes.move(data);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to move node');
    }
  }
);

export const assignUserToNode = createAsyncThunk(
  'organization/assignUser',
  async (data: AssignUserRequest, { rejectWithValue, getState }) => {
    try {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Mock: Assigning user to node:', data);
      } else {
        await organizationApi.users.assign(data);
      }
      
      // Get user data from available users
      const state = getState() as { organization: OrganizationState };
      const user = state.organization.availableUsers.find(u => u.id === data.userId);
      
      return { ...data, user };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to assign user');
    }
  }
);

export const removeUserFromNode = createAsyncThunk(
  'organization/removeUser',
  async ({ userId, nodeId }: { userId: string; nodeId: string }, { rejectWithValue }) => {
    try {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Mock: Removing user from node:', { userId, nodeId });
      } else {
        await organizationApi.users.remove(userId, nodeId);
      }
      
      return { userId, nodeId };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove user');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'organization/updateUserRole',
  async (
    { userId, nodeId, role, title }: { userId: string; nodeId: string; role: string; title?: string },
    { rejectWithValue }
  ) => {
    try {
      if (shouldUseMockData()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Mock: Updating user role:', { userId, nodeId, role, title });
      } else {
        await organizationApi.users.updateRole(userId, nodeId, role, title);
      }
      
      return { userId, nodeId, role, title };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user role');
    }
  }
);

// Organization slice
export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    // UI state actions
    setSelectedNode: (state, action: PayloadAction<OrganizationNode | null>) => {
      state.selectedNode = action.payload;
    },
    
    toggleNodeExpansion: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      const index = state.expandedNodes.indexOf(nodeId);
      if (index > -1) {
        state.expandedNodes.splice(index, 1);
      } else {
        state.expandedNodes.push(nodeId);
      }
    },
    
    expandNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      if (!state.expandedNodes.includes(nodeId)) {
        state.expandedNodes.push(nodeId);
      }
    },
    
    collapseNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      const index = state.expandedNodes.indexOf(nodeId);
      if (index > -1) {
        state.expandedNodes.splice(index, 1);
      }
    },
    
    expandAll: (state) => {
      if (state.hierarchy) {
        const allNodes = flattenHierarchy(state.hierarchy.nodes);
        state.expandedNodes = allNodes.map(node => node.id);
      }
    },
    
    collapseAll: (state) => {
      state.expandedNodes = [];
    },
    
    setFilters: (state, action: PayloadAction<OrganizationFilters>) => {
      state.filters = action.payload;
    },
    
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    
    clearSearch: (state) => {
      state.searchTerm = '';
      state.filters = {};
    },
    
    // Error handling
    clearErrors: (state) => {
      state.error = null;
      state.operationError = null;
      state.usersError = null;
    },
    
    // Chat integration actions
    setChatNodeContext: (state, action: PayloadAction<string | null>) => {
      state.chatContext.activeNodeContext = action.payload;
    },
    
    addMentionedNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      if (!state.chatContext.mentionedNodes.includes(nodeId)) {
        state.chatContext.mentionedNodes.push(nodeId);
      }
    },
    
    removeMentionedNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      const index = state.chatContext.mentionedNodes.indexOf(nodeId);
      if (index > -1) {
        state.chatContext.mentionedNodes.splice(index, 1);
      }
    },
    
    addPendingOperation: (state, action: PayloadAction<{
      id: string;
      type: 'create' | 'update' | 'delete' | 'assign' | 'move';
      data: any;
    }>) => {
      state.chatContext.pendingOperations.push({
        ...action.payload,
        status: 'pending',
      });
    },
    
    updatePendingOperation: (state, action: PayloadAction<{
      id: string;
      status: 'confirmed' | 'rejected';
    }>) => {
      const operation = state.chatContext.pendingOperations.find(op => op.id === action.payload.id);
      if (operation) {
        operation.status = action.payload.status;
      }
    },
    
    removePendingOperation: (state, action: PayloadAction<string>) => {
      const index = state.chatContext.pendingOperations.findIndex(op => op.id === action.payload);
      if (index > -1) {
        state.chatContext.pendingOperations.splice(index, 1);
      }
    },
    
    clearPendingOperations: (state) => {
      state.chatContext.pendingOperations = [];
    },
  },
  
  extraReducers: (builder) => {
    // Load hierarchy
    builder
      .addCase(loadOrganizationHierarchy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadOrganizationHierarchy.fulfilled, (state, action) => {
        state.loading = false;
        state.hierarchy = action.payload;
        state.stats = calculateOrgStats(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(loadOrganizationHierarchy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Load available users
    builder
      .addCase(loadAvailableUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(loadAvailableUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.availableUsers = action.payload;
      })
      .addCase(loadAvailableUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload as string;
      });
    
    // Create node
    builder
      .addCase(createOrganizationNode.pending, (state, action) => {
        state.operationLoading = true;
        state.operationError = null;
        // Track operation in progress
        state.realtimeOperations.creating.push(action.meta.requestId);
      })
      .addCase(createOrganizationNode.fulfilled, (state, action) => {
        state.operationLoading = false;
        // Remove from pending operations
        state.realtimeOperations.creating = state.realtimeOperations.creating.filter(
          id => id !== action.meta.requestId
        );
        
        if (state.hierarchy) {
          // Add node to hierarchy in real-time
          state.hierarchy = addNodeToHierarchy(state.hierarchy, action.payload);
          state.stats = calculateOrgStats(state.hierarchy);
        }
      })
      .addCase(createOrganizationNode.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload as string;
        // Remove from pending operations
        state.realtimeOperations.creating = state.realtimeOperations.creating.filter(
          id => id !== action.meta.requestId
        );
      });
    
    // Update node
    builder
      .addCase(updateOrganizationNode.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateOrganizationNode.fulfilled, (state, action) => {
        state.operationLoading = false;
        if (state.hierarchy) {
          // Update node in hierarchy in real-time
          state.hierarchy = updateNodeInHierarchy(state.hierarchy, action.payload);
          state.stats = calculateOrgStats(state.hierarchy);
        }
      })
      .addCase(updateOrganizationNode.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload as string;
      });
    
    // Delete node
    builder
      .addCase(deleteOrganizationNode.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(deleteOrganizationNode.fulfilled, (state, action) => {
        state.operationLoading = false;
        const { nodeId, moveChildrenTo } = action.payload;
        
        if (state.hierarchy) {
          // Remove node from hierarchy in real-time
          state.hierarchy = removeNodeFromHierarchy(state.hierarchy, nodeId, moveChildrenTo);
          state.stats = calculateOrgStats(state.hierarchy);
        }
        
        // Clear selected node if it was deleted
        if (state.selectedNode?.id === nodeId) {
          state.selectedNode = null;
        }
      })
      .addCase(deleteOrganizationNode.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload as string;
      });
    
    // Move node
    builder
      .addCase(moveOrganizationNode.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(moveOrganizationNode.fulfilled, (state, action) => {
        state.operationLoading = false;
        if (state.hierarchy) {
          // For now, we'll need to reload hierarchy for moves as it's complex
          // In production, you'd implement a more sophisticated move function
          console.log('Move operation completed:', action.payload);
          // This would trigger a refresh in production
        }
      })
      .addCase(moveOrganizationNode.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload as string;
      });
    
    // Assign user
    builder
      .addCase(assignUserToNode.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(assignUserToNode.fulfilled, (state, action) => {
        state.operationLoading = false;
        const { nodeId, userId, role, title, user } = action.payload;
        
        if (state.hierarchy && user) {
          // Create user object with assignment details
          const userWithAssignment: OrganizationUser = {
            ...user,
            role: role || user.role,
            title: title || user.title,
            nodeIds: user.nodeIds.includes(nodeId) ? user.nodeIds : [...user.nodeIds, nodeId]
          };
          
          // Add user to node in real-time
          state.hierarchy = addUserToNode(state.hierarchy, nodeId, userWithAssignment);
          state.stats = calculateOrgStats(state.hierarchy);
          
          // Remove user from available users
          state.availableUsers = state.availableUsers.filter(u => u.id !== userId);
        }
      })
      .addCase(assignUserToNode.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload as string;
      });
    
    // Remove user
    builder
      .addCase(removeUserFromNode.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(removeUserFromNode.fulfilled, (state, action) => {
        state.operationLoading = false;
        const { userId, nodeId } = action.payload;
        
        if (state.hierarchy) {
          // Get user data before removing
          const node = findNodeById(state.hierarchy.nodes, nodeId);
          const user = node?.users.find(u => u.id === userId);
          
          // Remove user from node in real-time
          state.hierarchy = removeUserFromNodeUtil(state.hierarchy, nodeId, userId);
          state.stats = calculateOrgStats(state.hierarchy);
          
          // Add user back to available users if completely unassigned
          if (user && !state.availableUsers.find(u => u.id === userId)) {
            const updatedUser = { ...user, nodeIds: user.nodeIds.filter(id => id !== nodeId) };
            if (updatedUser.nodeIds.length === 0) {
              state.availableUsers.push(updatedUser);
            }
          }
        }
      })
      .addCase(removeUserFromNode.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload as string;
      });
    
    // Update user role
    builder
      .addCase(updateUserRole.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.operationLoading = false;
        const { userId, nodeId, role, title } = action.payload;
        
        if (state.hierarchy) {
          // Update user role in node in real-time
          state.hierarchy = updateUserInNode(state.hierarchy, nodeId, userId, { role, title });
          state.stats = calculateOrgStats(state.hierarchy);
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload as string;
      });
  },
});

// Export actions
export const {
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
  addPendingOperation,
  updatePendingOperation,
  removePendingOperation,
  clearPendingOperations,
} = organizationSlice.actions;

export default organizationSlice.reducer;