import type { Route } from '../router';

const ITEMS: { route: Route; label: string; icon: string }[] = [
  { route: { name: 'dashboard' }, label: 'Ideas', icon: '💡' },
  { route: { name: 'people' }, label: 'Personas', icon: '👥' },
  { route: { name: 'dictate' }, label: 'Dictar', icon: '🎤' },
  { route: { name: 'backup' }, label: 'Ajustes', icon: '⚙️' },
];

export function BottomNav({ current, onNavigate }: { current: Route; onNavigate: (r: Route) => void }) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {ITEMS.map((item) => {
          const active =
            item.route.name === current.name || (item.route.name === 'dashboard' && current.name === 'new') || (item.route.name === 'dashboard' && current.name === 'project');
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.route)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs ${active ? 'text-white' : 'text-neutral-500'}`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
