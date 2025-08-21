import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface StartButtonProps {
  onStartQuiz: () => void;
  selectedCount: number;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const StartButton: React.FC<StartButtonProps> = ({
  onStartQuiz,
  selectedCount,
  loading = false,
  disabled = false,
  className = ''
}) => {
  return (
    <Button
      onClick={onStartQuiz}
      disabled={disabled || loading}
      size="lg"
      className={`px-6 py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading Quiz...
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          Start Quiz ({selectedCount} categories)
        </>
      )}
    </Button>
  );
};

export default StartButton;