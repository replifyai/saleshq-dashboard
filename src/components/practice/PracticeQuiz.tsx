'use client'
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CategorySelection } from './CategorySelection';
import { LoadingPage } from './LoadingPage';
import { QuizPage } from './QuizPage';
import { ResultsPage } from './ResultsPage';
import { categoryGroups, loadingSteps } from './constants';
import { quizApi, type QuizQuestion, type QuizResponse } from '@/lib/apiUtils';
import { getPerformanceLevel, formatTime, calculateScore } from './utils';

export default function PracticeQuiz() {
    const { toast } = useToast();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState<'selection' | 'loading' | 'quiz' | 'results'>('selection');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [quizStartTime, setQuizStartTime] = useState<number>(0);
    const [quizEndTime, setQuizEndTime] = useState<number>(0);
    const [loadingStep, setLoadingStep] = useState(0);

    useEffect(() => {

        let interval: ReturnType<typeof setInterval>;
        if (loading) {
            interval = setInterval(() => {
                setLoadingStep(prev => (prev + 1) % loadingSteps.length);
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleSelectAllInGroup = (categories: string[]) => {
        const allSelected = categories.every(cat => selectedCategories.includes(cat));
        if (allSelected) {
            setSelectedCategories(prev => prev.filter(cat => !categories.includes(cat)));
        } else {
            setSelectedCategories(prev => [...new Set([...prev, ...categories])]);
        }
    };

    const startQuiz = async () => {
        if (selectedCategories.length === 0) {
            toast({
                title: "No categories selected",
                description: "Please select at least one category to start the quiz.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        setCurrentStep('loading');
        setLoadingStep(0);
        
        try {
            const data: QuizResponse = await quizApi.getQuizQuestions(selectedCategories);
            setQuestions(data.questions);
            setSelectedAnswers(new Array(data.questions.length).fill(-1));
            setCurrentQuestionIndex(0);
            setQuizStartTime(Date.now());
            setCurrentStep('quiz');
        } catch (error) {
            setCurrentStep('selection');
            toast({
                title: "Error loading quiz",
                description: error instanceof Error ? error.message : "Failed to load quiz questions",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = answerIndex;
        setSelectedAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const submitQuiz = () => {
        setQuizEndTime(Date.now());
        setCurrentStep('results');
    };

    const resetQuiz = () => {
        setCurrentStep('selection');
        setQuestions([]);
        setSelectedAnswers([]);
        setCurrentQuestionIndex(0);
        setSelectedCategories([]);
        setQuizStartTime(0);
        setQuizEndTime(0);
    };

    const score = calculateScore(selectedAnswers, questions);
    const percentage = Math.round((score / questions.length) * 100);
    const timeTaken = formatTime(quizStartTime, quizEndTime);
    const performanceLevel = getPerformanceLevel(percentage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
            {currentStep === 'selection' && (
                <CategorySelection
                    categoryGroups={categoryGroups}
                    selectedCategories={selectedCategories}
                    onCategoryToggle={handleCategoryToggle}
                    onSelectAllInGroup={handleSelectAllInGroup}
                    onStartQuiz={startQuiz}
                    loading={loading}
                />
            )}
            {currentStep === 'loading' && (
                <LoadingPage
                    loadingSteps={loadingSteps}
                    currentStep={loadingStep}
                    selectedCategories={selectedCategories}
                />
            )}
            {currentStep === 'quiz' && (
                <QuizPage
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    selectedAnswers={selectedAnswers}
                    onAnswerSelect={handleAnswerSelect}
                    onNextQuestion={nextQuestion}
                    onPreviousQuestion={previousQuestion}
                    onSubmitQuiz={submitQuiz}
                    onQuestionJump={setCurrentQuestionIndex}
                />
            )}
            {currentStep === 'results' && (
                <ResultsPage
                    questions={questions}
                    selectedAnswers={selectedAnswers}
                    score={score}
                    percentage={percentage}
                    timeTaken={timeTaken}
                    performanceLevel={performanceLevel}
                    onResetQuiz={resetQuiz}
                />
            )}
        </div>
    );
} 