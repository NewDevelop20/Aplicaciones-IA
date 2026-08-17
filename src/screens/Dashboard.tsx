import { useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Route } from '../router';
import { ProjectCard } from '../components/ProjectCard';
import { STATUS_META } from '../statusMeta';
import type { Status } from '../types';

export function Dashboard({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const { data } = useStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');

  const filtered = useMemo(() => {
    return data.projects
      .filter((p) => (statusFilter === 'all' ? true : p.status === statusFilter))
      .filter((p) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [data.projects, query, statusFilter]);

  return (
    <div className="mx-auto max-w-md pb-28">
      <header className="safe-top sticky top-0 z-10 bg-neutral-950/95 px-4 pb-3 pt-4 backdrop-blur">
        <h1 className="text-2xl font-bold text-neutral-50">Ideario</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ideas y proyectos…"
          className="mt-3 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
        />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <FilterChip label="Todos" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
          {(Object.keys(STATUS_META) as Status[]).map((s) => (
            <FilterChip key={s} label={STATUS_META[s].label} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
          ))}
        </div>
      </header>

      <main className="space-y-3 px-4 pt-2">
        {filtered.length === 0 && (
          <div className="mt-16 text-center text-neutral-500">
            <p className="text-4xl">💡</p>
            <p className="mt-3 text-sm">
              {data.projects.length === 0 ? 'Aún no tienes ninguna idea guardada.' : 'Nada coincide con esa búsqueda.'}
            </p>
          </div>
        )}
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} onClick={() => onNavigate({ name: 'project', id: p.id })} />
        ))}
      </main>

      <button
        onClick={() => onNavigate({ name: 'new' })}
        className="fixed bottom-24 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl font-light text-neutral-900 shadow-lg shadow-black/40 active:scale-95"
        aria-label="Nueva idea"
      >
        +
      </button>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
        active ? 'border-white bg-white text-neutral-900' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
      }`}
    >
      {label}
    </button>
  );
}
