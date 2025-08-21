import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { LoadingPageProps } from './types';

export const LoadingPage: React.FC<LoadingPageProps> = ({ loadingSteps, currentStep, selectedCategories }) => {
    const currentLoadingStep = loadingSteps[currentStep];
    const Icon = currentLoadingStep.icon;
    
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
            <div className="max-w-2xl mx-auto text-center px-6">
                {/* Animated Icon */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20"></div>
                    <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl">
                        <Icon className="w-12 h-12 text-white animate-pulse" />
                    </div>
                </div>

                {/* Title with Gradient */}
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                    {currentLoadingStep.title}
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in">
                    {currentLoadingStep.subtitle}
                </p>

                {/* Progress Dots */}
                <div className="flex justify-center space-x-3 mb-8">
                    {loadingSteps.map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-500 ${
                                index === currentStep
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-125 shadow-lg'
                                    : index < currentStep
                                    ? 'bg-green-500 shadow-md'
                                    : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        />
                    ))}
                </div>

                {/* Selected Categories */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Quiz Categories
                        </h3>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {selectedCategories.map((category) => (
                            <Badge 
                                key={category} 
                                variant="secondary" 
                                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/50 dark:to-purple-900/50 dark:text-blue-200 capitalize font-medium px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700"
                            >
                                {category.replace(/([A-Z])/g, ' $1').trim()}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Fun Loading Animation */}
                <div className="mt-8 flex justify-center">
                    <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: '1s'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Motivational Text */}
                <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 italic">
                    "Great things never come from comfort zones"
                </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-5 w-16 h-16 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/4 right-5 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
    );
}; 