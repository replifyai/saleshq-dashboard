import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import AddMediaModal from './add-media-modal';
import { LayoutToggle } from '../atoms/LayoutToggle';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import type { Product } from '@/lib/apiUtils';

interface LibraryHeaderProps {
  products?: Product[];
  layout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  products,
  layout,
  onLayoutChange,
  searchQuery,
  onSearchChange
}) => {
  const { isAdmin } = useAdminAccess();

  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>Product Library</CardTitle>
        <div className="flex items-center space-x-3">
          {/* Add Media Button - Admin Only */}
          {isAdmin && (
            <AddMediaModal 
              products={products?.map(p => ({ id: p.id, name: p.name })) || []}
              trigger={
                <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Media
                </Button>
              }
            />
          )}
          
          <LayoutToggle layout={layout} onLayoutChange={onLayoutChange} />
        </div>
      </div>
      
      {/* Search Input */}
      <div className="mt-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
      </div>
    </CardHeader>
  );
};

export default LibraryHeader;