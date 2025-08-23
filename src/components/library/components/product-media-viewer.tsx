import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image as ImageIcon,
  Video,
  Play,
  ExternalLink,
  ArrowLeft,
  Trash
} from "lucide-react";
import { type Product, type ProductMediaData } from "@/lib/apiUtils";

interface ProductMediaViewerProps {
  product: Product;
  trigger?: React.ReactNode;
  initialMediaType?: 'image' | 'video';
}

export default function ProductMediaViewer({ product, trigger, initialMediaType }: ProductMediaViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{item: ProductMediaData, mediaIndex: number} | null>(null);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>(initialMediaType || 'image');

  // Extract images and videos from product media
  const images: Array<{item: ProductMediaData, mediaIndex: number, url: string}> = [];
  const videos: Array<{item: ProductMediaData, mediaIndex: number, url: string}> = [];
  
  product.media?.forEach((item) => {
    item.media.forEach((media, mediaIndex) => {
      if (media.type === 'image') {
        images.push({ item, mediaIndex, url: media.url });
      } else if (media.type === 'video') {
        videos.push({ item, mediaIndex, url: media.url });
      }
    });
  });

  const currentItems = activeTab === 'image' ? images : videos;

  const handleMediaSelect = (item: ProductMediaData, mediaIndex: number) => {
    setSelectedMedia({ item, mediaIndex });
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedMedia(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <ImageIcon className="w-4 h-4 mr-1" />
            View Media
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            {activeTab === 'image' ? (
              <ImageIcon className="w-5 h-5" />
            ) : (
              <Video className="w-5 h-5" />
            )}
            {product.name} - Media
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b p-1 rounded-lg sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm">
            <Button
              variant={activeTab === 'image' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setActiveTab('image');
                setSelectedMedia(null);
              }}
              className="flex items-center gap-1 border border-gray-200"
            >
              <ImageIcon className="w-4 h-4" />
              Images ({images.length})
            </Button>
            <Button
              variant={activeTab === 'video' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setActiveTab('video');
                setSelectedMedia(null);
              }}
              className="flex items-center gap-1 border border-gray-200"
            >
              <Video className="w-4 h-4" />
              Videos ({videos.length})
            </Button>
          </div>

          {/* Media Content */}
          {currentItems.length === 0 ? (
            <div className="text-center py-8">
              {activeTab === 'image' ? (
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              ) : (
                <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              )}
              <p className="text-gray-500">No {activeTab}s available for this product</p>
            </div>
          ) : !selectedMedia ? (
            /* Media Selection View */
            <div className="space-y-4">
              {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                Click on a {activeTab} to preview it:
              </p> */}
              <div className="space-y-2">
                {currentItems.map((mediaData) => (
                  <div key={`${mediaData.item.id || mediaData.item.name}-${mediaData.mediaIndex}-${mediaData.url}`}>
                  <button
                    onClick={() => handleMediaSelect(mediaData.item, mediaData.mediaIndex)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md"
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                      activeTab === 'image' 
                        ? 'bg-blue-100 dark:bg-blue-900/30' 
                        : 'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {activeTab === 'image' ? (
                        <ImageIcon className={`w-6 h-6 ${
                          activeTab === 'image' 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-purple-600 dark:text-purple-400'
                        }`} />
                      ) : (
                        <Play className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    
                    {/* Media Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {mediaData.item.name}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {mediaData.item.id}
                          </span>
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {mediaData.item.description && (
                          <span className="truncate block">{mediaData.item.description}</span>
                        )}
                        <span className="text-blue-600 dark:text-blue-400">
                          Click to {activeTab === 'image' ? 'view image' : 'play video'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Trash className="w-4 h-4 text-red-500" />
                    </div>
                  </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Media Preview View */
            <div className="space-y-4">
              {/* Back to selection */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMedia(null)}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to selection
                </Button>
                <Badge variant="outline" className="text-xs">
                  {selectedMedia.item.name}
                </Badge>
              </div>

              {/* Media Display */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {activeTab === 'image' ? (
                  <img
                    src={selectedMedia.item.media[selectedMedia.mediaIndex].url}
                    alt={selectedMedia.item.name}
                    className="w-full max-h-96 object-contain bg-gray-100 dark:bg-gray-800"
                    onError={(e) => {
                      console.error('🖼️ Image loading error:', e);
                    }}
                  />
                ) : (
                  <div className="bg-black">
                    <video
                      controls
                      className="w-full max-h-96"
                      preload="metadata"
                      onError={(e) => {
                        console.error('🎥 Video loading error:', e);
                      }}
                    >
                      <source src={selectedMedia.item.media[selectedMedia.mediaIndex].url} type="video/mp4" />
                      <source src={selectedMedia.item.media[selectedMedia.mediaIndex].url} type="video/webm" />
                      <source src={selectedMedia.item.media[selectedMedia.mediaIndex].url} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>

              {/* Media Details */}
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <strong>Name:</strong> {selectedMedia.item.name}
                </div>
                {selectedMedia.item.description && (
                  <div>
                    <strong>Description:</strong> {selectedMedia.item.description}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <strong>URL:</strong>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedMedia.item.media[selectedMedia.mediaIndex].url, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open in new tab
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}