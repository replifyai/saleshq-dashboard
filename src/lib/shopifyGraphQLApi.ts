import { ShopifyProduct, ShopifyProductRequest, ShopifyOrder, ShopifyOrderRequest, ShopifyCustomer, ShopifyCart, ShopifyCartRequest, ShopifyProductFilters, ShopifyOrderFilters, ShopifyStoreStats, ShopifyError } from '@/types/shopify';

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
      const limit = filters?.limit || 50;
      const query = filters?.searchTerm || '';
      const status = filters?.status ? `status:${filters.status}` : '';
      const searchQuery = [query, status].filter(Boolean).join(' AND ');

      const gqlQuery = `
        query GetProducts($first: Int!, $query: String) {
          products(first: $first, query: $query) {
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
        query: searchQuery || undefined
      };

      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      return this.transformProductsData(data.products.nodes);
    } catch (error) {
      throw this.handleError(error);
    }
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
      const limit = filters?.limit || 50;
      const query = this.buildOrderSearchQuery(filters);

      const gqlQuery = `
        query GetOrders($first: Int!, $query: String) {
          orders(first: $first, query: $query) {
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
        query: query || undefined
      };

      const data = await this.makeGraphQLRequest(gqlQuery, variables);
      return this.transformOrdersData(data.orders.nodes);
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

  async createOrder(orderData: ShopifyOrderRequest & { discountCode?: string; discountType?: 'percentage' | 'fixed'; discountValue?: number }): Promise<ShopifyOrder> {
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
      properties: node.customAttributes?.map((attr: any) => ({
        name: attr.key,
        value: attr.value
      })) || [],
      taxable: true,
      total_discount: '0',
      vendor: ''
    }));
  }

  private transformOrderInput(orderData: ShopifyOrderRequest & { discountCode?: string; discountType?: 'percentage' | 'fixed'; discountValue?: number }): any {
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
  getProduct: (id: string) => shopifyGraphQLApi.getProduct(id),
  createProduct: (data: ShopifyProductRequest) => shopifyGraphQLApi.createProduct(data),
  updateProduct: (id: string, data: Partial<ShopifyProductRequest>) => shopifyGraphQLApi.updateProduct(id, data),
  deleteProduct: (id: string) => shopifyGraphQLApi.deleteProduct(id),

  // Orders
  getOrders: (filters?: ShopifyOrderFilters) => shopifyGraphQLApi.getOrders(filters),
  getOrder: (id: string) => shopifyGraphQLApi.getOrder(id),
  createOrder: (data: ShopifyOrderRequest) => shopifyGraphQLApi.createOrder(data),

  // Customers
  getCustomers: () => shopifyGraphQLApi.getCustomers(),
  getCustomer: (id: string) => shopifyGraphQLApi.getCustomer(id),
  createCustomer: (data: Partial<ShopifyCustomer>) => shopifyGraphQLApi.createCustomer(data),

  // Store Info
  getStoreStats: () => shopifyGraphQLApi.getStoreStats()
};