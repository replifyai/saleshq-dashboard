import React from 'react';
import { 
  Users, 
  Crown,
  MapPin,
  DollarSign,
  Edit,
  UserPlus,
  X
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

import { useOrganizationPermissionsRedux } from '@/hooks/useOrganizationRedux';
import { getNodeUserCount } from '@/lib/organizationUtils';

import type { OrganizationNode } from '@/types/organization';

interface NodeDetailsPanelProps {
  node: OrganizationNode | null;
  onClose: () => void;
  onEdit?: (node: OrganizationNode) => void;
  onAddChild?: (parentId: string) => void;
  onUserAssign?: (nodeId: string) => void;
}

export const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({ 
  node, 
  onClose, 
  onEdit, 
  onAddChild, 
  onUserAssign 
}) => {
  const { canEditNode, canAssignUsers, canCreateNodes } = useOrganizationPermissionsRedux();

  if (!node) return null;

  const totalUsers = getNodeUserCount(node);

  return (
    <Card className="fixed bottom-0 right-4 w-80 max-h-[90vh] shadow-2xl border-2 border-blue-300 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md z-50 flex flex-col overflow-hidden">
      <CardHeader className="pb-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate pr-2">{node.name}</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{node.type}</Badge>
          <Badge variant="outline">Level {node.level}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-4 overflow-y-auto flex-1 min-h-0 mt-2">
        {/* Description */}
        {node.description && (
          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {node.description}
            </p>
          </div>
        )}

        {/* Metadata */}
        {node.metadata && (
          <div className="space-y-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Details</span>
            </div>
            {node.metadata.location && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 bg-blue-200 dark:bg-blue-800/50 rounded-md">
                  <MapPin className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{node.metadata.location}</span>
              </div>
            )}
            {node.metadata.budget && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 bg-green-200 dark:bg-green-800/50 rounded-md">
                  <DollarSign className="w-4 h-4 text-green-700 dark:text-green-300" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  ${node.metadata.budget.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Users */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="p-1.5 bg-purple-200 dark:bg-purple-800/50 rounded-md">
              <Users className="w-4 h-4 text-purple-700 dark:text-purple-300" />
            </div>
            <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">
              Team Members ({totalUsers} total)
            </span>
          </div>
          
          {node.users.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {node.users.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
                  <Avatar className="w-9 h-9 ring-2 ring-blue-100 dark:ring-blue-800">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                        {user.name}
                      </p>
                      {user.managerId === user.id && (
                        <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {user.title || user.role}
                    </p>
                  </div>
                </div>
              ))}
              {node.users.length > 6 && (
                <div className="text-center py-2">
                  <Badge variant="secondary" className="text-xs px-3 py-1">
                    +{node.users.length - 6} more members
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">No team members assigned</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-150 dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-800/20 rounded-xl text-center border border-blue-200 dark:border-blue-800 shadow-sm">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">Direct Members</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{node.users.length}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 via-green-100 to-green-150 dark:from-green-950/40 dark:via-green-900/30 dark:to-green-800/20 rounded-xl text-center border border-green-200 dark:border-green-800 shadow-sm">
            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Sub-units</p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">{node.children.length}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {canEditNode(node.id) && onEdit && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onEdit(node)} 
              className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-950/30 dark:to-blue-900/20 dark:hover:from-blue-900/50 dark:hover:to-blue-800/40 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-100 transition-all duration-200 font-medium"
            >
              <Edit className="w-3 h-3 mr-2" />
              Edit
            </Button>
          )}
          {canCreateNodes() && onAddChild && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onAddChild(node.id)} 
              className="flex-1 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 dark:from-green-950/30 dark:to-green-900/20 dark:hover:from-green-900/50 dark:hover:to-green-800/40 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100 transition-all duration-200 font-medium"
            >
              <Users className="w-3 h-3 mr-2" />
              Add Unit
            </Button>
          )}
          {canAssignUsers(node.id) && onUserAssign && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onUserAssign(node.id)} 
              className="flex-1 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 dark:from-purple-950/30 dark:to-purple-900/20 dark:hover:from-purple-900/50 dark:hover:to-purple-800/40 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200 hover:text-purple-900 dark:hover:text-purple-100 transition-all duration-200 font-medium"
            >
              <UserPlus className="w-3 h-3 mr-2" />
              Assign
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NodeDetailsPanel;