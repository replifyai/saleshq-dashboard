import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';
import { StatusBadge } from '../atoms/StatusBadge';
import { PriorityBadge } from '../atoms/PriorityBadge';
import { ActionButton } from '../atoms/ActionButton';
import ResolveWithTextDialog from './ResolveWithTextDialog';
import { TagDisplay } from './TagDisplay';
import { TagSelector } from './TagSelector';
import { formatTimestamp } from '../utils/queriesUtils';
import type { UnansweredQuery, Tag } from '@/lib/apiUtils';

interface QueryCardProps {
  query: UnansweredQuery;
  onMarkAsResolved: (queryId: string) => void;
  isLoading?: boolean;
  onQueryUpdate?: (queryId: string, updatedQuery: Partial<UnansweredQuery>) => void;
}

export const QueryCard: React.FC<QueryCardProps> = ({
  query,
  onMarkAsResolved,
  isLoading = false,
  onQueryUpdate
}) => {
  const [localQuery, setLocalQuery] = useState<UnansweredQuery>(query);
  const timestamp = formatTimestamp(localQuery.timestamp);

  // Update local state when query prop changes
  React.useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleTagAdded = (tag: Tag) => {
    const updatedQuery = { ...localQuery, tags: [...(localQuery.tags || []), tag] };
    setLocalQuery(updatedQuery);
    if (onQueryUpdate) {
      onQueryUpdate(localQuery.id, { tags: updatedQuery.tags });
    }
  };

  const handleTagRemoved = (tagId: string) => {
    const updatedQuery = { ...localQuery, tags: (localQuery.tags || []).filter(tag => tag.id !== tagId) };
    setLocalQuery(updatedQuery);
    if (onQueryUpdate) {
      onQueryUpdate(localQuery.id, { tags: updatedQuery.tags });
    }
  };

  // Get moving border colors based on priority and status
  const getBorderColors = () => {
    if (localQuery.status === 'resolved') {
      return {
        '--mb-color-1': '#10b981',
        '--mb-color-2': '#059669',
        '--mb-duration': '4s'
      };
    }
    
    switch (localQuery.priority) {
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
            <StatusBadge status={localQuery.status} showIcon={true} />
            <PriorityBadge priority={localQuery.priority} />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
              {localQuery.message}
            </p>
            {localQuery.context && (
              <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <span className="font-medium">Context:</span> {localQuery.context}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <TagDisplay tags={localQuery.tags || []} size="sm" />
            <TagSelector
              queryId={localQuery.id}
              currentTags={localQuery.tags || []}
              onTagAdded={handleTagAdded}
              onTagRemoved={handleTagRemoved}
            />
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>{localQuery.userEmail || 'Anonymous'}</span>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{timestamp.short} at {timestamp.time}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <ActionButton
              status={localQuery.status}
              onMarkAsResolved={() => onMarkAsResolved(localQuery.id)}
              isLoading={isLoading}
              fullWidth={true}
            />
            {localQuery.status !== 'resolved' && (
              <ResolveWithTextDialog
                query={localQuery}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueryCard;