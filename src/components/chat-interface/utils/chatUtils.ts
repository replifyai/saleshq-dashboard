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
 * and properly formatting markdown
 */
export const cleanMessage = (message: string): string => {
  // Remove source information
  let cleaned = message.replace(/\s*\(Source: .+?\)$/, '');
  
  // Convert escaped newlines (\n) to actual newlines
  cleaned = cleaned.replace(/\\n/g, '\n');
  
  // Optionally convert bullet points (•) to markdown-compatible bullets (-)
  // This helps ensure consistent markdown rendering
  cleaned = cleaned.replace(/^•\s/gm, '- ');
  
  return cleaned;
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

/**
 * Extract image URLs from markdown text
 * Supports:
 * - Markdown image syntax: ![alt](url)
 * - Plain URLs in markdown links: [text](url) where url is an image
 * - Plain image URLs in list items: - https://example.com/image.jpg
 * - Direct image URLs in text
 */
export const extractImageUrls = (text: string): string[] => {
  const imageUrls: string[] = [];
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
  
  // Pattern 1: Markdown image syntax ![alt](url)
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  const processedUrls = new Set<string>();
  
  while ((match = markdownImageRegex.exec(text)) !== null) {
    const url = match[2].trim();
    if (imageExtensions.test(url) && !processedUrls.has(url)) {
      imageUrls.push(url);
      processedUrls.add(url);
    }
  }
  
  // Pattern 2: Markdown links [text](url) where url is an image
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  while ((match = markdownLinkRegex.exec(text)) !== null) {
    const url = match[2].trim();
    if (imageExtensions.test(url) && !processedUrls.has(url)) {
      imageUrls.push(url);
      processedUrls.add(url);
    }
  }
  
  // Pattern 3: Plain URLs in list items (lines starting with - or * followed by URL)
  // This handles cases like: - https://example.com/image.jpg?v=123
  // Match URLs that may have query parameters and fragments
  const listItemUrlRegex = /^[\s]*[-*]\s+(https?:\/\/[^\s\)\n]+)/gim;
  while ((match = listItemUrlRegex.exec(text)) !== null) {
    let url = match[1].trim();
    // Remove trailing punctuation that might be part of the sentence (but keep query params)
    // Only remove punctuation if it's not part of the URL (like ?v=123)
    if (!url.includes('?') && !url.includes('#')) {
      url = url.replace(/[.,;:!?]+$/, '');
    }
    if (imageExtensions.test(url) && !processedUrls.has(url)) {
      imageUrls.push(url);
      processedUrls.add(url);
    }
  }
  
  // Pattern 4: Direct image URLs (standalone URLs that are images)
  // Match URLs that are not part of markdown syntax
  const urlRegex = /(https?:\/\/[^\s\)]+)/g;
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[1].trim();
    const cleanUrl = url.replace(/[.,;:!?]+$/, '');
    
    // Only add if it's an image URL and not already captured
    if (imageExtensions.test(cleanUrl) && !processedUrls.has(cleanUrl)) {
      // Check if it's not part of a markdown link or image
      const urlIndex = text.indexOf(url);
      const beforeUrl = text.substring(Math.max(0, urlIndex - 20), urlIndex);
      
      // Skip if it's part of a markdown link/image syntax
      if (!beforeUrl.includes('](') && !beforeUrl.includes('![')) {
        imageUrls.push(cleanUrl);
        processedUrls.add(cleanUrl);
      }
    }
  }
  
  // Return unique URLs
  return imageUrls;
};

/**
 * Remove image URLs from message text for cleaner display
 * This removes markdown image syntax and image URLs from lists
 */
export const removeImageUrlsFromText = (text: string, imageUrls: string[]): string => {
  if (!imageUrls || imageUrls.length === 0) {
    return text;
  }
  
  let cleaned = text;
  
  // Remove markdown image syntax ![alt](url)
  cleaned = cleaned.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '');
  
  // Remove markdown links that point to images
  imageUrls.forEach(url => {
    // Escape special regex characters in URL
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Remove [text](url) where url matches (markdown links)
    cleaned = cleaned.replace(new RegExp(`\\[([^\\]]+)\\]\\(${escapedUrl}(?:\\)|\\s*\\))`, 'g'), '');
    
    // Remove list items that contain image URLs
    // Pattern: - https://url or * https://url (with optional trailing punctuation)
    cleaned = cleaned.replace(new RegExp(`^[\\s]*[-*]\\s+${escapedUrl}[\\s]*[.,;:!?]*[\\s]*$`, 'gim'), '');
    
    // Remove standalone image URLs (with optional trailing punctuation)
    // This handles URLs that appear in the middle of text
    cleaned = cleaned.replace(new RegExp(`\\s+${escapedUrl}[\\s]*[.,;:!?]*`, 'g'), ' ');
    cleaned = cleaned.replace(new RegExp(`${escapedUrl}[\\s]*[.,;:!?]*\\s+`, 'g'), ' ');
  });
  
  // Clean up multiple consecutive newlines (more than 2)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Clean up multiple spaces
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');
  
  // Clean up leading/trailing whitespace on each line
  cleaned = cleaned.split('\n').map(line => line.trim()).join('\n');
  
  // Clean up leading/trailing whitespace overall
  cleaned = cleaned.trim();
  
  return cleaned;
};