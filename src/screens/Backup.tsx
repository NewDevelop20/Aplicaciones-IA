import { useRef, useState } from 'react';
import { useStore } from '../store';
import { exportDataFile, parseImportedFile } from '../storage';
import { getSyncToken, setSyncToken } from '../sync';

export function Backup() {
  const { data, setData, syncStatus, syncError, lastSyncedAt, triggerSync, pullStatus, pullError, pullLatest } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState(() => getSyncToken() ?? '');
  const [showTokenHelp, setShowTokenHelp] = useState(false);

  function handleExport() {
    exportDataFile(data);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const text = await file.text();
    const parsed = parseImportedFile(text);
    if (!parsed) {
      setMessage('El archivo no es un backup válido de Ideario.');
      return;
    }
    if (confirm('Esto reemplazará todos tus datos actuales por los del archivo. ¿Continuar?')) {
      setData(parsed);
      setMessage('Datos importados correctamente.');
    }
  }

  function handleReset() {
    if (confirm('Esto borrará todas las ideas, proyectos y personas de este dispositivo. ¿Seguro?')) {
      setData({ version: 1, projects: [], people: [], voiceNotes: [] });
      setMessage('Se han borrado todos los datos.');
    }
  }

  async function handlePull() {
    if (confirm('Esto reemplazará los datos de este iPhone por la última versión guardada en el servidor. ¿Continuar?')) {
      await pullLatest();
    }
  }

  function handleSaveToken() {
    setSyncToken(tokenInput);
    setMessage(tokenInput.trim() ? 'Token guardado. Sincronizando…' : 'Token eliminado. La sincronización automática está desactivada.');
    if (tokenInput.trim()) triggerSync();
  }

  const hasToken = !!getSyncToken();

  return (
    <div className="mx-auto max-w-md pb-28">
      <header className="safe-top sticky top-0 z-10 bg-neutral-950/95 px-4 pb-3 pt-4 backdrop-blur">
        <h1 className="text-2xl font-bold text-neutral-50">Ajustes</h1>
      </header>

      <main className="space-y-4 px-4 pt-2">
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-100">Resumen nocturno (23:00)</h2>
            <SyncBadge status={syncStatus} hasToken={hasToken} />
          </div>
          <p className="mt-1 text-sm text-neutral-400">
            Pega aquí un token de GitHub para que tus datos se sincronicen, recibas cada noche un resumen del estado de tus ideas, y para
            que las notas dictadas en "Dictar" se procesen automáticamente.
          </p>

          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="github_pat_…"
            autoCapitalize="off"
            autoCorrect="off"
            className="mt-3 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
          />
          <div className="mt-2 flex gap-2">
            <button onClick={handleSaveToken} className="flex-1 rounded-lg bg-white py-2 text-sm font-semibold text-neutral-900">
              Guardar token
            </button>
            {hasToken && (
              <button onClick={() => triggerSync()} className="rounded-lg border border-neutral-700 px-3 text-sm text-neutral-200">
                Sincronizar ahora
              </button>
            )}
          </div>

          {hasToken && (
            <p className="mt-2 text-xs text-neutral-500">
              {lastSyncedAt ? `Última sincronización: ${new Date(lastSyncedAt).toLocaleString('es-ES')}` : 'Todavía no se ha sincronizado.'}
            </p>
          )}
          {syncStatus === 'error' && syncError && <p className="mt-2 text-xs text-rose-400">{syncError}</p>}

          <button onClick={() => setShowTokenHelp((v) => !v)} className="mt-3 text-xs font-medium text-neutral-400 underline">
            {showTokenHelp ? 'Ocultar instrucciones' : '¿Cómo consigo el token?'}
          </button>
          {showTokenHelp && (
            <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs text-neutral-400">
              <li>
                En el navegador, ve a{' '}
                <span className="text-neutral-300">github.com/settings/personal-access-tokens/new</span>
              </li>
              <li>
                Repository access → <span className="text-neutral-300">Only select repositories</span> →{' '}
                <span className="text-neutral-300">NewDevelop20/Aplicaciones-IA</span>
              </li>
              <li>
                Permissions → Repository permissions → <span className="text-neutral-300">Actions: Read and write</span> (deja el resto en
                "No access")
              </li>
              <li>Generate token, cópialo y pégalo arriba. Es privado: se queda solo en este iPhone.</li>
            </ol>
          )}
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h2 className="text-sm font-semibold text-neutral-100">Traer cambios del servidor</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Cuando yo (Claude) procese una nota dictada o algo se sincronice desde otro sitio, usa esto para bajarlo a este iPhone.
          </p>
          <button
            onClick={handlePull}
            disabled={pullStatus === 'pulling'}
            className="mt-3 w-full rounded-xl border border-neutral-700 py-2.5 text-sm font-medium text-neutral-200 disabled:opacity-50"
          >
            {pullStatus === 'pulling' ? 'Descargando…' : 'Traer cambios ahora'}
          </button>
          {pullStatus === 'ok' && <p className="mt-2 text-xs text-emerald-400">Datos actualizados desde el servidor.</p>}
          {pullStatus === 'error' && pullError && <p className="mt-2 text-xs text-rose-400">{pullError}</p>}
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h2 className="text-sm font-semibold text-neutral-100">Copia de seguridad</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Todos los datos viven principalmente en este iPhone. Exporta un backup de vez en cuando para no perder nada si borras la app.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <button onClick={handleExport} className="rounded-xl bg-white py-2.5 text-sm font-semibold text-neutral-900">
              Exportar datos (JSON)
            </button>
            <button onClick={handleImportClick} className="rounded-xl border border-neutral-700 py-2.5 text-sm font-medium text-neutral-200">
              Importar backup
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h2 className="text-sm font-semibold text-neutral-100">Resumen</h2>
          <div className="mt-2 flex gap-6 text-sm text-neutral-400">
            <span>{data.projects.length} ideas / proyectos</span>
            <span>{data.people.length} personas</span>
          </div>
        </section>

        {message && <p className="text-center text-sm text-neutral-400">{message}</p>}

        <section className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-4">
          <h2 className="text-sm font-semibold text-rose-300">Zona de peligro</h2>
          <p className="mt-1 text-sm text-neutral-400">Borra todos los datos guardados en este dispositivo.</p>
          <button onClick={handleReset} className="mt-3 w-full rounded-xl border border-rose-800 py-2.5 text-sm font-medium text-rose-400">
            Borrar todos los datos
          </button>
        </section>

        <p className="pt-2 text-center text-xs text-neutral-600">
          Ideario · funciona sin conexión · la sincronización nocturna es opcional y solo se activa si guardas un token
        </p>
      </main>
    </div>
  );
}

function SyncBadge({ status, hasToken }: { status: 'idle' | 'syncing' | 'ok' | 'error'; hasToken: boolean }) {
  if (!hasToken) return <span className="text-xs text-neutral-500">Desactivada</span>;
  if (status === 'syncing') return <span className="text-xs text-amber-400">Sincronizando…</span>;
  if (status === 'error') return <span className="text-xs text-rose-400">Error</span>;
  if (status === 'ok') return <span className="text-xs text-emerald-400">Al día</span>;
  return <span className="text-xs text-neutral-500">Activada</span>;
}
