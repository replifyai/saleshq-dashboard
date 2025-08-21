'use client'
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface FileDropzoneProps {
  onFileSelect: (files: FileList | null) => void;
  hasActiveUploads: boolean;
  productName: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  hasActiveUploads,
  productName
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-blue-50');
    if (!hasActiveUploads && productName.trim()) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!hasActiveUploads && productName.trim()) {
      e.currentTarget.classList.add('border-primary', 'bg-blue-50');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-blue-50');
  };

  const handleClick = () => {
    if (!hasActiveUploads && productName.trim()) {
      fileInputRef.current?.click();
    }
  };

  const isDisabled = hasActiveUploads || !productName.trim();

  return (
    <div 
      className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors ${
        isDisabled 
          ? 'cursor-not-allowed opacity-50 bg-gray-50' 
          : 'cursor-pointer hover:border-primary'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {hasActiveUploads ? 'Upload in Progress...' : 'Drop files here or click to select'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Supports PDF, DOCX, TXT files up to 10MB each</p>
          {!productName.trim() && !hasActiveUploads && (
            <p className="text-sm text-red-500 mt-1">Please enter a product name first</p>
          )}
          {hasActiveUploads && (
            <p className="text-sm text-amber-600 mt-1">Please wait for current uploads to complete</p>
          )}
        </div>
        <Button 
          variant="default" 
          disabled={isDisabled}
          className={hasActiveUploads ? 'opacity-50' : ''}
        >
          {hasActiveUploads ? 'Processing Files...' : 'Select Files'}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files)}
        disabled={hasActiveUploads}
      />
    </div>
  );
};

export default FileDropzone;