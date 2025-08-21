import React from 'react';
import { Edit, Trash2, MoreHorizontal, Crown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

import type { OrganizationUser } from '@/types/organization';

interface UserItemProps {
  user: OrganizationUser;
  nodeId: string;
  onEdit?: (user: OrganizationUser, nodeId: string) => void;
  onRemove?: (userId: string, nodeId: string) => void;
  canEdit: boolean;
}

export const UserItem: React.FC<UserItemProps> = ({ 
  user, 
  nodeId, 
  onEdit, 
  onRemove, 
  canEdit 
}) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 group backdrop-blur-sm">
      <Avatar className="w-10 h-10 border-2 border-gray-100 dark:border-gray-700 shadow-sm">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-blue-500 to-purple-500 text-white">
          {user.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
          {user.managerId === user.id && (
            <Crown className="w-4 h-4 text-yellow-500" />
          )}
          <Badge variant="outline" className="text-xs uppercase bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            {user.role}
          </Badge>
          {user.status !== 'active' && (
            <Badge variant="secondary" className="text-xs bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
              {user.status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span className="truncate">{user.title || user.email}</span>
          {user.status === 'active' && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
            </div>
          )}
        </div>
      </div>

      {canEdit && (onEdit || onRemove) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(user, nodeId)} className="gap-2">
                <Edit className="w-4 h-4" />
                Edit User
              </DropdownMenuItem>
            )}
            {onRemove && (
              <DropdownMenuItem 
                onClick={() => onRemove(user.id, nodeId)}
                className="text-red-600 dark:text-red-400 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserItem;