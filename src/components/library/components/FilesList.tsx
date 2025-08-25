import React from 'react';
import { FileIcon } from '../atoms/FileIcon';
import { FileSearch } from 'lucide-react';

interface File {
  filename: string;
  url: string;
  storagePath?: string;
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
        {files.slice(0, maxDisplay).map((file, idx) => {
          const isQueryPdf = file.storagePath?.startsWith('generated-pdfs');
          return (
            <div key={idx} className="flex items-center space-x-2 text-xs">
              {isQueryPdf ? (
                <FileSearch className="h-4 w-4 text-purple-600" />
              ) : (
                <FileIcon filename={file.filename} />
              )}
              <a 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`truncate hover:text-blue-600 dark:hover:text-blue-300 hover:underline cursor-pointer ${isQueryPdf ? 'font-semibold text-purple-700 dark:text-purple-300' : ''}`} 
                title={`${isQueryPdf ? 'Query PDF' : file.filename} - Click to open`}
              >
                {isQueryPdf ? 'Query PDF' : file.filename}
              </a>
              {isQueryPdf && (
                <span className="ml-1 inline-flex items-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  Query PDF
                </span>
              )}
            </div>
          );
        })}
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