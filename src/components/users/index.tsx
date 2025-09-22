'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import AdminRouteGuard from '@/components/admin-route-guard';
import { userManagementApi, User, UserManagementApiError, SetUserStatusRequest, ChangeUserRoleRequest } from '@/lib/userManagementApi';
import { 
  CreateUserModal, 
  PaginationControls, 
  UserFilters, 
  UserTable, 
  UserDialogs, 
  SearchResultsInfo 
} from './components';

export function UsersPageComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusChangeLoading, setStatusChangeLoading] = useState<string | null>(null);
  const [userToChangeStatus, setUserToChangeStatus] = useState<User | null>(null);
  const [roleChangeLoading, setRoleChangeLoading] = useState<string | null>(null);
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);
  
  // Use the custom debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { toast } = useToast();

  // Fetch users data
  const fetchUsers = async (page: number = currentPage, search?: string, status?: string) => {
    try {
      setLoading(true);
      const searchQuery = search !== undefined ? search : debouncedSearchTerm;
      const statusQuery = status !== undefined ? status : statusFilter;
      const response = await userManagementApi.getAllUsers(pageSize, page, searchQuery, statusQuery);
      setUsers(response.data || []);
      setTotalCount(response.totalCount || 0);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(parseInt(response.page) || page);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: error instanceof UserManagementApiError 
          ? error.message 
          : 'Failed to fetch users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when search term or status filter changes (reset to page 1)
  useEffect(() => {
    setCurrentPage(1);
    fetchUsers(1, debouncedSearchTerm, statusFilter);
  }, [debouncedSearchTerm, statusFilter]);

  // Since we're doing server-side search, we can show pagination for both cases
  // The API will handle filtering and return the correct page of results
  const displayUsers = users;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, debouncedSearchTerm, statusFilter);
  };

  // Handle user creation success
  const handleUserCreated = (newUser: User) => {
    // Refresh the current page to get updated data from server
    fetchUsers(currentPage, debouncedSearchTerm, statusFilter);
    toast({
      title: 'Success',
      description: 'User created successfully!',
    });
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setDeleteLoading(true);
      // Note: The API doesn't seem to have a delete endpoint based on the provided curl commands
      // This would need to be implemented when the delete endpoint is available
      toast({
        title: 'Info',
        description: 'Delete functionality will be implemented when the API endpoint is available.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
      setUserToDelete(null);
    }
  };

  // Handle user status change confirmation
  const handleStatusChangeClick = (user: User) => {
    setUserToChangeStatus(user);
  };

  // Handle user role change confirmation
  const handleRoleChangeClick = (user: User) => {
    setUserToChangeRole(user);
  };

  // Handle user status change
  const handleStatusChange = async () => {
    if (!userToChangeStatus?.id) {
      toast({
        title: 'Error',
        description: 'User ID is required to change status.',
        variant: 'destructive',
      });
      return;
    }

    const newStatus = userToChangeStatus.status === 'active' ? 'inactive' : 'active';
    
    try {
      setStatusChangeLoading(userToChangeStatus.id);
      await userManagementApi.setUserStatus({
        userid: userToChangeStatus.id,
        status: newStatus as 'active' | 'inactive'
      });
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userToChangeStatus.id ? { ...u, status: newStatus } : u
        )
      );
      
      toast({
        title: 'Success',
        description: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`,
      });
    } catch (error) {
      console.error('Error changing user status:', error);
      toast({
        title: 'Error',
        description: error instanceof UserManagementApiError 
          ? error.message 
          : 'Failed to change user status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setStatusChangeLoading(null);
      setUserToChangeStatus(null);
    }
  };

  // Handle user role change
  const handleRoleChange = async (newRole: string) => {
    if (!userToChangeRole?.id) {
      toast({
        title: 'Error',
        description: 'User ID is required to change role.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setRoleChangeLoading(userToChangeRole.id);
      await userManagementApi.changeUserRole({
        userId: userToChangeRole.id,
        role: newRole
      });
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userToChangeRole.id ? { ...u, role: newRole } : u
        )
      );
      
      toast({
        title: 'Success',
        description: `User role changed to ${newRole === 'user' ? 'Agent' : newRole} successfully!`,
      });
    } catch (error) {
      console.error('Error changing user role:', error);
      toast({
        title: 'Error',
        description: error instanceof UserManagementApiError 
          ? error.message 
          : 'Failed to change user role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRoleChangeLoading(null);
      setUserToChangeRole(null);
    }
  };

  // Handler functions
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <AdminRouteGuard>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage users, roles, and permissions across your organization
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              View and manage all users in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />

            {/* Pagination */}
            {!loading && totalPages > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalCount={totalCount}
                pageSize={pageSize}
              />
            )}

            {/* Users Table */}
            <UserTable
              users={displayUsers}
              loading={loading}
              searchTerm={searchTerm}
              onStatusChange={handleStatusChangeClick}
              onRoleChange={handleRoleChangeClick}
              statusChangeLoading={statusChangeLoading}
              roleChangeLoading={roleChangeLoading}
            />
            
            {/* Search Results Info */}
            <SearchResultsInfo
              loading={loading}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              totalCount={totalCount}
              totalPages={totalPages}
              currentPage={currentPage}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>

        {/* Dialogs */}
        <UserDialogs
          isCreateModalOpen={isCreateModalOpen}
          onCloseCreateModal={() => setIsCreateModalOpen(false)}
          onUserCreated={handleUserCreated}
          userToDelete={userToDelete}
          onCloseDeleteDialog={() => setUserToDelete(null)}
          onDeleteUser={handleDeleteUser}
          deleteLoading={deleteLoading}
          userToChangeStatus={userToChangeStatus}
          onCloseStatusDialog={() => setUserToChangeStatus(null)}
          onStatusChange={handleStatusChange}
          statusChangeLoading={statusChangeLoading}
          userToChangeRole={userToChangeRole}
          onCloseRoleDialog={() => setUserToChangeRole(null)}
          onRoleChange={handleRoleChange}
          roleChangeLoading={roleChangeLoading}
        />
      </div>
    </AdminRouteGuard>
  );
}