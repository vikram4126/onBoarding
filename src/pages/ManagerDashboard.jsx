import React, { useState, useRef } from 'react';
import { Upload, Users, LogOut, FileJson, CheckCircle2, Target, Calendar } from 'lucide-react';
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage';
import kpmgLogo from '../assets/kpmg-logo.svg';

const ManagerDashboard = ({ onLogout }) => {
  const [employees, setEmployees] = useState(() => getStorage(STORAGE_KEYS.MANAGER_EMPLOYEES, []));
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Basic validation
        if (!data.profile || !data.tasks) {
          alert('Invalid or corrupted file. Please upload a valid employee progress file.');
          return;
        }

        // Add or update the employee data
        const updatedEmployees = [...employees];
        const existingIndex = updatedEmployees.findIndex(emp => emp.profile.email === data.profile.email);
        
        if (existingIndex >= 0) {
          updatedEmployees[existingIndex] = data; // Update existing
        } else {
          updatedEmployees.push(data); // Add new
        }

        setEmployees(updatedEmployees);
        setStorage(STORAGE_KEYS.MANAGER_EMPLOYEES, updatedEmployees);
        e.target.value = null; // reset input
      } catch (err) {
        alert('Error parsing the file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const calculateProgress = (tasksObj, customTasksArray) => {
    const allTasks = [...Object.values(tasksObj || {}), ...(customTasksArray || [])];
    if (allTasks.length === 0) return 0;
    const completed = allTasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / allTasks.length) * 100);
  };

  if (selectedEmployee) {
    const allTasks = [...Object.values(selectedEmployee.tasks || {}), ...(selectedEmployee.customTasks || [])];
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const pendingTasks = allTasks.filter(t => t.status !== 'completed');

    return (
      <div className="flex flex-col h-screen bg-[#f8fafc]">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedEmployee(null)}
              className="text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors"
            >
              ← Back to Team
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-none">{selectedEmployee.profile.fullName}'s Progress</h2>
              <p className="text-xs text-slate-500 mt-1">{selectedEmployee.profile.team} · {selectedEmployee.profile.designation}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">Read-Only Mode</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-5 bg-white border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Overall Progress</p>
                  <p className="text-2xl font-bold text-slate-800">{calculateProgress(selectedEmployee.tasks, selectedEmployee.customTasks)}%</p>
                </div>
              </div>
              <div className="card p-5 bg-white border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Tasks Completed</p>
                  <p className="text-2xl font-bold text-slate-800">{completedTasks.length}</p>
                </div>
              </div>
              <div className="card p-5 bg-white border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Tasks Pending</p>
                  <p className="text-2xl font-bold text-slate-800">{pendingTasks.length}</p>
                </div>
              </div>
            </div>

            <div className="card bg-white border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800">Completed Tasks ({completedTasks.length})</h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {completedTasks.length > 0 ? completedTasks.map(task => (
                  <div key={task.id} className="p-4 flex gap-3 hover:bg-slate-50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight mb-1">{task.title}</p>
                      {task.description && <p className="text-xs text-slate-500">{task.description}</p>}
                      {selectedEmployee.notes && selectedEmployee.notes[task.id] && (
                        <div className="mt-2 bg-amber-50 text-amber-800 text-xs p-2 rounded border border-amber-100 inline-block">
                          <span className="font-semibold">Remark:</span> {selectedEmployee.notes[task.id]}
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="p-6 text-sm text-slate-500 text-center">No completed tasks yet.</p>
                )}
              </div>
            </div>
            
            <div className="card bg-white border border-slate-200 overflow-hidden opacity-75">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800">Pending Tasks ({pendingTasks.length})</h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {pendingTasks.length > 0 ? pendingTasks.map(task => (
                  <div key={task.id} className="p-4 flex gap-3 hover:bg-slate-50">
                    <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0 mt-0.5"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 leading-tight mb-1">{task.title}</p>
                      {selectedEmployee.notes && selectedEmployee.notes[task.id] && (
                        <div className="mt-2 bg-amber-50 text-amber-800 text-xs p-2 rounded border border-amber-100 inline-block">
                          <span className="font-semibold">Remark:</span> {selectedEmployee.notes[task.id]}
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="p-6 text-sm text-slate-500 text-center">All caught up!</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc]">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <img src={kpmgLogo} alt="KPMG Logo" className="h-6" />
          <div className="h-6 w-px bg-slate-200"></div>
          <h1 className="text-lg font-bold text-slate-800">Manager Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Import Employee File
          </button>
          
          <button 
            onClick={onLogout}
            className="text-slate-500 hover:text-red-600 transition-colors p-2"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-bold text-slate-800">My Team ({employees.length})</h2>
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl border-dashed">
              <FileJson className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">No team members yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">
                Ask your team members to click "Share Progress" from their dashboard and upload the downloaded .json file here.
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary py-2.5 px-6 font-medium inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Import First File
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((emp, idx) => {
                const progress = calculateProgress(emp.tasks, emp.customTasks);
                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedEmployee(emp)}
                    className="card bg-white border border-slate-200 p-5 hover:border-primary-300 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{emp.profile.fullName}</h3>
                        <p className="text-xs text-slate-500">{emp.profile.designation} · {emp.profile.team}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                        {emp.profile.fullName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600">Onboarding Progress</span>
                        <span className={progress === 100 ? "text-emerald-600" : "text-primary-600"}>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'}`} 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                      <span>Joined: {new Date(emp.profile.joiningDate).toLocaleDateString()}</span>
                      <span>Last Export: {emp.exportDate ? new Date(emp.exportDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
