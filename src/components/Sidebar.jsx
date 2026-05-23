import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, CalendarDays, BookOpen, Users, Clock, CheckCircle2, LogOut, AlertTriangle } from 'lucide-react';
import kpmgLogo from '../assets/kpmg-logo.svg';

const navItems = [
  { id: 'timeline', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'today', icon: CheckSquare, label: 'Today Tasks' },
  { id: 'pending', icon: Clock, label: 'Pending Tasks' },
  { id: 'completed', icon: CheckCircle2, label: 'Completed Tasks' },
  { id: 'trainings', icon: BookOpen, label: 'Trainings' },
  { id: 'contacts', icon: Users, label: 'Contacts' },
];

const Sidebar = ({ activeTab, setActiveTab, profile, onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    onReset();
    setShowConfirm(false);
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col shadow-[1px_0_10px_rgba(0,0,0,0.02)] z-10">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <img src={kpmgLogo} alt="KPMG Logo" className="h-6" />
      </div>
      
      {/* Profile chip */}
      {profile && (
        <div className="mx-4 mt-4 p-3 bg-primary-50 rounded-xl border border-primary-100">
          <p className="text-xs font-semibold text-primary-700 truncate">{profile.fullName}</p>
          <p className="text-[11px] text-primary-500 truncate">{profile.team} · {profile.designation}</p>
        </div>
      )}

      <div className="flex-1 py-4 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Main Menu</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-primary-50 text-primary-600 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary-500' : 'text-slate-400'}`} />
            {item.label}
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* Reset / Change Profile */}
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Change Profile / Reset
          </button>
        ) : (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">This will clear all progress and reset your profile. Are you sure?</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleReset} className="flex-1 bg-red-500 text-white text-xs py-1.5 rounded-lg font-medium hover:bg-red-600 transition-colors">
                Yes, Reset
              </button>
              <button onClick={() => setShowConfirm(false)} className="flex-1 bg-white text-slate-600 text-xs py-1.5 rounded-lg font-medium border border-slate-200 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <p className="text-xs text-slate-500 font-medium mb-1">Need help?</p>
          <a href="mailto:support@kpmg.com" className="text-sm text-primary-600 font-medium hover:underline">Contact IT Support</a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
