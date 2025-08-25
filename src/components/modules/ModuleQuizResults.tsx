'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import type { QuizQuestion, SaveQuizAnswersResponse } from '@/lib/moduleApi';

interface ModuleQuizResultsProps {
  questions: QuizQuestion[];
  selectedAnswers: (string | null)[];
  startTime: number;
  endTime: number;
  serverResult: SaveQuizAnswersResponse['data'] | null;
  onRetry: () => void;
  onBack: () => void;
}

export default function ModuleQuizResults({
  questions,
  selectedAnswers,
  startTime,
  endTime,
  serverResult,
  onRetry,
  onBack,
}: ModuleQuizResultsProps) {
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const correctCount = serverResult ? serverResult.correct : calculateScore();
  const displayPercentage = serverResult ? serverResult.score : (correctCount / questions.length) * 100;
  const timeTaken = formatTime(endTime - startTime);
  const gradientClass = displayPercentage >= 85
    ? 'from-green-600 to-green-700'
    : displayPercentage >= 70
    ? 'from-blue-600 to-blue-700'
    : displayPercentage >= 50
    ? 'from-amber-500 to-amber-600'
    : 'from-red-600 to-red-700';

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}`}>
            {displayPercentage.toFixed(2)}%
          </div>
          {/* Optional subtitle with raw numbers can be re-enabled if needed */}
          {serverResult && (
            <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
              <span className="mr-4">Correct: {serverResult.correct}</span>
              <span className="mr-4">Wrong: {serverResult.wrong}</span>
              <span>Not Attempted: {serverResult.notAttempted}</span>
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Time taken: {timeTaken}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Review Answers:</h3>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.answer;

              return (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                          Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {userAnswer || 'Not answered'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-gray-600 dark:text-gray-400">
                            Correct answer: <span className="text-green-600">{question.answer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={onRetry} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry Quiz
          </Button>
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Module
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

