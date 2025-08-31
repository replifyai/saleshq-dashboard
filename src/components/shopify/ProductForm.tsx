'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon } from 'lucide-react';
import { ShopifyProductRequest } from '@/types/shopify';

interface ProductFormProps {
  formData: Partial<ShopifyProductRequest>;
  setFormData: (data: Partial<ShopifyProductRequest>) => void;
  onSubmit: () => void;
  submitLabel: string;
}

export default function ProductForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  submitLabel 
}: ProductFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Product Title *</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter product title"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vendor">Vendor</Label>
          <Input
            id="vendor"
            value={formData.vendor || ''}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            placeholder="Enter vendor name"
          />
        </div>
        <div>
          <Label htmlFor="productType">Product Type</Label>
          <Input
            id="productType"
            value={formData.productType || ''}
            onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
            placeholder="Enter product type"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            tags: e.target.value ? e.target.value.split(',').map(tag => tag.trim()) : [] 
          })}
          placeholder="Enter tags separated by commas"
        />
      </div>

      <div>
        <Label htmlFor="bodyHtml">Description</Label>
        <Textarea
          id="bodyHtml"
          value={formData.bodyHtml || ''}
          onChange={(e) => setFormData({ ...formData, bodyHtml: e.target.value })}
          placeholder="Enter product description"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="images">Product Images</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop images here, or click to select files
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: JPG, PNG, GIF. Max file size: 5MB
          </p>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            className="mt-2"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              // Note: In a real implementation, you'd upload these to Shopify
              // For now, we'll just show a message
              console.log('Images selected:', files);
            }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setFormData({})}>
          Reset
        </Button>
        <Button onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
} 