import './globals.css';
import type { Metadata } from 'next';
import AppNav from '@/components/AppNav';

export const metadata: Metadata = {
  title: 'Maya AI Studio',
  description: 'AI image generation platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AppNav />
        {children}
      </body>
    </html>
  );
}
