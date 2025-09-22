import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/lib/userManagementApi';
import { CreateUserModal } from './CreateUserModal';

interface UserDialogsProps {
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
  onUserCreated: (user: User) => void;
  userToDelete: User | null;
  onCloseDeleteDialog: () => void;
  onDeleteUser: () => void;
  deleteLoading: boolean;
  userToChangeStatus: User | null;
  onCloseStatusDialog: () => void;
  onStatusChange: () => void;
  statusChangeLoading: string | null;
  userToChangeRole: User | null;
  onCloseRoleDialog: () => void;
  onRoleChange: (newRole: string) => void;
  roleChangeLoading: string | null;
}

export function UserDialogs({
  isCreateModalOpen,
  onCloseCreateModal,
  onUserCreated,
  userToDelete,
  onCloseDeleteDialog,
  onDeleteUser,
  deleteLoading,
  userToChangeStatus,
  onCloseStatusDialog,
  onStatusChange,
  statusChangeLoading,
  userToChangeRole,
  onCloseRoleDialog,
  onRoleChange,
  roleChangeLoading
}: UserDialogsProps) {
  return (
    <>
      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
        onUserCreated={onUserCreated}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={onCloseDeleteDialog}>
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
              onClick={onDeleteUser}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={!!userToChangeStatus} onOpenChange={onCloseStatusDialog}>
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
              onClick={onStatusChange}
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

      {/* Role Change Dialog */}
      <AlertDialog open={!!userToChangeRole} onOpenChange={onCloseRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Select a new role for <strong>{userToChangeRole?.name}</strong>. 
              This will change their permissions and access level in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select onValueChange={onRoleChange} defaultValue={userToChangeRole?.role}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              disabled={roleChangeLoading === userToChangeRole?.id}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {roleChangeLoading === userToChangeRole?.id 
                ? 'Changing...' 
                : 'Change Role'
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}