const fs = require('fs');

// 1. Get new rows
const onboardingData = JSON.parse(fs.readFileSync('./src/data/onboarding.json', 'utf8'));
let rows = [];
onboardingData.forEach(day => {
  day.tasks.forEach(task => {
    rows.push(`    { Day: '${day.day}', Title: '${task.title.replace(/'/g, "\\'")}', Description: '${(task.description || '').replace(/'/g, "\\'")}', Category: '${task.category || 'General'}', Link: '${task.url || ''}', ProjectCode: '', TaskCode: '', DeadlineDay: '', ContactId: '${task.contactId || ''}', PortalId: '${task.portalId || ''}' }`);
  });
});
const newCommonArrayStr = `  Common: [\n${rows.join(',\n')}\n  ],`;

// 2. Read TaskManager.jsx
let content = fs.readFileSync('./src/components/TaskManager.jsx', 'utf8');

// Replace COLUMNS
content = content.replace(
  "const COLUMNS = ['Day', 'Title', 'Description', 'Category', 'Link', 'ProjectCode', 'TaskCode', 'DeadlineDay', 'ContactId'];",
  "const COLUMNS = ['Day', 'Title', 'Description', 'Category', 'Link', 'ProjectCode', 'TaskCode', 'DeadlineDay', 'ContactId', 'PortalId'];"
);

// Replace handleFileUpload mapping
content = content.replace(
  "contactId: row.ContactId ? String(row.ContactId).trim() : '',",
  "contactId: row.ContactId ? String(row.ContactId).trim() : '',\n              portalId: row.PortalId ? String(row.PortalId).trim() : '',"
);

// Replace Common array inside SAMPLE_DATA
// It starts with `  Common: [` and ends with `  ],` before `  Development: [`
const commonRegex = /Common:\s*\[[\s\S]*?\],\s*Development:/;
content = content.replace(commonRegex, `${newCommonArrayStr}\n  Development:`);

// Write back
fs.writeFileSync('./src/components/TaskManager.jsx', content);
console.log('Updated TaskManager.jsx');
