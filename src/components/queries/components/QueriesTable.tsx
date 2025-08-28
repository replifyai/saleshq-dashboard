import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, User } from 'lucide-react';
import { StatusBadge } from '../atoms/StatusBadge';
import { PriorityBadge } from '../atoms/PriorityBadge';
import { ActionButton } from '../atoms/ActionButton';
import { formatTimestamp } from '../utils/queriesUtils';
import ResolveWithTextDialog from './ResolveWithTextDialog';
import { TagDisplay } from './TagDisplay';
import { TagSelector } from './TagSelector';
import type { UnansweredQuery, Tag } from '@/lib/apiUtils';

interface QueriesTableProps {
  queries: UnansweredQuery[];
  onMarkAsResolved: (queryId: string) => void;
  isLoading?: boolean;
  onQueryUpdate?: (queryId: string, updatedQuery: Partial<UnansweredQuery>) => void;
}

export const QueriesTable: React.FC<QueriesTableProps> = ({
  queries,
  onMarkAsResolved,
  isLoading = false,
  onQueryUpdate
}) => {
  const [localQueries, setLocalQueries] = useState<UnansweredQuery[]>(queries);

  // Update local state when queries prop changes
  React.useEffect(() => {
    setLocalQueries(queries);
  }, [queries]);

  const handleTagAdded = (queryId: string, tag: Tag) => {
    setLocalQueries(prev => 
      prev.map(query => 
        query.id === queryId 
          ? { ...query, tags: [...(query.tags || []), tag] }
          : query
      )
    );
    if (onQueryUpdate) {
      const query = localQueries.find(q => q.id === queryId);
      if (query) {
        onQueryUpdate(queryId, { tags: [...(query.tags || []), tag] });
      }
    }
  };

  const handleTagRemoved = (queryId: string, tagId: string) => {
    setLocalQueries(prev => 
      prev.map(query => 
        query.id === queryId 
          ? { ...query, tags: (query.tags || []).filter(tag => tag.id !== tagId) }
          : query
      )
    );
    if (onQueryUpdate) {
      const query = localQueries.find(q => q.id === queryId);
      if (query) {
        onQueryUpdate(queryId, { tags: (query.tags || []).filter(tag => tag.id !== tagId) });
      }
    }
  };
  return (
    <div className="hidden md:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Query</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Tags</TableHead>
            {/* <TableHead>Priority</TableHead> */}
            <TableHead>Timestamp</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localQueries.map((query) => {
            const timestamp = formatTimestamp(query.timestamp);
            return (
              <TableRow key={query.id}>
                <TableCell>
                  <StatusBadge status={query.status} showIcon={true} />
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={query.message}>
                    {query.message}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">
                        {query.userName || 'Anonymous'}
                      </div>
                      {/* {query.userId && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {query.userId}
                        </div>
                      )} */}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="space-y-2">
                    <TagDisplay tags={query.tags || []} size="sm" />
                    <TagSelector
                      queryId={query.id}
                      currentTags={query.tags || []}
                      onTagAdded={(tag) => handleTagAdded(query.id, tag)}
                      onTagRemoved={(tagId) => handleTagRemoved(query.id, tagId)}
                    />
                  </div>
                </TableCell>
                {/* <TableCell>
                  <PriorityBadge priority={query.priority} />
                </TableCell> */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {timestamp.short}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center justify-center">
                  <div className="flex items-center gap-2 justify-center">
                    <ActionButton
                      status={query.status}
                      onMarkAsResolved={() => onMarkAsResolved(query.id)}
                      isLoading={isLoading}
                    />
                    {query.status !== 'resolved' && (
                      <ResolveWithTextDialog query={query} />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default QueriesTable;