import { ShopifyProduct, ShopifyProductRequest, ShopifyOrder, ShopifyOrderRequest, ShopifyCustomer, ShopifyCart, ShopifyCartRequest, ShopifyProductFilters, ShopifyProductsResponse, ShopifyOrderFilters, ShopifyOrdersResponse, ShopifyStoreStats, ShopifyAnalyticsFilters, ShopifyAnalyticsResponse, ShopifyAnalyticsDataPoint, ShopifyAnalyticsMetric, ShopifyError, ShopifyAbandonedCheckout, ShopifyAbandonedCheckoutFilters, ShopifyAbandonedCheckoutsResponse, ShopifyDiscountCodeRequest, ShopifyDiscountCodeManagement, ShopifyDiscountCodeFilters, ShopifyDiscountCodesResponse } from '@/types/shopify';

/**
 * GraphQL-based Shopify API Service
 * Replaces REST API with GraphQL for better performance and flexibility
 */
export class ShopifyGraphQLApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/shopify/graphql';
  }

  private async makeGraphQLRequest(query: string, variables: any = {}) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Shopify GraphQL API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    // Our internal API already returns result.data from Shopify.
    // So we should return `result` directly, not `result.data` again.
    return result;
  }

  private async countConnection(query: string, rootKey: 'products' | 'orders' | 'customers'): Promise<number> {
    let total = 0;
    let after: string | null = null;

    // paginate in batches of 250 until no more pages
    // select minimal fields to reduce payload
    do {
      const variables: any = { first: 250, after };
      const resp = await this.makeGraphQLRequest(query, variables);
      const connection = resp[rootKey];
      const nodes = connection?.nodes || [];
      total += nodes.length;
      const pageInfo = connection?.pageInfo;
      after = pageInfo?.hasNextPage ? pageInfo.endCursor : null;
    } while (after);

    return total;
  }

  // Product Management
  async getProducts(filters?: ShopifyProductFilters): Promise<ShopifyProduct[]> {
    try {
      const productsResponse = await this.getProductsWithPagination(filters);
      return productsResponse.products;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductsWithPagination(filters?: ShopifyProductFilters): Promise<ShopifyProductsResponse> {
    try {
      const limit = filters?.limit || 10;
      const query = this.buildProductSearchQuery(filters);
      const cursor = filters?.cursor;

      const gqlQuery = `
        query GetProducts($first: Int!, $query: String, $after: String) {
          products(first: $first, query: $query, sortKey: CREATED_AT, reverse: true, after: $after) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            nodes {
              id
              title
              handle
              description
              productType
              vendor
              tags
              status
              createdAt
              updatedAt
              totalInventory
              featuredMedia {
                ... on MediaImage {
                  id
                  alt
                  image {
                    url
                  }
                }
              }
              media(first: 10) {
                nodes {
                  ... on MediaImage {
                    id
                    alt
                    image {
                      url
                    }
                  }
                }
              }
              variants(first: 100) {
                nodes {
                  id
                  title
                  sku
                  barcode
                  price
                  compareAtPrice
                  inventoryQuantity
                  inventoryPolicy
                  position
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    id
                    url
                  }
                }
              }
              options {
                id
                name
                position
                values
              }
              seo {
                title
                description
              }
            }
          }
        }
      `;

      const variables = {
        first: limit,
        query: query || undefined,
        after: cursor || undefined
      };

      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      
      return {
        products: this.transformProductsData(data.products.nodes),
        hasNextPage: data.products.pageInfo.hasNextPage,
        hasPreviousPage: data.products.pageInfo.hasPreviousPage,
        pageInfo: data.products.pageInfo
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private buildProductSearchQuery(filters?: ShopifyProductFilters): string {
    if (!filters) return '';

    const queryParts = [];

    if (filters.searchTerm) {
      queryParts.push(`title:*${filters.searchTerm}* OR tag:*${filters.searchTerm}* OR vendor:*${filters.searchTerm}*`);
    }

    if (filters.status) {
      queryParts.push(`status:${filters.status}`);
    }

    if (filters.productType) {
      queryParts.push(`product_type:*${filters.productType}*`);
    }

    if (filters.vendor) {
      queryParts.push(`vendor:*${filters.vendor}*`);
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagQuery = filters.tags.map(tag => `tag:${tag}`).join(' OR ');
      queryParts.push(`(${tagQuery})`);
    }

    if (filters.createdAtAfter) {
      queryParts.push(`created_at:>=${filters.createdAtAfter}`);
    }

    if (filters.createdAtBefore) {
      queryParts.push(`created_at:<=${filters.createdAtBefore}`);
    }

    return queryParts.join(' AND ');
  }

  async getProduct(id: string): Promise<ShopifyProduct> {
    try {
      const gqlQuery = `
        query GetProduct($id: ID!) {
          product(id: $id) {
            id
            title
            handle
            description
            productType
            vendor
            tags
            status
            createdAt
            updatedAt
            totalInventory
            featuredMedia {
              ... on MediaImage {
                id
                alt
                image {
                  url
                }
              }
            }
            media(first: 10) {
              nodes {
                ... on MediaImage {
                  id
                  alt
                  image {
                    url
                  }
                }
              }
            }
            variants(first: 100) {
              nodes {
                id
                title
                sku
                barcode
                price
                compareAtPrice
                inventoryQuantity
                inventoryPolicy
                position
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url
                }
              }
            }
            options {
              id
              name
              position
              values
            }
            seo {
              title
              description
            }
          }
        }
      `;

      const variables = { id };
      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      return this.transformProductData(data.product);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProduct(productData: ShopifyProductRequest): Promise<ShopifyProduct> {
    try {
      const gqlQuery = `
        mutation ProductCreate($input: ProductInput!) {
          productCreate(input: $input) {
            product {
              id
              title
              handle
              description
              productType
              vendor
              tags
              status
              createdAt
              updatedAt
              totalInventory
              variants(first: 1) {
                nodes {
                  id
                  title
                  sku
                  price
                  inventoryQuantity
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const input = {
        title: productData.title,
        descriptionHtml: productData.bodyHtml || '',
        vendor: productData.vendor || '',
        productType: productData.productType || '',
        tags: productData.tags || [],
        status: productData.status?.toUpperCase() || 'DRAFT'
      };

      const variables = { input };
      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      
      if (data.productCreate.userErrors.length > 0) {
        throw new Error(`Product creation failed: ${data.productCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return this.transformProductData(data.productCreate.product);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(id: string, productData: Partial<ShopifyProductRequest>): Promise<ShopifyProduct> {
    try {
      const gqlQuery = `
        mutation ProductUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              title
              handle
              description
              productType
              vendor
              tags
              status
              updatedAt
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const input: any = { id };
      if (productData.title) input.title = productData.title;
      if (productData.bodyHtml) input.descriptionHtml = productData.bodyHtml;
      if (productData.vendor) input.vendor = productData.vendor;
      if (productData.productType) input.productType = productData.productType;
      if (productData.tags) input.tags = productData.tags;
      if (productData.status) input.status = productData.status.toUpperCase();

      const variables = { input };
      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      
      if (data.productUpdate.userErrors.length > 0) {
        throw new Error(`Product update failed: ${data.productUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return this.transformProductData(data.productUpdate.product);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const gqlQuery = `
        mutation ProductDelete($input: ProductDeleteInput!) {
          productDelete(input: $input) {
            deletedProductId
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = { input: { id } };
      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      
      if (data.productDelete.userErrors.length > 0) {
        throw new Error(`Product deletion failed: ${data.productDelete.userErrors.map((e: any) => e.message).join(', ')}`);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Order Management
  async getOrders(filters?: ShopifyOrderFilters): Promise<ShopifyOrder[]> {
    try {
      const ordersResponse = await this.getOrdersWithPagination(filters);
      return ordersResponse.orders;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrdersWithPagination(filters?: ShopifyOrderFilters): Promise<ShopifyOrdersResponse> {
    try {
      const limit = filters?.limit || 10;
      const query = this.buildOrderSearchQuery(filters);
      const cursor = filters?.cursor;

      const gqlQuery = `
        query GetOrders($first: Int!, $query: String, $after: String) {
          orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true, after: $after) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            nodes {
              id
              name
              createdAt
              updatedAt
              processedAt
              currencyCode
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              subtotalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              totalTaxSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              totalDiscountsSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              displayFinancialStatus
              displayFulfillmentStatus
              customer { id }
              lineItems(first: 50) {
                nodes {
                  id
                  title
                  quantity
                  variant {
                    id
                    title
                    sku
                  }
                  originalUnitPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                    presentmentMoney {
                      amount
                      currencyCode
                    }
                  }
                  customAttributes {
                    key
                    value
                  }
                }
              }
              tags
              note
            }
          }
        }
      `;

      const variables = {
        first: limit,
        query: query || undefined,
        after: cursor || undefined
      };

      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      
      return {
        orders: this.transformOrdersData(data.orders.nodes),
        hasNextPage: data.orders.pageInfo.hasNextPage,
        hasPreviousPage: data.orders.pageInfo.hasPreviousPage,
        pageInfo: data.orders.pageInfo
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrder(id: string): Promise<ShopifyOrder> {
    try {
      const gqlQuery = `
        query GetOrder($id: ID!) {
          order(id: $id) {
            id
            name
            createdAt
            updatedAt
            processedAt
            currencyCode
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            subtotalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            totalTaxSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            displayFinancialStatus
            displayFulfillmentStatus
            customer { id }
            lineItems(first: 50) {
              nodes {
                id
                title
                quantity
                variant {
                  id
                  title
                  sku
                }
                originalUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
              }
            }
            tags
            note
          }
        }
      `;

      const variables = { id };
      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      return this.transformOrderData(data.order);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createOrder(orderData: ShopifyOrderRequest & { 
    discountCode?: string; 
    discountType?: 'percentage' | 'fixed'; 
    discountValue?: number;
    taxBreakdown?: any;
    totalTax?: number;
  }): Promise<ShopifyOrder> {
    try {
      const gqlQuery = `
        mutation OrderCreate($order: OrderCreateOrderInput!) {
          orderCreate(order: $order) {
            order {
              id
              name
              createdAt
              displayFinancialStatus
              displayFulfillmentStatus
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              totalTaxSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              totalDiscountsSet {
                shopMoney {
                  amount
                  currencyCode
                }
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
              taxLines {
                title
                rate
                priceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
              }
              customer { id }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const orderInput = this.transformOrderInput(orderData);
      const variables = { order: orderInput };
      
      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      
      if (data.orderCreate.userErrors.length > 0) {
        throw new Error(`Order creation failed: ${data.orderCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return this.transformOrderData(data.orderCreate.order);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Customer Management
  async getCustomers(): Promise<ShopifyCustomer[]> {
    try {
      const gqlQuery = `
        query GetCustomers($first: Int!) {
          customers(first: $first) {
            nodes {
              id
            }
          }
        }
      `;

      const variables = { first: 250 }; // Max limit for GraphQL
      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      return this.transformCustomersData(data.customers.nodes);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCustomer(id: string): Promise<ShopifyCustomer> {
    try {
      const gqlQuery = `
        query GetCustomer($id: ID!) {
          customer(id: $id) {
            id
            firstName
            lastName
            email
            phone
            createdAt
            updatedAt
            numberOfOrders
            amountSpent {
              amount
              currencyCode
            }
            defaultAddress {
              id
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
              phone
            }
            addresses(first: 10) {
              id
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
              phone
            }
            tags
            note
            state
            taxExempt
            verifiedEmail
          }
        }
      `;

      const variables = { id };
      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      return this.transformCustomerData(data.customer);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCustomer(customerData: Partial<ShopifyCustomer>): Promise<ShopifyCustomer> {
    try {
      const gqlQuery = `
        mutation CustomerCreate($input: CustomerInput!) {
          customerCreate(input: $input) {
            customer {
              id
              firstName
              lastName
              email
              phone
              createdAt
              state
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const input = {
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        email: customerData.email,
        phone: customerData.phone,
        tags: customerData.tags ? customerData.tags.split(',').map(tag => tag.trim()) : [],
        note: customerData.note,
        taxExempt: customerData.tax_exempt || false
      };

      const variables = { input };
      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      
      if (data.customerCreate.userErrors.length > 0) {
        throw new Error(`Customer creation failed: ${data.customerCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return this.transformCustomerData(data.customerCreate.customer);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Store Statistics
  async getStoreStats(): Promise<ShopifyStoreStats> {
    try {
      // Shop basic info
      const shopQuery = `
        query GetStoreStatsShop {
          shop { id name email }
        }
      `;
      const shopData = await this.makeGraphQLRequest(shopQuery, {});
      
      // For revenue calculation, we need a separate query
      const revenueQuery = `
        query GetRevenue {
          orders(first: 250, query: "financial_status:paid") {
            nodes {
              totalPriceSet {
                shopMoney {
                  amount
                }
              }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
      `;

      const revenueData = await this.makeGraphQLRequest(revenueQuery, {});
      const totalRevenue = revenueData.orders.nodes.reduce((sum: number, order: any) => {
        return sum + parseFloat(order.totalPriceSet.shopMoney.amount);
      }, 0);

      // Lightweight counts via pagination (nodes + pageInfo)
      const productsCountQuery = `
        query ProductsCount($first: Int!, $after: String) {
          products(first: $first, after: $after) {
            nodes { id }
            pageInfo { hasNextPage endCursor }
          }
        }
      `;
      const ordersCountQuery = `
        query OrdersCount($first: Int!, $after: String) {
          orders(first: $first, after: $after) {
            nodes { id }
            pageInfo { hasNextPage endCursor }
          }
        }
      `;
      const customersCountQuery = `
        query CustomersCount($first: Int!, $after: String) {
          customers(first: $first, after: $after) {
            nodes { id }
            pageInfo { hasNextPage endCursor }
          }
        }
      `;

      const [totalProducts, totalOrders, totalCustomers] = await Promise.all([
        this.countConnection(productsCountQuery, 'products'),
        this.countConnection(ordersCountQuery, 'orders'),
        this.countConnection(customersCountQuery, 'customers')
      ]);

      return {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        topSellingProducts: [],
        recentOrders: [],
        inventoryAlerts: {
          lowStock: [],
          outOfStock: []
        },
        salesByPeriod: []
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Helper methods for data transformation
  private transformProductsData(nodes: any[]): ShopifyProduct[] {
    return nodes.map(node => this.transformProductData(node));
  }

  private transformProductData(node: any): ShopifyProduct {
    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description || '',
      productType: node.productType || '',
      vendor: node.vendor || '',
      tags: node.tags || [],
      status: node.status?.toLowerCase() || 'draft',
      publishedAt: node.publishedAt || node.createdAt,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      variants: this.transformVariantsData(node.variants?.nodes || []),
      images: this.transformImagesData(node.media?.nodes || []),
      options: this.transformOptionsData(node.options || []),
      metafields: [],
      seo: {
        title: node.seo?.title || node.title,
        description: node.seo?.description || node.description || ''
      },
      inventoryQuantity: node.totalInventory || 0,
      totalInventory: node.totalInventory || 0,
      price: {
        min: node.variants?.nodes?.[0]?.price || 0,
        max: node.variants?.nodes?.reduce((max: number, variant: any) => 
          Math.max(max, parseFloat(variant.price)), 0) || 0,
        currency: 'INR'
      }
    };
  }

  private transformVariantsData(nodes: any[]): any[] {
    return nodes.map(node => ({
      id: node.id,
      title: node.title || 'Default Title',
      sku: node.sku || '',
      barcode: node.barcode || '',
      price: parseFloat(node.price) || 0,
      compareAtPrice: parseFloat(node.compareAtPrice) || 0,
      cost: 0,
      weight: 0,
      weightUnit: 'kg',
      inventoryQuantity: node.inventoryQuantity || 0,
      inventoryPolicy: node.inventoryPolicy?.toLowerCase() || 'deny',
      fulfillmentService: 'manual',
      requiresShipping: true,
      taxable: true,
      option1: node.selectedOptions?.[0]?.value,
      option2: node.selectedOptions?.[1]?.value,
      option3: node.selectedOptions?.[2]?.value,
      position: node.position || 1,
      createdAt: node.createdAt || new Date().toISOString(),
      updatedAt: node.updatedAt || new Date().toISOString()
    }));
  }

  private transformImagesData(nodes: any[]): any[] {
    return nodes.map((node, index) => ({
      id: node.id,
      src: node.image?.url || '',
      alt: node.alt || '',
      width: 0,
      height: 0,
      position: index + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  private transformOptionsData(options: any[]): any[] {
    return options.map(option => ({
      id: option.id,
      name: option.name,
      position: option.position,
      values: option.values || []
    }));
  }

  private transformOrdersData(nodes: any[]): ShopifyOrder[] {
    return nodes.map(node => this.transformOrderData(node));
  }

  private transformOrderData(node: any): ShopifyOrder {
    const totalPrice = node.totalPriceSet?.shopMoney?.amount || '0';
    const subtotalPrice = node.subtotalPriceSet?.shopMoney?.amount || '0';
    const totalTax = node.totalTaxSet?.shopMoney?.amount || '0';
    const currency = node.currencyCode || 'INR';

    return {
      id: node.id,
      admin_graphql_api_id: node.id,
      buyer_accepts_marketing: false,
      created_at: node.createdAt,
      currency: currency,
      current_subtotal_price: subtotalPrice,
      current_total_discounts: node.totalDiscountsSet?.shopMoney?.amount || '0',
      current_total_price: totalPrice,
      current_total_tax: totalTax,
      customer_locale: 'en',
      //@ts-ignore
      financial_status: this.mapFinancialStatus(node.displayFinancialStatus),
      //@ts-ignore
      fulfillment_status: this.mapFulfillmentStatus(node.displayFulfillmentStatus),
      name: node.name,
      note: node.note,
      number: parseInt(node.name?.replace('#', '') || '0'),
      order_number: parseInt(node.name?.replace('#', '') || '0'),
      processed_at: node.processedAt || node.createdAt,
      subtotal_price: subtotalPrice,
      tags: node.tags?.join(',') || '',
      total_discounts: node.totalDiscountsSet?.shopMoney?.amount || '0',
      totalDiscountsSet: node.totalDiscountsSet ? {
        shopMoney: {
          amount: parseFloat(node.totalDiscountsSet.shopMoney?.amount || '0'),
          currencyCode: node.totalDiscountsSet.shopMoney?.currencyCode || currency
        },
        presentmentMoney: {
          amount: parseFloat(node.totalDiscountsSet.presentmentMoney?.amount || node.totalDiscountsSet.shopMoney?.amount || '0'),
          currencyCode: node.totalDiscountsSet.presentmentMoney?.currencyCode || node.totalDiscountsSet.shopMoney?.currencyCode || currency
        }
      } : undefined,
      total_line_items_price: subtotalPrice,
      total_outstanding: '0',
      total_price: totalPrice,
      total_tax: totalTax,
      total_tip_received: '0',
      total_weight: 0,
      updated_at: node.updatedAt,
      customer: this.transformCustomerData(node.customer),
      line_items: this.transformLineItemsData(node.lineItems?.nodes || []),
      billing_address: this.transformAddressData(node.billingAddress),
      shipping_address: this.transformAddressData(node.shippingAddress),
      fulfillments: [],
      refunds: []
    };
  }

  private transformCustomersData(nodes: any[]): ShopifyCustomer[] {
    return nodes.map(node => this.transformCustomerData(node));
  }

  private transformCustomerData(node: any): ShopifyCustomer {
    if (!node) return null as any;

    return {
      id: node.id,
      admin_graphql_api_id: node.id,
      created_at: '',
      currency: 'INR',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      state: 'enabled',
      tags: '',
      tax_exempt: false,
      tax_exemptions: [],
      total_spent: 0,
      updated_at: '',
      verified_email: false,
      orders_count: 0,
      note: '',
      //@ts-ignore
      default_address: null,
      addresses: []
    };
  }

  private transformAddressData(address: any): any {
    if (!address) return null;

    return {
      id: address.id,
      first_name: address.firstName,
      last_name: address.lastName,
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      province: address.province,
      country: address.country,
      zip: address.zip,
      phone: address.phone,
      name: `${address.firstName || ''} ${address.lastName || ''}`.trim(),
      default: address.default || false
    };
  }

  private transformLineItemsData(nodes: any[]): any[] {
    return nodes.map(node => ({
      id: node.id,
      title: node.title,
      quantity: node.quantity,
      price: node.originalUnitPriceSet?.shopMoney?.amount || '0',
      variant_id: node.variant?.id || '',
      variant_title: node.variant?.title,
      sku: node.variant?.sku,
      name: node.title,
      product_id: '', // Not directly available in line item
      fulfillment_status: null,
      gift_card: false,
      grams: 0,
      price_set: {
        shop_money: {
          amount: node.originalUnitPriceSet?.shopMoney?.amount || '0',
          currency_code: node.originalUnitPriceSet?.shopMoney?.currencyCode || 'INR'
        }
      },
      originalUnitPriceSet: node.originalUnitPriceSet ? {
        shopMoney: {
          amount: parseFloat(node.originalUnitPriceSet.shopMoney?.amount || '0'),
          currencyCode: node.originalUnitPriceSet.shopMoney?.currencyCode || 'INR'
        },
        presentmentMoney: {
          amount: parseFloat(node.originalUnitPriceSet.presentmentMoney?.amount || node.originalUnitPriceSet.shopMoney?.amount || '0'),
          currencyCode: node.originalUnitPriceSet.presentmentMoney?.currencyCode || node.originalUnitPriceSet.shopMoney?.currencyCode || 'INR'
        }
      } : undefined,
      properties: node.customAttributes?.map((attr: any) => ({
        name: attr.key,
        value: attr.value
      })) || [],
      taxable: true,
      total_discount: '0',
      vendor: ''
    }));
  }

  private transformOrderInput(orderData: ShopifyOrderRequest & { 
    discountCode?: string; 
    discountType?: 'percentage' | 'fixed'; 
    discountValue?: number;
    taxBreakdown?: any;
    totalTax?: number;
  }): any {
    const input: any = {
      email: orderData.email,
      lineItems: orderData.lineItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }))
    };

    if (orderData.customer) {
      if (orderData.customer.id) {
        input.customerId = orderData.customer.id;
      } else {
        input.customer = {
          toUpsert: {
            firstName: orderData.customer.first_name,
            lastName: orderData.customer.last_name,
            email: orderData.customer.email,
            phone: orderData.customer.phone
          }
        };
      }
    }

    if (orderData.shippingAddress) {
      input.shippingAddress = {
        firstName: orderData.shippingAddress.first_name,
        lastName: orderData.shippingAddress.last_name,
        address1: orderData.shippingAddress.address1,
        address2: orderData.shippingAddress.address2,
        city: orderData.shippingAddress.city,
        province: orderData.shippingAddress.province,
        country: orderData.shippingAddress.country,
        zip: orderData.shippingAddress.zip,
        phone: orderData.shippingAddress.phone
      };
    }

    if (orderData.billingAddress) {
      input.billingAddress = {
        firstName: orderData.billingAddress.first_name,
        lastName: orderData.billingAddress.last_name,
        address1: orderData.billingAddress.address1,
        address2: orderData.billingAddress.address2,
        city: orderData.billingAddress.city,
        province: orderData.billingAddress.province,
        country: orderData.billingAddress.country,
        zip: orderData.billingAddress.zip,
        phone: orderData.billingAddress.phone
      };
    }

    // Add discount code support
    if (orderData.discountCode && orderData.discountType && orderData.discountValue) {
      if (orderData.discountType === 'percentage') {
        input.discountCode = {
          itemPercentageDiscountCode: {
            code: orderData.discountCode,
            percentage: orderData.discountValue / 100
          }
        };
      } else if (orderData.discountType === 'fixed') {
        input.discountCode = {
          itemFixedDiscountCode: {
            code: orderData.discountCode,
            amountSet: {
              shopMoney: {
                amount: orderData.discountValue.toString(),
                currencyCode: 'INR'
              }
            }
          }
        };
      }
    }

    if (orderData.note) {
      input.note = orderData.note;
    }

    if (orderData.tags) {
      input.tags = orderData.tags;
    }

    // Add tax lines if tax breakdown is provided
    if (orderData.taxBreakdown && orderData.totalTax && orderData.totalTax > 0) {
      try {
        input.taxLines = Object.entries(orderData.taxBreakdown).map(([category, tax]: [string, any]) => ({
          title: tax.name || `Tax (${category})`,
          rate: tax.rate || 0,
          priceSet: {
            shopMoney: {
              amount: (tax.amount || 0).toFixed(2),
              currencyCode: 'INR'
            }
          }
        }));
        console.log('Tax lines added to order:', input.taxLines);
      } catch (error) {
        console.error('Error creating tax lines:', error);
        // Continue without tax lines if there's an error
      }
    }

    return input;
  }

  private buildOrderSearchQuery(filters?: ShopifyOrderFilters): string {
    const queryParts: string[] = [];

    if (filters?.financialStatus) {
      queryParts.push(`financial_status:${filters.financialStatus}`);
    }

    if (filters?.fulfillmentStatus) {
      queryParts.push(`fulfillment_status:${filters.fulfillmentStatus}`);
    }

    if (filters?.searchTerm) {
      queryParts.push(`name:*${filters.searchTerm}* OR email:*${filters.searchTerm}*`);
    }

    return queryParts.join(' AND ');
  }

  private mapFinancialStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'pending',
      'AUTHORIZED': 'authorized',
      'PAID': 'paid',
      'PARTIALLY_PAID': 'partially_paid',
      'REFUNDED': 'refunded',
      'VOIDED': 'voided',
      'PARTIALLY_REFUNDED': 'partially_refunded'
    };
    return statusMap[status] || 'pending';
  }

  private mapFulfillmentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'UNFULFILLED': 'unfulfilled',
      'PARTIALLY_FULFILLED': 'partial',
      'FULFILLED': 'fulfilled',
      'RESTOCKED': 'restocked'
    };
    return statusMap[status] || 'unfulfilled';
  }

  // Analytics Methods
  async getAnalytics(filters?: ShopifyAnalyticsFilters): Promise<ShopifyAnalyticsResponse> {
    try {
      const dateFrom = filters?.dateFrom || this.getDateDaysAgo(30);
      const dateTo = filters?.dateTo || new Date().toISOString().split('T')[0];
      
      // Fetch analytics data in parallel
      const [
        salesData,
        ordersData,
        customersData,
        topProductsData,
        salesLocationData
      ] = await Promise.all([
        this.getSalesAnalytics(dateFrom, dateTo),
        this.getOrdersAnalytics(dateFrom, dateTo),
        this.getCustomersAnalytics(dateFrom, dateTo),
        this.getTopProductsAnalytics(dateFrom, dateTo),
        this.getSalesByLocationAnalytics(dateFrom, dateTo)
      ]);

      return {
        salesOverTime: salesData.timeSeries,
        totalSales: salesData.metric,
        ordersOverTime: ordersData.timeSeries,
        totalOrders: ordersData.metric,
        averageOrderValue: ordersData.aovMetric,
        customersOverTime: customersData.timeSeries,
        totalCustomers: customersData.metric,
        newCustomers: customersData.newCustomersMetric,
        topProducts: topProductsData,
        salesByLocation: salesLocationData,
        trafficSources: [] // Not available in GraphQL Admin API
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async getSalesAnalytics(dateFrom: string, dateTo: string) {
    const queryString = `created_at:>=${dateFrom} AND created_at:<=${dateTo}`;
    
    const gqlQuery = `
      query GetSalesAnalytics($query: String!) {
        orders(first: 250, query: $query) {
          nodes {
            id
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `;

    const variables = {
      query: queryString
    };

    const data = await this.makeGraphQLRequest(gqlQuery, variables);
    return this.processSalesTimeSeries(data.orders.nodes, dateFrom, dateTo);
  }

  private async getOrdersAnalytics(dateFrom: string, dateTo: string) {
    const queryString = `created_at:>=${dateFrom} AND created_at:<=${dateTo}`;
    
    const gqlQuery = `
      query GetOrdersAnalytics($query: String!) {
        orders(first: 250, query: $query) {
          nodes {
            id
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `;

    const variables = {
      query: queryString
    };

    const data = await this.makeGraphQLRequest(gqlQuery, variables);
    return this.processOrdersTimeSeries(data.orders.nodes, dateFrom, dateTo);
  }

  private async getCustomersAnalytics(dateFrom: string, dateTo: string) {
    const queryString = `created_at:>=${dateFrom} AND created_at:<=${dateTo}`;
    
    const gqlQuery = `
      query GetCustomersAnalytics($query: String!) {
        customers(first: 250, query: $query) {
          nodes {
            id
            createdAt
          }
        }
      }
    `;

    const variables = {
      query: queryString
    };

    const data = await this.makeGraphQLRequest(gqlQuery, variables);
    return this.processCustomersTimeSeries(data.customers.nodes, dateFrom, dateTo);
  }

  private async getTopProductsAnalytics(dateFrom: string, dateTo: string) {
    const queryString = `created_at:>=${dateFrom} AND created_at:<=${dateTo}`;
    
    const gqlQuery = `
      query GetTopProductsAnalytics($query: String!) {
        orders(first: 250, query: $query) {
          nodes {
            lineItems(first: 50) {
              nodes {
                id
                title
                quantity
                originalUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                product {
                  id
                  title
                  images(first: 1) {
                    nodes {
                      src
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      query: queryString
    };

    const data = await this.makeGraphQLRequest(gqlQuery, variables);
    return this.processTopProducts(data.orders.nodes);
  }

  private async getSalesByLocationAnalytics(dateFrom: string, dateTo: string) {
    const queryString = `created_at:>=${dateFrom} AND created_at:<=${dateTo}`;
    
    const gqlQuery = `
      query GetSalesByLocationAnalytics($query: String!) {
        orders(first: 250, query: $query) {
          nodes {
            shippingAddress {
              country
              province
            }
            totalPriceSet {
              shopMoney {
                amount
              }
            }
          }
        }
      }
    `;

    const variables = {
      query: queryString
    };

    const data = await this.makeGraphQLRequest(gqlQuery, variables);
    return this.processSalesByLocation(data.orders.nodes);
  }

  private processSalesTimeSeries(orders: any[], dateFrom: string, dateTo: string) {
    const dailySales = this.groupByDate(orders, (order) => ({
      date: order.createdAt.split('T')[0],
      value: parseFloat(order.totalPriceSet?.shopMoney?.amount || '0')
    }));

    const timeSeries = this.fillMissingDates(dailySales, dateFrom, dateTo);
    const currentTotal = timeSeries.reduce((sum, point) => sum + point.value, 0);
    
    // Calculate previous period for comparison
    const previousPeriodStart = this.getDateDaysAgo(this.getDaysBetween(dateFrom, dateTo) * 2);
    const previousPeriodEnd = dateFrom;
    
    return {
      timeSeries,
      metric: this.calculateMetric(currentTotal, 0) // Previous period calculation would require another API call
    };
  }

  private processOrdersTimeSeries(orders: any[], dateFrom: string, dateTo: string) {
    const dailyOrders = this.groupByDate(orders, (order) => ({
      date: order.createdAt.split('T')[0],
      value: 1
    }));

    const timeSeries = this.fillMissingDates(dailyOrders, dateFrom, dateTo);
    const currentTotal = timeSeries.reduce((sum, point) => sum + point.value, 0);
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPriceSet?.shopMoney?.amount || '0'), 0);
    const aov = currentTotal > 0 ? totalRevenue / currentTotal : 0;
    
    return {
      timeSeries,
      metric: this.calculateMetric(currentTotal, 0),
      aovMetric: this.calculateMetric(aov, 0)
    };
  }

  private processCustomersTimeSeries(customers: any[], dateFrom: string, dateTo: string) {
    const dailyCustomers = this.groupByDate(customers, (customer) => ({
      date: customer.createdAt.split('T')[0],
      value: 1
    }));

    const timeSeries = this.fillMissingDates(dailyCustomers, dateFrom, dateTo);
    const currentTotal = timeSeries.reduce((sum, point) => sum + point.value, 0);
    
    return {
      timeSeries,
      metric: this.calculateMetric(currentTotal, 0),
      newCustomersMetric: this.calculateMetric(currentTotal, 0)
    };
  }

  private processTopProducts(orders: any[]) {
    const productStats = new Map<string, { title: string; totalSold: number; revenue: number; image?: string }>();

    orders.forEach(order => {
      order.lineItems.nodes.forEach((item: any) => {
        if (item.product) {
          const productId = item.product.id;
          const existing = productStats.get(productId) || {
            title: item.product.title,
            totalSold: 0,
            revenue: 0,
            image: item.product.images?.nodes?.[0]?.src
          };

          existing.totalSold += item.quantity;
          existing.revenue += parseFloat(item.originalUnitPriceSet?.shopMoney?.amount || '0') * item.quantity;
          productStats.set(productId, existing);
        }
      });
    });

    return Array.from(productStats.entries())
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }

  private processSalesByLocation(orders: any[]) {
    const locationStats = new Map<string, { sales: number; orders: number }>();

    orders.forEach(order => {
      const country = order.shippingAddress?.country || 'Unknown';
      const existing = locationStats.get(country) || { sales: 0, orders: 0 };
      
      existing.sales += parseFloat(order.totalPriceSet?.shopMoney?.amount || '0');
      existing.orders += 1;
      locationStats.set(country, existing);
    });

    return Array.from(locationStats.entries())
      .map(([country, stats]) => ({ country, ...stats }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  }

  private groupByDate<T>(items: any[], mapper: (item: any) => { date: string; value: number }): ShopifyAnalyticsDataPoint[] {
    const grouped = new Map<string, number>();
    
    items.forEach(item => {
      const { date, value } = mapper(item);
      grouped.set(date, (grouped.get(date) || 0) + value);
    });

    return Array.from(grouped.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private fillMissingDates(data: ShopifyAnalyticsDataPoint[], dateFrom: string, dateTo: string): ShopifyAnalyticsDataPoint[] {
    const result: ShopifyAnalyticsDataPoint[] = [];
    const dataMap = new Map(data.map(point => [point.date, point.value]));
    
    const currentDate = new Date(dateFrom);
    const endDate = new Date(dateTo);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        value: dataMap.get(dateStr) || 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  private calculateMetric(current: number, previous: number): ShopifyAnalyticsMetric {
    const change = current - previous;
    const changePercent = previous > 0 ? (change / previous) * 100 : 0;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

    return {
      current,
      previous,
      change,
      changePercent,
      trend
    };
  }

  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  private getDaysBetween(dateFrom: string, dateTo: string): number {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Abandoned Checkout Management
  async getAbandonedCheckouts(filters?: ShopifyAbandonedCheckoutFilters): Promise<ShopifyAbandonedCheckout[]> {
    try {
      const query = `
        query GetAbandonedCheckouts($first: Int, $after: String, $query: String, $sortKey: AbandonedCheckoutSortKeys, $reverse: Boolean) {
          abandonedCheckouts(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
            edges {
              cursor
              node {
                id
                abandonedCheckoutUrl
                createdAt
                updatedAt
                completedAt
                name
                note
                totalPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                subtotalPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalDiscountSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalTaxSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalLineItemsPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                taxesIncluded
                discountCodes
                customAttributes {
                  key
                  value
                }
                customer {
                  id
                }
                lineItems(first: 10) {
                  edges {
                    node {
                      id
                      title
                      quantity
                      sku
                      variantTitle
                      originalUnitPriceSet {
                        presentmentMoney {
                          amount
                          currencyCode
                        }
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                      originalTotalPriceSet {
                        presentmentMoney {
                          amount
                          currencyCode
                        }
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                      product {
                        id
                        title
                        handle
                      }
                      variant {
                        id
                        title
                        sku
                      }
                      image {
                        id
                        src
                      }
                    }
                  }
                }
                taxLines {
                  title
                  priceSet {
                    presentmentMoney {
                      amount
                      currencyCode
                    }
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  rate
                  ratePercentage
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      `;

      const variables = {
        first: filters?.limit || 50,
        after: filters?.cursor,
        query: this.buildAbandonedCheckoutQuery(filters),
        sortKey: filters?.sortKey || 'CREATED_AT',
        reverse: filters?.reverse || false
      };

      const result = await this.makeGraphQLRequest(query, variables);
      // Handle both response structures: result.abandonedCheckouts.edges or result.edges
      const edges = result.abandonedCheckouts?.edges || result.edges;
      return edges.map((edge: any) => this.transformAbandonedCheckout(edge.node));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAbandonedCheckoutsWithPagination(filters?: ShopifyAbandonedCheckoutFilters): Promise<ShopifyAbandonedCheckoutsResponse> {
    try {
      const abandonedCheckouts = await this.getAbandonedCheckouts(filters);
      
      // Get count for total
      const countQuery = `
        query GetAbandonedCheckoutsCount($query: String) {
          abandonedCheckoutsCount(query: $query) {
            count
            precision
          }
        }
      `;

      const countResult = await this.makeGraphQLRequest(countQuery, {
        query: this.buildAbandonedCheckoutQuery(filters)
      });

      return {
        abandonedCheckouts,
        hasNextPage: false, // This would need to be determined from the actual response
        hasPreviousPage: false,
        totalCount: countResult.abandonedCheckoutsCount?.count || countResult.count || 0,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: undefined,
          endCursor: undefined
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAbandonedCheckout(id: string): Promise<ShopifyAbandonedCheckout> {
    try {
      const query = `
        query GetAbandonedCheckout($id: ID!) {
          abandonedCheckout(id: $id) {
            id
            abandonedCheckoutUrl
            createdAt
            updatedAt
            completedAt
            closedAt
            name
            note
            token
            cartToken
            currencyCode
            presentmentCurrencyCode
            totalPriceSet {
              presentmentMoney {
                amount
                currencyCode
              }
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              id
              firstName
              lastName
              email
              phone
              displayName
            }
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                  sku
                  variantTitle
                  originalUnitPriceSet {
                    presentmentMoney {
                      amount
                      currencyCode
                    }
                  }
                  product {
                    id
                    title
                    handle
                  }
                  variant {
                    id
                    title
                    sku
                  }
                }
              }
            }
          }
        }
      `;

      const result = await this.makeGraphQLRequest(query, { id });
      return this.transformAbandonedCheckout(result.abandonedCheckout);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAbandonedCheckoutsCount(filters?: ShopifyAbandonedCheckoutFilters): Promise<number> {
    try {
      const query = `
        query GetAbandonedCheckoutsCount($query: String) {
          abandonedCheckoutsCount(query: $query) {
            count
            precision
          }
        }
      `;

      const result = await this.makeGraphQLRequest(query, {
        query: this.buildAbandonedCheckoutQuery(filters)
      });

      return result.abandonedCheckoutsCount?.count || result.count || 0;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Discount Code Management for Recovery
  async createDiscountCode(discountData: ShopifyDiscountCodeRequest): Promise<any> {
    try {
      const query = `
        mutation CreateDiscountCode($basicCodeDiscount: DiscountCodeBasicInput!) {
          discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
            codeDiscountNode {
              id
              codeDiscount {
                ... on DiscountCodeBasic {
                  title
                  startsAt
                  endsAt
                  status
                }
              }
            }
            userErrors {
              field
              message
              code
            }
          }
        }
      `;

      const variables = {
        basicCodeDiscount: {
          title: discountData.title,
          code: discountData.code,
          startsAt: discountData.startsAt,
          endsAt: discountData.endsAt,
          customerSelection: discountData.customerSelection,
          customerGets: discountData.customerGets,
          minimumRequirement: discountData.minimumRequirement,
          usageLimit: discountData.usageLimit,
          appliesOncePerCustomer: discountData.appliesOncePerCustomer
        }
      };

      const result = await this.makeGraphQLRequest(query, variables);
      
      if (result.discountCodeBasicCreate.userErrors.length > 0) {
        throw new Error(`Discount code creation failed: ${result.discountCodeBasicCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return result.discountCodeBasicCreate.codeDiscountNode;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateDiscountCode(id: string, discountData: Partial<ShopifyDiscountCodeRequest>): Promise<any> {
    try {
      const query = `
        mutation UpdateDiscountCode($id: ID!, $basicCodeDiscount: DiscountCodeBasicInput!) {
          discountCodeBasicUpdate(id: $id, basicCodeDiscount: $basicCodeDiscount) {
            codeDiscountNode {
              id
              codeDiscount {
                ... on DiscountCodeBasic {
                  title
                  startsAt
                  endsAt
                  status
                }
              }
            }
            userErrors {
              field
              message
              code
            }
          }
        }
      `;

      const variables = {
        id,
        basicCodeDiscount: {
          title: discountData.title,
          code: discountData.code,
          startsAt: discountData.startsAt,
          endsAt: discountData.endsAt,
          customerSelection: discountData.customerSelection,
          customerGets: discountData.customerGets,
          minimumRequirement: discountData.minimumRequirement,
          usageLimit: discountData.usageLimit,
          appliesOncePerCustomer: discountData.appliesOncePerCustomer
        }
      };

      const result = await this.makeGraphQLRequest(query, variables);
      
      if (result.discountCodeBasicUpdate.userErrors.length > 0) {
        throw new Error(`Discount code update failed: ${result.discountCodeBasicUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return result.discountCodeBasicUpdate.codeDiscountNode;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteDiscountCode(id: string): Promise<void> {
    try {
      const query = `
        mutation DeleteDiscountCode($id: ID!) {
          discountCodeBasicDelete(id: $id) {
            deletedId
            userErrors {
              field
              message
              code
            }
          }
        }
      `;

      const result = await this.makeGraphQLRequest(query, { id });
      
      if (result.discountCodeBasicDelete.userErrors.length > 0) {
        throw new Error(`Discount code deletion failed: ${result.discountCodeBasicDelete.userErrors.map((e: any) => e.message).join(', ')}`);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private buildAbandonedCheckoutQuery(filters?: ShopifyAbandonedCheckoutFilters): string {
    if (!filters) return '';

    const conditions: string[] = [];

    if (filters.searchTerm) {
      conditions.push(`name:*${filters.searchTerm}* OR customer_email:*${filters.searchTerm}*`);
    }

    if (filters.customerId) {
      conditions.push(`customer_id:${filters.customerId}`);
    }

    if (filters.createdAtAfter) {
      conditions.push(`created_at:>=${filters.createdAtAfter}`);
    }

    if (filters.createdAtBefore) {
      conditions.push(`created_at:<=${filters.createdAtBefore}`);
    }

    if (filters.totalPriceMin) {
      conditions.push(`total_price:>=${filters.totalPriceMin}`);
    }

    if (filters.totalPriceMax) {
      conditions.push(`total_price:<=${filters.totalPriceMax}`);
    }

    if (filters.hasCustomer) {
      conditions.push(`customer_id:*`);
    }

    if (filters.hasEmail) {
      conditions.push(`customer_email:*`);
    }

    if (filters.hasPhone) {
      conditions.push(`customer_phone:*`);
    }

    return conditions.join(' AND ');
  }

  private transformAbandonedCheckout(data: any): ShopifyAbandonedCheckout {
    return {
      id: data.id,
      abandonedCheckoutUrl: data.abandonedCheckoutUrl,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      completedAt: data.completedAt,
      closedAt: data.closedAt || null,
      name: data.name,
      note: data.note,
      token: data.token || '',
      cartToken: data.cartToken || '',
      currencyCode: data.currencyCode || data.totalPriceSet?.presentmentMoney?.currencyCode || 'USD',
      presentmentCurrencyCode: data.presentmentCurrencyCode || data.totalPriceSet?.presentmentMoney?.currencyCode || 'USD',
      totalPriceSet: data.totalPriceSet,
      subtotalPriceSet: data.subtotalPriceSet,
      totalDiscountSet: data.totalDiscountSet,
      totalTaxSet: data.totalTaxSet,
      totalDutiesSet: data.totalDutiesSet,
      totalLineItemsPriceSet: data.totalLineItemsPriceSet,
      taxesIncluded: data.taxesIncluded,
      discountCodes: data.discountCodes || [],
      customAttributes: data.customAttributes || [],
      customer: data.customer ? {
        id: data.customer.id,
        admin_graphql_api_id: data.customer.id,
        created_at: new Date().toISOString(),
        currency: 'USD',
        first_name: 'Customer', // Placeholder due to plan limitations
        last_name: 'Info',
        email: 'customer@example.com', // Placeholder due to plan limitations
        phone: '', // Placeholder due to plan limitations
        state: 'enabled' as const,
        tags: '',
        tax_exempt: false,
        tax_exemptions: [],
        total_spent: 0,
        updated_at: new Date().toISOString(),
        verified_email: true
      } : undefined,
      billingAddress: undefined, // Not available due to plan limitations
      shippingAddress: undefined, // Not available due to plan limitations
      lineItems: data.lineItems?.edges?.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        quantity: edge.node.quantity,
        sku: edge.node.sku,
        variantTitle: edge.node.variantTitle,
        presentmentTitle: edge.node.presentmentTitle || edge.node.title,
        presentmentVariantTitle: edge.node.presentmentVariantTitle || edge.node.variantTitle,
        requiresShipping: edge.node.requiresShipping || true,
        weight: edge.node.weight || 0,
        fulfillmentService: edge.node.fulfillmentService || 'manual',
        originalUnitPriceSet: edge.node.originalUnitPriceSet,
        originalTotalPriceSet: edge.node.originalTotalPriceSet,
        discountedUnitPriceSet: edge.node.discountedUnitPriceSet,
        discountedTotalPriceSet: edge.node.discountedTotalPriceSet,
        discountedUnitPriceWithCodeDiscount: edge.node.discountedUnitPriceWithCodeDiscount,
        discountedTotalPriceWithCodeDiscount: edge.node.discountedTotalPriceWithCodeDiscount,
        customAttributes: edge.node.customAttributes || [],
        discountAllocations: edge.node.discountAllocations || [],
        taxLines: edge.node.taxLines || [],
        product: edge.node.product,
        variant: edge.node.variant,
        image: edge.node.image ? {
          ...edge.node.image,
          alt: edge.node.image.alt || edge.node.title
        } : undefined
      })) || [],
      taxLines: data.taxLines || [],
      shippingLines: data.shippingLines,
      referringSite: data.referringSite || null,
      landingSite: data.landingSite || null,
      gateway: data.gateway || null
    };
  }

  async getDiscountCodes(filters?: ShopifyDiscountCodeFilters): Promise<ShopifyDiscountCodeManagement[]> {
    try {
      const query = `
        query GetDiscountCodes($first: Int, $after: String, $query: String, $sortKey: CodeDiscountSortKeys, $reverse: Boolean) {
          codeDiscountNodes(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
            edges {
              cursor
              node {
                id
                codeDiscount {
                  ... on DiscountCodeBasic {
                    title
                    summary
                    status
                    startsAt
                    endsAt
                    usageLimit
                    appliesOncePerCustomer
                    codes(first: 1) {
                      nodes {
                        id
                        code
                      }
                    }
                  }
                  ... on DiscountCodeBxgy {
                    title
                    summary
                    status
                    startsAt
                    endsAt
                    usageLimit
                    appliesOncePerCustomer
                    codes(first: 1) {
                      nodes {
                        id
                        code
                      }
                    }
                  }
                  ... on DiscountCodeFreeShipping {
                    title
                    summary
                    status
                    startsAt
                    endsAt
                    usageLimit
                    appliesOncePerCustomer
                    codes(first: 1) {
                      nodes {
                        id
                        code
                      }
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      `;

      const variables = {
        first: filters?.first || 50,
        after: filters?.after,
        query: filters?.query,
        sortKey: filters?.sortKey || 'CREATED_AT',
        reverse: filters?.reverse || false
      };

      const result = await this.makeGraphQLRequest(query, variables);
      const edges = result.codeDiscountNodes?.edges || [];
      
      return edges.map((edge: any) => this.transformDiscountCode(edge.node));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private transformDiscountCode(node: any): ShopifyDiscountCodeManagement {
    const codeDiscount = node.codeDiscount;
    const code = codeDiscount.codes?.nodes?.[0]?.code || 'N/A';
    
    // Determine discount type based on __typename
    let type: 'basic' | 'bxgy' | 'free_shipping' | 'app' = 'basic';
    if (codeDiscount.__typename === 'DiscountCodeBxgy') {
      type = 'bxgy';
    } else if (codeDiscount.__typename === 'DiscountCodeFreeShipping') {
      type = 'free_shipping';
    } else if (codeDiscount.__typename === 'DiscountCodeApp') {
      type = 'app';
    }

    return {
      id: node.id,
      title: codeDiscount.title || 'Untitled Discount',
      summary: codeDiscount.summary || '',
      status: codeDiscount.status || 'ACTIVE',
      startsAt: codeDiscount.startsAt || new Date().toISOString(),
      endsAt: codeDiscount.endsAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      usageLimit: codeDiscount.usageLimit,
      appliesOncePerCustomer: codeDiscount.appliesOncePerCustomer || false,
      code,
      discountType: type
    };
  }

  private handleError(error: any): ShopifyError {
    return {
      code: 'GRAPHQL_ERROR',
      message: error.message || 'An unknown GraphQL error occurred',
      field: undefined,
      details: error
    };
  }
}

export const shopifyGraphQLApi = new ShopifyGraphQLApiService();

// Convenience functions for common operations
export const shopifyGraphQL = {
  // Products
  getProducts: (filters?: ShopifyProductFilters) => shopifyGraphQLApi.getProducts(filters),
  getProductsWithPagination: (filters?: ShopifyProductFilters) => shopifyGraphQLApi.getProductsWithPagination(filters),
  getProduct: (id: string) => shopifyGraphQLApi.getProduct(id),
  createProduct: (data: ShopifyProductRequest) => shopifyGraphQLApi.createProduct(data),
  updateProduct: (id: string, data: Partial<ShopifyProductRequest>) => shopifyGraphQLApi.updateProduct(id, data),
  deleteProduct: (id: string) => shopifyGraphQLApi.deleteProduct(id),

  // Orders
  getOrders: (filters?: ShopifyOrderFilters) => shopifyGraphQLApi.getOrders(filters),
  getOrdersWithPagination: (filters?: ShopifyOrderFilters) => shopifyGraphQLApi.getOrdersWithPagination(filters),
  getOrder: (id: string) => shopifyGraphQLApi.getOrder(id),
  createOrder: (data: ShopifyOrderRequest) => shopifyGraphQLApi.createOrder(data),

  // Customers
  getCustomers: () => shopifyGraphQLApi.getCustomers(),
  getCustomer: (id: string) => shopifyGraphQLApi.getCustomer(id),
  createCustomer: (data: Partial<ShopifyCustomer>) => shopifyGraphQLApi.createCustomer(data),

  // Store Info
  getStoreStats: () => shopifyGraphQLApi.getStoreStats(),
  
  // Analytics
  getAnalytics: (filters?: ShopifyAnalyticsFilters) => shopifyGraphQLApi.getAnalytics(filters),

  // Abandoned Checkouts
  getAbandonedCheckouts: (filters?: ShopifyAbandonedCheckoutFilters) => shopifyGraphQLApi.getAbandonedCheckouts(filters),
  getAbandonedCheckoutsWithPagination: (filters?: ShopifyAbandonedCheckoutFilters) => shopifyGraphQLApi.getAbandonedCheckoutsWithPagination(filters),
  getAbandonedCheckout: (id: string) => shopifyGraphQLApi.getAbandonedCheckout(id),
  getAbandonedCheckoutsCount: (filters?: ShopifyAbandonedCheckoutFilters) => shopifyGraphQLApi.getAbandonedCheckoutsCount(filters),

  // Discount Codes for Recovery
  getDiscountCodes: (filters?: ShopifyDiscountCodeFilters) => shopifyGraphQLApi.getDiscountCodes(filters),
  createDiscountCode: (data: ShopifyDiscountCodeRequest) => shopifyGraphQLApi.createDiscountCode(data),
  updateDiscountCode: (id: string, data: Partial<ShopifyDiscountCodeRequest>) => shopifyGraphQLApi.updateDiscountCode(id, data),
  deleteDiscountCode: (id: string) => shopifyGraphQLApi.deleteDiscountCode(id)
};