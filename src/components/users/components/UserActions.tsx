import React from 'react';
import { MoreHorizontal, UserCheck, UserX, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User } from '@/lib/userManagementApi';

interface UserActionsProps {
  user: User;
  onStatusChange: (user: User) => void;
  onRoleChange: (user: User) => void;
  statusChangeLoading: string | null;
  roleChangeLoading: string | null;
}

export function UserActions({ user, onStatusChange, onRoleChange, statusChangeLoading, roleChangeLoading }: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => onRoleChange(user)}
          disabled={roleChangeLoading === user.id}
          className="text-blue-600"
        >
          {roleChangeLoading === user.id ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <UserCog className="mr-2 h-4 w-4" />
          )}
          Change Role
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onStatusChange(user)}
          disabled={statusChangeLoading === user.id}
          className={user.status === 'active' ? 'text-orange-600' : 'text-green-600'}
        >
          {statusChangeLoading === user.id ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : user.status === 'active' ? (
            <UserX className="mr-2 h-4 w-4" />
          ) : (
            <UserCheck className="mr-2 h-4 w-4" />
          )}
          {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}