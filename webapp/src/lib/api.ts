// API client for the Lab API Server (runs on Docker host, exposed via ngrok)
// All calls include the Bearer token stored in env vars.

const API_BASE = process.env.NEXT_PUBLIC_LAB_API_URL || 'http://localhost:4000';
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET || 'changeme';

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_SECRET}`,
  };
}

export interface LabApiResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function fetchLabs() {
  const res = await fetch(`${API_BASE}/api/labs`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch labs: ${res.status}`);
  return res.json();
}

export async function fetchLab(id: string) {
  const res = await fetch(`${API_BASE}/api/labs/${id}`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch lab ${id}: ${res.status}`);
  return res.json();
}

export async function startLab(id: string): Promise<LabApiResponse> {
  const res = await fetch(`${API_BASE}/api/labs/${id}/start`, {
    method: 'POST',
    headers: headers(),
  });
  return res.json();
}

export async function stopLab(id: string): Promise<LabApiResponse> {
  const res = await fetch(`${API_BASE}/api/labs/${id}/stop`, {
    method: 'POST',
    headers: headers(),
  });
  return res.json();
}

export async function restartLab(id: string): Promise<LabApiResponse> {
  const res = await fetch(`${API_BASE}/api/labs/${id}/restart`, {
    method: 'POST',
    headers: headers(),
  });
  return res.json();
}

export async function startAllLabs(): Promise<LabApiResponse> {
  const res = await fetch(`${API_BASE}/api/labs/all/start`, {
    method: 'POST',
    headers: headers(),
  });
  return res.json();
}

export async function stopAllLabs(): Promise<LabApiResponse> {
  const res = await fetch(`${API_BASE}/api/labs/all/stop`, {
    method: 'POST',
    headers: headers(),
  });
  return res.json();
}

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

/** Logs are streamed via SSE — returns the URL to connect to */
export function getLogsUrl(id: string, lines = 100): string {
  return `${API_BASE}/api/labs/${id}/logs?lines=${lines}`;
}
