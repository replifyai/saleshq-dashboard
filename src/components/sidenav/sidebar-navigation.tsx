'use client'
import { useRouter } from "next/navigation";
import { NavigationItems } from "./navigation-items";

interface SidebarNavigationProps {
  activeTab: string;
}

export default function SidebarNavigation({ activeTab }: SidebarNavigationProps) {
  const router = useRouter();

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
        />
      </div>
    </div>
  );
}
