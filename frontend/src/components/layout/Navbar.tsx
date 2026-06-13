'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';

interface NavbarProps {
  title?: string;
}

export default function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-surface-200">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          {title && <h1 className="text-xl font-bold text-surface-900">{title}</h1>}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2 w-64 bg-surface-50 border border-surface-200 rounded-xl text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-surface-100 transition-colors" id="notifications-btn">
            <Bell className="w-5 h-5 text-surface-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-lg hover:shadow-brand-500/30 transition-shadow">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
