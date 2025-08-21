import React from 'react';
import { CategoryGroup, SelectedSummary } from './components';
import { StartButton } from './atoms';
import { CategorySelectionProps } from './types';

export const CategorySelection: React.FC<CategorySelectionProps> = ({
    categoryGroups,
    selectedCategories,
    onCategoryToggle,
    onSelectAllInGroup,
    onStartQuiz,
    loading
}) => (
    <div className="h-screen flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 text-center space-y-3 max-w-2xl mx-auto pt-6 pb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Practice Quiz
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Test your knowledge across different categories and improve your understanding with detailed explanations
            </p>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-20">
            <div className="max-w-5xl mx-auto space-y-4">
                {/* Category Groups */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {categoryGroups.map((group, groupIndex) => (
                        <CategoryGroup
                            key={groupIndex}
                            group={group}
                            selectedCategories={selectedCategories}
                            onCategoryToggle={onCategoryToggle}
                            onSelectAllInGroup={onSelectAllInGroup}
                        />
                    ))}
                </div>

                <SelectedSummary selectedCategories={selectedCategories} />
            </div>
        </div>

        {/* Fixed Start Quiz Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-3 z-50">
            <div className="max-w-5xl mx-auto flex justify-center">
                <StartButton
                    onStartQuiz={onStartQuiz}
                    selectedCount={selectedCategories.length}
                    loading={loading}
                    disabled={selectedCategories.length === 0}
                />
            </div>
        </div>
    </div>
); 