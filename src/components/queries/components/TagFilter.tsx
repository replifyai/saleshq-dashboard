import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Tag as TagIcon, Plus, Settings } from 'lucide-react';
import { tagApi, Tag } from '@/lib/apiUtils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
}

export function TagFilter({ selectedTags, onTagsChange }: TagFilterProps) {
  const [selectValue, setSelectValue] = useState<string>("");
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Fetch all available tags
  const { data: tagsResponse, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: tagApi.getTags,
  });

  // Ensure allTags is always an array
  const allTags = Array.isArray(tagsResponse) ? tagsResponse : [];

  // Create new tag mutation
  const createTagMutation = useMutation({
    mutationFn: tagApi.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setNewTagName('');
      toast({
        title: "Success",
        description: "Tag created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create tag. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddTag = (tagId: string) => {
    if (!selectedTags.includes(tagId) && tagId !== "no-tags") {
      onTagsChange([...selectedTags, tagId]);
    }
    // Reset the select value to show placeholder again
    setSelectValue("");
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const handleClearAll = () => {
    onTagsChange([]);
    setSelectValue(""); // Reset select value when clearing all
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      createTagMutation.mutate(newTagName.trim());
    }
  };
  const availableTags = allTags.filter(tag => !selectedTags.includes(tag.id));
  const selectedTagObjects = allTags.filter(tag => selectedTags.includes(tag.id));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <TagIcon className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">Filter by Tags:</span>
        <Select value={selectValue} onValueChange={handleAddTag} disabled={isLoadingTags}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select tags..." />
          </SelectTrigger>
          <SelectContent>
            {availableTags.length > 0 ? (
              availableTags.map((tag) => (
                <SelectItem key={tag.id || (tag as any).tagId} value={tag.id || (tag as any).tagId}>
                  {tag.name || (tag as any).tagName}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-tags" disabled key="disabled">
                {isLoadingTags ? 'Loading tags...' : 'No more tags available'}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {selectedTags.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
        {isAdmin && (
          <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Manage Tags
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Manage Tags</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">All Tags</h4>
                  {allTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                      {allTags.map((tag) => (
                        <Badge
                          key={tag.id || (tag as any).tagId}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag.name || (tag as any).tagName}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No tags available</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Create New Tag</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tag name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateTag();
                        }
                      }}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={handleCreateTag}
                      disabled={!newTagName.trim() || createTagMutation.isPending}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {selectedTagObjects.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTagObjects.map((tag) => (
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
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}