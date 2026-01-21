'use client'
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  onImageClick?: (index: number) => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onImageClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps'
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full mt-3 mb-2">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex gap-2">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="flex-[0_0_auto] min-w-0 w-[120px] sm:w-[150px] cursor-pointer group"
              onClick={() => onImageClick?.(index)}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <img
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback for broken images
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all ${
              prevBtnDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:scale-110'
            }`}
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all ${
              nextBtnDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:scale-110'
            }`}
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
