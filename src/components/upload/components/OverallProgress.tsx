import React from 'react';
import { Progress } from '@/components/ui/progress';
import { calculateOverallProgress, type UploadingFile } from '../utils/uploadUtils';

interface OverallProgressProps {
  files: UploadingFile[];
  hasActiveUploads: boolean;
}

export const OverallProgress: React.FC<OverallProgressProps> = ({
  files,
  hasActiveUploads
}) => {
  if (files.length <= 1 || !hasActiveUploads) return null;

  const completedFiles = files.filter(f => f.status === 'complete').length;
  const overallProgress = calculateOverallProgress(files);

  return (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-900">Overall Progress</span>
        <span className="text-xs text-blue-700">
          {completedFiles} of {files.length} files complete
        </span>
      </div>
      <Progress 
        value={overallProgress}
        className="h-2"
      />
    </div>
  );
};

export default OverallProgress;