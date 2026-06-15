import React, { useState, useRef } from 'react';
import { Upload, Users, LogOut, FileJson, CheckCircle2, Target, Heart, ChevronDown, ChevronUp, Check, RefreshCw, Clock, Plus, X } from 'lucide-react';
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage';
import { getPeriodSortIndex, getCurrentPeriod } from '../utils/dateHelpers';
import kpmgLogo from '../assets/kpmg-logo.svg';
import buddyTasksData from '../data/buddyTasks.json';
import CommentsList from '../components/CommentsList';

const BuddyDashboard = ({ onLogout }) => {
  const [employees, setEmployees] = useState(() => getStorage(STORAGE_KEYS.BUDDY_EMPLOYEES, []));
  
  // buddyTasks structure: { [employeeEmail]: { [taskId]: taskObj } }
  const [buddyTasks, setBuddyTasks] = useState(() => getStorage(STORAGE_KEYS.BUDDY_TASKS, {}));
  
  // Get buddy's own name from their profile
  const buddyProfile = getStorage(STORAGE_KEYS.PROFILE);
  const buddyName = buddyProfile?.fullName || 'Buddy';
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Accordion state
  const [openBuddyDays, setOpenBuddyDays] = useState(['Week 1', 'Pre-joining & Week 1']);
  const [openJoinerDays, setOpenJoinerDays] = useState(['Day 1']);
  
  const [toast, setToast] = useState(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({ fullName: '', email: '', joiningDate: new Date().toISOString().split('T')[0] });

  const fileInputRef = useRef(null);
  const reuploadInputRef = useRef(null);
  const reuploadTargetEmail = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getInitialBuddyTasks = () => {
    const template = getStorage(STORAGE_KEYS.BUDDY_TASK_TEMPLATE, null);
    const initial = {};

    if (template) {
      Object.values(template).forEach(tasksArray => {
        tasksArray.forEach(task => {
          initial[task.id] = { ...task };
        });
      });
    } else {
      buddyTasksData.forEach(dayPlan => {
        dayPlan.tasks.forEach(task => {
          initial[task.id] = { ...task, day: dayPlan.day };
        });
      });
    }
    return initial;
  };

  React.useEffect(() => {
    const template = getStorage(STORAGE_KEYS.BUDDY_TASK_TEMPLATE, null);
    let baseBuddyTasks = [];
    
    if (template) {
      Object.values(template).forEach(tasksArray => {
        baseBuddyTasks = [...baseBuddyTasks, ...tasksArray];
      });
    } else {
      buddyTasksData.forEach(dayPlan => {
        baseBuddyTasks = [...baseBuddyTasks, ...dayPlan.tasks.map(t => ({...t, day: dayPlan.day}))];
      });
    }

    const validIds = new Set(baseBuddyTasks.map(t => t.id));
    const currentTasks = getStorage(STORAGE_KEYS.BUDDY_TASKS, {});
    let isUpdated = false;

    const mergedData = {};
    
    Object.keys(currentTasks).forEach(email => {
      mergedData[email] = {};
      const empTasks = currentTasks[email];
      
      Object.keys(empTasks).forEach(id => {
        if (validIds.has(id)) {
          mergedData[email][id] = empTasks[id];
        }
      });
      
      baseBuddyTasks.forEach(task => {
        const existing = mergedData[email][task.id];
        if (!existing) {
          mergedData[email][task.id] = task;
          isUpdated = true;
        } else {
          const merged = { ...task, status: existing.status };
          if (JSON.stringify(existing) !== JSON.stringify(merged)) {
            mergedData[email][task.id] = merged;
            isUpdated = true;
          }
        }
      });
      
      if (Object.keys(mergedData[email]).length !== Object.keys(empTasks).length) {
        isUpdated = true;
      }
    });

    if (isUpdated) {
      setBuddyTasks(mergedData);
      setStorage(STORAGE_KEYS.BUDDY_TASKS, mergedData);
    }
  }, []);

  const toggleBuddyTask = (email, taskId) => {
    const updated = { ...buddyTasks };
    if (!updated[email]) updated[email] = getInitialBuddyTasks();
    if (updated[email][taskId]) {
      updated[email][taskId].status = updated[email][taskId].status === 'completed' ? 'pending' : 'completed';
      setBuddyTasks(updated);
      setStorage(STORAGE_KEYS.BUDDY_TASKS, updated);
    }
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualForm.fullName || !manualForm.email) {
      showToast('Name and Email are required.', 'error');
      return;
    }
    const email = manualForm.email.toLowerCase();
    if (employees.some(emp => emp.profile.email === email)) {
      showToast('A joiner with this email already exists.', 'error');
      return;
    }
    const dummyRecord = {
      profile: { fullName: manualForm.fullName, email: email, joiningDate: manualForm.joiningDate, team: 'TBD', designation: 'New Joiner', role: 'employee' },
      tasks: {},
      customTasks: []
    };
    const updatedEmployees = [...employees, dummyRecord];
    setEmployees(updatedEmployees);
    setStorage(STORAGE_KEYS.BUDDY_EMPLOYEES, updatedEmployees);

    const currentBuddyTasks = { ...buddyTasks };
    currentBuddyTasks[email] = getInitialBuddyTasks();
    setBuddyTasks(currentBuddyTasks);
    setStorage(STORAGE_KEYS.BUDDY_TASKS, currentBuddyTasks);

    setShowManualModal(false);
    setManualForm({ fullName: '', email: '', joiningDate: new Date().toISOString().split('T')[0] });
    showToast(`✓ Added ${manualForm.fullName}. You can now start tracking your buddy tasks.`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.profile || !data.tasks) {
          showToast('Invalid file.', 'error');
          return;
        }
        const email = data.profile.email.toLowerCase();
        data.profile.email = email;
        const updatedEmployees = [...employees];
        const existingIndex = updatedEmployees.findIndex(emp => emp.profile.email === email);
        const isUpdate = existingIndex >= 0;
        if (isUpdate) updatedEmployees[existingIndex] = data;
        else updatedEmployees.push(data);
        
        setEmployees(updatedEmployees);
        setStorage(STORAGE_KEYS.BUDDY_EMPLOYEES, updatedEmployees);
        
        const currentBuddyTasks = { ...buddyTasks };
        if (!currentBuddyTasks[email]) {
          currentBuddyTasks[email] = getInitialBuddyTasks();
          setBuddyTasks(currentBuddyTasks);
          setStorage(STORAGE_KEYS.BUDDY_TASKS, currentBuddyTasks);
        }
        e.target.value = null;
        showToast(isUpdate ? `✓ Synced ${data.profile.fullName}'s progress file.` : `✓ Added ${data.profile.fullName}.`);
      } catch (err) {
        showToast('Error reading file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleReupload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.profile || !data.tasks) {
          showToast('Invalid file format.', 'error');
          return;
        }
        const email = data.profile.email.toLowerCase();
        data.profile.email = email;
        if (email !== reuploadTargetEmail.current) {
          showToast(`File mismatch! Expected ${reuploadTargetEmail.current} but got ${email}.`, 'error');
          e.target.value = null;
          return;
        }
        const updatedEmployees = [...employees];
        const idx = updatedEmployees.findIndex(emp => emp.profile.email === email);
        if (idx >= 0) updatedEmployees[idx] = data;
        else updatedEmployees.push(data);
        setEmployees(updatedEmployees);
        setStorage(STORAGE_KEYS.BUDDY_EMPLOYEES, updatedEmployees);
        e.target.value = null;
        reuploadTargetEmail.current = null;
        showToast(`✓ ${data.profile.fullName}'s data updated.`);
      } catch (err) {
        showToast('Error reading file.', 'error');
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
  
  const calculateBuddyProgress = (email) => {
    const tasks = buddyTasks[email] || getInitialBuddyTasks();
    const taskArray = Object.values(tasks);
    if (taskArray.length === 0) return 0;
    const completed = taskArray.filter(t => t.status === 'completed').length;
    return Math.round((completed / taskArray.length) * 100);
  };

  // ─── Detail View ───
  if (selectedEmployee) {
    const empEmail = selectedEmployee.profile.email;
    const isManualDummy = Object.keys(selectedEmployee.tasks || {}).length === 0 && (selectedEmployee.customTasks || []).length === 0;
    
    const currentPeriodStr = getCurrentPeriod(selectedEmployee.profile.joiningDate);
    const currentSortIndex = getPeriodSortIndex(currentPeriodStr);

    // Joiner Data
    const allJoinerTasks = [...Object.values(selectedEmployee.tasks || {}), ...(selectedEmployee.customTasks || [])];
    const joinerProgressPercent = calculateProgress(selectedEmployee.tasks, selectedEmployee.customTasks);
    
    const joinerTasksByDay = allJoinerTasks.reduce((acc, task) => {
      const day = task.day || 'Other';
      if (!acc[day]) acc[day] = [];
      acc[day].push(task);
      return acc;
    }, {});
    const sortedJoinerDays = Object.keys(joinerTasksByDay).sort((a, b) => getPeriodSortIndex(a) - getPeriodSortIndex(b));

    const toggleJoinerAccordion = (day) => {
      setOpenJoinerDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    // Buddy Data
    const currentBuddyTasksObj = buddyTasks[empEmail] || getInitialBuddyTasks();
    const currentBuddyTasksArr = Object.values(currentBuddyTasksObj);
    const buddyCompletedCount = currentBuddyTasksArr.filter(t => t.status === 'completed').length;
    const buddyTotalCount = currentBuddyTasksArr.length;
    const buddyProgressPercent = buddyTotalCount === 0 ? 0 : Math.round((buddyCompletedCount / buddyTotalCount) * 100);

    const buddyTasksByDay = currentBuddyTasksArr.reduce((acc, task) => {
      const day = task.day || 'Other';
      if (!acc[day]) acc[day] = [];
      acc[day].push(task);
      return acc;
    }, {});
    const sortedBuddyDays = Object.keys(buddyTasksByDay).sort((a, b) => getPeriodSortIndex(a) - getPeriodSortIndex(b));

    const toggleBuddyAccordion = (day) => {
      setOpenBuddyDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    // Joiner Comments Handlers
    const handleJoinerCommentAdd = (taskId, text, author) => {
      const updatedEmployees = [...employees];
      const idx = updatedEmployees.findIndex(emp => emp.profile.email === empEmail);
      if (idx === -1) return;
      const emp = { ...updatedEmployees[idx] };
      const notes = emp.notes ? { ...emp.notes } : {};
      const taskComments = Array.isArray(notes[taskId]) ? [...notes[taskId]] : 
                           (typeof notes[taskId] === 'string' ? [{ id: 'old', text: notes[taskId], author: 'New Joiner', timestamp: new Date().toISOString() }] : []);
      taskComments.push({ id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, text, author, timestamp: new Date().toISOString() });
      notes[taskId] = taskComments;
      emp.notes = notes;
      updatedEmployees[idx] = emp;
      setEmployees(updatedEmployees);
      setStorage(STORAGE_KEYS.BUDDY_EMPLOYEES, updatedEmployees);
      setSelectedEmployee(emp);
    };

    const handleJoinerCommentEdit = (taskId, commentId, text) => {
      const updatedEmployees = [...employees];
      const idx = updatedEmployees.findIndex(emp => emp.profile.email === empEmail);
      if (idx === -1) return;
      const emp = { ...updatedEmployees[idx] };
      const notes = emp.notes ? { ...emp.notes } : {};
      const taskComments = Array.isArray(notes[taskId]) ? [...notes[taskId]] : [];
      notes[taskId] = taskComments.map(c => c.id === commentId ? { ...c, text } : c);
      emp.notes = notes;
      updatedEmployees[idx] = emp;
      setEmployees(updatedEmployees);
      setStorage(STORAGE_KEYS.BUDDY_EMPLOYEES, updatedEmployees);
      setSelectedEmployee(emp);
    };

    const handleJoinerCommentDelete = (taskId, commentId) => {
      const updatedEmployees = [...employees];
      const idx = updatedEmployees.findIndex(emp => emp.profile.email === empEmail);
      if (idx === -1) return;
      const emp = { ...updatedEmployees[idx] };
      const notes = emp.notes ? { ...emp.notes } : {};
      const taskComments = Array.isArray(notes[taskId]) ? [...notes[taskId]] : [];
      notes[taskId] = taskComments.filter(c => c.id !== commentId);
      emp.notes = notes;
      updatedEmployees[idx] = emp;
      setEmployees(updatedEmployees);
      setStorage(STORAGE_KEYS.BUDDY_EMPLOYEES, updatedEmployees);
      setSelectedEmployee(emp);
    };

    // Buddy Comments Handlers
    const handleBuddyCommentAdd = (taskId, text, author) => {
      const updated = { ...buddyTasks };
      if (!updated[empEmail]) updated[empEmail] = getInitialBuddyTasks();
      const taskObj = updated[empEmail][taskId];
      const taskComments = Array.isArray(taskObj.comments) ? [...taskObj.comments] : [];
      taskComments.push({ id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, text, author, timestamp: new Date().toISOString() });
      taskObj.comments = taskComments;
      setBuddyTasks(updated);
      setStorage(STORAGE_KEYS.BUDDY_TASKS, updated);
    };

    const handleBuddyCommentEdit = (taskId, commentId, text) => {
      const updated = { ...buddyTasks };
      if (!updated[empEmail]) return;
      const taskObj = updated[empEmail][taskId];
      if (!taskObj || !Array.isArray(taskObj.comments)) return;
      taskObj.comments = taskObj.comments.map(c => c.id === commentId ? { ...c, text } : c);
      setBuddyTasks(updated);
      setStorage(STORAGE_KEYS.BUDDY_TASKS, updated);
    };

    const handleBuddyCommentDelete = (taskId, commentId) => {
      const updated = { ...buddyTasks };
      if (!updated[empEmail]) return;
      const taskObj = updated[empEmail][taskId];
      if (!taskObj || !Array.isArray(taskObj.comments)) return;
      taskObj.comments = taskObj.comments.filter(c => c.id !== commentId);
      setBuddyTasks(updated);
      setStorage(STORAGE_KEYS.BUDDY_TASKS, updated);
    };

    return (
      <div className="flex flex-col h-screen bg-[#f8fafc]">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-20 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedEmployee(null)}
              className="text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              ← Back
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-none">{selectedEmployee.profile.fullName}</h2>
              <p className="text-xs text-slate-500 mt-1">{selectedEmployee.profile.team} · {selectedEmployee.profile.designation}</p>
            </div>
          </div>
          {isManualDummy && (
            <button
              onClick={() => {
                reuploadTargetEmail.current = empEmail;
                reuploadInputRef.current?.click();
              }}
              className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Sync JSON File
            </button>
          )}
        </header>

        {/* Side-by-Side Layout */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6 p-6 lg:p-8 bg-[#f8fafc] max-w-[1400px] w-full mx-auto">
          
          {/* LEFT: Joiner Progress */}
          <div className="w-full md:w-1/2 flex flex-col border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-white shadow-sm z-10 flex-shrink-0 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-500" /> Joiner's Progress
              </h3>
              <span className="bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md text-xs font-bold border border-primary-100">{joinerProgressPercent}% Complete</span>
            </div>
            
            <div className="flex-1 overflow-auto p-5 bg-slate-50/30">
              {isManualDummy ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-xl border-dashed">
                  <FileJson className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Waiting for Joiner's File</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4 leading-relaxed">
                    Import their JSON file to see their onboarding progress here.
                  </p>
                  <button
                    onClick={() => { reuploadTargetEmail.current = empEmail; reuploadInputRef.current?.click(); }}
                    className="btn-primary py-2 px-4 text-xs font-medium inline-flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" /> Sync JSON File
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedJoinerDays.map(day => {
                    const isOpen = openJoinerDays.includes(day);
                    const dayTasks = joinerTasksByDay[day];
                    const completedCount = dayTasks.filter(t => t.status === 'completed').length;
                    const totalCount = dayTasks.length;
                    const isAllDone = totalCount > 0 && completedCount === totalCount;
                    const iconText = day.startsWith('Week ') ? 'W' + day.split(' ')[1] : day.slice(0, 2);

                    return (
                      <div key={day} className={`bg-white rounded-xl border ${isOpen ? 'border-primary-200 shadow-sm' : isAllDone ? 'border-green-200' : 'border-slate-200'} transition-all overflow-hidden`}>
                        <button
                          onClick={() => toggleJoinerAccordion(day)}
                          className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${isOpen ? 'bg-primary-50/50' : isAllDone ? 'bg-green-50/30' : 'hover:bg-slate-50'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${
                              isAllDone ? 'bg-green-500 text-white' : 'bg-primary-500 text-white'
                            }`}>
                              {isAllDone ? <Check className="w-4 h-4" /> : iconText}
                            </div>
                            <div className="text-left flex flex-col">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-slate-800">{day}</h3>
                              </div>
                              <p className="text-[11px] text-slate-500">{completedCount} of {totalCount} completed</p>
                            </div>
                          </div>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>

                        {isOpen && (
                          <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/30">
                            <div className="grid gap-2">
                              {dayTasks.map(task => (
                                <div key={task.id} className="p-2.5 bg-white border border-slate-200/80 rounded-lg shadow-sm flex gap-2.5 opacity-90">
                                  {task.status === 'completed' ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className={`text-xs font-semibold leading-snug ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                      {task.title}
                                    </h4>
                                    <CommentsList 
                                      comments={selectedEmployee.notes && selectedEmployee.notes[task.id] ? selectedEmployee.notes[task.id] : []}
                                      onAdd={(text, author) => handleJoinerCommentAdd(task.id, text, author)}
                                      onEdit={(id, text) => handleJoinerCommentEdit(task.id, id, text)}
                                      onDelete={(id) => handleJoinerCommentDelete(task.id, id)}
                                      authorName={buddyName}
                                    />
                                  </div>
                                </div>
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
          </div>
          
          {/* RIGHT: Buddy Checklist */}
          <div className="w-full md:w-1/2 flex flex-col border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-white shadow-sm z-10 flex-shrink-0 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Heart className="w-5 h-5 text-indigo-500" /> My Buddy Checklist
              </h3>
              <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold border border-indigo-100">{buddyProgressPercent}% Complete</span>
            </div>
            
            <div className="flex-1 overflow-auto p-5 bg-slate-50/30">
              <div className="space-y-4">
                {sortedBuddyDays.map(day => {
                  const isOpen = openBuddyDays.includes(day);
                  const dayTasks = buddyTasksByDay[day];
                  const completedCount = dayTasks.filter(t => t.status === 'completed').length;
                  const totalCount = dayTasks.length;
                  const isAllDone = totalCount > 0 && completedCount === totalCount;
                  const iconText = day.startsWith('Week ') ? 'W' + day.split(' ')[1] : day.slice(0, 2);

                  return (
                    <div key={day} className={`bg-white rounded-xl border ${isOpen ? 'border-indigo-200 shadow-sm' : isAllDone ? 'border-green-200' : 'border-slate-200'} transition-all overflow-hidden`}>
                      <button
                        onClick={() => toggleBuddyAccordion(day)}
                        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${isOpen ? 'bg-indigo-50/40' : isAllDone ? 'bg-green-50/30' : 'hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${
                            isAllDone ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white'
                          }`}>
                            {isAllDone ? <Check className="w-4 h-4" /> : iconText}
                          </div>
                          <div className="text-left flex flex-col">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-slate-800">{day}</h3>
                            </div>
                            <p className="text-[11px] text-slate-500">{completedCount} of {totalCount} completed</p>
                          </div>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {isOpen && (
                        <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/30">
                          <div className="grid gap-2">
                            {dayTasks.map(task => {
                              const taskSortIndex = getPeriodSortIndex(day);
                              const isOverdue = task.status !== 'completed' && currentSortIndex > taskSortIndex;
                              
                              return (
                              <div key={task.id} className={`p-2.5 bg-white border ${isOverdue ? 'border-red-300 bg-red-50/30 shadow-sm' : 'border-slate-200/80 hover:shadow-md'} rounded-lg transition-all`}>
                                <div className="flex gap-2.5">
                                  <button
                                    onClick={() => toggleBuddyTask(empEmail, task.id)}
                                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0
                                      ${task.status === 'completed'
                                        ? 'bg-green-600 border-green-600 text-white shadow-sm'
                                        : isOverdue ? 'border-red-400 hover:border-green-500 bg-white' : 'border-slate-300 hover:border-green-500 bg-white'}`}
                                  >
                                    {task.status === 'completed' && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                      <h4 className={`text-xs font-semibold leading-snug ${task.status === 'completed' ? 'text-slate-400 line-through' : isOverdue ? 'text-red-700' : 'text-slate-800'}`}>
                                        {task.title}
                                      </h4>
                                      {isOverdue && <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold border border-red-200 ml-1 flex-shrink-0">Overdue</span>}
                                    </div>
                                    {task.description && (
                                      <p className={`text-[10px] mt-1 leading-relaxed ${isOverdue ? 'text-red-600/80' : 'text-slate-500'}`}>{task.description}</p>
                                    )}
                                    <CommentsList 
                                      comments={task.comments || []}
                                      onAdd={(text, author) => handleBuddyCommentAdd(task.id, text, author)}
                                      onEdit={(id, text) => handleBuddyCommentEdit(task.id, id, text)}
                                      onDelete={(id) => handleBuddyCommentDelete(task.id, id)}
                                      authorName={buddyName}
                                    />
                                  </div>
                                </div>
                              </div>
                            )})}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ─── Main Dashboard (Grid View) ───
  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] relative">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <img src={kpmgLogo} alt="KPMG Logo" className="h-6" />
          <div className="h-6 w-px bg-slate-200"></div>
          <h1 className="text-lg font-bold text-slate-800">Buddy Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <input type="file" accept=".json" ref={reuploadInputRef} onChange={handleReupload} className="hidden" />
          
          <button onClick={() => setShowManualModal(true)} className="text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-200 py-2 px-4 text-sm rounded-xl font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Joiner Manually
          </button>
          
          <button onClick={() => fileInputRef.current?.click()} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import Joiner JSON
          </button>
          
          <div className="h-6 w-px bg-slate-200"></div>
          <button onClick={onLogout} className="text-slate-500 hover:text-red-600 transition-colors p-2" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-bold text-slate-800">My New Joiners ({employees.length})</h2>
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-xl border-dashed">
              <FileJson className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">No new joiners yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">You can add a joiner manually to start tracking your pre-joining buddy tasks, or import a JSON file shared by them.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowManualModal(true)} className="bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 py-2.5 px-6 rounded-xl font-medium transition-colors inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Manually
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="btn-primary py-2.5 px-6 font-medium inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Import JSON
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((emp, idx) => {
                const isManualDummy = Object.keys(emp.tasks || {}).length === 0 && (emp.customTasks || []).length === 0;
                const joinerProgress = calculateProgress(emp.tasks, emp.customTasks);
                const buddyProg = calculateBuddyProgress(emp.profile.email);
                
                return (
                  <div key={idx} onClick={() => setSelectedEmployee(emp)} className="card bg-white border border-slate-200 p-5 hover:border-primary-300 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden flex flex-col">
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

                    <div className="space-y-4 flex-1">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600">Joiner's Onboarding Progress</span>
                          {isManualDummy ? <span className="text-slate-400 italic">Waiting for JSON</span> : <span className={joinerProgress === 100 ? "text-emerald-600" : "text-primary-600"}>{joinerProgress}%</span>}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-1.5 rounded-full ${joinerProgress === 100 ? 'bg-emerald-500' : 'bg-primary-500'} ${isManualDummy ? 'opacity-0' : ''}`} style={{ width: `${joinerProgress}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600">My Buddy Support Tasks</span>
                          <span className={buddyProg === 100 ? "text-emerald-600" : "text-indigo-600"}>{buddyProg}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-1.5 rounded-full ${buddyProg === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${buddyProg}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        <span>Joined: {new Date(emp.profile.joiningDate).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); reuploadTargetEmail.current = emp.profile.email; reuploadInputRef.current?.click(); }}
                        title={isManualDummy ? "Sync with JSON file to see joiner progress" : "Re-upload updated file for this joiner"}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-2 py-1 rounded-lg transition-colors"
                      >
                        {isManualDummy ? <Upload className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                        {isManualDummy ? 'Sync JSON' : 'Re-upload'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Manual Add Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Add Joiner Manually</h3>
              <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleManualAdd} className="p-6 space-y-4">
              <p className="text-sm text-slate-500 mb-2">Add a new joiner to start tracking your "Pre-joining" buddy tasks. You can sync their actual progress later by importing their JSON file.</p>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" required value={manualForm.fullName} onChange={e => setManualForm({...manualForm, fullName: e.target.value})} className="input-field" placeholder="e.g. John Doe" />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email ID (Important for Sync)</label>
                <input type="email" required value={manualForm.email} onChange={e => setManualForm({...manualForm, email: e.target.value})} className="input-field" placeholder="e.g. john@kpmg.com" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Expected Joining Date</label>
                <input type="date" required value={manualForm.joiningDate} onChange={e => setManualForm({...manualForm, joiningDate: e.target.value})} className="input-field" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowManualModal(false)} className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-2.5 px-4 font-medium">Add Joiner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-medium transition-all duration-300 ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          {toast.type === 'error' ? <span className="text-lg">⚠️</span> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default BuddyDashboard;
