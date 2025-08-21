import React from 'react';
import { FileIcon } from '../atoms/FileIcon';
import { StatusBadge } from '../atoms/StatusBadge';
import { ProgressDisplay } from '../atoms/ProgressDisplay';
import { getEstimatedTimeRemaining, formatFileSize, type UploadingFile } from '../utils/uploadUtils';

interface UploadQueueProps {
  files: UploadingFile[];
  hasActiveUploads: boolean;
}

export const UploadQueue: React.FC<UploadQueueProps> = ({
  files,
  hasActiveUploads
}) => {
  if (files.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium text-gray-900">Processing Queue</h3>
        {hasActiveUploads && (
          <div className="flex items-center space-x-2 text-sm text-amber-600">
            <div className="animate-spin w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full"></div>
            <span>Processing...</span>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {files.map((uploadingFile) => {
          const timeRemaining = getEstimatedTimeRemaining(uploadingFile);
          
          return (
            <div key={uploadingFile.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
              uploadingFile.status === 'uploading' || uploadingFile.status === 'processing'
                ? 'bg-blue-50 border-blue-200 shadow-sm'
                : uploadingFile.status === 'complete'
                  ? 'bg-green-50 border-green-200'
                  : uploadingFile.status === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3 flex-1">
                <FileIcon 
                  file={uploadingFile.file} 
                  showStatus={true}
                  status={uploadingFile.status}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{uploadingFile.file.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <StatusBadge 
                      status={uploadingFile.status}
                      timeRemaining={timeRemaining}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {uploadingFile.status === 'complete' || uploadingFile.status === 'error' ? (
                  <StatusBadge 
                    status={uploadingFile.status}
                    showIcon={true}
                  />
                ) : (
                  <ProgressDisplay progress={uploadingFile.progress} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UploadQueue;