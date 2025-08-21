import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getPriorityColor } from '../utils/queriesUtils';

interface PriorityBadgeProps {
  priority?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  return (
    <Badge className={getPriorityColor(priority)}>
      {priority || 'medium'}
    </Badge>
  );
};

export default PriorityBadge;