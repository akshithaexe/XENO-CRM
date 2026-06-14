'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/customers', label: 'Customers', icon: 'groups' },
  { href: '/segments', label: 'Audiences', icon: 'person_search' },
  { href: '/campaigns', label: 'Campaigns', icon: 'campaign' },
  { href: '/analytics', label: 'Analytics', icon: 'assessment' },
  { href: '/ai-assistant', label: 'AI Copilot', icon: 'auto_awesome' },
];

const sidebarVariants = {
  hidden: { x: -40, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 25,
    },
  },
};

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
      delay: 0.1,
    },
  },
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="show"
      className="w-[280px] flex-shrink-0 h-screen bg-surface-container-low border-r border-outline-variant flex flex-col p-md gap-sm z-50"
    >
      {/* Logo */}
      <motion.div variants={logoVariants} className="flex items-center gap-md px-md py-lg mb-md">
        <Link href="/" className="flex items-center gap-md group">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md font-extrabold text-primary leading-tight group-hover:text-primary-fixed-variant transition-colors">XenoReach</h1>
            <p className="text-label-md font-label-md text-on-surface-variant opacity-70">Marketing Automation</p>
          </div>
        </Link>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-xs overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <motion.div key={item.href} variants={itemVariants}>
              <Link
                href={item.href}
                className={`flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary-fixed text-on-secondary-fixed font-bold scale-98'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-label-md font-label-md">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <motion.div variants={itemVariants}>
        <Link href="/campaigns/new">
          <button className="w-full bg-primary text-white font-bold py-md px-lg rounded-xl flex items-center justify-center gap-sm shadow-lg hover:shadow-primary/20 transition-all active:scale-95 mt-lg">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="text-label-md font-label-md">New Campaign</span>
          </button>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemVariants} className="mt-auto border-t border-outline-variant pt-md flex flex-col gap-xs">
        <Link href="#" className="flex items-center gap-md text-on-surface-variant hover:text-primary px-md py-sm rounded-lg transition-colors">
          <span className="material-symbols-outlined">support_agent</span>
          <span className="text-label-md font-label-md">Support</span>
        </Link>
      </motion.div>
    </motion.aside>
  );
}
