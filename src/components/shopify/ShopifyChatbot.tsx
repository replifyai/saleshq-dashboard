'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User,
  ShoppingCart,
  Package,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function ShopifyChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: "Hello! I'm your Shopify store assistant. How can I help you today?",
      timestamp: new Date(),
      suggestions: ['Track Order', 'Browse Products', 'Get Help', 'View Cart']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        message: "I can help you track your order! Please provide your order number or email address, and I'll look it up for you.",
        timestamp: new Date(),
        suggestions: ['Order Status', 'Shipping Info', 'Contact Support']
      };
    }

    if (lowerMessage.includes('product') || lowerMessage.includes('buy')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        message: "Great! I'd be happy to help you find products. What are you looking for? I can help you browse our catalog or search for specific items.",
        timestamp: new Date(),
        suggestions: ['Browse Categories', 'Search Products', 'View Deals', 'Add to Cart']
      };
    }

    if (lowerMessage.includes('cart') || lowerMessage.includes('checkout')) {
      return {
        id: Date.now().toString(),
        message: "I can help you with your cart and checkout process! Would you like to view your current cart, proceed to checkout, or add more items?",
        timestamp: new Date(),
        suggestions: ['View Cart', 'Proceed to Checkout', 'Continue Shopping', 'Cart Help'],
        type: 'bot'
      };
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        message: "I'm here to help! I can assist with orders, products, shipping, returns, and more. What specific help do you need?",
        timestamp: new Date(),
        suggestions: ['Order Help', 'Product Help', 'Shipping Info', 'Return Policy', 'Contact Human']
      };
    }

    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        message: "I can help you with shipping information! We offer various shipping options including standard, express, and free shipping on orders over $50. What would you like to know?",
        timestamp: new Date(),
        suggestions: ['Shipping Rates', 'Delivery Times', 'Track Package', 'Shipping FAQ']
      };
    }

    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        message: "I understand you'd like to return or exchange an item. Our return policy allows returns within 30 days of purchase. I can help you start the return process.",
        timestamp: new Date(),
        suggestions: ['Start Return', 'Return Policy', 'Exchange Item', 'Contact Support']
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'bot',
      message: "I'm here to help! I can assist with orders, products, shipping, returns, and more. How can I help you today?",
      timestamp: new Date(),
      suggestions: ['Track Order', 'Browse Products', 'Get Help', 'View Cart', 'Contact Support']
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px]">
      <Card className="w-full h-full shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Store Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea className="flex-1 px-4 pb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex">
                  {message.type === 'bot' ? (
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm">{message.message}</p>
                        </div>
                        {message.suggestions && (
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs h-7 px-2"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-2 max-w-[80%] ml-auto">
                      <div className="bg-blue-600 text-white rounded-lg p-3">
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 