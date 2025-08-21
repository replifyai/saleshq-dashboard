import React from 'react';
import { FileText } from 'lucide-react';

interface MessageSourcesProps {
  sources: any[];
}

export const MessageSources: React.FC<MessageSourcesProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {sources.map((source, index) => {
        const filename = source.filename || `Document ${index + 1}`;

        return (
          <a
            key={index}
            href={source.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-xs border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md hover:scale-105 transition-all duration-200 shadow-sm"
          >
            <FileText className="w-3 h-3" />
            <span className="font-medium">{filename}</span>
          </a>
        );
      })}
    </div>
  );
};

export default MessageSources;