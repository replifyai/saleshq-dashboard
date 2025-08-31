# Shopify GraphQL API Migration

## Overview

This project has been successfully migrated from Shopify's REST Admin API to the GraphQL Admin API, providing better performance, flexibility, and future-proofing. The GraphQL implementation offers significant advantages over REST including:

- **Single endpoint** for all operations
- **Precise data fetching** - request only the fields you need
- **Better performance** - fewer API calls and reduced payload sizes
- **Strong typing** - GraphQL schema provides validation and autocompletion
- **Future-proof** - REST API is deprecated as of October 1, 2024

## Implementation Details

### 🏗️ **Architecture**

#### **New Files Created:**
1. **`src/lib/shopifyGraphQLApi.ts`** - Core GraphQL API service
2. **`src/app/api/shopify/graphql/route.ts`** - GraphQL API route handler
3. **Enhanced OrderCreator** - Now supports discount codes with GraphQL

#### **Modified Files:**
1. **`src/lib/shopifyApi.ts`** - Updated to use GraphQL service internally
2. **`src/components/shopify/OrderCreator.tsx`** - Enhanced with discount support

### 🔄 **Migration Strategy**

The migration maintains **backward compatibility** by:
- Keeping the same public API interface in `shopifyApi.ts`
- Transforming GraphQL responses to match existing TypeScript types
- Preserving all existing functionality while adding new features

### 📊 **GraphQL Operations Implemented**

#### **Products**
```graphql
# Get Products with Variants and Media
query GetProducts($first: Int!, $query: String) {
  products(first: $first, query: $query) {
    nodes {
      id
      title
      handle
      description
      variants(first: 100) {
        nodes {
          id
          title
          price
          inventoryQuantity
          selectedOptions {
            name
            value
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
    }
  }
}
```

#### **Orders**
```graphql
# Create Order with Discount Support
mutation OrderCreate($order: OrderCreateOrderInput!) {
  orderCreate(order: $order) {
    order {
      id
      name
      email
      displayFinancialStatus
      displayFulfillmentStatus
      totalPriceSet {
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
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

#### **Customers**
```graphql
# Get Customers with Addresses and Order History
query GetCustomers($first: Int!) {
  customers(first: $first) {
    nodes {
      id
      firstName
      lastName
      email
      numberOfOrders
      amountSpent {
        amount
        currencyCode
      }
      defaultAddress {
        address1
        city
        province
        country
        zip
      }
    }
  }
}
```

### 🎯 **Key Features**

#### **1. Enhanced Product Management**
- **Rich Media Support**: Images, videos, and 3D models
- **Advanced Filtering**: Search by title, status, vendor, product type
- **Inventory Management**: Real-time inventory levels and policies
- **Variant Management**: Complete variant data with options and pricing

#### **2. Comprehensive Order Management**
- **Order Creation**: Direct order creation with customer management
- **Discount Support**: Percentage and fixed amount discounts
- **Customer Types**: Existing customers, guest customers, or no customer
- **Address Management**: Shipping and billing address support
- **Line Items**: Complete product variant information

#### **3. Advanced Customer Management**
- **Customer Search**: Search by name, email, or other attributes
- **Order History**: Customer's previous orders and total spent
- **Address Book**: Multiple addresses with default address support
- **Customer Types**: Support for different customer scenarios

#### **4. Discount System**
- **Percentage Discounts**: Apply percentage-based discounts
- **Fixed Amount Discounts**: Apply fixed dollar amount discounts
- **Discount Codes**: Optional discount codes for tracking
- **GraphQL Integration**: Discounts are applied during order creation

### 🔧 **Technical Implementation**

#### **GraphQL Service Architecture**
```typescript
export class ShopifyGraphQLApiService {
  private async makeGraphQLRequest(query: string, variables: any = {})
  
  // Product Operations
  async getProducts(filters?: ShopifyProductFilters): Promise<ShopifyProduct[]>
  async getProduct(id: string): Promise<ShopifyProduct>
  async createProduct(productData: ShopifyProductRequest): Promise<ShopifyProduct>
  
  // Order Operations  
  async getOrders(filters?: ShopifyOrderFilters): Promise<ShopifyOrder[]>
  async createOrder(orderData: ShopifyOrderRequest): Promise<ShopifyOrder>
  
