import React from 'react';
import { UserAvatar } from '../atoms/UserAvatar';

export const WelcomeMessage: React.FC = () => {
  return (
    <div className="flex items-start space-x-3 justify-start">
      <div className="flex-shrink-0">
        <UserAvatar type="bot" />
      </div>
      <div className="flex-1 min-w-0 flex justify-start">
        <div className="group relative bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/50 rounded-2xl rounded-tl-md p-4 max-w-[80%] sm:max-w-lg lg:max-w-2xl shadow-sm backdrop-blur-sm">
          {/* Message tail/pointer */}
          <div className="absolute left-0 top-3 w-0 h-0 border-r-[8px] border-r-white dark:border-r-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent -translate-x-[8px]"></div>
          <div className="absolute left-0 top-3 w-0 h-0 border-r-[8px] border-r-gray-200 dark:border-r-gray-700 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent -translate-x-[9px]"></div>

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            👋 Hello! I'm ready to help you analyze your documents. Ask me questions about your uploaded content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;