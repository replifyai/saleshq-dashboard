import React from 'react';
import { UserAvatar } from './UserAvatar';

export const TypingAnimation: React.FC = () => (
  <div className="flex items-start space-x-3 justify-start">
    <div className="flex-shrink-0">
      <UserAvatar type="bot" />
    </div>
    <div className="flex-1 min-w-0 flex justify-start">
      <div className="group relative bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/50 rounded-2xl rounded-tl-md p-4 max-w-[80%] sm:max-w-lg lg:max-w-2xl shadow-sm backdrop-blur-sm">
        {/* Message tail/pointer */}
        <div className="absolute left-0 top-3 w-0 h-0 border-r-[8px] border-r-white dark:border-r-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent -translate-x-[8px]"></div>
        <div className="absolute left-0 top-3 w-0 h-0 border-r-[8px] border-r-gray-200 dark:border-r-gray-700 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent -translate-x-[9px]"></div>

        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-500 dark:text-gray-400"></span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TypingAnimation;