import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { LayoutDashboard, CheckSquare, CalendarDays, BookOpen, Users, Clock, CheckCircle2, LogOut, AlertTriangle, Download, ChevronDown, ChevronRight, Globe, X, ExternalLink, Image as ImageIcon } from 'lucide-react';
import kpmgLogo from '../assets/kpmg-logo.svg';

import portalsList from '../data/portals.json';

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
  const [isPortalsOpen, setIsPortalsOpen] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState(null);

  const handleReset = () => {
    onReset();
    setShowConfirm(false);
  };

  const handleExport = () => {
    const data = {
      profile: JSON.parse(localStorage.getItem('onboarding_profile') || 'null'),
      tasks: JSON.parse(localStorage.getItem('onboarding_tasks') || 'null'),
      customTasks: JSON.parse(localStorage.getItem('onboarding_custom_tasks') || 'null'),
      notes: JSON.parse(localStorage.getItem('onboarding_notes') || 'null'),
      exportDate: new Date().toISOString()
    };
    
    if (!data.profile) return;
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    const safeName = (data.profile.fullName || 'User').replace(/[^a-zA-Z0-9]/g, '_');
    a.download = `${safeName}_Progress.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col shadow-[1px_0_10px_rgba(0,0,0,0.02)] z-10">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <img src={kpmgLogo} alt="KPMG Logo" className="h-10" />
      </div>
      


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


        <div className="h-6"></div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Portals</div>
        <button
          onClick={() => setIsPortalsOpen(!isPortalsOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-slate-400" />
            Company Portals
          </div>
          {isPortalsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {isPortalsOpen && (
          <div className="mt-2 space-y-0.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100 shadow-sm mx-1">
            {portalsList.map((portal) => (
              <div key={portal.id} className="flex items-center gap-1 group">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center pl-0 pr-2 py-1.5 text-sm font-medium transition-colors text-slate-600 hover:text-primary-700"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
                    {portal.name}
                  </div>
                </a>
                <button
                  onClick={() => setSelectedPortal(portal)}
                  className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors"
                  title="View Guide"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* Reset / Change Profile */}
        {/* Export Progress */}
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 font-medium hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-slate-200 hover:border-primary-200 bg-white shadow-sm"
        >
          <Download className="w-4 h-4 text-primary-500" />
          Share Progress
        </button>

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
      {selectedPortal && createPortal(
        <div 
          className="fixed inset-0 bg-slate-900/80 z-[9999] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm"
          onClick={() => setSelectedPortal(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-[95vw] max-w-6xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-xl text-slate-800">{selectedPortal.name} Guide</h3>
              <button onClick={() => setSelectedPortal(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100/50 flex items-center justify-center">
              <img src={`${import.meta.env.BASE_URL}${selectedPortal.image.replace(/^\//, '')}`} alt={selectedPortal.name} className="max-w-full max-h-full rounded-xl shadow-md border border-slate-200 object-contain" />
            </div>
            <div className="p-4 sm:px-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button onClick={() => setSelectedPortal(null)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">
                Close
              </button>
              <a href={selectedPortal.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors">
                Proceed to {selectedPortal.name} <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Sidebar;
