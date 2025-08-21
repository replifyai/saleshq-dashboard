import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PerformanceBadge } from '../../atoms/PerformanceBadge';

interface ScoreSummaryProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: string;
  performanceLevel: {
    level: string;
    color: string;
    bgColor: string;
  };
}

export const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  score,
  totalQuestions,
  percentage,
  timeTaken,
  performanceLevel
}) => {
  return (
    <div className="flex-shrink-0 p-2">
      <div className="max-w-5xl mx-auto">
        <Card className={`border-0 shadow-lg ${performanceLevel.bgColor}`}>
          <CardContent className="pt-3 pb-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {score}/{totalQuestions}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Correct Answers</div>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl md:text-3xl font-bold ${performanceLevel.color}`}>
                  {percentage}%
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Score</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                  {timeTaken}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Time Taken</div>
              </div>
              <PerformanceBadge
                level={performanceLevel.level}
                color={performanceLevel.color}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScoreSummary;