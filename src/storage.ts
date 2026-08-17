import type { AppData } from './types';

const STORAGE_KEY = 'ideario:data:v1';

function emptyData(): AppData {
  return { version: 1, projects: [], people: [] };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyData();
    return {
      version: 1,
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      people: Array.isArray(parsed.people) ? parsed.people : [],
    };
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
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!Array.isArray(parsed.projects) || !Array.isArray(parsed.people)) return null;
    return { version: 1, projects: parsed.projects, people: parsed.people };
  } catch {
    return null;
  }
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
