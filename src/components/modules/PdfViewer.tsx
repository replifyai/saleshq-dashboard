'use client'

import { useState, useEffect, useRef } from 'react';
import { moduleApi, type ModuleFile } from '@/lib/moduleApi';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Minimize2,
  RefreshCw,
  FileText
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PdfViewerProps {
  file: ModuleFile;
}

export default function PdfViewer({ file }: PdfViewerProps) {
  const { toast } = useToast();
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadPdf();
  }, [file]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const loadPdf = async () => {
    try {
      setLoading(true);
      setError(false);
      setZoom(100); // Reset zoom when loading new PDF
      if (file.url) {
        const url = await moduleApi.getPdfUrl(file.url);
        setPdfUrl(url);
      }
    } catch (err) {
      setError(true);
      toast({
        title: "Error loading PDF",
        description: err instanceof Error ? err.message : "Failed to load PDF",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-gray-50 dark:bg-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent absolute inset-0"></div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading PDF...</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{file.name}</p>
        </div>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-gray-50 dark:bg-gray-900">
        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            PDF preview not available
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            The document could not be loaded. Try refreshing.
          </p>
        </div>
        <Button variant="outline" onClick={loadPdf} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      id="pdf-viewer-container" 
      className={`flex flex-col bg-gray-100 dark:bg-gray-900 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 h-screen w-screen' 
          : 'h-full'
      }`}
    >
      {/* Custom Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
        {/* Left: File name */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {file.name}
          </span>
        </div>

        {/* Center: Zoom Controls */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <button
            onClick={handleResetZoom}
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors min-w-[60px]"
          >
            {zoom}%
          </button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
        </div>

        {/* Right: Fullscreen */}
        <div className="flex items-center gap-1 flex-1 justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreen}
                className="h-8 w-8 p-0"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* PDF Display Area */}
      <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-950 p-4 min-h-0">
        <div 
          className="mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
          style={{
            width: `${zoom}%`,
            maxWidth: '100%',
            transition: 'width 0.2s ease-in-out',
            height: '100%',
          }}
        >
          <iframe
            ref={iframeRef}
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full border-0"
            style={{
              height: '100%',
              minHeight: isFullscreen ? 'calc(100vh - 80px)' : '600px',
            }}
            title={file.name}
            aria-label={file.name}
          />
        </div>
      </div>

      {/* Keyboard shortcuts hint (shown in fullscreen) */}
      {isFullscreen && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
          Press <kbd className="px-1.5 py-0.5 bg-white/20 rounded mx-1">Esc</kbd> to exit fullscreen
        </div>
      )}
    </div>
  );
}
