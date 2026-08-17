import { StoreProvider } from './store';
import { useRoute } from './router';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './screens/Dashboard';
import { NewProject } from './screens/NewProject';
import { ProjectDetail } from './screens/ProjectDetail';
import { People } from './screens/People';
import { Backup } from './screens/Backup';

function Screens() {
  const [route, navigate] = useRoute();

  return (
    <>
      {route.name === 'dashboard' && <Dashboard onNavigate={navigate} />}
      {route.name === 'new' && <NewProject onNavigate={navigate} />}
      {route.name === 'project' && <ProjectDetail id={route.id} onNavigate={navigate} />}
      {route.name === 'people' && <People />}
      {route.name === 'backup' && <Backup />}
      <BottomNav current={route} onNavigate={navigate} />
    </>
  );
}

function App() {
  return (
    <StoreProvider>
      <Screens />
    </StoreProvider>
  );
}

export default App;
