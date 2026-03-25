'use client';

import { useState, useTransition } from 'react';
import type { Lab } from '@/lib/labs';
import StatusBadge from './StatusBadge';
import LogViewer from './LogViewer';
import { startLab, stopLab, restartLab } from '@/lib/api';

interface LabCardProps {
  lab: Lab;
  onRefresh: () => void;
}

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  'Web App': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  'Database': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
};

const CARD_COLOR: Record<string, { color: string; bg: string; border: string }> = {
  'card-web':    { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
  'card-db':     { color: '#7c6ff7', bg: 'rgba(124,111,247,0.08)', border: 'rgba(124,111,247,0.2)' },
  'card-danger': { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
};

export default function LabCard({ lab, onRefresh }: LabCardProps) {
  const [showLogs, setShowLogs] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const status    = lab.status ?? 'unknown';
  const isRunning = status === 'running';

  let cardClass = 'card-web';
  if (lab.category === 'Database') cardClass = 'card-db';
  if (lab.id === 'dvwa' || lab.id === 'bwapp') cardClass = 'card-danger';
  const theme = CARD_COLOR[cardClass];

  async function handleAction(fn: () => Promise<{ success?: boolean; error?: string; message?: string }>) {
    setActionMsg(null);
    startTransition(async () => {
      try {
        const r = await fn();
        setActionMsg(r.error ? `✗ ${r.error}` : `✓ ${r.message}`);
        setTimeout(() => { setActionMsg(null); onRefresh(); }, 2000);
      } catch (e: unknown) {
        setActionMsg(`✗ ${e instanceof Error ? e.message : 'Error'}`);
      }
    });
  }

  return (
    <>
      <div className={`lab-card ${cardClass} ${isPending ? 'opacity-40 pointer-events-none' : ''}`}>

        {/* ── Top Glow Strip ── */}
        <div style={{ height: '3px', background: `linear-gradient(90deg,transparent,${theme.color},transparent)`, opacity: 0.5 }} />

        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon bubble */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
              style={{ background: theme.bg, border: `1px solid ${theme.border}`, color: theme.color }}>
              {CATEGORY_ICON[lab.category] ?? '◈'}
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold leading-tight truncate" style={{ color: '#f1f5f9' }}>{lab.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  style={{ background: theme.bg, color: theme.color, border: `1px solid ${theme.border}`, letterSpacing: '0.05em' }}>
                  {lab.category}
                </span>
                <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>:{lab.port}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* ── Body ── */}
        <div className="px-5 pb-4 flex-1 flex flex-col gap-4">
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {lab.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {lab.tags.map(tag => (
              <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Credentials */}
          {(lab.defaultCreds.user || lab.defaultCreds.password) && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm">🔑</span>
              <div className="flex items-center gap-3 text-[12px] font-mono overflow-hidden">
                {lab.defaultCreds.user && (
                  <span style={{ color: 'var(--text-secondary)' }}>
                    user: <span style={{ color: '#e2e8f0' }}>{lab.defaultCreds.user}</span>
                  </span>
                )}
                {lab.defaultCreds.user && lab.defaultCreds.password && (
                  <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                )}
                {lab.defaultCreds.password && (
                  <span style={{ color: 'var(--text-secondary)' }}>
                    pass: <span style={{ color: '#e2e8f0' }}>{lab.defaultCreds.password}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action feedback */}
          {actionMsg && (
            <div className="text-[12px] font-medium px-4 py-2.5 rounded-xl"
              style={{
                color:      actionMsg.startsWith('✓') ? '#10b981' : '#ef4444',
                background: actionMsg.startsWith('✓') ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border:     `1px solid ${actionMsg.startsWith('✓') ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
              {actionMsg}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-3.5 flex flex-wrap gap-2 items-center"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.15)' }}>
          {!isRunning ? (
            <button onClick={() => handleAction(() => startLab(lab.id))} className="btn btn-start">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Start
            </button>
          ) : (
            <button onClick={() => handleAction(() => stopLab(lab.id))} className="btn btn-stop">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
              Stop
            </button>
          )}

          <button onClick={() => handleAction(() => restartLab(lab.id))} className="btn btn-ghost">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            Restart
          </button>

          <button onClick={() => setShowLogs(true)} className="btn btn-ghost">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            Logs
          </button>

          {isRunning && lab.category === 'Web App' && (
            <a href={lab.url} target="_blank" rel="noopener noreferrer"
               onClick={(e) => { e.preventDefault(); window.open(lab.url, '_blank'); }}
               className="btn btn-violet ml-auto">
              Open ↗
            </a>
          )}
        </div>
      </div>

      {showLogs && <LogViewer lab={lab} onClose={() => setShowLogs(false)} />}
    </>
  );
}
