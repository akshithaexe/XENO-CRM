'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import PageWrapper from './PageWrapper';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLanding = pathname === '/landing';

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className="bg-background text-on-surface flex overflow-hidden h-screen">
      <Sidebar />
      <PageWrapper>{children}</PageWrapper>
    </div>
  );
}
