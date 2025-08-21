/**
 * Upload utility functions for file validation, status management, and progress calculations
 */

export interface UploadingFile {
  id: string;
  file: File;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  documentId?: string;
  startTime?: number;
}

export interface SelectedFile {
  id: string;
  file: File;
}

/**
 * File validation constants
 */
export const ALLOWED_FILE_TYPES = [
  'application/pdf', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
  'text/plain'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validate if file type is allowed
 */
export const isValidFileType = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

/**
 * Validate if file size is within limits
 */
export const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

/**
 * Get file icon class based on file type
 */
export const getFileIconClass = (file: File): string => {
  if (file.type === 'application/pdf') return 'fas fa-file-pdf text-red-500';
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'fas fa-file-word text-blue-500';
  if (file.type === 'text/plain') return 'fas fa-file-alt text-gray-500';
  return 'fas fa-file text-gray-500';
};

/**
 * Get status color based on upload status
 */
export const getStatusColor = (status: UploadingFile['status']): string => {
  switch (status) {
    case 'complete': return 'text-accent';
    case 'error': return 'text-destructive';
    case 'processing': return 'text-orange-600';
    default: return 'text-gray-500';
  }
};

/**
 * Get status text based on upload status
 */
export const getStatusText = (status: UploadingFile['status']): string => {
  switch (status) {
    case 'uploading': return 'Uploading...';
    case 'processing': return 'Processing chunks...';
    case 'complete': return 'Complete';
    case 'error': return 'Error';
  }
};

/**
 * Calculate estimated time remaining for upload
 */
export const getEstimatedTimeRemaining = (file: UploadingFile): string | null => {
  if (!file.startTime || file.status !== 'uploading') return null;
  
  const elapsed = Date.now() - file.startTime;
  const progress = Math.max(file.progress, 1); // Avoid division by zero
  const totalEstimated = (elapsed / progress) * 100;
  const remaining = Math.max(0, totalEstimated - elapsed);
  
  if (remaining < 60000) { // Less than 1 minute
    return `~${Math.round(remaining / 1000)}s remaining`;
  } else {
    return `~${Math.round(remaining / 60000)}m remaining`;
  }
};

/**
 * Check if there are active uploads
 */
export const hasActiveUploads = (uploadingFiles: UploadingFile[]): boolean => {
  return uploadingFiles.some(file => 
    file.status === 'uploading' || file.status === 'processing'
  );
};

/**
 * Format file size to MB
 */
export const formatFileSize = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2);
};

/**
 * Generate unique file ID
 */
export const generateFileId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Calculate overall upload progress
 */
export const calculateOverallProgress = (uploadingFiles: UploadingFile[]): number => {
  if (uploadingFiles.length === 0) return 0;
  const completedFiles = uploadingFiles.filter(f => f.status === 'complete').length;
  return (completedFiles / uploadingFiles.length) * 100;
};