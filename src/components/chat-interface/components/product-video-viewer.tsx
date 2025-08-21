'use client'
import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useProductMedia } from "@/hooks/use-product-media";
import { 
  Video, 
  Download, 
  Copy,
  Link,
  Check,
  Play,
  Clock,
  FileVideo
} from "lucide-react";
import { type BasicProduct, type ProductVideo } from "@/lib/apiUtils";

interface ProductVideoViewerProps {
  product: BasicProduct;
  trigger?: React.ReactNode;
}

export default function ProductVideoViewer({ product, trigger }: ProductVideoViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<ProductVideo | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Use shared media hook - with error handling
  const { videos, isLoading, error, productName } = useProductMedia(product, isOpen);
  
  // Log errors for debugging
  if (error) {
    console.warn('🎥 ProductVideoViewer: Error loading videos:', error);
  }
  
  // Debug logging
  console.log('🎥 ProductVideoViewer state:', {
    isOpen,
    isLoading,
    error,
    videosCount: videos.length,
    productId: product.id
  });

  const handleVideoSelect = (video: ProductVideo) => {
    console.log('🎥 Selecting video:', video.name);
    setSelectedVideo(video);
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
      toast({
        title: "URL Copied",
        description: "Video URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (video: ProductVideo) => {
    try {
      const response = await fetch(video.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = video.filename || `${productName}_${video.name}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: `Downloading ${video.name}`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download video",
        variant: "destructive",
      });
    }
  };

  // const handleClose = () => {
  //   console.log('🎥 Closing video dialog');
  //   setIsOpen(false);
  //   setSelectedVideo(null);
  //   setCopiedUrl(null);
  // };

  const handleOpen = (open: boolean) => {
    console.log('🎥 Dialog open state changed to:', open);
    setIsOpen(open);
    if (!open) {
      setSelectedVideo(null);
      setCopiedUrl(null);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/40 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200"
          >
            <Video className="w-4 h-4 mr-2" />
            View Videos
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileVideo className="w-5 h-5" />
            <q>{product.id}</q> - Videos
            {videos.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {videos.length} {videos.length === 1 ? 'Video' : 'Videos'}
              </Badge>
            )}
          </DialogTitle>
          {/* Debug info */}
          <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded">
            {/* Status: {isLoading ? 'Loading...' : error ? 'Error' : `Found ${videos.length} videos`} |  */}
            Product ID: <b>{product.id}</b>
            {/* Dialog Open: {isOpen ? 'Yes' : 'No'} */}
          </div>
        </DialogHeader>

        <div className="flex-1 relative space-y-4 min-h-0">
          {isLoading ? (
            <div className="space-y-3">
              <div className="text-center py-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading videos...</p>
              </div>
              <Skeleton className="h-10 w-full rounded-full" />
              <Skeleton className="h-10 w-3/4 rounded-full" />
              <Skeleton className="h-10 w-1/2 rounded-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <FileVideo className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">Failed to load videos</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Error: {error instanceof Error ? error.message : 'Please try again later'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Product ID: {product.id}
              </p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <FileVideo className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">No videos available</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                This product doesn't have any videos yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Product ID: {product.id}
              </p>
            </div>
          ) : !selectedVideo ? (
            /* Video Selection View */
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click on a video to preview it:
              </p>
              <div className="space-y-2">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => handleVideoSelect(video)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 hover:shadow-md"
                  >
                    {/* Play Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    
                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {video.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="truncate">Click to play video</span>
                        {video.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(video.duration)}
                          </div>
                        )}
                        {video.size && (
                          <span>{formatFileSize(video.size)}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Video Preview View */
            <div className="space-y-4">
              {/* Back to selection */}
              <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedVideo(null)}
                  className="text-sm"
                >
                  ← Back to selection
                </Button>
                <Badge variant="outline" className="text-xs">
                  {selectedVideo.name}
                </Badge>
              </div>

              {/* Video player */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-black">
                <video
                  controls
                  className="w-full max-h-96"
                  preload="metadata"
                  onError={(e) => {
                    console.error('🎥 Video loading error:', e);
                  }}
                >
                  <source src={selectedVideo.url} type="video/mp4" />
                  <source src={selectedVideo.url} type="video/webm" />
                  <source src={selectedVideo.url} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video details and actions */}
              <div className="space-y-3">
                <div className="text-sm text-gray-600 dark:text-gray-400 grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Name:</strong> {selectedVideo.name}</p>
                    <p><strong>Filename:</strong> {selectedVideo.filename}</p>
                  </div>
                  <div>
                    {selectedVideo.duration && (
                      <p><strong>Duration:</strong> {formatDuration(selectedVideo.duration)}</p>
                    )}
                    {selectedVideo.size && (
                      <p><strong>Size:</strong> {formatFileSize(selectedVideo.size)}</p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyUrl(selectedVideo.url)}
                    className="flex items-center gap-2"
                  >
                    {copiedUrl === selectedVideo.url ? (
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
                    onClick={() => handleDownload(selectedVideo)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedVideo.url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Link className="w-4 h-4" />
                    Open in New Tab
                  </Button>
                </div>

                {/* URL display */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Video URL:</p>
                  <code className="text-xs text-gray-700 dark:text-gray-300 break-all">
                    {selectedVideo.url}
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