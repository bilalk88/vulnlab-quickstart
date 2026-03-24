'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/',            label: 'Labs',        icon: '⬡' },
  { href: '/tools',       label: 'Tools',       icon: '⚙' },
  { href: '/proxy-guide', label: 'Proxy Guide', icon: '⇌' },
];

export default function NavBar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50" style={{
      background: 'rgba(5,8,16,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1a2340',
    }}>
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group no-underline">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)' }}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                fill="rgba(0,229,255,0.15)" stroke="#00e5ff" strokeWidth="1.5"/>
              <path d="M9 12l2 2 4-4" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-wider" style={{ color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>
              VULN<span style={{ color: '#00e5ff' }}>LAB</span>
            </span>
            <span className="text-[9px] tracking-widest uppercase" style={{ color: '#3d4f73' }}>
              Control Center
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px" style={{ background: '#1a2340' }} />

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {nav.map(({ href, label, icon }) => {
            const active = path === href;
            return (
              <Link key={href} href={href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all no-underline"
                style={active ? {
                  background: 'rgba(0,229,255,0.1)',
                  color: '#00e5ff',
                  border: '1px solid rgba(0,229,255,0.2)',
                } : {
                  color: '#7b8db0',
                  border: '1px solid transparent',
                }}>
                <span>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side — status pill */}
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-mono font-medium"
            style={{ background: 'rgba(255,204,0,0.06)', border: '1px solid rgba(255,204,0,0.2)', color: '#ffcc00' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse inline-block" />
            EDUCATIONAL USE ONLY
          </div>
        </div>
      </div>
    </header>
  );
}
