# Shopify Integration Module

A comprehensive Shopify store management system built for the Replify dashboard, featuring direct integration with Shopify's REST Admin API.

## Features

### 🛍️ Product Management
- **View Products**: Browse all products with search and filtering
- **Create Products**: Add new products with detailed information
- **Edit Products**: Update product details, pricing, and inventory
- **Delete Products**: Remove products from your store
- **Product Variants**: Manage product variations and options
- **Inventory Tracking**: Monitor stock levels and availability

### 📦 Order Management
- **View Orders**: See all customer orders with detailed information
- **Order Status**: Track fulfillment and financial status
- **Cancel Orders**: Cancel orders when necessary
- **Order Details**: View complete order information including line items
- **Customer Information**: Access customer details for each order

### 👥 Customer Management
- **Customer Database**: View and manage customer information
- **Order History**: Track customer order history
- **Customer Profiles**: Access detailed customer data
- **Marketing Preferences**: Manage customer communication settings

### 🛒 Cart Management
- **Create Carts**: Generate new shopping carts
- **Add Items**: Add products to customer carts
- **Update Quantities**: Modify cart item quantities
- **Remove Items**: Remove products from carts
- **Cart Analytics**: Track cart performance and abandonment

### 📊 Analytics & Reporting
- **Store Statistics**: Overview of products, orders, customers, and revenue
- **Sales Analytics**: Track sales performance over time
- **Product Performance**: Analyze product popularity and sales
- **Customer Insights**: Understand customer behavior and preferences
- **Inventory Reports**: Monitor stock levels and turnover

### 🤖 AI-Powered Chatbot
- **Customer Support**: Provide instant assistance to customers
- **Product Recommendations**: Suggest relevant products
- **Order Status**: Check order status and tracking
- **Natural Language**: Understand customer queries in plain English
- **Integration**: Seamlessly integrated with your store data

## Architecture

### Frontend Components
- **Shopify Dashboard** (`/shopify`): Main management interface
- **ProductsManager**: Comprehensive product management
- **OrdersManager**: Order processing and management
- **ShopifyChatbot**: AI-powered customer support
- **Navigation Integration**: Seamless sidebar navigation

### API Integration
- **Direct Shopify API**: Uses Shopify's REST Admin API directly
- **Authentication**: Secure access token-based authentication
- **Real-time Data**: Live data from your Shopify store
- **Error Handling**: Comprehensive error handling and user feedback

### Data Flow
1. **User Interface**: React components with shadcn/ui
2. **API Service**: Direct calls to Shopify REST Admin API
3. **Data Processing**: Type-safe data handling with TypeScript
4. **State Management**: React hooks for local state management
5. **Error Handling**: User-friendly error messages and retry options

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Shopify store with admin access
- Shopify access token with appropriate permissions

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd replify-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Shopify**:
   - Create a `.env.local` file in your project root
   - Add your Shopify credentials (see `SHOPIFY_SETUP.md` for details)
   - Ensure your Shopify app has the required permissions

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Access the Shopify module**:
   - Navigate to `/shopify` in your application
   - The module will automatically load your store data

### Configuration

#### Environment Variables
Create a `.env.local` file with:

```bash
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN=your_access_token_here
NEXT_PUBLIC_SHOPIFY_DEBUG=true  # Optional: for debugging
```

#### Required Shopify Permissions
Your Shopify app needs these permissions:
- `read_products`, `write_products`
- `read_orders`, `write_orders`
- `read_customers`, `write_customers`
- `read_inventory`, `write_inventory`

## Usage

### Dashboard Overview
The main Shopify dashboard provides:
- **Store Statistics**: Key metrics at a glance
- **Recent Activity**: Latest products and orders
- **Quick Actions**: Easy access to common tasks
- **Navigation Tabs**: Organized management sections

### Product Management
- **Browse Products**: View all products with search and filters
- **Add Products**: Create new products with detailed forms
- **Edit Products**: Update existing product information
- **Manage Inventory**: Track stock levels and availability
- **Product Variants**: Handle product options and variations

### Order Management
- **View Orders**: See all customer orders with status
- **Order Details**: Access complete order information
- **Process Orders**: Update order status and fulfillment
- **Customer Information**: View customer details for each order
- **Financial Tracking**: Monitor payments and refunds

### Chatbot Integration
- **Floating Button**: Easy access to customer support
- **Smart Responses**: AI-powered responses based on context
- **Product Information**: Provide product details and recommendations
- **Order Status**: Check order status and tracking information
- **Customer Support**: Handle common customer inquiries

