import { useState } from 'react';
import { useStore } from '../store';
import { formatDate } from '../statusMeta';

export function Dictate() {
  const { data, addVoiceNote, triggerSync } = useStore();
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!text.trim()) return;
    addVoiceNote(text.trim());
    setText('');
    setSent(true);
    triggerSync();
    setTimeout(() => setSent(false), 4000);
  }

  const notes = [...data.voiceNotes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mx-auto max-w-md pb-28">
      <header className="safe-top sticky top-0 z-10 bg-neutral-950/95 px-4 pb-3 pt-4 backdrop-blur">
        <h1 className="text-2xl font-bold text-neutral-50">Dictar nota</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Toca el cuadro de abajo y usa el micrófono del teclado para dictar todos los cambios seguidos: tareas completadas, siguientes
          pasos, cambios de estado… Se procesan automáticamente en menos de una hora.
        </p>
      </header>

      <main className="space-y-4 px-4 pt-2">
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Toca aquí y pulsa el micrófono del teclado para dictar…"
          className="w-full resize-none rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3.5 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
        />

        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-neutral-900 disabled:opacity-40"
        >
          Enviar nota
        </button>

        {sent && <p className="text-center text-sm text-emerald-400">✅ Nota guardada. Se procesará en la próxima hora.</p>}

        <section>
          <h2 className="mb-1.5 text-xs font-medium text-neutral-500">Notas enviadas</h2>
          {notes.length === 0 && <p className="text-sm text-neutral-500">Aún no has dictado ninguna nota.</p>}
          <div className="space-y-2">
            {notes.map((n) => (
              <div key={n.id} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-1 text-sm text-neutral-100">{n.text}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      n.status === 'processed' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-400/10 text-amber-300'
                    }`}
                  >
                    {n.status === 'processed' ? 'Procesada' : 'Pendiente'}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-neutral-500">{formatDate(n.createdAt)}</p>
                {n.resultSummary && <p className="mt-1.5 text-xs text-neutral-400">{n.resultSummary}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
