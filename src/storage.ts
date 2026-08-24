import type { AppData } from './types';

const STORAGE_KEY = 'ideario:data:v1';

function emptyData(): AppData {
  return { version: 1, projects: [], people: [], voiceNotes: [] };
}

export function normalize(parsed: unknown): AppData | null {
  if (!parsed || typeof parsed !== 'object') return null;
  const p = parsed as Record<string, unknown>;
  if (!Array.isArray(p.projects) || !Array.isArray(p.people)) return null;
  return {
    version: 1,
    projects: p.projects as AppData['projects'],
    people: p.people as AppData['people'],
    voiceNotes: Array.isArray(p.voiceNotes) ? (p.voiceNotes as AppData['voiceNotes']) : [],
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    return normalize(JSON.parse(raw)) ?? emptyData();
  } catch {
    return emptyData();
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportDataFile(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `ideario-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseImportedFile(text: string): AppData | null {
  try {
    return normalize(JSON.parse(text));
  } catch {
    return null;
  }
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
