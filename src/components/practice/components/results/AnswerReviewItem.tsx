import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { QuizQuestion } from '../../types';

interface AnswerReviewItemProps {
  question: QuizQuestion;
  questionIndex: number;
  userAnswer: number;
  isCorrect: boolean;
}

export const AnswerReviewItem: React.FC<AnswerReviewItemProps> = ({
  question,
  questionIndex,
  userAnswer,
  isCorrect
}) => {
  return (
    <Card 
      className={`border-0 shadow-md ${isCorrect ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start space-x-3">
          <div className={`p-1.5 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            {isCorrect ? (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Q{questionIndex + 1}
              </span>
              <Badge variant={isCorrect ? "default" : "destructive"} className="text-xs px-2 py-0">
                {isCorrect ? "✓" : "✗"}
              </Badge>
            </div>
            <CardTitle className="text-base leading-relaxed text-gray-900 dark:text-white">
              {question.question}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid gap-2">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                  optionIndex === question.correctAnswer
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                    : optionIndex === userAnswer && !isCorrect
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{option}</span>
                  <div className="flex space-x-1">
                    {optionIndex === question.correctAnswer && (
                      <Badge variant="secondary" className="bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 text-xs px-1">
                        ✓
                      </Badge>
                    )}
                    {optionIndex === userAnswer && !isCorrect && (
                      <Badge variant="destructive" className="bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200 text-xs px-1">
                        Your
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-3 w-3 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerReviewItem;