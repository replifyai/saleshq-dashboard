'use client'
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { ProductSelector } from './ProductSelector';
import { SelectedProductDisplay } from './SelectedProductDisplay';
import type { BasicProduct } from '@/lib/apiUtils';

interface ChatInputProps {
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  selectedProduct: BasicProduct | null;
  hasSelectedProduct: boolean;
  onClearProduct: () => void;
  
  // Product selector props
  showProductSelector: boolean;
  products: BasicProduct[];
  isLoadingProducts: boolean;
  productFilter: string;
  selectedProductIndex: number;
  onSelectProduct: (product: BasicProduct) => void;
  productSelectorRef: React.RefObject<HTMLDivElement>;
  productListRef: React.RefObject<HTMLDivElement>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  onMessageChange,
  onKeyPress,
  onSendMessage,
  isLoading,
  selectedProduct,
  hasSelectedProduct,
  onClearProduct,
  showProductSelector,
  products,
  isLoadingProducts,
  productFilter,
  selectedProductIndex,
  onSelectProduct,
  productSelectorRef,
  productListRef
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-shrink-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-800/50 p-3 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-2 relative">
        {/* Product Selector Dropdown */}
        <div ref={productSelectorRef}>
          <ProductSelector
            show={showProductSelector}
            products={products}
            isLoading={isLoadingProducts}
            filter={productFilter}
            selectedIndex={selectedProductIndex}
            onSelectProduct={onSelectProduct}
            listRef={productListRef}
          />
        </div>

        {/* Selected Product Display */}
        <SelectedProductDisplay 
          product={selectedProduct} 
          onClear={onClearProduct}
        />

        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={onMessageChange}
              onKeyDown={onKeyPress}
              placeholder={hasSelectedProduct ? `Ask about ${selectedProduct?.name || 'the selected product'}...` : "Ask a question about your documents... (Type / to select products)"}
              disabled={isLoading}
              className="text-sm pr-12 h-10 rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200"
            />
          </div>
          <Button
            onClick={onSendMessage}
            disabled={!message.trim() || isLoading}
            size="sm"
            className="px-4 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;