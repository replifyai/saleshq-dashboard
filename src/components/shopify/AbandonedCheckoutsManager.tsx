'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Mail, MessageSquare, Eye, RefreshCw, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, Package } from 'lucide-react';
import { ShopifyAbandonedCheckout, ShopifyAbandonedCheckoutFilters, ShopifyCustomerContact, ShopifyDetailedAbandonedCheckout } from '@/types/shopify';
import { shopify } from '@/lib/shopifyApi';
import CheckoutDetailDialog from './CheckoutDetailDialog';

interface AbandonedCheckoutsManagerProps {
  className?: string;
}

export default function AbandonedCheckoutsManager({ className }: AbandonedCheckoutsManagerProps) {
  const [abandonedCheckouts, setAbandonedCheckouts] = useState<ShopifyAbandonedCheckout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ShopifyAbandonedCheckoutFilters>({
    limit: 20,
    sortKey: 'CREATED_AT',
    reverse: true
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ShopifyAbandonedCheckout;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCheckout, setSelectedCheckout] = useState<ShopifyAbandonedCheckout | null>(null);
  const [detailedCheckout, setDetailedCheckout] = useState<ShopifyDetailedAbandonedCheckout | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactData, setContactData] = useState<ShopifyCustomerContact>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    message: '',
    subject: ''
  });
  const [sendingContact, setSendingContact] = useState(false);

  useEffect(() => {
    loadAbandonedCheckouts();
  }, [filters]);

  const loadAbandonedCheckouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shopify.getAbandonedCheckouts(filters);
      setAbandonedCheckouts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load abandoned checkouts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      searchTerm: searchTerm || undefined,
      page: 1
    }));
  };

  const handleFilterChange = (key: keyof ShopifyAbandonedCheckoutFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleSort = (key: keyof ShopifyAbandonedCheckout) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    // Sort the data locally
    const sortedData = [...abandonedCheckouts].sort((a, b) => {
      let aValue: any = a[key];
      let bValue: any = b[key];
      
      // Handle nested objects
      if (key === 'totalPriceSet') {
        aValue = parseFloat(a.totalPriceSet.presentmentMoney.amount.toString());
        bValue = parseFloat(b.totalPriceSet.presentmentMoney.amount.toString());
      } else if (key === 'createdAt') {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else if (key === 'customer') {
        aValue = a.customer ? 'registered' : 'guest';
        bValue = b.customer ? 'registered' : 'guest';
      } else if (key === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      }
      
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setAbandonedCheckouts(sortedData);
  };

  const getSortIcon = (key: keyof ShopifyAbandonedCheckout) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const handleViewCheckout = async (checkout: ShopifyAbandonedCheckout) => {
    setLoadingDetails(true);
    try {
      // For now, we'll transform the existing checkout data to match the detailed structure
      // In a real implementation, you would make an API call to get detailed checkout info
      const detailedData: ShopifyDetailedAbandonedCheckout = {
        id: checkout.id,
        abandonedCheckoutUrl: checkout.abandonedCheckoutUrl,
        createdAt: checkout.createdAt,
        updatedAt: checkout.updatedAt,
        completedAt: checkout.completedAt,
        name: checkout.name,
        note: checkout.note,
        totalPriceSet: checkout.totalPriceSet,
        subtotalPriceSet: checkout.subtotalPriceSet,
        totalDiscountSet: checkout.totalDiscountSet,
        totalTaxSet: checkout.totalTaxSet,
        totalLineItemsPriceSet: checkout.totalLineItemsPriceSet,
        taxesIncluded: checkout.taxesIncluded,
        discountCodes: checkout.discountCodes,
        customAttributes: checkout.customAttributes,
        customer: checkout.customer ? { id: checkout.customer.id } : undefined,
        lineItems: {
          edges: checkout.lineItems.map(item => ({
            node: {
              id: item.id,
              title: item.title,
              quantity: item.quantity,
              sku: item.sku,
              variantTitle: item.variantTitle,
              originalUnitPriceSet: item.originalUnitPriceSet,
              originalTotalPriceSet: item.originalTotalPriceSet,
              product: {
                id: item.product?.id || '',
                title: item.product?.title || '',
                handle: item.product?.handle || ''
              },
              variant: {
                id: item.variant?.id || '',
                title: item.variant?.title || '',
                sku: item.variant?.sku
              },
              image: item.image ? {
                id: item.image.id,
                src: item.image.src
              } : undefined
            }
          }))
        },
        taxLines: checkout.taxLines.map(tax => ({
          title: tax.title,
          priceSet: tax.priceSet,
          rate: tax.rate,
          ratePercentage: tax.ratePercentage || tax.rate * 100
        }))
      };
      
      setDetailedCheckout(detailedData);
      setDetailDialogOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load checkout details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleContactCustomer = async (checkout: ShopifyAbandonedCheckout) => {
    setSelectedCheckout(checkout);
    setContactData({
      email: 'customer@example.com', // Placeholder due to plan limitations
      phone: '', // Placeholder due to plan limitations
      firstName: 'Customer', // Placeholder due to plan limitations
      lastName: 'Info', // Placeholder due to plan limitations
      message: `Hi there, we noticed you left some items in your cart. Complete your purchase now and save!`,
      subject: 'Complete Your Purchase - Special Offer Inside!'
    });
    setContactDialogOpen(true);
  };

  const handleSendContact = async () => {
    if (!selectedCheckout?.customer?.id) return;

    setSendingContact(true);
    try {
      if (contactData.email) {
        await shopify.sendCustomerEmail(selectedCheckout.customer.id, contactData);
      }
      if (contactData.phone) {
        await shopify.sendCustomerSMS(selectedCheckout.customer.id, contactData);
      }
      setContactDialogOpen(false);
      // Show success message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send contact');
    } finally {
      setSendingContact(false);
    }
  };


  const formatCurrency = (amount: string | number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSinceAbandoned = (createdAt: string) => {
    const now = new Date();
    const abandoned = new Date(createdAt);
    const diffHours = Math.floor((now.getTime() - abandoned.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Abandoned Checkouts</h2>
          <p className="text-muted-foreground">
            Recover lost sales by contacting customers and offering incentives
          </p>
        </div>
        <Button onClick={loadAbandonedCheckouts} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <Select
                value={filters.sortKey}
                onValueChange={(value) => handleFilterChange('sortKey', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREATED_AT">Created Date</SelectItem>
                  <SelectItem value="UPDATED_AT">Updated Date</SelectItem>
                  <SelectItem value="TOTAL_PRICE">Total Price</SelectItem>
                  <SelectItem value="CUSTOMER_NAME">Customer Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hasCustomer">Customer Type</Label>
              <Select
                value={filters.hasCustomer ? 'has' : 'all'}
                onValueChange={(value) => handleFilterChange('hasCustomer', value === 'has')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Checkouts</SelectItem>
                  <SelectItem value="has">With Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit">Items Per Page</Label>
              <Select
                value={filters.limit?.toString()}
                onValueChange={(value) => handleFilterChange('limit', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading abandoned checkouts...</span>
        </div>
      )}

      {/* Abandoned Checkouts Table */}
      {!loading && (
        <Card>
          <CardContent className="p-0">
            {abandonedCheckouts.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <p className="text-muted-foreground">No abandoned checkouts found</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          Checkout
                          {getSortIcon('name')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('customer')}
                      >
                        <div className="flex items-center gap-2">
                          Customer
                          {getSortIcon('customer')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('totalPriceSet')}
                      >
                        <div className="flex items-center gap-2">
                          Total
                          {getSortIcon('totalPriceSet')}
                        </div>
                      </TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center gap-2">
                          Abandoned
                          {getSortIcon('createdAt')}
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {abandonedCheckouts.map((checkout) => (
                      <TableRow key={checkout.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div className="font-semibold">{checkout.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {checkout.id.split('/').pop()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {checkout.customer ? (
                              <>
                                <Badge variant="secondary">Registered</Badge>
                                <span className="text-sm text-muted-foreground">
                                  Requires Shopify Plus
                                </span>
                              </>
                            ) : (
                              <Badge variant="outline">Guest</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(
                            checkout.totalPriceSet.presentmentMoney.amount,
                            checkout.totalPriceSet.presentmentMoney.currencyCode
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <div className="h-4 w-4 bg-muted rounded flex items-center justify-center">
                              <span className="text-xs">📦</span>
                            </div>
                            <span className="text-sm">
                              {checkout.lineItems.length} item(s)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{formatDate(checkout.createdAt)}</div>
                            <Badge variant="outline" className="text-xs">
                              {getTimeSinceAbandoned(checkout.createdAt)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={checkout.customer ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {checkout.customer ? 'Recoverable' : 'Limited'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCheckout(checkout)}
                              disabled={loadingDetails}
                            >
                              {loadingDetails ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            
                            {checkout.customer && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleContactCustomer(checkout)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contact Customer Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Customer</DialogTitle>
            <DialogDescription>
              Send an email or SMS to recover this abandoned checkout
            </DialogDescription>
            <Alert className="mt-4">
              <AlertDescription>
                <strong>Note:</strong> Customer contact information is not available with the current Shopify plan. 
                Upgrade to Shopify Plus to access customer details and enable full recovery features.
              </AlertDescription>
            </Alert>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactData.email}
                onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="customer@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                type="tel"
                value={contactData.phone}
                onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1234567890"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input
                id="contact-subject"
                value={contactData.subject}
                onChange={(e) => setContactData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Complete Your Purchase"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                value={contactData.message}
                onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Your recovery message..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendContact} disabled={sendingContact}>
                {sendingContact ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Checkout Detail Dialog */}
      <CheckoutDetailDialog
        checkout={detailedCheckout}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

    </div>
  );
}