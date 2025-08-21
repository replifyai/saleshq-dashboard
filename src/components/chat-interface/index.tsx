'use client'
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { chatApi, type ChatMessage, type BasicProduct } from "@/lib/apiUtils";
import { 
  ChatHeader,
  ChatInput,
  MessagesList
} from "./components";
import { ScrollToBottomButton } from "./atoms";
import { 
  extractSourceInfo, 
  isNearBottom, 
  scrollToBottom,
  shouldShowProductSelector 
} from "./utils/chatUtils";

interface APIResponse {
  message: string;
  timestamp: number;
  sources?: any[];
}

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [oldestTimestamp, setOldestTimestamp] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Product selection states
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [productFilter, setProductFilter] = useState("");
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [hasSelectedProduct, setHasSelectedProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BasicProduct | null>(null);

  // Scroll restoration state
  const [scrollRestoreData, setScrollRestoreData] = useState<{
    scrollTop: number;
    scrollHeight: number;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const productSelectorRef = useRef<HTMLDivElement>(null);
  const productListRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();



  // Load initial chat history
  const { data: initialHistory, isLoading: isLoadingInitial } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: () => chatApi.getChatHistory(),
    staleTime: 0,
  });

  // Fetch basic products when selector is shown (limited data for chat interface)
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['productsBasic'],
    queryFn: () => chatApi.getProductsBasic(),
    enabled: showProductSelector,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Load more messages mutation
  const loadMoreMutation = useMutation({
    mutationFn: async () => {
      if (!oldestTimestamp) throw new Error('No timestamp available');
      return chatApi.getChatHistory({ timestamp: oldestTimestamp });
    },
    onSuccess: (data) => {
      if (data.messages.length > 0) {
        // Append older messages to the end of the array
        setChatHistory(prev => [...prev, ...data.messages]);

        // Update the oldest timestamp for next pagination
        const oldestMessage = data.messages[data.messages.length - 1];
        setOldestTimestamp(oldestMessage.timestamp);
      }

      setHasMoreMessages(data.isMoreDataAvailable);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to load more messages",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoadingMore(false);
    },
  });

  // Filter products based on search
  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(productFilter.toLowerCase())
  ) || [];

  // Update selected index when filtering
  useEffect(() => {
    if (productFilter && selectedProductIndex >= filteredProducts.length) {
      setSelectedProductIndex(0);
    }
  }, [filteredProducts.length, productFilter, selectedProductIndex]);

  // Auto-scroll product list to selected item
  useEffect(() => {
    if (showProductSelector && productListRef.current) {
      const selectedItem = productListRef.current.children[selectedProductIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedProductIndex, showProductSelector]);

  // Initialize chat history when data is loaded
  useEffect(() => {
    if (initialHistory) {
      setChatHistory(initialHistory.messages);
      setHasMoreMessages(initialHistory.isMoreDataAvailable);

      if (initialHistory.messages.length > 0) {
        // Find the oldest message timestamp for pagination
        const oldestMessage = initialHistory.messages[initialHistory.messages.length - 1];
        setOldestTimestamp(oldestMessage.timestamp);

        // Auto-scroll to bottom only on initial load
        setTimeout(() => {
          scrollToBottom(messagesEndRef.current);
        }, 100);
      }
    }
  }, [initialHistory]);

  // Load more messages (pagination)
  const loadMoreMessages = async () => {
    if (!oldestTimestamp || isLoadingMore) return;

    // Store current scroll position before loading more messages
    const container = messagesContainerRef.current;
    if (!container) return;

    // Store scroll position data for restoration after mutation success
    setScrollRestoreData({
      scrollTop: container.scrollTop,
      scrollHeight: container.scrollHeight
    });

    setIsLoadingMore(true);
    loadMoreMutation.mutate();
  };

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string): Promise<APIResponse> => {
      // Only send product name if a product was actually selected by the user
      const selectedProductName = selectedProduct?.name;
      return chatApi.sendMessage(userMessage, 1, selectedProductName || undefined);
    },
    onSuccess: (data) => {
      // Add bot response to chat history
      const botMsg: ChatMessage = {
        id: `bot-${data.timestamp}`,
        message: data.message,
        timestamp: data.timestamp,
        sender: 'bot',
        sources: extractSourceInfo(data?.sources)
      };

      // Add bot message to the beginning of the array (most recent first)
      setChatHistory(prev => [botMsg, ...prev]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleScrollToBottom = () => {
    scrollToBottom(messagesEndRef.current);
  };

  // Handle scroll to detect if user is near bottom
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const nearBottom = isNearBottom(container);
    setShowScrollToBottom(!nearBottom);
  };

  // Add scroll listener and initial check
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Initial check when component mounts
    handleScroll();

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Check scroll position when chat history changes
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      handleScroll();

      // Auto-scroll to bottom when new messages are added or typing animation appears
      const container = messagesContainerRef.current;
      if (container) {
        const nearBottom = isNearBottom(container, 100);

        // Auto-scroll if user is near bottom OR if typing animation just appeared
        if (nearBottom || chatMutation.isPending) {
          scrollToBottom(messagesEndRef.current);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [chatHistory, chatMutation.isPending]);

  // Handle scroll restoration after loading more messages
  useEffect(() => {
    if (scrollRestoreData && !isLoadingMore) {
      const container = messagesContainerRef.current;
      if (container) {
        const newScrollHeight = container.scrollHeight;
        const heightDifference = newScrollHeight - scrollRestoreData.scrollHeight;
        container.scrollTop = scrollRestoreData.scrollTop + heightDifference;
        setScrollRestoreData(null); // Clear restore data
      }
    }
  }, [chatHistory, scrollRestoreData, isLoadingMore]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message immediately to chat history
    const userMessage = message.trim();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      message: userMessage,
      timestamp: Date.now(),
      sender: 'user'
    };

    // Add user message to the beginning of the array (most recent first)
    setChatHistory(prev => [userMsg, ...prev]);

    // Clear the input immediately
    setMessage("");

    // Only reset dropdown state, keep selected product
    setSelectedProductIndex(0);
    setShowProductSelector(false);

    // Send the message to API
    chatMutation.mutate(userMessage);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    const cursorPosition = e.target.selectionStart || 0;
    const { show, filterText } = shouldShowProductSelector(value, cursorPosition);

    if (show && !showProductSelector) {
      setShowProductSelector(true);
      setProductFilter(filterText);
      setSelectedProductIndex(0);
    } else if (show && showProductSelector) {
      setProductFilter(filterText);
    } else if (!show && showProductSelector) {
      setShowProductSelector(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (showProductSelector) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedProductIndex(prev =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedProductIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredProducts.length > 0) {
          selectProduct(filteredProducts[selectedProductIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowProductSelector(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectProduct = (product: BasicProduct) => {
    // Find the last "/" and replace everything after it with the product name
    const lastSlashIndex = message.lastIndexOf('/');
    const newTextBefore = message.substring(0, lastSlashIndex);
    
    // Replace the text after the slash with the product name
    const newMessage = newTextBefore + product.name;

    setMessage(newMessage);
    setShowProductSelector(false);
    setHasSelectedProduct(true); // Mark that a product was selected
    setSelectedProduct(product); // Store the selected product
  };

  // Close product selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productSelectorRef.current && !productSelectorRef.current.contains(event.target as Node)) {
        setShowProductSelector(false);
      }
    };

    if (showProductSelector) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProductSelector]);



  return (
    <div className="h-full flex flex-col relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <ChatHeader />

      <MessagesList
        ref={messagesContainerRef}
        messages={chatHistory}
        isLoading={isLoadingInitial}
        isTyping={chatMutation.isPending}
        hasMoreMessages={hasMoreMessages}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMoreMessages}
        onScroll={handleScroll}
        messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
      />

      <ScrollToBottomButton
        show={showScrollToBottom}
        onClick={handleScrollToBottom}
      />

      <ChatInput
        message={message}
        onMessageChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onSendMessage={handleSendMessage}
        isLoading={chatMutation.isPending}
        selectedProduct={selectedProduct}
        hasSelectedProduct={hasSelectedProduct}
        onClearProduct={() => {
          setSelectedProduct(null);
          setHasSelectedProduct(false);
        }}
        showProductSelector={showProductSelector}
        products={filteredProducts}
        isLoadingProducts={isLoadingProducts}
        productFilter={productFilter}
        selectedProductIndex={selectedProductIndex}
        onSelectProduct={selectProduct}
        productSelectorRef={productSelectorRef as React.RefObject<HTMLDivElement>}
        productListRef={productListRef as React.RefObject<HTMLDivElement>}
      />
    </div>
  );
}