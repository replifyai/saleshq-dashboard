'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import ProductsManager from '@/components/shopify/ProductsManager';
import OrdersManager from '@/components/shopify/OrdersManager';
import ShopifyChatbot from '@/components/shopify/ShopifyChatbot';
import { shopify } from '@/lib/shopifyApi';
import { ShopifyStoreStats, ShopifyProduct, ShopifyOrder } from '@/types/shopify';

export default function ShopifyPage() {
  const [stats, setStats] = useState<ShopifyStoreStats | null>(null);
  console.log("🚀 ~ ShopifyPage ~ stats:", stats);
  const [recentProducts, setRecentProducts] = useState<ShopifyProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<ShopifyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadShopifyData();
  }, []);

  const loadShopifyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load data in parallel
      const [storeStats, products, orders] = await Promise.all([
        shopify.getStoreStats(),
        shopify.getProducts({ limit: 5 }),
        shopify.getOrders({ limit: 5 })
      ]);

      setStats(storeStats);
      setRecentProducts(products);
      setRecentOrders(orders);
    } catch (err) {
      console.error('Failed to load Shopify data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load Shopify data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading Shopify data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Error Loading Shopify Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="space-y-2 text-sm text-red-600">
              <p>Please check:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Your Shopify shop domain is correctly configured</li>
                <li>Your access token is valid and has the required permissions</li>
                <li>Your Shopify store is accessible</li>
              </ul>
            </div>
            <Button
              onClick={loadShopifyData}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopify Store Management</h1>
        <p className="text-gray-600">Manage your products, orders, customers, and store analytics</p>
      </div>
      {/* Main Management Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    Active products in your store
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Orders placed by customers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered customers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime revenue
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Recent Products
                </CardTitle>
                <CardDescription>Latest products added to your store</CardDescription>
              </CardHeader>
              <CardContent>
                {recentProducts.length > 0 ? (
                  <div className="space-y-3">
                    {recentProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 && (
                            <img
                              src={product.images[0].src}
                              alt={product.title}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product.title}</p>
                            <p className="text-sm text-gray-500">{product.productType}</p>
                          </div>
                        </div>
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No products found</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Latest orders from your customers</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="p-3 border rounded-lg">
                        <details>
                          <summary className="flex items-center justify-between cursor-pointer">
                            <div>
                              <p className="font-medium">#{order.order_number}</p>
                              <p className="text-xs text-gray-500">Customer ID: {order.customer?.id || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatCurrency(parseFloat(order.total_price || '0'))}
                              </p>
                              <Badge variant={order.financial_status === 'paid' ? 'default' : 'secondary'}>
                                {order.financial_status}
                              </Badge>
                            </div>
                          </summary>
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
                            <div>
                              <p className="text-gray-500">Subtotal</p>
                              <p className="font-medium">{formatCurrency(parseFloat(order.subtotal_price || '0'))}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Tax</p>
                              <p className="font-medium">{formatCurrency(parseFloat(order.total_tax || '0'))}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total</p>
                              <p className="font-medium">{formatCurrency(parseFloat(order.total_price || '0'))}</p>
                            </div>
                          </div>
                          {order.line_items?.length > 0 && (
                            <div className="mt-3 border-t pt-3">
                              <p className="text-sm text-gray-600 mb-2">Items</p>
                              <div className="space-y-1">
                                {order.line_items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-sm">
                                    <span>{item.quantity}x {item.title}</span>
                                    <span className="text-gray-600">{formatCurrency(parseFloat(item.price || '0'))}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </details>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No orders found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <ProductsManager />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <OrdersManager />
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                Manage your customer database, view customer details, and track customer relationships.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Customer management features will be implemented here. This will include:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>Customer search and filtering</li>
                <li>Customer profile management</li>
                <li>Order history per customer</li>
                <li>Customer segmentation</li>
                <li>Marketing preferences</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reporting</CardTitle>
              <CardDescription>
                View detailed analytics about your store performance, sales trends, and customer behavior.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Analytics features will be implemented here. This will include:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>Sales performance metrics</li>
                <li>Product performance analysis</li>
                <li>Customer behavior insights</li>
                <li>Inventory turnover rates</li>
                <li>Revenue forecasting</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Shopify Chatbot */}
      <div className="mt-8">
        <ShopifyChatbot />
      </div>
    </div>
  );
} 