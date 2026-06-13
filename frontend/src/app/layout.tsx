import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import PageWrapper from '@/components/layout/PageWrapper';

export const metadata: Metadata = {
  title: 'XenoReach — Enterprise Marketing Intelligence',
  description: 'AI-powered customer engagement and marketing intelligence platform for consumer brands.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-surface min-h-screen flex font-body-sm overflow-hidden">
        <Sidebar />
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}
