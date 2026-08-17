import { useRef, useState } from 'react';
import { useStore } from '../store';
import { exportDataFile, parseImportedFile } from '../storage';

export function Backup() {
  const { data, setData } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

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
      setData({ version: 1, projects: [], people: [] });
      setMessage('Se han borrado todos los datos.');
    }
  }

  return (
    <div className="mx-auto max-w-md pb-28">
      <header className="safe-top sticky top-0 z-10 bg-neutral-950/95 px-4 pb-3 pt-4 backdrop-blur">
        <h1 className="text-2xl font-bold text-neutral-50">Ajustes</h1>
      </header>

      <main className="space-y-4 px-4 pt-2">
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h2 className="text-sm font-semibold text-neutral-100">Copia de seguridad</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Todos los datos se guardan solo en este iPhone. Exporta un backup de vez en cuando para no perder nada si borras la app.
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

        <p className="pt-2 text-center text-xs text-neutral-600">Ideario · funciona sin conexión · tus datos no salen de tu iPhone</p>
      </main>
    </div>
  );
}
