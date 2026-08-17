import { useState } from 'react';
import { useStore } from '../store';

export function People() {
  const { data, addPerson, updatePerson, deletePerson } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [contact, setContact] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  function projectsFor(personId: string) {
    return data.projects.filter((p) => p.peopleIds.includes(personId));
  }

  function resetForm() {
    setName('');
    setRole('');
    setContact('');
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(id: string) {
    const p = data.people.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    setName(p.name);
    setRole(p.role);
    setContact(p.contact);
    setShowForm(true);
  }

  function handleSave() {
    if (!name.trim()) return;
    if (editingId) {
      updatePerson(editingId, { name: name.trim(), role: role.trim(), contact: contact.trim() });
    } else {
      addPerson({ name: name.trim(), role: role.trim(), contact: contact.trim(), notes: '' });
    }
    resetForm();
  }

  function handleDelete(id: string) {
    if (confirm('¿Eliminar esta persona? Se quitará de todos los proyectos.')) {
      deletePerson(id);
      resetForm();
    }
  }

  return (
    <div className="mx-auto max-w-md pb-28">
      <header className="safe-top sticky top-0 z-10 flex items-center justify-between bg-neutral-950/95 px-4 pb-3 pt-4 backdrop-blur">
        <h1 className="text-2xl font-bold text-neutral-50">Personas</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="rounded-full border border-neutral-700 px-3 py-1.5 text-sm font-medium text-neutral-200"
        >
          {showForm ? 'Cancelar' : '+ Añadir'}
        </button>
      </header>

      <main className="space-y-3 px-4 pt-2">
        {showForm && (
          <div className="space-y-2.5 rounded-2xl border border-neutral-800 bg-neutral-900 p-3.5">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
            />
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Rol / relación (ej. socio, diseñador, cliente)"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
            />
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contacto (email / teléfono)"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 rounded-lg bg-white py-2 text-sm font-semibold text-neutral-900">
                Guardar
              </button>
              {editingId && (
                <button onClick={() => handleDelete(editingId)} className="rounded-lg border border-rose-900 px-3 text-sm text-rose-400">
                  Eliminar
                </button>
              )}
            </div>
          </div>
        )}

        {data.people.length === 0 && !showForm && (
          <div className="mt-16 text-center text-neutral-500">
            <p className="text-4xl">👥</p>
            <p className="mt-3 text-sm">Aún no has añadido a nadie.</p>
          </div>
        )}

        {data.people.map((p) => {
          const linked = projectsFor(p.id);
          return (
            <button
              key={p.id}
              onClick={() => startEdit(p.id)}
              className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3.5 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-50">{p.name}</span>
                {linked.length > 0 && <span className="text-xs text-neutral-500">{linked.length} proyecto(s)</span>}
              </div>
              {p.role && <p className="mt-0.5 text-sm text-neutral-400">{p.role}</p>}
              {p.contact && <p className="mt-0.5 text-xs text-neutral-500">{p.contact}</p>}
            </button>
          );
        })}
      </main>
    </div>
  );
}
