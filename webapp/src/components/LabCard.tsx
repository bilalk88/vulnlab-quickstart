'use client';

import { useState, useTransition } from 'react';
import type { Lab } from '@/lib/labs';
import StatusBadge from './StatusBadge';
import LogViewer from './LogViewer';
import { startLab, stopLab, restartLab } from '@/lib/api';
import {
  PlayIcon, StopIcon, ArrowPathIcon,
  CommandLineIcon, ArrowTopRightOnSquareIcon, KeyIcon,
} from '@heroicons/react/24/outline';

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

  async function handleAction(fn: () => Promise<{success?: boolean; error?: string; message?: string}>) {
    setActionMsg(null);
    startTransition(async () => {
      try {
        const r = await fn();
        setActionMsg(r.error ? `❌ ${r.error}` : `✅ ${r.message ?? 'Done'}`);
        setTimeout(() => {
          setActionMsg(null);
          onRefresh();
        }, 2000);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        setActionMsg(`❌ ${msg}`);
      }
    });
  }

  const categoryColor = lab.category === 'Web App' ? 'emerald' : 'sky';

  return (
    <>
      <div className={`glass-card flex flex-col h-full relative overflow-hidden
        ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
        {/* Top accent line */}
        <div className={`h-px w-full bg-gradient-to-r from-transparent via-${categoryColor}-500/40 to-transparent`} />

        <div className="p-5 flex flex-col h-full gap-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-white">{lab.name}</h2>
                <span className={`text-xs font-mono text-${categoryColor}-400 opacity-70`}>
                  :{lab.port}
                </span>
              </div>
              <p className={`text-xs mt-0.5 text-${categoryColor}-500/70 font-medium`}>{lab.category}</p>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed flex-1">{lab.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {lab.tags.map(tag => (
              <span key={tag}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full bg-${categoryColor}-900/20 text-${categoryColor}-400/80 ring-1 ring-${categoryColor}-500/10`}>
                {tag}
              </span>
            ))}
          </div>

          {/* Creds */}
          {(lab.defaultCreds.user || lab.defaultCreds.password) && (
            <div className="flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-xs font-mono text-gray-400">
              <KeyIcon className="h-3.5 w-3.5 text-gray-600 shrink-0" />
              <span>
                {lab.defaultCreds.user && <>user: <span className="text-gray-200">{lab.defaultCreds.user}</span></>}
                {lab.defaultCreds.user && lab.defaultCreds.password && ' · '}
                {lab.defaultCreds.password && <>pass: <span className="text-gray-200">{lab.defaultCreds.password}</span></>}
              </span>
            </div>
          )}

          {/* Action message */}
          {actionMsg && (
            <p className="text-xs font-mono text-center text-gray-300 bg-gray-900 rounded-md px-3 py-2">
              {actionMsg}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {!isRunning ? (
              <button
                onClick={() => handleAction(() => startLab(lab.id))}
                className="flex items-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition"
              >
                <PlayIcon className="h-3.5 w-3.5" /> Start
              </button>
            ) : (
              <button
                onClick={() => handleAction(() => stopLab(lab.id))}
                className="flex items-center gap-1.5 rounded-md bg-red-700 hover:bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition"
              >
                <StopIcon className="h-3.5 w-3.5" /> Stop
              </button>
            )}

            <button
              onClick={() => handleAction(() => restartLab(lab.id))}
              className="flex items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition"
            >
              <ArrowPathIcon className={`h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`} /> Restart
            </button>

            <button
              onClick={() => setShowLogs(true)}
              className="flex items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition"
            >
              <CommandLineIcon className="h-3.5 w-3.5" /> Logs
            </button>

            {isRunning && lab.category === 'Web App' && (
              <a
                href={`${process.env.NEXT_PUBLIC_LAB_API_URL?.replace(':4000', '') ?? ''}${lab.url.replace('localhost', '').replace('http://', '')}`}
                target="_blank" rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  // Just open the direct URL on the host
                  window.open(lab.url, '_blank');
                }}
                className="ml-auto flex items-center gap-1.5 rounded-md bg-gray-800 hover:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition"
              >
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" /> Open
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Log viewer modal */}
      {showLogs && <LogViewer lab={lab} onClose={() => setShowLogs(false)} />}
    </>
  );
}
