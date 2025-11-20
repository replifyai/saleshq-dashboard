import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { queriesApi, chatApi, documentApi } from "@/lib/apiUtils";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Brain, Sparkles, AlertTriangle, CheckCircle, XCircle, Clock, FileText } from "lucide-react";

interface UpdateAIKnowledgeProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

interface UploadingFile {
  id: string;
  file: File;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  startTime?: number;
  isNewProduct?: boolean;
}

export default function UpdateAIKnowledge({ trigger, onSuccess }: UpdateAIKnowledgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("files");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [productName, setProductName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [textUpdateContent, setTextUpdateContent] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch existing products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['productsBasic'],
    queryFn: () => chatApi.getProductsBasic(),
    enabled: isOpen,
  });

  // Calculate if there are active uploads
  const hasActiveUploads = uploadingFiles.some(file => 
    file.status === 'uploading' || file.status === 'processing'
  );

  // Progress simulation for better UX
  useEffect(() => {
    if (!hasActiveUploads) return;

    const interval = setInterval(() => {
      setUploadingFiles(prev => prev.map(file => {
        if (file.status === 'uploading' && file.progress < 85) {
          // Simulate upload progress with realistic curve
          const elapsed = Date.now() - (file.startTime || Date.now());
          const baseProgress = Math.min(85, (elapsed / 30000) * 60); // 60% in 30 seconds
          const randomVariation = Math.random() * 5;
          return { 
            ...file, 
            progress: Math.min(85, Math.max(file.progress, baseProgress + randomVariation))
          };
        }
        return file;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [hasActiveUploads]);

  // Mutation for updating existing products
  const updateProductMutation = useMutation({
    mutationFn: ({ file, name, productId }: { file: File; name: string; productId: string }) => 
      queriesApi.updateProduct(file, name, productId),
    onSuccess: (data, { file }) => {
      setUploadingFiles(prev => prev.map(f => 
        f.file === file 
          ? { ...f, status: 'complete', progress: 100 }
          : f
      ));
      
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ['productsBasic'] });

      toast({
        title: "AI Knowledge Updated Successfully",
        description: `${data.productName || 'Product'} has been enhanced with new documentation`,
      });

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error, { file }) => {
      setUploadingFiles(prev => prev.map(f => 
        f.file === file 
          ? { ...f, status: 'error', progress: 0 }
          : f
      ));

      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for creating new products
  const createProductMutation = useMutation({
    mutationFn: ({ file, name }: { file: File; name: string }) => 
      documentApi.uploadFile(file, name),
    onSuccess: (data, { file }) => {
      setUploadingFiles(prev => prev.map(f => 
        f.file === file 
          ? { ...f, status: 'complete', progress: 100 }
          : f
      ));
      
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ['productsBasic'] });

      toast({
        title: "New Product Created Successfully",
        description: `${data.productName || 'Product'} has been created with the documentation`,
      });

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error, { file }) => {
      setUploadingFiles(prev => prev.map(f => 
        f.file === file 
          ? { ...f, status: 'error', progress: 0 }
          : f
      ));

      toast({
        title: "Product creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for updating knowledge base with text
  const updateKnowledgeBaseMutation = useMutation({
    mutationFn: ({ productId, updatePoint }: { productId: string; updatePoint: string }) =>
      queriesApi.updateKnowledgeBase(productId, updatePoint),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ['productsBasic'] });

      toast({
        title: "Knowledge Base Updated",
        description: "Text update has been processed successfully.",
      });
      
      setTextUpdateContent("");
      
      if (onSuccess) {
        onSuccess();
      }
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    // Prevent file selection if no product is selected or new product name entered
    if (!selectedProductId && !productName.trim()) {
      toast({
        title: "Product selection required",
        description: "Please select an existing product or enter a new product name before uploading files.",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles: File[] = [];

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type. Only PDF, DOCX, and TXT files are allowed.`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          variant: "destructive",
        });
        return;
      }

      // Check if file is already selected
      const isAlreadySelected = selectedFiles.some(sf => sf.name === file.name && sf.size === file.size);
      const isAlreadyUploading = uploadingFiles.some(uf => uf.file.name === file.name && uf.file.size === file.size);
      
      if (isAlreadySelected || isAlreadyUploading) {
        toast({
          title: "File already selected",
          description: `${file.name} is already in the queue.`,
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeSelectedFile = (fileIndex: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== fileIndex));
  };

  const startUpdate = () => {
    if (activeTab === "text") {
      if (!selectedProductId) {
         toast({
            title: "Product selection required",
            description: "Please select an existing product to update with text.",
            variant: "destructive",
          });
          return;
      }
      if (!textUpdateContent.trim()) {
         toast({
            title: "Text content required",
            description: "Please enter text to update the knowledge base.",
            variant: "destructive",
          });
          return;
      }
      
      updateKnowledgeBaseMutation.mutate({
        productId: selectedProductId,
        updatePoint: textUpdateContent
      });
      return;
    }

    // File upload logic
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProductId && !productName.trim()) {
      toast({
        title: "Product selection required",
        description: "Please select an existing product or enter a new product name.",
        variant: "destructive",
      });
      return;
    }

    const isNewProduct = !selectedProductId && !!productName.trim();
    
    // Move selected files to uploading state
    const uploadingFilesData: UploadingFile[] = selectedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      status: 'uploading' as const,
      progress: 0,
      startTime: Date.now(),
      isNewProduct,
    }));

    setUploadingFiles(prev => [...prev, ...uploadingFilesData]);
    
    // Start uploading each file with the appropriate mutation
    if (isNewProduct) {
      // Creating new product - use uploadFile
      selectedFiles.forEach(file => {
        createProductMutation.mutate({ 
          file, 
          name: productName.trim()
        });
      });
    } else {
      // Updating existing product - use updateProduct
      const existingProduct = products?.find(p => p.id === selectedProductId);
      const finalProductName = existingProduct?.name || selectedProductId;

      selectedFiles.forEach(file => {
        updateProductMutation.mutate({ 
          file, 
          name: finalProductName, 
          productId: selectedProductId 
        });
      });
    }

    // Clear form
    setSelectedFiles([]);
    setProductName("");
    setSelectedProductId("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-blue-50');
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-blue-50');
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') return 'fas fa-file-pdf text-red-500';
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'fas fa-file-word text-blue-500';
    if (file.type === 'text/plain') return 'fas fa-file-alt text-gray-500';
    return 'fas fa-file text-gray-500';
  };

  const getEstimatedTimeRemaining = (file: UploadingFile) => {
    if (!file.startTime || file.status !== 'uploading') return null;
    
    const elapsed = Date.now() - file.startTime;
    const progress = Math.max(file.progress, 1);
    const totalEstimated = (elapsed / progress) * 100;
    const remaining = Math.max(0, totalEstimated - elapsed);
    
    if (remaining < 60000) {
      return `~${Math.round(remaining / 1000)}s remaining`;
    } else {
      return `~${Math.round(remaining / 60000)}m remaining`;
    }
  };

  const getStatusColor = (status: UploadingFile['status']) => {
    switch (status) {
      case 'complete': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'processing': return 'text-orange-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Processing chunks...';
      case 'complete': return 'Complete';
      case 'error': return 'Error';
    }
  };

  const handleClose = () => {
    if (hasActiveUploads) {
      toast({
        title: "Upload in progress",
        description: "Please wait for uploads to complete before closing.",
        variant: "destructive",
      });
      return;
    }
    setIsOpen(false);
    setSelectedFiles([]);
    setUploadingFiles([]);
    setProductName("");
    setSelectedProductId("");
    setTextUpdateContent("");
    setActiveTab("files");
  };

  // Determine if we're in "new product" mode
  const isNewProductMode = !selectedProductId && productName.trim();

  // Update active tab if switching to new product mode
  useEffect(() => {
    if (isNewProductMode && activeTab === 'text') {
      setActiveTab('files');
    }
  }, [isNewProductMode, activeTab]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? setIsOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Update AI Knowledge
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 px-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            {isNewProductMode ? 'Create New Product' : 'Update AI Knowledge Base'}
          </DialogTitle>
          <DialogDescription>
            {isNewProductMode 
              ? 'Upload documentation to create a new product and enhance the AI\'s knowledge base.'
              : 'Upload documentation or text to enhance the AI\'s knowledge about existing products.'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
          {/* Upload Warning Banner */}
          {hasActiveUploads && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-800 mb-1">
                    {isNewProductMode ? 'Creating Product...' : 'Update in Progress'}
                  </h3>
                  <p className="text-sm text-amber-700 mb-2">
                    Files are being processed and may take 30 seconds to 2 minutes. 
                    Please don't close this dialog until processing is complete.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-amber-600">
                    <Clock className="w-4 h-4" />
                    <span>Processing typically completes within 2 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="product-select">Select Existing Product</Label>
              <div className="relative">
                <Select 
                  value={selectedProductId} 
                  onValueChange={(value) => {
                    setSelectedProductId(value);
                    // Clear new product name when selecting existing product
                    if (value) setProductName("");
                  }}
                  disabled={hasActiveUploads}
                >
                  <SelectTrigger className="mt-1 pr-12">
                    <SelectValue placeholder="Choose a product to update..." />
                  </SelectTrigger>
                  <SelectContent searchable searchPlaceholder="Search products..." noResultsText="No products found">
                    {isLoadingProducts ? (
                      <SelectItem value="loading" disabled>Loading products...</SelectItem>
                    ) : products && products.length > 0 ? (
                      products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-products" disabled>No products found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                
                {/* Clear button */}
                {selectedProductId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedProductId("");
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                    disabled={hasActiveUploads}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select this to update an existing product with new documentation
              </p>
            </div>

            <div className="text-center text-sm text-gray-500">
              <span>— OR —</span>
            </div>

            <div>
              <Label htmlFor="new-product-name">Create New Product</Label>
              <Input
                id="new-product-name"
                type="text"
                placeholder="Enter new product name..."
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  // Clear selected product when typing new product name
                  if (e.target.value.trim()) setSelectedProductId("");
                }}
                className="mt-1"
                disabled={hasActiveUploads || !!selectedProductId}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter this to create a completely new product with the uploaded documentation
              </p>
            </div>
          </div>

          {/* Mode Indicator */}
          {(selectedProductId || productName.trim()) && (
            <div className={`p-3 rounded-lg border ${
              isNewProductMode 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
            }`}>
              <div className="flex items-center gap-2">
                {isNewProductMode ? (
                  <>
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Creating new product: "{productName}"
                    </span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Updating existing product: "{products?.find(p => p.id === selectedProductId)?.name}"
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="files" disabled={hasActiveUploads}>
                <Upload className="w-4 h-4 mr-2"/> Upload Files
              </TabsTrigger>
              <TabsTrigger value="text" disabled={hasActiveUploads || !!isNewProductMode}>
                <FileText className="w-4 h-4 mr-2"/> Enter Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="files" className="mt-0">
              {/* File Upload Area */}
              <div 
                className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${
                  (hasActiveUploads || (!selectedProductId && !productName.trim())) 
                    ? 'cursor-not-allowed opacity-50 bg-gray-50' 
                    : 'cursor-pointer hover:border-primary hover:bg-blue-50'
                } ${uploadingFiles.length > 0 ? 'hidden' : ''}`}
                onDrop={!hasActiveUploads && (selectedProductId || productName.trim()) ? handleDrop : undefined}
                onDragOver={!hasActiveUploads && (selectedProductId || productName.trim()) ? handleDragOver : undefined}
                onDragLeave={!hasActiveUploads && (selectedProductId || productName.trim()) ? handleDragLeave : undefined}
                onClick={!hasActiveUploads && (selectedProductId || productName.trim()) ? () => fileInputRef.current?.click() : undefined}
              >
                <div className="space-y-3">
                  <div className="flex justify-center">
                    {isNewProductMode ? (
                      <Sparkles className="w-8 h-8 text-green-500" />
                    ) : (
                      <Brain className="w-8 h-8 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {hasActiveUploads 
                        ? 'Processing Files...' 
                        : (!selectedProductId && !productName.trim())
                          ? 'Select Product First'
                        : isNewProductMode 
                          ? 'Upload Product Documentation'
                          : 'Upload Additional Documentation'
                      }
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {(!selectedProductId && !productName.trim())
                        ? 'Please select an existing product or enter a new product name to enable file uploads'
                        : 'Drop files here or click to select PDF, DOCX, TXT files (max 10MB each)'
                      }
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    disabled={hasActiveUploads || (!selectedProductId && !productName.trim())}
                    type="button"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {hasActiveUploads 
                      ? 'Processing...' 
                      : (!selectedProductId && !productName.trim())
                        ? 'Select Product First'
                        : 'Select Files'
                    }
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  disabled={hasActiveUploads || (!selectedProductId && !productName.trim())}
                />
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Selected Files</h3>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                        <div className="flex items-center space-x-3 flex-1">
                          <i className={getFileIcon(file)}></i>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSelectedFile(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="text" className="mt-0">
              <div className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="update-text">Knowledge Base Text Update</Label>
                      <Textarea 
                          id="update-text"
                          placeholder="Enter the information you want to add to the product knowledge base..."
                          className="min-h-[200px] font-mono text-sm"
                          value={textUpdateContent}
                          onChange={(e) => setTextUpdateContent(e.target.value)}
                          disabled={hasActiveUploads || !selectedProductId}
                      />
                      <p className="text-xs text-gray-500">
                          {!selectedProductId 
                              ? "Please select a product above to enable text updates." 
                              : "This text will be processed and added to the AI's knowledge about the selected product."}
                      </p>
                  </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Upload Queue */}
          {uploadingFiles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-medium text-gray-900">Processing Queue</h3>
                {hasActiveUploads && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {uploadingFiles.map((uploadingFile) => {
                  const timeRemaining = getEstimatedTimeRemaining(uploadingFile);
                  
                  return (
                    <div key={uploadingFile.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      uploadingFile.status === 'uploading' || uploadingFile.status === 'processing'
                        ? 'bg-blue-50 border-blue-200'
                        : uploadingFile.status === 'complete'
                          ? uploadingFile.isNewProduct
                            ? 'bg-green-50 border-green-200'
                            : 'bg-blue-50 border-blue-200'
                          : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="relative">
                          <i className={getFileIcon(uploadingFile.file)}></i>
                          {(uploadingFile.status === 'uploading' || uploadingFile.status === 'processing') && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                          {uploadingFile.isNewProduct && uploadingFile.status === 'complete' && (
                            <Sparkles className="w-3 h-3 text-green-600 absolute -top-1 -right-1" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{uploadingFile.file.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className={`text-xs font-medium ${getStatusColor(uploadingFile.status)}`}>
                              {getStatusText(uploadingFile.status)}
                            </p>
                            {uploadingFile.isNewProduct && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-green-600 font-medium">New Product</span>
                              </>
                            )}
                            {timeRemaining && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-orange-600 flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{timeRemaining}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {uploadingFile.status === 'complete' ? (
                          <div className={`flex items-center space-x-2 ${
                            uploadingFile.isNewProduct ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-xs font-medium">
                              {uploadingFile.isNewProduct ? 'Product Created' : 'Updated'}
                            </span>
                          </div>
                        ) : uploadingFile.status === 'error' ? (
                          <div className="flex items-center space-x-2 text-red-600">
                            <XCircle className="w-5 h-5" />
                            <span className="text-xs font-medium">Error</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="w-20">
                              <Progress value={uploadingFile.progress} className="h-2" />
                            </div>
                            <span className="text-xs text-gray-600 font-medium min-w-[3rem] text-right">
                              {Math.round(uploadingFile.progress)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Summary Progress for Multiple Files */}
          {uploadingFiles.length > 1 && hasActiveUploads && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Overall Progress</span>
                <span className="text-xs text-blue-700">
                  {uploadingFiles.filter(f => f.status === 'complete').length} of {uploadingFiles.length} files complete
                </span>
              </div>
              <Progress 
                value={(uploadingFiles.filter(f => f.status === 'complete').length / uploadingFiles.length) * 100}
                className="h-2"
              />
            </div>
          )}
          </div>
        </div>

        {/* Fixed Action Buttons Footer */}
        <div className="flex-shrink-0 border-t bg-white dark:bg-gray-950 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={hasActiveUploads}
            >
              {hasActiveUploads ? 'Processing...' : 'Cancel'}
            </Button>
            <Button
              onClick={startUpdate}
              disabled={
                (activeTab === 'files' && (
                  selectedFiles.length === 0 || 
                  (!selectedProductId && !productName.trim())
                )) ||
                (activeTab === 'text' && (
                  !selectedProductId || 
                  !textUpdateContent.trim()
                )) ||
                hasActiveUploads ||
                updateProductMutation.isPending ||
                createProductMutation.isPending ||
                updateKnowledgeBaseMutation.isPending
              }
              className={`flex items-center gap-2 ${
                isNewProductMode 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {updateProductMutation.isPending || createProductMutation.isPending || updateKnowledgeBaseMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isNewProductMode ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  {isNewProductMode ? <Sparkles className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                  {isNewProductMode ? 'Create Product' : 'Update AI Knowledge'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}