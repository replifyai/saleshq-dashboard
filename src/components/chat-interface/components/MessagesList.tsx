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
        <MessageBubble message={{id:"1",sender:'bot', message:"## Overview\nThe **Frido Ultimate Coccyx Seat Cushion** and the **Frido Ultimate Pro Seat Cushion** are two distinct products designed to provide comfort and support for individuals who spend long hours sitting. The **Frido Ultimate Coccyx Seat Cushion** is specifically designed to alleviate tailbone and coccyx pain, while the **Frido Ultimate Pro Seat Cushion** is crafted for discerning individuals who value both health and luxury .\n\n## Features Comparison\n\n- **Frido Ultimate Coccyx Seat Cushion**: This cushion features an ergonomically designed memory foam infused with cooling gel, providing superior pressure relief and support for posture .\n- **Frido Ultimate Pro Seat Cushion**: It boasts Frido’s exclusive Hi-Per foam, offering a velvety-soft feel with enduring resilience, and is meticulously shaped to deliver unmatched support and elegance .\n\n## Specifications Comparison\n\n- **Frido Ultimate Coccyx Seat Cushion**: Available in variants for individuals below and above 60kg, with a price point of 1699 .\n- **Frido Ultimate Pro Seat Cushion**: Priced at 1799, with a focus on luxury and health, designed for discerning individuals .\n\n## Design & Comfort\n\n- **Frido Ultimate Coccyx Seat Cushion**: Designed with an orthopedic ergonomic curve to evenly distribute pressure, reducing stress on the coccyx, hips, and spine. It also features a U-shaped cutout to prevent compression of the coccyx .\n- **Frido Ultimate Pro Seat Cushion**: Crafted with refined contours to embrace the hips and thighs, guiding the body into natural alignment while alleviating pressure on the spine .\n\n## Use Cases & Benefits\n\n- **Frido Ultimate Coccyx Seat Cushion**: Ideal for individuals experiencing tailbone and coccyx pain, lower back stiffness, and poor posture. It provides pain relief, pressure distribution, and superior comfort compared to regular cushions .\n- **Frido Ultimate Pro Seat Cushion**: Suitable for those seeking luxury and health benefits, aiming to relieve discomfort from prolonged sitting, poor posture, and back pain. It encourages upright sitting and spinal alignment .\n\n## Summary\nThe key differences between the **Frido Ultimate Coccyx Seat Cushion** and the **Frido Ultimate Pro Seat Cushion** lie in their design focus, material, and pricing. The **Frido Ultimate Coccyx Seat Cushion** is specifically tailored for coccyx and tailbone support, while the **Frido Ultimate Pro Seat Cushion** offers a more luxurious experience with its exclusive Hi-Per foam. Recommendations would depend on individual priorities: for those needing targeted coccyx support, the **Frido Ultimate Coccyx Seat Cushion** might be more suitable, whereas for those valuing luxury and comprehensive support, the **Frido Ultimate Pro Seat Cushion** could be the better choice .", timestamp:new Date().getTime()}} />
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