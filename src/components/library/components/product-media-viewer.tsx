import ProductImageViewer from '@/components/chat-interface/components/product-image-viewer';
import ProductVideoViewer from '@/components/chat-interface/components/product-video-viewer';
import type { Product } from '@/lib/apiUtils';

interface ProductMediaViewerProps {
  product: Product;
  trigger?: React.ReactNode;
  initialMediaType?: 'image' | 'video';
}

export default function ProductMediaViewer({ product, trigger, initialMediaType = 'image' }: ProductMediaViewerProps) {
  const basic = { id: product.id, name: product.name } as any;
  if (initialMediaType === 'video') {
    return <ProductVideoViewer product={basic} trigger={trigger} />;
  }
  return <ProductImageViewer product={basic} trigger={trigger} />;
}