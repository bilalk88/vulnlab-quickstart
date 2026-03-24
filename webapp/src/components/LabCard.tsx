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

export default function LabCard({ lab, onRefresh }: LabCardProps) {
  const [showLogs, setShowLogs] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const status = lab.status ?? 'unknown';
  const isRunning = status === 'running';

  // Determine card accent class
  let cardClass = 'card-web';
  if (lab.category === 'Database') cardClass = 'card-db';
  if (lab.id === 'dvwa' || lab.id === 'bwapp') cardClass = 'card-danger';

  async function handleAction(fn: () => Promise<{success?: boolean; error?: string; message?: string}>) {
    setActionMsg(null);
    startTransition(async () => {
      try {
        const r = await fn();
        setActionMsg(r.error ? `ERR: ${r.error}` : `OK: ${r.message}`);
        setTimeout(() => { setActionMsg(null); onRefresh(); }, 2000);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Error';
        setActionMsg(`ERR: ${msg}`);
      }
    });
  }

  return (
    <>
      <div className={`lab-card ${cardClass} ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* Top/Header Area */}
        <div className="p-5 pb-0 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight leading-tight">{lab.name}</h2>
              <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>
                :{lab.port}
              </span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest mt-1" style={{ color: 'var(--text-secondary)' }}>
              {lab.category}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Body Area */}
        <div className="p-5 flex-1 flex flex-col gap-4">
          <p className="text-xs leading-5" style={{ color: 'var(--text-secondary)' }}>
            {lab.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {lab.tags.map(tag => (
              <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Credentials Box */}
          {(lab.defaultCreds.user || lab.defaultCreds.password) && (
            <div className="flex items-center gap-3 rounded bg-black/40 px-3 py-2 border border-gray-800/60 mt-2">
              <span className="text-gray-500 font-mono text-xs">🔑</span>
              <div className="text-[10px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>
                {lab.defaultCreds.user && <>USR: <span className="text-gray-300 mr-2">{lab.defaultCreds.user}</span></>}
                {lab.defaultCreds.password && <>PWD: <span className="text-gray-300">{lab.defaultCreds.password}</span></>}
              </div>
            </div>
          )}

          {actionMsg && (
            <div className="text-[10px] font-mono px-3 py-1.5 rounded bg-black border border-gray-800"
              style={{ color: actionMsg.startsWith('ERR') ? '#ff6b7a' : '#00ff88' }}>
              &gt; {actionMsg}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 pt-3 border-t flex flex-wrap gap-2 items-center" style={{ borderColor: 'var(--border-dim)', background: 'rgba(0,0,0,0.2)' }}>
          {!isRunning ? (
            <button onClick={() => handleAction(() => startLab(lab.id))} className="btn btn-start">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              START
            </button>
          ) : (
            <button onClick={() => handleAction(() => stopLab(lab.id))} className="btn btn-stop">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
              STOP
            </button>
          )}

          <button onClick={() => handleAction(() => restartLab(lab.id))} className="btn btn-ghost">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            RESTART
          </button>

          <button onClick={() => setShowLogs(true)} className="btn btn-ghost">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            LOGS
          </button>

          {isRunning && lab.category === 'Web App' && (
            <a href={`${process.env.NEXT_PUBLIC_LAB_API_URL?.replace(':4100', '')?.replace(':4000', '') ?? ''}${lab.url.replace('localhost', '').replace('http://', '')}`}
               target="_blank" rel="noopener noreferrer"
               onClick={(e) => { e.preventDefault(); window.open(lab.url, '_blank'); }}
               className="btn btn-ghost ml-auto">
              OPEN ↗
            </a>
          )}
        </div>
      </div>

      {showLogs && <LogViewer lab={lab} onClose={() => setShowLogs(false)} />}
    </>
  );
}
