'use client'
import { useState, useMemo, useCallback } from 'react';
import { 
  Plus, 
  Building2, 
  Users, 
  Layers, 
  Target,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Organization components
import { OrganizationTree } from './tree/OrganizationTree';
import { OrganizationChart } from './chart/OrganizationChart';
import { NodeForm } from './forms/NodeForm';
import { UserAssignmentDialog } from './users/UserAssignmentDialog';

// Redux hooks
import { 
  useOrganizationRedux,
  useOrganizationNodesRedux,
  useOrganizationUsersRedux,
  useOrganizationPermissionsRedux
} from '@/hooks/useOrganizationRedux';

// Types
import type { 
  OrganizationNode,
  CreateNodeRequest,
  UpdateNodeRequest,
  AssignUserRequest
} from '@/types/organization';

export default function OrganizationPage() {
  // UI state
  const [activeTab, setActiveTab] = useState('hierarchy');
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<OrganizationNode | null>(null);
  const [parentNode, setParentNode] = useState<OrganizationNode | null>(null);

  // Redux hooks
  const { 
    hierarchy,
    flatNodes,
    allUsers,
    availableUsers,
    loading,
    operationLoading,
    usersLoading,
    error,
    operationError,
    usersError,
    refresh,
  } = useOrganizationRedux();

  const {
    createNode,
    updateNode,
    deleteNode,
  } = useOrganizationNodesRedux();

  const {
    assignUser,
    removeUser,
  } = useOrganizationUsersRedux();

  const { canEditNode, canAssignUsers } = useOrganizationPermissionsRedux();

  // Derived data - memoized to prevent unnecessary re-renders
  const nodes = useMemo(() => hierarchy?.nodes || [], [hierarchy?.nodes]);
  const editingNode = selectedNode && nodeDialogOpen ? selectedNode : null;

  // Display data
  const displayStats = useMemo(() => ({
    totalNodes: flatNodes.length,
    totalUsers: allUsers.length,
    nodeTypes: new Set(flatNodes.map(n => n.type)).size,
    maxDepth: Math.max(0, ...flatNodes.map(n => n.level)),
  }), [flatNodes, allUsers]);

  // UI handlers
  const handleCreateRootNode = () => {
    setSelectedNode(null);
    setParentNode(null);
    setNodeDialogOpen(true);
  };



  const handleEditNode = (node: OrganizationNode) => {
    setSelectedNode(node);
    setParentNode(null);
    setNodeDialogOpen(true);
  };

  const handleDeleteNode = async (nodeId: string) => {
    try {
      await deleteNode(nodeId);
      setSelectedNode(null);
      setNodeDialogOpen(false);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleAssignUser = (nodeId: string) => {
    const node = flatNodes.find(n => n.id === nodeId);
    setSelectedNode(node || null);
    setUserDialogOpen(true);
  };

  const handleUserRemove = async (userId: string, nodeId: string) => {
    try {
      // Show confirmation dialog before removing user
      const confirmRemoval = window.confirm(
        "Are you sure you want to remove this user from the organization unit? This action cannot be undone."
      );
      
      if (confirmRemoval) {
        await removeUser(userId, nodeId);
      }
    } catch (error) {
      console.error('User removal error:', error);
      alert(`Error removing user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Helper function to find node by id - memoized for performance
  const findNodeById = useCallback((nodeId: string): OrganizationNode | null => {
    return flatNodes.find(node => node.id === nodeId) || null;
  }, [flatNodes]);

  // Form submission handlers
  const handleNodeFormSubmit = async (data: CreateNodeRequest | UpdateNodeRequest) => {
    try {
      if ('id' in data) {
        // Update existing node
        await updateNode(data);
      } else {
        // Create new node
        await createNode(data);
      }
      setNodeDialogOpen(false);
    } catch (error) {
      console.error('Node form submission error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUserAssignment = async (data: AssignUserRequest) => {
    await assignUser(data);
    setUserDialogOpen(false);
  };

  // Organization chart handlers - memoized to prevent Tree re-renders
  const handleNodeSelect = useCallback((node: OrganizationNode) => {
    console.log('Node selected:', node);
    setSelectedNode(node);
  }, []);

  const handleNodeEdit = useCallback((node: OrganizationNode) => {
    setSelectedNode(node);
    setNodeDialogOpen(true);
  }, []);

  const handleAddChild = useCallback((parentId: string) => {
    const parent = findNodeById(parentId);
    setParentNode(parent);
    setSelectedNode(null);
    setNodeDialogOpen(true);
  }, [findNodeById]);

  const handleUserAssignmentFromChart = useCallback((nodeId: string) => {
    const node = findNodeById(nodeId);
    setSelectedNode(node);
    setUserDialogOpen(true);
  }, [findNodeById]);



  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Organization</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage organizational structure, units, and team assignments
          </p>
        </div>
        <div>
          <Button onClick={handleCreateRootNode} disabled={operationLoading}>
            <Plus className="w-4 h-4 mr-2" />
            Create Unit
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.totalNodes}</div>
              <p className="text-xs text-muted-foreground">Organizational units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Assigned members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Max Depth</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.maxDepth}</div>
              <p className="text-xs text-muted-foreground">Hierarchy levels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unit Types</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.nodeTypes}</div>
              <p className="text-xs text-muted-foreground">Different types</p>
            </CardContent>
          </Card>

          {/* Available Users Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableUsers.length}</div>
              <p className="text-xs text-muted-foreground">Unassigned users</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error State */}
      {(error || operationError || usersError) && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
          <CardContent className="flex items-center gap-2 p-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="text-red-700 dark:text-red-300">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error || operationError || usersError}</p>
            </div>
            <Button variant="outline" size="sm" onClick={refresh} className="ml-auto">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="hierarchy">Tree View</TabsTrigger>
          <TabsTrigger value="chart">Chart View</TabsTrigger>
        </TabsList>

        {/* Tree View Tab */}
        <TabsContent value="hierarchy" className="space-y-4">
          <OrganizationTree
            {...({
              nodes,
              loading,
              onNodeSelect: handleNodeSelect,
              onNodeEdit: handleEditNode,
              onNodeDelete: handleDeleteNode,
              onAddChild: handleAddChild,
              onUserAssign: handleAssignUser,
              onUserRemove: handleUserRemove,
              selectedNodeId: selectedNode?.id,
              showActions: true,
              showUsers: true,
              showMetadata: true,
              showControls: true,
            } as any)}
          />
        </TabsContent>

        {/* Chart View Tab */}
        <TabsContent value="chart" className="space-y-4">
          <OrganizationChart
            nodes={nodes}
            onNodeSelect={handleNodeSelect}
            onNodeEdit={handleNodeEdit}
            onAddChild={handleAddChild}
            onUserAssign={handleUserAssignmentFromChart}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={nodeDialogOpen} onOpenChange={setNodeDialogOpen}>
        <DialogContent className="max-w-4xl h-auto max-h-[95vh] p-0 flex flex-col">
          <NodeForm
            node={editingNode || undefined}
            parentNode={parentNode || undefined}
            onSubmit={handleNodeFormSubmit}
            onCancel={() => setNodeDialogOpen(false)}
            onDelete={async (nodeId: string) => {
              await handleDeleteNode(nodeId);
            }}
            loading={operationLoading}
            className="flex-1 flex flex-col"
          />
        </DialogContent>
      </Dialog>

      <UserAssignmentDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        node={selectedNode || undefined}
        availableUsers={availableUsers}
        onAssignUser={handleUserAssignment}
        loading={usersLoading}
      />

      {/* Selected Node Info (fixed position) */}
      {selectedNode && !nodeDialogOpen && !userDialogOpen && activeTab === 'hierarchy' && (
        <Card className="fixed bottom-4 right-4 w-80 shadow-lg border-2 border-blue-200 z-10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Selected Unit</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNode(null)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div>
                <p className="font-medium">{selectedNode.name}</p>
                <p className="text-xs text-gray-500">{selectedNode.type} • Level {selectedNode.level}</p>
              </div>
              {selectedNode.description && (
                <p className="text-xs text-gray-600">{selectedNode.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline">{selectedNode.users.length} users</Badge>
                <Badge variant="outline">{selectedNode.children.length} children</Badge>
              </div>
              <div className="flex gap-1 pt-2">
                {(canEditNode && canEditNode(selectedNode.id)) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditNode(selectedNode)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                )}
                {(canAssignUsers && canAssignUsers(selectedNode.id)) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAssignUser(selectedNode.id)}
                    className="flex-1"
                  >
                    Assign
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}