'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface ProductImage {
  id: string;
  src: string;
  alt?: string;
}

interface ProductImageCarouselProps {
  images: ProductImage[];
  productTitle: string;
  className?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function ProductImageCarousel({
  images,
  productTitle,
  className,
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 3000
}: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={cn("h-full w-full bg-gray-100 rounded-lg flex items-center justify-center", className)}>
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentIndex]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      {/* Main Image Display */}
      <div className="relative h-full w-full bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt || `${productTitle} - Image ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={currentIndex === 0}
        />
        
        {/* Image Counter */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-black/70 text-white">
            {currentIndex + 1} / {images.length}
          </Badge>
        </div>

        {/* Primary Image Badge */}
        {currentIndex === 0 && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-blue-600 text-white">
              Primary
            </Badge>
          </div>
        )}

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 rounded-full w-8 h-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 rounded-full w-8 h-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails - Only show if showThumbnails is true and there are multiple images */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                currentIndex === index 
                  ? "border-blue-500 ring-2 ring-blue-200" 
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Image
                src={image.src}
                alt={image.alt || `${productTitle} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
              {index === 0 && (
                <div className="absolute top-0 right-0">
                  <Badge variant="secondary" className="text-xs bg-blue-600 text-white rounded-none rounded-bl-lg">
                    P
                  </Badge>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicator - Only show if showThumbnails is false and there are multiple images */}
      {!showThumbnails && images.length > 1 && (
        <div className="mt-2 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentIndex === index 
                  ? "bg-blue-500" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
} 