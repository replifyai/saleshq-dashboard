'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Eye, AlertCircle, Package, User, Calendar, DollarSign, Plus } from 'lucide-react';
import { shopify } from '@/lib/shopifyApi';
import { ShopifyOrder } from '@/types/shopify';
import OrderCreator from './OrderCreator';

export default function OrdersManager() {
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  console.log("🚀 ~ OrdersManager ~ orders:", orders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [financialStatusFilter, setFinancialStatusFilter] = useState<string>('all');
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ShopifyOrder | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await shopify.getOrders({ limit: 50 });
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number?.toString().includes(searchTerm) ||
      (order.customer?.id && order.customer.id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.fulfillment_status === statusFilter;
    const matchesFinancialStatus = financialStatusFilter === 'all' || order.financial_status === financialStatusFilter;
    
    return matchesSearch && matchesStatus && matchesFinancialStatus;
  });

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
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600">View, manage, and create customer orders</p>
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

        <TabsContent value="orders" className="mt-6 space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders by number, name, or customer ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                  <Button variant="outline" onClick={loadOrders}>
                    <Filter className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={() => handleViewOrder(order)}
                  onCancel={() => handleCancelOrder(order.id.toString())}
                  getStatusColor={getStatusColor}
                  getFinancialStatusColor={getFinancialStatusColor}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter !== 'all' || financialStatusFilter !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'No orders have been placed yet'
                    }
                  </p>
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

function OrderCard({ 
  order, 
  onView, 
  onCancel,
  getStatusColor,
  getFinancialStatusColor,
  formatCurrency,
  formatDate
}: {
  order: ShopifyOrder;
  onView: () => void;
  onCancel: () => void;
  getStatusColor: (status: string) => string;
  getFinancialStatusColor: (status: string) => string;
  formatCurrency: (amount: string | number, currency?: string) => string;
  formatDate: (dateString: string) => string;
}) {
  console.log("🚀 ~ OrderCard ~ order:", order);
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="font-medium">#{order.name}</span>
            </div>
                         <Badge variant={getStatusColor(order.fulfillment_status || 'unknown') as any}>
               {order.fulfillment_status || 'unknown'}
             </Badge>
             <Badge variant={getFinancialStatusColor(order.financial_status || 'unknown') as any}>
               {order.financial_status || 'unknown'}
             </Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
                         {order.fulfillment_status !== 'fulfilled' && (
               <Button variant="ghost" size="sm" onClick={onCancel}>
                 Cancel
               </Button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-3 w-3" />
            <span>
              {order.customer?.id ? `Customer: ${order.customer.id.split('/').pop()}` : 'Customer: N/A'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(order.created_at)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-3 w-3" />
                                     <span className="font-medium">
              {formatCurrency(order.total_price || '0', order.currency)}
            </span>
          </div>
        </div>

        {order.line_items && order.line_items.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-gray-600 mb-2">
              {order.line_items.length} item{order.line_items.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-1">
              {order.line_items.slice(0, 3).map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item.quantity}x {item.title}
                </Badge>
              ))}
              {order.line_items.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{order.line_items.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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