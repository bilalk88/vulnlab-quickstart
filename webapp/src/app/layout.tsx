import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'VulnLab Control Center',
  description: 'Your all-in-one security lab dashboard. Manage, launch, and monitor vulnerable targets for hands-on penetration testing practice.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased" suppressHydrationWarning>
        <NavBar />
        <main className="mx-auto max-w-7xl px-6 py-7">{children}</main>
        <footer className="mt-16 py-6 border-t" style={{ borderColor: 'var(--border-dim)' }}>
          <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[11px] font-mono tracking-widest" style={{ color: 'var(--text-muted)' }}>
              VULNLAB CONTROL CENTER · SECURITY LAB MANAGER
            </span>
            <span className="text-[11px] font-mono" style={{ color: 'var(--accent-red)' }}>
              ⚠ EDUCATIONAL USE ONLY — DO NOT DEPLOY TO PUBLIC INTERNET
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
