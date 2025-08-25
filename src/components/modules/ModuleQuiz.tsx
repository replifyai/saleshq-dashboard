'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { moduleApi, type ModuleFile, type QuizQuestion, type SaveQuizAnswersResponse } from '@/lib/moduleApi';
import { useToast } from '@/hooks/use-toast';
import ModuleQuizResults from './ModuleQuizResults';

interface ModuleQuizProps {
  moduleId: string;
  quizFile: ModuleFile;
  onBack: () => void;
  onResultsVisibilityChange?: (visible: boolean) => void;
}

export default function ModuleQuiz({ moduleId, quizFile, onBack, onResultsVisibilityChange }: ModuleQuizProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizId, setQuizId] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverResult, setServerResult] = useState<SaveQuizAnswersResponse['data'] | null>(null);

  useEffect(() => {
    fetchQuizQuestions();
  }, [moduleId, quizFile.id]);

  const fetchQuizQuestions = async () => {
    try {
      setLoading(true);
      const path = `${moduleId}/${quizFile.id}`;
      const response = await moduleApi.getModuleQuiz(path);
      
      if (response.data.success && response.data.data.questions) {
        setQuestions(response.data.data.questions);
        setSelectedAnswers(new Array(response.data.data.questions.length).fill(null));
        setQuizId(response.data.data.quiz?.id || '');
        setStartTime(Date.now());
      }
    } catch (error) {
      toast({
        title: "Error loading quiz",
        description: error instanceof Error ? error.message : "Failed to load quiz questions",
        variant: "destructive"
      });
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setEndTime(Date.now());

      // Build answers map: { [questionId]: selectedAnswer }
      const answers: Record<string, string> = {};
      questions.forEach((q, idx) => {
        const ans = selectedAnswers[idx];
        if (ans) {
          answers[q.id] = ans;
        }
      });

      const idForSubmission = `${moduleId}/${quizFile.id}`;
      const response = await moduleApi.saveModuleQuizAnswers(idForSubmission, answers);
      setServerResult(response.data);
      setShowResults(true);
      onResultsVisibilityChange?.(true);
    } catch (error) {
      toast({
        title: 'Failed to submit quiz',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers(new Array(questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setStartTime(Date.now());
    setEndTime(0);
    onResultsVisibilityChange?.(false);
  };

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

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading quiz questions...</p>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <ModuleQuizResults
        questions={questions}
        selectedAnswers={selectedAnswers}
        startTime={startTime}
        endTime={endTime}
        serverResult={serverResult}
        onRetry={handleRetry}
        onBack={onBack}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = selectedAnswers.filter(a => a !== null).length;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
            <Badge variant="outline">
              {answeredCount} answered
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {currentQuestion.question}
          </h2>
          <div className="space-y-3" role="radiogroup" aria-label="Answer choices">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === option;
              return (
                <Button
                  key={index}
                  variant="outline"
                  role="radio"
                  aria-checked={isSelected}
                  data-selected={isSelected ? 'true' : 'false'}
                  className={
                    `w-full h-auto py-3 px-4 justify-between text-left transition-colors ` +
                    (isSelected
                      ? 'border-primary bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                      : 'border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary') +
                    ' focus-visible:ring-2 focus-visible:ring-primary'
                  }
                  onClick={() => handleAnswerSelect(option)}
                >
                  <span className="flex items-center">
                    <span
                      className={
                        `mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ` +
                        (isSelected ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600')
                      }
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 font-medium">{option}</span>
                  </span>
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={answeredCount < questions.length || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}