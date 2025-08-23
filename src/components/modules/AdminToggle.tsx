'use client'

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

export default function AdminToggle() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsAdmin(checked);
    localStorage.setItem('isAdmin', checked.toString());
    // Refresh the page to apply admin status changes
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border">
      <div className="flex items-center space-x-2">
        <Shield className="h-4 w-4 text-blue-600" />
        <Label htmlFor="admin-mode" className="text-sm font-medium">
          Admin Mode
        </Label>
        <Switch
          id="admin-mode"
          checked={isAdmin}
          onCheckedChange={handleToggle}
        />
      </div>
    </div>
  );
}