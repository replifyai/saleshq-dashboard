import type { Product } from '@/lib/apiUtils';

/**
 * Format date string to human-readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

/**
 * Get total number of files across all products
 */
export const getTotalFiles = (products: Product[]): number => {
  return products?.reduce((total, product) => total + product.files.length, 0) || 0;
};

/**
 * Get media counts (images and videos) for a product
 */
export const getMediaCounts = (product: Product): { images: number; videos: number } => {
  if (!product.media) return { images: 0, videos: 0 };
  
  let images = 0;
  let videos = 0;
  
  product.media.forEach((item) => {
    item.media.forEach((media) => {
      if (media.type === 'image') images++;
      else if (media.type === 'video') videos++;
    });
  });
  
  return { images, videos };
};

/**
 * Get unique contributors count
 */
export const getContributorsCount = (products: Product[]): number => {
  return new Set(products?.map(product => product.createdBy) || []).size;
};