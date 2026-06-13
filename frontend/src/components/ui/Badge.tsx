import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-surface-container text-on-surface-variant border-outline-variant',
    success: 'bg-success-container text-success-on-container border-success-container',
    warning: 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]', // Mapping to error container for now or custom warning
    danger: 'bg-error-container text-on-error-container border-error-container',
    info: 'bg-secondary-container text-on-secondary-container border-secondary-container',
    purple: 'bg-tertiary-container text-on-tertiary-container border-tertiary-container',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
