import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProductNameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ProductNameInput: React.FC<ProductNameInputProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div>
      <Label htmlFor="product-name">Product Name</Label>
      <Input
        id="product-name"
        type="text"
        placeholder="Enter product name (e.g., Ultimate Car Back Rest Cushion)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
        disabled={disabled}
      />
      <p className="text-xs text-gray-500 mt-1">
        This will be used as the product identifier in the system
      </p>
    </div>
  );
};

export default ProductNameInput;