import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';

interface ActionButtonProps {
  status: string;
  onMarkAsResolved: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'default';
  fullWidth?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  status,
  onMarkAsResolved,
  isLoading = false,
  size = 'sm',
  fullWidth = false
}) => {
  if (status === 'resolved') {
    return (
      <Badge variant="outline" className="text-green-600">
        Resolved
      </Badge>
    );
  }

  if (status === 'pending') {
    return (
      <Button
        size={size}
        title="Resolve"
        onClick={onMarkAsResolved}
        disabled={isLoading}
        className={`rounded-lg ${fullWidth ? 'w-full mt-3' : ''}`}
        style={{
          '--mb-color-1': '#3b82f6',
          '--mb-color-2': '#8b5cf6',
          '--mb-duration': '2s',
          '--mb-opacity': '0.8',
          '--mb-shadow-duration': '4s'
        } as React.CSSProperties}
      >
        {isLoading ? (
          <LoadingSpinner size="sm" className="border-white" />
        ) : (
            <CheckCircle2 className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return null;
};

export default ActionButton;