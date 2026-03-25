'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/',            label: 'Labs',        icon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  )},
  { href: '/tools',       label: 'Tools',       icon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  )},
  { href: '/proxy-guide', label: 'Proxy Guide', icon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    </svg>
  )},
];

export default function NavBar() {
  const path = usePathname();
  return (
    <header className="navbar">
      <div className="mx-auto flex max-w-screen-2xl items-center h-14 px-6 gap-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline shrink-0">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#1a1654,#0f2040)', border: '1px solid rgba(124,111,247,0.4)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(124,111,247,0.4),rgba(34,211,238,0.1))', opacity: 0.6 }} />
            <svg className="relative z-10" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                fill="rgba(124,111,247,0.2)" stroke="#7c6ff7" strokeWidth="1.5"/>
              <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-bold tracking-tight leading-none" style={{ color: '#f1f5f9' }}>
              Pentest<span className="text-gradient-violet">Ground</span>
            </div>
            <div className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              Security Lab Manager
            </div>
          </div>
        </Link>

        {/* Divider */}
        <div className="h-6 w-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {nav.map(({ href, label, icon }) => {
            const active = path === href;
            return (
              <Link key={href} href={href} className="no-underline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', borderRadius: '10px', padding: '7px 14px', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
                  ...(active ? {
                    background: 'rgba(124,111,247,0.12)',
                    color: '#a5a0ff',
                    border: '1px solid rgba(124,111,247,0.25)',
                  } : {
                    color: 'var(--text-secondary)',
                    border: '1px solid transparent',
                  }),
                }}>
                <span style={{ opacity: active ? 1 : 0.6 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium"
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
            Educational Use Only
          </div>
        </div>
      </div>
    </header>
  );
}
