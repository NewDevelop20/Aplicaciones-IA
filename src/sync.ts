import type { AppData } from './types';
import { normalize } from './storage';

const TOKEN_KEY = 'ideario:sync-token:v1';
const LAST_SYNC_KEY = 'ideario:last-sync:v1';

const OWNER = 'NewDevelop20';
const REPO = 'Aplicaciones-IA';
const BRANCH = 'claude/personal-ideas-management-app-g5vwdr';
const WORKFLOW_FILE = 'sync-data.yml';
const RAW_DATA_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/data/ideario-data.json`;

export function getSyncToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSyncToken(token: string): void {
  if (token.trim()) localStorage.setItem(TOKEN_KEY, token.trim());
  else localStorage.removeItem(TOKEN_KEY);
}

export function getLastSyncedAt(): string | null {
  return localStorage.getItem(LAST_SYNC_KEY);
}

export interface SyncResult {
  ok: boolean;
  error?: string;
}

export async function syncNow(data: AppData): Promise<SyncResult> {
  const token = getSyncToken();
  if (!token) return { ok: false, error: 'No has guardado ningún token de sincronización.' };

  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref: BRANCH, inputs: { data: JSON.stringify(data) } }),
    });

    if (res.status === 204) {
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      return { ok: true };
    }

    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: 'El token no es válido o no tiene permiso "Actions: Read and write" en este repositorio.' };
    }
    if (res.status === 404) {
      return { ok: false, error: 'No se encontró el workflow. Revisa que el token tenga acceso al repositorio correcto.' };
    }
    const text = await res.text().catch(() => '');
    return { ok: false, error: `GitHub respondió ${res.status}. ${text.slice(0, 200)}` };
  } catch (err) {
    return { ok: false, error: `No se pudo conectar con GitHub (red o CORS bloqueado): ${(err as Error).message}` };
  }
}

export interface PullResult {
  ok: boolean;
  data?: AppData;
  error?: string;
}

export async function pullFromServer(): Promise<PullResult> {
  try {
    const res = await fetch(`${RAW_DATA_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) {
      return { ok: false, error: res.status === 404 ? 'Todavía no hay datos sincronizados en el servidor.' : `El servidor respondió ${res.status}.` };
    }
    const parsed = normalize(await res.json());
    if (!parsed) return { ok: false, error: 'El archivo del servidor no tiene un formato válido.' };
    return { ok: true, data: parsed };
  } catch (err) {
    return { ok: false, error: `No se pudo conectar con el servidor: ${(err as Error).message}` };
  }
}
