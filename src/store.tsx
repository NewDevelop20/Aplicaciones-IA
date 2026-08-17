import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppData, Person, Project, Status, Task } from './types';
import { loadData, newId, saveData } from './storage';

interface StoreValue {
  data: AppData;
  setData: (data: AppData) => void;
  addProject: (input: { title: string; description: string; status: Status; priority: Project['priority']; startDate: string | null; dueDate: string | null; tags: string[]; nextStep: string }) => Project;
  updateProject: (id: string, patch: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, title: string) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  updateTask: (projectId: string, taskId: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  addPerson: (input: { name: string; role: string; contact: string; notes: string }) => Person;
  updatePerson: (id: string, patch: Partial<Omit<Person, 'id' | 'createdAt'>>) => void;
  deletePerson: (id: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<AppData>(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const setData = useCallback((next: AppData) => setDataState(next), []);

  const addProject: StoreValue['addProject'] = useCallback((input) => {
    const now = new Date().toISOString();
    const project: Project = {
      id: newId(),
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      tags: input.tags,
      peopleIds: [],
      tasks: [],
      nextStep: input.nextStep,
      startDate: input.startDate,
      dueDate: input.dueDate,
      createdAt: now,
      updatedAt: now,
    };
    setDataState((d) => ({ ...d, projects: [project, ...d.projects] }));
    return project;
  }, []);

  const updateProject: StoreValue['updateProject'] = useCallback((id, patch) => {
    setDataState((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
    }));
  }, []);

  const deleteProject: StoreValue['deleteProject'] = useCallback((id) => {
    setDataState((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));
  }, []);

  const addTask: StoreValue['addTask'] = useCallback((projectId, title) => {
    const task: Task = { id: newId(), title, done: false, dueDate: null, notes: '', createdAt: new Date().toISOString() };
    setDataState((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.id === projectId ? { ...p, tasks: [...p.tasks, task], updatedAt: new Date().toISOString() } : p)),
    }));
  }, []);

  const toggleTask: StoreValue['toggleTask'] = useCallback((projectId, taskId) => {
    setDataState((d) => ({
      ...d,
      projects: d.projects.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)), updatedAt: new Date().toISOString() }
          : p
      ),
    }));
  }, []);

  const updateTask: StoreValue['updateTask'] = useCallback((projectId, taskId, patch) => {
    setDataState((d) => ({
      ...d,
      projects: d.projects.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)), updatedAt: new Date().toISOString() }
          : p
      ),
    }));
  }, []);

  const deleteTask: StoreValue['deleteTask'] = useCallback((projectId, taskId) => {
    setDataState((d) => ({
      ...d,
      projects: d.projects.map((p) =>
        p.id === projectId ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId), updatedAt: new Date().toISOString() } : p
      ),
    }));
  }, []);

  const addPerson: StoreValue['addPerson'] = useCallback((input) => {
    const person: Person = { id: newId(), ...input, createdAt: new Date().toISOString() };
    setDataState((d) => ({ ...d, people: [person, ...d.people] }));
    return person;
  }, []);

  const updatePerson: StoreValue['updatePerson'] = useCallback((id, patch) => {
    setDataState((d) => ({ ...d, people: d.people.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }, []);

  const deletePerson: StoreValue['deletePerson'] = useCallback((id) => {
    setDataState((d) => ({
      ...d,
      people: d.people.filter((p) => p.id !== id),
      projects: d.projects.map((p) => ({ ...p, peopleIds: p.peopleIds.filter((pid) => pid !== id) })),
    }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({ data, setData, addProject, updateProject, deleteProject, addTask, toggleTask, updateTask, deleteTask, addPerson, updatePerson, deletePerson }),
    [data, setData, addProject, updateProject, deleteProject, addTask, toggleTask, updateTask, deleteTask, addPerson, updatePerson, deletePerson]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
