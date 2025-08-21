import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Trophy } from 'lucide-react';

interface NavigationControlsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswers: number[];
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onSubmitQuiz: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentQuestionIndex,
  totalQuestions,
  selectedAnswers,
  onPreviousQuestion,
  onNextQuestion,
  onSubmitQuiz
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const currentAnswered = selectedAnswers[currentQuestionIndex] !== -1;
  const allAnswered = !selectedAnswers.includes(-1);

  return (
    <div className="flex-shrink-0 p-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 font-medium text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {currentAnswered ? 'Answered' : 'Not answered'}
          </div>
        </div>
        
        {isLastQuestion ? (
          <Button
            onClick={onSubmitQuiz}
            disabled={!allAnswered}
            className="px-4 py-2 font-medium text-sm bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            Submit Quiz
            <Trophy className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onNextQuestion}
            disabled={!currentAnswered}
            className="px-4 py-2 font-medium text-sm"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationControls;