'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Package, AlertCircle, Search, Filter, ChevronLeft, ChevronRight, RefreshCw, Eye, Edit, Trash2 } from 'lucide-react';
import { shopify } from '@/lib/shopifyApi';
import { ShopifyProduct, ShopifyProductRequest, ShopifyProductsResponse, ShopifyProductFilters } from '@/types/shopify';
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [previousCursor, setPreviousCursor] = useState<string | null>(null);
  
  // Advanced filter state
  const [productTypeFilter, setProductTypeFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  // Reload products when page size changes
  useEffect(() => {
    if (currentPage === 1) {
      loadProducts(undefined, true);
    }
  }, [pageSize]);

  // Build filter object from current state
  const buildFilters = (cursor?: string): ShopifyProductFilters => {
    const filters: ShopifyProductFilters = {
      limit: pageSize,
      cursor: cursor,
    };

    if (searchTerm) filters.searchTerm = searchTerm;
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (productTypeFilter) filters.productType = productTypeFilter;
    if (vendorFilter) filters.vendor = vendorFilter;
    if (dateFrom) filters.createdAtAfter = dateFrom;
    if (dateTo) filters.createdAtBefore = dateTo;

    return filters;
  };

  const loadProducts = async (cursor?: string, resetPage = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = buildFilters(cursor);
      const productsResponse = await shopify.getProductsWithPagination(filters);
      
      setProducts(productsResponse.products);
      setHasNextPage(productsResponse.hasNextPage);
      setHasPreviousPage(productsResponse.hasPreviousPage);
      
      if (productsResponse.pageInfo) {
        setNextCursor(productsResponse.pageInfo.endCursor || null);
        setPreviousCursor(productsResponse.pageInfo.startCursor || null);
      }
      
      if (resetPage) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && nextCursor) {
      setCurrentPage(currentPage + 1);
      loadProducts(nextCursor, false);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage && previousCursor) {
      setCurrentPage(currentPage - 1);
      loadProducts(undefined, false); // For previous, we start fresh for simplicity
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadProducts(undefined, true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setProductTypeFilter('');
    setVendorFilter('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
    loadProducts(undefined, true);
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

  // Products are already filtered at the API level
  const filteredProducts = products;

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
          <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600 text-sm">Manage your store's product catalog</p>
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
      <Card className="mb-2">
        <CardContent className="pt-4 space-y-4">
          {/* Main Filter Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by title, vendor, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? 'Hide' : 'Advanced'}
              </Button>
              <Button variant="outline" onClick={handleSearch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                <Input
                  placeholder="e.g. Electronics"
                  value={productTypeFilter}
                  onChange={(e) => setProductTypeFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                <Input
                  placeholder="e.g. Apple"
                  value={vendorFilter}
                  onChange={(e) => setVendorFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex gap-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table - Compact Layout */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-2">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-gray-50 border-b sticky top-0 z-10">
                    <tr>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-32">Product</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-20 hidden sm:table-cell">Type</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-20 hidden md:table-cell">Vendor</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-16">Status</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-20 hidden lg:table-cell">Inventory</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-20">Price</th>
                      <th className="text-center py-2 px-2 text-xs font-medium text-gray-700 w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        index={index}
                        onEdit={() => handleEdit(product)}
                        onDelete={() => handleDeleteProduct(product.id.toString())}
                        onView={() => handleView(product)}
                        onSelect={() => onProductSelect?.(product)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Pagination Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Showing {filteredProducts.length} products</span>
                  <span>•</span>
                  <span>Page {currentPage}</span>
                  {pageSize && (
                    <>
                      <span>•</span>
                      <span>{pageSize} per page</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={!hasPreviousPage || loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!hasNextPage || loading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || productTypeFilter || vendorFilter || dateFrom || dateTo
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'
                }
              </p>
              {(searchTerm || statusFilter !== 'all' || productTypeFilter || vendorFilter || dateFrom || dateTo) && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
              {!searchTerm && statusFilter === 'all' && !productTypeFilter && !vendorFilter && !dateFrom && !dateTo && (
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

function ProductRow({ 
  product, 
  index,
  onEdit, 
  onDelete,
  onView,
  onSelect
}: {
  product: ShopifyProduct;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  onSelect: () => void;
}) {
  const isEven = index % 2 === 0;
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'destructive';
      default: return 'outline';
    }
  };

  const getPrice = () => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => parseFloat(String(v.price || '0'))).filter(p => p > 0);
      if (prices.length === 0) return 'Free';
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) {
        return `₹${minPrice.toFixed(2)}`;
      }
      return `₹${minPrice.toFixed(2)} - ₹${maxPrice.toFixed(2)}`;
    }
    return 'N/A';
  };

  const getInventory = () => {
    if (product.variants && product.variants.length > 0) {
      const totalInventory = product.variants.reduce((sum, variant) => 
        sum + (variant.inventoryQuantity || 0), 0);
      return totalInventory.toString();
    }
    return product.totalInventory?.toString() || '0';
  };

  return (
    <tr className={`border-b hover:bg-gray-50 transition-colors ${isEven ? 'bg-white' : 'bg-gray-25'}`}>
      {/* Product Column */}
      <td className="p-2">
        <div className="flex items-center gap-2">
          {product.images && product.images.length > 0 && product.images[0]?.src ? (
            <img 
              src={product.images[0].src} 
              alt={product.title}
              className="w-8 h-8 object-cover rounded border"
            />
          ) : (
            <Package className="h-6 w-6 text-gray-400" />
          )}
          <div>
            <span className="font-medium text-sm truncate block max-w-32" title={product.title}>
              {product.title}
            </span>
            {/* Mobile: Show additional info */}
            <div className="sm:hidden text-xs text-gray-500 mt-1">
              <div>{product.productType || 'No type'}</div>
              <div className="md:hidden">{product.vendor || 'No vendor'}</div>
            </div>
          </div>
        </div>
      </td>

      {/* Type Column - Hidden on mobile */}
      <td className="p-2 hidden sm:table-cell">
        <span className="text-sm text-gray-600 truncate block max-w-20" title={product.productType}>
          {product.productType || 'No type'}
        </span>
      </td>

      {/* Vendor Column - Hidden on small screens */}
      <td className="p-2 hidden md:table-cell">
        <span className="text-sm text-gray-600 truncate block max-w-20" title={product.vendor}>
          {product.vendor || 'No vendor'}
        </span>
      </td>

      {/* Status Column */}
      <td className="p-2">
        <Badge variant={getStatusColor(product.status) as any} className="text-xs px-1 py-0">
          {product.status}
        </Badge>
        {/* Mobile: Show inventory info */}
        <div className="lg:hidden text-xs text-gray-500 mt-1">
          {getInventory()} in stock
        </div>
      </td>

      {/* Inventory Column - Hidden on medium and smaller screens */}
      <td className="p-2 hidden lg:table-cell">
        <span className="text-sm text-gray-600">
          {getInventory()}
        </span>
      </td>

      {/* Price Column */}
      <td className="p-2">
        <span className="font-medium text-sm">
          {getPrice()}
        </span>
      </td>

      {/* Actions Column */}
      <td className="p-2">
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm" onClick={onView} className="h-6 w-6 p-0">
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit} className="h-6 w-6 p-0 hidden sm:inline-flex">
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="h-6 w-6 p-0 hidden md:inline-flex text-red-600 hover:text-red-700">
            <Trash2 className="h-3 w-3" />
          </Button>
          {onSelect && (
            <Button variant="ghost" size="sm" onClick={onSelect} className="h-6 px-1 text-xs hidden lg:inline-flex">
              Select
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
} 