import React from 'react';
import { FolderOpen } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <FolderOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4 mx-auto" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
      <p className="text-gray-500 dark:text-gray-400">
        Create some products to get started.
      </p>
    </div>
  );
};

export default EmptyState;