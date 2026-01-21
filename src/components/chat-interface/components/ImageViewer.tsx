'use client'
import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface ImageViewerProps {
  images: string[];
  open: boolean;
  index: number;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ images, open, index, onClose }) => {
  if (!images || images.length === 0) {
    return null;
  }

  const slides = images.map((url) => ({
    src: url,
    alt: 'Chat image',
  }));

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      carousel={{
        finite: images.length <= 1,
      }}
      render={{
        buttonPrev: images.length <= 1 ? () => null : undefined,
        buttonNext: images.length <= 1 ? () => null : undefined,
      }}
    />
  );
};

export default ImageViewer;
