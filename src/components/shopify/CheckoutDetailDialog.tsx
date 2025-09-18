'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Package, Calendar, DollarSign, Tag, MapPin, User, ShoppingCart } from 'lucide-react';
import { ShopifyDetailedAbandonedCheckout } from '@/types/shopify';

interface CheckoutDetailDialogProps {
  checkout: ShopifyDetailedAbandonedCheckout | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CheckoutDetailDialog({ checkout, open, onOpenChange }: CheckoutDetailDialogProps) {
  if (!checkout) return null;

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const totalItems = checkout.lineItems.edges.reduce((sum, edge) => sum + edge.node.quantity, 0);
  const currency = checkout.totalPriceSet.presentmentMoney.currencyCode;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Checkout Details - {checkout.name}
          </DialogTitle>
          <DialogDescription>
            Complete information about this abandoned checkout
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Checkout Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Checkout Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Created:</span>
                      <span className="text-sm">{formatDate(checkout.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getTimeSinceAbandoned(checkout.createdAt)}</Badge>
                    </div>
                    {checkout.customer && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Customer:</span>
                        <Badge variant="secondary">Registered</Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Value:</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(
                          checkout.totalPriceSet.presentmentMoney.amount.toString(),
                          currency
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Items:</span>
                      <span className="text-sm">{totalItems} item(s)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cart Items</CardTitle>
                <CardDescription>
                  {checkout.lineItems.edges.length} product(s) in this checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checkout.lineItems.edges.map((edge, index) => {
                    const item = edge.node;
                    return (
                      <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        {item.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.image.src}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium text-sm">{item.title}</h4>
                              {item.variantTitle && item.variantTitle !== 'Default Title' && (
                                <p className="text-xs text-muted-foreground">
                                  Variant: {item.variantTitle}
                                </p>
                              )}
                              {item.sku && (
                                <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                              )}
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  Qty: {item.quantity}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {item.product.title}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">
                                {formatCurrency(
                                  item.originalUnitPriceSet.presentmentMoney.amount.toString(),
                                  currency
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">per unit</p>
                              <p className="font-semibold text-sm mt-1">
                                {formatCurrency(
                                  item.originalTotalPriceSet.presentmentMoney.amount.toString(),
                                  currency
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Subtotal ({totalItems} items)</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(
                        checkout.subtotalPriceSet.presentmentMoney.amount.toString(),
                        currency
                      )}
                    </span>
                  </div>
                  
                  {checkout.totalDiscountSet.presentmentMoney.amount !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-600">Discount</span>
                      <span className="text-sm font-medium text-green-600">
                        -{formatCurrency(
                          checkout.totalDiscountSet.presentmentMoney.amount.toString(),
                          currency
                        )}
                      </span>
                    </div>
                  )}

                  {checkout.taxLines.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Taxes</p>
                        {checkout.taxLines.map((tax, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span>{tax.title} ({tax.ratePercentage}%)</span>
                            <span>
                              {formatCurrency(
                                tax.priceSet.presentmentMoney.amount.toString(),
                                currency
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <Separator />
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span className="text-lg">
                      {formatCurrency(
                        checkout.totalPriceSet.presentmentMoney.amount.toString(),
                        currency
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Checkout Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">ID:</span> {checkout.id}</p>
                        <p><span className="text-muted-foreground">Name:</span> {checkout.name}</p>
                        <p><span className="text-muted-foreground">Currency:</span> {currency}</p>
                        <p><span className="text-muted-foreground">Taxes Included:</span> {checkout.taxesIncluded ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recovery Options</h4>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(checkout.abandonedCheckoutUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Recovery URL
                        </Button>
                        {checkout.customer && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Contact Customer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {checkout.note && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Note</h4>
                      <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                        {checkout.note}
                      </p>
                    </div>
                  )}

                  {checkout.discountCodes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Discount Codes</h4>
                      <div className="flex flex-wrap gap-2">
                        {checkout.discountCodes.map((code, index) => (
                          <Badge key={index} variant="outline">
                            <Tag className="h-3 w-3 mr-1" />
                            {code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}