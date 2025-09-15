'use client'

import { Shield } from 'lucide-react';
import { useAdminAccess } from '@/hooks/useAdminAccess';

export default function HeaderAdminToggle() {
  const { isAdmin, user } = useAdminAccess();

  // Only show admin indicator if user has admin role
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
        Admin: {user?.name || user?.email}
      </span>
    </div>
  );
}