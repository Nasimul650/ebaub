'use client';

import React from 'react';

interface Props {
  onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <button
        onClick={() => onSelect('Explain Binary Search Tree (BST) worst case complexity')}
        className="px-3 py-1.5 rounded-xl bg-white hover:bg-campus-50 text-blue-800 border border-slate-200 shadow-2xs font-medium"
      >
        🌲 Binary Search Tree Complexity
      </button>
      <button
        onClick={() => onSelect('What is Recursion and Divide & Conquer?')}
        className="px-3 py-1.5 rounded-xl bg-white hover:bg-campus-50 text-campus-900 border border-slate-200 shadow-2xs font-medium"
      >
        🔄 Recursion & Divide-and-Conquer
      </button>
    </div>
  );
}
