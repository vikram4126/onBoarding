// Calculate the number of working days between two dates, inclusive
export const getWorkingDaysDifference = (startDateStr, endDateStr) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  // Set times to midnight to avoid time zone issues
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (end < start) return 0;

  let count = 0;
  let current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count - 1; // 0 for the first working day, 1 for the second, etc.
};

export const getCurrentPeriod = (joiningDateStr) => {
  const diff = getWorkingDaysDifference(joiningDateStr, new Date().toISOString());

  if (diff < 0) return 'Day 1'; // Future join date? Fallback.
  if (diff === 0) return 'Day 1';
  if (diff === 1) return 'Day 2';
  
  if (diff >= 2 && diff <= 6) return 'Week 1';
  if (diff >= 7 && diff <= 11) return 'Week 2';
  if (diff >= 12 && diff <= 16) return 'Week 3';
  return 'Week 4';
};

export const getPeriodSortIndex = (periodStr) => {
  if (!periodStr) return 999;
  const str = String(periodStr).trim();
  
  if (str === 'Day 1') return 1;
  if (str === 'Day 2') return 2;
  if (str === 'Day 3') return 3;
  if (str === 'Week 1') return 4;
  if (str === 'Week 2') return 5;
  if (str === 'First Month') return 6;
  if (str === 'Second Month') return 7;
  if (str === 'Custom') return 999;

  // Fallback if integer passed
  const parsed = parseInt(str);
  if (!isNaN(parsed)) return parsed + 100; // Place older numeric days after our periods just in case

  // Extract number from "Day X" or "Week X" if it's not matched above
  if (str.startsWith('Day ')) {
    const dayNum = parseInt(str.replace('Day ', ''));
    if (!isNaN(dayNum)) return dayNum;
  }
  
  if (str.startsWith('Week ')) {
    const weekNum = parseInt(str.replace('Week ', ''));
    if (!isNaN(weekNum)) return weekNum + 50; // weeks come after days
  }

  return 999;
};
