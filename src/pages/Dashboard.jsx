import React, { useState } from 'react';
import { useOnboarding } from '../hooks/useOnboarding';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DayTimeline from '../components/DayTimeline';
import RightPanel from '../components/RightPanel';
import AddTaskModal from '../components/AddTaskModal';

const Dashboard = () => {
  const { profile, tasks, toggleTask, addCustomTask, deleteCustomTask, editCustomTask, resetProfile, notes, saveNote, currentDay } = useOnboarding();
  const [activeTab, setActiveTab] = useState('timeline');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [selectedDayForTask, setSelectedDayForTask] = useState('Custom');
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleOpenAddTask = (day = 'Custom') => {
    setSelectedDayForTask(day);
    setEditingTask(null);
    setAddTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setAddTaskModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (editingTask) {
      editCustomTask(editingTask.id, formData);
    } else {
      addCustomTask(formData);
    }
  };

  const handleModalClose = () => {
    setAddTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - fixed on mobile, relative on desktop */}
      <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setSidebarOpen(false); }} profile={profile} onReset={resetProfile} />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <Header profile={profile} onSearch={handleSearch} onAddTask={() => handleOpenAddTask('Custom')} tasks={tasks} currentDay={currentDay} onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Center Section */}
            <div className="flex-1 max-w-4xl mx-auto p-6 overflow-y-auto custom-scrollbar">
              <DayTimeline 
                tasks={tasks} 
                toggleTask={toggleTask} 
                notes={notes} 
                saveNote={saveNote}
                currentDay={currentDay}
                activeTab={activeTab}
                searchQuery={searchQuery}
                onAddTask={handleOpenAddTask}
                onDeleteTask={deleteCustomTask}
                onEditTask={handleOpenEditTask}
              />
            </div>
            
            {/* Right Panel */}
            <RightPanel tasks={tasks} currentDay={currentDay} profile={profile} />
          </div>
        </main>
      </div>

      {isAddTaskModalOpen && (
        <AddTaskModal 
          onClose={handleModalClose} 
          onAdd={handleModalSubmit} 
          defaultDay={selectedDayForTask}
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
