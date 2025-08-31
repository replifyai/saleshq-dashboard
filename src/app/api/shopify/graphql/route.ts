import { NextRequest, NextResponse } from 'next/server';

/**
 * Shopify GraphQL API Route
 * This route handles all Shopify GraphQL API operations server-side
 * Replaces REST API with GraphQL for better performance and flexibility
 */

class ShopifyGraphQLServerApi {
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

  private async makeShopifyGraphQLRequest(query: string, variables: any = {}) {
    const url = `https://${this.baseUrl}/admin/api/${this.apiVersion}/graphql.json`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
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

    return result.data;
  }

  async executeGraphQLQuery(query: string, variables: any = {}) {
    try {
      return await this.makeShopifyGraphQLRequest(query, variables);
    } catch (error) {
      console.error('GraphQL query failed:', error);
      throw error;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'GraphQL query is required' }, { status: 400 });
    }

    const shopifyApi = new ShopifyGraphQLServerApi();
    const result = await shopifyApi.executeGraphQLQuery(query, variables);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Shopify GraphQL API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Shopify GraphQL API endpoint. Use POST to send GraphQL queries.' });
}