import { useEffect, useState } from 'react';

export type Route =
  | { name: 'dashboard' }
  | { name: 'new' }
  | { name: 'project'; id: string }
  | { name: 'people' }
  | { name: 'dictate' }
  | { name: 'backup' };

function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/';
  const projectMatch = path.match(/^\/project\/(.+)$/);
  if (projectMatch) return { name: 'project', id: decodeURIComponent(projectMatch[1]) };
  if (path === '/new') return { name: 'new' };
  if (path === '/people') return { name: 'people' };
  if (path === '/dictate') return { name: 'dictate' };
  if (path === '/backup') return { name: 'backup' };
  return { name: 'dashboard' };
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case 'dashboard':
      return '#/';
    case 'new':
      return '#/new';
    case 'project':
      return `#/project/${encodeURIComponent(route.id)}`;
    case 'people':
      return '#/people';
    case 'dictate':
      return '#/dictate';
    case 'backup':
      return '#/backup';
  }
}

export function useRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (next: Route) => {
    const hash = routeToHash(next);
    if (window.location.hash !== hash) window.location.hash = hash;
    else setRoute(next);
  };

  return [route, navigate];
}
