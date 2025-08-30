import { useState } from "react";
import { Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { NavigationItems } from "./navigation-items";
import { getUserInitials } from "@/lib/utils";
import ThemeToggle from "@/components/theme-toggle";
interface MobileNavProps {
  activeTab: string;
  onNavigate: (path: string) => void;
}

export function MobileNav({ activeTab, onNavigate }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsOpen(false); // Close drawer after navigation
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Open navigation menu"
        >
          <Menu className="h-10 w-10" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-80 p-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      >
        <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                SalesHQ
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-500 dark:text-gray-400 text-left">
                Document Intelligence
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Navigation Items */}
          <div className="flex-1 px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Theme</span>
              <ThemeToggle />
            </div>
            <NavigationItems
              activeTab={activeTab}
              onNavigate={handleNavigate}
              isMobile={true}
            />
          </div>
          
          {/* User Section */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {user?.name ? getUserInitials(user.name) : <User className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Logged in'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 