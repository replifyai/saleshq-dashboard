/**
 * Chat utility functions for message processing and UI helpers
 */

/**
 * Extract source information from the message if it contains source references
 */
export const extractSourceInfo = (messages: any[] | undefined): any[] | undefined => {
  if (!Array.isArray(messages)) return undefined;

  // Create a Map to store unique sources by sourceUrl to avoid duplicates
  const uniqueSources = new Map();

  messages
    .filter(msg => msg && msg.sourceUrl)
    .forEach(msg => {
      if (!uniqueSources.has(msg.sourceUrl)) {
        uniqueSources.set(msg.sourceUrl, msg);
      }
    });

  return Array.from(uniqueSources.values());
};

/**
 * Clean message by removing source information for display
 */
export const cleanMessage = (message: string): string => {
  return message.replace(/\s*\(Source: .+?\)$/, '');
};

/**
 * Handle scroll to detect if user is near bottom
 */
export const isNearBottom = (container: HTMLElement, threshold: number = 50): boolean => {
  const { scrollTop, scrollHeight, clientHeight } = container;
  return scrollHeight - scrollTop - clientHeight < threshold;
};

/**
 * Scroll element to bottom smoothly
 */
export const scrollToBottom = (element: HTMLElement | null) => {
  element?.scrollIntoView({ behavior: "smooth" });
};

/**
 * Check if user typed "/" for product selector
 */
export const shouldShowProductSelector = (
  value: string, 
  cursorPosition: number
): { show: boolean; filterText: string } => {
  const textBeforeCursor = value.substring(0, cursorPosition);
  const lastChar = textBeforeCursor[textBeforeCursor.length - 1];
  const charBeforeLast = textBeforeCursor[textBeforeCursor.length - 2];

  if (lastChar === '/' && (textBeforeCursor.length === 1 || charBeforeLast === ' ')) {
    return { show: true, filterText: "" };
  }

  // Extract filter text after the last "/"
  const lastSlashIndex = textBeforeCursor.lastIndexOf('/');
  if (lastSlashIndex !== -1) {
    const filterText = textBeforeCursor.substring(lastSlashIndex + 1);
    return { show: true, filterText };
  }

  return { show: false, filterText: "" };
};