  // Customer Operations
  async getCustomers(): Promise<ShopifyCustomer[]>
  async getCustomer(id: string): Promise<ShopifyCustomer>
}
```

#### **Data Transformation**
- **GraphQL to REST Format**: Transforms GraphQL responses to match existing TypeScript interfaces
- **Field Mapping**: Maps GraphQL field names to REST equivalents
- **Type Safety**: Maintains type safety throughout the transformation process

### 🚀 **Benefits of GraphQL Implementation**

#### **Performance Improvements**
- **Reduced API Calls**: Single request for complex data relationships
- **Smaller Payloads**: Request only needed fields
- **Better Caching**: GraphQL enables more efficient caching strategies

#### **Developer Experience**
- **Strong Typing**: GraphQL schema provides compile-time validation
- **Better Documentation**: Self-documenting API with introspection
- **Flexible Queries**: Easily modify what data is returned

#### **Business Benefits**
- **Future-Proof**: GraphQL is Shopify's recommended API approach
- **Better Features**: Access to latest Shopify features and improvements
- **Scalability**: Better performance for high-volume operations

### 🔒 **Security & Authentication**

#### **Authentication**
- Uses same authentication as REST API
- Shopify Access Token via `X-Shopify-Access-Token` header
- Supports offline tokens for order creation

#### **Rate Limiting**
- GraphQL has different rate limiting based on query complexity
- Automatic handling of rate limit responses
- Optimized queries to minimize complexity costs

### 🛠️ **Usage Examples**

#### **Creating Orders with Discounts**
```typescript
const orderData = {
  email: 'customer@example.com',
  lineItems: [
    { variantId: 'gid://shopify/ProductVariant/123', quantity: 2 }
  ],
  customer: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'customer@example.com'
  },
  discountCode: 'SAVE10',
  discountType: 'percentage',
  discountValue: 10
};

const order = await shopify.createOrder(orderData);
```

#### **Fetching Products with Filters**
```typescript
const products = await shopify.getProducts({
  limit: 50,
  status: 'active',
  searchTerm: 'shirt'
});
```

#### **Customer Management**
```typescript
const customers = await shopify.getCustomers();
const customer = await shopify.getCustomer('gid://shopify/Customer/123');
```

### 🔍 **Error Handling**

#### **GraphQL Error Types**
- **Validation Errors**: Invalid query structure or types
- **User Errors**: Business logic errors (e.g., invalid customer email)
- **System Errors**: Network or server-side issues

#### **Error Response Format**
```typescript
interface ShopifyError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}
```

### 📈 **Migration Benefits**

#### **Before (REST API)**
- Multiple API calls for related data
- Over-fetching of unnecessary fields
- Limited filtering and search capabilities
- Deprecated API with limited future support

#### **After (GraphQL API)**
- Single API call for complex data relationships
- Precise data fetching with field selection
- Advanced search and filtering capabilities
- Modern, actively developed API with new features

### 🧪 **Testing**

#### **Validation**
All GraphQL operations have been validated against the Shopify GraphQL schema using the official validation tools.

#### **Error Handling**
Comprehensive error handling for:
- Network failures
- GraphQL validation errors
- Business logic errors
- Authentication issues

### 🚀 **Future Enhancements**

#### **Potential Improvements**
- **Bulk Operations**: Implement GraphQL bulk operations for large datasets
- **Subscriptions**: Add real-time updates using GraphQL subscriptions
- **Advanced Filtering**: Leverage GraphQL's powerful filtering capabilities
- **Caching**: Implement GraphQL-specific caching strategies

#### **New Features Available**
- **Product Media**: Support for videos and 3D models
- **Advanced Discounts**: More sophisticated discount types
- **Order Editing**: Edit existing orders with GraphQL
- **Metafields**: Enhanced custom data management

### 📚 **Resources**

#### **Documentation**
- [Shopify GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql)
- [GraphQL Best Practices](https://shopify.dev/docs/apps/build/graphql)
- [Migration Guide](https://shopify.dev/docs/apps/build/graphql/migrate)

#### **Tools**
- [GraphiQL Explorer](https://shopify.dev/docs/api/usage/api-exploration/admin-graphiql-explorer)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [GraphQL Validator](https://shopify.dev/docs/api/usage/graphql-basics)

### ⚠️ **Important Notes**

1. **REST API Deprecation**: The REST Admin API is legacy as of October 1, 2024
2. **Access Scopes**: Ensure your app has the required GraphQL access scopes
3. **Rate Limits**: GraphQL uses complexity-based rate limiting
4. **Global IDs**: GraphQL uses Global IDs (GIDs) instead of numeric IDs

### 🔄 **Backward Compatibility**

The implementation maintains full backward compatibility:
- All existing component APIs work unchanged
- Same TypeScript interfaces and types
- Same error handling patterns
- Same response formats

This ensures a smooth transition with zero breaking changes to existing code while providing the benefits of GraphQL under the hood.

## Conclusion

The migration to GraphQL provides a solid foundation for future development while maintaining compatibility with existing code. The implementation offers improved performance, better developer experience, and access to Shopify's latest features and capabilities.