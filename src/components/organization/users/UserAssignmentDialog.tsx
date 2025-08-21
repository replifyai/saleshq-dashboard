"use client"
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, Crown, Mail } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';


import type { OrganizationUser, OrganizationNode, AssignUserRequest } from '@/types/organization';

interface UserAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node?: OrganizationNode;
  availableUsers: OrganizationUser[];
  onAssignUser: (data: AssignUserRequest) => Promise<void>;
  loading?: boolean;
}

// Role options with descriptions
const ROLE_OPTIONS = [
  { value: 'manager', label: 'Manager', description: 'Team/unit manager with full permissions' },
  { value: 'lead', label: 'Team Lead', description: 'Technical or project lead' },
  { value: 'senior', label: 'Senior Member', description: 'Experienced team member' },
  { value: 'member', label: 'Member', description: 'Regular team member' },
  { value: 'intern', label: 'Intern', description: 'Temporary or training position' },
  { value: 'contractor', label: 'Contractor', description: 'External contractor' },
  { value: 'consultant', label: 'Consultant', description: 'External consultant' },
  { value: 'admin', label: 'Admin', description: 'Administrative role' },
];

export const UserAssignmentDialog: React.FC<UserAssignmentDialogProps> = ({
  open,
  onOpenChange,
  node,
  availableUsers,
  onAssignUser,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [assignments, setAssignments] = useState<Map<string, { role: string; title: string }>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setSelectedUsers(new Set());
      setAssignments(new Map());
    }
  }, [open]);

  // Filter users based on search term
  const filteredUsers = availableUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.title && user.title.toLowerCase().includes(searchLower)) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  // Handle user selection
  const handleUserToggle = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
      const newAssignments = new Map(assignments);
      newAssignments.delete(userId);
      setAssignments(newAssignments);
    } else {
      newSelected.add(userId);
      // Set default assignment data
      const newAssignments = new Map(assignments);
      newAssignments.set(userId, { role: 'member', title: '' });
      setAssignments(newAssignments);
    }
    setSelectedUsers(newSelected);
  };

  // Handle assignment data change
  const handleAssignmentChange = (userId: string, field: 'role' | 'title', value: string) => {
    const newAssignments = new Map(assignments);
    const current = newAssignments.get(userId) || { role: 'member', title: '' };
    newAssignments.set(userId, { ...current, [field]: value });
    setAssignments(newAssignments);
  };

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      // Deselect all
      setSelectedUsers(new Set());
      setAssignments(new Map());
    } else {
      // Select all filtered users
      const newSelected = new Set(filteredUsers.map(u => u.id));
      const newAssignments = new Map();
      filteredUsers.forEach(user => {
        newAssignments.set(user.id, { role: 'member', title: '' });
      });
      setSelectedUsers(newSelected);
      setAssignments(newAssignments);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!node || selectedUsers.size === 0) return;

    setIsSubmitting(true);
    try {
      // Assign users one by one
      for (const userId of selectedUsers) {
        const assignment = assignments.get(userId);
        if (assignment) {
          await onAssignUser({
            userId,
            nodeId: node.id,
            role: assignment.role,
            title: assignment.title || undefined,
          });
        }
      }
      
      // Close dialog on success
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to assign users:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get user status badge
  const getUserStatusBadge = (user: OrganizationUser) => {
    switch (user.status) {
      case 'active':
        return <Badge variant="default" className="text-xs bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="text-xs">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-xs">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Assign Users to Organization Unit
          </DialogTitle>
          {node && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Target:</span>
              <Badge variant="outline">{node.name}</Badge>
              <span>({node.type})</span>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* Search and Bulk Actions */}
          <div className="flex-shrink-0 flex items-center gap-4 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name, email, title, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {filteredUsers.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedUsers.size === filteredUsers.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>

          {/* Selection Summary */}
          {selectedUsers.size > 0 && (
            <div className="flex-shrink-0">
              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <Users className="w-4 h-4" />
                    <span>
                      {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected for assignment
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users List - Scrollable Area */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No users found</p>
                {searchTerm && (
                  <p className="text-sm">Try adjusting your search criteria</p>
                )}
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedUsers.has(user.id);
                const assignment = assignments.get(user.id);

                return (
                  <Card 
                    key={user.id} 
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleUserToggle(user.id)}
                          className="mt-1"
                        />

                        {/* User Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium truncate">{user.name}</h4>
                              {user.managerId === user.id && (
                                <Crown className="w-4 h-4 text-yellow-500" />
                              )}
                              <Badge variant="outline" className="text-xs">
                                {user.role}
                              </Badge>
                              {getUserStatusBadge(user)}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{user.email}</span>
                              </div>
                              {user.title && (
                                <span className="truncate">{user.title}</span>
                              )}
                            </div>

                            {/* Current assignments */}
                            {user.nodeIds.length > 0 && (
                              <div className="mt-2 text-xs text-gray-500">
                                Currently assigned to {user.nodeIds.length} unit{user.nodeIds.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Assignment Configuration */}
                        {isSelected && assignment && (
                          <div className="flex-shrink-0 w-80 space-y-3 pl-4 border-l">
                            <Label className="text-sm font-medium">Assignment Details</Label>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`role-${user.id}`} className="text-xs">
                                Role *
                              </Label>
                              <Select
                                value={assignment.role}
                                onValueChange={(value) => handleAssignmentChange(user.id, 'role', value)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ROLE_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div>
                                        <div className="font-medium">{option.label}</div>
                                        <div className="text-xs text-gray-500">{option.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`title-${user.id}`} className="text-xs">
                                Job Title (Optional)
                              </Label>
                              <Input
                                id={`title-${user.id}`}
                                placeholder="e.g., Senior Software Engineer"
                                value={assignment.title}
                                onChange={(e) => handleAssignmentChange(user.id, 'title', e.target.value)}
                                className="h-8"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Actions - Fixed at Bottom */}
        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t bg-white dark:bg-gray-900">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedUsers.size === 0 || isSubmitting || loading}
          >
            {isSubmitting ? 'Assigning...' : `Assign ${selectedUsers.size} User${selectedUsers.size !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserAssignmentDialog;