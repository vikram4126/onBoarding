const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Project directories based on script location
const SRC_DATA_DIR = path.join(__dirname, 'src', 'data');
const ONBOARDING_EXCEL = path.join(__dirname, 'KPMG_Onboarding_Tasks_Template.xlsx');
const BUDDY_EXCEL = path.join(__dirname, 'KPMG_Buddy_Tasks_Template.xlsx');

function readExcel(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Warning: ${filePath} not found, skipping.`);
    return null;
  }
  const wb = xlsx.readFile(filePath);
  const taskTemplate = {};

  wb.SheetNames.forEach(sheetName => {
    const ws = wb.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(ws, { defval: '' });

    if (rows.length === 0) return;

    const tasks = rows
      .filter(row => row.Day && row.Title)
      .map((row, idx) => ({
        id: `${sheetName.toLowerCase().replace(/\s+/g, '_')}_${String(row.Day).replace(/\s+/g, '')}_${idx}`,
        day: String(row.Day).trim(),
        title: String(row.Title).trim(),
        description: row.Description ? String(row.Description).trim() : '',
        category: row.Category ? String(row.Category).trim() : 'General',
        projectCode: row.ProjectCode ? String(row.ProjectCode).trim() : '',
        taskCode: row.TaskCode ? String(row.TaskCode).trim() : '',
        deadlineDay: row.DeadlineDay ? parseInt(row.DeadlineDay) : null,
        url: row.Link ? String(row.Link).trim() : '',
        contactId: row.ContactId ? String(row.ContactId).trim() : '',
        portalId: row.PortalId ? String(row.PortalId).trim() : '',
      }));

    if (tasks.length > 0) {
      taskTemplate[sheetName] = tasks;
    }
  });
  return taskTemplate;
}

// 1. Process Onboarding Template
const onboardingTemplate = readExcel(ONBOARDING_EXCEL);
if (onboardingTemplate) {
  const commonSheetName = onboardingTemplate['Common'] ? 'Common' : (onboardingTemplate['General'] ? 'General' : Object.keys(onboardingTemplate)[0]);
  const commonTasks = onboardingTemplate[commonSheetName] || [];

  const onboardingGrouped = {};
  commonTasks.forEach(task => {
    if (!onboardingGrouped[task.day]) {
      onboardingGrouped[task.day] = [];
    }
    const taskCopy = { ...task };
    delete taskCopy.day; // removed because it's at the group level
    onboardingGrouped[task.day].push(taskCopy);
  });

  const onboardingFinal = Object.keys(onboardingGrouped).map(day => ({
    day,
    tasks: onboardingGrouped[day]
  }));

  const onboardingJsonPath = path.join(SRC_DATA_DIR, 'onboarding.json');
  fs.writeFileSync(onboardingJsonPath, JSON.stringify(onboardingFinal, null, 2));
  console.log(`✅ Successfully updated ${onboardingJsonPath}`);

  const teamTasks = {};
  Object.keys(onboardingTemplate).forEach(sheet => {
    if (sheet !== commonSheetName) {
      teamTasks[sheet] = onboardingTemplate[sheet];
    }
  });

  if (Object.keys(teamTasks).length > 0) {
    const teamTasksJsonPath = path.join(SRC_DATA_DIR, 'teamTasks.json');
    fs.writeFileSync(teamTasksJsonPath, JSON.stringify(teamTasks, null, 2));
    console.log(`✅ Successfully updated ${teamTasksJsonPath}`);
  }
}

// 2. Process Buddy Template
const buddyTemplate = readExcel(BUDDY_EXCEL);
if (buddyTemplate) {
  const buddySheetName = Object.keys(buddyTemplate)[0];
  const buddyTasks = buddyTemplate[buddySheetName] || [];

  const buddyGrouped = {};
  buddyTasks.forEach(task => {
    if (!buddyGrouped[task.day]) {
      buddyGrouped[task.day] = [];
    }
    const taskCopy = { ...task };
    delete taskCopy.day;
    buddyGrouped[task.day].push(taskCopy);
  });

  const buddyFinal = Object.keys(buddyGrouped).map(day => ({
    day,
    tasks: buddyGrouped[day]
  }));

  const buddyJsonPath = path.join(SRC_DATA_DIR, 'buddyTasks.json');
  fs.writeFileSync(buddyJsonPath, JSON.stringify(buddyFinal, null, 2));
  console.log(`✅ Successfully updated ${buddyJsonPath}`);
}

console.log('\n🎉 Excel data has been successfully hardcoded into the JSON files in src/data/');
