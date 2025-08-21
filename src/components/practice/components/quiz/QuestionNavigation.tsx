import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { QuestionNumber } from '../../atoms/QuestionNumber';
import type { QuizQuestion } from '../../types';

interface QuestionNavigationProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: number[];
  onQuestionJump: (index: number) => void;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  currentQuestionIndex,
  selectedAnswers,
  onQuestionJump
}) => {
  return (
    <div className="col-span-3 flex flex-col">
      <Card className="border-0 shadow-md bg-gray-50 dark:bg-gray-800/50 h-full">
        <CardHeader className="pb-3">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Question Navigation</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Click to jump to question</p>
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex-1 overflow-y-auto">
          <div className="grid grid-cols-4 gap-2">
            {questions.map((_, index) => (
              <QuestionNumber
                key={index}
                number={index + 1}
                isSelected={index === currentQuestionIndex}
                isAnswered={selectedAnswers[index] !== -1}
                onClick={() => onQuestionJump(index)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionNavigation;