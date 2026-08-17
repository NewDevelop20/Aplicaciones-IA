import { StatusBadge } from './StatusBadge';
import { formatDate, isOverdue } from '../statusMeta';
import type { Project } from '../types';

export function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const total = project.tasks.length;
  const done = project.tasks.filter((t) => t.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const overdue = isOverdue(project.dueDate) && project.status !== 'done' && project.status !== 'archived';

  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 text-left active:bg-neutral-900"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-neutral-50">{project.title}</h3>
        <StatusBadge status={project.status} />
      </div>

      {project.nextStep && (
        <p className="mt-1.5 line-clamp-2 text-sm text-neutral-400">
          <span className="text-neutral-500">Siguiente paso: </span>
          {project.nextStep}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-neutral-500">
        {total > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-800">
              <div className="h-full rounded-full bg-neutral-300" style={{ width: `${pct}%` }} />
            </div>
            <span>
              {done}/{total} tareas
            </span>
          </div>
        )}
        {project.dueDate && (
          <span className={overdue ? 'font-medium text-rose-400' : ''}>
            {overdue ? 'Vencido: ' : 'Fecha límite: '}
            {formatDate(project.dueDate)}
          </span>
        )}
        {project.peopleIds.length > 0 && <span>{project.peopleIds.length} persona(s)</span>}
      </div>
    </button>
  );
}
