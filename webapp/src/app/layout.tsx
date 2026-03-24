import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'VulnLab Dashboard | Pentest Lab Control Panel',
  description: 'Centralized web dashboard to manage vulnerable lab containers for security training and penetration testing practice.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-gray-950 text-gray-100 min-h-screen font-sans antialiased">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-800 mt-16 py-6 text-center text-xs text-gray-600">
          VulnLab Dashboard · For authorized security research &amp; education only ·{' '}
          <span className="text-emerald-600">⚠ Do not use against systems you do not own</span>
        </footer>
      </body>
    </html>
  );
}
