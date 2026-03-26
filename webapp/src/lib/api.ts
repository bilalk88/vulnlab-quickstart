// API client for the Lab API Server
// Running locally — no authentication required.

const API_BASE = process.env.NEXT_PUBLIC_LAB_API_URL || '';

export interface LabApiResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
  return res;
}

export async function fetchLabs() {
  const res = await apiFetch('/api/labs');
  if (!res.ok) throw new Error(`Failed to fetch labs: ${res.status}`);
  return res.json();
}

export async function fetchLab(id: string) {
  const res = await apiFetch(`/api/labs/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch lab ${id}: ${res.status}`);
  return res.json();
}

export async function startLab(id: string): Promise<LabApiResponse> {
  const res = await apiFetch(`/api/labs/${id}/start`, { method: 'POST' });
  return res.json();
}

export async function stopLab(id: string): Promise<LabApiResponse> {
  const res = await apiFetch(`/api/labs/${id}/stop`, { method: 'POST' });
  return res.json();
}

export async function restartLab(id: string): Promise<LabApiResponse> {
  const res = await apiFetch(`/api/labs/${id}/restart`, { method: 'POST' });
  return res.json();
}

export async function startAllLabs(): Promise<LabApiResponse> {
  const res = await apiFetch('/api/labs/all/start', { method: 'POST' });
  return res.json();
}

export async function stopAllLabs(): Promise<LabApiResponse> {
  const res = await apiFetch('/api/labs/all/stop', { method: 'POST' });
  return res.json();
}

export async function fetchHealth() {
  try {
    const res = await apiFetch('/api/health');
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

/** Logs are streamed via SSE — returns the URL to open as EventSource */
export function getLogsUrl(id: string, lines = 100): string {
  return `${API_BASE}/api/labs/${id}/logs?lines=${lines}`;
}
