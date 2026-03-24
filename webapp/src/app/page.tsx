'use client';

import { useState, useCallback, useEffect, useTransition } from 'react';
import { LABS, type Lab } from '@/lib/labs';
import LabCard from '@/components/LabCard';
import {
  fetchLabs, startAllLabs, stopAllLabs, fetchHealth,
} from '@/lib/api';
import {
  PlayIcon, StopIcon, ArrowPathIcon, ServerStackIcon, SignalIcon, SignalSlashIcon,
} from '@heroicons/react/24/outline';

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
      // Merge with local metadata for anything missing from API
      const merged = LABS.map(local => {
        const remote = data.find((r: LabWithStatus) => r.id === local.id);
        return { ...local, status: remote?.status ?? 'unknown' };
      });
      setLabs(merged);
      setHealth(true);
    } catch {
      // API not reachable – show labs from static list with unknown status
      setLabs(LABS.map(l => ({ ...l, status: 'unknown' })));
      setHealth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Poll every 10s
    const id = setInterval(refresh, 10_000);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleBulk(fn: () => Promise<{message?: string; error?: string}>) {
    setBulkMsg(null);
    startTransition(async () => {
      try {
        const r = await fn();
        setBulkMsg(r.error ? `❌ ${r.error}` : `✅ ${r.message}`);
        setTimeout(() => { setBulkMsg(null); refresh(); }, 2500);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Error';
        setBulkMsg(`❌ ${msg}`);
      }
    });
  }

  const filtered = labs.filter(l => filter === 'all' || l.category === filter);
  const runningCount = labs.filter(l => l.status === 'running').length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ServerStackIcon className="h-6 w-6 text-emerald-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">Pentest Lab Dashboard</h1>
            </div>
            <p className="text-gray-400 text-sm max-w-xl">
              Manage all vulnerable lab containers from one place. Start, stop, restart, and stream live logs directly in the browser.
            </p>
          </div>

          {/* API health */}
          <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border
            ${health === true  ? 'border-emerald-800/60 bg-emerald-900/10 text-emerald-400' :
              health === false ? 'border-red-800/60 bg-red-900/10 text-red-400' :
                                 'border-gray-800 bg-gray-900 text-gray-500'}`}>
            {health === true  ? <><SignalIcon className="h-4 w-4" /> API Connected</> :
             health === false ? <><SignalSlashIcon className="h-4 w-4" /> API Unreachable</> :
                               'Checking…'}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Labs', value: labs.length },
            { label: 'Running', value: runningCount, color: 'text-emerald-400' },
            { label: 'Stopped', value: labs.filter(l => ['stopped','exited'].includes(l.status)).length, color: 'text-gray-500' },
            { label: 'Unknown', value: labs.filter(l => l.status === 'unknown').length, color: 'text-gray-600' },
          ].map(s => (
            <div key={s.label} className="rounded-lg bg-gray-900/60 border border-gray-800 px-4 py-3">
              <div className={`text-2xl font-bold ${s.color ?? 'text-white'}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category filter */}
        {(['all', 'Web App', 'Database'] as const).map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition
              ${filter === f
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {f === 'all' ? 'All Labs' : f}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 flex-wrap">
          {bulkMsg && <span className="text-xs font-mono text-gray-300">{bulkMsg}</span>}
          <button onClick={() => handleBulk(startAllLabs)}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-md bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 px-3 py-1.5 text-xs font-medium text-white transition">
            <PlayIcon className="h-3.5 w-3.5" /> Start All
          </button>
          <button onClick={() => handleBulk(stopAllLabs)}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-md bg-red-800 hover:bg-red-700 disabled:opacity-50 px-3 py-1.5 text-xs font-medium text-white transition">
            <StopIcon className="h-3.5 w-3.5" /> Stop All
          </button>
          <button onClick={refresh}
            className="flex items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition">
            <ArrowPathIcon className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-5 space-y-4 h-64">
              <div className="skeleton h-5 w-32" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-8 w-full mt-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(lab => (
            <LabCard key={lab.id} lab={lab} onRefresh={refresh} />
          ))}
        </div>
      )}

      {/* API offline warning */}
      {health === false && (
        <div className="rounded-xl border border-amber-800/40 bg-amber-900/10 p-5 text-sm text-amber-300 space-y-1">
          <p className="font-semibold">⚠️ Lab API Server is not reachable</p>
          <p className="text-amber-400/70">
            Start the API server on your Docker host: <code className="font-mono bg-black/30 px-1 rounded">cd lab-api && node server.js</code><br />
            Then expose it via ngrok: <code className="font-mono bg-black/30 px-1 rounded">bash start-with-ngrok.sh</code><br />
            Set <code className="font-mono bg-black/30 px-1 rounded">NEXT_PUBLIC_LAB_API_URL</code> in Vercel to the printed ngrok URL.
          </p>
        </div>
      )}
    </div>
  );
}
