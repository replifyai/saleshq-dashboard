import { NextRequest, NextResponse } from 'next/server';

/**
 * Shopify API Route
 * This route handles all Shopify API operations server-side to avoid CORS issues
 * All Shopify operations are performed here and results are returned to the frontend
 */

class ShopifyServerApi {
  private baseUrl: string;
  private accessToken: string;
  private apiVersion: string = '2025-01';

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN || '';
    this.accessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || '';
    
    if (!this.baseUrl || !this.accessToken) {
      throw new Error('Shopify credentials not configured');
    }
  }

  private async makeShopifyRequest(endpoint: string, options: RequestInit = {}) {
    const url = `https://${this.baseUrl}/admin/api/${this.apiVersion}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Shopify API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  // Product Management
  async getProducts(filters?: any) {
    let endpoint = '/products.json';
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
    }
    return await this.makeShopifyRequest(endpoint);
  }

  async getProduct(id: string) {
    return await this.makeShopifyRequest(`/products/${id}.json`);
  }

  async createProduct(productData: any) {
    return await this.makeShopifyRequest('/products.json', {
      method: 'POST',
      body: JSON.stringify({ product: productData }),
    });
  }

  async updateProduct(id: string, productData: any) {
    return await this.makeShopifyRequest(`/products/${id}.json`, {
      method: 'PUT',
      body: JSON.stringify({ product: productData }),
    });
  }

  async deleteProduct(id: string) {
    return await this.makeShopifyRequest(`/products/${id}.json`, {
      method: 'DELETE',
    });
  }

  // Order Management
  async getOrders(filters?: any) {
    let endpoint = '/orders.json';
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
    }
    return await this.makeShopifyRequest(endpoint);
  }

  async getOrder(id: string) {
    return await this.makeShopifyRequest(`/orders/${id}.json`);
  }

  async createOrder(orderData: any) {
    return await this.makeShopifyRequest('/orders.json', {
      method: 'POST',
      body: JSON.stringify({ order: orderData }),
    });
  }

  async updateOrder(id: string, orderData: any) {
    return await this.makeShopifyRequest(`/orders/${id}.json`, {
      method: 'PUT',
      body: JSON.stringify({ order: orderData }),
    });
  }

  async cancelOrder(id: string, reason?: string) {
    return await this.makeShopifyRequest(`/orders/${id}/cancel.json`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async fulfillOrder(id: string, fulfillmentData: any) {
    return await this.makeShopifyRequest(`/orders/${id}/fulfillments.json`, {
      method: 'POST',
      body: JSON.stringify({ fulfillment: fulfillmentData }),
    });
  }

  // Customer Management
  async getCustomers() {
    return await this.makeShopifyRequest('/customers.json');
  }

  async getCustomer(id: string) {
    return await this.makeShopifyRequest(`/customers/${id}.json`);
  }

  async createCustomer(customerData: any) {
    return await this.makeShopifyRequest('/customers.json', {
      method: 'POST',
      body: JSON.stringify({ customer: customerData }),
    });
  }

  async updateCustomer(id: string, customerData: any) {
    return await this.makeShopifyRequest(`/customers/${id}.json`, {
      method: 'PUT',
      body: JSON.stringify({ customer: customerData }),
    });
  }

  // Cart Management (using Draft Orders)
  async createCart(cartData: any) {
    const draftOrderData = {
      line_items: cartData.lineItems.map((item: any) => ({
        variant_id: item.merchandiseId,
        quantity: item.quantity,
        properties: item.attributes || []
      })),
      customer: cartData.customerId ? { id: cartData.customerId } : undefined,
      note: cartData.note,
      tags: cartData.tags
    };

    const response = await this.makeShopifyRequest('/draft_orders.json', {
      method: 'POST',
      body: JSON.stringify({ draft_order: draftOrderData }),
    });

    return { cart: this.convertDraftOrderToCart(response.draft_order) };
  }

  async getCart(cartId: string) {
    const response = await this.makeShopifyRequest(`/draft_orders/${cartId}.json`);
    return { cart: this.convertDraftOrderToCart(response.draft_order) };
  }

  async addToCart(cartId: string, lineItem: any) {
    const cart = await this.getCart(cartId);
    const newLineItem = {
      variant_id: lineItem.merchandiseId,
      quantity: lineItem.quantity,
      properties: lineItem.attributes || []
    };

    const updatedLineItems = [...cart.cart.lineItems, newLineItem];
    
    const response = await this.makeShopifyRequest(`/draft_orders/${cartId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        draft_order: {
          line_items: updatedLineItems
        }
      }),
    });

    return { cart: this.convertDraftOrderToCart(response.draft_order) };
  }

  async updateCartItem(cartId: string, lineItemId: string, quantity: number) {
    const cart = await this.getCart(cartId);
    const updatedLineItems = cart.cart.lineItems.map((item: any) => 
      item.id === lineItemId ? { ...item, quantity } : item
    );

    const response = await this.makeShopifyRequest(`/draft_orders/${cartId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        draft_order: {
          line_items: updatedLineItems
        }
      }),
    });

    return { cart: this.convertDraftOrderToCart(response.draft_order) };
  }

  async removeFromCart(cartId: string, lineItemId: string) {
    const cart = await this.getCart(cartId);
    const updatedLineItems = cart.cart.lineItems.filter((item: any) => item.id !== lineItemId);

    const response = await this.makeShopifyRequest(`/draft_orders/${cartId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        draft_order: {
          line_items: updatedLineItems
        }
      }),
    });

    return { cart: this.convertDraftOrderToCart(response.draft_order) };
  }

  async clearCart(cartId: string) {
    await this.makeShopifyRequest(`/draft_orders/${cartId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        draft_order: {
          line_items: []
        }
      }),
    });
    return { success: true };
  }

  // Inventory Management
  async updateInventory(inventoryItemId: string, locationId: string, quantity: number) {
    return await this.makeShopifyRequest('/inventory_levels/set.json', {
      method: 'POST',
      body: JSON.stringify({
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: quantity
      }),
    });
  }

  async getInventoryLevels(inventoryItemIds: string[], locationIds: string[]) {
    const params = new URLSearchParams();
    inventoryItemIds.forEach(id => params.append('inventory_item_ids[]', id));
    locationIds.forEach(id => params.append('location_ids[]', id));

    return await this.makeShopifyRequest(`/inventory_levels.json?${params.toString()}`);
  }

  // Analytics & Statistics
  async getStoreStats() {
    const [productsCount, ordersCount, customersCount] = await Promise.all([
      this.makeShopifyRequest('/products/count.json'),
      this.makeShopifyRequest('/orders/count.json'),
      this.makeShopifyRequest('/customers/count.json')
    ]);

    return {
      stats: {
        totalProducts: productsCount.count,
        totalOrders: ordersCount.count,
        totalCustomers: customersCount.count,
        totalRevenue: 0,
        averageOrderValue: 0,
        topSellingProducts: [],
        recentActivity: []
      }
    };
  }

  async getSalesAnalytics(period: string, startDate: string, endDate: string) {
    const params = new URLSearchParams({
      created_at_min: startDate,
      created_at_max: endDate,
      status: 'any'
    });

    const response = await this.makeShopifyRequest(`/orders.json?${params.toString()}`);
    return { analytics: response.orders || [] };
  }

  // Webhook Management
  async createWebhook(topic: string, address: string, format: 'json' | 'xml' = 'json') {
    return await this.makeShopifyRequest('/webhooks.json', {
      method: 'POST',
      body: JSON.stringify({
        webhook: {
          topic,
          address,
          format
        }
      }),
    });
  }

  async getWebhooks() {
    return await this.makeShopifyRequest('/webhooks.json');
  }

  async deleteWebhook(id: string) {
    await this.makeShopifyRequest(`/webhooks/${id}.json`, {
      method: 'DELETE',
    });
    return { success: true };
  }

  // Store Information
  async getStoreInfo() {
    return await this.makeShopifyRequest('/shop.json');
  }

  async updateStoreInfo(storeData: any) {
    return await this.makeShopifyRequest('/shop.json', {
      method: 'PUT',
      body: JSON.stringify({ shop: storeData }),
    });
  }

  // Bulk Operations
  async bulkUpdateProducts(products: any[]) {
    const results = await Promise.all(
      products.map(product => 
        product.id ? this.updateProduct(product.id.toString(), product) : null
      )
    );
    return { results: results.filter(Boolean) };
  }

  async bulkCreateOrders(orders: any[]) {
    const results = await Promise.all(
      orders.map(order => this.createOrder(order))
    );
    return { orders: results };
  }

  // Search Operations
  async searchProducts(query: string, filters?: any) {
    const searchFilters = { ...filters, title: query };
    const response = await this.getProducts(searchFilters);
    return { products: response.products || [] };
  }

  async searchOrders(query: string, filters?: any) {
    const orders = await this.getOrders(filters);
    const filteredOrders = orders.orders.filter((order: any) => 
      order.name?.toLowerCase().includes(query.toLowerCase()) ||
      order.order_number?.toString().includes(query)
    );
    return { orders: filteredOrders };
  }

  // Helper method to convert draft order to cart format
  private convertDraftOrderToCart(draftOrder: any) {
    return {
      id: draftOrder.id.toString(),
      createdAt: draftOrder.created_at,
      updatedAt: draftOrder.updated_at,
      lineItems: draftOrder.line_items?.map((item: any) => ({
        id: item.id.toString(),
        merchandiseId: item.variant_id.toString(),
        quantity: item.quantity,
        attributes: item.properties || [],
        cost: {
          subtotalAmount: {
            amount: item.price || '0',
            currencyCode: 'INR'
          }
        }
      })) || [],
      cost: {
        subtotalAmount: {
          amount: draftOrder.subtotal_price || '0',
          currencyCode: 'INR'
        },
        totalAmount: {
          amount: draftOrder.total_price || '0',
          currencyCode: 'INR'
        },
        totalTaxAmount: {
          amount: draftOrder.total_tax || '0',
          currencyCode: 'INR'
        }
      },
      buyerIdentity: draftOrder.customer ? {
        customer: {
          id: draftOrder.customer.id.toString(),
          email: draftOrder.customer.email,
          firstName: draftOrder.customer.first_name,
          lastName: draftOrder.customer.last_name
        }
      } : undefined,
      attributes: [],
      discountCodes: [],
      discountApplications: [],
      note: draftOrder.note,
      tags: draftOrder.tags
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter is required' },
        { status: 400 }
      );
    }

    const shopifyApi = new ShopifyServerApi();
    
    // Handle different actions
    switch (action) {
      case 'getProducts': {
        const filters: any = {};
        searchParams.forEach((value, key) => {
          if (key !== 'action') {
            filters[key] = value;
          }
        });
        const result = await shopifyApi.getProducts(filters);
        return NextResponse.json(result);
      }
      
      case 'getProduct': {
        const id = searchParams.get('id');
        if (!id) {
          return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }
        const result = await shopifyApi.getProduct(id);
        return NextResponse.json(result);
      }
      
      case 'getOrders': {
        const filters: any = {};
        searchParams.forEach((value, key) => {
          if (key !== 'action') {
            filters[key] = value;
          }
        });
        const result = await shopifyApi.getOrders(filters);
        return NextResponse.json(result);
      }
      
      case 'getOrder': {
        const id = searchParams.get('id');
        if (!id) {
          return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }
        const result = await shopifyApi.getOrder(id);
        return NextResponse.json(result);
      }
      
      case 'getCustomers': {
        const result = await shopifyApi.getCustomers();
        return NextResponse.json(result);
      }
      
      case 'getCustomer': {
        const id = searchParams.get('id');
        if (!id) {
          return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
        }
        const result = await shopifyApi.getCustomer(id);
        return NextResponse.json(result);
      }
      
      case 'getCart': {
        const id = searchParams.get('id');
        if (!id) {
          return NextResponse.json({ error: 'Cart ID is required' }, { status: 400 });
        }
        const result = await shopifyApi.getCart(id);
        return NextResponse.json(result);
      }
      
      case 'getStoreStats': {
        const result = await shopifyApi.getStoreStats();
        return NextResponse.json(result);
      }
      
      case 'getStoreInfo': {
        const result = await shopifyApi.getStoreInfo();
        return NextResponse.json(result);
      }
      
      case 'getWebhooks': {
        const result = await shopifyApi.getWebhooks();
        return NextResponse.json(result);
      }
      
      default:
      return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Shopify API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const shopifyApi = new ShopifyServerApi();
    
    // Handle different actions
    switch (action) {
      case 'createProduct': {
        const result = await shopifyApi.createProduct(body.product);
        return NextResponse.json(result);
      }
      
      case 'createOrder': {
        const result = await shopifyApi.createOrder(body.order);
        return NextResponse.json(result);
      }
      
      case 'createCustomer': {
        const result = await shopifyApi.createCustomer(body.customer);
        return NextResponse.json(result);
      }
      
      case 'createCart': {
        const result = await shopifyApi.createCart(body.cart);
        return NextResponse.json(result);
      }
      
      case 'addToCart': {
        const result = await shopifyApi.addToCart(body.cartId, body.lineItem);
        return NextResponse.json(result);
      }
      
      case 'updateInventory': {
        const result = await shopifyApi.updateInventory(body.inventoryItemId, body.locationId, body.quantity);
        return NextResponse.json(result);
      }
      
      case 'getInventoryLevels': {
        const result = await shopifyApi.getInventoryLevels(body.inventoryItemIds, body.locationIds);
        return NextResponse.json(result);
      }
      
      case 'getSalesAnalytics': {
        const result = await shopifyApi.getSalesAnalytics(body.period, body.startDate, body.endDate);
        return NextResponse.json(result);
      }
      
      case 'createWebhook': {
        const result = await shopifyApi.createWebhook(body.topic, body.address, body.format);
        return NextResponse.json(result);
      }
      
      case 'bulkUpdateProducts': {
        const result = await shopifyApi.bulkUpdateProducts(body.products);
        return NextResponse.json(result);
      }
      
      case 'bulkCreateOrders': {
        const result = await shopifyApi.bulkCreateOrders(body.orders);
        return NextResponse.json(result);
      }
      
      case 'searchProducts': {
        const result = await shopifyApi.searchProducts(body.query, body.filters);
        return NextResponse.json(result);
      }
      
      case 'searchOrders': {
        const result = await shopifyApi.searchOrders(body.query, body.filters);
        return NextResponse.json(result);
      }
      
      default:
      return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Shopify API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const shopifyApi = new ShopifyServerApi();
    
    // Handle different actions
    switch (action) {
      case 'updateProduct': {
        const result = await shopifyApi.updateProduct(body.id, body.product);
        return NextResponse.json(result);
      }
      
      case 'updateOrder': {
        const result = await shopifyApi.updateOrder(body.id, body.order);
        return NextResponse.json(result);
      }
      
      case 'updateCustomer': {
        const result = await shopifyApi.updateCustomer(body.id, body.customer);
        return NextResponse.json(result);
      }
      
      case 'updateCartItem': {
        const result = await shopifyApi.updateCartItem(body.cartId, body.lineItemId, body.quantity);
        return NextResponse.json(result);
      }
      
      case 'clearCart': {
        const result = await shopifyApi.clearCart(body.cartId);
        return NextResponse.json(result);
      }
      
      case 'updateStoreInfo': {
        const result = await shopifyApi.updateStoreInfo(body.shop);
        return NextResponse.json(result);
      }
      
      default:
      return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Shopify API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const shopifyApi = new ShopifyServerApi();
    
    // Handle different actions
    switch (action) {
      case 'deleteProduct': {
        await shopifyApi.deleteProduct(body.id);
        return NextResponse.json({ success: true });
      }
      
      case 'removeFromCart': {
        const result = await shopifyApi.removeFromCart(body.cartId, body.lineItemId);
        return NextResponse.json(result);
      }
      
      case 'deleteWebhook': {
        await shopifyApi.deleteWebhook(body.id);
        return NextResponse.json({ success: true });
      }
      
      default:
      return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Shopify API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 