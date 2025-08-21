import React from 'react';
import { Package, Images, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductImageViewer from './product-image-viewer';
import ProductVideoViewer from './product-video-viewer';
import type { BasicProduct } from '@/lib/apiUtils';

interface SelectedProductDisplayProps {
  product: BasicProduct | null;
  onClear: () => void;
}

export const SelectedProductDisplay: React.FC<SelectedProductDisplayProps> = ({ 
  product, 
  onClear 
}) => {
  if (!product) return null;

  return (
    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-2">
      <div className="flex items-center space-x-2">
        <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <div>
          <span className="text-xs font-medium text-blue-900 dark:text-blue-200">
            Selected Product:
          </span>
          <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
            {product.name}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <ProductImageViewer
          product={product}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors border-blue-600 hover:border-blue-700"
              title="View product images"
            >
              <Images className="w-3 h-3" />
              Images
            </Button>
          }
        />
        <ProductVideoViewer
          product={product}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors border-purple-600 hover:border-purple-700"
              title="View product videos"
            >
              <Video className="w-3 h-3" />
              Videos
            </Button>
          }
        />
        <button
          onClick={onClear}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 p-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
          title="Clear selected product"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SelectedProductDisplay;