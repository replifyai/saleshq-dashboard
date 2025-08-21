'use client'
import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { MobileNav } from './mobile-nav';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import ThemeToggle from '../theme-toggle';
import { useSideNav } from '@/contexts/sideNav-context';

const Mobile = () => {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { activeTab, handleNavigate } = useSideNav();
    return (
        <>
            {/* Mobile header */}
            <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <MobileNav
                            activeTab={activeTab}
                            onNavigate={handleNavigate}
                        />
                        <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Replify AI</h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={logout}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Mobile;