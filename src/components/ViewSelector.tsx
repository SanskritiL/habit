'use client';

import { useState } from 'react';

export type ViewType = 'daily' | 'weekly' | 'monthly';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const views: ViewType[] = ['daily', 'weekly', 'monthly'];

  return (
    <div className="flex gap-2 mb-6">
      {views.map((view) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={`px-4 py-2 text-sm font-mono rounded-lg transition-colors ${
            currentView === view
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </button>
      ))}
    </div>
  );
}