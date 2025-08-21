/**
 * Organization Management Types & Interfaces
 * Supports unlimited hierarchy levels with flexible structure
 */

// Core Organization Node Interface
export interface OrganizationNode {
  id: string;
  name: string;
  type: string; // Flexible type - can be any custom level name
  parentId: string | null;
  children: OrganizationNode[];
  users: OrganizationUser[];
  description?: string;
  managerId?: string;
  level: number; // Depth level in hierarchy (0 = root)
  path: string; // Full path like "Company/Sales/North America/Enterprise"
  order: number; // Display order within same parent
  createdAt: string;
  updatedAt: string;
  metadata?: OrganizationMetadata;
}

// User within organization
export interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  role: string;
  title?: string;
  department?: string;
  managerId?: string;
  status: 'active' | 'inactive' | 'pending';
  joinedAt: string;
  avatar?: string;
  nodeIds: string[]; // Can belong to multiple nodes
  permissions?: string[];
}

// Metadata for organization nodes
export interface OrganizationMetadata {
  budget?: number;
  headcount?: number;
  targetHeadcount?: number;
  location?: string;
  costCenter?: string;
  timezone?: string;
  customFields?: { [key: string]: any };
}

// Complete organization hierarchy response
export interface OrganizationHierarchy {
  nodes: OrganizationNode[];
  flatNodes: OrganizationNode[]; // Flattened for easier searching
  totalUsers: number;
  totalNodes: number;
  maxDepth: number;
  nodeTypes: string[];
  lastUpdated: string;
}

// API Request/Response Types
export interface CreateNodeRequest {
  name: string;
  type: string;
  parentId: string | null;
  description?: string;
  managerId?: string;
  order?: number;
  metadata?: OrganizationMetadata;
}

export interface UpdateNodeRequest extends Partial<CreateNodeRequest> {
  id: string;
}

export interface MoveNodeRequest {
  nodeId: string;
  newParentId: string | null;
  newOrder?: number;
}

export interface AssignUserRequest {
  userId: string;
  nodeId: string;
  role?: string;
  title?: string;
  permissions?: string[];
}

export interface BulkUserAssignRequest {
  userIds: string[];
  nodeId: string;
  defaultRole?: string;
}

// Search and Filter Types
export interface OrganizationFilters {
  searchTerm?: string;
  nodeTypes?: string[];
  userRoles?: string[];
  locations?: string[];
  minLevel?: number;
  maxLevel?: number;
  hasUsers?: boolean;
  managedBy?: string;
}

export interface OrganizationSearchResult {
  node: OrganizationNode;
  matchType: 'name' | 'description' | 'type' | 'user' | 'metadata';
  score: number;
}

// Statistics and Analytics
export interface OrganizationStats {
  totalNodes: number;
  totalUsers: number;
  maxDepth: number;
  avgUsersPerNode: number;
  nodesByType: { [type: string]: number };
  usersByRole: { [role: string]: number };
  emptyNodes: number;
  largestTeam: {
    nodeId: string;
    name: string;
    userCount: number;
  };
}

// Component Props Types
export interface OrganizationTreeProps {
  nodes: OrganizationNode[];
  onNodeSelect?: (node: OrganizationNode) => void;
  onNodeEdit?: (node: OrganizationNode) => void;
  onNodeDelete?: (nodeId: string) => void;
  onAddChild?: (parentId: string) => void;
  onUserAssign?: (nodeId: string) => void;
  onNodeMove?: (nodeId: string) => void;
  selectedNodeId?: string;
  expandedNodeIds?: string[];
  filters?: OrganizationFilters;
  readOnly?: boolean;
}

export interface NodeFormData {
  name: string;
  type: string;
  description: string;
  parentId: string | null;
  managerId: string;
  metadata: OrganizationMetadata;
}

// Error Types
export interface OrganizationError {
  code: string;
  message: string;
  field?: string;
  nodeId?: string;
}

// Configuration Types
export interface OrganizationConfig {
  maxDepth?: number;
  allowedNodeTypes?: string[];
  requiredFields?: string[];
  defaultExpansionLevel?: number;
  enableDragDrop?: boolean;
  enableBulkOperations?: boolean;
}

// Event Types for real-time updates
export interface OrganizationEvent {
  type: 'node_created' | 'node_updated' | 'node_deleted' | 'user_assigned' | 'user_removed' | 'node_moved';
  nodeId: string;
  userId?: string;
  timestamp: string;
  data?: any;
}

// Permission Types
export type OrganizationPermission = 
  | 'view_org'
  | 'create_nodes'
  | 'edit_nodes' 
  | 'delete_nodes'
  | 'assign_users'
  | 'remove_users'
  | 'move_nodes'
  | 'view_all_users'
  | 'manage_permissions'
  | 'view_analytics';

export interface UserPermissions {
  userId: string;
  permissions: OrganizationPermission[];
  nodeRestrictions?: string[]; // If specified, permissions only apply to these nodes
}