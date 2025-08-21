import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import type { OrganizationUser } from '@/types/organization';

interface UserAvatarPreviewProps {
  users: OrganizationUser[];
}

export const UserAvatarPreview: React.FC<UserAvatarPreviewProps> = ({ users }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center shrink-0">
      <div className="flex -space-x-2 hover:space-x-1 transition-all duration-300">
        {users.slice(0, 4).map((user, index) => (
          <Avatar 
            key={user.id} 
            className={`
              w-8 h-8 border-2 border-white dark:border-gray-800 shadow-sm
              hover:z-10 hover:scale-110 transition-all duration-200 cursor-pointer
              ${index === 0 ? 'z-[4]' : index === 1 ? 'z-[3]' : index === 2 ? 'z-[2]' : 'z-[1]'}
            `}
            title={`${user.name} - ${user.role}`}
          >
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        ))}
        {users.length > 4 && (
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-200 cursor-pointer z-[0]">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              +{users.length - 4}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatarPreview;