'use client'
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { UserAvatar } from '../atoms/UserAvatar';
import { MessageSources } from '../atoms/MessageSources';
import { cleanMessage } from '../utils/chatUtils';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage } from '@/lib/apiUtils';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopyMessage = async (messageId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
      toast({
        title: "Copied",
        description: "Message copied to clipboard",
      });
    } catch (error) {
      console.log("🚀 ~ handleCopyMessage ~ error:", error);
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`flex items-start space-x-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'bot' && (
        <div className="flex-shrink-0">
          <UserAvatar type="bot" />
        </div>
      )}

      <div className={`flex-1 min-w-full ${message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
        <div className={`group relative ${message.sender === 'user'
          ? 'bg-blue-700 rounded-2xl rounded-tr-md p-4 max-w-[80%] sm:max-w-lg lg:max-w-2xl shadow-lg hover:shadow-xl transition-all duration-200'
          : 'bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/50 rounded-2xl rounded-tl-md p-4 max-w-[80%] sm:max-w-lg lg:max-w-2xl shadow-sm backdrop-blur-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200'
          }`}>
          {/* Tail border (shadow/border layer) */}
          <div className={`absolute ${message.sender === 'user'
            ? 'right-[-9px] top-[12px] border-l-[10px] border-l-blue-700 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent'
            : 'left-[-10px] top-[12px] border-r-[10px] border-r-gray-200 dark:border-r-gray-700/50 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent'
            }`}></div>

          {/* Tail main (matches bubble bg) */}
          <div className={`absolute ${message.sender === 'user'
            ? 'right-[-8px] top-[12px] border-l-[10px] border-l-blue-700 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent'
            : 'left-[-9px] top-[12px] border-r-[10px] border-r-white dark:border-r-gray-800 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent'
            }`}></div>

          {message.sender === 'bot' ? (
            <div className="text-sm leading-relaxed break-words text-gray-700 dark:text-gray-300 prose prose-sm prose-gray dark:prose-invert max-w-none">
              <ReactMarkdown
                // components={{
                //   // Custom styling for markdown elements
                //   h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 text-gray-900 dark:text-white" {...props} />,
                //   h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 text-gray-900 dark:text-white" {...props} />,
                //   h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1 text-gray-900 dark:text-white" {...props} />,
                //   p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                //   ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                //   ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                //   li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                //   strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-white" {...props}> </strong>,
                //   em: ({ node, ...props }) => <em className="italic" {...props} />,
                //   code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                //   pre: ({ node, ...props }) => <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto mb-2" {...props} />,
                //   blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-2" {...props} />,
                // }}
              >
                {cleanMessage(message.message)}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap text-white">
              {message.message}
            </p>
          )}

          {/* Copy button for bot messages */}
          {message.sender === 'bot' && (
            <button
              onClick={() => handleCopyMessage(message.id, cleanMessage(message.message))}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:shadow-md hover:scale-110"
              title="Copy message"
            >
              {copiedMessageId === message.id ? (
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
              )}
            </button>
          )}

          {/* Sources indicator for bot messages */}
          {message.sender === 'bot' && message.sources && (
            <MessageSources sources={message.sources} />
          )}
        </div>
      </div>

      {message.sender === 'user' && (
        <div className="flex-shrink-0">
          <UserAvatar type="user" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;