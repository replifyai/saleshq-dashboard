'use client';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ShopifyProduct } from '@/types/shopify';
import ProductImageCarousel from './ProductImageCarousel';

interface ProductDetailsProps {
  product: ShopifyProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Product Images Gallery */}
      {product.images && product.images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Product Images</h3>
          <div className="h-64 w-full max-w-2xl overflow-hidden rounded-lg">
            <ProductImageCarousel
              images={product.images}
              productTitle={product.title}
              showThumbnails={true}
              autoPlay={true}
              autoPlayInterval={4000}
              className="h-full w-full"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-600">Title</Label>
              <p className="text-gray-900">{product.title}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                {product.status}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Vendor</Label>
              <p className="text-gray-900">{product.vendor || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Product Type</Label>
              <p className="text-gray-900">{product.productType || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Handle</Label>
              <p className="text-gray-900">{product.handle || 'Auto-generated'}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-600">Created</Label>
              <p className="text-gray-900">
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Updated</Label>
              <p className="text-gray-900">
                {new Date(product.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Published</Label>
              <p className="text-gray-900">
                {product.publishedAt 
                  ? new Date(product.publishedAt).toLocaleDateString()
                  : 'Not published'
                }
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Template</Label>
              <p className="text-gray-900">Default</p>
            </div>
          </div>
        </div>
      </div>

      {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
            </Badge>
            ))}
          </div>
        </div>
      )}

      {product.description && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Description</h3>
          <div 
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {product.variants && product.variants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Variants</h3>
          <div className="space-y-2">
            {product.variants.map((variant, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{variant.title}</p>
                    <p className="text-sm text-gray-600">SKU: {variant.sku || 'No SKU'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                    ₹ {parseFloat(String(variant.price || '0')).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Inventory: {variant.inventoryQuantity || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 