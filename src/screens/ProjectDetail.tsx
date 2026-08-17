import { useState } from 'react';
import { useStore } from '../store';
import type { Route } from '../router';
import { STATUS_META, formatDate } from '../statusMeta';
import type { Priority, Status } from '../types';

export function ProjectDetail({ id, onNavigate }: { id: string; onNavigate: (r: Route) => void }) {
  const { data, updateProject, deleteProject, addTask, toggleTask, deleteTask, addPerson } = useStore();
  const project = data.projects.find((p) => p.id === id);
  const [newTask, setNewTask] = useState('');
  const [editingNextStep, setEditingNextStep] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [showPeoplePicker, setShowPeoplePicker] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  if (!project) {
    return (
      <div className="mx-auto max-w-md px-4 pt-10 text-center text-neutral-400">
        <p>No se ha encontrado ese proyecto.</p>
        <button onClick={() => onNavigate({ name: 'dashboard' })} className="mt-3 text-sm text-white underline">
          Volver
        </button>
      </div>
    );
  }

  const linkedPeople = project.peopleIds.map((pid) => data.people.find((p) => p.id === pid)).filter(Boolean) as typeof data.people;
  const availablePeople = data.people.filter((p) => !project.peopleIds.includes(p.id));

  function handleDelete() {
    if (!project) return;
    if (confirm(`¿Eliminar "${project.title}"? Esta acción no se puede deshacer.`)) {
      deleteProject(project.id);
      onNavigate({ name: 'dashboard' });
    }
  }

  function handleAddTask() {
    if (!newTask.trim()) return;
    addTask(project!.id, newTask.trim());
    setNewTask('');
  }

  function togglePerson(personId: string) {
    if (!project) return;
    const has = project.peopleIds.includes(personId);
    updateProject(project.id, { peopleIds: has ? project.peopleIds.filter((x) => x !== personId) : [...project.peopleIds, personId] });
  }

  function handleAddNewPerson() {
    if (!newPersonName.trim() || !project) return;
    const person = addPerson({ name: newPersonName.trim(), role: '', contact: '', notes: '' });
    updateProject(project.id, { peopleIds: [...project.peopleIds, person.id] });
    setNewPersonName('');
  }

  const doneCount = project.tasks.filter((t) => t.done).length;

  return (
    <div className="mx-auto max-w-md pb-28">
      <header className="safe-top sticky top-0 z-10 flex items-center justify-between bg-neutral-950/95 px-4 pb-3 pt-4 backdrop-blur">
        <button onClick={() => onNavigate({ name: 'dashboard' })} className="text-sm text-neutral-400">
          ← Ideas
        </button>
        <button onClick={handleDelete} className="text-sm text-rose-400">
          Eliminar
        </button>
      </header>

      <main className="space-y-5 px-4 pt-2">
        <div>
          <input
            value={project.title}
            onChange={(e) => updateProject(project.id, { title: e.target.value })}
            className="w-full bg-transparent text-2xl font-bold text-neutral-50 focus:outline-none"
          />
          <p className="mt-1 text-xs text-neutral-500">Creado el {formatDate(project.createdAt)}</p>
        </div>

        <section>
          <h2 className="mb-1.5 text-xs font-medium text-neutral-500">Estado</h2>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STATUS_META) as Status[]).map((s) => (
              <button
                key={s}
                onClick={() => updateProject(project.id, { status: s })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  project.status === s ? 'border-white bg-white text-neutral-900' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                {STATUS_META[s].label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-1.5 text-xs font-medium text-neutral-500">Prioridad</h2>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => updateProject(project.id, { priority: p })}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium ${
                  project.priority === p ? 'border-white bg-white text-neutral-900' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : 'Alta'}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-800/40 bg-emerald-400/5 p-3.5">
          <h2 className="mb-1 text-xs font-medium text-emerald-300/80">Siguiente paso</h2>
          {editingNextStep ? (
            <input
              autoFocus
              value={project.nextStep}
              onChange={(e) => updateProject(project.id, { nextStep: e.target.value })}
              onBlur={() => setEditingNextStep(false)}
              placeholder="¿Cuál es la próxima acción?"
              className="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
            />
          ) : (
            <button onClick={() => setEditingNextStep(true)} className="w-full text-left text-sm text-neutral-100">
              {project.nextStep || <span className="text-neutral-500">Toca para añadir el siguiente paso…</span>}
            </button>
          )}
        </section>

        <section>
          <h2 className="mb-1.5 text-xs font-medium text-neutral-500">Descripción</h2>
          {editingDesc ? (
            <textarea
              autoFocus
              value={project.description}
              onChange={(e) => updateProject(project.id, { description: e.target.value })}
              onBlur={() => setEditingDesc(false)}
              rows={4}
              className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-100 focus:border-neutral-600 focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setEditingDesc(true)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-left text-sm text-neutral-300"
            >
              {project.description || <span className="text-neutral-500">Sin descripción. Toca para añadir.</span>}
            </button>
          )}
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Field label="Fecha de inicio">
            <input
              type="date"
              value={project.startDate ?? ''}
              onChange={(e) => updateProject(project.id, { startDate: e.target.value || null })}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 focus:border-neutral-600 focus:outline-none"
            />
          </Field>
          <Field label="Fecha límite">
            <input
              type="date"
              value={project.dueDate ?? ''}
              onChange={(e) => updateProject(project.id, { dueDate: e.target.value || null })}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 focus:border-neutral-600 focus:outline-none"
            />
          </Field>
        </section>

        <section>
          <div className="mb-1.5 flex items-center justify-between">
            <h2 className="text-xs font-medium text-neutral-500">
              Tareas {project.tasks.length > 0 && `(${doneCount}/${project.tasks.length})`}
            </h2>
          </div>
          <div className="space-y-1.5">
            {project.tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2.5">
                <button
                  onClick={() => toggleTask(project.id, t.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                    t.done ? 'border-emerald-400 bg-emerald-400 text-neutral-900' : 'border-neutral-600 text-transparent'
                  }`}
                >
                  ✓
                </button>
                <span className={`flex-1 text-sm ${t.done ? 'text-neutral-500 line-through' : 'text-neutral-100'}`}>{t.title}</span>
                <button onClick={() => deleteTask(project.id, t.id)} className="text-neutral-600">
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Añadir una tarea…"
              className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
            />
            <button onClick={handleAddTask} className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 text-sm font-medium text-neutral-100">
              Añadir
            </button>
          </div>
        </section>

        <section>
          <div className="mb-1.5 flex items-center justify-between">
            <h2 className="text-xs font-medium text-neutral-500">Personas relacionadas</h2>
            <button onClick={() => setShowPeoplePicker((v) => !v)} className="text-xs font-medium text-neutral-300">
              {showPeoplePicker ? 'Cerrar' : '+ Añadir'}
            </button>
          </div>

          {linkedPeople.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {linkedPeople.map((p) => (
                <span key={p.id} className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 py-1 pl-3 pr-1.5 text-xs text-neutral-200">
                  {p.name}
                  <button onClick={() => togglePerson(p.id)} className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-800 text-[10px] text-neutral-400">
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
          {linkedPeople.length === 0 && !showPeoplePicker && <p className="text-sm text-neutral-500">Nadie asignado todavía.</p>}

          {showPeoplePicker && (
            <div className="mt-2 space-y-2 rounded-xl border border-neutral-800 bg-neutral-900 p-3">
              {availablePeople.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availablePeople.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => togglePerson(p.id)}
                      className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNewPerson()}
                  placeholder="Nombre de una persona nueva…"
                  className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
                />
                <button onClick={handleAddNewPerson} className="rounded-lg border border-neutral-700 px-3 text-sm text-neutral-100">
                  Crear
                </button>
              </div>
            </div>
          )}
        </section>

        <section>
          <Field label="Etiquetas (separadas por comas)">
            <input
              defaultValue={project.tags.join(', ')}
              onBlur={(e) =>
                updateProject(project.id, {
                  tags: e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-100 focus:border-neutral-600 focus:outline-none"
            />
          </Field>
        </section>
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
