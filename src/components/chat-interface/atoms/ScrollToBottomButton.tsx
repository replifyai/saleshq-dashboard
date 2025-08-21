import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsDown } from 'lucide-react';

interface ScrollToBottomButtonProps {
  onClick: () => void;
  show: boolean;
}

export const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ onClick, show }) => {
  if (!show) return null;

  return (
    <div className="absolute bottom-24 right-6 z-20">
      <Button
        onClick={onClick}
        size="sm"
        className="rounded-full w-12 h-12 p-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-2 border-white dark:border-gray-800 hover:scale-110 hover:shadow-2xl transition-all duration-200"
        title="Scroll to bottom"
      >
        <ChevronsDown className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default ScrollToBottomButton;