import { useState, useEffect } from 'react';
import { getStorage, setStorage, clearStorage, STORAGE_KEYS } from '../utils/storage';
import onboardingData from '../data/onboarding.json';
import teamTasksData from '../data/teamTasks.json';

export const useOnboarding = () => {
  const [profile, setProfile] = useState(() => getStorage(STORAGE_KEYS.PROFILE));
  const [tasks, setTasks] = useState(() => getStorage(STORAGE_KEYS.TASKS, {}));
  const [customTasks, setCustomTasks] = useState(() => getStorage(STORAGE_KEYS.CUSTOM_TASKS, []));
  const [notes, setNotes] = useState(() => getStorage(STORAGE_KEYS.NOTES, {}));

  // Initialize or update tasks based on profile team
  useEffect(() => {
    if (!profile) return;

    // Check if manager has uploaded an Excel template
    const taskTemplate = getStorage(STORAGE_KEYS.TASK_TEMPLATE, null);

    let baseTasks = [];

    if (taskTemplate) {
      // Use manager-uploaded Excel tasks: Common + team-specific
      const commonTasks = taskTemplate['Common'] || [];
      const teamTasks = profile.team ? (taskTemplate[profile.team] || []) : [];
      baseTasks = [...commonTasks, ...teamTasks];
    } else {
      // Fallback: use onboarding.json + teamTasks.json
      onboardingData.forEach(dayPlan => {
        dayPlan.tasks.forEach(task => {
          baseTasks.push({ ...task, day: dayPlan.day, type: 'default' });
        });
      });
      if (profile.team && teamTasksData[profile.team]) {
        teamTasksData[profile.team].forEach(task => {
          baseTasks.push({ ...task, type: 'team' });
        });
      }
    }

    // Build a set of all valid task IDs
    const validIds = new Set(baseTasks.map(t => t.id));
    const currentTasks = getStorage(STORAGE_KEYS.TASKS, {});

    // Remove stale tasks that no longer exist
    const cleanedTasks = {};
    Object.keys(currentTasks).forEach(id => {
      if (validIds.has(id)) {
        cleanedTasks[id] = currentTasks[id];
      }
    });

    // Merge: keep existing status but sync all other fields
    let isUpdated = Object.keys(cleanedTasks).length !== Object.keys(currentTasks).length;
    baseTasks.forEach(task => {
      const existing = cleanedTasks[task.id];
      if (!existing) {
        cleanedTasks[task.id] = task;
        isUpdated = true;
      } else {
        const merged = { ...task, status: existing.status };
        if (JSON.stringify(existing) !== JSON.stringify(merged)) {
          cleanedTasks[task.id] = merged;
          isUpdated = true;
        }
      }
    });

    if (isUpdated) {
      setTasks(cleanedTasks);
      setStorage(STORAGE_KEYS.TASKS, cleanedTasks);
    } else {
      setTasks(cleanedTasks);
    }
  }, [profile]);

  const saveProfile = (newProfile) => {
    // Clear old task data when saving new profile so stale tasks are gone
    setStorage(STORAGE_KEYS.TASKS, {});
    setStorage(STORAGE_KEYS.CUSTOM_TASKS, []);
    setStorage(STORAGE_KEYS.NOTES, {});
    setTasks({});
    setCustomTasks([]);
    setNotes({});
    setProfile(newProfile);
    setStorage(STORAGE_KEYS.PROFILE, newProfile);
  };

  const resetProfile = () => {
    clearStorage();
    setProfile(null);
    setTasks({});
    setCustomTasks([]);
    setNotes({});
  };

  const toggleTask = (taskId) => {
    const updatedTasks = { ...tasks };
    if (updatedTasks[taskId]) {
      updatedTasks[taskId].status = updatedTasks[taskId].status === 'completed' ? 'pending' : 'completed';
      setTasks(updatedTasks);
      setStorage(STORAGE_KEYS.TASKS, updatedTasks);
    } else {
      // Check custom tasks
      const updatedCustomTasks = customTasks.map(t => {
        if (t.id === taskId) {
          return { ...t, status: t.status === 'completed' ? 'pending' : 'completed' };
        }
        return t;
      });
      setCustomTasks(updatedCustomTasks);
      setStorage(STORAGE_KEYS.CUSTOM_TASKS, updatedCustomTasks);
    }
  };

  const addCustomTask = (task) => {
    const newTask = {
      ...task,
      id: `custom_${Date.now()}`,
      status: 'pending',
      type: 'custom'
    };
    const updated = [...customTasks, newTask];
    setCustomTasks(updated);
    setStorage(STORAGE_KEYS.CUSTOM_TASKS, updated);
  };

  const saveNote = (taskId, note) => {
    const updatedNotes = { ...notes, [taskId]: note };
    setNotes(updatedNotes);
    setStorage(STORAGE_KEYS.NOTES, updatedNotes);
  };

  const deleteCustomTask = (taskId) => {
    const updated = customTasks.filter(t => t.id !== taskId);
    setCustomTasks(updated);
    setStorage(STORAGE_KEYS.CUSTOM_TASKS, updated);
  };

  const editCustomTask = (taskId, updatedData) => {
    const updated = customTasks.map(t => 
      t.id === taskId ? { ...t, ...updatedData } : t
    );
    setCustomTasks(updated);
    setStorage(STORAGE_KEYS.CUSTOM_TASKS, updated);
  };

  const allTasks = [...Object.values(tasks), ...customTasks];
  
  const currentDay = profile ? Math.max(1, Math.floor((new Date() - new Date(profile.joiningDate)) / (1000 * 60 * 60 * 24)) + 1) : 1;

  return {
    profile,
    saveProfile,
    resetProfile,
    tasks: allTasks,
    toggleTask,
    addCustomTask,
    deleteCustomTask,
    editCustomTask,
    notes,
    saveNote,
    currentDay
  };
};
