/**
 * Shopify Integration Types & Interfaces
 * Comprehensive types for Shopify store management
 */

// Core Shopify Product Interface
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  status: 'active' | 'archived' | 'draft';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  variants: ShopifyProductVariant[];
  images: ShopifyProductImage[];
  options: ShopifyProductOption[];
  metafields: ShopifyMetafield[];
  seo: ShopifySEO;
  inventoryQuantity: number;
  totalInventory: number;
  price: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  sku: string;
  barcode: string;
  price: number;
  compareAtPrice: number;
  cost: number;
  weight: number;
  weightUnit: 'kg' | 'lb' | 'oz' | 'g';
  inventoryQuantity: number;
  inventoryPolicy: 'deny' | 'continue' | 'bypass';
  fulfillmentService: string;
  requiresShipping: boolean;
  taxable: boolean;
  option1?: string;
  option2?: string;
  option3?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyProductImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyProductOption {
  id: string;
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifySEO {
  title: string;
  description: string;
}

// Shopify Order Interface - Updated to match actual API response (snake_case)
export interface ShopifyOrder {
  id: string;
  admin_graphql_api_id: string;
  app_id?: number;
  browser_ip?: string;
  buyer_accepts_marketing: boolean;
  cancel_reason?: string;
  cancelled_at?: string;
  cart_token?: string;
  checkout_id?: number;
  checkout_token?: string;
  client_details?: any;
  closed_at?: string;
  confirmation_number?: string;
  confirmed?: boolean;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set?: any;
  current_total_additional_fees_set?: any;
  current_total_discounts: string;
  current_total_discounts_set?: any;
  current_total_duties_set?: any;
  current_total_price: string;
  current_total_price_set?: any;
  current_total_tax: string;
  current_total_tax_set?: any;
  customer_locale: string;
  device_id?: string;
  discount_codes?: any[];
  duties_included?: boolean;
  estimated_taxes?: boolean;
  financial_status: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'voided' | 'partially_refunded';
  fulfillment_status: 'unfulfilled' | 'partial' | 'fulfilled' | 'restocked' | null;
  landing_site?: string;
  landing_site_ref?: string;
  location_id?: string;
  merchant_business_entity_id?: string;
  merchant_of_record_app_id?: string;
  name: string;
  note?: string;
  note_attributes?: any[];
  number: number;
  order_number: number;
  original_total_additional_fees_set?: any;
  original_total_duties_set?: any;
  payment_gateway_names?: string[];
  po_number?: string;
  presentment_currency?: string;
  processed_at: string;
  reference?: string;
  referring_site?: string;
  source_identifier?: string;
  source_name?: string;
  source_url?: string;
  subtotal_price: string;
  subtotal_price_set?: any;
  tags: string;
  tax_exempt?: boolean;
  tax_lines?: any[];
  taxes_included?: boolean;
  test?: boolean;
  token?: string;
  total_cash_rounding_payment_adjustment_set?: any;
  total_cash_rounding_refund_adjustment_set?: any;
  total_discounts: string;
  total_discounts_set?: any;
  total_line_items_price: string;
  total_line_items_price_set?: any;
  total_outstanding: string;
  total_price: string;
  total_price_set?: any;
  total_shipping_price_set?: any;
  total_tax: string;
  total_tax_set?: any;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id?: number;
  billing_address?: ShopifyAddress;
  customer: ShopifyCustomer;
  discount_applications?: any[];
  fulfillments: ShopifyFulfillment[];
  line_items: ShopifyLineItem[];
  payment_terms?: any;
  refunds: ShopifyRefund[];
  shipping_address?: ShopifyAddress;
  shipping_lines?: any[];
}

export interface ShopifyCustomer {
  id: string;
  admin_graphql_api_id: string;
  created_at: string;
  currency: string;
  default_address?: ShopifyAddress;
  email?: string;
  email_marketing_consent?: any;
  first_name?: string;
  last_name?: string;
  marketing_opt_in_level?: 'single_opt_in' | 'double_opt_in';
  multipass_identifier?: string;
  note?: string;
  orders_count?: number;
  phone?: string;
  phone_country_code?: string;
  sms_marketing_consent?: any;
  state: 'enabled' | 'disabled';
  tags: string;
  tax_exempt: boolean;
  tax_exemptions: string[];
  total_spent?: number;
  updated_at: string;
  verified_email: boolean;
  // Additional fields from actual API response
  addresses?: ShopifyAddress[];
  last_order_id?: string;
  last_order_name?: string;
}

export interface ShopifyLineItem {
  id: string;
  admin_graphql_api_id: string;
  attributed_staffs?: any[];
  current_quantity: number;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status?: 'fulfilled' | 'partial' | 'unfulfilled' | null;
  gift_card: boolean;
  grams: number;
  name: string;
  price: string;
  price_set?: any;
  product_exists: boolean;
  product_id: string;
  properties: ShopifyLineItemProperty[];
  quantity: number;
  requires_shipping: boolean;
  sku?: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set?: any;
  variant_id: string;
  variant_inventory_management: string;
  variant_title?: string;
  vendor?: string;
  // Additional fields from actual API response
  discount_allocations?: any[];
  duties?: any[];
  tax_lines?: any[];
}

export interface ShopifyAddress {
  id?: string;
  customer_id?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country: string;
  zip?: string;
  phone?: string;
  name?: string;
  province_code?: string;
  country_code: string;
  country_name?: string;
  default?: boolean;
  // Additional fields from actual API response
  address3?: string;
  latitude?: number;
  longitude?: number;
}

export interface ShopifyFulfillment {
  id: string;
  admin_graphql_api_id: string;
  created_at: string;
  location_id?: number;
  name?: string;
  order_id: string;
  origin_address?: any;
  receipt?: any;
  service?: string;
  shipment_status?: string | null;
  status: 'open' | 'in_progress' | 'success' | 'cancelled' | 'error' | 'failure';
  tracking_company?: string;
  tracking_number?: string;
  tracking_numbers: string[];
  tracking_url?: string;
  tracking_urls: string[];
  updated_at: string;
  line_items: ShopifyLineItem[];
}

export interface ShopifyRefund {
  id: string;
  orderId: string;
  createdAt: string;
  note?: string;
  userId?: string;
  processedAt?: string;
  restock?: boolean;
  duties: ShopifyDuty[];
  adminGraphqlApiId: string;
  orderAdjustments: ShopifyOrderAdjustment[];
  transactions: ShopifyTransaction[];
  refundLineItems: ShopifyRefundLineItem[];
}

export interface ShopifyTransaction {
  id: string;
  orderId: string;
  kind: 'authorization' | 'capture' | 'sale' | 'void' | 'refund';
  status: 'pending' | 'failure' | 'success' | 'error';
  amount: number;
  currency: string;
  currencyExchangeAdjustment?: ShopifyCurrencyExchangeAdjustment;
  deviceId?: string;
  errorCode?: string;
  gateway: string;
  locationId?: string;
  message?: string;
  parentId?: string;
  processedAt?: string;
  sourceName: string;
  sourceType: string;
  test: boolean;
  userId?: string;
  adminGraphqlApiId: string;
  createdAt: string;
  updatedAt: string;
}

// Supporting Interfaces
export interface ShopifyLineItemProperty {
  name: string;
  value: string;
}

export interface ShopifyMoneySet {
  shopMoney: ShopifyMoney;
  presentmentMoney: ShopifyMoney;
}

export interface ShopifyMoney {
  amount: number;
  currencyCode: string;
}

export interface ShopifyDiscountAllocation {
  amount: number;
  discountApplicationIndex: number;
  amountSet: ShopifyMoneySet;
}

export interface ShopifyDuty {
  id: string;
  harmonizedSystemCode: string;
  countryCodeOfOrigin: string;
  shopMoney: ShopifyMoney;
  presentmentMoney: ShopifyMoney;
  taxLines: ShopifyTaxLine[];
  adminGraphqlApiId: string;
}

export interface ShopifyTaxLine {
  price: number;
  rate: number;
  title: string;
  priceSet: ShopifyMoneySet;
}

export interface ShopifyReceipt {
  testcase: boolean;
  authorization: string;
}

export interface ShopifyFulfillmentLineItem {
  id: string;
  shopId: string;
  fulfillmentId: string;
  inventoryItemId: string;
  lineItemId: string;
  quantity: number;
  adminGraphqlApiId: string;
}

export interface ShopifyOrderAdjustment {
  id: string;
  orderId: string;
  refundId: string;
  amount: number;
  taxAmount: number;
  kind: string;
  reason: string;
  amountSet: ShopifyMoneySet;
  taxAmountSet: ShopifyMoneySet;
  adminGraphqlApiId: string;
}

export interface ShopifyRefundLineItem {
  id: string;
  quantity: number;
  lineItemId: string;
  locationId?: string;
  restockType: 'no_restock' | 'cancel' | 'return' | 'legacy_restock';
  subtotal: number;
  totalTax: number;
  subtotalSet: ShopifyMoneySet;
  totalTaxSet: ShopifyMoneySet;
  lineItem: ShopifyLineItem;
}

export interface ShopifyCurrencyExchangeAdjustment {
  id: string;
  adjustment: ShopifyMoney;
  originalAmount: ShopifyMoney;
  finalAmount: ShopifyMoney;
  currency: string;
}

export interface ShopifyNoteAttribute {
  name: string;
  value: string;
}

export interface ShopifyUTMParameters {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

// Cart Interface
export interface ShopifyCart {
  id: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  currency: string;
  customerId?: string;
  customer?: ShopifyCustomer;
  lineItems: ShopifyCartLineItem[];
  note?: string;
  attributes: ShopifyCartAttribute[];
  discountCodes: ShopifyDiscountCode[];
  discountAllocations: ShopifyDiscountAllocation[];
  cartLevelDiscountApplications: ShopifyDiscountApplication[];
  buyerIdentity: ShopifyBuyerIdentity;
  cost: ShopifyCartCost;
  checkoutUrl: string;
  checkoutId?: string;
  totalQuantity: number;
  totalAmount: ShopifyMoney;
  subtotalAmount: ShopifyMoney;
  totalTaxAmount: ShopifyMoney;
  totalDiscountAmount: ShopifyMoney;
  totalDutyAmount: ShopifyMoney;
  totalTipAmount: ShopifyMoney;
}

export interface ShopifyCartLineItem {
  id: string;
  quantity: number;
  cost: ShopifyCartLineItemCost;
  merchandise: ShopifyProductVariant;
  attributes: ShopifyCartAttribute[];
  discountAllocations: ShopifyDiscountAllocation[];
  sellingPlanAllocation?: ShopifySellingPlanAllocation;
}

export interface ShopifyCartAttribute {
  key: string;
  value: string;
}

export interface ShopifyDiscountCode {
  code: string;
  applicable: boolean;
  value: number;
  type: 'percentage' | 'fixed_amount';
  applicableDiscountAmount: ShopifyMoney;
}

export interface ShopifyDiscountApplication {
  targetType: string;
  type: string;
  value: ShopifyMoney;
  allocationMethod: string;
  targetSelection: string;
  code: string;
}

export interface ShopifyBuyerIdentity {
  countryCode?: string;
  customer?: ShopifyCustomer;
  email?: string;
  phone?: string;
  deliveryAddressPreferences: ShopifyDeliveryAddressPreference[];
}

export interface ShopifyDeliveryAddressPreference {
  address: ShopifyAddress;
}

export interface ShopifyCartCost {
  subtotalAmount: ShopifyMoney;
  totalAmount: ShopifyMoney;
  totalDutyAmount: ShopifyMoney;
  totalTaxAmount: ShopifyMoney;
}

export interface ShopifyCartLineItemCost {
  totalAmount: ShopifyMoney;
  subtotalAmount: ShopifyMoney;
  totalTaxAmount: ShopifyMoney;
  totalDutyAmount: ShopifyMoney;
}

export interface ShopifySellingPlanAllocation {
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney;
  perDeliveryPrice: ShopifyMoney;
  sellingPlan: ShopifySellingPlan;
}

export interface ShopifySellingPlan {
  id: string;
  name: string;
  description?: string;
  options: ShopifySellingPlanOption[];
  recurringDeliveries: boolean;
  priceAdjustments: ShopifySellingPlanPriceAdjustment[];
}

export interface ShopifySellingPlanOption {
  name: string;
  value: string;
}

export interface ShopifySellingPlanPriceAdjustment {
  orderCount?: number;
  percentage?: number;
  price?: ShopifyMoney;
  type: string;
}

// API Request/Response Types
export interface ShopifyProductRequest {
  title: string;
  bodyHtml?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  status?: 'active' | 'archived' | 'draft';
  variants?: Partial<ShopifyProductVariant>[];
  options?: Partial<ShopifyProductOption>[];
  images?: Partial<ShopifyProductImage>[];
  metafields?: Partial<ShopifyMetafield>[];
  seo?: Partial<ShopifySEO>;
}

export interface ShopifyOrderRequest {
  email: string;
  lineItems: {
    variantId: string;
    quantity: number;
  }[];
  customer?: Partial<ShopifyCustomer>;
  shippingAddress?: Partial<ShopifyAddress>;
  billingAddress?: Partial<ShopifyAddress>;
  note?: string;
  tags?: string[];
  currency?: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
}

export interface ShopifyCartRequest {
  lineItems: {
    merchandiseId: string;
    quantity: number;
    attributes?: ShopifyCartAttribute[];
  }[];
  customerId?: string;
  note?: string;
  attributes?: ShopifyCartAttribute[];
}

// Filter and Search Types
export interface ShopifyProductFilters {
  searchTerm?: string;
  productType?: string;
  vendor?: string;
  status?: string;
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  inventoryStatus?: 'in_stock' | 'out_of_stock' | 'low_stock';
  createdAtAfter?: string;
  createdAtBefore?: string;
  // Additional Shopify REST API supported properties
  limit?: number;
  collectionId?: number;
  createdAtMin?: string;
  createdAtMax?: string;
  updatedAtMin?: string;
  updatedAtMax?: string;
  publishedAtMin?: string;
  publishedAtMax?: string;
  title?: string;
  handle?: string;
  tag?: string;
}

export interface ShopifyOrderFilters {
  searchTerm?: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  orderStatus?: string;
  customerId?: string;
  createdAtAfter?: string;
  createdAtBefore?: string;
  totalPriceMin?: number;
  totalPriceMax?: number;
  tags?: string[];
  // Additional Shopify REST API supported properties
  limit?: number;
  status?: string;
  createdAtMin?: string;
  createdAtMax?: string;
  updatedAtMin?: string;
  updatedAtMax?: string;
  processedAtMin?: string;
  processedAtMax?: string;
  attributionAppId?: number;
}

// Statistics and Analytics
export interface ShopifyStoreStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingProducts: ShopifyProduct[];
  recentOrders: ShopifyOrder[];
  inventoryAlerts: {
    lowStock: ShopifyProduct[];
    outOfStock: ShopifyProduct[];
  };
  salesByPeriod: {
    period: string;
    revenue: number;
    orders: number;
  }[];
}

// Error Types
export interface ShopifyError {
  code: string;
  message: string;
  field?: string;
  resource?: string;
  details?: any;
}

// Configuration Types
export interface ShopifyConfig {
  storeDomain: string;
  accessToken: string;
  apiVersion: string;
  webhookSecret?: string;
  appId?: string;
  appSecret?: string;
  scopes: string[];
  redirectUrl?: string;
}

// Webhook Types
export interface ShopifyWebhook {
  id: string;
  address: string;
  topic: string;
  format: 'json' | 'xml';
  createdAt: string;
  updatedAt: string;
}

// App Installation Types
export interface ShopifyAppInstallation {
  id: string;
  appId: string;
  appName: string;
  accessToken: string;
  scopes: string[];
  installedAt: string;
  updatedAt: string;
  status: 'active' | 'uninstalled' | 'suspended';
} 