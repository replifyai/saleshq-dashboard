'use client'
import React from 'react'
import { useAuth } from '@/contexts/auth-context';
import { Button } from '../ui/button';
import { LogOut, Menu } from 'lucide-react';
import ThemeToggle from '../theme-toggle';
import SidebarNavigation from './sidebar-navigation';
import { getUserInitials } from '@/lib/utils';
import { User } from 'lucide-react';
import { useSideNav } from '@/contexts/sideNav-context';
const Desktop = () => {
    const { user, logout } = useAuth();
    const { activeTab, handleNavigate, isCollapsed, toggleCollapsed } = useSideNav();
    return (
        <>
            <div className={`hidden md:flex ${isCollapsed ? 'md:w-16' : 'md:w-68'} md:flex-col transition-[width] duration-300`}>
                <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <div className={`flex items-center flex-shrink-0 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                        {!isCollapsed && (
                            <>
                                <div className={`w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center`}>
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">SalesHQ</h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Document Intelligence</p>
                                </div>
                            </>
                        )}
                        <div className={`${isCollapsed ? 'w-full justify-center' : 'ml-auto'} flex items-center space-x-2`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleCollapsed}
                                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label="Toggle sidebar"
                            >
                                <Menu className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 flex-1 flex flex-col">
                        <SidebarNavigation
                            activeTab={activeTab}
                        />
                    </div>

                    {/* Status Footer */}
                    <div className={`flex-shrink-0 ${isCollapsed ? 'px-2' : 'px-4'} py-1`}>
                        {/* User Info and Logout */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className={`flex ${isCollapsed ? 'flex-col space-y-2' : 'items-center space-x-3'}`}>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleNavigate('/settings')}
                                    className={`${isCollapsed ? 'justify-center w-full' : 'justify-start flex-1'} min-w-0 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg`}
                                >
                                    <div className={`w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm ${isCollapsed ? '' : 'mr-3'}`}>
                                        {user?.name ? getUserInitials(user.name) : <User className="w-4 h-4" />}
                                    </div>
                                    {!isCollapsed && (
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {user?.name || user?.email}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Logged in'}
                                            </p>
                                        </div>
                                    )}
                                </Button>
                                <div className={`${isCollapsed ? 'flex justify-center' : 'flex justify-start'}`}>
                                    <div className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 shadow-md border border-gray-200 dark:border-gray-700">
                                        <ThemeToggle />
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={logout}
                                    className={`${isCollapsed ? 'self-center' : ''} h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 shadow-md border border-gray-200 dark:border-gray-700`}
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Desktop