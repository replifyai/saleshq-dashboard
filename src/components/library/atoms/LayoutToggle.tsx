import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';

interface LayoutToggleProps {
  layout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
}

export const LayoutToggle: React.FC<LayoutToggleProps> = ({ layout, onLayoutChange }) => {
  return (
    <div className="flex items-center space-x-1 border rounded-md dark:border-white/10">
      <Button
        variant={layout === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLayoutChange('grid')}
        className="h-8 px-3"
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
      <Button
        variant={layout === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLayoutChange('list')}
        className="h-8 px-3"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default LayoutToggle;