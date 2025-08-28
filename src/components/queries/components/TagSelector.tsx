import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Tag as TagIcon, X } from 'lucide-react';
import { tagApi, Tag } from '@/lib/apiUtils';
import { useToast } from '@/hooks/use-toast';

interface TagSelectorProps {
  queryId: string;
  currentTags: Tag[];
  onTagAdded: (tag: Tag) => void;
  onTagRemoved: (tagId: string) => void;
}

export function TagSelector({ queryId, currentTags, onTagAdded, onTagRemoved }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all available tags
  const { data: tagsResponse, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: tagApi.getTags,
  });

  // Ensure allTags is always an array
  const allTags = Array.isArray(tagsResponse) ? tagsResponse : [];

  // Add tag to query mutation
  const addTagMutation = useMutation({
    mutationFn: ({ queryId, tagId }: { queryId: string; tagId: string }) =>
      tagApi.addTagToQuery(queryId, tagId),
    onSuccess: (_, { tagId }) => {
      const tag = allTags.find(t => t.id === tagId);
      if (tag) {
        onTagAdded(tag);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/unanswered-queries'] });
      toast({
        title: "Success",
        description: "Tag added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add tag. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove tag from query mutation
  const removeTagMutation = useMutation({
    mutationFn: ({ queryId, tagId }: { queryId: string; tagId: string }) =>
      tagApi.removeTagFromQuery(queryId, tagId),
    onSuccess: (_, { tagId }) => {
      onTagRemoved(tagId);
      queryClient.invalidateQueries({ queryKey: ['/api/unanswered-queries'] });
      toast({
        title: "Success",
        description: "Tag removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove tag. Please try again.",
        variant: "destructive",
      });
    },
  });

  const currentTagIds = currentTags.map(tag => tag.id);
  const availableTags = allTags.filter(tag => !currentTagIds.includes(tag.id));

  const handleAddTag = (tagId: string) => {
    addTagMutation.mutate({ queryId, tagId });
  };

  const handleRemoveTag = (tagId: string) => {
    removeTagMutation.mutate({ queryId, tagId });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-6">
          <TagIcon className="h-2 w-2 mr-1" />
          Tag Query
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Current Tags</h4>
            {currentTags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {currentTags.map((tag) => (
                  <Badge
                    key={tag.id || (tag as any).tagId}
                    variant="default"
                    className="text-xs flex items-center gap-1"
                  >
                    {tag.name || (tag as any).tagName}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-3 w-3 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveTag(tag.id || (tag as any).tagId)}
                      disabled={removeTagMutation.isPending}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No tags assigned</p>
            )}
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Available Tags</h4>
            {isLoadingTags ? (
              <p className="text-sm text-gray-500">Loading tags...</p>
            ) : availableTags.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-secondary"
                    onClick={() => handleAddTag(tag.id)}
                  >
                    <Plus className="h-2 w-2 mr-1" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No available tags</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}