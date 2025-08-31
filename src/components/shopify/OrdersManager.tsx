'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Eye, AlertCircle, Package, User, Calendar, DollarSign, Plus, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { shopify } from '@/lib/shopifyApi';
import { ShopifyOrder, ShopifyOrdersResponse, ShopifyOrderFilters } from '@/types/shopify';
import OrderCreator from './OrderCreator';

export default function OrdersManager() {
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [financialStatusFilter, setFinancialStatusFilter] = useState<string>('all');
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ShopifyOrder | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalOrders, setTotalOrders] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [previousCursor, setPreviousCursor] = useState<string | null>(null);
  
  // Advanced filter state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  // Reload orders when page size changes
  useEffect(() => {
    if (currentPage === 1) {
      loadOrders(undefined, true);
    }
  }, [pageSize]);

  // Build filter object from current state
  const buildFilters = (cursor?: string): ShopifyOrderFilters => {
    const filters: ShopifyOrderFilters = {
      limit: pageSize,
      cursor: cursor,
    };

    if (searchTerm) filters.searchTerm = searchTerm;
    if (statusFilter !== 'all') filters.fulfillmentStatus = statusFilter;
    if (financialStatusFilter !== 'all') filters.financialStatus = financialStatusFilter;
    if (dateFrom) filters.createdAtAfter = dateFrom;
    if (dateTo) filters.createdAtBefore = dateTo;
    if (minAmount) filters.totalPriceMin = parseFloat(minAmount);
    if (maxAmount) filters.totalPriceMax = parseFloat(maxAmount);

    return filters;
  };

  const loadOrders = async (cursor?: string, resetPage = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = buildFilters(cursor);
      const ordersResponse = await shopify.getOrdersWithPagination(filters);
      
      setOrders(ordersResponse.orders);
      setHasNextPage(ordersResponse.hasNextPage);
      setHasPreviousPage(ordersResponse.hasPreviousPage);
      
      if (ordersResponse.pageInfo) {
        setNextCursor(ordersResponse.pageInfo.endCursor || null);
        setPreviousCursor(ordersResponse.pageInfo.startCursor || null);
      }
      
      if (resetPage) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && nextCursor) {
      setCurrentPage(currentPage + 1);
      loadOrders(nextCursor, false);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage && previousCursor) {
      setCurrentPage(currentPage - 1);
      loadOrders(undefined, false); // For previous, we start fresh for simplicity
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadOrders(undefined, true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFinancialStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setMinAmount('');
    setMaxAmount('');
    setCurrentPage(1);
    loadOrders(undefined, true);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      try {
        await shopify.cancelOrder(orderId, 'Cancelled by admin');
        loadOrders();
      } catch (err) {
        console.error('Failed to cancel order:', err);
        setError(err instanceof Error ? err.message : 'Failed to cancel order');
      }
    }
  };

  const handleViewOrder = (order: ShopifyOrder) => {
    setSelectedOrder(order);
    setShowViewDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return 'default';
      case 'partial':
        return 'secondary';
      case 'unfulfilled':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getFinancialStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'refunded':
        return 'destructive';
      case 'partially_refunded':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: string | number, currency: string = 'INR') => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Orders are already filtered at the API level
  const filteredOrders = orders;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600 text-sm">View, manage, and create customer orders</p>
        </div>
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

      {/* Main Tabs */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">View Orders</TabsTrigger>
          <TabsTrigger value="create">Create Order</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4 space-y-6">
          {/* Search and Filters */}
          <Card className="mb-2">
            <CardContent className="pt-4 space-y-4">
              {/* Main Filter Row */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders by number, name, or customer ID..."
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
                      <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                      <SelectItem value="fulfilled">Fulfilled</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={financialStatusFilter} onValueChange={setFinancialStatusFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Financial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount (₹)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount (₹)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
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

          {/* Orders List - Compact Table Style */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-2">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                      <thead className="bg-gray-50 border-b sticky top-0 z-10">
                        <tr>
                          <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-24">Order</th>
                          <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-20 hidden sm:table-cell">Customer</th>
                          <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-20">Date</th>
                          <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-20">Status</th>
                          <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-20 hidden md:table-cell">Financial</th>
                          <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-28 hidden lg:table-cell">Items</th>
                          <th className="text-left py-2 px-2 text-xs font-medium text-gray-700 w-20">Total</th>
                          <th className="text-center py-2 px-2 text-xs font-medium text-gray-700 w-16">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order, index) => (
                          <OrderRow
                            key={order.id}
                            order={order}
                            index={index}
                            onView={() => handleViewOrder(order)}
                            onCancel={() => handleCancelOrder(order.id.toString())}
                            getStatusColor={getStatusColor}
                            getFinancialStatusColor={getFinancialStatusColor}
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
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
                      <span>Showing {filteredOrders.length} orders</span>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter !== 'all' || financialStatusFilter !== 'all' || dateFrom || dateTo || minAmount || maxAmount
                      ? 'Try adjusting your search or filters'
                      : 'No orders have been placed yet'
                    }
                  </p>
                  {(searchTerm || statusFilter !== 'all' || financialStatusFilter !== 'all' || dateFrom || dateTo || minAmount || maxAmount) && (
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <OrderCreator />
        </TabsContent>
      </Tabs>

      {/* View Order Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View complete order information
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetails 
              order={selectedOrder}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderRow({ 
  order, 
  index,
  onView, 
  onCancel,
  getStatusColor,
  getFinancialStatusColor,
  formatCurrency,
  formatDate
}: {
  order: ShopifyOrder;
  index: number;
  onView: () => void;
  onCancel: () => void;
  getStatusColor: (status: string) => string;
  getFinancialStatusColor: (status: string) => string;
  formatCurrency: (amount: string | number, currency?: string) => string;
  formatDate: (dateString: string) => string;
}) {
  const isEven = index % 2 === 0;
  
  return (
    <tr className={`border-b hover:bg-gray-50 transition-colors ${isEven ? 'bg-white' : 'bg-gray-25'}`}>
      {/* Order Column */}
      <td className="p-2">
        <div className="flex items-center gap-1">
          <Package className="h-3 w-3 text-gray-400 hidden sm:block" />
          <span className="font-medium text-sm truncate">#{order.name}</span>
        </div>
        {/* Mobile: Show additional info */}
        <div className="sm:hidden text-xs text-gray-500 mt-1">
          <div>{order.customer?.id ? `${order.customer.id.split('/').pop()}` : 'N/A'}</div>
          <div className="md:hidden">{order.financial_status}</div>
        </div>
      </td>

      {/* Customer Column - Hidden on mobile */}
      <td className="p-2 hidden sm:table-cell">
        <span className="text-sm text-gray-600 truncate">
          {order.customer?.id ? `${order.customer.id.split('/').pop()}` : 'N/A'}
        </span>
      </td>

      {/* Date Column */}
      <td className="p-2">
        <span className="text-sm text-gray-600">
          {new Date(order.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      </td>

      {/* Status Column */}
      <td className="p-2">
        <Badge variant={getStatusColor(order.fulfillment_status || 'unknown') as any} className="text-[10px] uppercase">
          {(order.fulfillment_status || 'unknown')}
        </Badge>
        {/* Mobile: Show items info */}
        <div className="lg:hidden text-xs text-gray-500 mt-1">
          {order.line_items?.length || 0} items
        </div>
      </td>

      {/* Financial Column - Hidden on small screens */}
      <td className="p-2 hidden md:table-cell">
        <Badge variant={getFinancialStatusColor(order.financial_status || 'unknown') as any} className="text-[10px] uppercase">
          {(order.financial_status || 'unknown')}
        </Badge>
      </td>

      {/* Items Column - Hidden on medium and smaller screens */}
      <td className="p-2 hidden lg:table-cell">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">
            {order.line_items?.length || 0}
          </span>
          {order.line_items && order.line_items.length > 0 && (
            <div className="text-xs text-gray-500 truncate max-w-20">
              {order.line_items.slice(0, 1).map((item) => (
                <span key={item.id}>
                  ({item.quantity}x {item.title.split(' ')[0]})
                </span>
              ))}
              {order.line_items.length > 1 && (
                <span className="text-gray-400"> +{order.line_items.length - 1}</span>
              )}
            </div>
          )}
        </div>
      </td>

      {/* Total Column */}
      <td className="p-2">
        <span className="font-medium text-sm">
          {formatCurrency(order.total_price || '0', order.currency)}
        </span>
      </td>

      {/* Actions Column */}
      <td className="p-2">
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm" onClick={onView} className="h-6 w-6 p-0">
            <Eye className="h-3 w-3" />
          </Button>
          {order.fulfillment_status !== 'fulfilled' && (
            <Button variant="ghost" size="sm" onClick={onCancel} className="h-6 px-1 text-xs hidden sm:inline-flex">
              Cancel
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

function OrderDetails({ 
  order, 
  formatCurrency, 
  formatDate 
}: {
  order: ShopifyOrder;
  formatCurrency: (amount: string | number, currency?: string) => string;
  formatDate: (dateString: string) => string;
}) {
  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Order Information</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-600">Order Number</Label>
              <p className="text-gray-900 font-mono">#{order.order_number}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Order Name</Label>
              <p className="text-gray-900">{order.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {order.fulfillment_status || 'unknown'}
                </Badge>
                <Badge variant="outline">
                  {order.financial_status || 'unknown'}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Created</Label>
              <p className="text-gray-900">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Updated</Label>
              <p className="text-gray-900">{formatDate(order.updated_at)}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Customer</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-600">Customer ID</Label>
              <p className="text-gray-900">{order.customer?.id?.split('/').pop() || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Financial Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <Label className="text-sm font-medium text-gray-600">Subtotal</Label>
                                     <p className="text-xl font-bold text-gray-900">
              {formatCurrency(order.subtotal_price || '0', order.currency)}
            </p>
           </div>
           <div className="p-4 border rounded-lg">
             <Label className="text-sm font-medium text-gray-600">Tax</Label>
                         <p className="text-xl font-bold text-gray-900">
              {formatCurrency(order.total_tax || '0', order.currency)}
            </p>
           </div>
           <div className="p-4 border rounded-lg bg-blue-50">
             <Label className="text-sm font-medium text-gray-600">Total</Label>
                         <p className="text-xl font-bold text-blue-900">
              {formatCurrency(order.total_price || '0', order.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      {order.line_items && order.line_items.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.line_items.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name} <span className="text-xs text-gray-500">({item.id?.split('/').pop()})</span></p>
                                         <p className="text-sm text-gray-600">
                       SKU: {item.variant_id?.split('/').pop() || 'No SKU'} | Variant: {item.variant_title || 'Default'}
                     </p>
                    {item.properties && item.properties.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.properties.map((prop, propIndex) => (
                          <Badge key={propIndex} variant="outline" className="text-xs">
                            {prop.name}: {prop.value}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                                     <div className="text-right">
                                         <p className="font-medium">
                      {formatCurrency(item.price || '0', order.currency)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes and Tags */}
      {(order.note || (order.tags && (Array.isArray(order.tags) ? order.tags.length > 0 : order.tags))) && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
          <div className="space-y-3">
            {order.note && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Order Note</Label>
                <p className="text-gray-900">{order.note}</p>
              </div>
            )}
            {order.tags && (Array.isArray(order.tags) ? order.tags.length > 0 : order.tags) && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(order.tags) ? order.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  )) : (
                    <Badge variant="outline">
                      {order.tags}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for labels
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`block text-sm font-medium text-gray-600 ${className || ''}`}>
      {children}
    </label>
  );
} 