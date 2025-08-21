import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { ProgressIndicator } from '../../atoms/ProgressIndicator';

interface QuizHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentQuestionIndex,
  totalQuestions,
  answeredCount
}) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="flex-shrink-0 p-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto">
        <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Trophy className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quiz in Progress</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">Progress</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
            
            <ProgressIndicator
              current={currentQuestionIndex}
              total={totalQuestions}
              answeredCount={answeredCount}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizHeader;