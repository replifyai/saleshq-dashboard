import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

interface SelectedSummaryProps {
  selectedCategories: string[];
}

export const SelectedSummary: React.FC<SelectedSummaryProps> = ({
  selectedCategories
}) => {
  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Ready to Practice
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {selectedCategories.length} categories selected
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 capitalize font-medium text-xs"
              >
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedSummary;