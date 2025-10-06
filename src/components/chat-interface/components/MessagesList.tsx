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
          <MessageBubble message={{id:"1",sender:'bot', message:"I'm excited to help you find the perfect insoles for your running needs.\n\nWhen it comes to running, it's essential to have the right support and comfort to prevent injuries and enhance your performance. Here are some fantastic options to consider:\n* **Frido Arch Sports Insole** - Designed to provide sturdy yet comfortable support for athletes, facilitating heel and arch alignment, and reducing pressure on both areas during sports activities.\n* **Frido Silicone Gel Insole** - Offers instant pressure relief and all-day comfort from heel to toe, with a hexagonal shock-absorbing gel structure that redistributes weight evenly and reduces joint strain.\n* **Frido Plantar Fasciitis Pain Relief Ortho Insole** - Provides targeted arch support and heel cushioning to alleviate sharp heel pain, especially in the morning or after inactivity, and stabilizes the foot to prevent uneven weight distribution.\n* **Frido Dual Gel Insoles** - Enhance comfort with an all-day massage feel, micro-shock absorption, and targeted support for the heel, arch, and ball of the foot.\n* **Frido Arch Support Insoles - Semi Rigid** - Offers a research-backed insole with 29. 5mm semi-rigid arch correction, providing the perfect balance of firm support and flexible comfort to correct flat feet, overpronation, and knock knees while relieving pain.\n\nThese insoles are designed to provide the necessary support, comfort, and performance enhancement for runners.\n\nTo help you make a more informed decision, could you please tell me a bit more about your specific needs and preferences? For example, do you have any foot pain or discomfort, or are you looking for a specific type of support or feature in your insoles?\n\nPRODUCTS: Frido Arch Sports Insole, Frido Silicone Gel Insole, Frido Plantar Fasciitis Pain Relief Ortho Insole, Frido Dual Gel Insoles, Frido Arch Support Insoles - Semi Rigid.", timestamp:new Date().getTime()}} />

          // <WelcomeMessage />
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