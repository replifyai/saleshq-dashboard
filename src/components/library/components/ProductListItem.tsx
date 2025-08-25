import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, FileSearch } from 'lucide-react';
import { FileIcon } from '../atoms/FileIcon';
import ProductMediaViewer from './product-media-viewer';
import { MediaButton } from '../atoms/MediaButton';
import { formatDate, getMediaCounts } from '../utils/libraryUtils';
import type { Product } from '@/lib/apiUtils';

interface ProductListItemProps {
  product: Product;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const { images, videos } = getMediaCounts(product);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Package className="text-blue-500 w-6 h-6" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate" title={product.name}>
                {product.name}
              </h3>
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{product.files.length} files</span>
                <span>Created by {product.createdBy}</span>
                <span>{formatDate(product.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Files Preview */}
            <div className="flex items-center space-x-2">
              {product.files.slice(0, 4).map((file, idx) => {
                const isQueryPdf = (file as any).storagePath?.startsWith('generated-pdfs');
                return (
                  <a 
                    key={idx}
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`hover:text-blue-600 dark:hover:text-blue-300`} 
                    title={isQueryPdf ? 'Query PDF' : file.filename}
                  >
                    {isQueryPdf ? (
                      <FileSearch className="h-4 w-4 text-purple-600" />
                    ) : (
                      <FileIcon filename={file.filename} />
                    )}
                  </a>
                );
              })}
              {product.files.length > 4 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  +{product.files.length - 4}
                </span>
              )}
            </div>
            
            {/* Media & Tags */}
            <div className="flex items-center space-x-2">
              {images > 0 && (
                <ProductMediaViewer
                  product={product}
                  initialMediaType="image"
                  trigger={
                    <MediaButton
                      type="image"
                      count={images}
                      showLabel={false}
                    />
                  }
                />
              )}
              {videos > 0 && (
                <ProductMediaViewer
                  product={product}
                  initialMediaType="video"
                  trigger={
                    <MediaButton
                      type="video"
                      count={videos}
                      showLabel={false}
                    />
                  }
                />
              )}
              {product.category && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  {product.category}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductListItem;