import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CategoryItemProps {
  category: string;
  isSelected: boolean;
  onToggle: (category: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isSelected,
  onToggle
}) => {
  return (
    <div 
      className={`
        flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
        }
      `}
      onClick={() => onToggle(category)}
    >
      <Checkbox
        id={category}
        checked={isSelected}
        onCheckedChange={() => onToggle(category)}
        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
      <Label 
        htmlFor={category}
        className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize cursor-pointer flex-1"
      >
        {category.replace(/([A-Z])/g, ' $1').trim()}
      </Label>
    </div>
  );
};

export default CategoryItem;