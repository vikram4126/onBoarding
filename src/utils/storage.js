export const STORAGE_KEYS = {
  PROFILE: 'onboarding_profile',
  TASKS: 'onboarding_tasks',
  CUSTOM_TASKS: 'onboarding_custom_tasks',
  NOTES: 'onboarding_notes',
  MANAGER_EMPLOYEES: 'onboarding_manager_employees',
  HAS_SEEN_WELCOME: 'has_seen_welcome_popup',
  TASK_TEMPLATE: 'onboarding_task_template',
  BUDDY_TASKS: 'onboarding_buddy_tasks',
  BUDDY_EMPLOYEES: 'onboarding_buddy_employees',
  BUDDY_TASK_TEMPLATE: 'onboarding_buddy_task_template',
  LEADER_EMPLOYEES: 'onboarding_leader_employees',
  LEADER_DATA: 'onboarding_leader_data'
};

export const getStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return defaultValue;
  }
};

export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
};
