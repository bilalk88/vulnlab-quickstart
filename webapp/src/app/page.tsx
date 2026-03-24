'use client';

import { useState, useCallback, useEffect, useTransition } from 'react';
import { LABS, type Lab } from '@/lib/labs';
import LabCard from '@/components/LabCard';
import { fetchLabs, startAllLabs, stopAllLabs, fetchHealth } from '@/lib/api';

type LabWithStatus = Lab & { status: string };

export default function DashboardPage() {
  const [labs, setLabs]           = useState<LabWithStatus[]>([]);
  const [health, setHealth]       = useState<boolean | null>(null);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<'all' | 'Web App' | 'Database'>('all');
  const [bulkMsg, setBulkMsg]     = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

  async function handleBulk(fn: () => Promise<{message?: string; error?: string}>) {
    setBulkMsg(null);
    startTransition(async () => {
      try {
        const r = await fn();
        setBulkMsg(r.error ? `ERR: ${r.error}` : `OK: ${r.message}`);
        setTimeout(() => { setBulkMsg(null); refresh(); }, 2500);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Error';
        setBulkMsg(`ERR: ${msg}`);
      }
    });
  }

  const filtered = labs.filter(l => filter === 'all' || l.category === filter);
  const runningCount = labs.filter(l => l.status === 'running').length;

  return (
    <div className="space-y-10">
      
      {/* ── API Health Warning ── */}
      {health === false && (
        <div className="flex items-start gap-3 rounded-lg border border-red-900/50 bg-red-950/30 p-4 scanlines relative overflow-hidden">
          <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 animate-pulse shrink-0 shadow-[0_0_8px_#ff4566]" />
          <div>
            <h3 className="text-red-400 font-mono text-sm font-bold">API CONNECTION FAILED</h3>
            <p className="text-red-400/80 text-xs mt-1 font-mono leading-relaxed">
              Lab API Server is unreachable. Check that <span className="bg-black/50 px-1 rounded text-red-300">node server.js</span> is running on the Docker host,<br/>
              and <span className="bg-black/50 px-1 rounded text-red-300">NEXT_PUBLIC_LAB_API_URL</span> in webapp/.env.local points to it.
            </p>
          </div>
        </div>
      )}

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL TARGETS',  val: labs.length,          color: 'var(--accent)' },
          { label: 'ACTIVE / UP',    val: runningCount,         color: '#00ff88' },
          { label: 'DOWN / EXITED',  val: labs.filter(l => ['stopped','exited'].includes(l.status)).length, color: '#ff6b7a' },
          { label: 'SYSTEM HEALTH',  val: health ? 'ONLINE' : 'OFFLINE', color: health ? '#00ff88' : '#3d4f73' },
        ].map(s => (
          <div key={s.label} className="stat-card flex flex-col justify-between" style={{ '--stat-color': s.color } as React.CSSProperties}>
            <div className="text-[10px] font-mono font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            <div className="text-3xl font-light tracking-tight mt-2" style={{ color: s.color, fontVariantNumeric: 'tabular-nums' }}>
              {s.val}
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-dim)' }}>
        <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-gray-800/60">
          {(['all', 'Web App', 'Database'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-md text-xs font-mono tracking-wide transition-colors"
              style={filter === f ? { background: 'var(--border-bright)', color: 'white' } : { color: 'var(--text-secondary)' }}>
              {f === 'all' ? 'ALL LABS' : f.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {bulkMsg && <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded">{bulkMsg}</span>}
          <button onClick={() => handleBulk(startAllLabs)} disabled={isPending} className="btn btn-start">
            SYS.START_ALL
          </button>
          <button onClick={() => handleBulk(stopAllLabs)} disabled={isPending} className="btn btn-stop">
            SYS.HALT_ALL
          </button>
        </div>
      </div>

      {/* ── Lab Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-[280px]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(lab => (
            <LabCard key={lab.id} lab={lab} onRefresh={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}