## API Endpoints

### Direct Shopify Integration
The module integrates directly with Shopify's REST Admin API:

- **Products**: `/admin/api/2025-01/products.json`
- **Orders**: `/admin/api/2025-01/orders.json`
- **Customers**: `/admin/api/2025-01/customers.json`
- **Inventory**: `/admin/api/2025-01/inventory_levels.json`
- **Carts**: `/admin/api/2025-01/carts.json`

### Internal API Routes
- **`/api/shopify`**: General Shopify API proxy (for future use)
- **`/api/shopify/chatbot`**: Chatbot interaction endpoint

## TypeScript Types

Comprehensive type definitions for all Shopify entities:

```typescript
// Core entities
interface ShopifyProduct { /* ... */ }
interface ShopifyOrder { /* ... */ }
interface ShopifyCustomer { /* ... */ }
interface ShopifyCart { /* ... */ }

// Supporting types
interface ShopifyProductVariant { /* ... */ }
interface ShopifyLineItem { /* ... */ }
interface ShopifyAddress { /* ... */ }

// API types
interface ShopifyProductRequest { /* ... */ }
interface ShopifyOrderRequest { /* ... */ }
interface ShopifyProductFilters { /* ... */ }
```

## Customization

### Adding New Features
1. **Extend Types**: Add new interfaces to `src/types/shopify.ts`
2. **API Methods**: Add new methods to `src/lib/shopifyApi.ts`
3. **Components**: Create new React components in `src/components/shopify/`
4. **Integration**: Add new features to the main dashboard

### Styling
- **Theme Integration**: Uses your existing design system
- **Component Library**: Built with shadcn/ui components
- **Responsive Design**: Mobile-friendly interface
- **Custom CSS**: Easy to customize with Tailwind CSS

### Chatbot Responses
- **Response Logic**: Modify `src/app/api/shopify/chatbot/route.ts`
- **Keywords**: Add new keyword patterns for responses
- **Context**: Enhance context-aware responses
- **Integration**: Connect with external AI services

## Security Considerations

- **Access Tokens**: Secure storage of Shopify credentials
- **API Permissions**: Minimal required permissions
- **Environment Variables**: Secure configuration management
- **Rate Limiting**: Respect Shopify's API rate limits
- **Data Validation**: Input validation and sanitization

## Performance Optimization

- **Lazy Loading**: Components load on demand
- **Efficient Queries**: Optimized API calls with filters
- **Caching**: Browser-level caching for static data
- **Pagination**: Handle large datasets efficiently
- **Error Boundaries**: Graceful error handling

## Troubleshooting

### Common Issues

**"Failed to load Shopify data" Error**
- Verify your shop domain and access token
- Check Shopify app permissions
- Ensure your store is accessible

**Authentication Errors**
- Verify access token is valid and not expired
- Check app installation status
- Ensure proper API permissions

**Data Loading Issues**
- Check browser console for errors
- Verify API rate limits
- Test with simple API calls

### Debug Mode
Enable debug logging by setting:
```bash
NEXT_PUBLIC_SHOPIFY_DEBUG=true
```

### Getting Help
1. Check browser console for error messages
2. Verify Shopify app configuration
3. Test API endpoints directly
4. Review Shopify API documentation
5. Check application logs

## Future Enhancements

- **Webhook Integration**: Real-time store updates
- **Advanced Analytics**: Detailed reporting and insights
- **Bulk Operations**: Mass product and order management
- **Automation**: Automated workflows and triggers
- **Multi-store Support**: Manage multiple Shopify stores
- **Advanced Chatbot**: Integration with external AI services
- **Mobile App**: Native mobile application
- **API Extensions**: Custom API endpoints and integrations

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes**: Follow the existing code style
4. **Test thoroughly**: Ensure all functionality works
5. **Submit a pull request**: Include detailed description

### Development Guidelines
- **TypeScript**: Use strict typing throughout
- **Component Structure**: Follow existing component patterns
- **Error Handling**: Implement comprehensive error handling
- **Testing**: Add tests for new functionality
- **Documentation**: Update relevant documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- **Documentation**: Check this README and `SHOPIFY_SETUP.md`
- **Issues**: Report bugs and feature requests via GitHub issues
- **Discussions**: Use GitHub discussions for questions and ideas
- **Shopify Support**: Contact Shopify for API-related issues

---

**Built with ❤️ for the Replify team**
