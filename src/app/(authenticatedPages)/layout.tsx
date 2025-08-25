import Desktop from "@/components/sidenav/desktop";
import Mobile from "@/components/sidenav/mobile";
import { SideNavProvider } from "@/contexts/sideNav-context";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return <SideNavProvider>
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <Desktop />
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <Mobile />

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          <div className="h-full">
            {children}
          </div>
        </main>
        </div>
      </div>
    </SideNavProvider>
}
