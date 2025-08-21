import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AnswerReviewItem } from './AnswerReviewItem';
import type { QuizQuestion } from '../../types';

interface AnswerReviewProps {
  questions: QuizQuestion[];
  selectedAnswers: number[];
}

export const AnswerReview: React.FC<AnswerReviewProps> = ({
  questions,
  selectedAnswers
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-20">
      <div className="max-w-5xl mx-auto space-y-3">
        <div className="flex items-center justify-between py-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Answer Review</h3>
          <Badge variant="outline" className="text-xs">
            {questions.length} questions
          </Badge>
        </div>
        
        {questions.map((question, index) => {
          const userAnswer = selectedAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;

          return (
            <AnswerReviewItem
              key={index}
              question={question}
              questionIndex={index}
              userAnswer={userAnswer}
              isCorrect={isCorrect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AnswerReview;