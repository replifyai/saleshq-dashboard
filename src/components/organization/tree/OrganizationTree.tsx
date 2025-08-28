"use client"
import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  // Search, 
  // Filter,  
  // RotateCcw,
  AlertCircle,
  Loader2
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


import { OrganizationTreeNode } from './OrganizationTreeNode';
import { useOrganizationSearchRedux } from '@/hooks/useOrganizationRedux';

import type { 
  OrganizationNode, 
  OrganizationUser, 
  OrganizationFilters
} from '@/types/organization';

export interface OrganizationTreeContainerProps {
  nodes: OrganizationNode[];
  onNodeSelect?: (node: OrganizationNode) => void;
  onNodeEdit?: (node: OrganizationNode) => void;
  onNodeDelete?: (nodeId: string) => void | Promise<void>;
  onAddChild?: (parentId: string) => void;
  onUserAssign?: (nodeId: string) => void;
  onUserRemove?: (userId: string, nodeId: string) => void;
  onNodeMove?: (nodeId: string) => void;
  onCreateNode?: (node: any) => void;
  selectedNodeId?: string;
  loading?: boolean;
  error?: string | null;
  showSearch?: boolean;
  showFilters?: boolean;
  showControls?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const OrganizationTree: React.FC<OrganizationTreeContainerProps> = ({
  nodes,
  onNodeSelect,
  onNodeEdit,
  onNodeDelete,
  onAddChild,
  onUserAssign,
  onUserRemove,
  onNodeMove,
  selectedNodeId,
  loading = false,
  error = null,
  showSearch = true,
  showFilters = true,
  showControls = true,
  emptyMessage,
  className = ''
}) => {
  // Search and filter state
  const { 
    searchTerm, 
    filters, 
    searchResults, 
    filteredNodes, 
    search, 
    clearSearch, 
    applyFilters 
  } = useOrganizationSearchRedux();

  // Expansion state
  // const { 
  //   expandAll, 
  //   collapseAll, 
  //   expandToLevel, 
  //   autoExpandLevel, 
  //   setAutoExpandLevel 
  // } = useOrganizationExpansion();

  // Local state for filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<{ min?: number; max?: number }>({});

  // Get all available node types from the hierarchy
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    const collectTypes = (nodeList: OrganizationNode[]) => {
      nodeList.forEach(node => {
        types.add(node.type);
        collectTypes(node.children);
      });
    };
    collectTypes(nodes);
    return Array.from(types).sort();
  }, [nodes]);

  // Get max depth for level filter
  const maxDepth = useMemo(() => {
    let max = 0;
    const findMaxDepth = (nodeList: OrganizationNode[]) => {
      nodeList.forEach(node => {
        max = Math.max(max, node.level);
        findMaxDepth(node.children);
      });
    };
    findMaxDepth(nodes);
    return max;
  }, [nodes]);

  // Handle search
  const handleSearch = (query: string) => {
    if (query.trim()) {
      search(query.trim(), filters);
    } else {
      clearSearch();
    }
  };


  // Clear all filters
  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedLevels({});
    clearSearch();
  };

  // Get nodes to display based on search/filter results
  const displayNodes = useMemo(() => {
    if (searchTerm) {
      return searchResults.map(result => result.node);
    }
    if (Object.keys(filters).length > 0) {
      return filteredNodes;
    }
    return nodes;
  }, [nodes, searchTerm, searchResults, filteredNodes, filters]);

  // User interaction handlers
  const handleUserEdit = (user: OrganizationUser, nodeId: string) => {
    // This would trigger a user edit dialog
    console.log('Edit user:', user, 'in node:', nodeId);
  };

  const handleUserRemove = (userId: string, nodeId: string) => {
    if (onUserRemove) {
      onUserRemove(userId, nodeId);
    } else {
      console.log('Remove user:', userId, 'from node:', nodeId);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading organization...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3 text-red-600">
            <AlertCircle className="w-8 h-8" />
            <div className="text-center">
              <p className="font-medium">Failed to load organization</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!nodes || nodes.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <Building2 className="w-12 h-12 text-gray-300" />
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No Organization Units</h3>
              <p className="text-sm">
                {emptyMessage || 'Start building your organizational hierarchy by creating the first unit.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {(showSearch || showFilters || showControls) && (
        <CardHeader className="space-y-4">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Organization Hierarchy
            {displayNodes.length !== nodes.length && (
              <Badge variant="secondary" className="ml-2">
                {displayNodes.length} of {nodes.length} shown
              </Badge>
            )}
          </CardTitle>

          {/* Search Bar */}
          {/* {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search organization units, descriptions, users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          )} */}

          {/* Filters */}
          {/* {showFilters && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Select 
                  value={selectedTypes.length > 0 ? selectedTypes.join(',') : 'all'} 
                  onValueChange={(value) => {
                    const types = value && value !== 'all' ? value.split(',') : [];
                    setSelectedTypes(types);
                    setTimeout(handleFilterChange, 0);
                  }}
                >
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {availableTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Select 
                  value={selectedLevels.min?.toString() || 'any'} 
                  onValueChange={(value) => {
                    setSelectedLevels(prev => ({ 
                      ...prev, 
                      min: value && value !== 'any' ? parseInt(value) : undefined 
                    }));
                    setTimeout(handleFilterChange, 0);
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Min level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {Array.from({ length: maxDepth + 1 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>Level {i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={selectedLevels.max?.toString() || 'any'} 
                  onValueChange={(value) => {
                    setSelectedLevels(prev => ({ 
                      ...prev, 
                      max: value && value !== 'any' ? parseInt(value) : undefined 
                    }));
                    setTimeout(handleFilterChange, 0);
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Max level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {Array.from({ length: maxDepth + 1 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>Level {i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(searchTerm || selectedTypes.length > 0 || selectedLevels.min !== undefined || selectedLevels.max !== undefined) && (
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          )} */}
        </CardHeader>
      )}

      <CardContent className="p-6 overflow-x-auto">
        {/* Tree Display */}
        <div className="space-y-6 min-w-full">
          {displayNodes.length > 0 ? (
            displayNodes.map((node) => (
              <OrganizationTreeNode
                key={node.id}
                node={node}
                onNodeSelect={onNodeSelect}
                onNodeEdit={onNodeEdit}
                onNodeDelete={onNodeDelete}
                onAddChild={onAddChild}
                onUserAssign={onUserAssign}
                onNodeMove={onNodeMove}
                onUserEdit={handleUserEdit}
                onUserRemove={handleUserRemove}
                selectedNodeId={selectedNodeId}
                searchTerm={searchTerm}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No organization units found
                  </p>
                  <p className="text-sm">No units match your search criteria.</p>
                  {(searchTerm || Object.keys(filters).length > 0) && (
                    <Button 
                      variant="outline" 
                      onClick={clearAllFilters}
                      className="mt-4"
                    >
                      Clear filters to see all units
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Results Summary */}
        {searchTerm && searchResults.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchTerm}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrganizationTree;