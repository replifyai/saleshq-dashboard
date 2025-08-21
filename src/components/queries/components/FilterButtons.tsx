import React from 'react';

interface FilterButtonsProps {
  currentFilter: 'all' | 'pending' | 'resolved';
  onFilterChange: (filter: 'all' | 'pending' | 'resolved') => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  onFilterChange
}) => {
  const filterOptions = [
    { value: 'pending' as const, label: 'Pending', emoji: '📋', colors: { '--mb-color-1': '#f59e0b', '--mb-color-2': '#d97706' } },
    { value: 'resolved' as const, label: 'Resolved', emoji: '✅', colors: { '--mb-color-1': '#10b981', '--mb-color-2': '#059669' } },
    { value: 'all' as const, label: 'All', emoji: '📊', colors: { '--mb-color-1': '#6366f1', '--mb-color-2': '#4f46e5' } }
  ];

  return (
    <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full md:w-auto md:mx-auto">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={`px-4 py-2 text-xs md:text-sm font-medium rounded-md transition-all flex-1 md:flex-none md:min-w-[100px] ${
            currentFilter === option.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          style={currentFilter === option.value ? {
            ...option.colors,
          } as React.CSSProperties : undefined}
        >
          <span className="hidden md:inline">{option.emoji} </span>
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;