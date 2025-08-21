import React from 'react';
import { Users } from 'lucide-react';

import { UserItem } from './UserItem';

import type { OrganizationNode, OrganizationUser } from '@/types/organization';

interface UsersListProps {
  node: OrganizationNode;
  isExpanded: boolean;
  indentationLeft: number;
  onUserEdit?: (user: OrganizationUser, nodeId: string) => void;
  onUserRemove?: (userId: string, nodeId: string) => void;
  canEdit: boolean;
}

export const UsersList: React.FC<UsersListProps> = ({
  node,
  isExpanded,
  indentationLeft,
  onUserEdit,
  onUserRemove,
  canEdit
}) => {
  if (node.users.length === 0 || !isExpanded) {
    return null;
  }

  return (
    <div 
      className="mt-4 space-y-3 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-4 border-l-2 border-gray-200 dark:border-gray-700"
      style={{ marginLeft: `${indentationLeft + 48}px` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Team Members ({node.users.length})
        </span>
      </div>
      {node.users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          nodeId={node.id}
          onEdit={onUserEdit}
          onRemove={onUserRemove}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
};

export default UsersList;