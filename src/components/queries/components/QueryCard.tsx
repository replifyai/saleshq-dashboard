import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';
import { StatusBadge } from '../atoms/StatusBadge';
import { PriorityBadge } from '../atoms/PriorityBadge';
import { ActionButton } from '../atoms/ActionButton';
import ResolveWithTextDialog from './ResolveWithTextDialog';
import { formatTimestamp } from '../utils/queriesUtils';
import type { UnansweredQuery } from '@/lib/apiUtils';

interface QueryCardProps {
  query: UnansweredQuery;
  onMarkAsResolved: (queryId: string) => void;
  isLoading?: boolean;
}

export const QueryCard: React.FC<QueryCardProps> = ({
  query,
  onMarkAsResolved,
  isLoading = false
}) => {
  const timestamp = formatTimestamp(query.timestamp);

  // Get moving border colors based on priority and status
  const getBorderColors = () => {
    if (query.status === 'resolved') {
      return {
        '--mb-color-1': '#10b981',
        '--mb-color-2': '#059669',
        '--mb-duration': '4s'
      };
    }
    
    switch (query.priority) {
      case 'high':
        return {
          '--mb-color-1': '#ef4444',
          '--mb-color-2': '#dc2626',
          '--mb-duration': '1.5s'
        };
      case 'medium':
        return {
          '--mb-color-1': '#f59e0b',
          '--mb-color-2': '#d97706',
          '--mb-duration': '2.5s'
        };
      case 'low':
        return {
          '--mb-color-1': '#3b82f6',
          '--mb-color-2': '#2563eb',
          '--mb-duration': '3.5s'
        };
      default:
        return {
          '--mb-color-1': '#6b7280',
          '--mb-color-2': '#4b5563',
          '--mb-duration': '3s'
        };
    }
  };

  return (
    <Card 
      className="border border-gray-200 dark:border-gray-700 rounded-lg"
      style={{
        ...getBorderColors(),
        '--mb-opacity': '0.7',
        '--mb-glow-opacity': '0.4',
        '--mb-shadow-duration': '8s'
      } as React.CSSProperties}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Status and Priority Row */}
          <div className="flex items-center justify-between">
            <StatusBadge status={query.status} showIcon={true} />
            <PriorityBadge priority={query.priority} />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
              {query.message}
            </p>
            {query.context && (
              <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <span className="font-medium">Context:</span> {query.context}
              </p>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>{query.userEmail || 'Anonymous'}</span>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{timestamp.short} at {timestamp.time}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <ActionButton
              status={query.status}
              onMarkAsResolved={() => onMarkAsResolved(query.id)}
              isLoading={isLoading}
              fullWidth={true}
            />
            {query.status !== 'resolved' && (
              <ResolveWithTextDialog
                query={query}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueryCard;