"use client";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
type SideNavContextValue = {
    activeTab: string;
    handleNavigate: (tab: string) => void;
    isCollapsed: boolean;
    toggleCollapsed: () => void;
    setCollapsed: (collapsed: boolean) => void;
};
export const SideNavContext = createContext<SideNavContextValue | null>(null);
const getActiveTab = (pathname: string): string => {
    switch (pathname) {
        case "/chat":
            return "chat";
        case "/practice":
            return "practice";
        case "/upload":
            return "upload";
        case "/library":
            return "library";
        case "/queries":
            return "queries";
        case "/settings":
            return "settings";
        case "/organization":
            return "organization";
        case "/shopify":
            return "shopify";
        case "/users":
            return "users";
        case "/app":
            return "chat"; // Default to chat for app path
        default:
            return "chat";
    }
};
export const useSideNav = (): SideNavContextValue => {
    const ctx = useContext(SideNavContext);
    if (!ctx) throw new Error('useSideNav must be used within <SideNavProvider>');
    return ctx;
};

export const SideNavProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState(getActiveTab(pathname));
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const router = useRouter();

    const handleNavigate = (value: string) => {
        const path = value.startsWith('/') ? value : `/${value}`;
        setActiveTab(getActiveTab(path));
        router.push(path);
    };

    // Keep activeTab in sync with the current route
    useEffect(() => {
        setActiveTab(getActiveTab(pathname));
    }, [pathname]);

    // Initialize and persist collapsed state
    useEffect(() => {
        try {
            const stored = typeof window !== 'undefined' ? window.localStorage.getItem('sideNav.collapsed') : null;
            if (stored !== null) {
                setIsCollapsed(stored === 'true');
            }
        } catch {}
    }, []);

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('sideNav.collapsed', String(isCollapsed));
            }
        } catch {}
    }, [isCollapsed]);

    const toggleCollapsed = () => setIsCollapsed(prev => !prev);
    const setCollapsed = (collapsed: boolean) => setIsCollapsed(collapsed);

    return (
        <SideNavContext.Provider value={{ activeTab, handleNavigate, isCollapsed, toggleCollapsed, setCollapsed }}>
            {children}
        </SideNavContext.Provider>
    );
};