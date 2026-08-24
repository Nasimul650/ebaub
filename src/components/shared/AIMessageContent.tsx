'use client';

import React from 'react';

interface Props {
  content: string;
  isUser?: boolean;
}

export default function AIMessageContent({ content, isUser = false }: Props) {
  if (isUser) {
    return <div className="whitespace-pre-line">{content}</div>;
  }

  // Pre-process content: clean up any raw math wrapper symbols like $$ or $ surrounding simple expressions
  const cleanedContent = content
    .replace(/\$\$(.*?)\$\$/g, '$1')
    .replace(/\$(.*?)\$/g, '$1');

  // Split content into lines for block-level parsing
  const lines = cleanedContent.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (key: string) => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={key} className="space-y-1.5 my-2 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-campus-700 mt-1.5 shrink-0" />
              <span className="flex-1">{parseInlineFormattedText(item)}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={key} className="space-y-1.5 my-2 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-bold text-campus-800 text-[11px] shrink-0 min-w-[14px]">{idx + 1}.</span>
              <span className="flex-1">{parseInlineFormattedText(item)}</span>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check for bullet list item: - or * or •
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    // Check for numbered list item: 1. or 1)
    const numberMatch = trimmed.match(/^\d+[\.\)]\s+(.+)$/);
    // Check for heading: #, ##, ###
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);

    if (bulletMatch) {
      if (currentList && currentList.type !== 'ul') {
        flushList(`list-${index}`);
      }
      if (!currentList) {
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      return;
    }

    if (numberMatch) {
      if (currentList && currentList.type !== 'ol') {
        flushList(`list-${index}`);
      }
      if (!currentList) {
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numberMatch[1]);
      return;
    }

    // If it's not a list item, flush any existing list
    flushList(`list-${index}`);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      elements.push(
        <div 
          key={`heading-${index}`} 
          className={`font-bold text-slate-900 mt-2 mb-1 ${level <= 2 ? 'text-sm' : 'text-xs'}`}
        >
          {parseInlineFormattedText(text)}
        </div>
      );
      return;
    }

    if (!trimmed) {
      // Empty line adds subtle spacing between paragraphs
      elements.push(<div key={`space-${index}`} className="h-1.5" />);
      return;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${index}`} className="my-1 leading-relaxed">
        {parseInlineFormattedText(trimmed)}
      </p>
    );
  });

  // Flush any trailing list
  flushList('list-end');

  return <div className="space-y-0.5 text-xs">{elements}</div>;
}

/**
 * Parses inline formatting like **bold**, *italic*, and `code`
 */
function parseInlineFormattedText(text: string): React.ReactNode {
  // Pattern to match **bold**, `code`, or *italic*
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);

  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
      return (
        <code key={i} className="px-1.5 py-0.5 bg-slate-100 text-campus-800 rounded font-mono text-[11px] border border-slate-200">
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
      return (
        <em key={i} className="italic text-slate-700">
          {token.slice(1, -1)}
        </em>
      );
    }
    return token;
  });
}
