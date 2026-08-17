import type { Status } from './types';

export const STATUS_META: Record<Status, { label: string; dot: string; text: string; bg: string }> = {
  idea: { label: 'Idea', dot: 'bg-sky-400', text: 'text-sky-300', bg: 'bg-sky-400/10' },
  planning: { label: 'Planificando', dot: 'bg-indigo-400', text: 'text-indigo-300', bg: 'bg-indigo-400/10' },
  in_progress: { label: 'En marcha', dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-400/10' },
  paused: { label: 'En pausa', dot: 'bg-amber-400', text: 'text-amber-300', bg: 'bg-amber-400/10' },
  done: { label: 'Completado', dot: 'bg-violet-400', text: 'text-violet-300', bg: 'bg-violet-400/10' },
  archived: { label: 'Archivado', dot: 'bg-neutral-500', text: 'text-neutral-400', bg: 'bg-neutral-500/10' },
};

export function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function isOverdue(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}
