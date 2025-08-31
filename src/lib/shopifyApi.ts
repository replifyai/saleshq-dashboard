import { ShopifyProduct, ShopifyProductRequest, ShopifyOrder, ShopifyOrderRequest, ShopifyCustomer, ShopifyCart, ShopifyCartRequest, ShopifyProductFilters, ShopifyProductsResponse, ShopifyOrderFilters, ShopifyOrdersResponse, ShopifyStoreStats, ShopifyAnalyticsFilters, ShopifyAnalyticsResponse, ShopifyError } from '@/types/shopify';
import { shopifyGraphQL } from './shopifyGraphQLApi';

// This service is designed to work with Next.js API routes
// Now uses GraphQL instead of REST for better performance and flexibility
export class ShopifyApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/shopify';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}?action=${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
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

  // Product Management - Now using GraphQL
  async getProducts(filters?: ShopifyProductFilters): Promise<ShopifyProduct[]> {
    try {
      return await shopifyGraphQL.getProducts(filters);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductsWithPagination(filters?: ShopifyProductFilters): Promise<ShopifyProductsResponse> {
    try {
      return await shopifyGraphQL.getProductsWithPagination(filters);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProduct(id: string): Promise<ShopifyProduct> {
    try {
      return await shopifyGraphQL.getProduct(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProduct(productData: ShopifyProductRequest): Promise<ShopifyProduct> {
    try {
      return await shopifyGraphQL.createProduct(productData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(id: string, productData: Partial<ShopifyProductRequest>): Promise<ShopifyProduct> {
    try {
      return await shopifyGraphQL.updateProduct(id, productData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      return await shopifyGraphQL.deleteProduct(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Order Management - Now using GraphQL
  async getOrders(filters?: ShopifyOrderFilters): Promise<ShopifyOrder[]> {
    try {
      return await shopifyGraphQL.getOrders(filters);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrdersWithPagination(filters?: ShopifyOrderFilters): Promise<ShopifyOrdersResponse> {
    try {
      return await shopifyGraphQL.getOrdersWithPagination(filters);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrder(id: string): Promise<ShopifyOrder> {
    try {
      return await shopifyGraphQL.getOrder(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createOrder(orderData: ShopifyOrderRequest): Promise<ShopifyOrder> {
    try {
      return await shopifyGraphQL.createOrder(orderData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateOrder(id: string, orderData: Partial<ShopifyOrderRequest>): Promise<ShopifyOrder> {
    try {
      const response = await this.makeRequest('updateOrder', {
        method: 'PUT',
        body: JSON.stringify({ id, order: orderData }),
      });
      return response.order;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelOrder(id: string, reason?: string): Promise<ShopifyOrder> {
    try {
      const response = await this.makeRequest('cancelOrder', {
        method: 'POST',
        body: JSON.stringify({ id, reason }),
      });
      return response.order;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async fulfillOrder(id: string, fulfillmentData: any): Promise<any> {
    try {
      const response = await this.makeRequest('fulfillOrder', {
        method: 'POST',
        body: JSON.stringify({ id, fulfillment: fulfillmentData }),
      });
      return response.fulfillment;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Customer Management - Now using GraphQL
  async getCustomers(): Promise<ShopifyCustomer[]> {
    try {
      return await shopifyGraphQL.getCustomers();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCustomer(id: string): Promise<ShopifyCustomer> {
    try {
      return await shopifyGraphQL.getCustomer(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCustomer(customerData: Partial<ShopifyCustomer>): Promise<ShopifyCustomer> {
    try {
      return await shopifyGraphQL.createCustomer(customerData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCustomer(id: string, customerData: Partial<ShopifyCustomer>): Promise<ShopifyCustomer> {
    try {
      const response = await this.makeRequest('updateCustomer', {
        method: 'PUT',
        body: JSON.stringify({ id, customer: customerData }),
      });
      return response.customer;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Cart Management (using Draft Orders for cart-like functionality)
  async createCart(cartData: ShopifyCartRequest): Promise<ShopifyCart> {
    try {
      const response = await this.makeRequest('createCart', {
        method: 'POST',
        body: JSON.stringify({ cart: cartData }),
      });
      return response.cart;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCart(cartId: string): Promise<ShopifyCart> {
    try {
      const response = await this.makeRequest(`getCart&id=${cartId}`);
      return response.cart;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addToCart(cartId: string, lineItem: { merchandiseId: string; quantity: number; attributes?: any[] }): Promise<ShopifyCart> {
    try {
      const response = await this.makeRequest('addToCart', {
        method: 'POST',
        body: JSON.stringify({ cartId, lineItem }),
      });
      return response.cart;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCartItem(cartId: string, lineItemId: string, quantity: number): Promise<ShopifyCart> {
    try {
      const response = await this.makeRequest('updateCartItem', {
        method: 'PUT',
        body: JSON.stringify({ cartId, lineItemId, quantity }),
      });
      return response.cart;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeFromCart(cartId: string, lineItemId: string): Promise<ShopifyCart> {
    try {
      const response = await this.makeRequest('removeFromCart', {
        method: 'DELETE',
        body: JSON.stringify({ cartId, lineItemId }),
      });
      return response.cart;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async clearCart(cartId: string): Promise<void> {
    try {
      await this.makeRequest('clearCart', {
        method: 'PUT',
        body: JSON.stringify({ cartId }),
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Inventory Management
  async updateInventoryLevel(inventoryItemId: string, locationId: string, quantity: number): Promise<any> {
    try {
      const response = await this.makeRequest('updateInventory', {
        method: 'POST',
        body: JSON.stringify({ inventoryItemId, locationId, quantity }),
      });
      return response.inventory_level;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getInventoryLevels(inventoryItemIds: string[], locationIds: string[]): Promise<any[]> {
    try {
      const response = await this.makeRequest('getInventoryLevels', {
        method: 'POST',
        body: JSON.stringify({ inventoryItemIds, locationIds }),
      });
      return response.inventory_levels || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Analytics & Statistics - Now using GraphQL
  async getStoreStats(): Promise<ShopifyStoreStats> {
    try {
      return await shopifyGraphQL.getStoreStats();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAnalytics(filters?: ShopifyAnalyticsFilters): Promise<ShopifyAnalyticsResponse> {
    try {
      return await shopifyGraphQL.getAnalytics(filters);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSalesAnalytics(period: string, startDate: string, endDate: string): Promise<any> {
    try {
      const response = await this.makeRequest('getSalesAnalytics', {
        method: 'POST',
        body: JSON.stringify({ period, startDate, endDate }),
      });
      return response.analytics;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Webhook Management
  async createWebhook(topic: string, address: string, format: 'json' | 'xml' = 'json'): Promise<any> {
    try {
      const response = await this.makeRequest('createWebhook', {
        method: 'POST',
        body: JSON.stringify({ topic, address, format }),
      });
      return response.webhook;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWebhooks(): Promise<any[]> {
    try {
      const response = await this.makeRequest('getWebhooks');
      return response.webhooks || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteWebhook(id: string): Promise<void> {
    try {
      await this.makeRequest('deleteWebhook', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Store Information
  async getStoreInfo(): Promise<any> {
    try {
      const response = await this.makeRequest('getStoreInfo');
      return response.shop;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateStoreInfo(storeData: any): Promise<any> {
    try {
      const response = await this.makeRequest('updateStoreInfo', {
        method: 'PUT',
        body: JSON.stringify({ shop: storeData }),
      });
      return response.shop;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Bulk Operations
  async bulkUpdateProducts(products: Partial<ShopifyProduct>[]): Promise<any[]> {
    try {
      const response = await this.makeRequest('bulkUpdateProducts', {
        method: 'POST',
        body: JSON.stringify({ products }),
      });
      return response.results;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkCreateOrders(orders: ShopifyOrderRequest[]): Promise<ShopifyOrder[]> {
    try {
      const response = await this.makeRequest('bulkCreateOrders', {
        method: 'POST',
        body: JSON.stringify({ orders }),
      });
      return response.orders;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search Operations
  async searchProducts(query: string, filters?: ShopifyProductFilters): Promise<ShopifyProduct[]> {
    try {
      const response = await this.makeRequest('searchProducts', {
        method: 'POST',
        body: JSON.stringify({ query, filters }),
      });
      return response.products || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchOrders(query: string, filters?: ShopifyOrderFilters): Promise<ShopifyOrder[]> {
    try {
      const response = await this.makeRequest('searchOrders', {
        method: 'POST',
        body: JSON.stringify({ query, filters }),
      });
      return response.orders || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ShopifyError {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      field: undefined,
      details: error
    };
  }
}

export const shopifyApi = new ShopifyApiService();

// Convenience functions for common operations
export const shopify = {
  // Products
  getProducts: (filters?: ShopifyProductFilters) => shopifyApi.getProducts(filters),
  getProductsWithPagination: (filters?: ShopifyProductFilters) => shopifyApi.getProductsWithPagination(filters),
  getProduct: (id: string) => shopifyApi.getProduct(id),
  createProduct: (data: ShopifyProductRequest) => shopifyApi.createProduct(data),
  updateProduct: (id: string, data: Partial<ShopifyProductRequest>) => shopifyApi.updateProduct(id, data),
  deleteProduct: (id: string) => shopifyApi.deleteProduct(id),
  searchProducts: (query: string, filters?: ShopifyProductFilters) => shopifyApi.searchProducts(query, filters),

  // Orders
  getOrders: (filters?: ShopifyOrderFilters) => shopifyApi.getOrders(filters),
  getOrdersWithPagination: (filters?: ShopifyOrderFilters) => shopifyApi.getOrdersWithPagination(filters),
  getOrder: (id: string) => shopifyApi.getOrder(id),
  createOrder: (data: ShopifyOrderRequest) => shopifyApi.createOrder(data),
  updateOrder: (id: string, data: Partial<ShopifyOrderRequest>) => shopifyApi.updateOrder(id, data),
  cancelOrder: (id: string, reason?: string) => shopifyApi.cancelOrder(id, reason),
  fulfillOrder: (id: string, data: any) => shopifyApi.fulfillOrder(id, data),
  searchOrders: (query: string, filters?: ShopifyOrderFilters) => shopifyApi.searchOrders(query, filters),

  // Customers
  getCustomers: () => shopifyApi.getCustomers(),
  getCustomer: (id: string) => shopifyApi.getCustomer(id),
  createCustomer: (data: Partial<ShopifyCustomer>) => shopifyApi.createCustomer(data),
  updateCustomer: (id: string, data: Partial<ShopifyCustomer>) => shopifyApi.updateCustomer(id, data),

  // Cart
  createCart: (data: ShopifyCartRequest) => shopifyApi.createCart(data),
  getCart: (id: string) => shopifyApi.getCart(id),
  addToCart: (cartId: string, item: { merchandiseId: string; quantity: number; attributes?: any[] }) => 
    shopifyApi.addToCart(cartId, item),
  updateCartItem: (cartId: string, itemId: string, quantity: number) => 
    shopifyApi.updateCartItem(cartId, itemId, quantity),
  removeFromCart: (cartId: string, itemId: string) => shopifyApi.removeFromCart(cartId, itemId),
  clearCart: (cartId: string) => shopifyApi.clearCart(cartId),

  // Inventory
  updateInventory: (itemId: string, locationId: string, quantity: number) => 
    shopifyApi.updateInventoryLevel(itemId, locationId, quantity),
  getInventoryLevels: (itemIds: string[], locationIds: string[]) => 
    shopifyApi.getInventoryLevels(itemIds, locationIds),

  // Analytics
  getStoreStats: () => shopifyApi.getStoreStats(),
  getAnalytics: (filters?: ShopifyAnalyticsFilters) => shopifyApi.getAnalytics(filters),
  getSalesAnalytics: (period: string, startDate: string, endDate: string) => 
    shopifyApi.getSalesAnalytics(period, startDate, endDate),

  // Webhooks
  createWebhook: (topic: string, address: string, format?: 'json' | 'xml') => 
    shopifyApi.createWebhook(topic, address, format),
  getWebhooks: () => shopifyApi.getWebhooks(),
  deleteWebhook: (id: string) => shopifyApi.deleteWebhook(id),

  // Store Info
  getStoreInfo: () => shopifyApi.getStoreInfo(),
  updateStoreInfo: (data: any) => shopifyApi.updateStoreInfo(data),

  // Bulk Operations
  bulkUpdateProducts: (products: Partial<ShopifyProduct>[]) => shopifyApi.bulkUpdateProducts(products),
  bulkCreateOrders: (orders: ShopifyOrderRequest[]) => shopifyApi.bulkCreateOrders(orders),
}; 