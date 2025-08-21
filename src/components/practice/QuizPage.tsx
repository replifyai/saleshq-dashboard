import React from 'react';
import { QuizHeader, QuestionNavigation, QuestionContent, NavigationControls } from './components';
import { QuizPageProps } from './types';

export const QuizPage: React.FC<QuizPageProps> = ({
    questions,
    currentQuestionIndex,
    selectedAnswers,
    onAnswerSelect,
    onNextQuestion,
    onPreviousQuestion,
    onSubmitQuiz,
    onQuestionJump
}) => {
    const currentQuestion = questions[currentQuestionIndex];
    const answeredCount = selectedAnswers.filter(answer => answer !== -1).length;

    return (
        <div className="h-screen flex flex-col">
            <QuizHeader
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                answeredCount={answeredCount}
            />

            {/* Main Content - Grid Layout */}
            <div className="flex-1 overflow-hidden p-3">
                <div className="max-w-7xl mx-auto h-full grid grid-cols-12 gap-4">
                    <QuestionNavigation
                        questions={questions}
                        currentQuestionIndex={currentQuestionIndex}
                        selectedAnswers={selectedAnswers}
                        onQuestionJump={onQuestionJump}
                    />

                    <QuestionContent
                        question={currentQuestion}
                        questionIndex={currentQuestionIndex}
                        selectedAnswer={selectedAnswers[currentQuestionIndex]}
                        onAnswerSelect={onAnswerSelect}
                    />
                </div>
            </div>

            <NavigationControls
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                selectedAnswers={selectedAnswers}
                onPreviousQuestion={onPreviousQuestion}
                onNextQuestion={onNextQuestion}
                onSubmitQuiz={onSubmitQuiz}
            />
        </div>
    );
}; 