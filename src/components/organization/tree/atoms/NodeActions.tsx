import React from 'react';
import { 
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  UserPlus,
  Move
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';

import type { OrganizationNode } from '@/types/organization';

interface NodeActionsProps {
  node: OrganizationNode;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  canAssign: boolean;
  onNodeEdit?: (node: OrganizationNode) => void;
  onNodeDelete?: (nodeId: string) => void;
  onAddChild?: (parentId: string) => void;
  onUserAssign?: (nodeId: string) => void;
  onNodeMove?: (nodeId: string) => void;
}

export const NodeActions: React.FC<NodeActionsProps> = ({
  node,
  canEdit,
  canDelete,
  canCreate,
  canAssign,
  onNodeEdit,
  onNodeDelete,
  onAddChild,
  onUserAssign,
  onNodeMove
}) => {
  if (!canEdit && !canDelete && !canCreate && !canAssign) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="
              h-9 w-9 p-0 rounded-lg z-10 relative
              hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-md
              transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700
            "
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canEdit && onNodeEdit && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onNodeEdit(node);
            }}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          
          {canCreate && onAddChild && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onAddChild(node.id);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sub-unit
            </DropdownMenuItem>
          )}
          
          {canAssign && onUserAssign && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onUserAssign(node.id);
            }}>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign User
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          {onNodeMove && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onNodeMove(node.id);
            }}>
              <Move className="w-4 h-4 mr-2" />
              Move/Restructure
            </DropdownMenuItem>
          )}
          
          {canDelete && onNodeDelete && (
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onNodeDelete(node.id);
              }}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NodeActions;