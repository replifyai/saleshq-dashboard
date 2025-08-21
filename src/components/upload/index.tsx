'use client'
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { documentApi } from "@/lib/apiUtils";
import { useToast } from "@/hooks/use-toast";
import { 
  ProductNameInput,
  FileDropzone,
  SelectedFilesList,
  UploadQueue,
  OverallProgress
} from "./components";
import { UploadWarning } from "./atoms";
import {
  isValidFileType,
  isValidFileSize,
  hasActiveUploads,
  generateFileId,
  type UploadingFile,
  type SelectedFile
} from "./utils/uploadUtils";



export default function DocumentUpload() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [productName, setProductName] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Calculate if there are active uploads
  const hasActiveFiles = hasActiveUploads(uploadingFiles);

  // Progress simulation for better UX
  useEffect(() => {
    if (!hasActiveFiles) return;

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
  }, [hasActiveFiles]);

  // Warn user before leaving during upload
  useEffect(() => {
    if (!hasActiveFiles) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasActiveFiles]);

  const uploadMutation = useMutation({
    mutationFn: ({ file, name }: { file: File; name: string }) => documentApi.uploadFile(file, name),
    onSuccess: (data, { file }) => {
      setUploadingFiles(prev => prev.map(f => 
        f.file === file 
          ? { ...f, status: 'complete', progress: 100, documentId: data.productId }
          : f
      ));
      
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });

      toast({
        title: "Product created successfully",
        description: `${data.productName} has been created`,
      });
    },
    onError: (error: Error, { file }) => {
      setUploadingFiles(prev => prev.map(f => 
        f.file === file 
          ? { ...f, status: 'error', progress: 0 }
          : f
      ));

      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    // Check if product name is provided
    if (!productName.trim()) {
      toast({
        title: "Product name required",
        description: "Please enter a product name before uploading files.",
        variant: "destructive",
      });
      return;
    }

    const validFiles: SelectedFile[] = [];

    Array.from(files).forEach(file => {
      if (!isValidFileType(file)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type. Only PDF, DOCX, and TXT files are allowed.`,
          variant: "destructive",
        });
        return;
      }

      if (!isValidFileSize(file)) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          variant: "destructive",
        });
        return;
      }

      // Check if file is already selected
      const isAlreadySelected = selectedFiles.some(sf => sf.file.name === file.name && sf.file.size === file.size);
      const isAlreadyUploading = uploadingFiles.some(uf => uf.file.name === file.name && uf.file.size === file.size);
      
      if (isAlreadySelected || isAlreadyUploading) {
        toast({
          title: "File already selected",
          description: `${file.name} is already in the queue.`,
          variant: "destructive",
        });
        return;
      }

      validFiles.push({
        id: generateFileId(),
        file,
      });
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeSelectedFile = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const startUpload = () => {
    if (selectedFiles.length === 0) return;

    // Move selected files to uploading state
    const uploadingFilesData: UploadingFile[] = selectedFiles.map(sf => ({
      id: sf.id,
      file: sf.file,
      status: 'uploading' as const,
      progress: 0,
      startTime: Date.now(),
    }));

    setUploadingFiles(prev => [...prev, ...uploadingFilesData]);
    
    // Start uploading each file
    selectedFiles.forEach(selectedFile => {
      uploadMutation.mutate({ file: selectedFile.file, name: productName });
    });

    // Clear selected files and product name
    setSelectedFiles([]);
    setProductName("");
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <UploadWarning show={hasActiveFiles} />

        <ProductNameInput
          value={productName}
          onChange={setProductName}
          disabled={hasActiveFiles}
        />

        <FileDropzone
          onFileSelect={handleFileSelect}
          hasActiveUploads={hasActiveFiles}
          productName={productName}
        />

        <SelectedFilesList
          files={selectedFiles}
          onRemoveFile={removeSelectedFile}
          onStartUpload={startUpload}
          hasActiveUploads={hasActiveFiles}
        />

        <UploadQueue
          files={uploadingFiles}
          hasActiveUploads={hasActiveFiles}
        />

        <OverallProgress
          files={uploadingFiles}
          hasActiveUploads={hasActiveFiles}
        />
      </CardContent>
    </Card>
  );
}
