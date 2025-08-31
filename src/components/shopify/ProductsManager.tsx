'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Package, AlertCircle } from 'lucide-react';
import { shopify } from '@/lib/shopifyApi';
import { ShopifyProduct, ShopifyProductRequest } from '@/types/shopify';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import ProductDetails from './ProductDetails';
import SearchAndFilters from './SearchAndFilters';

interface ProductsManagerProps {
  onProductSelect?: (product: ShopifyProduct) => void;
}

export default function ProductsManager({ onProductSelect }: ProductsManagerProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
  const [formData, setFormData] = useState<Partial<ShopifyProductRequest>>({
    title: '',
    bodyHtml: '',
    vendor: '',
    productType: '',
    tags: [],
    status: 'draft'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await shopify.getProducts({ limit: 50 });
      setProducts(productsData);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (!formData.title) {
        setError('Product title is required');
        return;
      }

      const productData: ShopifyProductRequest = {
        title: formData.title,
        bodyHtml: formData.bodyHtml || '',
        vendor: formData.vendor || '',
        productType: formData.productType || '',
        tags: formData.tags || [],
        status: formData.status as 'draft' | 'active' | 'archived' || 'draft'
      };

      await shopify.createProduct(productData);
      setShowCreateDialog(false);
      setFormData({
        title: '',
        bodyHtml: '',
        vendor: '',
        productType: '',
        tags: [],
        status: 'draft'
      });
      loadProducts();
    } catch (err) {
      console.error('Failed to create product:', err);
      setError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const handleUpdateProduct = async () => {
    try {
      if (!selectedProduct?.id || !formData.title) {
        setError('Product ID and title are required');
        return;
      }

      const updateData: Partial<ShopifyProductRequest> = {
        title: formData.title,
        bodyHtml: formData.bodyHtml || '',
        vendor: formData.vendor || '',
        productType: formData.productType || '',
        tags: formData.tags || [],
        status: formData.status as 'draft' | 'active' | 'archived' || 'draft'
      };

      await shopify.updateProduct(selectedProduct.id.toString(), updateData);
      setShowEditDialog(false);
      setSelectedProduct(null);
      setFormData({
        title: '',
        bodyHtml: '',
        vendor: '',
        productType: '',
        tags: [],
        status: 'draft'
      });
      loadProducts();
    } catch (err) {
      console.error('Failed to update product:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await shopify.deleteProduct(productId);
        loadProducts();
      } catch (err) {
        console.error('Failed to delete product:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete product');
      }
    }
  };

  const handleEdit = (product: ShopifyProduct) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      bodyHtml: product.description || '',
      vendor: product.vendor || '',
      productType: product.productType || '',
      tags: product.tags || [],
      status: product.status
    });
    setShowEditDialog(true);
  };

  const handleView = (product: ShopifyProduct) => {
    setSelectedProduct(product);
    setShowViewDialog(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.productType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">Manage your store's product catalog</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <p className="font-medium">Error: {error}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setError(null)}
              className="mt-2"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onRefresh={loadProducts}
      />

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDeleteProduct(product.id.toString())}
              onView={() => handleView(product)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Product Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your store catalog
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateProduct}
            submitLabel="Create Product"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information and details
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateProduct}
            submitLabel="Update Product"
          />
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              View complete product information
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && <ProductDetails product={selectedProduct} />}
        </DialogContent>
      </Dialog>
    </div>
  );
} 