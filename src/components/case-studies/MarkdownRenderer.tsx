"use client";

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let key = 0;
    let inList = false;
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={key++} className="space-y-1 mb-6 ml-6">
            {listItems.map((item, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {parseInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip empty lines
      if (!line.trim()) {
        flushList();
        elements.push(<div key={key++} className="h-4" />);
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={key++} className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0 border-b border-gray-200 dark:border-gray-700 pb-3">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={key++} className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={key++} className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        flushList();
        elements.push(
          <h4 key={key++} className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">
            {line.substring(5)}
          </h4>
        );
      } else if (line.startsWith('##### ')) {
        flushList();
        elements.push(
          <h5 key={key++} className="text-base font-semibold text-gray-900 dark:text-white mb-2 mt-4">
            {line.substring(6)}
          </h5>
        );
      } else if (line.startsWith('###### ')) {
        flushList();
        elements.push(
          <h6 key={key++} className="text-sm font-semibold text-gray-900 dark:text-white mb-2 mt-4">
            {line.substring(7)}
          </h6>
        );
      }
      // Bold text paragraphs (callouts)
      else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
        flushList();
        elements.push(
          <div key={key++} className="bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-300 dark:border-gray-600 p-4 mb-6 rounded-r">
            <p className="text-gray-900 dark:text-white font-medium leading-relaxed">
              {line.substring(2, line.length - 2)}
            </p>
          </div>
        );
      }
      // Bullet points
      else if (line.startsWith('- ')) {
        inList = true;
        listItems.push(line.substring(2));
      }
      // Regular paragraphs
      else if (line.trim()) {
        flushList();
        elements.push(
          <p key={key++} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {parseInlineFormatting(line)}
          </p>
        );
      }
    }

    flushList();
    return elements;
  };

  // Parse inline formatting (bold, italic, etc.)
  const parseInlineFormatting = (text: string) => {
    const parts = [];
    let key = 0;

    // Handle bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    let lastIndex = 0;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the bold
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add bold text
      parts.push(
        <strong key={key++} className="font-semibold text-gray-900 dark:text-white">
          {match[1]}
        </strong>
      );
      
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <article className="prose prose-gray dark:prose-invert max-w-none">
        {parseContent(content)}
      </article>
    </div>
  );
}