'use client';

import type { LabStatus } from '@/lib/labs';

const STATUS: Record<string, {
  label: string; dot: string; dotClass: string; bg: string; text: string; border: string;
}> = {
  running: {
    label: 'RUNNING',
    dot: '#00ff88', dotClass: 'dot-running',
    bg: 'rgba(0,255,136,0.07)', text: '#00ff88', border: 'rgba(0,255,136,0.3)',
  },
  stopped: {
    label: 'STOPPED',
    dot: '#3d4f73', dotClass: '',
    bg: 'rgba(30,47,85,0.4)', text: '#7b8db0', border: 'rgba(30,47,85,0.6)',
  },
  exited: {
    label: 'EXITED',
    dot: '#ff4566', dotClass: 'dot-exited',
    bg: 'rgba(255,69,102,0.07)', text: '#ff6b7a', border: 'rgba(255,69,102,0.3)',
  },
  restarting: {
    label: 'RESTARTING',
    dot: '#ffcc00', dotClass: 'dot-restarting',
    bg: 'rgba(255,204,0,0.07)', text: '#ffcc00', border: 'rgba(255,204,0,0.3)',
  },
  unknown: {
    label: 'UNKNOWN',
    dot: '#1e2f55', dotClass: '',
    bg: 'rgba(30,47,85,0.3)', text: '#3d4f73', border: 'rgba(30,47,85,0.5)',
  },
};

export default function StatusBadge({ status }: { status: LabStatus | string }) {
  const s = STATUS[status] ?? STATUS.unknown;
  return (
    <span className="badge" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${s.dotClass}`}
        style={{ background: s.dot, boxShadow: s.dotClass ? `0 0 4px ${s.dot}` : 'none' }} />
      {s.label}
    </span>
  );
}
