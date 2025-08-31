import { NextRequest, NextResponse } from 'next/server';

/**
 * Shopify Chatbot API Route
 * Handles customer inquiries and provides intelligent responses
 * Integrates with AI services for natural language processing
 */

export interface ChatbotRequest {
  message: string;
  customerId?: string;
  orderId?: string;
  productId?: string;
  context?: {
    cart?: any;
    recentProducts?: any[];
    orderHistory?: any[];
    customerPreferences?: any;
  };
  sessionId?: string;
}

export interface ChatbotResponse {
  response: string;
  suggestions?: string[];
  actions?: {
    type: 'add_to_cart' | 'show_product' | 'track_order' | 'contact_support' | 'view_cart';
    data?: any;
  }[];
  confidence: number;
  sessionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatbotRequest = await request.json();
    const { message, customerId, orderId, productId, context, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate a session ID if not provided
    const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Analyze the message intent and generate response
    const response = await generateChatbotResponse(message, {
      customerId,
      orderId,
      productId,
      context,
      sessionId: currentSessionId
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate intelligent response based on customer message
 */
async function generateChatbotResponse(
  message: string,
  context: {
    customerId?: string;
    orderId?: string;
    productId?: string;
    context?: any;
    sessionId: string;
  }
): Promise<ChatbotResponse> {
  const { customerId, orderId, productId, context: customerContext, sessionId } = context;
  
  // Convert message to lowercase for easier processing
  const lowerMessage = message.toLowerCase();
  
  // Define response patterns and actions
  const patterns = [
    {
      keywords: ['order', 'track', 'status', 'where is my order'],
      response: "I can help you track your order! Please provide your order number or email address.",
      actions: [{ type: 'track_order' as const }],
      suggestions: ['Track Order', 'Order Status', 'Contact Support']
    },
    {
      keywords: ['product', 'item', 'buy', 'purchase', 'add to cart'],
      response: "I'd be happy to help you find products or add items to your cart! What are you looking for?",
      actions: [{ type: 'show_product' as const }],
      suggestions: ['Browse Products', 'Search Items', 'View Cart']
    },
    {
      keywords: ['cart', 'basket', 'checkout'],
      response: "Let me show you your current cart and help you with checkout!",
      actions: [{ type: 'view_cart' as const }],
      suggestions: ['View Cart', 'Proceed to Checkout', 'Continue Shopping']
    },
    {
      keywords: ['return', 'refund', 'exchange'],
      response: "I understand you'd like to return or exchange an item. I can help you with that process.",
      actions: [{ type: 'contact_support' as const }],
      suggestions: ['Return Policy', 'Contact Support', 'Start Return']
    },
    {
      keywords: ['shipping', 'delivery', 'when will it arrive'],
      response: "I can help you with shipping information! What's your order number or zip code?",
      actions: [{ type: 'track_order' as const }],
      suggestions: ['Track Order', 'Shipping Info', 'Delivery Times']
    },
    {
      keywords: ['price', 'cost', 'how much'],
      response: "I can help you find pricing information for our products! What specific item are you interested in?",
      actions: [{ type: 'show_product' as const }],
      suggestions: ['Browse Products', 'Price List', 'Deals & Offers']
    },
    {
      keywords: ['help', 'support', 'assistant'],
      response: "I'm here to help! I can assist with orders, products, shipping, returns, and more. What do you need help with?",
      suggestions: ['Track Order', 'Browse Products', 'Contact Support', 'FAQ']
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      response: "Hello! Welcome to our store. I'm your AI assistant and I'm here to help you with anything you need!",
      suggestions: ['Browse Products', 'Track Order', 'Get Help', 'View Cart']
    }
  ];

  // Find matching pattern
  let matchedPattern = patterns.find(pattern =>
    pattern.keywords.some(keyword => lowerMessage.includes(keyword))
  );

  // If no pattern matches, provide a generic helpful response
  if (!matchedPattern) {
    matchedPattern = {
      keywords: [],
      response: "I'm here to help! I can assist you with orders, products, shipping, returns, and more. How can I help you today?",
      suggestions: ['Track Order', 'Browse Products', 'Contact Support', 'FAQ']
    };
  }

  // Generate contextual suggestions based on customer context
  let contextualSuggestions = matchedPattern.suggestions || [];
  
  if (customerContext?.cart && customerContext.cart.lineItems?.length > 0) {
    contextualSuggestions = ['View Cart', 'Proceed to Checkout', 'Continue Shopping', ...contextualSuggestions];
  }
  
  if (customerContext?.recentProducts?.length > 0) {
    contextualSuggestions = ['View Recent Products', 'Add to Cart', ...contextualSuggestions];
  }
  
  if (customerContext?.orderHistory?.length > 0) {
    contextualSuggestions = ['Track Recent Order', 'Reorder', ...contextualSuggestions];
  }

  // Remove duplicates and limit suggestions
  const uniqueSuggestions = [...new Set(contextualSuggestions)].slice(0, 4);

  // Calculate confidence based on pattern match quality
  const confidence = calculateConfidence(lowerMessage, matchedPattern.keywords);

  return {
    response: matchedPattern.response,
    suggestions: uniqueSuggestions,
    actions: matchedPattern.actions || [],
    confidence,
    sessionId
  };
}

/**
 * Calculate confidence score for the response
 */
function calculateConfidence(message: string, keywords: string[]): number {
  if (keywords.length === 0) return 0.5;
  
  const matchedKeywords = keywords.filter(keyword => message.includes(keyword));
  const matchRatio = matchedKeywords.length / keywords.length;
  
  // Base confidence on keyword matches
  let confidence = matchRatio * 0.8;
  
  // Boost confidence for exact matches
  if (keywords.some(keyword => message === keyword)) {
    confidence += 0.2;
  }
  
  // Boost confidence for multiple keyword matches
  if (matchedKeywords.length > 1) {
    confidence += 0.1;
  }
  
  return Math.min(confidence, 1.0);
}

/**
 * Handle specific customer inquiries with more context
 */
async function handleCustomerSpecificInquiry(
  message: string,
  customerId: string,
  context: any
): Promise<Partial<ChatbotResponse>> {
  // This would integrate with your customer database and order system
  // For now, return enhanced context-based responses
  
  if (context?.recentOrders?.length > 0) {
    const latestOrder = context.recentOrders[0];
    return {
      response: `I can see your recent order #${latestOrder.orderNumber}. How can I help you with it?`,
      suggestions: ['Track Order', 'View Details', 'Start Return', 'Reorder']
    };
  }
  
  if (context?.cart?.lineItems?.length > 0) {
    const itemCount = context.cart.lineItems.length;
    return {
      response: `I see you have ${itemCount} item${itemCount > 1 ? 's' : ''} in your cart. Would you like to proceed to checkout?`,
      suggestions: ['View Cart', 'Proceed to Checkout', 'Continue Shopping', 'Save for Later']
    };
  }
  
  return {};
} 