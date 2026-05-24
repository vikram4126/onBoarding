export const STORAGE_KEYS = {
  PROFILE: 'onboarding_profile',
  TASKS: 'onboarding_tasks',
  CUSTOM_TASKS: 'onboarding_custom_tasks',
  NOTES: 'onboarding_notes',
  MANAGER_EMPLOYEES: 'onboarding_manager_employees'
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
