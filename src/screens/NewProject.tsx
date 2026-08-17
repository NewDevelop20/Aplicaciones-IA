import { useState } from 'react';
import { useStore } from '../store';
import type { Route } from '../router';
import { STATUS_META } from '../statusMeta';
import type { Priority, Status } from '../types';

export function NewProject({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const { addProject } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>('idea');
  const [priority, setPriority] = useState<Priority>('medium');
  const [nextStep, setNextStep] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');

  const canSave = title.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    const project = addProject({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      startDate: startDate || null,
      dueDate: dueDate || null,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      nextStep: nextStep.trim(),
    });
    onNavigate({ name: 'project', id: project.id });
  }

  return (
    <div className="mx-auto max-w-md pb-28">
      <header className="safe-top sticky top-0 z-10 flex items-center justify-between bg-neutral-950/95 px-4 pb-3 pt-4 backdrop-blur">
        <button onClick={() => onNavigate({ name: 'dashboard' })} className="text-sm text-neutral-400">
          Cancelar
        </button>
        <h1 className="text-base font-semibold text-neutral-50">Nueva idea</h1>
        <button onClick={handleSave} disabled={!canSave} className="text-sm font-semibold text-white disabled:text-neutral-600">
          Guardar
        </button>
      </header>

      <main className="space-y-4 px-4 pt-2">
        <Field label="Título">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="¿Cómo se llama la idea?"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
          />
        </Field>

        <Field label="Descripción">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="¿En qué consiste?"
            className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
          />
        </Field>

        <Field label="Estado">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STATUS_META) as Status[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  status === s ? 'border-white bg-white text-neutral-900' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                {STATUS_META[s].label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Prioridad">
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium ${
                  priority === p ? 'border-white bg-white text-neutral-900' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : 'Alta'}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Siguiente paso">
          <input
            value={nextStep}
            onChange={(e) => setNextStep(e.target.value)}
            placeholder="¿Cuál es la próxima acción?"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha de inicio">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-neutral-100 focus:border-neutral-600 focus:outline-none"
            />
          </Field>
          <Field label="Fecha límite">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-neutral-100 focus:border-neutral-600 focus:outline-none"
            />
          </Field>
        </div>

        <Field label="Etiquetas (separadas por comas)">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="app, negocio, urgente…"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
          />
        </Field>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-500">{label}</span>
      {children}
    </label>
  );
}
