import React from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Video } from 'lucide-react';

interface MediaButtonProps {
  type: 'image' | 'video';
  count: number;
  onClick?: () => void;
  size?: 'sm' | 'default';
  showLabel?: boolean;
}

export const MediaButton: React.FC<MediaButtonProps> = ({ 
  type, 
  count, 
  onClick,
  size = 'sm',
  showLabel = true
}) => {
  const isImage = type === 'image';
  const Icon = isImage ? ImageIcon : Video;
  
  const colorClasses = isImage
    ? "bg-blue-50 hover:bg-blue-100 hover:text-blue-700 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 dark:text-blue-300 dark:hover:text-blue-200 dark:border-blue-900"
    : "bg-purple-50 hover:bg-purple-100 hover:text-purple-700 border-purple-200 text-purple-700 dark:bg-purple-950/20 dark:hover:bg-purple-900/30 dark:text-purple-300 dark:hover:text-purple-200 dark:border-purple-900";

  const label = showLabel 
    ? ` ${type === 'image' ? 'Image' : 'Video'}${count > 1 ? 's' : ''}`
    : '';

  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      className={`h-6 px-2 text-xs ${colorClasses}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {count}{label}
    </Button>
  );
};

export default MediaButton;