import React from 'react';
import { useOnboarding } from './hooks/useOnboarding';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import ManagerDashboard from './pages/ManagerDashboard';

function App() {
  const { profile, saveProfile, resetProfile } = useOnboarding();

  return (
    <div className="min-h-screen bg-background text-slate-800">
      {!profile ? (
        <Welcome onSaveProfile={saveProfile} />
      ) : profile.role === 'manager' ? (
        <ManagerDashboard onLogout={resetProfile} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
