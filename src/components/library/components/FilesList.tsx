import React from 'react';
import { FileIcon } from '../atoms/FileIcon';

interface File {
  filename: string;
  url: string;
}

interface FilesListProps {
  files: File[];
  maxDisplay?: number;
  showLabel?: boolean;
}

export const FilesList: React.FC<FilesListProps> = ({ 
  files, 
  maxDisplay = 3,
  showLabel = true 
}) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
      <div className="space-y-1">
        {showLabel && (
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Files:</span>
        )}
        {files.slice(0, maxDisplay).map((file, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-xs">
            <FileIcon filename={file.filename} />
            <a 
              href={file.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="truncate hover:text-blue-600 dark:hover:text-blue-300 hover:underline cursor-pointer" 
              title={`${file.filename} - Click to open`}
            >
              {file.filename}
            </a>
          </div>
        ))}
        {files.length > maxDisplay && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            +{files.length - maxDisplay} more files
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesList;