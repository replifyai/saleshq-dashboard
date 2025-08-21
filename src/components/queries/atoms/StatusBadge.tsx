import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { getStatusLabel } from '../utils/queriesUtils';

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = false }) => {
  const getStatusIcon = (status: string) => {
    return status === 'resolved' ? (
      <CheckCircle2 className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-orange-600" />
    );
  };

  return (
    <div className="flex items-center gap-2">
      {showIcon && getStatusIcon(status)}
      <Badge
        variant={status === 'resolved' ? 'default' : 'secondary'}
        className={status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
      >
        {getStatusLabel(status)}
      </Badge>
    </div>
  );
};

export default StatusBadge;