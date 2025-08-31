'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Eye, Edit, Trash2, Tag, Hash, ImageIcon } from 'lucide-react';
import { ShopifyProduct } from '@/types/shopify';
import ProductImageCarousel from './ProductImageCarousel';

interface ProductCardProps {
  product: ShopifyProduct;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export default function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  onView 
}: ProductCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Product Image - Fixed height container */}
        {product.images && product.images.length > 0 ? (
          <div className="mb-4 h-48 overflow-hidden rounded-lg">
            <ProductImageCarousel
              images={product.images}
              productTitle={product.title}
              showThumbnails={false}
              className="h-full"
            />
          </div>
        ) : (
          <div className="mb-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
              {product.status}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 line-clamp-2">{product.title}</h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Tag className="h-3 w-3" />
            <span>{product.productType || 'No type'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Hash className="h-3 w-3" />
            <span>{product.vendor || 'No vendor'}</span>
          </div>

          {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 