'use client'

import { useAuth } from '@/contexts/auth-context';

/**
 * Custom hook for admin access control
 * Replaces localStorage-based admin checks with proper role-based authentication
 */
export function useAdminAccess() {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated and has admin role
  const isAdmin = isAuthenticated && user?.role === 'admin';
  
  return {
    isAdmin,
    user,
    isAuthenticated
  };
}