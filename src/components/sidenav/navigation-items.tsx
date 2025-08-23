import { MessageCircle, Upload, FolderOpen, AlertCircle, Brain, Home, Building2,Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSideNav } from "@/contexts/sideNav-context";
interface NavigationItemsProps {
  activeTab: string;
  onNavigate: (path: string) => void;
  isMobile?: boolean;
  isCollapsed?: boolean;
}

const navigationTabs = [
  { 
    id: "upload", 
    label: "Create Product", 
    icon: Upload, 
    description: "Add documents", 
    path: "/upload", 
    disabled: false 
  },
  { 
    id: "library", 
    label: "Library", 
    icon: FolderOpen, 
    description: "View documents", 
    path: "/library", 
    disabled: false 
  },
  { 
    id: "organization", 
    label: "Organization", 
    icon: Building2, 
    description: "Manage hierarchy", 
    path: "/organization", 
    disabled: false 
  },
  { 
    id: "practice", 
    label: "Learn & Practice", 
    icon: Brain, 
    description: "Take quiz", 
    path: "/practice" 
  },
  { 
    id: "chat", 
    label: "Chat", 
    icon: MessageCircle, 
    description: "Ask questions", 
    path: "/chat" 
  },
  { 
    id: "queries", 
    label: "Unanswered Queries", 
    icon: AlertCircle, 
    description: "Unanswered queries", 
    path: "/queries", 
    disabled: false 
  },
  { 
    id: "liveAssistant", 
    label: "Live Assistant", 
    icon: Bot, 
    description: "Live Assistant", 
    path: "/live", 
    disabled: true 
  },
];

export function NavigationItems({ activeTab, onNavigate, isMobile = false, isCollapsed = false }: NavigationItemsProps) {
  const { handleNavigate } = useSideNav();
  return (
    <div className="space-y-1">
      <nav className="space-y-1">
        {navigationTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => handleNavigate(tab.path)}
              disabled={isDisabled}
              className={`
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                w-full justify-start px-3 py-2 h-auto text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-900 hover:text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <Icon className={`${isCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
              {!isCollapsed && (
                <div className="text-left flex-1">
                  <div className="font-medium">{tab.label}</div>
                  {!isMobile && (
                    <div className="text-xs opacity-70">{tab.description}</div>
                  )}
                </div>
              )}
            </Button>
          );
        })}
      </nav>
      
      {/* Back to Landing Link */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 h-auto text-sm font-medium rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
          >
            <Home className={`${isCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
            {!isCollapsed && (
              <div className="text-left flex-1">
                <div className="font-medium">Back to Landing</div>
                {!isMobile && (
                  <div className="text-xs opacity-70">Return to homepage</div>
                )}
              </div>
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export { navigationTabs }; 