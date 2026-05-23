import React from 'react';
import { useOnboarding } from './hooks/useOnboarding';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';

function App() {
  const { profile, saveProfile } = useOnboarding();

  return (
    <div className="min-h-screen bg-background text-slate-800">
      {!profile ? (
        <Welcome onSaveProfile={saveProfile} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
