import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export default function StatCard({ title, value, subtitle, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white border border-outline-variant p-lg rounded-xl shadow-sm flex flex-col items-center text-center ${className}`}>
      <div className="flex flex-col items-center gap-xs">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-2">
            {icon}
          </div>
        )}
        <p className="text-label-md font-bold uppercase tracking-widest text-on-surface-variant mb-1">{title}</p>
        <p className="text-headline-lg font-bold text-primary">{value}</p>
        {subtitle && <p className="text-body-sm text-on-surface-variant mt-2">{subtitle}</p>}
        {trend && (
          <p className={`text-label-md font-bold flex items-center gap-1 mt-2 ${trend.positive ? 'text-success-on-container bg-success-container' : 'text-error bg-error-container'} px-2 py-0.5 rounded-full`}>
            {trend.positive ? <span className="material-symbols-outlined text-sm">trending_up</span> : <span className="material-symbols-outlined text-sm">trending_down</span>} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
