import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { FileIcon } from '../atoms/FileIcon';
import { formatFileSize, type SelectedFile } from '../utils/uploadUtils';

interface SelectedFilesListProps {
  files: SelectedFile[];
  onRemoveFile: (fileId: string) => void;
  onStartUpload: () => void;
  hasActiveUploads: boolean;
}

export const SelectedFilesList: React.FC<SelectedFilesListProps> = ({
  files,
  onRemoveFile,
  onStartUpload,
  hasActiveUploads
}) => {
  if (files.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium text-gray-900">Selected Files</h3>
        <Button 
          onClick={onStartUpload}
          disabled={files.length === 0 || hasActiveUploads}
          className="flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload {files.length} file{files.length !== 1 ? 's' : ''}</span>
        </Button>
      </div>
      <div className="space-y-2">
        {files.map((selectedFile) => (
          <div key={selectedFile.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 border-gray-200">
            <div className="flex items-center space-x-3 flex-1">
              <FileIcon file={selectedFile.file} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.file.size)} MB</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(selectedFile.id)}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedFilesList;