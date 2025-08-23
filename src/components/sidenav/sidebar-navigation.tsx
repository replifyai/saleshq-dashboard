'use client'
import { useRouter } from "next/navigation";
import { NavigationItems } from "./navigation-items";
import { useSideNav } from "@/contexts/sideNav-context";

interface SidebarNavigationProps {
  activeTab: string;
}

export default function SidebarNavigation({ activeTab }: SidebarNavigationProps) {
  const router = useRouter();
  const { isCollapsed } = useSideNav();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="px-4 md:px-0">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavigationItems
          activeTab={activeTab}
          onNavigate={handleNavigate}
          isMobile={false}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
}
