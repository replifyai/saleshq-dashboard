import React from 'react';
import { getFileIconClass } from '../utils/uploadUtils';

interface FileIconProps {
  file: File;
  className?: string;
  showStatus?: boolean;
  status?: 'uploading' | 'processing' | 'complete' | 'error';
}

export const FileIcon: React.FC<FileIconProps> = ({ 
  file, 
  className = '', 
  showStatus = false,
  status 
}) => {
  return (
    <div className={`relative ${className}`}>
      <i className={getFileIconClass(file)}></i>
      {showStatus && (status === 'uploading' || status === 'processing') && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export default FileIcon;