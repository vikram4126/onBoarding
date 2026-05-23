import React from 'react';
import { Target, Trophy, Clock, Phone, AlertCircle } from 'lucide-react';
import contactsData from '../data/contacts.json';

const RightPanel = ({ tasks, currentDay, profile }) => {
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  const pendingTodayCount = tasks.filter(t => t.day === currentDay && t.status === 'pending').length;

  const overdueTasks = tasks.filter(t => t.deadlineDay && currentDay > t.deadlineDay && t.status !== 'completed');
  const upcomingTrainings = tasks.filter(t => t.deadlineDay && currentDay <= t.deadlineDay && t.status !== 'completed').slice(0, 3);

  return (
    <div className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto hidden lg:block custom-scrollbar z-0">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Your Progress</h3>
        
        <div className="card p-5 bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none shadow-primary-500/20 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium opacity-90">Overall Completion</span>
            <Trophy className="w-5 h-5 text-yellow-300" />
          </div>
          <div className="text-3xl font-bold mb-2">{progressPercent}%</div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-white h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-xs text-primary-100">{completedCount} of {totalTasks} tasks completed</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary-500" /> Today's Focus
        </h3>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {pendingTodayCount}
            </div>
            <div>
              <p className="font-semibold text-slate-800">Tasks Pending</p>
              <p className="text-xs text-slate-500">For Day {currentDay}</p>
            </div>
          </div>
        </div>
      </div>

      {(overdueTasks.length > 0 || upcomingTrainings.length > 0) && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            {overdueTasks.length > 0 ? (
              <><AlertCircle className="w-4 h-4 text-red-500" /> Action Required</>
            ) : (
              <><Clock className="w-4 h-4 text-primary-500" /> Upcoming Tasks</>
            )}
          </h3>
          <div className="space-y-3">
            {overdueTasks.map(task => (
              <div key={task.id} className="card p-3 shadow-none bg-red-50 border-red-100 border">
                <h4 className="text-sm font-semibold text-slate-800 mb-1 leading-tight">{task.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">Overdue by {currentDay - task.deadlineDay} day(s)</span>
                  <a href={task.url || '#'} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase text-red-600 hover:text-red-700 bg-white border border-red-200 px-2 py-1 rounded">Start</a>
                </div>
              </div>
            ))}
            
            {overdueTasks.length === 0 && upcomingTrainings.map(task => (
              <div key={task.id} className="card p-3 shadow-none bg-slate-50 border-slate-100 border hover:border-primary-200 transition-colors">
                <h4 className="text-sm font-semibold text-slate-800 mb-1 leading-tight">{task.title}</h4>
                <p className="text-xs text-slate-500 mb-2">{task.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Due Day {task.deadlineDay}</span>
                  <a href={task.url || '#'} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase text-primary-600 hover:text-primary-700">Start</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary-500" /> Key Contacts
        </h3>
        <div className="space-y-3">
          {contactsData.slice(0, 3).map(contact => (
            <div key={contact.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium flex-shrink-0">
                {contact.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 leading-none mb-1">{contact.name}</p>
                <p className="text-xs text-slate-500 mb-1">{contact.team}</p>
                <a href={`mailto:${contact.email}`} className="text-xs text-primary-600 hover:underline">{contact.email}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
