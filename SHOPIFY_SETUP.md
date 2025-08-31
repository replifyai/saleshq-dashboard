# Shopify Integration Setup Guide

## Prerequisites
- A Shopify store with admin access
- Shopify access token with appropriate permissions

## Configuration

### 1. Environment Variables
Create a `.env.local` file in your project root with the following variables:

```bash
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN=your_access_token_here
```

**Important Notes:**
- Replace `your-shop.myshopify.com` with your actual Shopify store domain
- Replace `your_access_token_here` with your Shopify access token
- The `NEXT_PUBLIC_` prefix makes these variables available in the browser (required for client-side API calls)

### 2. Shopify Access Token Setup

#### Option A: Using Shopify Admin (Recommended)
1. Log in to your Shopify admin panel
2. Go to **Settings** → **Apps and sales channels**
3. Click **Develop apps**
4. Click **Create an app**
5. Give your app a name (e.g., "Replify Integration")
6. Under **Admin API integration**, click **Configure**
7. Select the required scopes:
   - `read_products`, `write_products`
   - `read_orders`, `write_orders`
   - `read_customers`, `write_customers`
   - `read_inventory`, `write_inventory`
8. Click **Save**
9. Click **Install app**
10. Copy the **Admin API access token**

#### Option B: Using Private App (Legacy)
1. Go to **Settings** → **Apps and sales channels**
2. Click **Develop apps**
3. Click **Create an app**
4. Under **Admin API integration**, enable required permissions
5. Install the app and copy the access token

### 3. Required API Permissions

Your Shopify app needs the following permissions:

#### Products
- `read_products` - View products
- `write_products` - Create, update, delete products

#### Orders
- `read_orders` - View orders
- `write_orders` - Create, update, cancel orders

#### Customers
- `read_customers` - View customer information
- `write_customers` - Create, update customer information

#### Inventory
- `read_inventory` - View inventory levels
- `write_inventory` - Update inventory levels

### 4. Testing the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/shopify` in your application

3. Check the browser console for any error messages

4. Verify that:
   - Store statistics are loading
   - Products are displayed
   - Orders are visible
   - No authentication errors appear

### 5. Troubleshooting

#### Common Issues

**"Failed to load Shopify data" Error**
- Verify your shop domain is correct
- Ensure your access token is valid
- Check that your app has the required permissions
- Verify your Shopify store is accessible

**"Unauthorized" or "403" Errors**
- Check your access token permissions
- Ensure the token hasn't expired
- Verify the app is properly installed

**"Shop not found" Error**
- Double-check your shop domain
- Ensure you're using the correct domain format (e.g., `mystore.myshopify.com`)

#### Debug Mode

To enable debug logging, add this to your `.env.local`:

```bash
NEXT_PUBLIC_SHOPIFY_DEBUG=true
```

This will log API requests and responses to the browser console.

### 6. Security Considerations

- **Never commit your `.env.local` file to version control**
- **Keep your access token secure and private**
- **Use the minimum required permissions for your app**
- **Regularly rotate your access tokens**
- **Monitor your app's usage in Shopify admin**

### 7. Production Deployment

When deploying to production:

1. Set the environment variables in your hosting platform
2. Ensure your domain is whitelisted in Shopify if required
3. Test the integration thoroughly in a staging environment
4. Monitor API rate limits and usage

### 8. Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Shopify app permissions
3. Test with a simple API call using tools like Postman
4. Check Shopify's API documentation for any changes
5. Review the application logs for detailed error information

## Next Steps

Once your Shopify integration is working:

1. **Customize the UI** - Modify components to match your brand
2. **Add more features** - Implement customer management, analytics, etc.
3. **Set up webhooks** - Configure real-time updates from Shopify
4. **Add error handling** - Implement retry logic and user notifications
5. **Performance optimization** - Add caching and pagination

## API Reference

The integration uses Shopify's REST Admin API. Key endpoints:

- **Products**: `/admin/api/2025-01/products.json`
- **Orders**: `/admin/api/2025-01/orders.json`
- **Customers**: `/admin/api/2025-01/customers.json`
- **Inventory**: `/admin/api/2025-01/inventory_levels.json`

For more information, see the [Shopify Admin API documentation](https://shopify.dev/api/admin). 