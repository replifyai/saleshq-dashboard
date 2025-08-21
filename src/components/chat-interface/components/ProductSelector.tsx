import React from 'react';
import { Package, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { BasicProduct } from '@/lib/apiUtils';

interface ProductSelectorProps {
  show: boolean;
  products: BasicProduct[];
  isLoading: boolean;
  filter: string;
  selectedIndex: number;
  onSelectProduct: (product: BasicProduct) => void;
  listRef: React.RefObject<HTMLDivElement>;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  show,
  products,
  isLoading,
  filter,
  selectedIndex,
  onSelectProduct,
  listRef
}) => {
  if (!show) return null;

  return (
    <div className="absolute bottom-full left-0 right-12 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl backdrop-blur-sm max-h-80 overflow-hidden z-50">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Package className="w-4 h-4" />
          Select a Product
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
            ↑↓ Navigate • Enter to select • Esc to close
          </span>
        </div>
      </div>

      {/* Products List */}
      <div className="max-h-60 overflow-y-auto" ref={listRef}>
        {isLoading ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
            No products found matching "{filter}"
          </div>
        ) : (
          products.map((product, index) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`p-3 cursor-pointer border-b border-gray-100 dark:border-gray-700/50 last:border-b-0 transition-all duration-150 ${index === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {product.name}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductSelector;