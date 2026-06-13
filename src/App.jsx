import React from 'react';
import { useOnboarding } from './hooks/useOnboarding';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import WelcomePopup from './components/WelcomePopup';

function App() {
  const { profile, saveProfile, resetProfile } = useOnboarding();

  return (
    <div className="min-h-screen bg-background text-slate-800">
      {profile && profile.role !== 'manager' && profile.username !== 'admin' && <WelcomePopup profile={profile} />}
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
