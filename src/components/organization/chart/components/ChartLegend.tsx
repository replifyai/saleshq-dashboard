import React from 'react';

interface ChartLegendProps {
  zoom: number;
  orientation: 'vertical' | 'horizontal';
  isAdmin: boolean;
  isFullscreen?: boolean;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ 
  zoom, 
  orientation, 
  isAdmin,
  isFullscreen = false 
}) => {
  return (
    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Chart Guide</span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white shadow-sm" />
          <span className="text-gray-700 dark:text-gray-300">Click nodes to view details</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-gray-400 border border-white" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-700 text-white rounded-full text-[8px] flex items-center justify-center">
              #
            </div>
          </div>
          <span className="text-gray-700 dark:text-gray-300">Badge shows team size</span>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-[8px]">✏️</div>
              <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center text-[8px]">➕</div>
              <div className="w-3 h-3 rounded-full bg-purple-500 flex items-center justify-center text-[8px]">👤</div>
            </div>
            <span className="text-gray-700 dark:text-gray-300">Admin actions (when selected)</span>
          </div>
        )}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="text-[10px] text-gray-500 dark:text-gray-400">
            Zoom: {Math.round(zoom * 100)}% | Layout: {orientation}{isFullscreen ? ' | Mode: Fullscreen' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartLegend;