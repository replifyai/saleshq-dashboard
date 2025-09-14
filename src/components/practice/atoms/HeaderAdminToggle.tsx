'use client'

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

export default function HeaderAdminToggle() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsAdmin(checked);
    localStorage.setItem('isAdmin', checked.toString());
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('adminToggle', { detail: { isAdmin: checked } }));
    
    // Refresh the page to apply admin status changes
    window.location.reload();
  };

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border">
      <Shield className="h-4 w-4 text-blue-600" />
      <Label htmlFor="header-admin-mode" className="text-sm font-medium cursor-pointer">
        Admin Mode
      </Label>
      <Switch
        id="header-admin-mode"
        checked={isAdmin}
        onCheckedChange={handleToggle}
        // size="sm"
      />
    </div>
  );
}