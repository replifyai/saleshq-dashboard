import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User } from '@/lib/userManagementApi';
import { UserActions } from './UserActions';

interface UserTableProps {
  users: User[];
  loading: boolean;
  searchTerm: string;
  onStatusChange: (user: User) => void;
  onRoleChange: (user: User) => void;
  statusChangeLoading: string | null;
  roleChangeLoading: string | null;
}

export function UserTable({ 
  users, 
  loading, 
  searchTerm, 
  onStatusChange, 
  onRoleChange,
  statusChangeLoading,
  roleChangeLoading
}: UserTableProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
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
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
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
                  <UserActions
                    user={user}
                    onStatusChange={onStatusChange}
                    onRoleChange={onRoleChange}
                    statusChangeLoading={statusChangeLoading}
                    roleChangeLoading={roleChangeLoading}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}