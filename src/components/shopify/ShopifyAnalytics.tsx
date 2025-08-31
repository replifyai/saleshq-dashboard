'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  Calendar,
  RefreshCw,
  AlertCircle,
  BarChart3,
  Globe,
  Filter
} from 'lucide-react';
import { shopify } from '@/lib/shopifyApi';
import { ShopifyAnalyticsResponse, ShopifyAnalyticsFilters, ShopifyAnalyticsMetric } from '@/types/shopify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

interface AnalyticsCardProps {
  title: string;
  metric: ShopifyAnalyticsMetric;
  icon: React.ReactNode;
  formatValue?: (value: number) => string;
}

function AnalyticsCard({ title, metric, icon, formatValue = (v) => v.toString() }: AnalyticsCardProps) {
  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">{formatValue(metric.current)}</div>
          <div className="text-xs text-gray-500">
            {metric.change > 0 ? '+' : ''}{formatValue(metric.change)} from previous period
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ShopifyAnalytics() {
  const [analytics, setAnalytics] = useState<ShopifyAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: ShopifyAnalyticsFilters = {
        dateFrom,
        dateTo,
        period
      };
      
      const analyticsData = await shopify.getAnalytics(filters);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <p className="font-medium">Error: {error}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadAnalytics}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
            <p className="text-gray-600">Analytics data will appear here once you have some orders and activity.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Analytics Filters
          </CardTitle>
          <CardDescription>
            Select date range and period for analytics data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <Select value={period} onValueChange={(value: 'day' | 'week' | 'month') => setPeriod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={loadAnalytics} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Sales"
          metric={analytics.totalSales}
          icon={<DollarSign className="h-4 w-4 text-green-600" />}
          formatValue={formatCurrency}
        />
        <AnalyticsCard
          title="Total Orders"
          metric={analytics.totalOrders}
          icon={<ShoppingCart className="h-4 w-4 text-blue-600" />}
        />
        <AnalyticsCard
          title="Average Order Value"
          metric={analytics.averageOrderValue}
          icon={<BarChart3 className="h-4 w-4 text-purple-600" />}
          formatValue={formatCurrency}
        />
        <AnalyticsCard
          title="New Customers"
          metric={analytics.newCustomers}
          icon={<Users className="h-4 w-4 text-orange-600" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Revenue trends for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.salesOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Sales']}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Over Time</CardTitle>
            <CardDescription>Order volume trends for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => [value, 'Orders']}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    </div>
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <Package className="w-10 h-10 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{product.title}</p>
                      <p className="text-xs text-gray-500">{product.totalSold} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Location */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Location</CardTitle>
            <CardDescription>Revenue breakdown by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.salesByLocation.slice(0, 5).map((location, index) => (
                <div key={location.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{location.country}</p>
                      <p className="text-xs text-gray-500">{location.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(location.sales)}</p>
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(location.sales / Math.max(...analytics.salesByLocation.map(l => l.sales))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
          <CardDescription>New customer acquisition over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.customersOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value: number) => [value, 'New Customers']}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#ffc658" 
                strokeWidth={2}
                dot={{ fill: '#ffc658', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}