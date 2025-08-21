import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface UploadWarningProps {
  show: boolean;
}

export const UploadWarning: React.FC<UploadWarningProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-800 mb-1">
            Upload in Progress - Please Stay on This Page
          </h3>
          <p className="text-sm text-amber-700 mb-2">
            Files are being processed and may take 30 seconds to 2 minutes. 
            Leaving this page will interrupt the upload process.
          </p>
          <div className="flex items-center space-x-2 text-xs text-amber-600">
            <Clock className="w-4 h-4" />
            <span>Upload typically completes within 2 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadWarning;