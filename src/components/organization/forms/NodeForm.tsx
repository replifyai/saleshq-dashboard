'use client'
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import type { 
  OrganizationNode, 
  CreateNodeRequest, 
  UpdateNodeRequest
} from '@/types/organization';

// Form validation schema
const nodeFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .refine(val => val.trim().length > 0, 'Name cannot be empty'),
  
  type: z.string()
    .min(1, 'Type is required')
    .max(50, 'Type cannot exceed 50 characters'),
  
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  
  parentId: z.string().nullable().optional(),
  
  managerId: z.string().optional(),
  
  // Metadata fields
  location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),
  costCenter: z.string().max(50, 'Cost center cannot exceed 50 characters').optional(),
  budget: z.number().min(0, 'Budget cannot be negative').optional(),
  headcount: z.number().int().min(0, 'Headcount cannot be negative').optional(),
  targetHeadcount: z.number().int().min(0, 'Target headcount cannot be negative').optional(),
  timezone: z.string().optional(),
});

type NodeFormValues = z.infer<typeof nodeFormSchema>;

interface NodeFormProps {
  node?: OrganizationNode; // For editing existing node
  parentNode?: OrganizationNode; // Parent node for new child
  availableTypes?: string[];
  availableManagers?: { id: string; name: string; title?: string }[];
  onSubmit: (data: CreateNodeRequest | UpdateNodeRequest) => Promise<void>;
  onCancel: () => void;
  onDelete?: (nodeId: string) => Promise<void>;
  loading?: boolean;
  className?: string;
}

// Suggested node types
const DEFAULT_NODE_TYPES = [
  'Company',
  'Division',
  'Department',
  'Team',
  'Unit',
  'Group',
  'Region',
  'Branch',
  'Office',
  'Squad',
  'Pod',
  'Cell',
  'Vertical',
  'Practice',
  'Center',
  'Hub',
  'Cluster',
  'Section',
  'Area',
  'Zone'
];

// Timezone options (subset)
const TIMEZONE_OPTIONS = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Mumbai',
  'Australia/Sydney'
];

