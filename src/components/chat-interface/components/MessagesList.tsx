'use client'
import React, { useRef, forwardRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageBubble } from './MessageBubble';
import { WelcomeMessage } from './WelcomeMessage';
import { TypingAnimation } from '../atoms/TypingAnimation';
import { LoadMoreButton } from '../atoms/LoadMoreButton';
import type { ChatMessage } from '@/lib/apiUtils';

interface MessagesListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  hasMoreMessages: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onScroll?: () => void;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
}

export const MessagesList = forwardRef<HTMLDivElement, MessagesListProps>(({
  messages,
  isLoading,
  isTyping,
  hasMoreMessages,
  isLoadingMore,
  onLoadMore,
  onScroll,
  messagesEndRef
}, ref) => {
  const messagesStartRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden" ref={ref} onScroll={onScroll}>
      <div className="space-y-4 p-1 sm:p-2 pb-4 max-w-6xl mx-auto">
        <div ref={messagesStartRef} />

        {/* Load More Button */}
        <LoadMoreButton 
          onClick={onLoadMore}
          isLoading={isLoadingMore}
          hasMore={hasMoreMessages}
        />

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-16 w-3/4 ml-auto rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <>
            {/* Display messages in chronological order (oldest first, newest last) */}
            {[...messages].reverse().map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Show typing animation when API call is pending */}
            {isTyping && <TypingAnimation />}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
});

MessagesList.displayName = 'MessagesList';

export default MessagesList;