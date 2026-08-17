export type Status = 'idea' | 'planning' | 'in_progress' | 'paused' | 'done' | 'archived';

export const STATUSES: { value: Status; label: string }[] = [
  { value: 'idea', label: 'Idea' },
  { value: 'planning', label: 'Planificando' },
  { value: 'in_progress', label: 'En marcha' },
  { value: 'paused', label: 'En pausa' },
  { value: 'done', label: 'Completado' },
  { value: 'archived', label: 'Archivado' },
];

export type Priority = 'low' | 'medium' | 'high';

export interface Person {
  id: string;
  name: string;
  role: string;
  contact: string;
  notes: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  dueDate: string | null;
  notes: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string[];
  peopleIds: string[];
  tasks: Task[];
  nextStep: string;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  version: 1;
  projects: Project[];
  people: Person[];
}
