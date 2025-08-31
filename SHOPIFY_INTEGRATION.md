# Shopify Integration Module

A comprehensive Shopify store management system built for the Replify dashboard, designed to increase agent productivity through seamless store management capabilities.

## Features

### 🛍️ Product Management
- **View Products**: Browse all store products with search and filtering
- **Create Products**: Add new products with detailed information
- **Edit Products**: Update product details, pricing, and inventory
- **Delete Products**: Remove products from the store
- **Product Variants**: Manage product variants and options
- **Inventory Tracking**: Monitor stock levels and availability

### 📦 Order Management
- **View Orders**: See all customer orders with status tracking
- **Order Details**: Comprehensive order information including customer details
- **Fulfillment**: Process orders and update fulfillment status
- **Order Cancellation**: Cancel orders when necessary
- **Order Search**: Find orders by customer, order number, or status

### 👥 Customer Management
- **Customer Profiles**: View customer information and order history
- **Customer Search**: Find customers by name, email, or other criteria
- **Customer Analytics**: Track customer behavior and spending patterns

### 🛒 Cart Management
- **Create Carts**: Generate shopping carts for customers
- **Add Items**: Add products to customer carts
- **Update Quantities**: Modify item quantities in carts
- **Remove Items**: Remove products from carts
- **Cart Analytics**: Track cart abandonment and conversion rates

### 📊 Analytics & Reporting
- **Store Statistics**: Overview of products, orders, customers, and revenue
- **Sales Analytics**: Detailed sales performance metrics
- **Inventory Reports**: Stock level monitoring and alerts
- **Customer Insights**: Customer behavior and preferences analysis

### 🤖 AI-Powered Chatbot
- **Customer Support**: Intelligent responses to common inquiries
- **Order Tracking**: Help customers track their orders
- **Product Recommendations**: Suggest products based on customer needs
- **24/7 Availability**: Always-on customer assistance
- **Contextual Responses**: Personalized help based on customer history

## Architecture

### Frontend Components
- **ShopifyDashboard**: Main dashboard with overview and navigation
- **ProductsManager**: Complete product management interface
- **OrdersManager**: Order processing and fulfillment system
- **ShopifyChatbot**: AI-powered customer support chatbot

### API Integration
- **shopifyApi.ts**: Comprehensive API service for all Shopify operations
- **Next.js API Routes**: Backend proxy for Shopify API calls
- **TypeScript Types**: Full type safety for all Shopify entities

### Data Flow
1. Frontend components make API calls through the Shopify service
2. API calls are proxied through Next.js to the backend
3. Backend communicates with Shopify's REST API
4. Responses are processed and returned to the frontend
5. UI updates with real-time data

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Shopify Partner account
- Shopify store with API access
- Backend API endpoints for Shopify operations

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd replify-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # .env.local
   SHOPIFY_BACKEND_URL=http://localhost:5000
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Configuration

The Shopify integration requires backend API endpoints that handle:
- Product CRUD operations
- Order management
- Customer data
- Inventory tracking
- Analytics and reporting

## Usage

### Dashboard Overview
The main dashboard provides:
- Key performance indicators (KPIs)
- Recent products and orders
- Quick action buttons
- Tabbed navigation to different modules

### Product Management
1. Navigate to the "Products" tab
2. Use search and filters to find products
3. Click "Add Product" to create new products
4. Use the action buttons to edit, view, or delete products

### Order Management
1. Navigate to the "Orders" tab
2. View all orders with status indicators
3. Click on orders to see detailed information
4. Use action buttons to fulfill or cancel orders

### Chatbot Integration
1. The chatbot appears as a floating button
2. Click to open the chat interface
3. Ask questions about orders, products, or general support
4. Use suggested responses for quick interactions

## API Endpoints

### Products
- `GET /api/shopify/products` - List all products
- `GET /api/shopify/products/:id` - Get product details
- `POST /api/shopify/products` - Create new product
- `PUT /api/shopify/products/:id` - Update product
- `DELETE /api/shopify/products/:id` - Delete product

### Orders
- `GET /api/shopify/orders` - List all orders
- `GET /api/shopify/orders/:id` - Get order details
- `POST /api/shopify/orders` - Create new order
- `PUT /api/shopify/orders/:id` - Update order
- `POST /api/shopify/orders/:id/cancel` - Cancel order
- `POST /api/shopify/orders/:id/fulfill` - Fulfill order

### Customers
- `GET /api/shopify/customers` - List all customers
- `GET /api/shopify/customers/:id` - Get customer details
- `POST /api/shopify/customers` - Create new customer
- `PUT /api/shopify/customers/:id` - Update customer

### Cart
- `POST /api/shopify/cart` - Create new cart
- `GET /api/shopify/cart/:id` - Get cart details
- `POST /api/shopify/cart/:id/add` - Add item to cart
- `PUT /api/shopify/cart/:id/items/:itemId` - Update cart item
- `DELETE /api/shopify/cart/:id/items/:itemId` - Remove item from cart

### Analytics
- `GET /api/shopify/stats` - Get store statistics
- `GET /api/shopify/analytics/sales` - Get sales analytics

### Chatbot
- `POST /api/shopify/chatbot` - Process chatbot messages

## TypeScript Types

The integration includes comprehensive TypeScript types for all Shopify entities:

- `ShopifyProduct` - Product information and variants
- `ShopifyOrder` - Order details and line items
- `ShopifyCustomer` - Customer profiles and addresses
- `ShopifyCart` - Shopping cart and line items
- `ShopifyStoreStats` - Store performance metrics

## Customization

### Adding New Features
1. Create new components in `src/components/shopify/`
2. Add corresponding API methods in `src/lib/shopifyApi.ts`
3. Update types in `src/types/shopify.ts`
4. Integrate with the main dashboard

### Styling
The components use Tailwind CSS and shadcn/ui components for consistent styling. Customize the appearance by modifying the component classes or creating new UI components.

### Chatbot Responses
Customize the chatbot by modifying the `generateBotResponse` function in `ShopifyChatbot.tsx`. Add new response patterns and suggestions based on your store's specific needs.

## Security Considerations

- All API calls go through authenticated backend endpoints
- No Shopify API keys are exposed in the frontend
- User authentication is handled by the existing auth system
- API rate limiting is implemented on the backend

## Performance Optimization

- Lazy loading of components and data
- Efficient filtering and search algorithms
- Optimized API calls with proper caching
- Responsive design for all screen sizes

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify backend URL configuration
   - Check network connectivity
   - Ensure backend services are running

2. **Authentication Issues**
   - Verify user login status
   - Check API token validity
   - Ensure proper permissions

3. **Data Loading Problems**
   - Check browser console for errors
   - Verify API response format
   - Check network tab for failed requests

### Debug Mode
Enable debug logging by setting:
```bash
NODE_ENV=development
```

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: More detailed reporting and insights
- **Bulk Operations**: Mass product and order updates
- **Integration APIs**: Connect with other e-commerce platforms
- **Mobile App**: Native mobile application for store management
- **AI Features**: Advanced product recommendations and customer insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support or questions about the Shopify integration:
- Create an issue in the repository
- Contact the development team
- Check the documentation and examples

---

**Note**: This integration requires a working backend API that implements the Shopify API endpoints. Ensure your backend is properly configured and tested before deploying the frontend. 