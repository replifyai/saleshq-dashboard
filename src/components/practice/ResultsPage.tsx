import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { ScoreSummary, AnswerReview } from './components';
import { ResultsPageProps } from './types';

export const ResultsPage: React.FC<ResultsPageProps> = ({
    questions,
    selectedAnswers,
    score,
    percentage,
    timeTaken,
    performanceLevel,
    onResetQuiz
}) => (
    <div className="h-screen flex flex-col">
        {/* Results Header - Fixed */}
        <div className="flex-shrink-0 text-center space-y-2 p-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Quiz Complete!
            </h2>
        </div>

        <ScoreSummary
            score={score}
            totalQuestions={questions.length}
            percentage={percentage}
            timeTaken={timeTaken}
            performanceLevel={performanceLevel}
        />

        <AnswerReview
            questions={questions}
            selectedAnswers={selectedAnswers}
        />

        {/* Fixed Action Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-3 z-50">
            <div className="max-w-5xl mx-auto flex justify-center">
                <Button 
                    onClick={onResetQuiz} 
                    size="lg"
                    className="px-6 py-3 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Take Another Quiz
                </Button>
            </div>
        </div>
    </div>
); 