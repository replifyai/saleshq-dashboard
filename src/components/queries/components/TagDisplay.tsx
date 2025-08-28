import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Tag } from '@/lib/apiUtils';

interface TagDisplayProps {
  tags: Tag[];
  onRemoveTag?: (tagId: string) => void;
  isEditable?: boolean;
  size?: 'sm' | 'default';
}

export function TagDisplay({ tags, onRemoveTag, isEditable = false, size = 'default' }: TagDisplayProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge
          // @ts-ignore
          key={tag.tagId || tag.id}
          variant="default"
          className={`${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2 py-1'} flex items-center gap-1`}
        >
          <span>{tag.name}</span>
          {isEditable && onRemoveTag && (
            <Button
              size="icon"
              variant="ghost"
              className="h-3 w-3 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                // @ts-ignore
                onRemoveTag(tag.tagId || tag.id);
              }}
            >
              <X className="h-2 w-2" />
            </Button>
          )}
        </Badge>
      ))}
    </div>
  );
}