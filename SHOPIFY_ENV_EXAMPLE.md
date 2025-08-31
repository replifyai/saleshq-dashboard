# Shopify Environment Variables

To fix the CORS issues with Shopify API calls, you need to set up the following environment variables in your `.env.local` file:

## Required Environment Variables

```bash
# Your Shopify store domain (e.g., your-store.myshopify.com)
SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com

# Your Shopify Admin API access token
# Generate this in your Shopify Partner dashboard or store admin
SHOPIFY_ACCESS_TOKEN=shpat_your_access_token_here
```

## How to Get These Values

### 1. Shopify Shop Domain
- This is your store's URL without the `https://` part
- Example: If your store is at `https://my-store.myshopify.com`, use `my-store.myshopify.com`

### 2. Shopify Access Token
1. Go to your Shopify Partner dashboard or store admin
2. Navigate to Apps > App and sales channel settings
3. Create a new app or use an existing one
4. Go to API credentials
5. Generate a new Admin API access token
6. Copy the token (it starts with `shpat_`)

## Security Notes

- These environment variables are used **server-side only**
- They will **NOT** be exposed to the frontend
- This prevents CORS issues and keeps your credentials secure
- Never commit these values to version control

## File Location

Create a `.env.local` file in your project root (same level as `package.json`):

```bash
replify-frontend/
├── .env.local          # Create this file
├── package.json
├── src/
└── ...
```

## Testing

After setting up the environment variables, restart your Next.js development server:

```bash
npm run dev
```

Your Shopify API calls should now work without CORS errors! 