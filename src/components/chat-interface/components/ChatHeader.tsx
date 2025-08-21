import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { UserAvatar } from '../atoms/UserAvatar';

export const ChatHeader: React.FC = () => {
  return (
    <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50">
      <CardHeader className="hidden sm:block px-4 py-2 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-10 sm:h-10">
              <UserAvatar type="bot" className="w-full h-full" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-xl lg:text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                AI Assistant
              </CardTitle>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0 sm:mt-0.5 leading-tight">
                Ask questions about your uploaded documents
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
    </div>
  );
};

export default ChatHeader;