export const NodeForm: React.FC<NodeFormProps> = ({
  node,
  parentNode,
  availableTypes = DEFAULT_NODE_TYPES,
  availableManagers = [],
  onSubmit,
  onCancel,
  onDelete,
  loading = false,
  className = ''
}) => {
  const [customType, setCustomType] = useState('');
  const [useCustomType, setUseCustomType] = useState(false);

  const isEditing = !!node;
  const title = isEditing ? 'Edit Organization Unit' : 'Create Organization Unit';

  // Form setup
  const form = useForm<NodeFormValues>({
    resolver: zodResolver(nodeFormSchema),
    defaultValues: {
      name: node?.name || '',
      type: node?.type || '',
      description: '',
      parentId: parentNode?.id || null,
      managerId: '',
      location: '',
      costCenter: '',
      budget: undefined,
      headcount: undefined,
      targetHeadcount: undefined,
      timezone: '',
    },
  });

  // Load existing node data when editing
  useEffect(() => {
    if (node) {
      form.reset({
        name: node.name,
        type: node.type,
        description: node.description || '',
        parentId: node.parentId,
        managerId: node.managerId || '',
        location: node.metadata?.location || '',
        costCenter: node.metadata?.costCenter || '',
        budget: node.metadata?.budget,
        headcount: node.metadata?.headcount,
        targetHeadcount: node.metadata?.targetHeadcount,
        timezone: node.metadata?.timezone || '',
      });

      // Check if using custom type
      if (!availableTypes.includes(node.type)) {
        setUseCustomType(true);
        setCustomType(node.type);
      } else {
        setUseCustomType(false);
        setCustomType('');
      }
    } else {
      form.reset({
        name: '',
        type: '',
        description: '',
        parentId: parentNode?.id || null,
        managerId: '',
        location: '',
        costCenter: '',
        budget: undefined,
        headcount: undefined,
        targetHeadcount: undefined,
        timezone: '',
      });
    }
  }, [node, form, availableTypes, parentNode]);

  // Handle form submission
  const handleSubmit = async (values: NodeFormValues) => {
    try {
      const nodeType = useCustomType ? customType : values.type;
      
      if (!nodeType || nodeType.trim() === '') {
        alert('Please select or enter a unit type');
        return;
      }
      
      const baseData = {
        name: values.name.trim(),
        type: nodeType.trim(),
        description: values.description?.trim() || undefined,
        parentId: values.parentId || null,
        managerId: values.managerId && values.managerId !== 'none' ? values.managerId : undefined,
        metadata: {
          location: values.location?.trim() || undefined,
          costCenter: values.costCenter?.trim() || undefined,
          budget: values.budget,
          headcount: values.headcount,
          targetHeadcount: values.targetHeadcount,
          timezone: values.timezone && values.timezone !== 'none' ? values.timezone : undefined,
        },
      };

      // Remove undefined values from metadata
      const filteredMetadata = Object.fromEntries(
        Object.entries(baseData.metadata).filter(([_, value]) => value !== undefined)
      ) as typeof baseData.metadata;
      baseData.metadata = filteredMetadata;

      if (isEditing && node) {
        const updateData: UpdateNodeRequest = {
          id: node.id,
          ...baseData,
        };
        await onSubmit(updateData);
      } else {
        const createData: CreateNodeRequest = baseData;
        await onSubmit(createData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };



  return (
    <div className={`flex flex-col h-full ${className}`}>
      <CardHeader className="flex-shrink-0 border-b">
        <CardTitle>{title}</CardTitle>
        {parentNode && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Parent:</span>
            <Badge variant="outline">{parentNode.name}</Badge>
            <span>→</span>
            <span className="font-medium">New Unit</span>
          </div>
        )}
      </CardHeader>

      <div className="flex-1 overflow-y-auto">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter unit name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type Field */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Type *</FormLabel>
                      <div className="space-y-2">
                        {!useCustomType ? (
                          <Select
                            value={field.value || ''}
                            onValueChange={(value) => {
                              if (value === 'custom') {
                                setUseCustomType(true);
                                field.onChange('');
                              } else {
                                setUseCustomType(false);
                                field.onChange(value);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableTypes.map(type => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom">Custom Type...</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter custom type"
                              value={customType}
                              onChange={(e) => setCustomType(e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setUseCustomType(false);
                                setCustomType('');
                                field.onChange('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                      {useCustomType && !customType && (
                        <p className="text-sm text-red-600">Custom type is required</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe this organizational unit's purpose and responsibilities"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description to help team members understand this unit's role
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Manager Selection */}
              {availableManagers.length > 0 && (
                <FormField
                  control={form.control}
                  name="managerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager</FormLabel>
                      <Select
                        value={field.value || 'none'}
                        onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No manager assigned</SelectItem>
                          {availableManagers.map(manager => (
                            <SelectItem key={manager.id} value={manager.id}>
                              <div>
                                <div className="font-medium">{manager.name}</div>
                                {manager.title && (
                                  <div className="text-sm text-gray-500">{manager.title}</div>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Separator />

            {/* Location and Operations */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location & Operations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Geographic location or office"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select
                        value={field.value || 'none'}
                        onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No timezone specified</SelectItem>
                          {TIMEZONE_OPTIONS.map(tz => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            </form>
          </Form>
        </CardContent>
      </div>

      {/* Form Actions - Always Visible */}
      <div className="flex-shrink-0 border-t bg-white dark:bg-gray-900 p-4 mt-auto">
        <div className="flex justify-between gap-3">
          <div className="flex gap-2">
            {isEditing && onDelete && node && (
              <Button
                type="button"
                variant="destructive"
                onClick={async () => {
                  if (window.confirm(`Are you sure you want to delete "${node.name}"? This action cannot be undone.`)) {
                    try {
                      await onDelete(node.id);
                      onCancel(); // Close the dialog after successful deletion
                    } catch (error) {
                      console.error('Delete failed:', error);
                    }
                  }
                }}
                disabled={loading}
              >
                Delete Unit
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(handleSubmit)}
              disabled={loading || (useCustomType && !customType)}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Unit' : 'Create Unit'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeForm;