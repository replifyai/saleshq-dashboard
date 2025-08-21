/**
 * Organization Tree Node Component
 * Recursive component for displaying organization hierarchy with unlimited depth
 */

import React from 'react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

import { useOrganizationExpansion, useOrganizationPermissions } from '@/hooks/useOrganization';
import { getNodeUserCount } from '@/lib/organizationUtils';
import { getDepthStyles, getIndentation } from './utils/styleUtils';
import {
  NodeIcon,
  NodeBreadcrumb,
  ExpandToggle,
  NodeHeader,
  NodeMetadata,
  UserAvatarPreview,
  NodeActions,
  UsersList
} from './atoms';

import type { OrganizationNode, OrganizationUser } from '@/types/organization';

interface OrganizationTreeNodeProps {
  node: OrganizationNode;
  onNodeSelect?: (node: OrganizationNode) => void;
  onNodeEdit?: (node: OrganizationNode) => void;
  onNodeDelete?: (nodeId: string) => void;
  onAddChild?: (parentId: string) => void;
  onUserAssign?: (nodeId: string) => void;
  onNodeMove?: (nodeId: string) => void;
  onUserEdit?: (user: OrganizationUser, nodeId: string) => void;
  onUserRemove?: (userId: string, nodeId: string) => void;
  selectedNodeId?: string;
  searchTerm?: string;
  className?: string;
}



// Main tree node component
export const OrganizationTreeNode: React.FC<OrganizationTreeNodeProps> = ({
  node,
  onNodeSelect,
  onNodeEdit,
  onNodeDelete,
  onAddChild,
  onUserAssign,
  onNodeMove,
  onUserEdit,
  onUserRemove,
  selectedNodeId,
  searchTerm,
  className = ''
}) => {
  const { isExpanded, toggleNode } = useOrganizationExpansion();
  const { canEditNode, canDeleteNode, canAssignUsers, canCreateNodes } = useOrganizationPermissions();
  console.log(node);
  const hasChildren = node.children.length > 0;
  const totalUsers = getNodeUserCount(node);
  const nodeIsExpanded = isExpanded(node.id, node.level);
  const isSelected = selectedNodeId === node.id;
  
  // Highlight search matches
  const highlightMatch = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const handleNodeClick = () => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  const canEdit = canEditNode(node.id);
  const canDelete = canDeleteNode(node.id);
  const canAssign = canAssignUsers(node.id);
  const canCreate = canCreateNodes();

  const indentationLeft = getIndentation(node.level);

  return (
    <div className={`w-full ${className}`} style={{ paddingLeft: `${indentationLeft}px` }}>
      <Collapsible open={nodeIsExpanded} onOpenChange={(isOpen) => {
        console.log(`🎯 Collapsible onOpenChange for ${node.id}:`, { isOpen, currentState: nodeIsExpanded });
        toggleNode(node.id);
      }}>
        <div 
          className={`
            flex items-center gap-4 rounded-xl border-l-4 border-r border-t border-b cursor-pointer
            backdrop-blur-sm transition-all duration-300 group relative overflow-hidden
            ${node.level > 0 && node.path ? 'p-5 pt-12' : 'p-5'}
            ${getDepthStyles(node.level)}
            ${isSelected 
              ? 'ring-2 ring-blue-500 shadow-lg transform scale-[1.02] z-10' 
              : 'hover:shadow-lg hover:transform hover:scale-[1.01] hover:z-[1]'
            }
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:to-white/10 
            before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
          `}
          onClick={handleNodeClick}
        >
          <NodeBreadcrumb node={node} />
          
          <ExpandToggle 
            hasChildren={hasChildren}
            totalUsers={totalUsers}
            isExpanded={nodeIsExpanded}
          />
          
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <NodeIcon node={node} />
            
            <div className="flex-1 min-w-0 space-y-2">
              <NodeHeader 
                node={node}
                totalUsers={totalUsers}
                highlightMatch={highlightMatch}
              />
              
              <NodeMetadata node={node} />
            </div>
          </div>

          <UserAvatarPreview users={node.users} />

          <NodeActions
            node={node}
            canEdit={canEdit}
            canDelete={canDelete}
            canCreate={canCreate}
            canAssign={canAssign}
            onNodeEdit={onNodeEdit}
            onNodeDelete={onNodeDelete}
            onAddChild={onAddChild}
            onUserAssign={onUserAssign}
            onNodeMove={onNodeMove}
          />
        </div>

        <UsersList
          node={node}
          isExpanded={nodeIsExpanded}
          indentationLeft={indentationLeft}
          onUserEdit={onUserEdit}
          onUserRemove={onUserRemove}
          canEdit={canEdit}
        />

        {/* Children Nodes */}
        {hasChildren && (
          <CollapsibleContent className="mt-4 space-y-4">
            {node.children.map((child) => (
              <OrganizationTreeNode
                key={child.id}
                node={child}
                onNodeSelect={onNodeSelect}
                onNodeEdit={onNodeEdit}
                onNodeDelete={onNodeDelete}
                onAddChild={onAddChild}
                onUserAssign={onUserAssign}
                onNodeMove={onNodeMove}
                onUserEdit={onUserEdit}
                onUserRemove={onUserRemove}
                selectedNodeId={selectedNodeId}
                searchTerm={searchTerm}
              />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

export default OrganizationTreeNode;