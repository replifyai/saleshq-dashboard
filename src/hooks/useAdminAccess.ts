'use client'

import { useAuth } from '@/contexts/auth-context';

/**
 * Custom hook for admin access control
 * Uses JWT token-based role detection from auth context
 */
export function useAdminAccess() {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated and has admin role (from JWT token)
  const isAdmin = isAuthenticated && user?.role === 'admin';
  
  // Log admin status for debugging (can be removed in production)
  if (isAuthenticated && user) {
    console.log('🔐 Admin access check - Role from JWT:', user.role, 'Is Admin:', isAdmin);
  }
  
  return {
    isAdmin,
    user,
    isAuthenticated
  };
}