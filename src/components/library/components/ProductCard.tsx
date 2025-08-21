import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { FilesList } from './FilesList';
import { MediaSection } from './MediaSection';
import { formatDate } from '../utils/libraryUtils';
import type { Product } from '@/lib/apiUtils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Package className="text-blue-500 w-5 h-5" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate" title={product.name}>
              {product.name}
            </h3>
          </div>
        </div>
        
        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Files:</span>
            <span className="font-medium">{product.files.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Created by:</span>
            <span className="font-medium truncate max-w-[100px]" title={product.createdBy}>
              {product.createdBy}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span className="font-medium">{formatDate(product.createdAt)}</span>
          </div>
        </div>

        <FilesList files={product.files} />

        <MediaSection product={product} />
      </CardContent>
    </Card>
  );
};

export default ProductCard;