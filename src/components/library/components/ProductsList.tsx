import React from 'react';
import { ProductListItem } from './ProductListItem';
import type { Product } from '@/lib/apiUtils';

interface ProductsListProps {
  products: Product[];
}

export const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  return (
    <div className="space-y-3 mb-6">
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;