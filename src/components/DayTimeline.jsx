import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import { ChevronDown, ChevronUp, Plus, Check } from 'lucide-react';
import { getPeriodSortIndex } from '../utils/dateHelpers';

const DayTimeline = ({ tasks, toggleTask, notes, saveNote, currentDay, activeTab, searchQuery, onAddTask, onDeleteTask, onEditTask }) => {
  const [openDays, setOpenDays] = useState([]);
  
  const currentPeriod = currentDay; // It's passed as currentDay but actually holds a period string now.

  // Initialize open accordion for currentPeriod
  useEffect(() => {
    if (activeTab === 'timeline' && !searchQuery) {
      if (!openDays.includes(currentPeriod)) {
        setOpenDays(prev => [...prev, currentPeriod]);
      }
    }
  }, [currentPeriod, activeTab, searchQuery]);

  const toggleDayAccordion = (day) => {
    setOpenDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Filter tasks based on activeTab and searchQuery
  let filteredTasks = tasks;
  
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
  } else {
    if (activeTab === 'today') {
      filteredTasks = tasks.filter(t => t.day === currentPeriod);
    } else if (activeTab === 'pending') {
      filteredTasks = tasks.filter(t => t.status === 'pending');
    } else if (activeTab === 'completed') {
      filteredTasks = tasks.filter(t => t.status === 'completed');
    }
  }

  // Group by day/period
  const tasksByDay = filteredTasks.reduce((acc, task) => {
    const day = task.day || 'Custom';
    if (!acc[day]) acc[day] = [];
    acc[day].push(task);
    return acc;
  }, {});

  // Sort days
  const sortedDays = Object.keys(tasksByDay).sort((a, b) => {
    return getPeriodSortIndex(a) - getPeriodSortIndex(b);
  });

  // Open all days if searching
  const isDayOpen = (day) => {
    if (searchQuery || activeTab !== 'timeline') return true;
    return openDays.includes(day);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {activeTab === 'today' ? "Current Focus" : 
           activeTab === 'pending' ? 'Pending Tasks' : 
           activeTab === 'completed' ? 'Completed Tasks' : 
           'Onboarding Journey'}
        </h2>
        <p className="text-slate-500 mt-1">
          {activeTab === 'today' ? `You are currently in ${currentPeriod} of your journey.` : 'Track your progress and complete assigned tasks.'}
        </p>
      </div>

      {sortedDays.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">No tasks found for this view.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDays.map(day => {
            const isOpen = isDayOpen(day);
            const isCurrentDay = day === currentPeriod;
            const dayTasks = tasksByDay[day];
            const completedCount = dayTasks.filter(t => t.status === 'completed').length;
            const totalCount = dayTasks.length;
            const isAllCompleted = totalCount > 0 && completedCount === totalCount;
            const isPast = getPeriodSortIndex(day) < getPeriodSortIndex(currentPeriod);
            
            // Extract a short letter or number for the circle icon
            let iconText = day === 'Custom' ? 'C' : day.replace(/[^0-9a-zA-Z]/g, '').slice(0,2).toUpperCase();
            if (day.startsWith('Day ')) iconText = day.split(' ')[1];
            if (day.startsWith('Week ')) iconText = 'W' + day.split(' ')[1];
            
            return (
              <div key={day} className={`bg-white rounded-xl border ${isOpen ? 'border-primary-200 shadow-sm' : isAllCompleted ? 'border-green-200' : 'border-slate-200'} transition-all overflow-hidden`}>
                {/* Accordion Header */}
                <button 
                  onClick={() => toggleDayAccordion(day)}
                  className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${isOpen ? 'bg-primary-50/50' : isAllCompleted ? 'bg-green-50/30 hover:bg-green-50/60' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors
                      ${isCurrentDay ? 'bg-primary-500 text-white ring-4 ring-primary-50' : 
                        isAllCompleted ? 'bg-green-500 text-white' :
                        (!isAllCompleted && isPast) ? 'bg-red-50 text-red-600 border border-red-200 ring-2 ring-red-50' :
                        day === 'Custom' ? 'bg-indigo-500 text-white' : 'bg-slate-100 border border-slate-200 text-slate-600'}`}
                    >
                      {isAllCompleted ? <Check className="w-5 h-5" /> : iconText}
                    </div>
                    <div className="text-left flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {day === 'Custom' ? 'Custom Tasks' : day}
                        </h3>
                        {isCurrentDay && <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Current</span>}
                        {isAllCompleted && <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">All Done!</span>}
                        {!isAllCompleted && isPast && <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full whitespace-nowrap">{totalCount - completedCount} Missed</span>}
                      </div>
                      <p className={`text-xs ${(!isAllCompleted && isPast) ? 'text-red-500' : 'text-slate-500'}`}>
                        {completedCount} of {totalCount} tasks completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </button>
                
                {/* Accordion Content */}
                {isOpen && (
                  <div className="p-5 pt-2 border-t border-slate-100 bg-slate-50/30">
                    <div className="flex justify-end mb-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddTask(day);
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 py-1.5 rounded-md transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add item
                      </button>
                    </div>
                    <div className="grid gap-2.5">
                      {tasksByDay[day].map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          toggleTask={toggleTask}
                          note={notes[task.id]}
                          saveNote={saveNote}
                          onDeleteTask={onDeleteTask}
                          onEditTask={onEditTask}
                          currentDay={currentPeriod}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DayTimeline;
