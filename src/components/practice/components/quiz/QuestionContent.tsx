import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { QuizQuestion } from '../../types';

interface QuestionContentProps {
  question: QuizQuestion;
  questionIndex: number;
  selectedAnswer: number;
  onAnswerSelect: (answerIndex: number) => void;
}

export const QuestionContent: React.FC<QuestionContentProps> = ({
  question,
  questionIndex,
  selectedAnswer,
  onAnswerSelect
}) => {
  return (
    <div className="col-span-9 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Card className="border-0 shadow-md h-full">
          <CardHeader className="pb-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  {questionIndex + 1}
                </span>
              </div>
              <CardTitle className="text-lg leading-relaxed text-gray-900 dark:text-white">
                {question.question}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => onAnswerSelect(parseInt(value))}
              className="space-y-3"
            >
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                return (
                  <div 
                    key={index} 
                    className={`
                      flex items-center space-x-4 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }
                    `}
                    onClick={() => onAnswerSelect(index)}
                  >
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer text-gray-900 dark:text-gray-100 leading-relaxed text-sm"
                    >
                      {option}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionContent;