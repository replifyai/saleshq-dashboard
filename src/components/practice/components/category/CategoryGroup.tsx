import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CategoryItem } from './CategoryItem';
import type { CategoryGroup as CategoryGroupType } from '../../types';

interface CategoryGroupProps {
  group: CategoryGroupType;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onSelectAllInGroup: (categories: string[]) => void;
}

export const CategoryGroup: React.FC<CategoryGroupProps> = ({
  group,
  selectedCategories,
  onCategoryToggle,
  onSelectAllInGroup
}) => {
  const Icon = group.icon;
  const selectedCount = group.categories.filter(cat => selectedCategories.includes(cat)).length;
  const isAllSelected = selectedCount === group.categories.length;

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {group.title}
              </CardTitle>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {group.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                {selectedCount}
              </Badge>
            )}
            <Button
              variant={isAllSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectAllInGroup(group.categories)}
              className="transition-all duration-200 text-xs px-2 py-1"
            >
              {isAllSelected ? 'Deselect' : 'Select All'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {group.categories.map((category) => (
            <CategoryItem
              key={category}
              category={category}
              isSelected={selectedCategories.includes(category)}
              onToggle={onCategoryToggle}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryGroup;