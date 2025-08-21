import React from 'react';
import { 
  FileText, 
  FileImage, 
  FileSpreadsheet, 
  Presentation, 
  File 
} from 'lucide-react';

interface FileIconProps {
  filename: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ filename, className = "w-4 h-4" }) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf': 
      return <FileText className={`text-red-500 ${className}`} />;
    case 'docx': 
    case 'doc': 
      return <FileText className={`text-blue-500 ${className}`} />;
    case 'txt': 
      return <FileText className={`text-gray-500 ${className}`} />;
    case 'xlsx':
    case 'xls': 
      return <FileSpreadsheet className={`text-green-500 ${className}`} />;
    case 'pptx':
    case 'ppt': 
      return <Presentation className={`text-orange-500 ${className}`} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': 
      return <FileImage className={`text-purple-500 ${className}`} />;
    default: 
      return <File className={`text-gray-500 ${className}`} />;
  }
};

export default FileIcon;