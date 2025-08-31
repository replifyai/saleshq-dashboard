'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, ShoppingCart, Package, DollarSign, Percent, Tag, User, MapPin, CreditCard } from 'lucide-react';
import { shopify } from '@/lib/shopifyApi';
import { ShopifyProduct, ShopifyCart, ShopifyCartRequest, ShopifyOrderRequest, ShopifyCustomer } from '@/types/shopify';
import { useAuth } from '@/contexts/auth-context';

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
  taxable?: boolean;
  taxCategory?: string;
}

interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  code?: string;
}

interface TaxRate {
  category: string;
  rate: number;
  name: string;
}

// Tax configuration - in a real app, this would come from settings/API
const TAX_RATES: TaxRate[] = [
  { category: 'default', rate: 0.18, name: 'Standard Tax (18%)' },
  { category: 'food', rate: 0.05, name: 'Food Tax (5%)' },
  { category: 'clothing', rate: 0.06, name: 'Clothing Tax (6%)' },
  { category: 'electronics', rate: 0.10, name: 'Electronics Tax (10%)' },
  { category: 'books', rate: 0.00, name: 'Books (Tax Free)' },
  { category: 'medical', rate: 0.00, name: 'Medical (Tax Free)' },
];

export default function OrderCreator() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [customers, setCustomers] = useState<ShopifyCustomer[]>([]);
  console.log("🚀 ~ OrderCreator ~ customers:", customers);
  const [filteredCustomers, setFilteredCustomers] = useState<ShopifyCustomer[]>([]);
  console.log("🚀 ~ OrderCreator ~ filteredCustomers:", filteredCustomers);
  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>('');
  const [customerType, setCustomerType] = useState<'existing' | 'guest' | 'none'>('existing');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState({
    address1: '',
    city: '',
    province: '',
    country: 'US',
    zip: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [priceUpdateAnimation, setPriceUpdateAnimation] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  // Trigger price update animation when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      setPriceUpdateAnimation(true);
      const timer = setTimeout(() => setPriceUpdateAnimation(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartItems, discounts]);

  useEffect(() => {
    if (customerSearchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.first_name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.last_name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.id?.split('/').pop()?.toLowerCase().includes(customerSearchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [customers, customerSearchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await shopify.getProducts({ limit: 100, status: 'active' });
      setProducts(productsData);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true);
      setError(null);
      const customersData = await shopify.getCustomers();
      setCustomers(customersData);
    } catch (err) {
      console.error('Failed to load customers:', err);
      // Don't show error for customers as it's not critical for order creation
    } finally {
      setLoadingCustomers(false);
    }
  };

  const getSelectedProduct = () => {
    if (!selectedProduct || selectedProduct === '') return null;
    return products.find(p => p.id === selectedProduct);
  };

  const getSelectedVariant = () => {
    const product = getSelectedProduct();
    if (!product || !selectedVariant || selectedVariant === '') return null;
    return product.variants.find(v => v.id === selectedVariant) || product.variants[0];
  };

  const getSelectedCustomer = () => {
    if (!selectedCustomerId || selectedCustomerId === '') return null;
    return customers.find(c => c.id === selectedCustomerId);
  };

  const handleCustomerSelection = (customerId: string) => {
    setSelectedCustomerId(customerId);
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setCustomerEmail(customer.email || '');
        setCustomerName(`${customer.first_name || ''} ${customer.last_name || ''}`.trim());
        setCustomerPhone(customer.phone || '');

        // Populate shipping address if available
        if (customer.default_address) {
          const addr = customer.default_address;
          setShippingAddress({
            address1: addr.address1 || '',
            city: addr.city || '',
            province: addr.province || '',
            country: addr.country || 'US',
            zip: addr.zip || ''
          });
        }
      }
    } else {
      // Clear customer info if no customer selected
      setCustomerEmail('');
      setCustomerName('');
      setCustomerPhone('');
      setShippingAddress({
        address1: '',
        city: '',
        province: '',
        country: 'US',
        zip: ''
      });
    }
  };

  const handleCustomerTypeChange = (type: 'existing' | 'guest' | 'none') => {
    setCustomerType(type);
    setSelectedCustomerId('');

    if (type === 'guest') {
      // Clear customer info for guest
      setCustomerEmail('');
      setCustomerName('');
      setCustomerPhone('');
      setShippingAddress({
        address1: '',
        city: '',
        province: '',
        country: 'US',
        zip: ''
      });
    } else if (type === 'none') {
      // Clear all customer info
      setCustomerEmail('');
      setCustomerName('');
      setCustomerPhone('');
      setShippingAddress({
        address1: '',
        city: '',
        province: '',
        country: 'US',
        zip: ''
      });
    }
  };

  const handleAddToCart = () => {
    const product = getSelectedProduct();
    const variant = getSelectedVariant();

    if (!product || !variant || quantity <= 0 || selectedProduct === '' || selectedVariant === '') {
      setError('Please select a product and variant with valid quantity');
      return;
    }

    // Check inventory
    if (variant.inventoryQuantity !== undefined && variant.inventoryQuantity < quantity) {
      setError(`Only ${variant.inventoryQuantity} items available in stock`);
      return;
    }

    const existingItemIndex = cartItems.findIndex(
      item => item.variantId === variant.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...cartItems];
      const newTotalQuantity = updatedItems[existingItemIndex].quantity + quantity;

      // Check if total quantity exceeds inventory
      if (variant.inventoryQuantity !== undefined && newTotalQuantity > variant.inventoryQuantity) {
        setError(`Cannot add ${quantity} more items. Only ${variant.inventoryQuantity - updatedItems[existingItemIndex].quantity} available`);
        return;
      }

      updatedItems[existingItemIndex].quantity = newTotalQuantity;
      setCartItems(updatedItems);
    } else {
      // Determine tax category from product type or tags
      const getTaxCategory = (product: ShopifyProduct): string => {
        const productType = product.productType?.toLowerCase() || '';
        const tags = product.tags?.map(tag => tag.toLowerCase()) || [];
        
        // Check product type first
        if (productType.includes('food') || tags.includes('food')) return 'food';
        if (productType.includes('clothing') || tags.includes('clothing')) return 'clothing';
        if (productType.includes('electronics') || tags.includes('electronics')) return 'electronics';
        if (productType.includes('book') || tags.includes('books')) return 'books';
        if (productType.includes('medical') || tags.includes('medical')) return 'medical';
        
        return 'default';
      };

      // Add new item
      const newItem: CartItem = {
        id: `${variant.id}-${Date.now()}`,
        productId: product.id,
        variantId: variant.id,
        title: product.title,
        variantTitle: variant.title !== 'Default Title' ? variant.title : undefined,
        price: variant.price,
        quantity: quantity,
        image: product.images?.[0]?.src,
        sku: variant.sku,
        taxable: variant.taxable !== false, // Default to taxable unless explicitly false
        taxCategory: getTaxCategory(product)
      };
      setCartItems([...cartItems, newItem]);
    }

    // Reset form
    setSelectedProduct('');
    setSelectedVariant('');
    setQuantity(1);
    setError(null);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleAddDiscount = () => {
    if (discountValue <= 0) {
      setError('Discount value must be greater than 0');
      return;
    }

    const newDiscount: Discount = {
      type: discountType,
      value: discountValue,
      code: discountCode || undefined
    };

    setDiscounts([...discounts, newDiscount]);
    setDiscountCode('');
    setDiscountValue(0);
    setError(null);
  };

  const handleRemoveDiscount = (index: number) => {
    setDiscounts(discounts.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscounts = () => {
    let totalDiscount = 0;
    discounts.forEach(discount => {
      if (discount.type === 'percentage') {
        totalDiscount += (calculateSubtotal() * discount.value) / 100;
      } else {
        totalDiscount += discount.value;
      }
    });
    return Math.min(totalDiscount, calculateSubtotal()); // Don't discount below 0
  };

  const calculateTax = () => {
    const subtotalAfterDiscounts = calculateSubtotal() - calculateDiscounts();
    let totalTax = 0;

    cartItems.forEach(item => {
      if (!item.taxable) return; // Skip non-taxable items
      
      const taxRate = TAX_RATES.find(rate => rate.category === item.taxCategory) || TAX_RATES[0];
      const itemSubtotal = item.price * item.quantity;
      const itemAfterDiscount = itemSubtotal * (subtotalAfterDiscounts / calculateSubtotal());
      totalTax += itemAfterDiscount * taxRate.rate;
    });

    return totalTax;
  };

  const getTaxBreakdown = () => {
    const subtotalAfterDiscounts = calculateSubtotal() - calculateDiscounts();
    const breakdown: { [category: string]: { amount: number; rate: number; name: string } } = {};

    cartItems.forEach(item => {
      if (!item.taxable) return;
      
      const taxRate = TAX_RATES.find(rate => rate.category === item.taxCategory) || TAX_RATES[0];
      const itemSubtotal = item.price * item.quantity;
      const itemAfterDiscount = itemSubtotal * (subtotalAfterDiscounts / calculateSubtotal());
      const itemTax = itemAfterDiscount * taxRate.rate;

      if (!breakdown[taxRate.category]) {
        breakdown[taxRate.category] = {
          amount: 0,
          rate: taxRate.rate,
          name: taxRate.name
        };
      }
      breakdown[taxRate.category].amount += itemTax;
    });

    return breakdown;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscounts() + calculateTax();
  };

  const handleCreateCart = async () => {
    if (cartItems.length === 0) {
      setError('Please add items to cart before creating cart');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create cart with logged-in user information
      const cartData: ShopifyCartRequest = {
        lineItems: cartItems.map(item => ({
          merchandiseId: item.variantId,
          quantity: item.quantity
        })),
        customerId: customerType === 'existing' && selectedCustomerId ? selectedCustomerId : undefined,
        note: `Cart created via admin interface. Customer Type: ${customerType}, Customer: ${customerName}. Tax Details: ${JSON.stringify(getTaxBreakdown())}`,
        // Add logged-in user as orderPunchedBy
        orderPunchedBy: user?.name || 'Unknown User'
      };

      // Create the cart
      const cart = await shopify.createCart(cartData);

      setSuccess(`Cart created successfully! Cart ID: ${cart.id}`);
      setCartItems([]);
      setDiscounts([]);
      setSelectedCustomerId('');
      setCustomerEmail('');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerSearchTerm('');
      setShippingAddress({
        address1: '',
        city: '',
        province: '',
        country: 'US',
        zip: ''
      });
      setCustomerType('existing');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);

    } catch (err) {
      console.error('Failed to create cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to create cart');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      setError('Please add items to cart before creating order');
      return;
    }

    // Validate customer information based on customer type
    if (customerType === 'existing' && !selectedCustomerId) {
      setError('Please select an existing customer');
      return;
    }

    if (customerType === 'guest' && (!customerEmail || !customerName)) {
      setError('Guest customer email and name are required');
      return;
    }

    if (customerType === 'none' && (!customerEmail || !customerName)) {
      setError('Email and name are required even for orders without customer');
      return;
    }

    // Validate that all cart items have valid product and variant IDs
    const invalidItems = cartItems.filter(item => !item.productId || !item.variantId);
    if (invalidItems.length > 0) {
      setError('Some cart items have invalid product or variant information. Please refresh and try again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create order directly with discount support
      console.log('Tax breakdown for order:', getTaxBreakdown());
      console.log('Total tax for order:', calculateTax());
      
      const orderData: any = {
        email: customerEmail,
        lineItems: cartItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        })),
        customer: customerType === 'existing' && selectedCustomerId ?
          { id: selectedCustomerId } :
          {
            first_name: customerName.split(' ')[0] || customerName,
            last_name: customerName.split(' ').slice(1).join(' ') || '',
            email: customerEmail,
            phone: customerPhone || undefined
          },
        shippingAddress: shippingAddress.address1 ? {
          first_name: customerName.split(' ')[0] || customerName,
          last_name: customerName.split(' ').slice(1).join(' ') || '',
          address1: shippingAddress.address1,
          city: shippingAddress.city,
          province: shippingAddress.province,
          country: shippingAddress.country,
          zip: shippingAddress.zip
        } : undefined,
        billingAddress: shippingAddress.address1 ? {
          first_name: customerName.split(' ')[0] || customerName,
          last_name: customerName.split(' ').slice(1).join(' ') || '',
          address1: shippingAddress.address1,
          city: shippingAddress.city,
          province: shippingAddress.province,
          country: shippingAddress.country,
          zip: shippingAddress.zip
        } : undefined,
        note: `Order created via salesHQ. Created by: ${user?.name}`,
        tags: ['salesHQ', 'manual-order',`Created by: ${user?.name}`],
        orderPunchedBy: user?.name || 'Unknown User',
        currency: 'INR',
        financialStatus: 'pending',
        fulfillmentStatus: 'unfulfilled',
        // Add discount information if any discounts are applied
        discountCode: discounts.length > 0 && discounts[0].code ? discounts[0].code : undefined,
        discountType: discounts.length > 0 ? discounts[0].type : undefined,
        discountValue: discounts.length > 0 ? discounts[0].value : undefined,
        // Add tax breakdown information
        taxBreakdown: getTaxBreakdown(),
        totalTax: calculateTax()
      };

      // Create the order
      const order = await shopify.createOrder(orderData);

      setSuccess(`Order created successfully! Order #${order.order_number || order.name}`);
      setCartItems([]);
      setDiscounts([]);
      setSelectedCustomerId('');
      setCustomerEmail('');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerSearchTerm('');
      setShippingAddress({
        address1: '',
        city: '',
        province: '',
        country: 'US',
        zip: ''
      });
      setCustomerType('existing');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);

    } catch (err) {
      console.error('Failed to create order:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
          <p className="text-gray-600">Build orders by selecting products and managing cart</p>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <span className="font-medium">Error: {error}</span>
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

      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <span className="font-medium">{success}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSuccess(null)}
              className="mt-2"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Selection and Cart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Add Products
              </CardTitle>
              <CardDescription>Select products to add to the order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product
                    {loading && (
                      <span className="ml-2 text-xs text-blue-600 animate-pulse">
                        Loading...
                      </span>
                    )}
                  </label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder={loading ? "Loading products..." : "Select a product"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            Loading products...
                          </div>
                        </SelectItem>
                      ) : products.length === 0 ? (
                        <SelectItem value="no-products" disabled>
                          No products available
                        </SelectItem>
                      ) : (
                        products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            <div className="flex items-center gap-2">
                              {product.images && product.images.length > 0 && (
                                <img
                                  src={product.images[0].src}
                                  alt={product.title}
                                  className="w-6 h-6 object-cover rounded"
                                />
                              )}
                              <span>{product.title}</span>
                              {product.variants && product.variants.length > 0 && (
                                <span className="text-xs text-gray-500">
                                  from {formatCurrency(product.variants[0].price)}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant
                    {selectedProduct && !getSelectedProduct()?.variants && (
                      <span className="ml-2 text-xs text-orange-600">
                        Loading variants...
                      </span>
                    )}
                  </label>
                  <Select
                    value={selectedVariant}
                    onValueChange={setSelectedVariant}
                    disabled={!selectedProduct}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={!selectedProduct ? "Select product first" : "Select variant"} />
                    </SelectTrigger>
                    <SelectContent>
                      {!selectedProduct ? (
                        <SelectItem value="no-product-selected" disabled>
                          Please select a product first
                        </SelectItem>
                      ) : !getSelectedProduct()?.variants || getSelectedProduct()?.variants.length === 0 ? (
                        <SelectItem value="no-variants" disabled>
                          No variants available for this product
                        </SelectItem>
                      ) : (
                        getSelectedProduct()?.variants.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{variant.title === 'Default Title' ? 'Default' : variant.title}</span>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{formatCurrency(variant.price)}</span>
                                {variant.inventoryQuantity !== undefined && (
                                  <Badge variant={variant.inventoryQuantity > 0 ? "default" : "destructive"} className="text-xs">
                                    {variant.inventoryQuantity > 0 ? `${variant.inventoryQuantity} in stock` : 'Out of stock'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Live Price Preview */}
              {selectedProduct && selectedVariant && quantity > 0 && (() => {
                const variant = getSelectedVariant();
                const product = getSelectedProduct();
                if (!variant || !product) return null;
                
                const itemTotal = variant.price * quantity;
                const getTaxCategory = (product: ShopifyProduct): string => {
                  const productType = product.productType?.toLowerCase() || '';
                  const tags = product.tags?.map(tag => tag.toLowerCase()) || [];
                  
                  if (productType.includes('food') || tags.includes('food')) return 'food';
                  if (productType.includes('clothing') || tags.includes('clothing')) return 'clothing';
                  if (productType.includes('electronics') || tags.includes('electronics')) return 'electronics';
                  if (productType.includes('book') || tags.includes('books')) return 'books';
                  if (productType.includes('medical') || tags.includes('medical')) return 'medical';
                  
                  return 'default';
                };
                
                const taxCategory = getTaxCategory(product);
                const taxRate = TAX_RATES.find(rate => rate.category === taxCategory) || TAX_RATES[0];
                const itemTax = variant.taxable !== false ? itemTotal * taxRate.rate : 0;
                const itemTotalWithTax = itemTotal + itemTax;
                
                return (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">Preview</span>
                      <Badge variant="outline" className="text-xs">
                        {taxRate.name}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal ({quantity} × {formatCurrency(variant.price)})</span>
                        <span className="font-medium">{formatCurrency(itemTotal)}</span>
                      </div>
                      {itemTax > 0 && (
                        <div className="flex justify-between text-blue-700">
                          <span>Tax</span>
                          <span>{formatCurrency(itemTax)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-blue-800 pt-1 border-t border-blue-200">
                        <span>Total</span>
                        <span>{formatCurrency(itemTotalWithTax)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <Button
                onClick={handleAddToCart}
                disabled={!selectedProduct || !selectedVariant || quantity <= 0 || selectedProduct === '' || selectedVariant === ''}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart Items ({cartItems.length})
              </CardTitle>
              <CardDescription>Products in the current order</CardDescription>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No items in cart</p>
                  <p className="text-sm">Select products above to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        {item.variantTitle && (
                          <p className="text-sm text-gray-500">{item.variantTitle}</p>
                        )}
                        {item.sku && (
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {item.taxable ? (
                            <Badge variant="outline" className="text-xs">
                              {TAX_RATES.find(rate => rate.category === item.taxCategory)?.name || 'Standard Tax'}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Tax Free</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Discounts
              </CardTitle>
              <CardDescription>Add percentage or fixed amount discounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Code (Optional)
                  </label>
                  <Input
                    placeholder="SUMMER20"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step={discountType === 'percentage' ? 1 : 0.01}
                    placeholder={discountType === 'percentage' ? '20' : '10.00'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddDiscount} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {discounts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Applied Discounts:</p>
                  {discounts.map((discount, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">
                          {discount.code && `${discount.code}: `}
                          {discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDiscount(index)}
                        className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary and Customer Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className={`space-y-3 transition-all duration-300 ${priceUpdateAnimation ? 'bg-blue-50 scale-[1.02]' : ''}`}>
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              {discounts.length > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discounts</span>
                  <span>-{formatCurrency(calculateDiscounts())}</span>
                </div>
              )}
              {/* Tax Breakdown */}
              {(() => {
                const taxBreakdown = getTaxBreakdown();
                const totalTax = calculateTax();
                
                if (totalTax === 0) {
                  return (
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatCurrency(0)}</span>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-1">
                    {Object.entries(taxBreakdown).map(([category, tax]) => (
                      <div key={category} className="flex justify-between text-sm">
                        <span>{tax.name}</span>
                        <span>{formatCurrency(tax.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium">
                      <span>Total Tax</span>
                      <span>{formatCurrency(totalTax)}</span>
                    </div>
                  </div>
                );
              })()}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>

              {/* Cart Summary Details */}
              {cartItems.length > 0 && (
                <>
                  <Separator />
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Total Items:</span>
                      <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unique Products:</span>
                      <span>{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Type:</span>
                      <span className="capitalize">{customerType}</span>
                    </div>
                    {customerType === 'existing' && selectedCustomerId && (
                      <div className="flex justify-between">
                        <span>Customer:</span>
                        <span className="text-blue-600">
                          {getSelectedCustomer()?.first_name || 'N/A'} {getSelectedCustomer()?.last_name || 'N/A'}
                        </span>
                      </div>
                    )}
                    {(customerType === 'guest' || customerType === 'none') && customerName && (
                      <div className="flex justify-between">
                        <span>Contact:</span>
                        <span className="text-gray-600">{customerName}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
              <CardDescription>
                Choose how to handle customer information for this order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Type *
                </label>
                <Select value={customerType} onValueChange={(value: 'existing' | 'guest' | 'none') => handleCustomerTypeChange(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="existing">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Existing Customer</div>
                          <div className="text-xs text-gray-500">Select from your customer database</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="guest">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Guest Customer</div>
                          <div className="text-xs text-gray-500">One-time customer with contact info</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="none">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">No Customer</div>
                          <div className="text-xs text-gray-500">B2B/Wholesale orders without customer</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Existing Customer Selection */}
              {customerType === 'existing' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Customer *
                    </label>
                    <Select value={selectedCustomerId} onValueChange={handleCustomerSelection}>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCustomers ? "Loading customers..." : "Choose a customer"} />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingCustomers ? (
                          <SelectItem value="loading-customers" disabled>
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              Loading customers...
                            </div>
                          </SelectItem>
                        ) : filteredCustomers.length === 0 ? (
                          <SelectItem value="no-customers" disabled>
                            {customerSearchTerm ? 'No customers match your search' : 'No customers found'}
                          </SelectItem>
                        ) : (
                          filteredCustomers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <div className="font-medium">
                                   {customer?.id?.split('/').pop()}
                                  </div>
                                  {/* <div className="text-sm text-gray-500">
                                    {customer.email}
                                  </div> */}
                                </div>
                                {/* {customer.orders_count && (
                                  <Badge variant="outline" className="text-xs">
                                    {customer.orders_count} orders
                                  </Badge>
                                )} */}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Customer Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Customers
                    </label>
                    <Input
                      placeholder="Search by id"
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                      className="w-full"
                    />
                    {customerSearchTerm && (
                      <p className="text-xs text-gray-500 mt-1">
                        Showing {filteredCustomers.length} of {customers.length} customers
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Details (for guest customers only) */}
              {customerType === 'guest' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="customer@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Basic Contact Info (for no customer option) */}
              {customerType === 'none' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="contact@company.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <Input
                      placeholder="Company Contact"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {/* Customer Summary */}
              {/* {customerType === 'existing' && selectedCustomerId && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Selected Customer</span>
                  </div>
                  {(() => {
                    const customer = getSelectedCustomer();
                    return customer ? (
                      <div className="text-sm text-blue-700">
                        <p><strong>{customer.id?.split('/').pop() || 'N/A'}</strong></p>
                        <p>{customer.email || 'No email'}</p>
                        {customer.phone && <p>{customer.phone}</p>}
                        {customer.orders_count && (
                          <p className="text-xs text-blue-600">
                            Previous orders: {customer.orders_count}
                          </p>
                        )}
                        {customer.total_spent && typeof customer.total_spent === 'number' && (
                          <p className="text-xs text-blue-600">
                            Total spent: {formatCurrency(customer.total_spent)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-blue-700">
                        <p>Customer information not available</p>
                      </div>
                    );
                  })()}
                </div>
              )} */}

              {/* Customer Info Display (for all types) */}
              {(customerType === 'guest' || customerType === 'none') && (customerEmail || customerName) && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">
                      {customerType === 'guest' ? 'Guest Customer' : 'Contact Information'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {customerName && <p><strong>Name:</strong> {customerName}</p>}
                    {customerEmail && <p><strong>Email:</strong> {customerEmail}</p>}
                    {customerPhone && customerType === 'guest' && <p><strong>Phone:</strong> {customerPhone}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <Input
                  placeholder="123 Main St"
                  value={shippingAddress.address1}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address1: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    placeholder="New York"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <Input
                    placeholder="NY"
                    value={shippingAddress.province}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code
                  </label>
                  <Input
                    placeholder="10001"
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Select
                    value={shippingAddress.country}
                    onValueChange={(value) => setShippingAddress({ ...shippingAddress, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleCreateCart}
              disabled={loading || cartItems.length === 0}
              className="flex-1 h-12 text-lg"
              size="lg"
              variant="outline"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {loading ? 'Creating Cart...' : 'Create Cart'}
            </Button>
            <Button
              onClick={handleCreateOrder}
              disabled={loading || cartItems.length === 0}
              className="flex-1 h-12 text-lg"
              size="lg"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              {loading ? 'Creating Order...' : 'Create Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 