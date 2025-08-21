'use client'
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useProductMedia } from "@/hooks/use-product-media";
import { chatApi, type BasicProduct, type ProductMediaData } from "@/lib/apiUtils";
import { 
  Plus,
  Image,
  Video,
  X,
  Eye,
  ExternalLink
} from "lucide-react";

interface AddMediaModalProps {
  products: BasicProduct[];
  trigger?: React.ReactNode;
}

interface MediaEntry {
  url: string;
  type: 'image' | 'video';
}

export default function AddMediaModal({ products, trigger }: AddMediaModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [mediaName, setMediaName] = useState("");
  const [mediaDescription, setMediaDescription] = useState("");
  const [mediaEntries, setMediaEntries] = useState<MediaEntry[]>([{ url: "", type: "image" }]);
  const [viewingMedia, setViewingMedia] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get existing media for selected product
  const selectedProduct = products.find(p => p.id === selectedProductId);
  const { images, videos, isLoading: isLoadingMedia, productName, error: mediaError } = useProductMedia(
    selectedProduct || { id: "no-product", name: "No Product Selected" },
    viewingMedia && !!selectedProduct
  );
  
  // Log any media errors
  if (mediaError) {
    console.warn('📱 AddMediaModal: Error loading media:', mediaError);
  }

  // Mutation to create product media
  const createMediaMutation = useMutation({
    mutationFn: async (data: { productId: string; mediaData: ProductMediaData }) => {
      return chatApi.createProductMedia(data.productId, data.mediaData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Media added successfully!",
      });
      
      // Reset form
      setMediaName("");
      setMediaDescription("");
      setMediaEntries([{ url: "", type: "image" }]);
      setSelectedProductId("");
      setIsOpen(false);
      
      // Invalidate relevant queries - be more specific to avoid crashes
      try {
        queryClient.invalidateQueries({ queryKey: ['productMedia'] });
        queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      } catch (error) {
        console.warn('📱 AddMediaModal: Error invalidating queries:', error);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addMediaEntry = () => {
    setMediaEntries([...mediaEntries, { url: "", type: "image" }]);
  };

  const removeMediaEntry = (index: number) => {
    if (mediaEntries.length > 1) {
      setMediaEntries(mediaEntries.filter((_, i) => i !== index));
    }
  };

  const updateMediaEntry = (index: number, field: keyof MediaEntry, value: string) => {
    const updated = [...mediaEntries];
    updated[index] = { ...updated[index], [field]: value };
    setMediaEntries(updated);
  };

  const handleSubmit = () => {
    if (!selectedProductId) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }

    if (!mediaName.trim()) {
      toast({
        title: "Error", 
        description: "Please enter a media name",
        variant: "destructive",
      });
      return;
    }

    const validEntries = mediaEntries.filter(entry => entry.url.trim());
    if (validEntries.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one media URL",
        variant: "destructive",
      });
      return;
    }

    const mediaData: ProductMediaData = {
      name: mediaName.trim(),
      description: mediaDescription.trim(),
      media: validEntries.map(entry => ({
        url: entry.url.trim(),
        type: entry.type
      }))
    };

    createMediaMutation.mutate({
      productId: selectedProductId,
      mediaData
    });
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset viewing state when closing
      setViewingMedia(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Media
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Product Media
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product-select">Select Product</Label>
            <div className="flex gap-2">
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a product..." />
                </SelectTrigger>
                <SelectContent searchable searchPlaceholder="Search products..." noResultsText="No products found">
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedProduct && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingMedia(!viewingMedia)}
                  className="shrink-0"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {viewingMedia ? 'Hide' : 'View'} Existing
                </Button>
              )}
            </div>
          </div>

          {/* Existing Media Viewer */}
          {viewingMedia && selectedProduct && (
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <h4 className="font-semibold mb-3">Existing Media for {productName}</h4>
              
              {isLoadingMedia ? (
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Images */}
                  {images.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                        <Image className="w-4 h-4" />
                        Images ({images.length})
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {images.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="text-xs"
                                onClick={() => window.open(image.url, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {videos.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        Videos ({videos.length})
                      </h5>
                      <div className="space-y-2">
                        {videos.map((video) => (
                          <div key={video.id} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{video.name}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(video.url, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {images.length === 0 && videos.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No existing media found for this product.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Media Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="media-name">Media Name *</Label>
              <Input
                id="media-name"
                value={mediaName}
                onChange={(e) => setMediaName(e.target.value)}
                placeholder="e.g., Product Images Set 1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="media-description">Description</Label>
              <Input
                id="media-description"
                value={mediaDescription}
                onChange={(e) => setMediaDescription(e.target.value)}
                placeholder="Brief description of the media"
              />
            </div>
          </div>

          {/* Media Entries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Media URLs</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMediaEntry}
                className="flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add URL
              </Button>
            </div>

            <div className="space-y-3">
              {mediaEntries.map((entry, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      value={entry.url}
                      onChange={(e) => updateMediaEntry(index, 'url', e.target.value)}
                      placeholder="https://example.com/media-url"
                    />
                  </div>
                  
                  <Select
                    value={entry.type}
                    onValueChange={(value: 'image' | 'video') => updateMediaEntry(index, 'type', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          Image
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Video
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {mediaEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMediaEntry(index)}
                      className="shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createMediaMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMediaMutation.isPending}
              className="flex items-center gap-2"
            >
              {createMediaMutation.isPending ? (
                "Adding..."
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Media
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}