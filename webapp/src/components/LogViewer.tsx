'use client';

import { useEffect, useRef, useState } from 'react';
import type { Lab } from '@/lib/labs';
import { getLogsUrl } from '@/lib/api';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface LogViewerProps {
  lab: Lab;
  onClose: () => void;
}

export default function LogViewer({ lab, onClose }: LogViewerProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const esRef     = useRef<EventSource | null>(null);

  function connect() {
    setLines([]);
    setError(null);
    setConnected(false);

    const url = getLogsUrl(lab.id, 200);
    const es  = new EventSource(url);
    esRef.current = es;

    es.onopen = () => setConnected(true);

    es.onmessage = (ev) => {
      try {
        const { line } = JSON.parse(ev.data);
        if (line) setLines(prev => [...prev.slice(-500), line]); // keep last 500
      } catch { /* skip */ }
    };

    es.addEventListener('close', () => {
      setConnected(false);
      es.close();
    });

    es.onerror = () => {
      setConnected(false);
      setError('Connection to API server lost. Is the lab-api running?');
      es.close();
    };
  }

  useEffect(() => {
    connect();
    return () => esRef.current?.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lab.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  function colorize(line: string) {
    if (/error|fatal|exception/i.test(line)) return 'err';
    if (/warn/i.test(line)) return 'warn';
    if (/started|ready|listening|up/i.test(line)) return 'ok';
    return '';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-3xl rounded-xl border border-gray-800 bg-gray-950 shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-white">{lab.name}</span>
            <span className="text-xs text-gray-600">live logs</span>
            {connected && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                streaming
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={connect}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition">
              <ArrowPathIcon className="h-4 w-4" />
            </button>
            <button onClick={onClose}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition">
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Log body */}
        <div className="terminal flex-1 overflow-y-auto text-[11px]">
          {error && <p className="text-red-400 mb-2">{error}</p>}
          {lines.length === 0 && !error && (
            <p className="text-gray-600 italic">Waiting for log output…</p>
          )}
          {lines.map((line, i) => {
            const cls = colorize(line);
            return (
              <div key={i}>
                {cls ? <span className={cls}>{line}</span> : line}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 px-4 py-2 text-xs text-gray-600 font-mono shrink-0 flex justify-between">
          <span>{lines.length} lines</span>
          <span>last 500 displayed</span>
        </div>
      </div>
    </div>
  );
}
