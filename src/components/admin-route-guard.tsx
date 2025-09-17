'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

/**
 * Route guard component that protects admin-only pages
 * Redirects non-admin users to a fallback path or shows an access denied message
 */
export default function AdminRouteGuard({ children, fallbackPath = '/practice' }: AdminRouteGuardProps) {
  const { isAdmin, isAuthenticated } = useAdminAccess();
  const { isLoading } = useAuth(); // Get loading state from auth context
  const router = useRouter();

  useEffect(() => {
    // Don't make any redirect decisions while still loading
    if (isLoading) {
      return;
    }

    // If not authenticated, let the auth system handle the redirect
    if (!isAuthenticated) {
      return;
    }

    // If authenticated but not admin, redirect to fallback path
    if (isAuthenticated && !isAdmin) {
      console.log('🚫 Non-admin user accessing admin route, redirecting to:', fallbackPath);
      router.replace(fallbackPath);
    }
  }, [isAdmin, isAuthenticated, isLoading, router, fallbackPath]);

  // Show loading state while checking authentication
  if (isLoading || !isAuthenticated) {
    return null; // Let the auth system handle this
  }

  // Show access denied message for non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access this page. Admin privileges are required.
            </p>
            <Button 
              onClick={() => router.push(fallbackPath)}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is admin, render the protected content
  return <>{children}</>;
}