export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    type: string;
}

export interface QuizResponse {
    questions: QuizQuestion[];
    count: number;
    type: string;
}

export interface CategoryGroup {
    title: string;
    categories: string[];
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

export interface LoadingStep {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
}

export interface CategorySelectionProps {
    categoryGroups: CategoryGroup[];
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;
    onSelectAllInGroup: (categories: string[]) => void;
    onStartQuiz: () => void;
    loading: boolean;
}

export interface LoadingPageProps {
    loadingSteps: LoadingStep[];
    currentStep: number;
    selectedCategories: string[];
}

export interface QuizPageProps {
    questions: QuizQuestion[];
    currentQuestionIndex: number;
    selectedAnswers: number[];
    onAnswerSelect: (answerIndex: number) => void;
    onNextQuestion: () => void;
    onPreviousQuestion: () => void;
    onSubmitQuiz: () => void;
    onQuestionJump: (index: number) => void;
}

export interface ResultsPageProps {
    questions: QuizQuestion[];
    selectedAnswers: number[];
    score: number;
    percentage: number;
    timeTaken: string;
    performanceLevel: {
        level: string;
        color: string;
        bgColor: string;
    };
    onResetQuiz: () => void;
} 