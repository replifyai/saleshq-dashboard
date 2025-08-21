import React from 'react';

interface QuestionNumberProps {
  number: number;
  isSelected?: boolean;
  isAnswered?: boolean;
  onClick?: () => void;
  className?: string;
}

export const QuestionNumber: React.FC<QuestionNumberProps> = ({
  number,
  isSelected = false,
  isAnswered = false,
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        aspect-square rounded-lg text-xs font-medium transition-all duration-200 min-h-[36px]
        ${isSelected
          ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
          : isAnswered
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
        }
        ${className}
      `}
      aria-label={`Go to question ${number}`}
    >
      {number}
    </button>
  );
};

export default QuestionNumber;