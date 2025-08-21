import React from 'react';
import { Bot, User } from 'lucide-react';

interface UserAvatarProps {
  type: 'bot' | 'user';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ type, className = "w-9 h-9" }) => {
  if (type === 'bot') {
    return (
      <div className={`bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg ${className}`}>
        <Bot className="w-5 h-5 text-white" />
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg ${className}`}>
      <User className="w-5 h-5 text-white" />
    </div>
  );
};

export default UserAvatar;