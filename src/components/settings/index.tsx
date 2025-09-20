'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { User, Mail, Shield, Calendar, BarChart3, Activity } from "lucide-react";
import { formatFirebaseTimestamp, getUserInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
export default function SettingsPanel() {

  const { user } = useAuth();
  console.log("🚀 ~ SettingsPanel ~ user:", user);

  return (
    <div className="space-y-6 p-6">
      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>User Profile</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user?.name ? getUserInitials(user.name) : <User className="w-8 h-8" />}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.name || 'Unknown User'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                User ID: {user?.uid || 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.email || 'N/A'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Role</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Account Created</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.createdAt ? formatFirebaseTimestamp(user.createdAt) : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Queries Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Activity className="w-4 h-4" />
                <span>Your Usage</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                <Badge variant={"outline"} className="bg-gray-100 text-gray-800 capitalize">
                  {user?.userUsage || 0}
                </Badge>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <BarChart3 className="w-4 h-4" />
                <span>Total Consumed</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                <Badge variant={"outline"} className="bg-gray-100 text-gray-800 capitalize">
                  {user?.allUsage?.totalConsumed || 0}
                </Badge>
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Queries Limit</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                <Badge variant={"outline"} className="bg-gray-100 text-gray-800 capitalize">
                  {user?.allUsage?.limit || 0}
                </Badge>
              </p>
            </div>
          </div>

          {/* Usage Progress Bar */}
          {user?.allUsage && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Usage Progress</span>
                <span>{user.allUsage.totalConsumed} / {user.allUsage.limit}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((user.allUsage.totalConsumed / user.allUsage.limit) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
