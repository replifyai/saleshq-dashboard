'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Users as UsersIcon, Search, MoreHorizontal, Trash2, Edit, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import AdminRouteGuard from '@/components/admin-route-guard';
import { userManagementApi, User, UserManagementApiError, SetUserStatusRequest } from '@/lib/userManagementApi';
import { CreateUserModal, PaginationControls } from './components';

export function UsersPageComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusChangeLoading, setStatusChangeLoading] = useState<string | null>(null);
  const [userToChangeStatus, setUserToChangeStatus] = useState<User | null>(null);
  
  const { toast } = useToast();

  // Fetch users data
  const fetchUsers = async (page: number = currentPage, search?: string) => {
    try {
      setLoading(true);
      const searchQuery = search !== undefined ? search : debouncedSearchTerm;
      const response = await userManagementApi.getAllUsers(pageSize, page, searchQuery);
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

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users when search term changes (reset to page 1)
  useEffect(() => {
    setCurrentPage(1);
    fetchUsers(1, debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Since we're doing server-side search, we can show pagination for both cases
  // The API will handle filtering and return the correct page of results
  const displayUsers = users;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  // Handle user creation success
  const handleUserCreated = (newUser: User) => {
    // Refresh the current page to get updated data from server
    fetchUsers(currentPage, debouncedSearchTerm);
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'secondary';
      case 'manager':
        return 'secondary';
      case 'user':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'destructive';
      default:
        return 'outline';
    }
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

        {/* Stats Cards */}
        {/* <UserStatsCards users={users} totalCount={totalCount} /> */}

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              View and manage all users in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div> */}

            {/* Users Table */}
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Queries</TableHead>
                    <TableHead className="text-center">Role</TableHead>
                    <TableHead className="text-center">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="h-4 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : displayUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayUsers.map((user) => (
                      <TableRow key={user.id || user.email}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getStatusBadgeVariant(user.status || '')} className="capitalize">
                            {user.status || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {user.usage}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role === "user" ? "Agent" : "Admin"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {/* @ts-ignore */}
                          {user.createdAt ? new Date(user?.createdAt?._seconds * 1000).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem> */}
                              <DropdownMenuItem 
                                onClick={() => handleStatusChangeClick(user)}
                                disabled={statusChangeLoading === user.id}
                                className={user.status === 'active' ? 'text-orange-600' : 'text-green-600'}
                              >
                                {statusChangeLoading === user.id ? (
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                ) : user.status === 'active' ? (
                                  <UserX className="mr-2 h-4 w-4" />
                                ) : (
                                  <UserCheck className="mr-2 h-4 w-4" />
                                )}
                                {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => setUserToDelete(user)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem> */}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Search Results Info */}
            {!loading && searchTerm && (
              <div className="flex items-center justify-center py-4">
                <p className="text-sm text-muted-foreground">
                  {totalCount > 0 ? (
                    <>
                      Found {totalCount} result{totalCount !== 1 ? 's' : ''} for "{searchTerm}"
                      {totalPages > 1 && (
                        <span> (showing page {currentPage} of {totalPages})</span>
                      )}
                    </>
                  ) : (
                    <>No results found for "{searchTerm}"</>
                  )}
                  <span className="ml-2">
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="text-primary hover:underline"
                    >
                      Clear search
                    </button>
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onUserCreated={handleUserCreated}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user account for{' '}
                <strong>{userToDelete?.name}</strong> and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteLoading ? 'Deleting...' : 'Delete User'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Status Change Confirmation Dialog */}
        <AlertDialog open={!!userToChangeStatus} onOpenChange={() => setUserToChangeStatus(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change User Status</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {userToChangeStatus?.status === 'active' ? 'deactivate' : 'activate'} the user{' '}
                <strong>{userToChangeStatus?.name}</strong>? 
                {userToChangeStatus?.status === 'active' 
                  ? ' They will no longer be able to access the system.' 
                  : ' They will regain access to the system.'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleStatusChange}
                disabled={statusChangeLoading === userToChangeStatus?.id}
                className={userToChangeStatus?.status === 'active' 
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
                }
              >
                {statusChangeLoading === userToChangeStatus?.id 
                  ? 'Changing...' 
                  : `${userToChangeStatus?.status === 'active' ? 'Deactivate' : 'Activate'} User`
                }
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminRouteGuard>
  );
}