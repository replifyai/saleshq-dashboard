import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw,
  Maximize,
  Expand,
  Minimize
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ChartControlsProps {
  orientation: 'vertical' | 'horizontal';
  isFullscreen?: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onOrientationToggle: () => void;
  onFullscreenToggle: () => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  orientation,
  isFullscreen = false,
  onZoomIn,
  onZoomOut,
  onReset,
  onOrientationToggle,
  onFullscreenToggle
}) => {
  return (
    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onZoomIn}
        className="hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onZoomOut}
        className="hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReset}
        className="hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-700"
        title="Reset View"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onOrientationToggle}
        className="hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700"
        title={`Switch to ${orientation === 'vertical' ? 'Horizontal' : 'Vertical'} Layout`}
      >
        {orientation === 'vertical' ? (
          <RotateCw className="w-4 h-4" />
        ) : (
          <Maximize className="w-4 h-4" />
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onFullscreenToggle}
        className={`${isFullscreen 
          ? 'hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-700'
          : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700'
        }`}
        title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default ChartControls;