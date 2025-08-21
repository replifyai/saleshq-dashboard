import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { getStatusColor, getStatusText, type UploadingFile } from '../utils/uploadUtils';

interface StatusBadgeProps {
  status: UploadingFile['status'];
  showIcon?: boolean;
  timeRemaining?: string | null;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  showIcon = false,
  timeRemaining 
}) => {
  const renderIcon = () => {
    if (!showIcon) return null;
    
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getContainerClasses = () => {
    if (!showIcon) return '';
    
    switch (status) {
      case 'complete':
        return 'flex items-center space-x-2 text-green-600';
      case 'error':
        return 'flex items-center space-x-2 text-red-600';
      default:
        return 'flex items-center space-x-2';
    }
  };

  return (
    <div className={getContainerClasses()}>
      {renderIcon()}
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-medium ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </span>
        {timeRemaining && (
          <>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-amber-600 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{timeRemaining}</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusBadge;