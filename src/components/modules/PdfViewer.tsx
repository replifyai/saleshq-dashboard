'use client'

import { useState, useEffect } from 'react';
import { moduleApi, type ModuleFile } from '@/lib/moduleApi';
import { useToast } from '@/hooks/use-toast';

interface PdfViewerProps {
  file: ModuleFile;
}

export default function PdfViewer({ file }: PdfViewerProps) {
  const { toast } = useToast();
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPdf();
  }, [file]);

  const loadPdf = async () => {
    try {
      setLoading(true);
      if (file.url) {
        // For now, we'll use an iframe to display the PDF
        // In production, you might want to use a library like react-pdf
        const url = await moduleApi.getPdfUrl(file.url);
        setPdfUrl(url);
      }
    } catch (error) {
      toast({
        title: "Error loading PDF",
        description: error instanceof Error ? error.message : "Failed to load PDF",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };




  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div id="pdf-viewer-container" className="flex flex-col h-full">

      {/* PDF Display */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title={file.name}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">PDF preview not available</p>
          </div>
        )}
      </div>
    </div>
  );
}