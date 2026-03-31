'use client';

import { useState, useCallback, useEffect, useTransition } from 'react';
import { LABS, type Lab } from '@/lib/labs';
import LabCard from '@/components/LabCard';
import { fetchLabs, startAllLabs, stopAllLabs } from '@/lib/api';

type LabWithStatus = Lab & { status: string };

export default function DashboardPage() {
  const [labs, setLabs] = useState<LabWithStatus[]>([]);
  const [health, setHealth] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Web App' | 'Database' | 'API Labs' | 'AI/LLM'>('all');
  const [bulkMsg, setBulkMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchLabs();
      const merged = LABS.map(local => {
        const remote = data.find((r: LabWithStatus) => r.id === local.id);
        return { ...local, status: remote?.status ?? 'unknown' };
      });
      setLabs(merged);
      setHealth(true);
    } catch {
      setLabs(LABS.map(l => ({ ...l, status: 'unknown' })));
      setHealth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleBulk(fn: () => Promise<{ message?: string; error?: string }>) {
    if (isPending) return;
    setBulkMsg(null);
    setIsPending(true);
    try {
      const r = await fn();
      setBulkMsg(r.error ? `✗ ${r.error}` : `✓ ${r.message}`);
      setTimeout(() => { setBulkMsg(null); refresh(); }, 3000);
    } catch (e: unknown) {
      setBulkMsg(`✗ ${e instanceof Error ? e.message : 'Error'}`);
    } finally {
      setIsPending(false);
    }
  }

  const filtered = labs.filter(l => filter === 'all' || l.category === filter);
  const runningCount = labs.filter(l => l.status === 'running').length;
  const stoppedCount = labs.filter(l => ['stopped', 'exited'].includes(l.status)).length;

  const stats = [
    {
      label: 'Total Targets', val: labs.length, color: '#8b78ff', glow: 'rgba(139,120,255,0.18)', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    },
    {
      label: 'Running', val: runningCount, color: '#22c55e', glow: 'rgba(34,197,94,0.18)', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" /><path d="m10 8 6 4-6 4V8z" fill="currentColor" />
        </svg>
      )
    },
    {
      label: 'Stopped', val: stoppedCount, color: '#f87171', glow: 'rgba(248,113,113,0.14)', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" /><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
        </svg>
      )
    },
    {
      label: 'System Health', val: health === null ? '…' : health ? 'Online' : 'Offline',
      color: health ? '#22c55e' : '#f87171', glow: health ? 'rgba(34,197,94,0.14)' : 'rgba(248,113,113,0.08)', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
  ];

  return (
    <div className="space-y-10">

      {/* ── API Warning ── */}
      {health === false && (
        <div className="flex gap-4 items-start rounded-2xl p-5"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}>
          <div className="shrink-0 mt-0.5 p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#fca5a5' }}>API Server Unreachable</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(252,165,165,0.6)' }}>
              Make sure <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(0,0,0,0.3)', color: '#fca5a5' }}>node server.js</code> is running and <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(0,0,0,0.3)', color: '#fca5a5' }}>NEXT_PUBLIC_LAB_API_URL</code> is set in <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(0,0,0,0.3)', color: '#fca5a5' }}>.env.local</code>.
            </p>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 max-w-[40px]" style={{ background: 'linear-gradient(90deg,#7c6ff7,transparent)' }} />
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase" style={{ color: '#7c6ff7' }}>Security Test Labs</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-none" style={{ color: '#f1f5f9' }}>
            Lab <span className="text-gradient-violet">Dashboard</span>
          </h1>
          <p className="text-sm mt-3 max-w-md leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Orchestrate your vulnerable targets. Launch, halt, and monitor security labs from one control panel.
          </p>
        </div>

        {/* Live status pill */}
        <div className="flex items-center gap-2 shrink-0 rounded-full px-4 py-2"
          style={{ background: health ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)', border: `1px solid ${health ? 'rgba(34,197,94,0.3)' : 'rgba(100,116,139,0.2)'}` }}>
          <span className={`status-dot ${health ? 'dot-running' : ''}`} style={!health ? { background: '#64748b' } : {}} />
          <span className="text-xs font-semibold" style={{ color: health ? '#22c55e' : '#64748b', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
            {health === null ? 'CONNECTING' : health ? 'API ONLINE' : 'API OFFLINE'}
          </span>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ '--stat-glow': s.glow } as React.CSSProperties}>
            <div className="stat-glow" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-medium tracking-wide uppercase" style={{ color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>{s.label}</span>
              <span style={{ color: s.color, opacity: 0.7 }}>{s.icon}</span>
            </div>
            <div className="text-3xl font-black" style={{ color: s.color, letterSpacing: '-0.02em' }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* Filter + Action Tabs */}
        <div className="tab-bar">
          {['all', 'Web App', 'Database', 'API Labs', 'AI/LLM'].map(f => (
            <button key={f} onClick={() => setFilter(f as any)}
                    className={`tab-btn ${filter === f ? 'active' : ''}`}>
              {f === 'all' ? 'All Labs' : f}
            </button>
          ))}
          <div className="tab-divider" />

          {(() => {
            const isAnyRunning = runningCount > 0;
            const action = isAnyRunning ? stopAllLabs : startAllLabs;
            const color = isAnyRunning ? '#f87171' : '#22c55e';
            const bg = isAnyRunning ? 'rgba(248,113,113,0.08)' : 'rgba(34,197,94,0.08)';
            const border = isAnyRunning ? 'rgba(248,113,113,0.2)' : 'rgba(34,197,94,0.2)';

            return (
              <button onClick={() => handleBulk(action)} disabled={isPending}
                className="tab-btn flex items-center gap-2"
                style={{ color: isPending ? 'var(--text-muted)' : color, background: bg, border: `1px solid ${border}` }}>
                {isAnyRunning ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
                {isPending ? (isAnyRunning ? 'Stopping…' : 'Starting…') : (isAnyRunning ? 'Stop All' : 'Start All')}
              </button>
            );
          })()}
        </div>

        {/* Right: Feedback */}
        <div className="flex items-center gap-3">
          {bulkMsg && (
            <span className="text-xs font-medium px-3 py-1.5 rounded-full"
              style={{
                color: bulkMsg.startsWith('✓') ? '#22c55e' : '#f87171',
                background: bulkMsg.startsWith('✓') ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)',
                border: `1px solid ${bulkMsg.startsWith('✓') ? 'rgba(34,197,94,0.2)' : 'rgba(248,113,113,0.2)'}`
              }}>
              {bulkMsg}
            </span>
          )}
        </div>
      </div>

      {/* ── Lab Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-[300px]" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4" style={{ opacity: 0.15 }}>⊘</div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No labs match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map(lab => <LabCard key={lab.id} lab={lab} onRefresh={refresh} />)}
        </div>
      )}
    </div>
  );
}
