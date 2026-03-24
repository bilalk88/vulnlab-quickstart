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
      <body className="antialiased">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        <footer className="mt-16 py-6 text-center text-[10px] font-mono tracking-widest" style={{ color: 'var(--text-muted)' }}>
          VULNLAB CONTROL SYSTEM · AUTHORIZED USE ONLY ·{' '}
          <span className="text-[#ff4566]">⚠ DO NOT DEPLOY TO PUBLIC INTERNET</span>
        </footer>
      </body>
    </html>
  );
}
