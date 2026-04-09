'use client';

import { useEffect, useRef, useState } from 'react';
import type { Lab } from '@/lib/labs';
import { getLogsUrl } from '@/lib/api';

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
        if (line) setLines(prev => [...prev.slice(-300), line]); // keep last 300
      } catch { /* skip */ }
    };

    es.addEventListener('close', () => {
      setConnected(false);
      es.close();
    });

    es.onerror = () => {
      setConnected(false);
      setError('CONNECTION LOST // lab-api offline?');
      es.close();
    };
  }

  useEffect(() => {
    connect();
    return () => esRef.current?.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lab.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [lines]);

  function colorize(line: string) {
    if (/error|fatal|exception|fail/i.test(line)) return 'line-err';
    if (/warn/i.test(line)) return 'line-warn';
    if (/started|ready|listening|up|success/i.test(line)) return 'line-ok';
    if (/info/i.test(line)) return 'line-info';
    return '';
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      
      <div className="w-full max-w-4xl h-[85vh] flex flex-col rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border scanlines"
           style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-bright)' }}>
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-black/50 border-b border-[#1a2340]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold tracking-widest text-[#00e5ff]">
              {lab.name.toUpperCase()}
            </span>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              {'// STD_OUT'}
            </span>
            {connected && (
              <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#00ff88] px-2 py-0.5 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 ml-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_6px_#00ff88]" />
                STREAMING
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
             <button onClick={connect} title="Reconnect stream"
              className="text-[#7b8db0] hover:text-[#00e5ff] transition-colors p-1" >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            </button>
            <button onClick={onClose} title="Close terminal"
              className="text-[#7b8db0] hover:text-[#ff4566] transition-colors p-1 ml-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="terminal-pane relative z-10">
          {error && <p className="line-err mb-4 font-bold">{error}</p>}
          
          {lines.length === 0 && !error && (
             <p className="text-[#3d4f73] italic">Awaiting connection protocol...</p>
          )}

          {lines.map((line, i) => {
            const cls = colorize(line);
            return (
              <div key={i} className="hover:bg-white/[0.02] -mx-4 px-4 whitespace-pre-wrap break-all">
                <span className="opacity-20 mr-4 select-none inline-block w-8 text-right">{i+1}</span>
                <span className={cls}>{line}</span>
              </div>
            );
          })}
          <div ref={bottomRef} className="h-4" />
        </div>

        {/* Terminal Footer */}
        <div className="bg-black/80 px-4 py-2 flex justify-between items-center border-t border-[#1a2340] shrink-0 z-10">
           <span className="text-[9px] font-mono tracking-widest text-[#3d4f73]">
             {lines.length} FRAMES RECEIVED
           </span>
           <span className="text-[9px] font-mono tracking-widest text-[#3d4f73]">
             BUFFER: 300 LINES
           </span>
        </div>
      </div>
    </div>
  );
}
