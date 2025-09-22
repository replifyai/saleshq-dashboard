'use client'
import { useState, useCallback } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useProductMedia } from "@/hooks/use-product-media";
import {
  Images,
  Download,
  Copy,
  ImageIcon,
  Link,
  Check,
  ArrowLeft as IconArrowLeft,
  ArrowRight as IconArrowRight,
} from "lucide-react";
import { type BasicProduct, type ProductImage } from "@/lib/apiUtils";

interface ProductImageViewerProps {
  product: BasicProduct;
  trigger?: React.ReactNode;
}

export default function ProductImageViewer({ product, trigger }: ProductImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [isPreloading, setIsPreloading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  // Use shared media hook - with error handling
  const { images, isLoading, error, productName } = useProductMedia(product, isOpen);

  // Log errors for debugging
  if (error) {
    console.warn('🖼️ ProductImageViewer: Error loading images:', error);
  }

  // Preload images when data is available
  const preloadImages = async (imagesToPreload: ProductImage[]) => {
    if (imagesToPreload.length === 0) return;

    setIsPreloading(true);
    console.log('🖼️ Starting to preload', imagesToPreload.length, 'images');

    const preloadPromises = imagesToPreload.map((image) => {
      return new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
          console.log('✅ Preloaded:', image.name);
          resolve(image.url);
        };
        img.onerror = () => {
          console.warn('❌ Failed to preload:', image.name);
          resolve(image.url); // Still resolve to continue
        };
        img.src = image.url;
      });
    });

    try {
      const loadedUrls = await Promise.all(preloadPromises);
      setPreloadedImages(new Set(loadedUrls));
      console.log('🖼️ All images preloaded successfully');
    } catch (error) {
      console.warn('🖼️ Some images failed to preload:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  // Preload images when image data changes
  React.useEffect(() => {
    if (images.length > 0 && preloadedImages.size === 0) {
      preloadImages(images);
    }
  }, [images, preloadedImages.size]);

  // Debug logging
  console.log('🖼️ ProductImageViewer state:', {
    isOpen,
    isLoading,
    error,
    imagesCount: images.length,
    productId: product.id,
    preloadedCount: preloadedImages.size,
    isPreloading
  });



  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
      toast({
        title: "URL Copied",
        description: "Image URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (image: ProductImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.filename || `${productName}_${image.name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Downloading ${image.name}`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };
  React.useEffect(() => {
    // Copy the image to the clipboard when the image is selected (actual image data, not just URL)
    const copyImageToClipboard = async () => {
      if (!selectedImage) return;

      try {
        // Create an image element to load the image
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Handle CORS issues

        // Wait for image to load
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = selectedImage.url;
        });

        // Create a canvas to convert the image to PNG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Set canvas dimensions to match image
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Convert canvas to PNG blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          }, 'image/png');
        });

        // Copy PNG blob to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);

        toast({
          title: "Image Copied",
          description: "Image has been copied to clipboard",
        });
      } catch (error) {
        console.error('Failed to copy image to clipboard:', error);
        toast({
          title: "Copy Failed",
          description: "Failed to copy image to clipboard. Make sure the page has focus and try again.",
          variant: "destructive",
        });
      }
    };

    if (selectedImage) {
      copyImageToClipboard();
    }
  }, [selectedImage, toast]);

  // const handleClose = () => {
  //   console.log('🖼️ Closing image dialog');
  //   setIsOpen(false);
  //   setSelectedImage(null);
  //   setCopiedUrl(null);
  // };

  const handleOpen = (open: boolean) => {
    console.log('🖼️ Dialog open state changed to:', open);
    setIsOpen(open);
    if (!open) {
      setSelectedImage(null);
      setCopiedUrl(null);
    }
  };

  const handleImageSelect = (image: ProductImage) => {
    console.log('🖼️ Selecting image:', {
      imageName: image.name,
      imageUrl: image.url,
      imageId: image.id,
      preloaded: preloadedImages.has(image.url),
      totalImages: images.length,
      allImages: images.map(img => ({ id: img.id, name: img.name, url: img.url }))
    });
    
    // Set loading state for smooth transition
    setIsImageLoading(true);
    setSelectedImage(image);
    
    // Ensure we start at the top of the preview view
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleBackToSelection = () => {
    setSelectedImage(null);
    setIsImageLoading(false);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  // Navigation helpers for image preview (left/right)
  const getCurrentImageIndex = useCallback((): number => {
    if (!selectedImage) return -1;
    const idx = images.findIndex((img) => img.url === selectedImage.url);
    console.log('🔍 getCurrentImageIndex:', {
      selectedImageUrl: selectedImage.url,
      imagesCount: images.length,
      foundIndex: idx,
      images: images.map(img => ({ id: img.id, name: img.name, url: img.url }))
    });
    return idx;
  }, [selectedImage, images]);

  const goImage = useCallback((delta: number) => {
    console.log('🔄 goImage called:', { delta, selectedImage: selectedImage?.name, imagesLength: images.length });
    
    if (!selectedImage || images.length <= 1) {
      console.log('❌ goImage: Cannot navigate - no selected image or only one image');
      return;
    }
    
    const idx = getCurrentImageIndex();
    if (idx === -1) {
      console.log('❌ goImage: Current image not found in images array');
      return;
    }
    
    const nextIdx = (idx + delta + images.length) % images.length;
    const next = images[nextIdx];
    console.log('✅ goImage: Navigating to:', {
      currentIdx: idx,
      delta,
      nextIdx,
      nextImage: next ? { id: next.id, name: next.name, url: next.url } : null
    });
    
    // Set loading state for smooth transition
    setIsImageLoading(true);
    
    // Force a new object reference to ensure React detects the change
    setSelectedImage({ ...next });
  }, [selectedImage, images, getCurrentImageIndex]);

  const handlePrevImage = useCallback(() => {
    console.log('⬅️ handlePrevImage called');
    goImage(-1);
  }, [goImage]);
  
  const handleNextImage = useCallback(() => {
    console.log('➡️ handleNextImage called');
    goImage(1);
  }, [goImage]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
          >
            <Images className="w-4 h-4 mr-2" />
            View Images
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            <q>{product.id}</q> - Images
            {images.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {images.length} {images.length === 1 ? 'Image' : 'Images'}
              </Badge>
            )}
          </DialogTitle>
          {/* Debug info */}
          <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded">
            {/* Status: {isLoading ? 'Loading...' : error ? 'Error' : `Found ${images.length} images`} |  */}
            Product ID: <b>{product.id}</b>
            {/* Dialog Open: {isOpen ? 'Yes' : 'No'} |  */}
            {/* Preloaded: {preloadedImages.size}/{images.length} {isPreloading ? '(Loading...)' : '✓'} */}
          </div>
        </DialogHeader>

        <div ref={contentRef} className="flex-1 space-y-4 min-h-0 overflow-y-auto relative">
          {isLoading ? (
            <div className="space-y-3">
              <div className="text-center py-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading images...</p>
              </div>
              <Skeleton className="h-10 w-full rounded-full" />
              <Skeleton className="h-10 w-3/4 rounded-full" />
              <Skeleton className="h-10 w-1/2 rounded-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">Failed to load images</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Error: {error instanceof Error ? error.message : 'Please try again later'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Product ID: {product.id}
              </p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">No images available</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                This product doesn't have any images yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Product ID: {product.id}
              </p>
            </div>
          ) : !selectedImage ? (
            /* Image Selection View */
            <div key="list" className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click on an image name to preview it:
                {isPreloading && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    (Preloading images for instant preview...)
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {images.map((image) => {
                  const isPreloaded = preloadedImages.has(image.url);
                  return (
                    <button
                      key={image.id}
                      onClick={() => handleImageSelect(image)}
                      className={`inline-flex items-center px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 text-sm font-medium ${isPreloaded
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                        }`}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {image.name}
                      {isPreloaded && (
                        <span className="ml-1 text-green-600 dark:text-green-400 text-xs">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Image Preview View */
            <div className="space-y-4">
              {/* Back to selection */}
              <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToSelection}
                  className="text-sm"
                >
                  ← Back to selection
                </Button>
                <Badge variant="outline" className="text-xs">
                  {selectedImage.name}
                </Badge>
              </div>
                {/* Image preview */}
                <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                  {/* Loading overlay */}
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  
                  <img
                    key={selectedImage.id}
                    src={selectedImage.url}
                    alt={selectedImage.name}
                    className={`w-full max-h-96 object-contain transition-opacity duration-200 ease-in-out ${
                      isImageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{
                      opacity: isImageLoading ? 0 : (preloadedImages.has(selectedImage.url) ? 1 : 0.9)
                    }}
                    onLoad={() => {
                      console.log('🖼️ Image loaded:', selectedImage.name);
                      setIsImageLoading(false);
                    }}
                    onError={() => {
                      console.warn('❌ Image failed to load:', selectedImage.name);
                      setIsImageLoading(false);
                    }}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous image"
                        onClick={(e) => {
                          console.log('🖱️ Previous button clicked');
                          e.preventDefault();
                          e.stopPropagation();
                          handlePrevImage();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/70 hover:bg-white dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-full p-2 shadow z-10"
                      >
                        <IconArrowLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next image"
                        onClick={(e) => {
                          console.log('🖱️ Next button clicked');
                          e.preventDefault();
                          e.stopPropagation();
                          handleNextImage();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/70 hover:bg-white dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-full p-2 shadow z-10"
                      >
                        <IconArrowRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Image details and actions */}
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Name:</strong> {selectedImage.name}</p>
                    <p><strong>Filename:</strong> {selectedImage.filename}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyUrl(selectedImage.url)}
                      className="flex items-center gap-2"
                    >
                      {copiedUrl === selectedImage.url ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          URL Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy URL
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(selectedImage)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedImage.url, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <Link className="w-4 h-4" />
                      Open in New Tab
                    </Button>
                  </div>

                  {/* URL display */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Image URL:</p>
                    <code className="text-xs text-gray-700 dark:text-gray-300 break-all">
                      {selectedImage.url}
                    </code>
                  </div>
                </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}