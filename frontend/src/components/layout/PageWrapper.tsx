import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

import { Bell, Search } from 'lucide-react';

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <main className={`flex-1 min-w-0 h-screen bg-background flex flex-col overflow-y-auto custom-scrollbar ${className}`}>
      {/* Top Header */}
      <header className="h-16 border-b border-outline-variant bg-surface px-lg flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search audiences, campaigns, or insights..." 
              className="w-full bg-surface-container-low border-none rounded-full pl-xl pr-md py-sm text-body-md focus:ring-2 focus:ring-secondary-fixed transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button className="p-sm text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <button className="p-sm text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
          <button className="p-sm text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-8 w-px bg-outline-variant mx-sm"></div>
          <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-high p-xs pr-md rounded-full transition-all">
            <div className="w-8 h-8 rounded-full border border-outline-variant shadow-sm bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs">
              A
            </div>
            <span className="text-body-md font-bold text-primary">Admin</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-lg max-w-[1440px] mx-auto w-full">
        {children}
      </div>
    </main>
  );
}
