'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { moduleApi } from '@/lib/moduleApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { AnswerReview } from '@/components/practice/components/results/AnswerReview';
import { ScoreSummary } from '@/components/practice/components/results/ScoreSummary';
import { PerformanceBadge } from '@/components/practice/atoms/PerformanceBadge';

interface QuizAnswerData {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: string; // API returns full option text like "b) Frido Go"
  userAnswer: string; // API returns full option text
  isCorrect: boolean;
  order: number;
}

interface QuizResultData {
  quizId: string;
  title: string;
  score: number;
  correct: number;
  wrong: number;
  notAttempted: number;
  totalQuestions: number;
  createdAt: number;
  questions: QuizAnswerData[];
}

function calculatePerformanceLevel(percentage: number): {
  level: string;
  color: string;
  bgColor: string;
} {
  if (percentage >= 85) {
    return {
      level: 'Excellent',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/10',
    };
  } else if (percentage >= 70) {
    return {
      level: 'Good',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
    };
  } else if (percentage >= 50) {
    return {
      level: 'Fair',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/10',
    };
  } else {
    return {
      level: 'Needs Work',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/10',
    };
  }
}

export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizResultData | null>(null);

  useEffect(() => {
    const fetchQuizResults = async () => {
      if (!quizId) {
        setError('Quiz ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await moduleApi.getUserQuizandCorrectAnswers(quizId);
        
        // Handle nested response structure: response.data.data
        const data = response?.data?.data || response?.data || response;
        setQuizData(data);
      } catch (err) {
        console.error('Failed to fetch quiz results:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Error Loading Quiz Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {error || 'Quiz results not found'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalQuestions = quizData.totalQuestions || quizData.questions.length;
  const percentage = totalQuestions > 0 
    ? Math.round((quizData.correct / totalQuestions) * 100) 
    : 0;
  const performanceLevel = calculatePerformanceLevel(percentage);

  // Helper function to convert answer string to index
  // API returns full option text like "b) Frido Go", need to find index in options array
  const getAnswerIndex = (answer: string | undefined, options: string[]): number => {
    if (!answer) return -1; // Not attempted
    
    // Find the index of the option that matches the answer
    const index = options.findIndex(opt => opt === answer || opt.trim() === answer.trim());
    return index >= 0 ? index : -1;
  };

  // Transform API questions to match component expectations
  // API returns correctAnswer and userAnswer as full option strings
  const transformedQuestions = quizData.questions.map((q) => {
    const correctAnswerIndex = getAnswerIndex(q.correctAnswer, q.options);

    return {
      question: q.question,
      options: q.options,
      correctAnswer: correctAnswerIndex,
      explanation: '', // API doesn't provide explanation
      type: 'multiple-choice',
    };
  });

  // Get user answers (convert string answers to indices)
  const selectedAnswers = quizData.questions.map((q) => {
    return getAnswerIndex(q.userAnswer, q.options);
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {quizData.title}
            </h1>
            {quizData.createdAt && (
              <p className="text-gray-600 dark:text-gray-400">
                Completed on {new Date(quizData.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Score Summary */}
        <ScoreSummary
          score={quizData.correct}
          totalQuestions={totalQuestions}
          percentage={percentage}
          timeTaken="N/A"
          performanceLevel={performanceLevel}
        />

        {/* Answer Review */}
        <div className="mt-6">
          <AnswerReview
            questions={transformedQuestions}
            selectedAnswers={selectedAnswers}
          />
        </div>
      </div>
    </div>
  );
}

