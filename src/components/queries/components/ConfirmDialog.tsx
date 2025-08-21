import React from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import type { UnansweredQuery } from '@/lib/apiUtils';

interface ConfirmDialogProps {
  isOpen: boolean;
  query: UnansweredQuery | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  query,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  if (!isOpen || !query) return null;

  return (
    // make the background glassmorphism
    <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4"
        style={{
          '--mb-color-1': '#ef4444',
          '--mb-color-2': '#f97316',
          '--mb-duration': '2s',
          '--mb-opacity': '0.8',
          '--mb-glow-opacity': '0.5',
          '--mb-shadow-duration': '3s'
        } as React.CSSProperties}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirm Resolution
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Are you sure you want to mark this query as resolved?
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Query:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {query.message}
              </p>
              {query.userEmail && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  From: {query.userEmail}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="border-white" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Resolved
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;