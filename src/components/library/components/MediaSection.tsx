import React from 'react';
import ProductMediaViewer from './product-media-viewer';
import { MediaButton } from '../atoms/MediaButton';
import { getMediaCounts } from '../utils/libraryUtils';
import type { Product } from '@/lib/apiUtils';

interface MediaSectionProps {
  product: Product;
  showLabel?: boolean;
}

export const MediaSection: React.FC<MediaSectionProps> = ({ product, showLabel = true }) => {
  const { images, videos } = getMediaCounts(product);
  
  if (images === 0 && videos === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
      <div className="flex flex-wrap gap-2 items-center">
        {showLabel && (
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Media:</span>
        )}
        {images > 0 && (
          <ProductMediaViewer
            product={product}
            initialMediaType="image"
            trigger={
              <MediaButton
                type="image"
                count={images}
                showLabel={showLabel}
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
                showLabel={showLabel}
              />
            }
          />
        )}
      </div>
    </div>
  );
};

export default MediaSection;