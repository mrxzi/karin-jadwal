'use client';

import React from 'react';
import { Clock, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  activeTab: 'today' | 'weekly' | 'widget';
  setActiveTab: (tab: 'today' | 'weekly' | 'widget') => void;
  onOpenAddModal: () => void;
  currentTimeStr: string;
  currentDayName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentTimeStr,
  currentDayName,
}) => {
  return (
    <header className="sticky top-3 z-40 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-4">
      <div className="rounded-2xl backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-xl p-2 sm:px-5 sm:py-2.5 transition-all duration-200">
        <div className="flex items-center justify-center h-12 sm:h-14 gap-3">

          {/* Navigation Tabs */}
          <nav className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                activeTab === 'today'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm font-bold border border-zinc-200 dark:border-zinc-700'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Hari Ini</span>
            </button>

            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                activeTab === 'weekly'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm font-bold border border-zinc-200 dark:border-zinc-700'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Semua Jadwal</span>
            </button>
          </nav>

          {/* Live Clock Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-pulse" />
            <span>{currentDayName}</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="font-mono font-bold">{currentTimeStr}</span>
          </div>

        </div>
      </div>
    </header>
  );
};
