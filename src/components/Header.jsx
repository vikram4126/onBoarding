import React, { useState } from 'react';
import { Search, Plus, Bell, AlertCircle, Calendar, Menu } from 'lucide-react';

const Header = ({ profile, onSearch, onAddTask, tasks = [], currentDay = 1, onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'completed') return false;
    if (t.deadlineDay && currentDay > t.deadlineDay) return true;
    if (t.day && t.day !== 'Custom' && parseInt(t.day) < currentDay) return true;
    return false;
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
      <div className="flex-1 flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-primary-600 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search tasks, trainings..." 
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onAddTask}
          className="flex items-center gap-2 text-sm font-medium bg-primary-50 text-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
        
        <div className="relative">
          <button 
            className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            {overdueTasks.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute -right-14 sm:right-0 mt-2 w-[300px] sm:w-80 bg-white border border-slate-200 shadow-xl rounded-xl z-50 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                {overdueTasks.length > 0 && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {overdueTasks.length} Overdue
                  </span>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {overdueTasks.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {overdueTasks.map(task => (
                      <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-800 leading-tight mb-1">{task.title}</p>
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Was due Day {task.deadlineDay || task.day}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-slate-500">No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-800 leading-none">{profile?.fullName || 'User'}</p>
            <p className="text-xs text-slate-500 mt-1">{profile?.designation || 'Role'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm shadow-sm border-2 border-white ring-2 ring-slate-100">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
