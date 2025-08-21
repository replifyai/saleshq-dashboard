export const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' };
    if (percentage >= 80) return { level: 'Great', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' };
    if (percentage >= 70) return { level: 'Good', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' };
    if (percentage >= 60) return { level: 'Fair', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-900/20' };
    return { level: 'Needs Improvement', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' };
};

export const formatTime = (startTime: number, endTime: number): string => {
    const timeTaken = Math.round((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    return `${minutes}m ${seconds}s`;
};

export const calculateScore = (selectedAnswers: number[], questions: any[]): number => {
    return selectedAnswers.reduce((score, answer, index) => {
        return answer === questions[index].correctAnswer ? score + 1 : score;
    }, 0);
}; 