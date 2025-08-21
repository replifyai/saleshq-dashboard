import { useQuery } from "@tanstack/react-query";
import { chatApi, type ProductImage, type ProductVideo, type BasicProduct } from "@/lib/apiUtils";

export interface UseProductMediaResult {
  // Raw data
  mediaData: any;
  isLoading: boolean;
  error: any;
  
  // Transformed data
  images: ProductImage[];
  videos: ProductVideo[];
  
  // Metadata
  hasImages: boolean;
  hasVideos: boolean;
  totalMedia: number;
  productName: string;
}

/**
 * Shared hook for fetching product media (images and videos) using the unified API endpoint.
 * This hook ensures only one API call is made regardless of whether images or videos are accessed first.
 */
export function useProductMedia(product: BasicProduct & { media?: any[] }, enabled: boolean = true): UseProductMediaResult {
  // Validate product data
  const isValidProduct = product && product.id && product.id.trim() !== '';
  const hasEmbeddedMedia = product.media && Array.isArray(product.media);
  const shouldFetch = Boolean(enabled && isValidProduct && !hasEmbeddedMedia);
  
  // Single query for all media data - only if no embedded media
  const { data: mediaData, isLoading, error } = useQuery({
    queryKey: ['productMedia', product?.id || 'invalid'], // Stable key
    queryFn: () => {
      console.log('📱 Fetching unified media data for product:', product.id);
      if (!isValidProduct) {
        throw new Error('Invalid product data provided');
      }
      return chatApi.getProductMedia(product.id);
    },
    enabled: shouldFetch,
    staleTime: 0, // Consider data stale immediately
    gcTime: 1000, // Keep in cache for 1 second only
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnWindowFocus: false,
    retry: false, // Don't retry failed requests
  });

  // Use embedded media if available, otherwise use API response
  const sourceData = hasEmbeddedMedia ? { data: product.media } : (mediaData || {});

  // Extract product name and transform data
  let productName = product?.name || 'Unknown Product'; // Safe fallback
  const images: ProductImage[] = [];
  const videos: ProductVideo[] = [];
  let imageIndex = 1;
  let videoIndex = 1;
  
  // Don't process data if product is invalid and hook is enabled
  if (!isValidProduct && enabled) {
    console.warn('📱 useProductMedia: Invalid product data provided:', product);
    return {
      mediaData: null,
      isLoading: false,
      error: new Error('Invalid product data'),
      images: [],
      videos: [],
      hasImages: false,
      hasVideos: false,
      totalMedia: 0,
      productName
    };
  }
  
  // If hook is disabled or product is invalid, return empty state without error
  if (!isValidProduct || !enabled) {
    return {
      mediaData: null,
      isLoading: false,
      error: null,
      images: [],
      videos: [],
      hasImages: false,
      hasVideos: false,
      totalMedia: 0,
      productName
    };
  }
  
  if ((sourceData as any)?.data && Array.isArray((sourceData as any).data)) {
    (sourceData as any).data.forEach((item: any, itemIndex: number) => {
      // Use the first item's name as the main product name if available
      if (itemIndex === 0 && item.name) {
        productName = item.name;
      }
      
      if (item.media && Array.isArray(item.media)) {
        item.media.forEach((media: any) => {
          if (media.type === 'image') {
            images.push({
              id: `img${imageIndex}`,
              name: item.name || `Image ${imageIndex}`,
              url: media.url,
              filename: `${item.name || 'image'}_${imageIndex}.jpg`.replace(/[^a-zA-Z0-9._-]/g, '_')
            });
            imageIndex++;
          } else if (media.type === 'video') {
            videos.push({
              id: `vid${videoIndex}`,
              name: item.name || `Video ${videoIndex}`,
              url: media.url,
              filename: `${item.name || 'video'}_${videoIndex}.mp4`.replace(/[^a-zA-Z0-9._-]/g, '_'),
              // These could be added to the API response later
              duration: media.duration || undefined,
              size: media.size || undefined
            });
            videoIndex++;
          }
        });
      }
    });
  }

  // Debug logging
  console.log('📱 useProductMedia result:', {
    productId: product.id,
    productName,
    hasEmbeddedMedia,
    isLoading: hasEmbeddedMedia ? false : isLoading,
    error,
    imagesCount: images.length,
    videosCount: videos.length,
    totalItems: (sourceData as any)?.data?.length || 0,
    rawResponse: sourceData
  });

  return {
    mediaData: sourceData,
    isLoading: hasEmbeddedMedia ? false : isLoading,
    error: hasEmbeddedMedia ? null : error,
    images,
    videos,
    hasImages: images.length > 0,
    hasVideos: videos.length > 0,
    totalMedia: images.length + videos.length,
    productName
  };
}