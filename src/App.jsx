import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FleetManagement from './pages/FleetManagement';
import FuelCost from './pages/FuelCost';
import OperatorPerformance from './pages/OperatorPerformance';
import SafetyAlert from './pages/SafetyAlert';
import Sidebar from './components/Sidebar';

const pages = {
  dashboard: Dashboard,
  fleet:     FleetManagement,
  fuel:      FuelCost,
  operator:  OperatorPerformance,
  safety:    SafetyAlert,
};

export default function App() {
  const [user, setUser]         = useState(null);
  const [currentPage, setPage]  = useState('dashboard');

  if (!user) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

  const PageComponent = pages[currentPage] || Dashboard;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0D1117' }}>
      <Sidebar
        currentPage={currentPage}
        setPage={setPage}
        onLogout={() => { setUser(null); setPage('dashboard'); }}
      />
      <main className="flex-1 overflow-y-auto">
        <PageComponent />
      </main>
    </div>
  );
}
