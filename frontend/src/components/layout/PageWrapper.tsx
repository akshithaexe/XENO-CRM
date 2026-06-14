'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    setShowSettings(false);
    router.push('/landing');
  };

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
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-sm text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>

            {/* Settings dropdown */}
            <AnimatePresence>
              {showSettings && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-sm w-56 bg-surface border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-xs">
                      <button
                        onClick={() => {
                          setShowSettings(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full flex items-center gap-sm px-md py-sm text-error hover:bg-error-container rounded-lg transition-colors text-body-sm font-bold"
                      >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <div className="h-8 w-px bg-outline-variant mx-sm"></div>
          <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-high p-xs pr-md rounded-full transition-all">
            <div className="w-8 h-8 rounded-full border border-outline-variant shadow-sm bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs">
              A
            </div>
            <span className="text-body-md font-bold text-primary">Admin</span>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-2xl border border-outline-variant shadow-2xl p-lg max-w-sm w-full mx-md"
            >
              <div className="flex items-center gap-sm mb-md">
                <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-error">logout</span>
                </div>
                <h3 className="text-body-lg font-bold text-on-surface">Log Out</h3>
              </div>
              <p className="text-body-sm text-on-surface-variant mb-lg">
                Are you sure you want to log out? You will be redirected to the landing page.
              </p>
              <div className="flex items-center gap-sm justify-end">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-md py-sm text-body-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-md py-sm text-body-sm font-bold text-white bg-error hover:bg-error/90 rounded-lg transition-colors shadow-sm"
                >
                  Yes, Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 p-lg max-w-[1440px] mx-auto w-full">
        {children}
      </div>
    </main>
  );
}

